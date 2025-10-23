<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TransaksiItem extends Model
{
    use SoftDeletes;

    protected $table = 'transaksi_items';

    protected $fillable = [
        'transaksi_id',
        'menu_id',
        'order_code',
        'alias',
        'harga',
        'qty',
        'brutto',
        'disc',
        'netto',
        'tax',
        'service',
        'total',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public function transaksi()
    {
        return $this->belongsTo(Transaksi::class);
    }

    public function menu()
    {
        return $this->belongsTo(Menu::class);
    }
}
