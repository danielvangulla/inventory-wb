/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

// pages/Payments/components/create/MainFormFields.tsx
import { formatDateForInput, formatUang } from '@/pages/components/helpers';
import React, { useEffect } from 'react';

interface MainFormFieldsProps {
    data: Record<string, any>;
    setData: (name: string, value: any) => void;
    countDetail: number;
}

const MainFormFields: React.FC<MainFormFieldsProps> = ({ data, setData, countDetail }) => {
    const handlePersenDpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value === "" ? "" : (+e.target.value > 100 ? 100 : (+e.target.value < 0 ? 0 : +e.target.value));

        if (value === "") {
            setData('persen_dp', "");
            setData('total_dp', "");
            return;
        }
        setData('total_dp', (value * data.total_sewa / 100).toFixed(0));
        setData('persen_dp', value);
    };

    const handleTotalDpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value === "" ? "" : (+e.target.value < 0 ? 0 : (+e.target.value > data.total_sewa ? data.total_sewa : +e.target.value));
        if (value === "") {
            setData('total_dp', "");
            setData('persen_dp', "");
            return;
        }

        setData('total_dp', value);
        setData('persen_dp', (value * 100 / data.total_sewa).toFixed(2));
    };

    useEffect(() => {
        const totalCicilan = data.total_sewa - data.total_dp;

        setData('total_cicilan', totalCicilan);
        setData('persen_cicilan', 100 - data.persen_dp);
        setData('cicilan_sewa', totalCicilan / data.lama_cicilan);
    }, [data.persen_dp, data.lama_cicilan, data.total_sewa]);

    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-black dark:border-gray-600 text-sm">

            <div className="flex flex-col">
                <div className="flex flex-col bg-blue-200 p-1 rounded-lg">
                    <label className="block text-gray-700 mb-1 pl-1">Uang Muka Sewa (%)</label>
                    <input
                        type="number"
                        min={0}
                        max={100}
                        step={0.01}
                        placeholder="0.00"
                        value={data.persen_dp}
                        onChange={handlePersenDpChange}
                        className={`w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${countDetail > 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-white'}`}
                        disabled={countDetail > 0}
                    />
                </div>
            </div>

            <div className="flex flex-col">
                <div className="flex flex-col bg-blue-200 p-1 rounded-lg">
                    <label className="block text-gray-700 mb-1 pl-1">Total Uang Muka Sewa (Rp)</label>
                    <input
                        type="number"
                        value={data.total_dp}
                        onChange={handleTotalDpChange}
                        className={`w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${countDetail > 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-white'}`}
                        disabled={countDetail > 0}
                    />
                </div>
            </div>

            <div className="flex flex-col">
                <div className="flex flex-col bg-gray-200 p-1 rounded-lg">
                    <label className="block text-gray-700 mb-1 pl-1">Cicilan Sewa (%)</label>
                    <input
                        type="text"
                        value={data.persen_cicilan}
                        onChange={(e) => setData('persen_cicilan', e.target.value === "" ? "" : +e.target.value)}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-300 cursor-not-allowed"
                        disabled={true}
                    />
                </div>
            </div>

            <div className="flex flex-col">
                <div className="flex flex-col bg-gray-200 p-1 rounded-lg">
                    <label className="block text-gray-700 mb-1 pl-1">Total Cicilan Sewa (Rp)</label>
                    <input
                        type="text"
                        value={formatUang(data.total_cicilan)}
                        onChange={() => { }}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-300 cursor-not-allowed"
                        disabled={true}
                    />
                </div>
            </div>

            <div className="flex flex-col">
                <div className="flex flex-col bg-blue-200 p-1 rounded-lg">
                    <label className="block text-gray-700 mb-1 pl-1">Lama Cicilan (bulan)</label>
                    <input
                        type="text"
                        value={data.lama_cicilan}
                        onChange={(e) => setData('lama_cicilan', e.target.value === "" ? "" : +e.target.value)}
                        className={`w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white`}
                        disabled={false}
                    />
                </div>
            </div>

            <div className="flex flex-col">
                <div className="flex flex-col bg-gray-200 p-1 rounded-lg">
                    <label className="block text-gray-700 mb-1 pl-1">Cicilan Sewa / bulan</label>
                    <input
                        type="text"
                        value={formatUang(data.cicilan_sewa)}
                        onChange={() => { }}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-300 cursor-not-allowed"
                        disabled={true}
                    />
                </div>
            </div>

            <div className="flex flex-col">
                <div className="flex flex-col bg-blue-200 p-1 rounded-lg">
                    <label className="block text-gray-700 mb-1 pl-1">Tanggal Opening</label>
                    <input
                        type="date"
                        value={formatDateForInput(data.tgl_opening)}
                        onChange={(e) => setData('tgl_opening', e.target.value)}
                        className={`w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white`}
                        disabled={false}
                    />
                </div>
            </div>

            <div className="flex flex-col">
                <div className="flex flex-col bg-blue-200 p-1 rounded-lg">
                    <label className="block text-gray-700 mb-1 pl-1">Grace Period (bulan)</label>
                    <input
                        type="number"
                        value={data.grace_period}
                        onChange={(e) => setData('grace_period', e.target.value === "" ? "" : (+e.target.value < 0 ? 0 : +e.target.value))}
                        className={`w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white`}
                        disabled={false}
                    />
                </div>
            </div>

            <div className="flex flex-col">
                <div className="flex flex-col bg-blue-200 p-1 rounded-lg">
                    <label className="block text-gray-700 mb-1 pl-1">Extend Period ?</label>
                    <select
                        value={data.extend_period}
                        onChange={(e) => setData('extend_period', +e.target.value)}
                        className={`w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white`}
                    >
                        <option value="0">Tidak</option>
                        <option value="1">Ya</option>
                    </select>
                </div>
            </div>

        </div>
    );
};

export default MainFormFields;
