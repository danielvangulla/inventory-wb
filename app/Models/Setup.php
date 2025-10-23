<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setup extends Model
{
    protected $table = 'setups';

    protected $fillable = ['key', 'value'];
}
