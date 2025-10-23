<?php

namespace App\Http\Controllers\Foodcourt;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TenantController extends Controller
{
    protected $view = 'Foodcourt/Tenants';
    protected $route = 'foodcourt.tenants';

    protected $user;
    protected $level;

    public function __construct() {
        $this->user = Auth::user();
        $this->level = $this->user ? $this->user->level : null;

        if (!($this->user && $this->level && $this->level->tenant_read)) {
            abort(403, 'Akses tidak diizinkan.');
        }
    }

    private function checkAuth() {
        return $this->user && $this->level && $this->level->tenant_write;
    }

    private function accessDenied() {
        return redirect()->route("$this->route.index");
    }

    public function index()
    {
        $tenants = Tenant::orderBy('nama_tenant')->get();

        return inertia("$this->view/Index", [
            'tenants' => $tenants
        ]);
    }

    public function create()
    {
        if (!$this->checkAuth()){
            return $this->accessDenied();
        }

        return inertia("$this->view/Create");
    }

    public function store(Request $r)
    {
        if (!$this->checkAuth()){
            return $this->accessDenied();
        }

        if (!$this->user || !$this->level || !$this->level->tenant_write){
            return redirect()->route("$this->route.index");
        }

        $validated = $r->validate([
            'nama_tenant' => 'required|string|max:255',
            'perusahaan' => 'nullable|string|max:255',
            'owner' => 'nullable|string|max:255',
            'hp' => 'nullable|string|max:20',
            'email' => 'required|email|unique:tenants,email',
            'alamat' => 'nullable|string|max:500',
            'ip_printer' => 'nullable|ip',
        ]);

        Tenant::create($validated);

        return redirect()->route("$this->route.index");
    }

    public function show(string $id)
    {
        return redirect()->route("$this->route.index");
    }

    public function edit(string $id)
    {
        if (!$this->checkAuth()){
            return $this->accessDenied();
        }

        $tenant = Tenant::findOrFail($id);

        return inertia("$this->view/Edit", [
            'tenant' => $tenant,
        ]);
    }

    public function update(Request $r, string $id)
    {
        if (!$this->checkAuth()){
            return $this->accessDenied();
        }

        $tenant = Tenant::findOrFail($id);

        $validated = $r->validate([
            'nama_tenant' => 'required|string|max:255',
            'perusahaan' => 'nullable|string|max:255',
            'owner' => 'nullable|string|max:255',
            'hp' => 'nullable|string|max:20',
            'email' => 'required|email|unique:tenants,email,' . $tenant->id,
            'alamat' => 'nullable|string|max:500',
            'ip_printer' => 'nullable|ip',
        ]);

        $tenant->update($validated);

        return redirect()->route("$this->route.index");
    }

    public function destroy(string $id)
    {
        if (!$this->checkAuth()){
            return $this->accessDenied();
        }

        $tenant = Tenant::findOrFail($id);
        $tenant->delete();

        return redirect()->route("$this->route.index");
    }
}
