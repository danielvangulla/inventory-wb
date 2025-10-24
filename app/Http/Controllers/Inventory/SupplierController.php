<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SupplierController extends Controller
{
    protected $view = 'Inventory/Supplier';
    protected $route = 'inventory.suppliers';

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
        $suppliers = Supplier::all();

        return inertia("$this->view/Index", [
            'suppliers' => $suppliers
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

        Supplier::create($validated);

        return redirect()->route("$this->route.index")->with('success', 'Supplier berhasil ditambahkan.');
    }

    public function show($id)
    {
        return redirect()->route("$this->route.index");
    }

    public function edit($id)
    {
        if (!$this->checkAuth()) {
            return $this->accessDenied();
        }

        $supplier = Supplier::findOrFail($id);

        return inertia("$this->view/Edit", [
            'supplier' => $supplier
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

        $supplier = Supplier::findOrFail($id);
        $supplier->update($validated);

        return redirect()->route("$this->route.index")->with('success', 'Supplier berhasil diperbarui.');
    }

    public function destroy($id)
    {
        if (!$this->checkAuth()) {
            return $this->accessDenied();
        }

        $supplier = Supplier::findOrFail($id);
        $supplier->delete();

        return redirect()->route("$this->route.index")->with('success', 'Supplier berhasil dihapus.');
    }
}
