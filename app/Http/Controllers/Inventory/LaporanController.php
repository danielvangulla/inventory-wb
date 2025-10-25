<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Models\GudangMasuk;
use App\Models\GudangMasukDet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LaporanController extends Controller
{
    protected $view = 'Inventory/Laporan';
    protected $route = 'inventory.laporan';

    protected $user;
    protected $level;

    public function __construct()
    {
        $this->user = Auth::user();
        $this->level = $this->user ? $this->user->level : null;

        if (!($this->user && $this->level && ($this->level->laporan || $this->level->is_admin))) {
            abort(403, 'Akses tidak diizinkan.');
        }
    }

    private function checkAuth()
    {
        return $this->level->laporan || $this->level->is_admin;
    }

    private function accessDenied()
    {
        return redirect()->route("$this->route.index");
    }

    public function laporanPembelian($barangId = 0, $tgl1 = null, $tgl2 = null, $supplierId = 0, $kategoriId = 0, $subKategoriId = 0)
    {
        $data = GudangMasukDet::with(['gudangMasuk', 'gudangMasuk.supplier', 'barang', 'barang.kategori', 'barang.kategorisub'])
            ->when($barangId, function ($query, $barangId) {
                if ($barangId == 0)
                    return $query;
                return $query->where('barang_id', $barangId);
            })
            ->when($tgl1 && $tgl2, function ($query) use ($tgl1, $tgl2) {
                return $query->whereHas('gudangMasuk', function ($q) use ($tgl1, $tgl2) {
                    if ($tgl1 == null && $tgl2 == null) {
                        $tgl1 = date('Y-m-01');
                        $tgl2 = date('Y-m-d');
                    }
                    $q->whereBetween('tanggal', [$tgl1, $tgl2]);
                });
            })
            ->when($supplierId, function ($query, $supplierId) {
                return $query->whereHas('barang', function ($q) use ($supplierId) {
                    if ($supplierId == 0)
                        return $q;
                    $q->where('supplier_id', $supplierId);
                });
            })
            ->when($kategoriId, function ($query, $kategoriId) {
                return $query->whereHas('barang', function ($q) use ($kategoriId) {
                    if ($kategoriId == 0)
                        return $q;
                    $q->where('kategori_id', $kategoriId);
                });
            })
            ->when($subKategoriId, function ($query, $subKategoriId) {
                return $query->whereHas('barang', function ($q) use ($subKategoriId) {
                    if ($subKategoriId == 0)
                        return $q;
                    $q->where('sub_kategori_id', $subKategoriId);
                });
            })
            ->get();

        return inertia("$this->view/Index", [
            'data' => $data,
            'canWrite' => $this->checkAuth(),
        ]);
    }

}
