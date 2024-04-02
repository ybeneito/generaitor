import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: import.meta.env.VITE_api_key,
  dangerouslyAllowBrowser: true,
});