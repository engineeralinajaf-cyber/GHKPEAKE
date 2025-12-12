import { GoogleGenAI, Chat, GenerateContentResponse, Content } from "@google/genai";
import { Message } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

let aiInstance: GoogleGenAI | null = null;

const getAI = () => {
  if (!aiInstance) {
    if (!process.env.API_KEY) {
      console.warn("API_KEY is not set in environment variables.");
    }
    // We initialize even without key to allow UI to render, but calls will fail if key is missing
    aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }
  return aiInstance;
};

export const createChatSession = (modelName: string, history: Message[] = []): Chat => {
  const ai = getAI();
  
  // Transform internal Message format to Gemini SDK Content format
  const formattedHistory = history.map(msg => ({
    role: msg.role === 'model' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));

  return ai.chats.create({
    model: modelName,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    },
    history: formattedHistory,
  });
};

export const streamResponse = async (
  chat: Chat, 
  message: string, 
  onChunk: (text: string) => void
): Promise<string> => {
  let fullText = '';
  
  try {
    const resultStream = await chat.sendMessageStream({ message });
    
    for await (const chunk of resultStream) {
      const c = chunk as GenerateContentResponse;
      if (c.text) {
        fullText += c.text;
        onChunk(c.text);
      }
    }
  } catch (error) {
    console.error("Error in streamResponse:", error);
    throw error;
  }
  
  return fullText;
};