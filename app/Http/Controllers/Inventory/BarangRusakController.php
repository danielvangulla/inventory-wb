<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Barang;
use App\Models\BarangRusak;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BarangRusakController extends Controller
{
    protected $view = 'Inventory/BarangRusak';
    protected $route = 'inventory.barang-rusak';

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
        $data = BarangRusak::with('supplier', 'details', 'details.barang')->get();

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

        $suppliers = Supplier::all();
        $barangs = Barang::all();

        return inertia("$this->view/Create", [
            'suppliers' => $suppliers,
            'barangs' => $barangs,
        ]);
    }

    public function store(Request $request)
    {
        if (!$this->checkAuth()) {
            return $this->accessDenied();
        }

        $validated = $request->validate([
            'tgl' => 'required|date',
            'supplier_id' => 'required|exists:suppliers,id',
            'penerima' => 'required|string',
            'total' => 'required|numeric',
            'details' => 'required|array|min:1',
            'details.*.barang_id' => 'required|exists:barangs,id',
            'details.*.qty' => 'required|numeric',
            'details.*.harga' => 'required|numeric',
            'details.*.total' => 'required|numeric',
        ]);

        $barangRusak = BarangRusak::create($validated);

        foreach ($validated['details'] as $detail) {
            $barangRusak->details()->create([
                'barang_rusak_id' => $barangRusak->id,
                'barang_id' => $detail['barang_id'],
                'qty' => $detail['qty'],
                'harga' => $detail['harga'],
                'total' => $detail['total'],
            ]);

            $barang = Barang::find($detail['barang_id']);
            if ($barang) {
                $barang->decrement('stok', $detail['qty']);
            }
        }

        return redirect()->route("$this->route.index")->with('success', 'Data barang rusak berhasil disimpan.');
    }

    public function destroy($id)
    {
        if (!$this->checkAuth()) {
            return $this->accessDenied();
        }

        $barangRusak = BarangRusak::findOrFail($id);

        foreach ($barangRusak->details as $detail) {
            $barang = Barang::find($detail->barang_id);
            if ($barang) {
                $barang->increment('stok', $detail->qty);
            }
        }

        $barangRusak->details()->delete();
        $barangRusak->delete();

        return redirect()->route("$this->route.index")->with('success', 'Data barang rusak berhasil dihapus.');
    }
}
