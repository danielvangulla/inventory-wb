<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class KartuStok extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'tgl',
        'barang_id',
        'masuk',
        'keluar',
        'rusak',
        'opname',
        'sisa',
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
}
