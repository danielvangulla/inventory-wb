<?php

namespace App\Http\Controllers;

use App\Models\InvoiceOtherType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class InvoiceOtherSetupController extends Controller
{
    private function indexOthersSetupData()
    {
        $data = InvoiceOtherType::all();

        return [
            'data' => $data
        ];
    }

    public function index()
    {
        return Inertia('Invoices/others/setup/index', $this->indexOthersSetupData());
    }

    public function store(Request $r)
    {
        $validator = Validator::make($r->all(), [
            'id' => 'integer',
            'tipe' => 'required|string|max:255',
            'ket' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return Inertia('Invoices/others/setup/index', [
                'message' => __('Error saving data'),
                'error' => $validator->errors()->all(),
            ]);
        }

        try {
            $data = [
                'tipe' => $r->input('tipe'),
                'ket' => $r->input('ket'),
            ];

            if ($r->input('id') > 0) {
                // update
                $tipe = InvoiceOtherType::find($r->input('id'));
                if ($tipe)
                    $tipe->update($data);
            } else {
                InvoiceOtherType::create($data);
            }

            return inertia('Invoices/others/setup/index', $this->indexOthersSetupData());
        } catch (\Throwable $th) {
            return inertia('Invoices/others/setup/index', [
                'message' => __('Error saving data'),
                'error' => $th->getMessage(),
            ]);
        }

        return redirect()->back()->with('success', 'Invoice type created successfully.');
    }

    public function edit($id)
    {
        // Logic for showing the edit form
    }

    public function update(Request $r, $id)
    {
        // Logic for updating an existing invoice setup
    }

    public function destroy($id)
    {
        // Logic for deleting an invoice setup
    }
}
