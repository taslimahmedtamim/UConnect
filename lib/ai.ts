import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY || '';

// Centralized AI config — update model names in ONE place
const FLASH_MODEL = 'gemini-3.5-flash-lite';
const FLASH_LARGE_MODEL = 'gemini-3.5-flash-lite';

export function getGenAI() {
  return new GoogleGenerativeAI(API_KEY);
}

export function getFlashModel() {
  const genAI = getGenAI();
  return genAI.getGenerativeModel({ model: FLASH_MODEL });
}

export function getFlashLargeModel() {
  const genAI = getGenAI();
  return genAI.getGenerativeModel({ model: FLASH_LARGE_MODEL });
}

export function hasApiKey(): boolean {
  return !!API_KEY;
}

export function extractJson(text: string): any {
  let cleanText = text.trim();
  const firstBrace = cleanText.indexOf('{');
  const firstBracket = cleanText.indexOf('[');
  let startIdx = -1;
  let endIdx = -1;
  
  if (firstBrace !== -1 && firstBracket !== -1) {
    startIdx = Math.min(firstBrace, firstBracket);
  } else if (firstBrace !== -1) {
    startIdx = firstBrace;
  } else if (firstBracket !== -1) {
    startIdx = firstBracket;
  }
  
  if (startIdx === -1) {
    throw new Error("No JSON object or array found in response");
  }
  
  const isArray = cleanText[startIdx] === '[';
  endIdx = isArray ? cleanText.lastIndexOf(']') : cleanText.lastIndexOf('}');
  
  if (endIdx === -1) {
    throw new Error("No closing bracket/brace found in response");
  }
  
  return JSON.parse(cleanText.substring(startIdx, endIdx + 1));
}

export { API_KEY, FLASH_MODEL, FLASH_LARGE_MODEL };
