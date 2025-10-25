<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class OpnameDet extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'opname_id',
        'barang_id',
        'harga',
        'qty_sistem',
        'qty_fisik',
        'qty_selisih',
        'selisih_rp',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public function opname()
    {
        return $this->belongsTo(Opname::class, 'opname_id');
    }

    public function barang()
    {
        return $this->belongsTo(Barang::class, 'barang_id');
    }
}
