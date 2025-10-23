<?php

namespace App\Http\Controllers\Foodcourt\Services;

use Mike42\Escpos\Printer;
use Mike42\Escpos\PrintConnectors\NetworkPrintConnector;
use Mike42\Escpos\CapabilityProfile;

class PrintOrders
{
    protected int $port;
    protected string $profileName;
    protected int $charWidth;

    public function __construct()
    {
        $this->charWidth = 47; // Typical width for 80mm paper
        $this->port = (int) config('pos_printer.port', env('POS_PRINTER_PORT', 9100));
        $this->profileName = config('pos_printer.profile', env('POS_PRINTER_PROFILE', 'simple'));
    }

    public function print(array $data, string $printerIP, string $orderCode)
    {
        $now = date('Y-m-d H:i:s');

        try {
            $connector = new NetworkPrintConnector($printerIP, $this->port);
            $profile = CapabilityProfile::load($this->profileName);
            $printer = new Printer($connector, $profile);

            // Header
            $printer->setJustification(Printer::JUSTIFY_CENTER);
            $printer->setTextSize(2, 1);
            $printer->text("Daftar Order\n");
            $printer->setTextSize(2, 1);
            $printer->text($orderCode . "\n");
            $printer->setTextSize(1, 1);
            $printer->text($now . "\n");

            $printer->setJustification(Printer::JUSTIFY_LEFT);
            $printer->text(str_repeat("-", $this->charWidth) . "\n");

            // Items List only qty and name
            foreach ($data as $item) {
                $line = str_pad($item['qty'], 3, ' ', STR_PAD_LEFT) . " x " . $item['name'];
                $printer->text($line . "\n");
            }

            // Footer
            $printer->text(str_repeat("-", $this->charWidth) . "\n");
            $printer->feed(2);
            $printer->cut();
            $printer->close();

            return response()->json(['success' => 'Order printed successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to print order: ' . $e->getMessage()], 500);
        }
    }
}
