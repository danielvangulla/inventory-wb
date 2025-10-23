<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;

class Menu extends Model
{
    use SoftDeletes;

    protected $table = 'menus';

    protected $fillable = [
        'sku',
        'tenant_id',
        'kategorisub_id',
        'alias',
        'deskripsi',
        'harga',
        'is_ready',
        'is_soldout',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    // default order by tenant_id, alias
    protected static function booted()
    {
        static::addGlobalScope('defaultOrder', function (Builder $builder) {
            $builder->where('sku', '!=', '')->orderBy('tenant_id')->orderBy('alias');
        });
    }

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function kategorisub()
    {
        return $this->belongsTo(Kategorisub::class);
    }
}
