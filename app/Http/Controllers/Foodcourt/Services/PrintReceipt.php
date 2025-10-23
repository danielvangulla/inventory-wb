<?php

namespace App\Http\Controllers\Foodcourt\Services;

use App\Models\Setup;
use Mike42\Escpos\Printer;
use Mike42\Escpos\PrintConnectors\NetworkPrintConnector;
use Mike42\Escpos\CapabilityProfile;

class PrintReceipt
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

    public function print(array $data, string $printerIP)
    {
        if (empty($printerIP)) {
            return response()->json(['error' => 'Printer IP is required'], 400);
        }

        // Set up the connection to the network printer
        $connector = new NetworkPrintConnector($printerIP, $this->port);
        $profile   = CapabilityProfile::load($this->profileName);
        $printer   = new Printer($connector, $profile);

        try {
            $this->generateReceipt($printer, $data);
        } finally {
            $printer->close();
            return response()->json(['message' => 'Print job sent to printer at ' . $printerIP]);
        }
    }

    private function generateReceipt(Printer $printer, array $data): void
    {
        $header1 = Setup::where('key', 'receipt_header1')->value('value');
        $header2 = Setup::where('key', 'receipt_header2')->value('value');
        $header3 = Setup::where('key', 'receipt_header3')->value('value');
        $footer1 = Setup::where('key', 'receipt_footer1')->value('value');

        // Header
        $printer->setJustification(Printer::JUSTIFY_CENTER);
        $printer->selectPrintMode(Printer::MODE_EMPHASIZED);
        $printer->text("$header1\n");
        $printer->selectPrintMode(); // reset
        $printer->text("$header2\n");
        if (!empty($header3)) {
            $printer->text("$header3\n");
        }
        $printer->feed();

        // Meta
        $printer->setJustification(Printer::JUSTIFY_LEFT);
        $printer->text("Order   : {$data['meta']['order_code']}\n");
        $printer->text("Tanggal : {$data['meta']['date']}\n");
        $printer->text("Kasir   : {$data['meta']['kasir']}\n");
        $printer->text(str_repeat('-', $this->charWidth) . "\n");

        // Items (80mm typically 42–48 chars; we format name vs cols)
        foreach ($data['items'] as $it) {
            $this->lineItem($printer, $it['name'], $it['qty'], $it['price'], $it['subtotal']);
        }
        $printer->text(str_repeat('-', $this->charWidth) . "\n");

        // Totals
        if (!empty($data['totals']['tax']) || !empty($data['totals']['discount'])) {
            $this->lineAmount($printer, 'Subtotal', $data['totals']['subtotal']);
        }

        if (!empty($data['totals']['tax'])) {
            $this->lineAmount($printer, 'Tax', $data['totals']['tax']);
        }

        if (!empty($data['totals']['discount'])) {
            $this->lineAmount($printer, 'Discount', -abs($data['totals']['discount']));
        }

        $printer->setEmphasis(true);
        $this->lineAmount($printer, 'Grand Total', $data['totals']['grand_total']);
        $printer->setEmphasis(false);
        $printer->feed(1);

        // Optional QR (invoice or payment link)
        // if (!empty($data['meta']['qr'])) {
        //     $printer->setJustification(Printer::JUSTIFY_CENTER);
        //     $printer->qrCode($data['meta']['qr'], Printer::QR_ECLEVEL_M, 6);
        //     $printer->feed();
        // }

        // Payment details
        if (!empty($data['payment'])) {
            // tampilkan PAYMENT di tengah
            $printer->setJustification(Printer::JUSTIFY_CENTER);
            $printer->text("PAYMENT\n");

            $printer->setJustification(Printer::JUSTIFY_LEFT);
            // tampilkan method to uppercase
            $printer->text("Method       : " . strtoupper($data['payment']['jenis_bayar']) . "\n");

            if ($data['payment']['jenis_bayar'] !== 'cash' && !empty($data['payment']['channel_bayar'])) {
                $printer->text("Channel      : " . strtoupper($data['payment']['channel_bayar']) . "\n");
            }

            if ($data['payment']['jenis_bayar'] === 'cash') {
                $this->lineAmount($printer, 'Cash', $data['payment']['uang_cash']);
                $this->lineAmount($printer, 'Kembalian', "-{$data['payment']['kembalian']}");
            } elseif ($data['payment']['jenis_bayar'] === 'card') {
                $printer->text("Card No.     : {$data['payment']['card_no']}\n");
                $this->lineAmount($printer, 'Card Charge', $data['payment']['card_charge']);
                $this->lineAmount($printer, 'Total Paid', $data['totals']['grand_total'] + ($data['payment']['card_charge'] ?? 0));
            } elseif ($data['payment']['jenis_bayar'] === 'qris') {
                // show last 5 digit as xxxxx
                $printer->text("No. HP       : {$data['payment']['card_no']}\n");
                $this->lineAmount($printer, 'QRIS Charge', $data['payment']['card_charge']);
                $this->lineAmount($printer, 'Total Paid', $data['totals']['grand_total'] + ($data['payment']['card_charge'] ?? 0));
            }

            $printer->feed(1);
        }

        // Footer
        $printer->setJustification(Printer::JUSTIFY_CENTER);
        if (!empty($footer1)) {
            $printer->text("$footer1\n");
        }
        $printer->feed(1);

        // Cash drawer (if needed)
        // $printer->pulse(); // uncomment if you use a drawer

        // Cut (if the printer has a cutter)
        $printer->cut();
    }

    private function lineItem(Printer $printer, string $name, $qty, $price, $subtotal): void
    {
        // First line: item name (wrapped)
        $wrapped = wordwrap($name, $this->charWidth, "\n");
        $lines   = explode("\n", $wrapped);
        $printer->text($lines[0] . "\n");

        // Second line: qty x price ..... subtotal
        $qtyStr  = number_format($qty, 0);
        $priceStr = number_format($price, 0);
        $subStr   = number_format($subtotal, 0);

        $left  = "{$qtyStr} x {$priceStr}";
        $right = $subStr;

        $printer->text($this->lr($left, $right, $this->charWidth) . "\n");

        // Additional wrapped lines if the name was long
        for ($i = 1; $i < count($lines); $i++) {
            $printer->text($lines[$i] . "\n");
        }
    }

    private function lineAmount(Printer $printer, string $label, $amount): void
    {
        $right = number_format($amount, 0);
        $printer->text($this->lr($label, $right, $this->charWidth) . "\n");
    }

    private function lr(string $left, string $right, int $width): string
    {
        $len = mb_strlen($left) + mb_strlen($right);
        $spaces = max(1, $width - $len);
        return $left . str_repeat(' ', $spaces) . $right;
    }
}
