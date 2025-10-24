<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class GudangKeluarDet extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'gudang_keluar_id',
        'barang_id',
        'harga',
        'qty',
        'total',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public function gudangKeluar()
    {
        return $this->belongsTo(GudangKeluar::class);
    }
}
