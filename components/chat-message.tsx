"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { MediaCard } from "./media-card";
import { Message } from "@/lib/utils";
import { memo, useState } from "react";
import { Copy, Check } from "lucide-react";

interface ChatMessageProps {
    message: Message;
}

export const ChatMessage = memo(function ChatMessage({ message }: ChatMessageProps) {
    const isUser = message.role === "user";
    const [copied, setCopied] = useState(false);

    const handleCopy = async (text: string) => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (isUser) {
        return (
            <div className="flex justify-end w-full mb-8">
                <div className="max-w-[75%] rounded-2xl rounded-br-md px-6 py-4 bg-blue-600/25 border border-blue-500/40">
                    <p className="text-[15px] leading-relaxed text-white whitespace-pre-wrap">{message.content}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-start w-full mb-8">
            <div className="max-w-[85%] rounded-2xl rounded-bl-md px-6 py-6 bg-white/[0.06] border border-white/[0.12]">
                <div className="prose prose-invert max-w-none">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                        components={{
                            p: ({ children }) => <p className="mb-5 last:mb-0 text-[15px] leading-relaxed text-white/95">{children}</p>,
                            h1: ({ children }) => <h1 className="text-2xl font-bold text-white mt-8 mb-4 first:mt-0">{children}</h1>,
                            h2: ({ children }) => <h2 className="text-xl font-bold text-white mt-6 mb-3 first:mt-0">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-lg font-semibold text-white mt-5 mb-2.5 first:mt-0">{children}</h3>,
                            code: ({ className, children, ...props }) => {
                                const match = /language-(\w+)/.exec(className || '');
                                const isBlock = match || (typeof children === 'string' && children.includes('\n'));

                                if (isBlock) {
                                    const codeString = String(children).replace(/\n$/, '');
                                    const language = match?.[1] || 'plaintext';

                                    return (
                                        <div className="my-6 rounded-xl overflow-hidden bg-[#1e1e1e] border border-white/[0.1] shadow-lg">
                                            <div className="flex items-center justify-between px-5 py-3 bg-[#2d2d2d] border-b border-white/[0.1]">
                                                <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                                                    {language}
                                                </span>
                                                <button
                                                    onClick={() => handleCopy(codeString)}
                                                    className="px-3 py-1.5 text-xs font-medium text-white/70 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] rounded-md flex items-center gap-2 transition-all duration-150"
                                                >
                                                    {copied ? (
                                                        <>
                                                            <Check className="w-3.5 h-3.5" />
                                                            Copied!
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy className="w-3.5 h-3.5" />
                                                            Copy code
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                            <pre className="p-5 overflow-x-auto text-[13.5px] leading-[1.7] !bg-transparent">
                                                <code className={`${className} !bg-transparent`} {...props}>{children}</code>
                                            </pre>
                                        </div>
                                    );
                                }
                                return (
                                    <code className="px-2 py-0.5 rounded-md bg-white/[0.15] text-white font-mono text-[13px]" {...props}>
                                        {children}
                                    </code>
                                );
                            },
                            pre: ({ children }) => <>{children}</>,
                            ul: ({ children }) => <ul className="mb-5 ml-6 list-disc space-y-2.5 marker:text-white/60 text-[15px] leading-relaxed text-white/95">{children}</ul>,
                            ol: ({ children }) => <ol className="mb-5 ml-6 list-decimal space-y-2.5 marker:text-white/60 text-[15px] leading-relaxed text-white/95">{children}</ol>,
                            li: ({ children }) => <li className="pl-2">{children}</li>,
                            strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                            em: ({ children }) => <em className="italic text-white/90">{children}</em>,
                            blockquote: ({ children }) => (
                                <blockquote className="border-l-4 border-blue-500/50 pl-5 py-1 my-5 text-white/85 italic bg-white/[0.03] rounded-r-lg">
                                    {children}
                                </blockquote>
                            ),
                            a: ({ href, children }) => (
                                <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 underline decoration-blue-400/40 hover:decoration-blue-300/60 transition-colors font-medium"
                                >
                                    {children}
                                </a>
                            ),
                            hr: () => <hr className="my-8 border-white/15" />,
                            table: ({ children }) => (
                                <div className="my-6 overflow-x-auto rounded-lg border border-white/[0.1]">
                                    <table className="w-full text-sm">{children}</table>
                                </div>
                            ),
                            thead: ({ children }) => <thead className="bg-white/[0.05]">{children}</thead>,
                            th: ({ children }) => <th className="px-4 py-3 text-left font-semibold text-white border-b border-white/[0.1]">{children}</th>,
                            td: ({ children }) => <td className="px-4 py-3 border-b border-white/[0.06] last:border-0 text-white/90">{children}</td>,
                        }}
                    >
                        {message.content}
                    </ReactMarkdown>
                </div>

                {message.imageBase64 && (
                    <div className="mt-6">
                        <MediaCard imageUrl={message.imageBase64} prompt={message.content} />
                    </div>
                )}
            </div>
        </div>
    );
});
