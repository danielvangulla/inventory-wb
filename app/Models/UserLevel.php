<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class UserLevel extends Model
{
    protected $fillable = [
        'name',
        'ket',
        'is_admin',
        'basic_read',
        'basic_write',
        'tenant_read',
        'tenant_write',
        'menu_read',
        'menu_write',
        'kasir',
        'spv',
        'laporan',
    ];

    protected $casts = [
        'is_admin' => 'boolean',
        'basic_read' => 'boolean',
        'basic_write' => 'boolean',
        'tenant_read' => 'boolean',
        'tenant_write' => 'boolean',
        'menu_read' => 'boolean',
        'menu_write' => 'boolean',
        'kasir' => 'boolean',
        'spv' => 'boolean',
        'laporan' => 'boolean',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public static function currentLevel()
    {
        $user = fn () => Auth::user();
        $level = fn () => UserLevel::select([
            'is_admin',
            'basic_read',
            'basic_write',
            'tenant_read',
            'tenant_write',
            'menu_read',
            'menu_write',
            'kasir',
            'spv',
            'laporan',
        ])->find($user() ? $user()->user_level_id : null);

        return $level;
    }
}
