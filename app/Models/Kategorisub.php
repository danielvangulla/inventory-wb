<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Kategorisub extends Model
{
    use SoftDeletes;

    protected $table = 'kategorisubs';

    protected $fillable = [
        'kategori_id',
        'ket',
        'urut',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    // default order by kategori_id, urut, id
    protected static function booted()
    {
        static::addGlobalScope('urut', function ($builder) {
            $builder->orderBy('kategori_id')->orderBy('urut')->orderBy('id');
        });
    }

    public function kategori()
    {
        return $this->belongsTo(Kategori::class);
    }
}
