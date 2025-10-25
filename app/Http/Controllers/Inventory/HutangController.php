<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Models\GudangMasuk;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HutangController extends Controller
{
    protected $view = 'Inventory/Hutang';
    protected $route = 'inventory.hutang';

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
        $data = GudangMasuk::with('details.barang', 'supplier')
            ->where('jenis_bayar', 0)
            ->get();

        return inertia("$this->view/Index", [
            'data' => $data,
            'canWrite' => $this->checkAuth(),
        ]);
    }

    public function store(Request $request)
    {
        if (!$this->checkAuth()) {
            return $this->accessDenied();
        }

        $request->validate([
            'id' => 'required|exists:gudang_masuks,id',
        ]);

        $hutang = GudangMasuk::findOrFail($request->id);
        $hutang->is_lunas = true;
        $hutang->tgl_lunas = now();
        $hutang->save();

        return to_route("$this->route.index")->with('success', 'Berhasil proses bayar hutang.');
    }
}
