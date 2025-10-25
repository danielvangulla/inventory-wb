<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Barang;
use App\Models\GudangMasuk;
use App\Models\GudangMasukDet;
use App\Models\Kategori;
use App\Models\Kategorisub;
use App\Models\Supplier;
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

        if (!($this->user && $this->level && $this->checkAuth())) {
            abort(403, 'Akses tidak diizinkan.');
        }
    }

    private function checkAuth()
    {
        return $this->level->laporan || $this->level->is_admin;
    }

    public function laporanPembelianPrint($tgl1 = null, $tgl2 = null, $barangId = 0, $supplierId = 0, $kategoriId = 0, $subKategoriId = 0)
    {
        return $this->laporanPembelian(
            $tgl1, $tgl2, $barangId, $supplierId, $kategoriId, $subKategoriId, true
        );
    }

    public function laporanPembelian($tgl1 = null, $tgl2 = null, $barangId = 0, $supplierId = 0, $kategoriId = 0, $subKategoriId = 0, $isPrint = false)
    {
        if ($tgl1 == null && $tgl2 == null) {
            $tgl1 = date('Y-m-01');
            $tgl2 = date('Y-m-d');
        }

        $data = GudangMasukDet::with([
            'gudangMasuk:id,tgl,supplier_id',
            'gudangMasuk.supplier:id,nama',
            'barang:id,deskripsi,satuan,kategori_id,kategorisub_id',
            'barang.kategori:id,ket',
            'barang.kategorisub:id,ket'
        ])
            // ->when($barangId, function ($query, $barangId) {
            //     if ($barangId == 0)
            //         return $query;
            //     return $query->where('barang_id', $barangId);
            // })
            ->when($tgl1 && $tgl2, function ($query) use ($tgl1, $tgl2, $supplierId) {
                return $query->whereHas('gudangMasuk', function ($q) use ($tgl1, $tgl2, $supplierId) {
                    $q->whereBetween('tgl', [$tgl1, $tgl2]);
                    // if ($supplierId == 0)
                    //     return $q;
                    // $q->where('supplier_id', $supplierId);
                });
            })
            // ->when($kategoriId, function ($query, $kategoriId) {
            //     return $query->whereHas('barang', function ($q) use ($kategoriId) {
            //         if ($kategoriId == 0)
            //             return $q;
            //         $q->where('kategori_id', $kategoriId);
            //     });
            // })
            // ->when($subKategoriId, function ($query, $subKategoriId) {
            //     return $query->whereHas('barang', function ($q) use ($subKategoriId) {
            //         if ($subKategoriId == 0)
            //             return $q;
            //         $q->where('kategorisub_id', $subKategoriId);
            //     });
            // })
            // ->orderBy('created_at', 'desc')
            ->get();

        $barangs = Barang::select('id', 'deskripsi')->get();
        $suppliers = Supplier::select('id', 'nama')->get();
        $kategoris = Kategori::select('id', 'ket')->with('kategorisubs:id,ket')->get();

        $print = $isPrint ? 'Print' : '';
        return inertia("$this->view/Pembelian$print", [
            'data' => $data,
            'barangs' => $barangs,
            'suppliers' => $suppliers,
            'kategoris' => $kategoris,
            'params' => [$tgl1, $tgl2, $barangId, $supplierId, $kategoriId, $subKategoriId],
            'canWrite' => $this->checkAuth(),
        ]);
    }

}
