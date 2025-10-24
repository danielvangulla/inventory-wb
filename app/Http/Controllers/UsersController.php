<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserLevel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UsersController extends Controller
{
    protected $view = 'Inventory/Users';
    protected $route = 'inventory.users';

    public function __construct() {
        $user = Auth::user();
        $level = $user ? $user->level : null;

        if (!($user && $level && $level->is_admin)) {
            abort(403, 'Akses tidak diizinkan.');
        }
    }

    public function index()
    {
        $users = User::select('id', 'name', 'user_level_id')
            ->with('level:id,name')
            ->orderBy('user_level_id')
            ->orderBy('name')
            ->get();

        return inertia("$this->view/Index", [
            'users' => $users
        ]);
    }

    public function create()
    {
        $levels = UserLevel::all();

        return inertia("$this->view/Create", [
            'levels' => $levels,
        ]);
    }

    public function store(Request $r)
    {
        $validated = $r->validate([
            'name' => 'required|string|max:255',
            'password' => 'required|string|min:8|confirmed',
            'user_level_id' => 'required|exists:user_levels,id',
        ]);

        $validated['password'] = bcrypt($validated['password']);
        $validated['email'] = $r->input('email', $r->input('name') . '@mail.com');

        User::create($validated);

        return redirect()->route("$this->route.index")->with('success', 'User created successfully.');
    }

    public function show($id)
    {
        return redirect()->route("$this->route.index");
    }

    public function edit($id)
    {
        $user = User::findOrFail($id);
        $levels = UserLevel::all();

        return inertia("$this->view/Edit", [
            'user' => $user,
            'levels' => $levels,
        ]);
    }

    public function update(Request $r, $id)
    {
        $user = User::findOrFail($id);

        $validated = $r->validate([
            'name' => 'required|string|max:255',
            'password' => 'nullable|string|min:8|confirmed',
            'user_level_id' => 'required|exists:user_levels,id',
        ]);

        if ($r->filled('password')) {
            $validated['password'] = bcrypt($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return redirect()->route("$this->route.index")->with('success', 'User updated successfully.');
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return redirect()->route("$this->route.index")->with('success', 'User deleted successfully.');
    }
}
