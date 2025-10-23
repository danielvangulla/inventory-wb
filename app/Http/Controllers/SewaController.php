<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\Sign;
use App\Models\Rekening;
use App\Models\TenantBook;
use App\Models\InvoiceSewa;
use App\Models\Kuitansi;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SewaController extends Controller
{
    public function showSewa($uuid)
    {
        $invoice = InvoiceSewa::with('rekening')
            ->with('tenantBook')
            ->with('tenantBook.tenant')
            ->with('sign')
            ->where('uuid', $uuid)
            ->firstOrFail();

        return inertia('Invoices/sewa/show', [
            'invoice' => $invoice,
        ]);
    }

    public function getNoInvoice($isDp)
    {
        $kode = "CS";
        if ($isDp != 0) $kode = "INV";

        $invoices = InvoiceSewa::select('no')->where('no', 'like', "%$kode%")->get();
        $invoiceNumbers = $invoices->pluck('no')->toArray();

        return response()->json($invoiceNumbers);
    }

    private function indexData()
    {
        $rekening = Rekening::all();
        $signs = Sign::all();

        $tenantBooks = TenantBook::allDatas()
            ->with('payments')
            ->with('payments.paymentDp')
            ->with('payments.paymentSewa')
            ->with('payments.deposits')
            ->select('id', 'nama_toko', 'perusahaan')
            ->get();

        $invoices = InvoiceSewa::with('tenantBook')
            ->with('tenantBook.tenant')
            ->with('tenantBook.payments.deposits')
            ->with('rekening')
            ->with('sign')
            ->orderBy('created_at', 'desc')
            ->get();

        foreach ($invoices as $invoice) {
            $invoice->kuitansi = Kuitansi::with('sign')
                ->where('tenant_book_id', $invoice->tenant_book_id)
                ->where('invoice_id', $invoice->id)
                ->where('invoice_no', $invoice->no)
                ->first();
        }

        $cities = City::all();

        return [
            'username' => Auth::user()->name,
            'rekening' => $rekening,
            'signs' => $signs,
            'cities' => $cities,
            'tenantBooks' => $tenantBooks,
            'invoices' => $invoices,
        ];
    }

    public function index()
    {
        return inertia('Invoices/sewa/Index', $this->indexData());
    }

    public function store(Request $r)
    {
        $r->validate([
            'tenant_book_id' => 'required|integer|exists:tenant_books,id',
            'rekening_id' => 'required|integer|exists:rekenings,id',
            'sign_id' => 'required|integer|exists:signs,id',
            'no' => 'required|string|max:50',
            'tgl' => 'required|date',
            'due' => 'required|date',
            'keterangan' => 'required|string|max:255',
            'jumlah' => 'required|numeric|min:0',
            'diskon_ket' => 'nullable|string|max:255',
            'diskon_jumlah' => 'nullable|numeric|min:0',
            'biaya_ket' => 'nullable|string|max:255',
            'biaya_jumlah' => 'nullable|numeric|min:0',
            'omset' => 'nullable|numeric|min:0',
            'share_persen' => 'nullable|numeric|min:0',
            'subtotal' => 'required|numeric|min:0',
            'ppn_persen' => 'nullable|numeric|min:0',
            'ppn_jumlah' => 'nullable|numeric|min:0',
            'materai' => 'nullable|numeric|min:0',
            'total' => 'required|numeric|min:0',
            'terbilang' => 'required|string|max:255',
        ]);

        try {
            InvoiceSewa::create([
                'tenant_book_id' => $r->tenant_book_id,
                'rekening_id' => $r->rekening_id,
                'sign_id' => $r->sign_id,
                'uuid' => Str::uuid(),
                'no' => $r->no,
                'tgl' => $r->tgl,
                'due' => $r->due,
                'keterangan' => $r->keterangan,
                'curr' => $r->curr ?? 'IDR',
                'jumlah' => $r->jumlah,
                'diskon_ket' => $r->diskon_ket ?? '',
                'diskon_jumlah' => $r->diskon_jumlah ?? 0,
                'biaya_ket' => $r->biaya_ket ?? '',
                'biaya_jumlah' => $r->biaya_jumlah ?? 0,
                'omset' => $r->omset ?? 0,
                'share_persen' => $r->share_persen ?? 0,
                'subtotal' => $r->subtotal,
                'ppn_persen' => $r->ppn_persen ?? 0,
                'ppn_jumlah' => $r->ppn_jumlah ?? 0,
                'materai' => $r->materai ?? 0,
                'total' => $r->total,
                'terbilang' => $r->terbilang,
                'is_dp' => $r->is_dp ?? 0,
            ]);

            return inertia('Invoices/sewa/Index', $this->indexData())
                ->with('msg', __('Sewa invoice saved successfully'));
        } catch (\Exception $e) {
            return redirect()->route('invoice.sewa')->withErrors([
                __('Error saving payment data'),
                $e->getMessage(),
            ]);
        }
    }

    public function destroy($id)
    {
        $invoice = InvoiceSewa::where('id', $id)->firstOrFail();

        Kuitansi::where('invoice_no', $invoice->no)->forceDelete();

        $invoice->delete();

        return inertia('Invoices/sewa/Index', $this->indexData())
            ->with('msg', __('Sewa invoice cancelled successfully'));
    }
}
