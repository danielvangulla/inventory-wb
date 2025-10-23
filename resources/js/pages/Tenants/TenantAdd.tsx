import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';

const TenantAdd = () => {
    const { data, setData, post, processing } = useForm({
        title: '',
        description: '',
        floor: '',
        st_layer: 0,
        height: 0,
        width: 0,
        margin_left: 0,
        margin_top: 0,
        rotate: 0,
        st_static: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/space-add');
    };

    return (
        <AppLayout>
            <Head title="Add Tenant" />
            <div className="p-4 max-w-xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">Add New Tenant</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Title" value={data.title} onChange={e => setData('title', e.target.value)} className="w-full border p-2" />
                    <textarea placeholder="Description" value={data.description} onChange={e => setData('description', e.target.value)} className="w-full border p-2" />
                    <input type="number" placeholder="Floor" value={data.floor} onChange={e => setData('floor', e.target.value)} className="w-full border p-2" />
                    <input type="number" placeholder="Layer" value={data.st_layer} onChange={e => setData('st_layer', +e.target.value)} className="w-full border p-2" />
                    <input type="number" placeholder="Height" value={data.height} onChange={e => setData('height', +e.target.value)} className="w-full border p-2" />
                    <input type="number" placeholder="Width" value={data.width} onChange={e => setData('width', +e.target.value)} className="w-full border p-2" />
                    <input type="number" placeholder="Margin Left" value={data.margin_left} onChange={e => setData('margin_left', +e.target.value)} className="w-full border p-2" />
                    <input type="number" placeholder="Margin Top" value={data.margin_top} onChange={e => setData('margin_top', +e.target.value)} className="w-full border p-2" />
                    <input type="number" placeholder="Rotate" value={data.rotate} onChange={e => setData('rotate', +e.target.value)} className="w-full border p-2" />
                    <label className="block">
                        <input type="checkbox" checked={data.st_static} onChange={e => setData('st_static', e.target.checked)} />
                        <span className="ml-2">Static Tenant?</span>
                    </label>
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={processing}>Submit</button>
                </form>
            </div>
        </AppLayout>
    );
};

export default TenantAdd;
