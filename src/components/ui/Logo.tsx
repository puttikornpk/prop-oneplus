import React from "react";

export const Logo: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            {/* Icon */}
            <div className="relative w-10 h-10 flex-shrink-0">
                <svg
                    viewBox="0 0 50 50"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full"
                >
                    {/* Left Side: Roof + Wall (Deep Blue) */}
                    <path
                        d="M10 20 L25 5 V42 H10 V20 Z"
                        fill="#1e40af"
                        stroke="#1e40af"
                        strokeWidth="3"
                        strokeLinejoin="round"
                    />

                    {/* Right Side: Lower Wall (Light Blue) */}
                    <path
                        d="M25 20 H40 V42 H25 V20 Z"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="3"
                        strokeLinejoin="round"
                    />

                    {/* Plus Sign (Light Blue) */}
                    <path
                        d="M36 7 V17 M31 12 H41"
                        stroke="#3b82f6"
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                </svg>
            </div>

            {/* Text Branding */}
            <span className="text-2xl font-bold tracking-tight leading-none">
                <span className="text-[#1e40af]">Property</span>
                <span className="text-[#3b82f6]">Plus</span>
            </span>
        </div>
    );
};
