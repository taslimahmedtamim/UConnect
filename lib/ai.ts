import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY || '';

// Centralized AI config — update model names in ONE place
const FLASH_MODEL = 'gemini-3.6-flash';
const FLASH_LARGE_MODEL = 'gemini-3.6-flash';

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

export { API_KEY, FLASH_MODEL, FLASH_LARGE_MODEL };
