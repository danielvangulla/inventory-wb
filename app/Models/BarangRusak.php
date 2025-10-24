<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BarangRusak extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'deskripsi',
        'kategori_id',
        'kategorisub_id',
        'stok',
        'min_stok',
        'satuan',
        'isi',
        'harga_beli',
        'harga_jual',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    protected static function booted()
    {
        static::addGlobalScope('urut', function (Builder $builder) {
            $builder->orderBy('deskripsi');
        });
    }

    public function kategori()
    {
        return $this->belongsTo(Kategori::class);
    }

    public function kategorisub()
    {
        return $this->belongsTo(Kategorisub::class);
    }
}
