<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class GudangKeluar extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'tgl',
        'outlet_id',
        'menyerahkan',
        'mengambil',
        'mengantar',
        'total',
    ];

    protected $hidden = [
        'updated_at',
        'deleted_at',
    ];

    protected static function booted()
    {
        static::addGlobalScope('urut', function (Builder $builder) {
            $builder->orderBy('tgl', 'desc')->orderBy('id', 'desc');
        });
    }

    public function outlet()
    {
        return $this->belongsTo(Outlet::class);
    }

    public function details()
    {
        return $this->hasMany(GudangKeluarDet::class);
    }
}
