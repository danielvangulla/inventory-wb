<?php

namespace App\Http\Controllers;

use App\Models\InvoiceAir;
use App\Models\InvoiceListrik;
use App\Models\InvoiceOther;
use App\Models\InvoiceOtherType;
use App\Models\InvoiceService;
use App\Models\InvoiceSewa;
use App\Models\TenantBook;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function kuitansi($tgl1 = null, $tgl2 = null, $selectedTenantId = 0, $selectedInvoiceType = 'semua')
    {
        if (!$tgl1 || !$tgl2) {
            $tgl1 = date('Y-m-01');
            $tgl2 = date('Y-m-t');
        }

        $tenantBooks = TenantBook::select(['id', 'nama_toko', 'perusahaan'])->orderBy('nama_toko')->get();
        $tenantBooks->prepend(['id' => 0, 'nama_toko' => 'All', 'perusahaan' => 'Semua']);

        $invoiceOtherType = InvoiceOtherType::orderBy('tipe')->get();
        $invoiceType = collect(['Semua', 'Sewa', 'Service', 'Air', 'Listrik'])->merge($invoiceOtherType->pluck('tipe'))->all();

        $dataDetail = [];

        if (strtolower($selectedInvoiceType) == 'semua' || strtolower($selectedInvoiceType) == 'sewa') {
            $invoiceSewa = InvoiceSewa::with('tenantBook')
                ->whereHas('kuitansi', function ($query) use ($tgl1, $tgl2) {
                    $query->where('tgl', '>=', $tgl1)
                        ->where('tgl', '<=', $tgl2);
                })
                ->get();

            foreach ($invoiceSewa as $v) {
                if ($selectedTenantId != 0 && $v->tenant_book_id != $selectedTenantId) {
                    continue;
                }

                $namaToko = $v->tenantBook ? $v->tenantBook->nama_toko : '-';
                $perusahaan = $v->tenantBook ? $v->tenantBook->perusahaan : '-';

                $dataDetail[] = [
                    'tgl' => $v->kuitansi->tgl,
                    'no_kuitansi' => $v->kuitansi->no,
                    'no_invoice' => $v->no,
                    'nama_toko' => $namaToko,
                    'perusahaan' => $perusahaan,
                    'tipe' => 'sewa',
                    'keterangan' => $v->keterangan,
                    'jumlah' => $v->total,
                ];
            }
        }

        if (strtolower($selectedInvoiceType) == 'semua' || strtolower($selectedInvoiceType) == 'service') {
            $invoiceService = InvoiceService::with('tenantBook')
                ->whereHas('kuitansi', function ($query) use ($tgl1, $tgl2) {
                    $query->where('tgl', '>=', $tgl1)
                        ->where('tgl', '<=', $tgl2);
                })
                ->get();

            foreach ($invoiceService as $v) {
                if ($selectedTenantId != 0 && $v->tenant_book_id != $selectedTenantId) {
                    continue;
                }

                $namaToko = $v->tenantBook ? $v->tenantBook->nama_toko : '-';
                $perusahaan = $v->tenantBook ? $v->tenantBook->perusahaan : '-';

                $dataDetail[] = [
                    'tgl' => $v->kuitansi->tgl,
                    'no_kuitansi' => $v->kuitansi->no,
                    'no_invoice' => $v->no,
                    'nama_toko' => $namaToko,
                    'perusahaan' => $perusahaan,
                    'tipe' => 'service',
                    'keterangan' => $v->keterangan,
                    'jumlah' => $v->total,
                ];
            }
        }

        if (strtolower($selectedInvoiceType) == 'semua' || strtolower($selectedInvoiceType) == 'air') {
            $invoiceAir = InvoiceAir::with('meterAir.tenantBook')
                ->whereHas('kuitansi', function ($query) use ($tgl1, $tgl2) {
                    $query->where('tgl', '>=', $tgl1)
                        ->where('tgl', '<=', $tgl2);
                })
                ->get();

            foreach ($invoiceAir as $v) {
                if ($selectedTenantId != 0 && $v->meterAir && $v->meterAir->tenant_book_id != $selectedTenantId) {
                    continue;
                }

                $namaToko = $v->meterAir && $v->meterAir->tenantBook ? $v->meterAir->tenantBook->nama_toko : '-';
                $perusahaan = $v->meterAir && $v->meterAir->tenantBook ? $v->meterAir->tenantBook->perusahaan : '-';

                $dataDetail[] = [
                    'tgl' => $v->kuitansi->tgl,
                    'no_kuitansi' => $v->kuitansi->no,
                    'no_invoice' => $v->no,
                    'nama_toko' => $namaToko,
                    'perusahaan' => $perusahaan,
                    'tipe' => 'air',
                    'keterangan' => $v->keterangan,
                    'jumlah' => $v->tagihan,
                ];
            }
        }

        if (strtolower($selectedInvoiceType) == 'semua' || strtolower($selectedInvoiceType) == 'listrik') {
            $invoiceListrik = InvoiceListrik::with('meterListrik.tenantBook')
                ->whereHas('kuitansi', function ($query) use ($tgl1, $tgl2) {
                    $query->where('tgl', '>=', $tgl1)
                        ->where('tgl', '<=', $tgl2);
                })
                ->get();

            foreach ($invoiceListrik as $v) {
                if ($selectedTenantId != 0 && $v->meterListrik && $v->meterListrik->tenant_book_id != $selectedTenantId) {
                    continue;
                }

                $namaToko = $v->meterListrik && $v->meterListrik->tenantBook ? $v->meterListrik->tenantBook->nama_toko : '-';
                $perusahaan = $v->meterListrik && $v->meterListrik->tenantBook ? $v->meterListrik->tenantBook->perusahaan : '-';

                $dataDetail[] = [
                    'tgl' => $v->kuitansi->tgl,
                    'no_kuitansi' => $v->kuitansi->no,
                    'no_invoice' => $v->no,
                    'nama_toko' => $namaToko,
                    'perusahaan' => $perusahaan,
                    'tipe' => 'listrik',
                    'keterangan' => $v->keterangan,
                    'jumlah' => $v->tagihan,
                ];
            }
        }

        $invoiceOther = InvoiceOther::with('tenantBook')
            ->with('type')
            ->whereHas('kuitansi', function ($query) use ($tgl1, $tgl2) {
                $query->where('tgl', '>=', $tgl1)
                    ->where('tgl', '<=', $tgl2);
            })
            ->get();

        foreach ($invoiceOther as $v) {
            if ($selectedTenantId != 0 && $v->tenant_book_id != $selectedTenantId) {
                continue;
            }

            $namaToko = $v->tenantBook ? $v->tenantBook->nama_toko : $v->tenant_nama;
            $perusahaan = $v->tenantBook ? $v->tenantBook->perusahaan : '-';
            $tipe = $v->type ? $v->type->tipe : '-';

            if (strtolower($selectedInvoiceType) != 'semua' && strtolower($selectedInvoiceType) != strtolower($tipe)) {
                continue;
            }

            $dataDetail[] = [
                'tgl' => $v->kuitansi->tgl,
                'no_kuitansi' => $v->kuitansi->no,
                'no_invoice' => $v->no,
                'nama_toko' => $namaToko,
                'perusahaan' => $perusahaan,
                'tipe' => strtolower($tipe),
                'keterangan' => $v->keterangan,
                'jumlah' => $v->total,
            ];
        }

        $dataDetail = collect($dataDetail)->sortBy('no_kuitansi')->values()->all();

        return Inertia::render('Reports/Kuitansi/Index', [
            'periodeStart' => $tgl1,
            'periodeEnd' => $tgl2,
            'selectedTenantId' => $selectedTenantId,
            'invoiceType' => $invoiceType,
            'selectedInvoiceType' => $selectedInvoiceType,
            'tenantBooks' => $tenantBooks,
            'dataDetail' => $dataDetail,
        ]);
    }

    public function pendapatan($tgl1 = null, $tgl2 = null, $selectedTenantId = 0, $selectedInvoiceType = 'semua', $currentIsSummary = 1)
    {
        if (!$tgl1 || !$tgl2) {
            $tgl1 = date('Y-m-01');
            $tgl2 = date('Y-m-t');
        }

        $dataDetail = [];

        $invoiceAir = InvoiceAir::with('meterAir')
            ->with('meterAir.tenantBook')
            ->where('tgl', '>=', $tgl1)
            ->where('tgl', '<=', $tgl2)
            ->get();

        foreach ($invoiceAir as $invoice) {
            $potPph = $invoice->total * 10 / 100;
            $bayar = $invoice->tagihan - $potPph;

            $dataDetail[] = [
                'tenant_book_id' => $invoice->meterAir->tenantBook->id,
                'tgl' => $invoice->tgl,
                'jenis' => 'air',
                'toko' => $invoice->meterAir->tenantBook->nama_toko,
                'ket' => $invoice->keterangan,
                'no' => $invoice->no,
                'jumlah' => $invoice->total,
                'ppn' => $invoice->ppn_jumlah,
                'materai' => $invoice->materai,
                'total' => $invoice->tagihan,
                'pot_pph' => $potPph,
                'bayar' => $bayar,
            ];
        }

        $invoiceListrik = InvoiceListrik::with('meterListrik')
            ->with('meterListrik.tenantBook')
            ->where('tgl', '>=', $tgl1)
            ->where('tgl', '<=', $tgl2)
            ->get();

        foreach ($invoiceListrik as $invoice) {
            $potPph = $invoice->total * 10 / 100;
            $bayar = $invoice->tagihan - $potPph;

            $dataDetail[] = [
                'tenant_book_id' => $invoice->meterListrik->tenantBook->id,
                'tgl' => $invoice->tgl,
                'jenis' => 'listrik',
                'toko' => $invoice->meterListrik->tenantBook->nama_toko,
                'ket' => $invoice->keterangan,
                'no' => $invoice->no,
                'jumlah' => $invoice->total,
                'ppn' => $invoice->ppn_jumlah,
                'materai' => $invoice->materai,
                'total' => $invoice->tagihan,
                'pot_pph' => $potPph,
                'bayar' => $bayar,
            ];
        }

        $invoiceSewa = InvoiceSewa::with('tenantBook')
            ->where('tgl', '>=', $tgl1)
            ->where('tgl', '<=', $tgl2)
            ->get();

        foreach ($invoiceSewa as $invoice) {
            $potPph = $invoice->subtotal * 10 / 100;
            $bayar = $invoice->total - $potPph;

            $dataDetail[] = [
                'tenant_book_id' => $invoice->tenantBook->id,
                'tgl' => $invoice->tgl,
                'jenis' => 'sewa',
                'toko' => $invoice->tenantBook->nama_toko,
                'ket' => $invoice->keterangan,
                'no' => $invoice->no,
                'jumlah' => $invoice->subtotal,
                'ppn' => $invoice->ppn_jumlah,
                'materai' => $invoice->materai,
                'total' => $invoice->total,
                'pot_pph' => $potPph,
                'bayar' => $bayar,
            ];
        }

        $invoiceService = InvoiceService::with('tenantBook')
            ->where('tgl', '>=', $tgl1)
            ->where('tgl', '<=', $tgl2)
            ->get();

        foreach ($invoiceService as $invoice) {
            $potPph = $invoice->subtotal * 10 / 100;
            $bayar = $invoice->total - $potPph;

            $dataDetail[] = [
                'tenant_book_id' => $invoice->tenantBook->id,
                'tgl' => $invoice->tgl,
                'jenis' => 'Service',
                'toko' => $invoice->tenantBook->nama_toko,
                'ket' => $invoice->keterangan,
                'no' => $invoice->no,
                'jumlah' => $invoice->subtotal,
                'ppn' => $invoice->ppn_jumlah,
                'materai' => $invoice->materai,
                'total' => $invoice->total,
                'pot_pph' => $potPph,
                'bayar' => $bayar,
            ];
        }

        $invoiceOther = InvoiceOther::with('tenantBook')
            ->with('type')
            ->with('details')
            ->where('tgl', '>=', $tgl1)
            ->where('tgl', '<=', $tgl2)
            ->get();

        foreach ($invoiceOther as $invoice) {
            $invoiceType = InvoiceOtherType::find($invoice->invoice_other_type_id);
            $jenis = $invoiceType ? $invoiceType->tipe : 'lain-lain';

            $keterangan = $invoice->details->map(function ($detail) {
                return $detail->keterangan;
            })->join(', ');

            $potPph = $invoice->subtotal * 10 / 100;
            $bayar = $invoice->total - $potPph;


            $dataDetail[] = [
                'tenant_book_id' => $invoice->tenantBook ? $invoice->tenantBook->id : 0,
                'tgl' => $invoice->tgl,
                'jenis' => $jenis,
                'toko' => $invoice->tenant_nama,
                'ket' => $keterangan,
                'no' => $invoice->no,
                'jumlah' => $invoice->subtotal,
                'ppn' => $invoice->ppn_jumlah,
                'materai' => $invoice->materai,
                'total' => $invoice->total,
                'pot_pph' => $potPph,
                'bayar' => $bayar,
            ];
        }

        $dataSum = array_values([
            'sewa' => ['ket' => 'Sewa', 'jumlah' => 0, 'ppn' => 0, 'materai' => 0, 'total' => 0, 'pot_pph' => 0, 'bayar' => 0],
            'service' => ['ket' => 'Service', 'jumlah' => 0, 'ppn' => 0, 'materai' => 0, 'total' => 0, 'pot_pph' => 0, 'bayar' => 0],
            'air' => ['ket' => 'Air', 'jumlah' => 0, 'ppn' => 0, 'materai' => 0, 'total' => 0, 'pot_pph' => 0, 'bayar' => 0],
            'listrik' => ['ket' => 'Listrik', 'jumlah' => 0, 'ppn' => 0, 'materai' => 0, 'total' => 0, 'pot_pph' => 0, 'bayar' => 0],
        ]);

        $dataDetail = collect($dataDetail)->sortBy('tgl')->values()->all();

        $tenantBooks = TenantBook::select(['id', 'nama_toko', 'perusahaan'])->orderBy('nama_toko')->get();
        $tenantBooks->prepend(['id' => 0, 'nama_toko' => 'All', 'perusahaan' => 'Semua']);

        $invoiceOtherType = InvoiceOtherType::orderBy('tipe')->get();
        $invoiceType = collect(['Semua', 'Sewa', 'Service', 'Air', 'Listrik'])->merge($invoiceOtherType->pluck('tipe'))->all();

        return Inertia::render('Reports/Pendapatan/Index', [
            'periodeStart' => $tgl1,
            'periodeEnd' => $tgl2,
            'selectedTenantId' => $selectedTenantId,
            'selectedInvoiceType' => $selectedInvoiceType,
            'currentIsSummary' => $currentIsSummary,
            'dataSum' => $dataSum,
            'dataDetail' => $dataDetail,
            'tenantBooks' => $tenantBooks,
            'invoiceType' => $invoiceType,
        ]);
    }
}
