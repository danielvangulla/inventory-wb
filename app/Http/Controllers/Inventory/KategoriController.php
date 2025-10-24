<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Kategori;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class KategoriController extends Controller
{
    protected $view = 'Inventory/Kategori';
    protected $route = 'inventory.kategori';

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
        $kategori = Kategori::all();

        return inertia("$this->view/Index", [
            'kategori' => $kategori
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

        $validated = $r->validate([
            'ket' => 'required|string|max:255',
            'urut' => 'required|integer',
        ]);

        Kategori::create($validated);

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

        $kategori = Kategori::findOrFail($id);

        return inertia("$this->view/Edit", [
            'kategori' => $kategori,
        ]);
    }

    public function update(Request $r, $id)
    {
        if (!$this->checkAuth()){
            return $this->accessDenied();
        }

        $kategori = Kategori::findOrFail($id);

        $validated = $r->validate([
            'ket' => 'required|string|max:255',
            'urut' => 'nullable|integer',
        ]);

        $kategori->update($validated);

        return redirect()->route("$this->route.index");
    }

    public function destroy($id)
    {
        if (!$this->checkAuth()){
            return $this->accessDenied();
        }

        $kategori = Kategori::findOrFail($id);
        $kategori->delete();

        return redirect()->route("$this->route.index");
    }
}
