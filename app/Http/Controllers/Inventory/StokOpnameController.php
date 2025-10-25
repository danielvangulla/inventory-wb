<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Barang;
use App\Models\Opname;
use App\Models\OpnameDet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StokOpnameController extends Controller
{
    protected $view = 'Inventory/StokOpname';
    protected $route = 'inventory.stok-opname';

    protected $user;
    protected $level;

    public function __construct()
    {
        $this->user = Auth::user();
        $this->level = $this->user ? $this->user->level : null;

        if (!($this->user && $this->level && $this->level->menu_read)) {
            abort(403, 'Akses tidak diizinkan.');
        }
    }

    private function checkAuth()
    {
        return $this->user && $this->level && ($this->level->is_admin || $this->level->menu_write);
    }

    private function accessDenied()
    {
        return redirect()->route("$this->route.index");
    }

    public function index()
    {
        $data = Opname::with('user', 'details.barang')->get();

        return inertia("$this->view/Index", [
            'data' => $data,
            'canWrite' => $this->checkAuth(),
        ]);
    }

    public function create()
    {
        if (!$this->checkAuth()) {
            return $this->accessDenied();
        }

        $barangs = Barang::all();

        return inertia("$this->view/Create", [
            'barangs' => $barangs,
            'canWrite' => $this->checkAuth(),
        ]);
    }

    public function store(Request $request)
    {
        if (!$this->checkAuth()) {
            return $this->accessDenied();
        }

        $validated = $request->validate([
            'tgl' => 'required|date',
            'catatan' => 'nullable|string',
            'total' => 'required|numeric',
            'details' => 'required|array',
            'details.*.barang_id' => 'required|integer|exists:barangs,id',
            'details.*.harga' => 'required|numeric',
            'details.*.qty_sistem' => 'required|numeric',
            'details.*.qty_fisik' => 'required|numeric',
            'details.*.qty_selisih' => 'required|numeric',
            'details.*.selisih_rp' => 'required|numeric',
        ]);

        $validated['user_id'] = $this->user->id;
        $opname = Opname::create($validated);

        foreach ($validated['details'] as $detail) {
            OpnameDet::create([
                'opname_id' => $opname->id,
                'barang_id' => $detail['barang_id'],
                'harga' => $detail['harga'],
                'qty_sistem' => $detail['qty_sistem'],
                'qty_fisik' => $detail['qty_fisik'],
                'qty_selisih' => $detail['qty_selisih'],
                'selisih_rp' => $detail['selisih_rp'],
            ]);

            // Optionally, update the stock of the barang here if needed
            $barang = Barang::find($detail['barang_id']);
            if ($barang) {
                $barang->stok += $detail['qty_selisih'];
                $barang->save();
            }

        }

        return redirect()->route("$this->route.index")->with('success', 'Stok opname berhasil disimpan.');
    }

    public function destroy($id)
    {
        if (!$this->checkAuth()) {
            return $this->accessDenied();
        }

        $opname = Opname::findOrFail($id);

        foreach ($opname->details as $detail) {
            // Optionally, revert the stock of the barang here if needed
            $barang = Barang::find($detail->barang_id);
            if ($barang) {
                $barang->stok -= $detail->qty_selisih;
                $barang->save();
            }

            $detail->delete();
        }

        $opname->delete();

        return redirect()->route("$this->route.index")->with('success', 'Stok opname berhasil dihapus.');
    }
}
