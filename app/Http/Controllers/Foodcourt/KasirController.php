<?php

namespace App\Http\Controllers\Foodcourt;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use App\Models\Transaksi;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class KasirController extends Controller
{
    protected $view = 'Foodcourt/Kasir';
    protected $route = 'foodcourt.kasir';

    protected $user;
    protected $level;

    public function __construct()
    {
        $this->user = Auth::user();
        $this->level = $this->user->level ?? null;

        if (!$this->checkAuth()) {
            abort(403, 'Akses tidak diizinkan.');
        }
    }

    private function checkAuth()
    {
        return $this->user && $this->level && ($this->level->spv || $this->level->is_admin);
    }

    private function accessDenied()
    {
        return redirect()->route("$this->route.index");
    }

    public function history()
    {
        $transaksi = Transaksi::with('user:id,name')
            ->with('uservoid:id,name')
            ->with('items', function ($query) {
                $query->withTrashed();
            })
            ->withTrashed()
            ->orderBy('id', 'desc')
            ->limit(50)
            ->get();

        return inertia("$this->view/History", [
            'transaksi' => $transaksi
        ]);
    }

    public function void($id)
    {
        if (!$this->checkAuth()) {
            return $this->accessDenied();
        }

        $transaksi = Transaksi::find($id);

        if (!$transaksi) {
            return response()->json(['message' => 'Transaksi tidak ditemukan.'], 404);
        }

        $transaksi->void_count += 1;
        $transaksi->user_void_id = $this->user->id;
        $transaksi->save();

        $transaksi->items()->each(function ($item) {
            $item->delete();
        });

        $transaksi->delete();

        return response()->json([
            'message' => 'Void berhasil.',
            'void_count' => $transaksi->void_count,
            'uservoid' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
            ],
            'items' => $transaksi->items()->withTrashed()->get(),
        ]);
    }

    public function cancelVoid($id)
    {
        if (!$this->checkAuth()) {
            return $this->accessDenied();
        }

        $transaksi = Transaksi::withTrashed()->find($id);

        if (!$transaksi) {
            return response()->json(['message' => 'Transaksi tidak ditemukan.'], 404);
        }

        $transaksi->items()->withTrashed()->each(function ($item) {
            $item->restore();
        });

        $transaksi->user_void_id = 0;
        $transaksi->restore();

        return response()->json([
            'message' => 'Cancel Void berhasil.',
            'deleted_at' => $transaksi->deleted_at,
        ]);
    }

    public function index()
    {
        $user = Auth::user();
        $nama = $user ? $user->name : 'Guest';

        $menu = Menu::with('kategorisub')
            ->with('tenant')
            ->orderBy('kategorisub_id')
            ->orderBy('tenant_id')
            ->orderBy('alias')
            ->get();

        return inertia("$this->view/Index", [
            'nama' => $nama,
            'menu' => $menu,
        ]);
    }

    public function payment(Request $r)
    {
        try {
            $valid = $r->validate([
                'brutto' => 'required|numeric',
                'disc' => 'required|numeric',
                'netto' => 'required|numeric',
                'tax' => 'required|numeric',
                'service' => 'required|numeric',
                'card_charge' => 'required|numeric',
                'total' => 'required|numeric',
                'jenis_bayar' => 'required|string',
                'channel_bayar' => 'nullable|string',
                'uang_cash' => 'nullable|numeric',
                'kembalian' => 'nullable|numeric',
                'card_no' => 'nullable|string',
                'items' => 'required|array',
                'items.*.menu_id' => 'required|integer',
                'items.*.alias' => 'required|string',
                'items.*.harga' => 'required|numeric',
                'items.*.qty' => 'required|integer',
                'items.*.brutto' => 'required|numeric',
                'items.*.disc' => 'required|numeric',
                'items.*.netto' => 'required|numeric',
                'items.*.tax' => 'required|numeric',
                'items.*.service' => 'required|numeric',
                'items.*.total' => 'required|numeric',
            ]);

            $transaksi = [
                'tgl' => Date('Y-m-d H:i:s'),
                'user_id' => Auth::id(),
                'brutto' => $valid['brutto'],
                'disc' => $valid['disc'],
                'netto' => $valid['netto'],
                'tax' => $valid['tax'],
                'service' => $valid['service'],
                'card_charge' => $valid['card_charge'],
                'total' => $valid['total'],
                'jenis_bayar' => $valid['jenis_bayar'],
                'channel_bayar' => $valid['channel_bayar'] ?? null,
                'uang_cash' => $valid['uang_cash'] ?? null,
                'kembalian' => $valid['kembalian'] ?? null,
                'card_no' => $valid['card_no'] ?? null,
            ];

            $trx = Transaksi::create($transaksi);

            $trxCode = $trx->id > 9 ? $trx->id : str_pad($trx->id, 2, '0', STR_PAD_LEFT);
            $orderCode = 'PS' . date('md') . $trxCode . rand(10, 99);

            $trx->order_code = $orderCode;

            foreach ($valid['items'] as $v) {
                $v['transaksi_id'] = $trx->id;
                $v['order_code'] = $orderCode;
                $trx->items()->create($v);
            }

            $payload = $this->printReceipt($trx);

            return response()->json([
                'message' => 'Pembayaran berhasil.. Terima kasih..',
                'data' => $payload,
            ], 201);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Terjadi kesalahan saat memproses pembayaran.. Hubungi SPV untuk informasi lebih lanjut..!',
                'error' => $th->getMessage(),
            ], 200);
        }
    }

    protected function printReceipt(Transaksi $trx)
    {
        $orderCode = $trx->order_code;

        foreach ($trx->items as $item) {
            if ($orderCode == null) {
                $orderCode = $item->order_code;
                break;
            }
        }

        $items = $trx->items()->get()->map(function ($item) {
            return [
                'menu_id' => $item->menu_id,
                'order_code' => $item->order_code,
                'name' => $item->alias,
                'qty' => $item->qty,
                'price' => $item->netto / $item->qty,
                'subtotal' => $item->netto,
            ];
        })->toArray();

        $cardNo = $trx->card_no;

        if ($trx->jenis_bayar === 'card' && !empty($trx->card_no)) {
            $stars = str_repeat('*', max(0, strlen($trx->card_no) - 4));
            $cardNo = $stars . substr($trx->card_no, -4);
        }

        if ($trx->jenis_bayar === 'qris') {
            $stars = "*****";
            $hpLength = strlen($trx->card_no);

            $cardNo = substr($trx->card_no, 0, -8) . $stars;
            $cardNoLength = strlen($cardNo);

            $restLength = $hpLength - $cardNoLength;
            if ($restLength > 0) {
                $cardNo .= substr($trx->card_no, -$restLength);
            }
        }

        $payload = [
            'data' => [
                'items' => $items,
                'meta' => [
                    'order_code' => $orderCode,
                    'date'       => $trx->tgl,
                    'kasir'    => $trx->user->name ?? 'Kasir',
                ],
                'totals' => [
                    'subtotal'    => $trx->netto,
                    'tax'         => $trx->tax,
                    'service'     => $trx->service,
                    'discount'    => $trx->disc,
                    'grand_total' => $trx->total,
                ],
                'payment' => [
                    'jenis_bayar'  => $trx->jenis_bayar,
                    'channel_bayar' => $trx->channel_bayar,
                    'uang_cash'    => $trx->uang_cash,
                    'kembalian'    => $trx->kembalian,
                    'card_charge'  => $trx->card_charge,
                    'card_no'      => $cardNo ?? '-',
                ],
                // 'logo_path' => storage_path('app/public/logo.png'),
            ]
        ];

        return $payload;
    }

    public function reprintReceipt(Request $r)
    {
        $r->validate([
            'transaksi_id' => 'required|integer|exists:transaksis,id',
        ]);

        $trx = Transaksi::with('user')->find($r->transaksi_id);

        if (!$trx) {
            return response()->json([
                'message' => 'Transaksi tidak ditemukan.',
            ], 404);
        }

        $payload = $this->printReceipt($trx);

        return response()->json([
            'data' => $payload,
        ]);
    }
}
