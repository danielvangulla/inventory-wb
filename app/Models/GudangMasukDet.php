<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class GudangMasukDet extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'gudang_masuk_id',
        'barang_id',
        'harga',
        'qty',
        'brutto',
        'disc',
        'netto',
        'tax',
        'total',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public function barang()
    {
        return $this->belongsTo(Barang::class);
    }

    public function gudangMasuk()
    {
        return $this->belongsTo(GudangMasuk::class);
    }
}
