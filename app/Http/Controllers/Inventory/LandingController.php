<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class LandingController extends Controller
{
    protected $view = 'Inventory/Landing';
    protected $route = 'inventory.landing';

    public function index()
    {
        // rekap data menu dan group berdasarkan tenant
        $menu = [];

        // rekap penjualan hari ini berdasarkan tenant
        $trx = [];

        $sales = [];

        $tenants = [];

        return inertia("$this->view/Index", [
            'menu' => $menu,
            'trx' => $trx,
            'sales' => $sales,
            'tenants' => $tenants
        ]);
    }
}
