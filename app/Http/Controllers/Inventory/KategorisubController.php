<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Kategori;
use App\Models\Kategorisub;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class KategorisubController extends Controller
{
    protected $view = 'Inventory/Kategorisub';
    protected $route = 'inventory.kategorisub';

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
        return $this->user && $this->level && $this->level->is_admin;
    }

    private function accessDenied() {
        return redirect()->route("$this->route.index");
    }

    public function index()
    {
        $kategorisub = Kategorisub::with('kategori')->get();

        return inertia("$this->view/Index", [
            'kategorisub' => $kategorisub,
        ]);
    }

    public function create()
    {
        if (!$this->checkAuth()){
            return $this->accessDenied();
        }

        $kategori = Kategori::all();

        return inertia("$this->view/Create", [
            'kategori' => $kategori,
        ]);
    }

    public function store(Request $r)
    {
        if (!$this->checkAuth()){
            return $this->accessDenied();
        }

        $validated = $r->validate([
            'kategori_id' => 'required|exists:kategoris,id',
            'ket' => 'required|string|max:255',
            'urut' => 'nullable|integer',
        ]);

        Kategorisub::create($validated);

        return redirect()->route("$this->route.index");
    }

    public function show($id)
    {
        return redirect()->route("$this->route.index");
    }

    public function edit($id)
    {
        if (!$this->checkAuth()){
            return $this->accessDenied();
        }

        $kategori = Kategori::all();
        $kategorisub = Kategorisub::findOrFail($id);

        return inertia("$this->view/Edit", [
            'kategori' => $kategori,
            'kategorisub' => $kategorisub,
        ]);
    }

    public function update(Request $r, $id)
    {
        if (!$this->checkAuth()){
            return $this->accessDenied();
        }

        $kategorisub = Kategorisub::findOrFail($id);

        $validated = $r->validate([
            'kategori_id' => 'required|exists:kategoris,id',
            'ket' => 'required|string|max:255',
            'urut' => 'nullable|integer',
        ]);

        $kategorisub->update($validated);

        return redirect()->route("$this->route.index");
    }

    public function destroy($id)
    {
        if (!$this->checkAuth()){
            return $this->accessDenied();
        }

        $kategorisub = Kategorisub::findOrFail($id);
        $kategorisub->delete();

        return redirect()->route("$this->route.index");
    }
}
