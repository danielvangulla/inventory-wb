import { ArrowLeft, SendIcon } from 'lucide-react';
import React, { useEffect } from 'react';
import { formatNumber } from '../functions';

interface Props {
    visible: boolean;
    onClose: () => void;
    onSubmit: (value: string) => void;
}

const NumpadModal: React.FC<Props> = ({ visible, onClose, onSubmit }) => {
    const [input, setInput] = React.useState('');

    const handleNumberClick = (num: string) => {
        setInput((prev) => prev + num);
    };

    const handleBackspace = () => {
        setInput((prev) => prev.slice(0, -1));
    }

    const handleOk = () => {
        onSubmit(input);
        setInput('');
        onClose();
    };

    const handleEnter = (e: KeyboardEvent) => {
        if (visible && e.key === 'Enter') {
            e.preventDefault();

            onSubmit(input);
            setInput('');
            onClose();
        }

        window.removeEventListener('keydown', handleEnter);
    }

    window.addEventListener('keydown', handleEnter);

    useEffect(() => {
        const handleKeydown = (e: KeyboardEvent) => {
            e.preventDefault();

            if (e.key >= '0' && e.key <= '9') {
                if (visible)
                    handleNumberClick(e.key);
            }

            // key Backspace
            if (e.key === 'Backspace') {
                if (visible)
                    setInput((prev) => prev.slice(0, -1));
            }

            // key Delete
            if (e.key === 'Delete') {
                if (visible)
                    setInput('');
            }
        };

        if (visible)
            window.addEventListener('keydown', handleKeydown);

        return () => {
            setInput('');
            window.removeEventListener('keydown', handleKeydown);
        };
    }, [visible]);

    if (!visible) return null;

    return (
        <div className='fixed inset-0 flex items-center justify-center z-50 bg-black/60'>

            <div className='flex flex-col justify-center items-center bg-gray-800 p-4 rounded-lg border-2 border-gray-400'>

                <div className='w-full border-2 border-blue-400 rounded-lg text-center bg-white mb-4 py-2 text-2xl font-bold text-gray-800'>
                    {formatNumber(+input, 0)}
                </div>

                <div className='grid grid-cols-3 gap-2 mb-4'>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num, idx) => (
                        <button
                            key={idx}
                            className='flex flex-row justify-center items-center w-14 h-10 bg-gray-200 border-gray-300 hover:bg-gray-400 rounded-lg cursor-pointer'
                            onClick={() => handleNumberClick(num.toString())}>
                            {num}
                        </button>
                    ))}

                    <button
                        className='flex flex-row justify-center items-center bg-gray-200 border-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer'
                        onClick={handleBackspace}>
                        <ArrowLeft
                            size={20}
                            className="cursor-pointer font-bold"
                        />
                    </button>

                    <button className='flex flex-row justify-center items-center w-14 h-10 bg-gray-200 border-gray-300 hover:bg-gray-400 rounded-lg cursor-pointer'
                        onClick={() => handleNumberClick('0')}>
                        0
                    </button>

                    <button
                        className='flex flex-row justify-center items-center bg-blue-600 border-blue-600 text-white hover:bg-blue-700 rounded-lg cursor-pointer'
                        onClick={handleOk}>
                        <SendIcon
                            size={20}
                            className="cursor-pointer font-bold"
                        />
                    </button>

                </div>

                <button
                    className='flex flex-row justify-center items-center py-1 px-2 bg-red-600 border-red-600 text-white hover:bg-red-700 rounded-lg cursor-pointer'
                    onClick={onClose}>
                    Batal
                </button>
            </div>
        </div>
    );
};

export default NumpadModal;
