<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Outlet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OutletController extends Controller
{
    protected $view = 'Inventory/Outlet';
    protected $route = 'inventory.outlets';

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
        $outlets = Outlet::all();

        return inertia("$this->view/Index", [
            'outlets' => $outlets
        ]);
    }

    public function create()
    {
        if (!$this->checkAuth()) {
            return $this->accessDenied();
        }

        return inertia("$this->view/Create");
    }

    public function store(Request $r)
    {
        if (!$this->checkAuth()) {
            return $this->accessDenied();
        }

        $validated = $r->validate([
            'nama' => 'required|string',
            'alamat' => 'nullable|string',
        ]);

        Outlet::create($validated);

        return redirect()->route("$this->route.index");
    }

    public function edit($id)
    {
        if (!$this->checkAuth()) {
            return $this->accessDenied();
        }

        $outlet = Outlet::findOrFail($id);

        return inertia("$this->view/Edit", [
            'outlet' => $outlet
        ]);
    }

    public function update(Request $r, $id)
    {
        if (!$this->checkAuth()) {
            return $this->accessDenied();
        }

        $validated = $r->validate([
            'nama' => 'required|string',
            'alamat' => 'nullable|string',
        ]);

        $outlet = Outlet::findOrFail($id);
        $outlet->update($validated);

        return redirect()->route("$this->route.index");
    }

    public function destroy($id)
    {
        if (!$this->checkAuth()) {
            return $this->accessDenied();
        }

        $outlet = Outlet::findOrFail($id);
        $outlet->delete();

        return redirect()->route("$this->route.index");
    }
}
