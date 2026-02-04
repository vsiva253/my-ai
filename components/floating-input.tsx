"use client";

import { Send, ImageIcon, MessageCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { ChatMode, ImageModelInfo } from "@/lib/utils";

interface FloatingInputProps {
  onSendMessage: (message: string, mode: ChatMode) => void;
  isLoading: boolean;
  mode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
  imageModels?: ImageModelInfo[];
  imageModel?: string;
  onImageModelChange?: (model: string) => void;
  defaultImageModel?: string;
}

export function FloatingInput({
  onSendMessage,
  isLoading,
  mode,
  onModeChange,
  imageModels = [],
  imageModel,
  onImageModelChange,
  defaultImageModel = "realvis",
}: FloatingInputProps) {
  const [input, setInput] = useState("");
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim(), mode);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const currentModel = imageModel ?? defaultImageModel;
  const canSend = input.trim().length > 0 && !isLoading;

  return (
    <div className="shrink-0 w-full bg-[#0a0a0a] border-t border-white/[0.06]">
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-6">
        {/* Mode switcher + model selector */}
        <div className="flex flex-wrap items-center gap-2.5 mb-4">
          <div
            role="tablist"
            className="inline-flex p-0.5 rounded-lg bg-white/[0.08]"
            aria-label="Input mode"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === "text"}
              onClick={() => onModeChange("text")}
              className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-150 ${mode === "text"
                ? "bg-white/[0.08] text-white"
                : "text-white/40 hover:text-white/70"
                }`}
            >
              <MessageCircle className="w-4 h-4" />
              Chat
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "image"}
              onClick={() => onModeChange("image")}
              className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-150 ${mode === "image"
                ? "bg-white/[0.08] text-white"
                : "text-white/40 hover:text-white/70"
                }`}
            >
              <ImageIcon className="w-4 h-4" />
              Image
            </button>
          </div>

          {mode === "image" && imageModels.length > 0 && (
            <select
              value={currentModel}
              onChange={(e) => onImageModelChange?.(e.target.value)}
              className="h-9 px-3 py-2 rounded-lg bg-white/[0.08] border border-white/[0.12] text-white/90 text-sm font-medium focus:outline-none focus:border-white/30 transition-colors cursor-pointer"
              title="Image model"
            >
              {imageModels.map((m) => (
                <option key={m.name} value={m.name} className="bg-[#1a1a1a] text-white">
                  {m.name}{m.loaded ? " ✓" : ""}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Input area */}
        <form
          onSubmit={handleSubmit}
          className={`relative flex items-end w-full rounded-xl bg-white/[0.03] border transition-all duration-200 ${focused ? "border-white/20" : "border-white/[0.08]"
            }`}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={
              mode === "image"
                ? "Describe the image you want..."
                : "Message Aurelius..."
            }
            disabled={isLoading}
            rows={1}
            className="w-full min-h-[56px] max-h-[160px] bg-transparent text-white placeholder:text-white/50 resize-none outline-none text-[15px] leading-[1.6] py-4 pl-5 pr-[60px]"
            aria-label={mode === "image" ? "Image prompt" : "Message"}
          />
          <button
            type="submit"
            disabled={!canSend}
            aria-label="Send"
            className={`absolute right-2.5 bottom-2.5 flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 ${canSend
              ? "bg-white text-black hover:bg-white/90 active:scale-95"
              : "bg-white/[0.05] text-white/20 cursor-not-allowed"
              }`}
          >
            <Send className="w-4.5 h-4.5" strokeWidth={2} />
          </button>
        </form>

        <p className="mt-3 text-[13px] text-white/40 text-center">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
