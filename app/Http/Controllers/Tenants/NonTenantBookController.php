<?php

namespace App\Http\Controllers\Tenants;

use App\Http\Controllers\Controller;
use App\Models\NontenantBook;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NonTenantBookController extends Controller
{
    public function index()
    {
        $nontenants = NontenantBook::with('tenant')
            ->where('is_nontenant', 1)
            ->where('status', '>=', 1)
            ->latest()
            ->get();

        return Inertia::render('NonTenantBook/Index', [
            'nontenants' => $nontenants,
        ]);
    }

    private function dataTenant()
    {
        return Tenant::where('st_static', 0)
            ->with('tenantBook', function ($query) {
                $query->orderBy('nama_toko');
            })
            ->where('floor', '!=', 0)
            ->select('id', 'title', 'floor', 'no', 'area', 'st_static')
            ->orderBy('floor', 'asc')
            ->orderBy('no', 'asc')
            ->get();
    }

    public function create()
    {
        return Inertia::render('NonTenantBook/Create', [
            'tenants' => $this->dataTenant(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'tenant_id' => 'nullable',
            'nama_toko' => 'required|string|max:255',
            'perusahaan' => 'required|string|max:255',
            'npwp' => 'nullable|string|max:50',
            'telp' => 'nullable|string|max:50',
            'email' => 'nullable|string|max:50',
            'alamat' => 'required|string|max:255',
        ]);

        NontenantBook::create([
            'tenant_id' => $request->tenant_id,
            'is_nontenant' => 1,
            'nama_toko' => $request->nama_toko,
            'perusahaan' => $request->perusahaan,
            'npwp' => $request->npwp,
            'telp' => $request->telp,
            'email' => $request->email,
            'alamat' => $request->alamat,
        ]);

        return Inertia::render('NonTenantBook/Create', [
            'tenants' => $this->dataTenant(),
            'msg' => 'Data berhasil ditambahkan.',
        ]);
    }

    public function edit($id)
    {
        $nontenantBook = NontenantBook::findOrFail($id)
            ->load('tenant');

        return Inertia::render('NonTenantBook/Edit', [
            'nontenantBook' => $nontenantBook,
            'tenants' => $this->dataTenant(),
        ]);
    }

    public function update(Request $request, $id)
    {
        $data = NontenantBook::findOrFail($id);

        $request->validate([
            'tenant_id' => 'nullable',
            'nama_toko' => 'required|string|max:255',
            'perusahaan' => 'required|string|max:255',
            'npwp' => 'nullable|string|max:50',
            'telp' => 'nullable|string|max:50',
            'email' => 'nullable|string|max:50',
            'alamat' => 'required|string|max:255',
        ]);

        $data->update([
            'tenant_id' => $request->tenant_id,
            'nama_toko' => $request->nama_toko,
            'perusahaan' => $request->perusahaan,
            'npwp' => $request->npwp,
            'telp' => $request->telp,
            'email' => $request->email,
            'alamat' => $request->alamat,
        ]);

        $nontenantBook = NontenantBook::findOrFail($id)
            ->load('tenant');

        return Inertia::render('NonTenantBook/Edit', [
            'nontenantBook' => $nontenantBook,
            'tenants' => $this->dataTenant(),
            'msg' => 'Data berhasil diperbarui.',
        ]);
    }
}
