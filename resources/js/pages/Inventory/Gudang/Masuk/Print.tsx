import React from "react";
import { GudangMasuk } from "../../models";

interface Props {
    data: GudangMasuk;
    canWrite: boolean;
}

const Print: React.FC<Props> = ({ data, canWrite }) => {
    return (
        <div>
            <h1>Print Gudang Masuk</h1>
            <p>Penerima: {data.penerima}</p>
            <p>Supplier: {data.supplier?.nama}</p>
            <h2>Details:</h2>
            <ul>
                {data.details?.map((v) => (
                    <li key={v.id}>
                        {v.barang?.deskripsi} - {v.qty} {v.barang?.satuan}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Print;
