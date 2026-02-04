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
    <div className="shrink-0 w-full bg-[#050505] border-t border-white/[0.08]">
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-5">
        {/* Mode switcher + model selector */}
        <div className="flex flex-wrap items-center gap-2.5 mb-3.5">
          <div
            role="tablist"
            className="inline-flex p-0.5 rounded-lg bg-white/[0.05] border border-white/[0.08]"
            aria-label="Input mode"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === "text"}
              onClick={() => onModeChange("text")}
              className={`inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-md text-sm font-medium transition-all duration-150 ${mode === "text"
                ? "bg-white/[0.06] text-white"
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
              className={`inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-md text-sm font-medium transition-all duration-150 ${mode === "image"
                ? "bg-white/[0.06] text-white"
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
              className="h-9 px-3 py-2 rounded-lg bg-white/[0.05] border border-white/[0.08] text-white/90 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer"
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
          className={`relative flex items-end w-full rounded-xl bg-white/[0.04] border transition-all duration-200 ${focused ? "border-white/25" : "border-white/[0.08]"
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
                ? "Describe the image you want to generate..."
                : "Ask me anything..."
            }
            disabled={isLoading}
            rows={1}
            className="w-full min-h-[54px] max-h-[160px] bg-transparent text-white placeholder:text-white/40 resize-none outline-none text-[15px] leading-[1.6] py-3.5 pl-4 pr-14"
            aria-label={mode === "image" ? "Image prompt" : "Message"}
          />
          <button
            type="submit"
            disabled={!canSend}
            aria-label="Send"
            className={`absolute right-3 bottom-[9px] flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 ${canSend
              ? "bg-white text-black hover:bg-white/90 active:scale-95"
              : "bg-white/[0.05] text-white/20 cursor-not-allowed"
              }`}
          >
            <Send className="w-4 h-4" strokeWidth={2.2} />
          </button>
        </form>

        <p className="mt-2.5 text-xs text-white/30 text-center">
          Press Enter to send, Shift+Enter for a new line.
        </p>
      </div>
    </div>
  );
}
