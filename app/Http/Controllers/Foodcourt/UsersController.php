<?php

namespace App\Http\Controllers\Foodcourt;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\User;
use App\Models\UserLevel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UsersController extends Controller
{
    protected $view = 'Foodcourt/Users';
    protected $route = 'foodcourt.users';

    public function __construct() {
        $user = Auth::user();
        $level = $user ? $user->level : null;

        if (!($user && $level && $level->is_admin)) {
            abort(403, 'Akses tidak diizinkan.');
        }
    }

    public function index()
    {
        $users = User::select('id', 'name', 'user_level_id', 'tenant_id')
            ->with('level:id,name')
            ->with('tenant:id,nama_tenant')
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
        $tenants = Tenant::all();

        return inertia("$this->view/Create", [
            'levels' => $levels,
            'tenants' => $tenants
        ]);
    }

    public function store(Request $r)
    {
        $validated = $r->validate([
            'name' => 'required|string|max:255',
            'password' => 'required|string|min:8|confirmed',
            'user_level_id' => 'required|exists:user_levels,id',
            'tenant_id' => 'nullable|exists:tenants,id',
        ]);

        $validated['password'] = bcrypt($validated['password']);
        $validated['email'] = $r->input('email', $r->input('name') . '@paragonfc.com');

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
        $tenants = Tenant::all();

        return inertia("$this->view/Edit", [
            'user' => $user,
            'levels' => $levels,
            'tenants' => $tenants
        ]);
    }

    public function update(Request $r, $id)
    {
        $user = User::findOrFail($id);

        $validated = $r->validate([
            'name' => 'required|string|max:255',
            'password' => 'nullable|string|min:8|confirmed',
            'user_level_id' => 'required|exists:user_levels,id',
            'tenant_id' => 'required|exists:tenants,id',
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
