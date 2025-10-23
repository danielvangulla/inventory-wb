<?php

namespace App\Http\Controllers;

use App\Models\MeterAir;
use App\Models\MeterListrik;
use App\Models\TenantBook;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MeterController extends Controller
{
    public function createListrik()
    {
        $tenantBooks = TenantBook::allDatas()->select(['id', 'nama_toko', 'perusahaan'])->orderBy('nama_toko')->get();
        $tenantBooks->load(['meterListrikNow', 'meterListrikLast']);

        return inertia('Invoices/listrik/action/inputMeter', [
            'username' => Auth::user()->name,
            'tenantBooks' => $tenantBooks,
        ]);
    }

    public function storeListrik(Request $request)
    {
        $request->validate([
            'tenant_book_id' => 'required|exists:tenant_books,id',
            'tgl' => 'required|date',
            'awal' => 'required|numeric',
            'akhir' => 'required|numeric|gte:awal', // Ensure 'akhir' is greater than or equal to 'awal'
            'pemakaian' => 'required|numeric',
        ]);

        // Check if the meter for the given tenant and date already exists for the same month
        $existingMeter = MeterListrik::where('tenant_book_id', $request->tenant_book_id)
            ->whereMonth('tgl', date('m', strtotime($request->tgl)))
            ->whereYear('tgl', date('Y', strtotime($request->tgl)))
            ->first();

        if ($existingMeter) {
            $existingMeter->update([
                'tgl' => $request->tgl,
                'awal' => $request->awal,
                'akhir' => $request->akhir,
                'pemakaian' => $request->pemakaian,
            ]);
        } else {
            MeterListrik::create([
                'tenant_book_id' => $request->tenant_book_id,
                'tgl' => $request->tgl,
                'awal' => $request->awal,
                'akhir' => $request->akhir,
                'pemakaian' => $request->pemakaian,
            ]);
        }

        $tenantBooks = TenantBook::select(['id', 'nama_toko', 'perusahaan'])->orderBy('nama_toko')->get();
        $tenantBooks->load(['meterListrikNow', 'meterListrikLast']);

        return inertia('Invoices/listrik/action/inputMeter', [
            'tenantBooks' => $tenantBooks,
            'success' => 'Data Meter air berhasil disimpan.',
        ]);
    }




    public function createAir()
    {
        $tenantBooks = TenantBook::allDatas()->select(['id', 'nama_toko', 'perusahaan'])->orderBy('nama_toko')->get();
        $tenantBooks->load(['meterAirNow', 'meterAirLast']);

        return inertia('Invoices/air/action/inputMeter', [
            'username' => Auth::user()->name,
            'tenantBooks' => $tenantBooks,
        ]);
    }

    public function storeAir(Request $request)
    {
        $request->validate([
            'tenant_book_id' => 'required|exists:tenant_books,id',
            'tgl' => 'required|date',
            'awal' => 'required|numeric',
            'akhir' => 'required|numeric|gte:awal', // Ensure 'akhir' is greater than or equal to 'awal'
            'pemakaian' => 'required|numeric',
        ]);

        // Check if the meter for the given tenant and date already exists for the same month
        $existingMeter = MeterAir::where('tenant_book_id', $request->tenant_book_id)
            ->whereMonth('tgl', date('m', strtotime($request->tgl)))
            ->whereYear('tgl', date('Y', strtotime($request->tgl)))
            ->first();

        if ($existingMeter) {
            $existingMeter->update([
                'tgl' => $request->tgl,
                'awal' => $request->awal,
                'akhir' => $request->akhir,
                'pemakaian' => $request->pemakaian,
            ]);
        } else {
            MeterAir::create([
                'tenant_book_id' => $request->tenant_book_id,
                'tgl' => $request->tgl,
                'awal' => $request->awal,
                'akhir' => $request->akhir,
                'pemakaian' => $request->pemakaian,
            ]);
        }

        $tenantBooks = TenantBook::select(['id', 'nama_toko', 'perusahaan'])->orderBy('nama_toko')->get();
        $tenantBooks->load(['meterAirNow', 'meterAirLast']);

        return inertia('Invoices/air/action/inputMeter', [
            'tenantBooks' => $tenantBooks,
            'success' => 'Data Meter air berhasil disimpan.',
        ]);
    }
}
