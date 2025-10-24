<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class GudangMasuk extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'tgl',
        'supplier_id',
        'penerima',
        'brutto',
        'disc',
        'netto',
        'tax',
        'total',
        'jenis_bayar',
        'due',
        'is_lunas',
        'tgl_lunas',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    protected static function booted()
    {
        static::addGlobalScope('urut', function (Builder $builder) {
            $builder->orderBy('tgl', 'desc')->orderBy('id', 'desc');
        });
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }
}
