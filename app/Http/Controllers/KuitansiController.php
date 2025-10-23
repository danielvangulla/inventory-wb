<?php

namespace App\Http\Controllers;

use App\Models\Kuitansi;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class KuitansiController extends Controller
{
    public function getNoKuitansi()
    {
        $kuitansiNumbers = Kuitansi::select('no')->distinct()->pluck('no')->toArray();

        return response()->json($kuitansiNumbers);
    }

    public function getKuitansi(Request $r)
    {
        $kuitansi = Kuitansi::where('tenant_book_id', $r->tenant_book_id)
            ->where('invoice_id', $r->invoice_id)
            ->where('invoice_no', $r->invoice_no)
            ->first();

        return response()->json($kuitansi);
    }

    public function store(Request $r)
    {
        // Validate the request data
        $r->validate([
            'tgl' => 'required',
            'no' => 'required|string|max:50',
            'keterangan' => 'required',
            'total' => 'required|numeric',
            'terbilang' => 'required|string|max:255',
            'jenis' => 'required|in:dp,cicilan,listrik,air,service,other',
            'tenant_book_id' => 'required|numeric',
            'invoice_id' => 'required|integer',
            'invoice_no' => 'required|string|max:50',
            'sign_id' => 'required|integer|exists:signs,id',
            'kota' => 'required|string|max:100',
        ]);

        try {
            // cek jika sudah ada kuitansi dengan tenant_book_id, invoice_id, dan invoice_no yang sama
            $existingKuitansi = Kuitansi::where('tenant_book_id', $r->tenant_book_id)
                ->where('jenis', $r->jenis)
                ->where('invoice_id', $r->invoice_id)
                ->first();
            if ($existingKuitansi) {
                // jika sudah ada, update data yang ada
                $existingKuitansi->update([
                    'tgl' => $r->tgl,
                    'no' => $r->no,
                    'keterangan' => $r->keterangan,
                    'sign_id' => $r->sign_id,
                    'kota' => $r->kota,
                ]);
                return response()->json([
                    'msg' => 'Kuitansi berhasil diperbarui..',
                ], 200);
            }

            // jika belum ada, buat kuitansi baru
            Kuitansi::create([
                'uuid' => Str::uuid(),
                'tgl' => $r->tgl,
                'no' => $r->no,
                'keterangan' => $r->keterangan,
                'total' => $r->total,
                'terbilang' => $r->terbilang,
                'jenis' => $r->jenis,
                'tenant_book_id' => $r->tenant_book_id,
                'invoice_id' => $r->invoice_id,
                'invoice_no' => $r->invoice_no,
                'sign_id' => $r->sign_id,
                'kota' => $r->kota,
            ]);

            return response()->json([
                'msg' => 'Kuitansi berhasil simpan..',
            ], 201);
        } catch (\Throwable $th) {
            return response()->json([
                'msg' => 'Gagal: ' . $th->getMessage(),
            ], 500);
        }
    }
}
