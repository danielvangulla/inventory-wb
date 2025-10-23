import React from "react";

export const LoadingSpinner: React.FC = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 dark:bg-gray-400/50 z-50">
            <img
                src="/images/logo2-hd.png"
                alt="Loading..."
                className="animate-spin h-20 w-20 rounded-full"
                style={{ filter: 'invert(0)' }}
            />
        </div>
    );
}
