import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  imageBase64?: string;
  timestamp: Date;
}

export type ChatMode = "text" | "image";

export async function sendTextMessage(prompt: string, model: string = "superdrew100/llama3-abliterated"): Promise<string> {
  try {
    const response = await fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, model }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.response || "No response from AI";
  } catch (error) {
    console.error("Failed to send text message:", error);
    throw new Error("Neural Link Offline. Check Backend.");
  }
}

/** Matches backend M4/16GB defaults: 512, 25 steps, quality preserved */
const IMAGE_API_DEFAULTS = {
  steps: 25,
  width: 512,
  height: 512,
};

/** Appended to prompts for realism, detail and skin texture (RealVisXL-style) */
const REALISM_PROMPT_SUFFIX =
  ", photorealistic, 8k, highly detailed, detailed skin texture, natural skin pores, subtle skin imperfections, professional photography, sharp focus";

export interface ImageModelInfo {
  name: string;
  path: string;
  loaded: boolean;
}

export async function fetchImageModels(): Promise<{ models: ImageModelInfo[]; default: string }> {
  const response = await fetch("http://localhost:8000/models");
  if (!response.ok) throw new Error("Failed to fetch models");
  return response.json();
}

export async function sendImageRequest(prompt: string, model?: string): Promise<string> {
  try {
    const body: Record<string, unknown> = {
      prompt: prompt.trim() + REALISM_PROMPT_SUFFIX,
      ...IMAGE_API_DEFAULTS,
    };
    if (model) body.model = model;

    const response = await fetch("http://localhost:8000/image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return `data:image/png;base64,${data.image}`;
  } catch (error) {
    console.error("Failed to generate image:", error);
    throw new Error("Neural Link Offline. Check Backend.");
  }
}
