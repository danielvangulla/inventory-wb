<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Barang;
use App\Models\GudangKeluarDet;
use App\Models\GudangMasukDet;
use App\Models\Kategori;
use App\Models\Outlet;
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


    public function laporanPembelianPost(Request $r)
    {
        $post = $r->all();
        if ($post) {
            $tgl1 = $post['tgl1'];
            $tgl2 = $post['tgl2'];
            $barangId = $post['barangId'];
            $supplierId = $post['supplierId'];
            $kategoriId = $post['kategoriId'];
            $kategorisubId = $post['kategorisubId'];
        }

        return $this->laporanPembelian(
            $tgl1, $tgl2, $barangId, $supplierId, $kategoriId, $kategorisubId
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
            'barang.kategorisub:id,ket'])
            ->when($tgl1 && $tgl2, function ($query) use ($tgl1, $tgl2) {
                return $query->whereHas('gudangMasuk', function ($q) use ($tgl1, $tgl2) {
                    $q->whereBetween('tgl', [$tgl1, $tgl2]);
                });
            })
            ->get();

        $barangs = Barang::select('id', 'deskripsi')->get();
        $suppliers = Supplier::select('id', 'nama')->get();
        $kategoris = Kategori::select('id', 'ket')->with('kategorisubs:id,ket,kategori_id')->get();

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

    public function laporanPembelianPrint($tgl1 = null, $tgl2 = null, $barangId = 0, $supplierId = 0, $kategoriId = 0, $subKategoriId = 0)
    {
        return $this->laporanPembelian(
            $tgl1, $tgl2, $barangId, $supplierId, $kategoriId, $subKategoriId, true
        );
    }



    public function laporanBarangKeluarPost(Request $r)
    {
        $post = $r->all();
        if ($post) {
            $tgl1 = $post['tgl1'];
            $tgl2 = $post['tgl2'];
            $barangId = $post['barangId'];
            $outletId = $post['outletId'];
            $kategoriId = $post['kategoriId'];
            $kategorisubId = $post['kategorisubId'];
        }

        return $this->laporanBarangKeluar(
            $tgl1, $tgl2, $barangId, $outletId, $kategoriId, $kategorisubId
        );
    }

    public function laporanBarangKeluar($tgl1 = null, $tgl2 = null, $barangId = 0, $outletId = 0, $kategoriId = 0, $kategorisubId = 0, $isPrint = false)
    {
        if ($tgl1 == null && $tgl2 == null) {
            $tgl1 = date('Y-m-01');
            $tgl2 = date('Y-m-d');
        }

        $data = GudangKeluarDet::with([
            'gudangKeluar:id,tgl,outlet_id,menyerahkan,mengambil,mengantar',
            'gudangKeluar.outlet:id,nama',
            'barang:id,deskripsi,satuan,kategori_id,kategorisub_id',
            'barang.kategori:id,ket',
            'barang.kategorisub:id,ket'
        ])
            ->when($tgl1 && $tgl2, function ($query) use ($tgl1, $tgl2) {
                return $query->whereHas('gudangKeluar', function ($q) use ($tgl1, $tgl2) {
                    $q->whereBetween('tgl', [$tgl1, $tgl2]);
                });
            })
            ->get();

        $barangs = Barang::select('id', 'deskripsi')->get();
        $outlets = Outlet::select('id', 'nama')->get();
        $kategoris = Kategori::select('id', 'ket')->with('kategorisubs:id,ket,kategori_id')->get();

        $print = $isPrint ? 'Print' : '';
        return inertia("$this->view/BarangKeluar$print", [
            'data' => $data,
            'barangs' => $barangs,
            'outlets' => $outlets,
            'kategoris' => $kategoris,
            'params' => [$tgl1, $tgl2, $barangId, $outletId, $kategoriId, $kategorisubId],
            'canWrite' => $this->checkAuth(),
        ]);
    }

    public function laporanBarangKeluarPrint($tgl1 = null, $tgl2 = null, $barangId = 0, $outletId = 0, $kategoriId = 0, $kategorisubId = 0)
    {
        return $this->laporanBarangKeluar(
            $tgl1, $tgl2, $barangId, $outletId, $kategoriId, $kategorisubId, true
        );
    }
}
