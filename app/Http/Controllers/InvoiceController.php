<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\InvoiceAir;
use App\Models\InvoiceAirDetail;
use App\Models\InvoiceListrik;
use App\Models\InvoiceService;
use App\Models\Kuitansi;
use App\Models\Notes;
use App\Models\Rekening;
use App\Models\Setup;
use App\Models\Sign;
use App\Models\TenantBook;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Illuminate\Support\Str;

class InvoiceController extends Controller
{
    private function getPdfHeader() {
        $pdfHeader = Setup::where('key', 'like', 'pdf_header%')->get();
        return $pdfHeader->pluck('val')->toArray();
    }

    public function getInvoiceNotes() {
        $invoiceNotes = Notes::where('tipe', 0)->select(['isi'])->orderBy('urutan')->get();
        $invoiceNotes = $invoiceNotes->pluck('isi')->toArray();

        return response()->json([
            'pdfHeader' => $this->getPdfHeader(),
            'invoiceNotes' => $invoiceNotes,
        ]);
    }

    public function getDepositNotes() {
        $invoiceNotes = Notes::where('tipe', 1)->select(['isi'])->orderBy('urutan')->get();
        $invoiceNotes = $invoiceNotes->pluck('isi')->toArray();

        return response()->json([
            'pdfHeader' => $this->getPdfHeader(),
            'invoiceNotes' => $invoiceNotes,
        ]);
    }

    /*********************************************************************************************/
    /*********************************** INVOICE LISTRIK *****************************************/

    public function getNoInvoiceListrik() {
        $invoiceListrik = InvoiceListrik::select('no')->get();
        $invoiceNumbers = $invoiceListrik->pluck('no')->toArray();

        return response()->json($invoiceNumbers);
    }

    public function showListrik($uuid)
    {
        $invoice = InvoiceListrik::with('rekening')
            ->with('sign')
            ->with('meterListrik')
            ->with('meterListrik.tenantBook')
            ->with('meterListrik.tenantBook.tenant')
            ->where('uuid', $uuid)
            ->firstOrFail();

        return Inertia::render('Invoices/listrik/show', [
            'invoice' => $invoice,
        ]);
    }

    private function indexListrikData()
    {
        $rekening = Rekening::all();
        $signs = Sign::all();

        $tenantBooks = TenantBook::allDatas()
            ->with('meterListrik')
            ->select('id', 'nama_toko', 'perusahaan')
            ->get();

        $invoices = InvoiceListrik::with('rekening')
            ->with('sign')
            ->with('meterListrik')
            ->with('meterListrik.tenantBook')
            ->with('meterListrik.tenantBook.tenant')
            ->orderBy('created_at', 'desc')
            ->get();

        foreach ($invoices as $invoice) {
            $invoice->kuitansi = Kuitansi::with('sign')
                ->where('tenant_book_id', $invoice->meterListrik->tenant_book_id)
                ->where('jenis', 'listrik')
                ->where('invoice_id', $invoice->id)
                ->where('invoice_no', $invoice->no)
                ->first();
        }

        $cities = City::all();

        return [
            'username' => Auth::user()->name,
            'rekening' => $rekening,
            'signs' => $signs,
            'tenantBooks' => $tenantBooks,
            'invoices' => $invoices,
            'cities' => $cities,
        ];
    }

    public function indexListrik()
    {
        return inertia('Invoices/listrik/index', $this->indexListrikData());
    }

    public function storeListrik(Request $r)
    {
        $validator = Validator::make($r->all(), [
            'meter_listrik_id' => 'required|integer|exists:meter_listriks,id',
            'rekening_id' => 'required|integer|exists:rekenings,id',
            'sign_id' => 'required|integer|exists:signs,id',
            'keterangan' => 'required|string|max:255',
            'no' => 'required|string|max:50',
            'tgl' => 'required|date',
            'due' => 'required|date',
            'pemakaian' => 'required|numeric|min:0',
            'tarif' => 'required|numeric|min:0',
            'subtotal' => 'required|numeric|min:0',
            'biaya_admin' => 'nullable|numeric|min:0',
            'biaya_lain' => 'nullable|numeric|min:0',
            'denda' => 'nullable|numeric|min:0',
            'selisih_bayar' => 'nullable|numeric|min:0',
            'total' => 'required|numeric|min:0',
            'ppn_persen' => 'nullable|numeric|min:0',
            'ppn_jumlah' => 'nullable|numeric|min:0',
            'materai' => 'nullable|numeric|min:0',
            'tagihan' => 'required|numeric|min:0',
            'terbilang' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return Inertia::render('Invoices/listrik/index', [
                'message' => __('Error saving payment data'),
                'error' => $validator->errors()->all(),
            ]);
        }

        try {
            InvoiceListrik::create([
                'meter_listrik_id' => $r->meter_listrik_id,
                'rekening_id' => $r->rekening_id,
                'sign_id' => $r->sign_id,
                'uuid' => Str::uuid(),
                'keterangan' => $r->keterangan,
                'no' => $r->no,
                'tgl' => $r->tgl,
                'due' => $r->due,
                'curr' => $r->curr ?? 'IDR',
                'pemakaian' => $r->pemakaian,
                'tarif' => $r->tarif,
                'subtotal' => $r->subtotal,
                'ppj_persen' => $r->ppj_persen,
                'ppj_jumlah' => $r->ppj_jumlah,
                'genset_persen' => $r->genset_persen,
                'genset_jumlah' => $r->genset_jumlah,
                'biaya_admin' => $r->biaya_admin ?? 0,
                'biaya_lain' => $r->biaya_lain ?? 0,
                'denda' => $r->denda ?? 0,
                'selisih_bayar' => $r->selisih_bayar ?? 0,
                'total' => $r->total,
                'ppn_persen' => $r->ppn_persen ?? 0,
                'ppn_jumlah' => $r->ppn_jumlah ?? 0,
                'materai' => $r->materai ?? 0,
                'tagihan' => $r->tagihan,
                'terbilang' => $r->terbilang,
            ]);

            return inertia('Invoices/listrik/index', $this->indexListrikData());

        } catch (\Exception $e) {
            return redirect()->route('invoice.listrik')->withErrors([
                __('Error saving payment data'),
                $e->getMessage(),
            ]);
        }
    }

    // destroyListrik
    public function destroyListrik($id)
    {
        $invoice = InvoiceListrik::where('id', $id)->firstOrFail();

        Kuitansi::where('invoice_no', $invoice->no)->forceDelete();

        $invoice->delete();

        return inertia('Invoices/listrik/index', $this->indexListrikData());
    }

    /*********************************** INVOICE LISTRIK *****************************************/
    /*********************************************************************************************/



    /*********************************************************************************************/
    /*********************************** INVOICE AIR *********************************************/
    public function getNoInvoiceAir() {
        $invoiceAir = InvoiceAir::select('no')->get();
        $invoiceNumbers = $invoiceAir->pluck('no')->toArray();

        return response()->json($invoiceNumbers);
    }

    public function showAir($uuid)
    {
        $invoice = InvoiceAir::with('rekening')
            ->with('sign')
            ->with('meterAir')
            ->with('meterAir.tenantBook')
            ->with('meterAir.tenantBook.tenant')
            ->with('AirInvoiceDetails')
            ->where('uuid', $uuid)
            ->firstOrFail();

        return Inertia::render('Invoices/air/show', [
            'invoice' => $invoice,
        ]);
    }

    private function indexAirData()
    {
        $rekening = Rekening::all();
        $signs = Sign::all();
        $tarifAir = Setup::where('key', 'like', 'tarif_air%')->get();
        $tarifs = $tarifAir->pluck('val', 'key')->toArray();

        $tenantBooks = TenantBook::allDatas()
            ->with('meterAir')
            ->select('id', 'nama_toko', 'perusahaan')
            ->get();

        $invoices = InvoiceAir::with('rekening')
            ->with('sign')
            ->with('meterAir')
            ->with('meterAir.tenantBook')
            ->with('meterAir.tenantBook.tenant')
            ->with('AirInvoiceDetails')
            ->orderBy('created_at', 'desc')
            ->get();

        foreach ($invoices as $invoice) {
            $invoice->kuitansi = Kuitansi::with('sign')
                ->where('tenant_book_id', $invoice->meterAir->tenant_book_id)
                ->where('jenis', 'air')
                ->where('invoice_id', $invoice->id)
                ->where('invoice_no', $invoice->no)
                ->first();
        }

        $cities = City::all();

        return [
            'username' => Auth::user()->name,
            'rekening' => $rekening,
            'signs' => $signs,
            'tarifs' => $tarifs,
            'tenantBooks' => $tenantBooks,
            'invoices' => $invoices,
            'cities' => $cities,
        ];
    }

    public function indexAir()
    {
        return inertia('Invoices/air/index', $this->indexAirData());
    }

    public function storeAir(Request $r)
    {
        $validator = Validator::make($r->all(), [
            'meter_air_id' => 'required|integer|exists:meter_airs,id',
            'rekening_id' => 'required|integer|exists:rekenings,id',
            'sign_id' => 'required|integer|exists:signs,id',
            'keterangan' => 'required|string|max:255',
            'no' => 'required|string|max:50',
            'tgl' => 'required|date',
            'due' => 'required|date',
            'pemakaian' => 'required|numeric|min:0',
            'subtotal' => 'required|numeric|min:0',
            'biaya_admin' => 'nullable|numeric|min:0',
            'biaya_lain' => 'nullable|numeric|min:0',
            'denda' => 'nullable|numeric|min:0',
            'selisih_bayar' => 'nullable|numeric|min:0',
            'total' => 'required|numeric|min:0',
            'ppn_persen' => 'nullable|numeric|min:0',
            'ppn_jumlah' => 'nullable|numeric|min:0',
            'materai' => 'nullable|numeric|min:0',
            'tagihan' => 'required|numeric|min:0',
            'terbilang' => 'required|string|max:255',
            'air_invoice_details' => 'required|array',
        ]);

        if ($validator->fails()) {
            return Inertia::render('Invoices/air/index', [
                'message' => __('Error saving payment data'),
                'error' => $validator->errors()->all(),
            ]);
        }

        try {
            $invoiceAir = InvoiceAir::create([
                'meter_air_id' => $r->meter_air_id,
                'rekening_id' => $r->rekening_id,
                'sign_id' => $r->sign_id,
                'uuid' => Str::uuid(),
                'keterangan' => $r->keterangan,
                'no' => $r->no,
                'tgl' => $r->tgl,
                'due' => $r->due,
                'curr' => $r->curr ?? 'IDR',
                'pemakaian' => $r->pemakaian,
                'subtotal' => $r->subtotal,
                'biaya_admin' => $r->biaya_admin ?? 0,
                'biaya_lain' => $r->biaya_lain ?? 0,
                'denda' => $r->denda ?? 0,
                'selisih_bayar' => $r->selisih_bayar ?? 0,
                'total' => $r->total,
                'ppn_persen' => $r->ppn_persen ?? 0,
                'ppn_jumlah' => $r->ppn_jumlah ?? 0,
                'materai' => $r->materai ?? 0,
                'tagihan' => $r->tagihan,
                'terbilang' => $r->terbilang,
            ]);

            // Save air invoice details
            foreach ($r->air_invoice_details as $detail) {
                InvoiceAirDetail::create([
                    'invoice_air_id' => $invoiceAir->id,
                    'ket' => $detail['ket'],
                    'tarif' => $detail['tarif'],
                    'volume' => $detail['volume'],
                    'jumlah' => $detail['jumlah'],
                ]);
            }

            return inertia('Invoices/air/index', $this->indexAirData());

        } catch (\Exception $e) {
            return redirect()->route('invoice.air')->withErrors([
                __('Error saving payment data'),
                $e->getMessage(),
            ]);
        }
    }

    // destroyAir
    public function destroyAir($id)
    {
        $invoice = InvoiceAir::where('id', $id)->firstOrFail();

        Kuitansi::where('invoice_no', $invoice->no)->forceDelete();

        $invoice->delete();

        return inertia::render('Invoices/air/index', $this->indexAirData());
    }

    /*********************************** INVOICE AIR *********************************************/
    /*********************************************************************************************/


    /*********************************************************************************************/
    /*********************************** INVOICE SERVICE *****************************************/
    public function getNoInvoiceService() {
        $invoiceService = InvoiceService::select('no')->get();
        $invoiceNumbers = $invoiceService->pluck('no')->toArray();

        return response()->json($invoiceNumbers);
    }

    public function showService($uuid)
    {
        $invoice = InvoiceService::with('rekening')
            ->with('sign')
            ->where('uuid', $uuid)
            ->firstOrFail();

        return Inertia::render('Invoices/service/show', [
            'invoice' => $invoice,
        ]);
    }

    private function indexServiceData()
    {
        $rekening = Rekening::all();
        $signs = Sign::all();

        $tenantBooks = TenantBook::allDatas()
            ->with(['tenant', 'tenantBookDetails'])
            ->with(['payments' => function ($query) {
                $query->with('paymentDp');
            }])
            ->get();

        $invoices = InvoiceService::with('rekening')
            ->with('sign')
            ->with('tenantBook')
            ->orderBy('created_at', 'desc')
            ->get();

        foreach ($invoices as $invoice) {
            $invoice->kuitansi = Kuitansi::with('sign')
                ->where('tenant_book_id', $invoice->tenant_book_id)
                ->where('jenis', 'service')
                ->where('invoice_id', $invoice->id)
                ->where('invoice_no', $invoice->no)
                ->first();
        }

        $cities = City::all();

        return [
            'username' => Auth::user()->name,
            'rekening' => $rekening,
            'signs' => $signs,
            'tenantBooks' => $tenantBooks,
            'invoices' => $invoices,
            'cities' => $cities,
        ];
    }

    public function indexService()
    {
        return inertia('Invoices/service/index', $this->indexServiceData());
    }

    public function storeService(Request $r)
    {
        $validator = Validator::make($r->all(), [
            'tenant_book_id' => 'required|integer',
            'rekening_id' => 'required|integer|exists:rekenings,id',
            'sign_id' => 'required|integer|exists:signs,id',
            'no' => 'required|string|max:50',
            'tgl' => 'required|date',
            'due' => 'required|date',
            'curr' => 'nullable|string|max:3',
            'keterangan' => 'required|string|max:255',
            'period_start' => 'required|date',
            'period_end' => 'required|date',
            'jumlah' => 'required|numeric|min:0',
            'diskon_ket' => 'nullable|string|max:255',
            'diskon_jumlah' => 'nullable|numeric|min:0',
            'biaya_ket' => 'nullable|string|max:255',
            'biaya_jumlah' => 'nullable|numeric|min:0',
            'promotion_levy_persen' => 'nullable|numeric|min:0',
            'promotion_levy_jumlah' => 'nullable|numeric|min:0',
            'subtotal' => 'required|numeric|min:0',
            'ppn_persen' => 'nullable|numeric|min:0',
            'ppn_jumlah' => 'nullable|numeric|min:0',
            'materai' => 'nullable|numeric|min:0',
            'total' => 'required|numeric|min:0',
            'terbilang' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return Inertia::render('Invoices/service/index', [
                'message' => 'Error saving payment data',
                'error' => $validator->errors()->all(),
            ]);
        }

        try {
            InvoiceService::create([
                'tenant_book_id' => $r->tenant_book_id,
                'rekening_id' => $r->rekening_id,
                'sign_id' => $r->sign_id,
                'uuid' => Str::uuid(),
                'no' => $r->no,
                'tgl' => $r->tgl,
                'due' => $r->due,
                'curr' => $r->curr ?? 'IDR',
                'toko' => $r->toko,
                'perusahaan' => $r->perusahaan,
                'alamat' => $r->alamat,
                'floor' => $r->floor,
                'unit' => $r->unit,
                'period_start' => $r->period_start,
                'period_end' => $r->period_end,
                'keterangan' => $r->keterangan,
                'jumlah' => $r->jumlah,
                'diskon_ket' => $r->diskon_ket ?? '',
                'diskon_jumlah' => $r->diskon_jumlah ?? 0,
                'biaya_ket' => $r->biaya_ket ?? '',
                'biaya_jumlah' => $r->biaya_jumlah ?? 0,
                'promotion_levy_persen' => $r->promotion_levy_persen ?? 0,
                'promotion_levy_jumlah' => $r->promotion_levy_jumlah ?? 0,
                'subtotal' => $r->subtotal,
                'ppn_persen' => $r->ppn_persen ?? 0,
                'ppn_jumlah' => $r->ppn_jumlah ?? 0,
                'materai' => $r->materai ?? 0,
                'total' => $r->total,
                'terbilang' => $r->terbilang,
            ]);

            return Inertia::render('Invoices/service/index', [
                'success' => 'Service invoice created successfully.',
                ...$this->indexServiceData()
            ]);
        } catch (\Exception $e) {
            return redirect()->route('invoice.service')->withErrors([
                'message' => 'Error saving invoice data: ' . $e->getMessage()
            ]);
        }
    }

    // destroyService
    public function destroyService($id)
    {
        $invoice = InvoiceService::where('id', $id)->firstOrFail();

        Kuitansi::where('invoice_no', $invoice->no)->forceDelete();

        $invoice->delete();

        return inertia('Invoices/service/index', $this->indexServiceData());
    }

    /*********************************** INVOICE SERVICE *****************************************/
    /*********************************************************************************************/

}
