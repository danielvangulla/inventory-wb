<?php

namespace App\Http\Controllers\Tenants;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Tenant;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TenantController extends Controller
{
    public function index($floor)
    {
        // Fetch tenants directly using DB facade
        $tenants = DB::table('tenants')->where('floor', $floor)->orderBy('st_layer')->get();

        // Return the tenants to the Inertia React page
        return Inertia::render('Tenants/index', [
            'tenants' => $tenants,
        ]);
    }

    public function create()
    {
        return Inertia::render('Tenants/TenantAdd');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'description' => 'nullable|string',
            'floor' => 'required|string',
            'st_layer' => 'required|integer',
            'height' => 'required|numeric',
            'width' => 'required|numeric',
            'margin_left' => 'required|numeric',
            'margin_top' => 'required|numeric',
            'rotate' => 'nullable|numeric',
            'st_static' => 'boolean',
        ]);

        Tenant::create($validated);

        return redirect()->route('dashboard')->with('success', 'Tenant created successfully.');
    }

    public function edit($id)
    {
        // Fetch the tenant by ID
        $tenant = Tenant::find($id);

        if ($tenant) {
            return Inertia::render('Tenants/TenantEdit', [
                'tenant' => $tenant,
            ]);
        }

        return redirect()->route('tenants.index')->with('error', 'Tenant not found');
    }

    public function update(Request $request, $id)
    {
        // Validate the incoming request
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'floor' => 'required|integer',
            'st_layer' => 'required|integer',
            'height' => 'required|numeric',
            'width' => 'required|numeric',
            'margin_left' => 'required|numeric',
            'margin_top' => 'required|numeric',
        ]);

        // Find the tenant by ID and update its details
        $tenant = Tenant::find($id);

        if ($tenant) {
            $tenant->update($validated);
            return redirect()->route('tenants.index')->with('success', 'Tenant updated successfully');
        }

        return redirect()->route('tenants.index')->with('error', 'Tenant not found');
    }

    public function destroy($id)
    {
        // Find the tenant by ID and delete it
        $tenant = Tenant::find($id);

        if ($tenant) {
            $tenant->delete();
            return redirect()->route('tenants.index')->with('success', 'Tenant deleted successfully');
        }

        return redirect()->route('tenants.index')->with('error', 'Tenant not found');
    }

    public function updatePosition(Request $request, $id)
    {
        // Validate the incoming request
        $validated = $request->validate([
            'height' => 'required|numeric',
            'width' => 'required|numeric',
            'margin_left' => 'required|numeric',
            'margin_top' => 'required|numeric',
        ]);

        // Find the tenant by ID and update its position
        $tenant = Tenant::find($id);

        if ($tenant) {
            $tenant->height = $validated['height'];
            $tenant->width = $validated['width'];
            $tenant->margin_left = $validated['margin_left'];
            $tenant->margin_top = $validated['margin_top'];
            $tenant->save();

            return response()->json(['message' => 'Position updated successfully']);
        }

        return response()->json(['message' => 'Tenant not found'], 404);
    }
}
