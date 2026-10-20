import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ai_customer_support',
  useInMemoryDb: process.env.USE_IN_MEMORY_DB === 'true',
  llmProvider: process.env.LLM_PROVIDER || 'mock', // 'gemini' | 'openai' | 'mock'
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  openaiModel: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  confidenceThreshold: parseFloat(process.env.CONFIDENCE_THRESHOLD || '0.65'),
  jwtSecret: process.env.JWT_SECRET || 'super-secret-support-key-2026',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173'
};
