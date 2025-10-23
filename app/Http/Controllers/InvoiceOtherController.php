<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\InvoiceOther;
use App\Models\InvoiceOtherDetail;
use App\Models\InvoiceOtherType;
use App\Models\InvoiceSewa;
use App\Models\Kuitansi;
use App\Models\Rekening;
use App\Models\Sign;
use App\Models\TenantBook;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class InvoiceOtherController extends Controller
{
    public function getNoInvoice($tipeId)
    {
        $invType = InvoiceOtherType::findOrFail($tipeId);
        $tipe = $invType->tipe;

        $invoices = InvoiceSewa::select('no')->where('invoice_other_type_id', $tipe)->get();
        $invoiceNumbers = $invoices->pluck('no')->toArray();

        return response()->json($invoiceNumbers);
    }

    public function showOthers($uuid)
    {
        $invoice = InvoiceOther::with('rekening')
            ->with('tenantBook')
            ->with('tenantBook.tenant')
            ->with('sign')
            ->with('details')
            ->where('uuid', $uuid)
            ->firstOrFail();

        return Inertia('Invoices/others/show', [
            'invoice' => $invoice,
        ]);
    }

    private function indexData()
    {
        $rekening = Rekening::all();
        $signs = Sign::all();
        $tipe = InvoiceOtherType::all();

        $tenantBooks = TenantBook::allDatas()
            ->with('payments')
            ->with('payments.paymentDp')
            ->with('payments.paymentSewa')
            ->with('payments.deposits')
            ->select('id', 'nama_toko', 'perusahaan')
            ->get();

        $invoices = InvoiceOther::with('tenantBook')
            ->with('tenantBook.tenant')
            ->with('rekening')
            ->with('sign')
            ->with('details')
            ->with('type')
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
            'tipe' => $tipe,
            'cities' => $cities,
            'tenantBooks' => $tenantBooks,
            'invoices' => $invoices,
        ];
    }

    public function index()
    {
        return inertia('Invoices/others/index', $this->indexData());
    }

    public function store(Request $r)
    {
        $r->validate([
            'tenant_book_id' => 'integer',
            'tenant_nama' => 'required|string|max:255',
            'rekening_id' => 'required|integer|exists:rekenings,id',
            'sign_id' => 'required|integer|exists:signs,id',
            'no' => 'required|string|max:50',
            'tgl' => 'required|date',
            'due' => 'required|date',
            'curr' => 'nullable|string|max:3',
            'keterangan' => 'nullable|string|max:255',
            'jumlah' => 'required|numeric|min:0',
            'subtotal' => 'required|numeric|min:0',
            'ppn_persen' => 'nullable|numeric|min:0',
            'ppn_jumlah' => 'nullable|numeric|min:0',
            'materai' => 'nullable|numeric|min:0',
            'total' => 'required|numeric|min:0',
            'terbilang' => 'required|string|max:255',
        ]);

        try {
            $invoiceOther = InvoiceOther::create([
                'tenant_book_id' => $r->tenant_book_id,
                'invoice_other_type_id' => $r->invoice_other_type_id,
                'tenant_nama' => $r->tenant_nama,
                'rekening_id' => $r->rekening_id,
                'sign_id' => $r->sign_id,
                'uuid' => Str::uuid(),
                'no' => $r->no,
                'tgl' => $r->tgl,
                'due' => $r->due,
                'curr' => $r->curr ?? 'IDR',
                'keterangan' => $r->keterangan,
                'jumlah' => $r->jumlah,
                'subtotal' => $r->subtotal,
                'ppn_persen' => $r->ppn_persen ?? 0,
                'ppn_jumlah' => $r->ppn_jumlah ?? 0,
                'materai' => $r->materai ?? 0,
                'total' => $r->total,
                'terbilang' => $r->terbilang,
            ]);

            foreach ($r->details as $v) {
                $v = (object) $v;
                InvoiceOtherDetail::create([
                    'invoice_other_id' => $invoiceOther->id,
                    'keterangan' => $v->keterangan,
                    'jumlah' => $v->jumlah,
                ]);
            }

            return inertia('Invoices/others/index', $this->indexData())
                ->with('msg', __('Sewa invoice saved successfully'));
        } catch (\Exception $e) {

            return response()->json([
                'message' => __('Error saving payment data'),
                'error' => $e->getMessage(),
            ]);
            return redirect()->route('Invoice.others')->withErrors([
                __('Error saving payment data'),
                $e->getMessage(),
            ]);
        }
    }


    public function destroy($id)
    {
        $invoice = InvoiceOther::where('id', $id)->firstOrFail();

        Kuitansi::where('invoice_no', $invoice->no)->forceDelete();

        $invoice->delete();

        return inertia('Invoices/others/index', $this->indexData());
    }
}
