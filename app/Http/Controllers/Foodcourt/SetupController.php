<?php

namespace App\Http\Controllers\Foodcourt;

use App\Http\Controllers\Controller;
use App\Models\Setup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SetupController extends Controller
{
    protected $view = 'Foodcourt/Setup';
    protected $route = 'foodcourt.setup';

    public function __construct() {
        $user = Auth::user();
        $level = $user ? $user->level : null;

        if (!($user && $level && $level->is_admin)) {
            abort(403, 'Akses tidak diizinkan.');
        }
    }

    public function index()
    {
        $setup = Setup::orderBy('readonly_key', 'desc')
            ->orderBy('key')
            ->get();

        return inertia("$this->view/Index", [
            'setup' => $setup,
        ]);
    }

    public function create()
    {
        return inertia("$this->view/Create");
    }

    public function store(Request $request)
    {
        $request->validate([
            'key' => 'required|unique:setups,key',
            'value' => 'required',
            'readonly_key' => 'boolean',
            'readonly_value' => 'boolean',
        ]);

        Setup::create($request->only('key', 'value', 'readonly_key', 'readonly_value'));

        return redirect()->route("$this->route.index")->with('success', 'Setup berhasil ditambahkan.');
    }

    public function show($id)
    {
        return redirect()->route("$this->route.index");
    }

    public function edit($id)
    {
        $setup = Setup::findOrFail($id);

        return inertia("$this->view/Edit", [
            'setup' => $setup,
        ]);
    }

    public function update(Request $request, $id)
    {
        $setup = Setup::findOrFail($id);

        $request->validate([
            'key' => 'required|unique:setups,key,' . $setup->id,
            'value' => 'required',
            'readonly_key' => 'boolean',
            'readonly_value' => 'boolean',
        ]);

        $setup->update($request->only('key', 'value', 'readonly_key', 'readonly_value'));

        return redirect()->route("$this->route.index")->with('success', 'Setup berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $setup = Setup::findOrFail($id);
        $setup->delete();

        return redirect()->route("$this->route.index")->with('success', 'Setup berhasil dihapus.');
    }
}
