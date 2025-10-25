<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Barang;
use App\Models\GudangKeluar;
use App\Models\Outlet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GudangKeluarController extends Controller
{
    protected $view = 'Inventory/Gudang/Keluar';
    protected $route = 'inventory.keluar-gudang';

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
        $data = GudangKeluar::with('details', 'details.barang', 'outlet')->get();

        return inertia("$this->view/Index", [
            'data' => $data,
            'canWrite' => $this->checkAuth(),
        ]);
    }

    public function create()
    {
        if (!$this->checkAuth()) {
            return $this->accessDenied();
        }

        $barangs = Barang::all();
        $outlets = Outlet::all();

        return inertia("$this->view/Create", [
            'barangs' => $barangs,
            'outlets' => $outlets,
        ]);
    }

    public function store(Request $request)
    {
        if (!$this->checkAuth()) {
            return $this->accessDenied();
        }

        $validatedData = $request->validate([
            'tgl' => 'required|date',
            'outlet_id' => 'required|exists:outlets,id',
            'menyerahkan' => 'required|string',
            'mengambil' => 'required|string',
            'mengantar' => 'required|string',
            'total' => 'required|numeric',
            'details' => 'required|array',
            'details.*.barang_id' => 'required|exists:barangs,id',
            'details.*.harga' => 'required|numeric|min:0',
            'details.*.qty' => 'required|numeric|min:1',
            'details.*.total' => 'required|numeric',
        ]);

        $gudangKeluar = GudangKeluar::create($validatedData);

        foreach ($validatedData['details'] as $detail) {
            $gudangKeluar->details()->create([
                'gudang_masuk_id' => $gudangKeluar->id,
                ...$detail,
            ]);
        }

        return redirect()->route("$this->route.index")->with('success', 'Data penerimaan gudang berhasil ditambahkan.');
    }

    public function destroy($id)
    {
        if (!$this->checkAuth()) {
            return $this->accessDenied();
        }

        $gudangKeluar = GudangKeluar::findOrFail($id);
        $gudangKeluar->details()->delete();
        $gudangKeluar->delete();

        return redirect()->route("$this->route.index")->with('success', 'Data pengeluaran gudang berhasil dihapus.');
    }
}
