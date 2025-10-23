<?php

namespace App\Http\Controllers\Tenants;

use App\Http\Controllers\Controller;
use App\Models\TenantBook;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TenantBookController extends Controller
{
    public function index()
    {
        $tenantBooks = TenantBook::with('tenant')
            ->where('status', '>=', 1)
            ->latest()
            ->get();

        return Inertia::render('TenantBook/TenantList', [
            'tenantBooks' => $tenantBooks,
        ]);
    }

    public function create()
    {
        $tenants = Tenant::where('st_static', 0)
            ->whereDoesntHave('tenantBook', function ($query) {
                $query->where('status', '>=', 1);
            })
            ->where('floor', '!=', 0)
            ->select('id', 'title', 'floor', 'no', 'area', 'st_static')
            ->orderBy('floor', 'asc')
            ->orderBy('no', 'asc')
            ->get();

        // add 3 row for $tenants at the top of the list, but dont remove the current $tenants
        $tenants = $tenants->prepend((object) [
            'id' => 9003,
            'title' => '',
            'floor' => '3',
            'no' => 'ISLAND Lantai 3',
            'area' => 0,
            'st_static' => 0,
        ])->prepend((object) [
            'id' => 9002,
            'title' => '',
            'floor' => '2',
            'no' => 'ISLAND Lantai 2',
            'area' => 0,
            'st_static' => 0,
        ])->prepend((object) [
            'id' => 9001,
            'title' => '',
            'floor' => '1',
            'no' => 'ISLAND Lantai 1',
            'area' => 0,
            'st_static' => 0,
        ]);

        return Inertia::render('TenantBook/Create', [
            'tenants' => $tenants,
        ]);
    }

    public function store(Request $r)
    {
        // Validasi data yang diterima dari request
        $validated = $r->validate([
            'tenant_id' => 'required|numeric',
            'is_island' => 'required|numeric',
            'nama_toko' => 'nullable|string',
            'perusahaan' => 'nullable|string',
            'alamat' => 'nullable|string',
            'npwp' => 'nullable|string',
            'telp' => 'nullable|string',
            'email' => 'nullable|email',
            'tgl_start' => 'nullable|date',
            'tgl_end' => 'nullable|date',
            'luas_indoor' => 'nullable|numeric',
            'luas_outdoor' => 'nullable|numeric',
            'lama_sewa' => 'nullable|integer',
            'total_sewa_indoor' => 'nullable|numeric',
            'total_sewa_outdoor' => 'nullable|numeric',
            'total_sewa' => 'nullable|numeric',
            'sewa_per_bulan' => 'nullable|numeric',
            'harga_service_indoor' => 'nullable|numeric',
            'harga_service_outdoor' => 'nullable|numeric',
            'service_per_bulan' => 'nullable|numeric',
            'promotion_levy_start' => 'nullable|date',
            'promotion_levy_end' => 'nullable|date',
            'promotion_levy_persen' => 'nullable|numeric',
            'promotion_levy_per_bulan' => 'nullable|numeric',
            'deposit_sewa' => 'nullable|numeric',
            'deposit_service' => 'nullable|numeric',
            'deposit_telepon' => 'nullable|numeric',
            // Validasi tenantBookDetails
            'tenantBookDetails' => 'required|array',
            'tenantBookDetails.*.harga_sewa_indoor' => 'required|numeric',
            'tenantBookDetails.*.harga_sewa_outdoor' => 'required|numeric',
            'tenantBookDetails.*.lama_sewa' => 'required|integer',
        ]);

        // Menyimpan data ke tenant_books
        $tenantBook = TenantBook::create([
            'tenant_id' => $validated['tenant_id'],
            'is_island' => $validated['is_island'],
            'nama_toko' => $validated['nama_toko'],
            'perusahaan' => $validated['perusahaan'],
            'alamat' => $validated['alamat'],
            'npwp' => $validated['npwp'],
            'telp' => $validated['telp'],
            'email' => $validated['email'],
            'tgl_start' => $validated['tgl_start'],
            'tgl_end' => $validated['tgl_end'],
            'luas_indoor' => $validated['luas_indoor'],
            'luas_outdoor' => $validated['luas_outdoor'],
            'lama_sewa' => $validated['lama_sewa'],
            'total_sewa_indoor' => $validated['total_sewa_indoor'],
            'total_sewa_outdoor' => $validated['total_sewa_outdoor'],
            'total_sewa' => $validated['total_sewa'],
            'sewa_per_bulan' => $validated['sewa_per_bulan'],
            'harga_service_indoor' => $validated['harga_service_indoor'],
            'harga_service_outdoor' => $validated['harga_service_outdoor'],
            'service_per_bulan' => $validated['service_per_bulan'],
            'promotion_levy_start' => $validated['promotion_levy_start'] ?? $validated['tgl_start'],
            'promotion_levy_end' => $validated['promotion_levy_end'] ?? $validated['tgl_end'],
            'promotion_levy_persen' => $validated['promotion_levy_persen'],
            'promotion_levy_per_bulan' => $validated['promotion_levy_per_bulan'],
            'deposit_sewa' => $validated['deposit_sewa'],
            'deposit_service' => $validated['deposit_service'],
            'deposit_telepon' => $validated['deposit_telepon'],
        ]);

        // Menyimpan tenantBookDetails jika ada
        if (isset($validated['tenantBookDetails']) && is_array($validated['tenantBookDetails'])) {
            foreach ($validated['tenantBookDetails'] as $detail) {
                $tenantBook->tenantBookDetails()->create([
                    'tenant_book_id' => $tenantBook->id,
                    'lama_sewa' => $detail['lama_sewa'],
                    'luas_indoor' => $tenantBook->luas_indoor,
                    'harga_sewa_indoor' => $detail['harga_sewa_indoor'],
                    'sewa_indoor' => $detail['lama_sewa'] * $detail['harga_sewa_indoor'] * $tenantBook->luas_indoor,
                    'luas_outdoor' => $tenantBook->luas_outdoor,
                    'harga_sewa_outdoor' => $detail['harga_sewa_outdoor'],
                    'sewa_outdoor' => $detail['lama_sewa'] * $detail['harga_sewa_outdoor'] * $tenantBook->luas_outdoor,
                    'total_sewa' => $tenantBook->total_sewa,
                ]);
            }
        }

        return redirect()->back()->with('success', 'Data kontrak sewa berhasil disimpan.');
    }


    // Edit function
    public function edit($id)
    {
        $tenants = Tenant::all();

        // add 3 row for $tenants at the top of the list, but dont remove the current $tenants
        $tenants = $tenants->prepend((object) [
            'id' => 9003,
            'title' => '',
            'floor' => '3',
            'no' => 'ISLAND Lantai 3',
            'area' => 0,
            'st_static' => 0,
        ])->prepend((object) [
            'id' => 9002,
            'title' => '',
            'floor' => '2',
            'no' => 'ISLAND Lantai 2',
            'area' => 0,
            'st_static' => 0,
        ])->prepend((object) [
            'id' => 9001,
            'title' => '',
            'floor' => '1',
            'no' => 'ISLAND Lantai 1',
            'area' => 0,
            'st_static' => 0,
        ]);

        // Retrieve the tenant book by its ID
        $tenantBook = TenantBook::findOrFail($id);
        $tenantBook->tenant = $tenantBook->tenant;
        $tenantBook->tenantBookDetails = $tenantBook->tenantBookDetails;


        return Inertia::render('TenantBook/Edit', [
            'tenants' => $tenants,
            'tenantBook' => $tenantBook,
        ]);
    }

    public function update(Request $r, $id)
    {
        $tenantBook = TenantBook::findOrFail($id);

        // Validasi input
        $validatedData = $r->validate([
            'tenant_id' => 'required|numeric',
            'nama_toko' => 'required|string|max:255',
            'perusahaan' => 'required|string|max:255',
            'alamat' => 'nullable|string',
            'npwp' => 'nullable|string',
            'telp' => 'nullable|string',
            'email' => 'nullable|email',
            'tgl_start' => 'required|date',
            'tgl_end' => 'required|date',
            'luas_indoor' => 'required|numeric',
            'luas_outdoor' => 'required|numeric',
            'lama_sewa' => 'required|numeric|min:1',
            'total_sewa_indoor' => 'required|numeric',
            'total_sewa_outdoor' => 'required|numeric',
            'total_sewa' => 'required|numeric',
            'sewa_per_bulan' => 'nullable|numeric',
            'harga_service_indoor' => 'nullable|numeric',
            'harga_service_outdoor' => 'nullable|numeric',
            'service_per_bulan' => 'nullable|numeric',
            'promotion_levy_start' => 'nullable|date',
            'promotion_levy_end' => 'nullable|date',
            'promotion_levy_persen' => 'nullable|numeric',
            'promotion_levy_per_bulan' => 'nullable|numeric',
            'deposit_sewa' => 'nullable|numeric',
            'deposit_service' => 'nullable|numeric',
            'deposit_telepon' => 'nullable|numeric',
            'tenantBookDetails' => 'nullable|array',
            // Add other fields as necessary
        ]);

        // Update tenantBook with validated data
        $tenantBook->update($validatedData);

        // If there are tenantBookDetails, update them too
        if ($r->has('tenantBookDetails')) {
            // First, hard delete existing tenantBookDetails
            $tenantBook->tenantBookDetails()->delete();

            foreach ($r->tenantBookDetails as $detail) {
                $tenantBook->tenantBookDetails()->create([
                    'tenant_book_id' => $tenantBook->id,
                    'lama_sewa' => $detail['lama_sewa'],
                    'luas_indoor' => $tenantBook->luas_indoor,
                    'harga_sewa_indoor' => $detail['harga_sewa_indoor'],
                    'sewa_indoor' => $detail['lama_sewa'] * $detail['harga_sewa_indoor'] * $tenantBook->luas_indoor,
                    'luas_outdoor' => $tenantBook->luas_outdoor,
                    'harga_sewa_outdoor' => $detail['harga_sewa_outdoor'],
                    'sewa_outdoor' => $detail['lama_sewa'] * $detail['harga_sewa_outdoor'] * $tenantBook->luas_outdoor,
                    'total_sewa' => $tenantBook->total_sewa,
                ]);
            }
        }

        // Redirect back to the edit page with success message
        return redirect()->route('tenant-books.edit', $id)->with('success', 'Data kontrak sewa berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $data = TenantBook::findOrFail($id);
        $data->status = 0;
        $data->save();

        return redirect()->route('tenant-books.index')->with('success', 'Data kontrak sewa berhasil dihapus.');
    }
}
