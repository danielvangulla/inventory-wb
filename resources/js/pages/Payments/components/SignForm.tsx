import { Sign } from "@/pages/components/pdfModel";
import Select from "react-select";

interface SignFormProps {
    sign1Options: Sign[];
    selectedSign1: Sign;
    setSign1: (selectedOption: Sign | null) => void;
    sign2Nama: string;
    setSign2Nama: (data: string) => void;
    sign2Jabatan: string;
    setSign2Jabatan: (data: string) => void;
}

const SignForm: React.FC<SignFormProps> = ({ sign1Options, selectedSign1, setSign1, sign2Nama, setSign2Nama, sign2Jabatan, setSign2Jabatan }) => {
    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-black dark:border-gray-600 text-sm">

            <div className="flex flex-col bg-blue-200 p-1 rounded-lg">
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 pl-1">
                    Nama Penyewa
                </label>
                <input
                    type="text"
                    value={sign2Nama}
                    onChange={(e) => setSign2Nama(e.target.value)}
                    className={`w-full rounded-md border border-gray-300 p-2 bg-white`}
                    placeholder=''
                />
            </div>

            <div className="flex flex-col bg-blue-200 p-1 rounded-lg">
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 pl-1">
                    Jabatan Penyewa
                </label>
                <input
                    type="text"
                    value={sign2Jabatan}
                    onChange={(e) => setSign2Jabatan(e.target.value)}
                    className={`w-full rounded-md border border-gray-300 p-2 bg-white`}
                    placeholder=''
                />
            </div>

            <div className="flex flex-col bg-blue-200 p-1 rounded-lg">
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 pl-1">
                    Tandatangan oleh
                </label>
                <Select
                    options={sign1Options} // options for the select dropdown
                    value={selectedSign1} // currently selected option
                    onChange={setSign1} // function to call when an option is selected
                    getOptionLabel={(e) => e.nama} // specify what to display
                    getOptionValue={(e) => e.jabatan} // specify value to track
                    placeholder="Pilih TTD"
                    className="react-select-container"
                    classNamePrefix="react-select"
                    menuPlacement="top"
                />
            </div>

        </div>
    );
}

export default SignForm;
