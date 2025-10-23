<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Transaksi extends Model
{
    use SoftDeletes;

    protected $table = 'transaksis';

    protected $fillable = [
        'user_id',
        'tgl',
        'brutto',
        'disc',
        'netto',
        'tax',
        'service',
        'card_charge',
        'total',
        'jenis_bayar',
        'channel_bayar',
        'uang_cash',
        'kembalian',
        'card_no',
    ];

    public function items()
    {
        return $this->hasMany(TransaksiItem::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function uservoid()
    {
        return $this->belongsTo(User::class, 'user_void_id');
    }
}
