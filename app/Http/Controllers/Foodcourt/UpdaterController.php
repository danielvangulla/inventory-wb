<?php

namespace App\Http\Controllers\Foodcourt;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UpdaterController extends Controller
{
    public function __construct(Request $request)
    {
        // Middleware or authentication logic can be added here if needed
    }

    public function check()
    {
        return response()->json([
            'status' => 'success',
            'message' => 'No updates available.',
        ]);
    }
}
