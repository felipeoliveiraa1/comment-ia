import OpenAI from "openai";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  throw new Error(
    "Missing OPENAI_API_KEY environment variable. Add it to .env.local"
  );
}

export const openaiClient = new OpenAI({
  apiKey: OPENAI_API_KEY,
});
