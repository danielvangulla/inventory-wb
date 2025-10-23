<?php

namespace App\Http\Controllers\Foodcourt;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use App\Models\Tenant;
use App\Models\TransaksiItem;
use Illuminate\Http\Request;

class LandingController extends Controller
{
    protected $view = 'Foodcourt/Landing';
    protected $route = 'foodcourt.landing';

    public function index()
    {
        // rekap data menu dan group berdasarkan tenant
        $menu = Menu::with('tenant')->get()->groupBy('tenant.nama_tenant');

        // rekap penjualan hari ini berdasarkan tenant
        $trx = TransaksiItem::with('menu.tenant')
            ->get()
            ->groupBy('menu.tenant.nama_tenant');

        // buat agar mudah di tampilkan dalam view
        $sales = $trx->map(function ($items, $tenant) {
            return [
                'tenant' => $tenant,
                'total_items' => $items->sum('quantity'),
                'total_sales' => $items->sum(function ($item) {
                    return $item->quantity * $item->harga_satuan;
                }),
            ];
        });

        $tenants = Tenant::all();

        return inertia("$this->view/Index", [
            'menu' => $menu,
            'trx' => $trx,
            'sales' => $sales,
            'tenants' => $tenants
        ]);
    }
}
