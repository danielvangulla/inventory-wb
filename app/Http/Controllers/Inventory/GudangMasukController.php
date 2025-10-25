<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Barang;
use App\Models\GudangMasuk;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GudangMasukController extends Controller
{
    protected $view = 'Inventory/Gudang/Masuk';
    protected $route = 'inventory.terima-gudang';

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
        $data = GudangMasuk::with('details', 'details.barang', 'supplier')->get();

        return inertia("$this->view/Index", [
            'data' => $data,
        ]);
    }

    public function create()
    {
        if (!$this->checkAuth()) {
            return $this->accessDenied();
        }

        $barangs = Barang::all();
        $suppliers = Supplier::all();

        return inertia("$this->view/Create", [
            'barangs' => $barangs,
            'suppliers' => $suppliers,
        ]);
    }

    public function store(Request $request)
    {
        if (!$this->checkAuth()) {
            return $this->accessDenied();
        }

        $validatedData = $request->validate([
            'tgl' => 'required|date',
            'penerima' => 'required|string|max:255',
            'supplier_id' => 'required|exists:suppliers,id',
            'brutto' => 'required|numeric',
            'disc' => 'required|numeric',
            'netto' => 'required|numeric',
            'tax' => 'required|numeric',
            'total' => 'required|numeric',
            'jenis_bayar' => 'required|numeric|in:0,1',
            'due' => 'required|date',
            'details' => 'required|array',
            'details.*.barang_id' => 'required|exists:barangs,id',
            'details.*.harga' => 'required|numeric|min:0',
            'details.*.qty' => 'required|numeric|min:1',
            'details.*.brutto' => 'required|numeric',
            'details.*.disc' => 'required|numeric',
            'details.*.netto' => 'required|numeric',
            'details.*.tax' => 'required|numeric',
            'details.*.total' => 'required|numeric',
        ]);

        if ($validatedData['jenis_bayar'] == 1) {
            $validatedData['due'] = $validatedData['tgl'];
            $validatedData['tgl_lunas'] = $validatedData['tgl'];
        }

        $gudangMasuk = GudangMasuk::create($validatedData);

        foreach ($validatedData['details'] as $detail) {
            $gudangMasuk->details()->create([
                'gudang_masuk_id' => $gudangMasuk->id,
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

        $gudangMasuk = GudangMasuk::findOrFail($id);
        $gudangMasuk->details()->delete();
        $gudangMasuk->delete();

        return redirect()->route("$this->route.index")->with('success', 'Data penerimaan gudang berhasil dihapus.');
    }
}
