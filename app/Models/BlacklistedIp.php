<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlacklistedIp extends Model
{
    use HasFactory;

    protected $fillable = [
        'check_count',
        'ip_address',
        'country',
        'isp',
        'usage',
        'domain',
        'abuse_score'
    ];
}
