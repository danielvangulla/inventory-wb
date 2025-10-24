<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Opname extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'tgl',
        'catatan',
        'barang_id',
        'harga',
        'qty_sistem',
        'qty_fisik',
        'qty_selisih',
        'selisih_rp',
        'user_id',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public function barang()
    {
        return $this->belongsTo(Barang::class, 'barang_id');
    }
}
