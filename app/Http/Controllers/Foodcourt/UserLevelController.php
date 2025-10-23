<?php

namespace App\Http\Controllers\Foodcourt;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserLevel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserLevelController extends Controller
{
    protected $view = 'Foodcourt/UserLevel';
    protected $route = 'foodcourt.user-level';

    public function __construct() {
        $user = Auth::user();
        $level = $user ? $user->level : null;

        if (!($user && $level && $level->is_admin)) {
            abort(403, 'Akses tidak diizinkan.');
        }
    }

    public function index()
    {
        $level = UserLevel::all();

        return inertia("$this->view/Index", [
            'level' => $level,
        ]);
    }

    public function create()
    {
        return inertia("$this->view/Create");
    }

    public function store(Request $r)
    {
        $validated = $r->validate([
            'name' => 'required|string|max:255',
            'ket' => 'nullable|string|max:255',
            'is_admin' => 'required|boolean',
            'basic_read' => 'required|boolean',
            'basic_write' => 'required|boolean',
            'tenant_read' => 'required|boolean',
            'tenant_write' => 'required|boolean',
            'menu_read' => 'required|boolean',
            'menu_write' => 'required|boolean',
            'kasir' => 'required|boolean',
            'spv' => 'required|boolean',
        ]);

        UserLevel::create($validated);

        return redirect()->route("$this->route.index")->with('success', 'Level created successfully.');
    }

    public function show($id)
    {
        return redirect()->route("$this->route.index");
    }

    public function edit($id)
    {
        $level = UserLevel::findOrFail($id);

        return inertia("$this->view/Edit", [
            'level' => $level,
        ]);
    }

    public function update(Request $r, $id)
    {
        $level = UserLevel::findOrFail($id);

        $validated = $r->validate([
            'name' => 'required|string|max:255',
            'ket' => 'nullable|string|max:255',
            'is_admin' => 'required|boolean',
            'basic_read' => 'required|boolean',
            'basic_write' => 'required|boolean',
            'tenant_read' => 'required|boolean',
            'tenant_write' => 'required|boolean',
            'menu_read' => 'required|boolean',
            'menu_write' => 'required|boolean',
            'kasir' => 'required|boolean',
            'spv' => 'required|boolean',
        ]);

        $level->update($validated);

        return redirect()->route("$this->route.index")->with('success', 'Level updated successfully.');
    }

    public function destroy($id)
    {
        $level = UserLevel::findOrFail($id);

        // Check if any users are assigned to this level
        $userCount = User::where('user_level_id', $level->id)->count();
        if ($userCount > 0) {
            return redirect()->route("$this->route.index")->with('error', 'Tidak bisa menghapus level yang sedang digunakan oleh user.');
        }

        $level->delete();

        return redirect()->route("$this->route.index")->with('success', 'Level deleted successfully.');
    }
}
