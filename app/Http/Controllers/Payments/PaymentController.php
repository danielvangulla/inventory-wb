<?php

namespace App\Http\Controllers\Payments;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\PaymentDeposit;
use App\Models\PaymentDp;
use App\Models\PaymentSewa;
use App\Models\Setup;
use App\Models\Sign;
use App\Models\TenantBook;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PaymentController extends Controller
{
    public function index()
    {
        // $payments = Payment::with('tenant', 'tenantBook')->get();
        $tenantBooks = TenantBook::with('tenant')
            ->with('payments', function ($query) {
                $query->with('paymentDp')
                    ->with('paymentSewa')
                    ->with('tenantBook')
                    ->with('deposits')
                    ->with('sign');
            })
            ->with('tenantBookDetails')
            ->where('status', '>=', 1)
            ->latest()
            ->get();

        $setup = Setup::where('key', 'pdf_header_1')->first();
        $perusahaan = $setup->val;

        return inertia('Payments/Index', [
            'tenantBooks' => $tenantBooks,
            'perusahaan' => $perusahaan,
        ]);
    }

    public function create()
    {
        // Mengambil data tenant yang aktif
        $tenantBook = TenantBook::with('tenant')
            ->with('payments', function ($query) {
                $query->with('paymentDp')
                    ->with('paymentSewa')
                    ->with('deposits')
                    ->with('sign');
            })
            ->where('status', '>=', 1)
            ->get();

        $signs = Sign::all();

        return inertia('Payments/Create', [
            'username' => Auth::user()->name,
            'tenantBook' => $tenantBook,
            'signs' => $signs,
        ]);
    }

    public function store(Request $request)
    {
        // Validasi data dari request
        $validated = $request->validate([
            'tenant_id' => 'required|exists:tenants,id',
            'tenant_book_id' => 'required|exists:tenant_books,id',
            'total_sewa' => 'required|numeric',
            'persen_dp' => 'required|numeric',
            'total_dp' => 'required|numeric',
            'persen_cicilan' => 'required|numeric',
            'total_cicilan' => 'required|numeric',
            'lama_cicilan' => 'required|integer',
            'tgl_opening' => 'nullable|date',
            'grace_period' => 'required|integer',
            'extend_period' => 'required|integer',
            'payment_dp' => 'nullable|array',
            'sign_id' => 'nullable|exists:signs,id',
            'client_nama' => 'nullable|string|max:255',
            'client_jabatan' => 'nullable|string|max:255',
            'deposits' => 'nullable|array',
        ]);

        // Cek apakah data pembayaran sudah ada berdasarkan tenant_id dan tenant_book_id
        $payment = Payment::where('tenant_id', $validated['tenant_id'])
            ->where('tenant_book_id', $validated['tenant_book_id'])
            ->first();

        $paymentData = [
            'total_sewa' => $validated['total_sewa'],
            'persen_dp' => $validated['persen_dp'],
            'total_dp' => $validated['total_dp'],
            'sisa_dp' => $validated['total_dp'],
            'persen_cicilan' => $validated['persen_cicilan'],
            'total_cicilan' => $validated['total_cicilan'],
            'sisa_cicilan' => $validated['total_cicilan'],
            'lama_cicilan' => $validated['lama_cicilan'],
            'tgl_opening' => $validated['tgl_opening'],
            'grace_period' => $validated['grace_period'],
            'extend_period' => $validated['extend_period'],
            'notif' => 3,
            'sign_id' => $validated['sign_id'],
            'client_nama' => $validated['client_nama'],
            'client_jabatan' => $validated['client_jabatan'],
        ];

        if ($payment) {
            // Jika data sudah ada, lakukan update
            $payment->update($paymentData);
        } else {
            // Jika data belum ada, buat data baru dan merge dengan tenant_id dan tenant_book_id
            $mergedData = array_merge([
                'tenant_id' => $validated['tenant_id'],
                'tenant_book_id' => $validated['tenant_book_id'],
            ], $paymentData);

            $payment = Payment::create($mergedData);
        }

        // Simulasi pembayaran
        $this->simulatePaymentDeposit($payment->id, $validated['deposits']);
        $this->simulatePaymentDp($payment->id, $validated['payment_dp']);
        $this->simulatePaymentSewa($payment);

        // Kembalikan data ke halaman create dengan data yang baru saja disimpan
        return redirect()->route('tenant-payments.create')->with('payment', $payment)->with('success', 'Payment setup berhasil');
    }

    private function simulatePaymentDeposit($paymentId, $deposits)
    {
        // Simulasi pembayaran deposit
        if (empty($deposits)) {
            return; // Tidak ada deposit yang perlu disimulasikan
        }

        // Hapus data deposit sebelumnya
        PaymentDeposit::where('payment_id', $paymentId)->forceDelete();

        foreach ($deposits as $k => $v) {
            $data = new PaymentDeposit();
            $data->payment_id = $paymentId;
            $data->ke = $k + 1;
            $data->deposit = $v['deposit'];
            $data->tgl = $v['tgl'];
            $data->ket = $v['ket'];
            $data->jumlah = $v['jumlah'];
            $data->sisa = $v['sisa'];
            $data->save();
        }
    }

    private function simulatePaymentDp($paymentId, $paymentDp)
    {
        // Simulasi pembayaran DP
        if (empty($paymentDp)) {
            return; // Tidak ada DP yang perlu disimulasikan
        }

        PaymentDp::where('payment_id', $paymentId)->forceDelete();

        foreach ($paymentDp as $k => $dp) {
            $data = new PaymentDp();
            $data->payment_id = $paymentId;
            $data->ke = $k + 1;
            $data->tgl = $dp['tgl'];
            $data->ket = $dp['ket'];
            $data->persen = $dp['persen'];
            $data->jumlah = $dp['jumlah'];
            $data->sisa = $dp['sisa'];
            $data->save();
        }
    }

    private function simulatePaymentSewa($payment)
    {
        // Simulasi pembayaran sewa
        PaymentSewa::where('payment_id', $payment->id)->forceDelete();

        $totalCicilan = $payment->total_cicilan;
        $sisaCicilan = $payment->sisa_cicilan;
        $lamaCicilan = $payment->lama_cicilan;
        $cicilanPerBulan = round($totalCicilan / $lamaCicilan, 2);

        // simpan grace period jika ada
        if ($payment->grace_period < 0) {
            $payment->grace_period = 0; // Pastikan grace period tidak negatif
        }

        $tglStart = $payment->tgl_opening ?? now();
        $tglDay = Carbon::parse($tglStart)->format('d');

        for ($i = 1; $i <= $payment->grace_period; $i++) {
            $data = new PaymentSewa();
            $data->payment_id = $payment->id;
            $data->ke = 0; // Cicilan ke-0 untuk grace period
            $data->tgl = $tglStart;
            $data->ket = 'Grace Period ' . $i;
            $data->jumlah = 0; // Tidak ada pembayaran selama grace period
            $data->sisa = $sisaCicilan; // Sisa cicilan tetap sama
            $data->is_paid = 1; // Status pembayaran, 0 berarti belum dibayar
            $data->save();

            $tglStart = $this->addMonth($tglStart, $tglDay);
        }

        for ($i = 1; $i <= $lamaCicilan; $i++) {
            $data = new PaymentSewa();
            $data->payment_id = $payment->id;
            $data->ke = $i;
            $data->tgl = $tglStart;
            $data->ket = 'Cicilan Sewa ke-' . $i;
            $data->jumlah = $cicilanPerBulan;
            $data->sisa = $sisaCicilan - ($cicilanPerBulan * $i);
            $data->is_paid = 0; // Status pembayaran, 0 berarti belum dibayar
            $data->save();

            $tglStart = $this->addMonth($tglStart, $tglDay);
        }
    }

    private function addMonth($cDate, $cDay)
    {
        $cMonth = Date("Y-m", strtotime($cDate));
        $nMonth = Date("Y-m", strtotime($cMonth . ' +1 month'));

        $nMonthFull = Date("Y-m-t", strtotime($nMonth));
        $nLastDay = Date("d", strtotime($nMonthFull)); // Last day of month

        $nDay = ($cDay > $nLastDay) ? $nLastDay : $cDay;
        $nDayFull = Date("Y-m-d", strtotime($nMonth . '-' . $nDay));

        return $nDayFull;
    }

    public function destroy($id)
    {
        $payment = Payment::findOrFail($id);
        $payment->delete();

        return redirect()->route('tenant-payments.index')->with('success', 'Payment berhasil dihapus');
    }
}
