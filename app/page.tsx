"use client";

import { useState, useRef, useEffect } from "react";
import { Toaster, toast } from "sonner";
import { ChatMessage } from "@/components/chat-message";
import { FloatingInput } from "@/components/floating-input";
import { Message, ChatMode, sendTextMessage, sendImageRequest, fetchImageModels, ImageModelInfo } from "@/lib/utils";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<ChatMode>("text");
  const [imageModels, setImageModels] = useState<ImageModelInfo[]>([]);
  const [defaultImageModel, setDefaultImageModel] = useState<string>("realvis");
  const [imageModel, setImageModel] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (mode !== "image") return;
    fetchImageModels()
      .then(({ models, default: defaultName }) => {
        setImageModels(models);
        setDefaultImageModel(defaultName);
        if (!imageModel && models.length > 0) setImageModel(defaultName);
      })
      .catch(() => setImageModels([]));
  }, [mode]);

  const handleSendMessage = async (content: string, messageMode: ChatMode) => {
    if (!content.trim()) return;

    setMessages((prev) => [...prev, {
      id: `user-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date(),
    }]);
    setIsLoading(true);

    try {
      if (messageMode === "text") {
        const response = await sendTextMessage(content);
        setMessages((prev) => [...prev, {
          id: `ai-${Date.now()}`,
          role: "assistant",
          content: response,
          timestamp: new Date(),
        }]);
      } else {
        const selectedModel = imageModel || defaultImageModel;
        const imageBase64 = await sendImageRequest(content, selectedModel || undefined);
        setMessages((prev) => [...prev, {
          id: `ai-${Date.now()}`,
          role: "assistant",
          content: `Generated image for: "${content}"`,
          imageBase64,
          timestamp: new Date(),
        }]);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Connection failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0a] w-full">
      <div className="flex-1 overflow-y-auto w-full">
        {messages.length === 0 ? (
          <div className="h-full w-full flex flex-col items-center justify-center px-6">
            <div className="w-12 h-12 rounded-xl bg-white/[0.12] flex items-center justify-center mb-5">
              <span className="text-xl font-semibold text-white">A</span>
            </div>
            <h1 className="text-lg font-medium text-white mb-2">
              How can I help you today?
            </h1>
            <p className="text-sm text-white/70">
              Chat or switch to Image mode to generate pictures.
            </p>
          </div>
        ) : (
          <div className="w-full px-4 sm:px-6 py-8">
            <div className="w-full max-w-3xl mx-auto">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && (
                <div className="flex justify-start w-full mb-6">
                  <div className="flex items-center gap-3 rounded-2xl rounded-bl-md bg-white/[0.06] border border-white/[0.12] px-5 py-4">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                    <span className="text-sm text-white/70">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <FloatingInput
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        mode={mode}
        onModeChange={setMode}
        imageModels={imageModels}
        imageModel={imageModel || defaultImageModel}
        onImageModelChange={setImageModel}
        defaultImageModel={defaultImageModel}
      />

      <Toaster position="top-center" />
    </div>
  );
}
