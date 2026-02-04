"use client";

import { Download } from "lucide-react";
import { useState } from "react";

interface MediaCardProps {
    imageUrl: string;
    prompt?: string;
}

export function MediaCard({ imageUrl, prompt }: MediaCardProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = `image-${Date.now()}.png`;
        link.click();
    };

    return (
        <>
            <div className="relative max-w-md rounded-lg overflow-hidden group border border-white/[0.08]">
                <img
                    src={imageUrl}
                    alt={prompt || "Generated image"}
                    className="w-full h-auto cursor-pointer"
                    onClick={() => setIsOpen(true)}
                />
                <button
                    onClick={handleDownload}
                    className="absolute bottom-3 right-3 p-2.5 rounded-lg bg-black/70 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-black/80"
                    aria-label="Download image"
                >
                    <Download className="w-4 h-4" />
                </button>
            </div>

            {isOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-6"
                    onClick={() => setIsOpen(false)}
                >
                    <img
                        src={imageUrl}
                        alt={prompt || "Generated image"}
                        className="max-w-full max-h-full object-contain rounded-lg"
                    />
                </div>
            )}
        </>
    );
}
