<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BarangRusakDet extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'barang_rusak_id',
        'barang_id',
        'qty',
        'harga',
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

    public function barangRusak()
    {
        return $this->belongsTo(BarangRusak::class);
    }
}
