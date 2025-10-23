<?php

namespace App\Http\Controllers\Foodcourt;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Foodcourt\Services\PrintOrders;
use App\Http\Controllers\Foodcourt\Services\PrintReceipt;
use App\Models\Menu;
use App\Models\Setup;
use Illuminate\Http\Request;

class PrinterController extends Controller
{
    protected int $port;
    protected string $profileName;
    protected int $charWidth;

    public function __construct()
    {
        $this->charWidth = 47; // Typical width for 80mm paper
        $this->port = (int) config('pos_printer.port', env('POS_PRINTER_PORT', 9100));
        $this->profileName = config('pos_printer.profile', env('POS_PRINTER_PROFILE', 'default'));
    }

    public function printReceipt(Request $r, PrintReceipt $printer)
    {
        $printerIP = Setup::where('key', 'ip_printer_kasir')->value('value');
        $data = $r->data;

        if (empty($printerIP)) {
            return response()->json(['error' => 'Printer IP is required', 'printer_ip' => $printerIP], 400);
        }

        return $printer->print($data, $printerIP);
    }

    public function printOrders(Request $r, PrintOrders $printer)
    {
        $data = $r->data;
        $orderCode = $r->order_code ?? '-';

        if (empty($data) || !is_array($data)) {
            return response()->json([
                'error' => 'Invalid data provided',
                'request' => $r->all(),
            ], 400);
        }

        $defaultPrinterIP = Setup::where('key', 'ip_printer_kasir')->value('value');

        $grouped = [];
        foreach ($data as $item) {
            $menu = Menu::with('tenant')->find($item['menu_id']);
            $tenantId = 0; // or some default value
            $printerIP = $defaultPrinterIP;

            if ($menu && $menu->tenant) {
                $tenantId = $menu->tenant->id;
                $printerIP = $menu->tenant->ip_printer ?? $printerIP;
            }

            if (!isset($grouped[$tenantId])) {
                $grouped[$tenantId] = [
                    'ip_printer' => $printerIP,
                    'items' => [],
                ];
            }

            $grouped[$tenantId]['items'][] = [
                'name' => $menu->alias,
                'qty' => $item['qty'],
            ];
        }

        foreach ($grouped as $group) {
            $printer->print($group['items'], $group['ip_printer'], $orderCode);
        }

        return response()->json([
            'success' => true,
        ], 201);
    }
}
