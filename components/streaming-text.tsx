"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface StreamingTextProps {
    text: string;
    onComplete?: () => void;
}

export function StreamingText({ text, onComplete }: StreamingTextProps) {
    const [displayedText, setDisplayedText] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        setDisplayedText("");
        setCurrentIndex(0);
    }, [text]);

    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText((prev) => prev + text[currentIndex]);
                setCurrentIndex((prev) => prev + 1);
            }, 15);

            return () => clearTimeout(timeout);
        } else if (currentIndex === text.length && onComplete) {
            onComplete();
        }
    }, [currentIndex, text, onComplete]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="whitespace-pre-wrap break-words text-[14px] sm:text-[15px] leading-relaxed"
        >
            {displayedText}
            {currentIndex < text.length && (
                <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="inline-block w-0.5 sm:w-1 h-3.5 sm:h-4 bg-blue-500 ml-0.5"
                />
            )}
        </motion.div>
    );
}
