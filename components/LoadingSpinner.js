import React from 'react';


const LoadingSpinner = () => {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm transition-all duration-300">
            <div className="relative flex flex-col items-center animate-pulse">
                {/* Logo with Pulse Effect */}


                {/* Professional Spinner */}
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>

                {/* Optional Text */}
                <p className="mt-4 text-slate-500 text-sm font-medium tracking-wide">
                    Please wait...
                </p>
            </div>
        </div>
    );
};

export default LoadingSpinner;
