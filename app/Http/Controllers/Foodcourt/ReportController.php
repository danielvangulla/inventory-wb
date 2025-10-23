<?php

namespace App\Http\Controllers\Foodcourt;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    protected $view = 'Foodcourt/Reports';
    protected $route = 'foodcourt.reports';

    protected $user;
    protected $level;

    public function __construct() {
        $this->user = Auth::user();
        $this->level = $this->user ? $this->user->level : null;

        if (!($this->user && $this->level && $this->level->laporan)) {
            abort(403, 'Access denied');
        }
    }

    public function rekapOmsetTenant($tgl1 = null, $tgl2 = null)
    {
        if (!$tgl1 || !$tgl2) {
            $tgl1 = date('Y-m-01');
            $tgl2 = date('Y-m-d');
        }

        $data = DB::select('
            SELECT
                d.nama_tenant,
                d.share_persen,
                COUNT(DISTINCT a.transaksi_id) AS transaksi,
                SUM(a.netto) AS netto,
                SUM(a.tax) AS tax,
                SUM(a.total) AS total
            FROM
                transaksi_items a
            JOIN
                transaksis b ON a.transaksi_id = b.id
            JOIN
                menus c ON a.menu_id = c.id
            JOIN
                tenants d ON c.tenant_id = d.id
            WHERE
                b.tgl BETWEEN ? AND ?
            GROUP BY
                d.nama_tenant, d.share_persen
        ', [$tgl1, $tgl2]);

        $items = array_map(function ($item) {
            $shares_nominal = ($item->share_persen / 100) * $item->netto;
            $tenant_nominal = $item->total - $shares_nominal;

            return [
                'tenant' => $item->nama_tenant,
                'transaksi' => (int) $item->transaksi,
                'revenue' => (float) $item->total,
                'tax' => (float) $item->tax,
                'netto' => (float) $item->netto,
                'shares_persen' => (float) $item->share_persen,
                'shares_nominal' => (float) $shares_nominal,
                'tenant_nominal' => (float) $tenant_nominal,
            ];
        }, $data);

        return inertia("$this->view/RekapOmsetTenant", [
            'tgl1' => $tgl1,
            'tgl2' => $tgl2,
            'items' => $items,
        ]);
    }

    public function rekapOmsetHarian($tgl1 = null, $tgl2 = null, $tenant_id = null)
    {
        if (!$this->level->is_admin) {
            $tenant_id = $this->user->tenant_id;
            if (!$tenant_id) {
                abort(403, 'Access denied: No tenant assigned');
            }
        }

        if (!$tgl1 || !$tgl2) {
            $tgl1 = date('Y-m-01');
            $tgl2 = date('Y-m-d');
        }

        $filterTenant = '';
        if ($tenant_id > 0) {
            $filterTenant = ' AND d.id = ' . $tenant_id;
        }

        $data = DB::select('
            SELECT
                DATE(b.tgl) AS tgl,
                avg(d.share_persen) AS share_persen,
                COUNT(DISTINCT b.id) AS transaksi,
                SUM(a.total) AS total,
                SUM(a.tax) AS tax,
                SUM(a.netto) AS netto
            FROM
                transaksi_items a
            JOIN
                transaksis b ON a.transaksi_id = b.id
            JOIN
                menus c ON a.menu_id = c.id
            JOIN
                tenants d ON c.tenant_id = d.id
            WHERE
                DATE(b.tgl) BETWEEN ? AND ? ' . $filterTenant . '
            GROUP BY
                DATE(b.tgl)
            ORDER BY
                DATE(b.tgl)
        ', [$tgl1, $tgl2]);

        $items = array_map(function ($item) {
            return [
                'tgl' => $item->tgl,
                'transaksi' => (int) $item->transaksi,
                'revenue' => (float) $item->total,
                'tax' => (float) $item->tax,
                'netto' => (float) $item->netto,
                'shares_persen' => (float) $item->share_persen,
                'shares_nominal' => (float) ($item->share_persen / 100) * $item->netto,
                'tenant_nominal' => (float) $item->total, // tenant_nominal sudah dihitung sebagai total
            ];
        }, $data);

        $tenants = Tenant::orderBy('nama_tenant')->get();
        $tenants->prepend((object) ['id' => 0, 'nama_tenant' => 'Semua Tenant', 'perusahaan' => '']);

        return inertia("$this->view/RekapOmsetHarian", [
            'tgl1' => $tgl1,
            'tgl2' => $tgl2,
            'tenant_id' => $tenant_id,
            'items' => $items,
            'tenants' => $tenants,
        ]);
    }

    public function penjualanByItem($tgl1 = null, $tgl2 = null, $tenant_id = null)
    {
        if (!$this->level->is_admin) {
            $tenant_id = $this->user->tenant_id;
            if (!$tenant_id) {
                abort(403, 'Access denied: No tenant assigned');
            }
        }

        if (!$tgl1 || !$tgl2) {
            $tgl1 = date('Y-m-01');
            $tgl2 = date('Y-m-d');
        }

        $filterTenant = '';
        if ($tenant_id > 0) {
            $filterTenant = ' AND d.id = ' . $tenant_id;
        }

        $data = DB::select('
            SELECT
                c.alias,
                d.nama_tenant,
                SUM(a.qty) AS qty,
                a.harga,
                SUM(a.netto) AS netto,
                SUM(a.tax) AS tax,
                SUM(a.total) AS total
            FROM
                transaksi_items a
            JOIN
                transaksis b ON a.transaksi_id = b.id
            JOIN
                menus c ON a.menu_id = c.id
            JOIN
                tenants d ON c.tenant_id = d.id
            WHERE
                DATE(b.tgl) BETWEEN ? AND ? ' . $filterTenant . '
            GROUP BY
                c.alias, d.nama_tenant, a.harga
            ORDER BY
                qty DESC
        ', [$tgl1, $tgl2]);

        $items = array_map(function ($item) {
            return [
                'menu' => $item->alias,
                'tenant' => $item->nama_tenant,
                'alias' => $item->alias,
                'qty' => (int) $item->qty,
                'harga' => (float) $item->harga,
                'netto' => (float) $item->netto,
                'tax' => (float) $item->tax,
                'total' => (float) $item->total,
            ];
        }, $data);

        $tenants = Tenant::orderBy('nama_tenant')->get();
        $tenants->prepend((object) ['id' => 0, 'nama_tenant' => 'Semua Tenant', 'perusahaan' => '']);

        return inertia("$this->view/PenjualanByItem", [
            'tgl1' => $tgl1,
            'tgl2' => $tgl2,
            'tenant_id' => $tenant_id,
            'items' => $items,
            'tenants' => $tenants,
        ]);
    }
}
