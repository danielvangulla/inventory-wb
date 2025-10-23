<?php

namespace App\Http\Controllers\Foodcourt;

use App\Http\Controllers\Controller;
use App\Models\Kategorisub;
use App\Models\Menu;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MenuController extends Controller
{
    protected $view = 'Foodcourt/Menu';
    protected $route = 'foodcourt.menu';

    protected $user;
    protected $level;

    public function __construct() {
        $this->user = Auth::user();
        $this->level = $this->user ? $this->user->level : null;

        if (!($this->user && $this->level && $this->level->menu_read)) {
            abort(403, 'Akses tidak diizinkan.');
        }
    }

    private function checkAuth() {
        return $this->user && $this->level && $this->level->menu_write;
    }

    private function accessDenied() {
        return redirect()->route("$this->route.index");
    }

    public function index()
    {
        $menu = Menu::with(['tenant', 'kategorisub', 'kategorisub.kategori']);

        if (!$this->level->is_admin && $this->user->tenant_id) {
            $menu->where('tenant_id', $this->user->tenant_id);
        }

        $menu = $menu->orderBy('tenant_id')
            ->orderBy('sku')
            ->get();

        return inertia("$this->view/Index", [
            'menu' => $menu
        ]);
    }

    public function create()
    {
        if (!$this->checkAuth()){
            return $this->accessDenied();
        }

        if (!$this->level->is_admin && $this->user->tenant_id) {
            $tenant = Tenant::where('id', $this->user->tenant_id)->get();
        } else {
            $tenant = Tenant::all();
        }

        $kategorisub = Kategorisub::all();

        return inertia("$this->view/Create", [
            'tenant' => $tenant,
            'kategorisub' => $kategorisub
        ]);
    }

    public function store(Request $request)
    {
        if (!$this->checkAuth()){
            return $this->accessDenied();
        }

        $validated = $request->validate([
            'sku' => 'nullable|string|max:20',
            'tenant_id' => 'required|exists:tenants,id',
            'kategorisub_id' => 'required|exists:kategorisubs,id',
            'alias' => 'nullable|string|max:255',
            'deskripsi' => 'nullable|string',
            'harga' => 'required|integer|min:0',
            'is_ready' => 'required|boolean',
            'is_soldout' => 'required|boolean',
        ]);

        $validated['sku'] = $validated['sku'] ?? $this->generateSKU($validated);

        Menu::create($validated);

        return redirect()->route("$this->route.index")->with('success', 'Menu created successfully.');
    }

    protected function generateSKU(array $data)
    {
        // generate SKU berdasarkan tenant_id, kategorisub_id, dan id terakhir di tabel menu. sepanjang 8 digit.
        // pastikan tidak ada duplikasi SKU di database.

        $tenantPart = str_pad($data['tenant_id'], 2, '0', STR_PAD_LEFT);

        $lastMenu = Menu::where('sku', 'like', "$tenantPart%")->orderBy('sku', 'desc')->first();
        $newId = $lastMenu ? (int)substr($lastMenu->sku, 4) + 1 : '0001';

        $kategorisubPart = str_pad($data['kategorisub_id'], 2, '0', STR_PAD_LEFT);
        $newId = $tenantPart . $kategorisubPart . str_pad($newId, 4, '0', STR_PAD_LEFT); // total 8 digit

        // cek duplikasi
        while (Menu::where('sku', $newId)->exists()) {
            $newId++;
        }

        return $newId;
    }

    public function edit(Menu $menu)
    {
        if (!$this->checkAuth()) {
            return $this->accessDenied();
        }

        if (!$this->level->is_admin && $this->user->tenant_id && $menu->tenant_id != $this->user->tenant_id) {
            return $this->accessDenied();
        }

        if (!$this->level->is_admin && $this->user->tenant_id) {
            $tenant = Tenant::where('id', $this->user->tenant_id)->get();
        } else {
            $tenant = Tenant::all();
        }

        $kategorisub = Kategorisub::all();

        return inertia("$this->view/Edit", [
            'menu' => $menu,
            'tenant' => $tenant,
            'kategorisub' => $kategorisub
        ]);
    }

    public function update(Request $request, Menu $menu)
    {
        if (!$this->checkAuth()){
            return $this->accessDenied();
        }

        if (!$this->level->is_admin && $this->user->tenant_id && $menu->tenant_id != $this->user->tenant_id) {
            return $this->accessDenied();
        }

        $validated = $request->validate([
            'tenant_id' => 'required|exists:tenants,id',
            'kategorisub_id' => 'required|exists:kategorisubs,id',
            'alias' => 'nullable|string|max:255',
            'deskripsi' => 'nullable|string',
            'harga' => 'required|integer|min:0',
            'is_ready' => 'required|boolean',
            'is_soldout' => 'required|boolean',
        ]);

        $menu->update($validated);

        return redirect()->route("$this->route.index")->with('success', 'Menu updated successfully.');
    }

    public function destroy(Menu $menu)
    {
        if (!$this->checkAuth()){
            return $this->accessDenied();
        }

        if (!$this->level->is_admin && $this->user->tenant_id && $menu->tenant_id != $this->user->tenant_id) {
            return $this->accessDenied();
        }

        $menu->delete();

        return redirect()->route("$this->route.index")->with('success', 'Menu deleted successfully.');
    }
}
