<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;

class Kategori extends Model
{
    use SoftDeletes;

    protected $table = 'kategoris';

    protected $fillable = [
        'ket',
        'urut',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    // default order by urut, id
    protected static function booted()
    {
        static::addGlobalScope('urut', function (Builder $builder) {
            $builder->orderBy('urut')->orderBy('id');
        });
    }

    public function kategorisub()
    {
        return $this->hasMany(Kategorisub::class, 'kategori_id');
    }
}
