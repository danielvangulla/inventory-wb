<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Barang;
use App\Models\BarangRusakDet;
use App\Models\GudangKeluarDet;
use App\Models\GudangMasuk;
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


    public function laporanBarangRusakPost(Request $r)
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

        return $this->laporanBarangRusak(
            $tgl1, $tgl2, $barangId, $supplierId, $kategoriId, $kategorisubId
        );
    }

    public function laporanBarangRusak($tgl1 = null, $tgl2 = null, $barangId = 0, $supplierId = 0, $kategoriId = 0, $kategorisubId = 0, $isPrint = false)
    {
        if ($tgl1 == null && $tgl2 == null) {
            $tgl1 = date('Y-m-01');
            $tgl2 = date('Y-m-d');
        }

        $data = BarangRusakDet::with([
            'barangRusak:id,tgl,supplier_id,penerima',
            'barangRusak.supplier:id,nama',
            'barang:id,deskripsi,satuan,kategori_id,kategorisub_id',
            'barang.kategori:id,ket',
            'barang.kategorisub:id,ket'])
            ->when($tgl1 && $tgl2, function ($query) use ($tgl1, $tgl2) {
                return $query->whereHas('barangRusak', function ($q) use ($tgl1, $tgl2) {
                    $q->whereBetween('tgl', [$tgl1, $tgl2]);
                });
            })
            ->get();

        $barangs = Barang::select('id', 'deskripsi')->get();
        $suppliers = Supplier::select('id', 'nama')->get();
        $kategoris = Kategori::select('id', 'ket')->with('kategorisubs:id,ket,kategori_id')->get();

        $print = $isPrint ? 'Print' : '';
        return inertia("$this->view/BarangRusak$print", [
            'data' => $data,
            'barangs' => $barangs,
            'suppliers' => $suppliers,
            'kategoris' => $kategoris,
            'params' => [$tgl1, $tgl2, $barangId, $supplierId, $kategoriId, $kategorisubId],
            'canWrite' => $this->checkAuth(),
        ]);
    }

    public function laporanBarangRusakPrint($tgl1 = null, $tgl2 = null, $barangId = 0, $supplierId = 0, $kategoriId = 0, $kategorisubId = 0)
    {
        return $this->laporanBarangRusak(
            $tgl1, $tgl2, $barangId, $supplierId, $kategoriId, $kategorisubId, true
        );
    }


    public function laporanHutangPost(Request $r)
    {
        $post = $r->all();
        if ($post) {
            $tgl1 = $post['tgl1'];
            $tgl2 = $post['tgl2'];
            $supplierId = $post['supplierId'];
        }

        return $this->laporanHutang(
            $tgl1, $tgl2, $supplierId
        );
    }

    public function laporanHutang($tgl1 = null, $tgl2 = null, $supplierId = 0, $isPrint = false)
    {
        if ($tgl1 == null && $tgl2 == null) {
            $tgl1 = date('Y-m-01');
            $tgl2 = date('Y-m-d');
        }

        $gudangMasuks = GudangMasuk::with([
            'supplier:id,nama',
            'details:id,gudang_masuk_id,barang_id,qty,harga,total',
            'details.barang:id,deskripsi,satuan,kategori_id,kategorisub_id',
            'details.barang.kategori:id,ket',
            'details.barang.kategorisub:id,ket',
        ])
            ->when($tgl1 && $tgl2, function ($query) use ($tgl1, $tgl2) {
                return $query->whereBetween('tgl', [$tgl1, $tgl2]);
            })
            ->when($supplierId && $supplierId != 0, function ($query) use ($supplierId) {
                return $query->where('supplier_id', $supplierId);
            })
            ->where('jenis_bayar', 0)
            ->where('is_lunas', false)
            ->get();

        $suppliers = Supplier::select('id', 'nama')->get();

        $print = $isPrint ? 'Print' : '';
        return inertia("$this->view/Hutang$print", [
            'data' => $gudangMasuks,
            'suppliers' => $suppliers,
            'params' => [$tgl1, $tgl2, $supplierId],
            'canWrite' => $this->checkAuth(),
        ]);
    }

    public function laporanHutangPrint($tgl1 = null, $tgl2 = null, $supplierId = 0)
    {
        return $this->laporanHutang(
            $tgl1, $tgl2, $supplierId, true
        );
    }


    public function laporanHutangLunasPost(Request $r)
    {
        $post = $r->all();
        if ($post) {
            $tgl1 = $post['tgl1'];
            $tgl2 = $post['tgl2'];
            $supplierId = $post['supplierId'];
        }

        return $this->laporanHutangLunas(
            $tgl1, $tgl2, $supplierId
        );
    }

    public function laporanHutangLunas($tgl1 = null, $tgl2 = null, $supplierId = 0, $isPrint = false)
    {
        if ($tgl1 == null && $tgl2 == null) {
            $tgl1 = date('Y-m-01');
            $tgl2 = date('Y-m-d');
        }

        $gudangMasuks = GudangMasuk::with([
            'supplier:id,nama',
            'details:id,gudang_masuk_id,barang_id,qty,harga,total',
            'details.barang:id,deskripsi,satuan,kategori_id,kategorisub_id',
            'details.barang.kategori:id,ket',
            'details.barang.kategorisub:id,ket',
        ])
            ->when($tgl1 && $tgl2, function ($query) use ($tgl1, $tgl2) {
                return $query->whereBetween('tgl', [$tgl1, $tgl2]);
            })
            ->when($supplierId && $supplierId != 0, function ($query) use ($supplierId) {
                return $query->where('supplier_id', $supplierId);
            })
            ->where('jenis_bayar', 0)
            ->where('is_lunas', true)
            ->get();

        $suppliers = Supplier::select('id', 'nama')->get();

        $print = $isPrint ? 'Print' : '';
        return inertia("$this->view/HutangxLunas$print", [
            'data' => $gudangMasuks,
            'suppliers' => $suppliers,
            'params' => [$tgl1, $tgl2, $supplierId],
            'canWrite' => $this->checkAuth(),
        ]);
    }

    public function laporanHutangLunasPrint($tgl1 = null, $tgl2 = null, $supplierId = 0)
    {
        return $this->laporanHutangLunas(
            $tgl1, $tgl2, $supplierId, true
        );
    }
}
