<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Barang;
use App\Models\Kategori;
use App\Models\Kategorisub;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BarangController extends Controller
{
    protected $view = 'Inventory/Barang';
    protected $route = 'inventory.barang';

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
        $barang = Barang::with('kategori')->with('kategorisub')->get();

        return inertia("$this->view/Index", [
            'barang' => $barang
        ]);
    }

    public function create()
    {
        if (!$this->checkAuth()) {
            return $this->accessDenied();
        }

        $kategori = Kategori::with('kategorisubs')->get();

        return inertia("$this->view/Create", [
            'kategori' => $kategori,
        ]);
    }

    public function store(Request $request)
    {
        if (!$this->checkAuth()) {
            return $this->accessDenied();
        }

        $validated = $request->validate([
            'deskripsi' => 'required|string',
            'kategori_id' => 'required|exists:kategoris,id',
            'kategorisub_id' => 'required|exists:kategorisubs,id',
            'satuan' => 'required|string|max:20',
            'min_stok' => 'required|integer|min:0',
        ]);

        Barang::create($validated);

        return redirect()->route("$this->route.index")->with('success', 'Barang berhasil ditambahkan.');
    }

    public function edit(Barang $barang)
    {
        if (!$this->checkAuth()) {
            return $this->accessDenied();
        }

        $kategori = Kategori::with('kategorisubs')->get();

        return inertia("$this->view/Edit", [
            'barang' => $barang,
            'kategori' => $kategori,
        ]);
    }

    public function update(Request $request, Barang $barang)
    {
        if (!$this->checkAuth()) {
            return $this->accessDenied();
        }

        $validated = $request->validate([
            'deskripsi' => 'required|string',
            'kategori_id' => 'required|exists:kategoris,id',
            'kategorisub_id' => 'required|exists:kategorisubs,id',
            'satuan' => 'required|string|max:20',
            'min_stok' => 'required|integer|min:0',
        ]);

        $barang->update($validated);

        return redirect()->route("$this->route.index")->with('success', 'Barang berhasil diperbarui.');
    }

    public function destroy(Barang $barang)
    {
        if (!$this->checkAuth()) {
            return $this->accessDenied();
        }

        $barang->delete();

        return redirect()->route("$this->route.index")->with('success', 'Barang berhasil dihapus.');
    }
}
