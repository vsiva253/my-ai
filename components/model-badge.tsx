"use client";

import { Message } from "@/lib/utils";

interface ModelBadgeProps {
    message: Message;
}

export const ModelBadge = ({ message }: ModelBadgeProps) => {
    if (message.role !== 'assistant') {
        return null;
    }

    return (
        <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center">
                <div className="w-5 h-5 rounded-full bg-[#1c1c1c] border border-white/10" />
            </div>
            <span className="text-sm font-medium text-white">AI</span>
        </div>
    );
};