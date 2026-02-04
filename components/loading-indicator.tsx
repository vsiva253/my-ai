"use client";

import { motion } from "framer-motion";

export function LoadingIndicator() {
    const dots = [0, 1, 2];

    return (
        <div className="flex items-center gap-2 sm:gap-3 text-zinc-400">
            <span className="text-xs sm:text-sm font-light">Neural Processing</span>
            <div className="flex gap-1.5">
                {dots.map((i) => (
                    <motion.div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-blue-500"
                        animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.2,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
