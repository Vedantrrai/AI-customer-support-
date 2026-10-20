import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import { config } from '../config/env.js';
import { Setting } from '../models/Setting.js';

let geminiClient = null;
let openaiClient = null;

function getGeminiClient(apiKey) {
  const key = apiKey || config.geminiApiKey;
  if (!key) return null;
  if (!geminiClient || geminiClient.apiKey !== key) {
    geminiClient = new GoogleGenerativeAI(key);
    geminiClient.apiKey = key;
  }
  return geminiClient;
}

function getOpenAIClient(apiKey) {
  const key = apiKey || config.openaiApiKey;
  if (!key) return null;
  if (!openaiClient || openaiClient.apiKey !== key) {
    openaiClient = new OpenAI({ apiKey: key });
  }
  return openaiClient;
}

/**
 * Intelligent Local AI Fallback Engine
 * Uses knowledge base context, session context, and templates to formulate an empathetic, clear response
 */
function generateLocalAiResponse(query, matches, history = []) {
  if (matches && matches.length > 0 && matches[0].score >= 0.25) {
    const top = matches[0];
    const related = matches.slice(1, 3);

    let answer = top.answer;

    // Enhance with related references if available
    if (related.length > 0) {
      answer += `\n\n**Related Information:**\n` +
        related.map((r) => `- **${r.question}**: ${r.answer.length > 120 ? r.answer.substring(0, 117) + '...' : r.answer}`).join('\n');
    }

    answer += `\n\n*Did this answer your question? Let us know below or request a human agent if you need further help.*`;
    return answer;
  }

  // If no strong match in knowledge base
  return `Thank you for reaching out! I checked our current support documentation, but I could not find a precise answer for: **"${query}"**.\n\n` +
    `Here are a few quick options:\n` +
    `1. Rephrase your question or browse our FAQ categories in the menu.\n` +
    `2. Click **"Talk to Human Agent"** above, and one of our support specialists will assist you directly.\n` +
    `3. Email our support team at **support@novasupport.io** for account-specific inquiries.`;
}

export class LLMService {
  /**
   * Generates AI answer based on user query, knowledge base matches, and chat history
   */
  static async generateAnswer({ query, matches, history = [], sessionInfo = {} }) {
    const startTime = Date.now();

    // Check dynamic settings in DB if saved
    let activeProvider = config.llmProvider;
    let systemPrompt =
      'You are Nova, an empathetic, highly skilled customer support AI agent for an innovative tech company. ' +
      'Answer the customer query accurately using ONLY the provided verified Knowledge Base articles when relevant. ' +
      'If the knowledge base contains the answer, explain it clearly, politely, and use markdown formatting (bullet points, bold text). ' +
      'If the answer is NOT present or uncertain, politely admit it and suggest escalating to a human support agent. Do NOT hallucinate policies or prices.';

    try {
      const providerSetting = await Setting.findOne({ key: 'llm_provider' });
      if (providerSetting && providerSetting.value) activeProvider = providerSetting.value;

      const promptSetting = await Setting.findOne({ key: 'system_prompt' });
      if (promptSetting && promptSetting.value) systemPrompt = promptSetting.value;
    } catch (e) {
      // Ignore DB setting lookup error, fallback to env
    }

    // Prepare Knowledge Base Context
    const kbContext = matches && matches.length > 0
      ? matches
          .map((m, idx) => `[Article ${idx + 1}] Question: ${m.question}\nAnswer: ${m.answer}\nCategory: ${m.category}`)
          .join('\n\n')
      : 'No matching articles found in knowledge base.';

    // 1. Try Gemini if configured
    if ((activeProvider === 'gemini' || !activeProvider) && config.geminiApiKey) {
      try {
        const client = getGeminiClient();
        const model = client.getGenerativeModel({ model: config.geminiModel });

        const prompt = `${systemPrompt}\n\n` +
          `--- VERIFIED KNOWLEDGE BASE CONTEXT ---\n${kbContext}\n--------------------------------------\n\n` +
          `Customer Query: ${query}\n\n` +
          `Generate a helpful, empathetic, formatted answer for the customer:`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        return {
          text,
          provider: 'gemini',
          model: config.geminiModel,
          latencyMs: Date.now() - startTime
        };
      } catch (geminiErr) {
        console.warn(`[LLM] Gemini API error: ${geminiErr.message}. Falling back to Local AI.`);
      }
    }

    // 2. Try OpenAI if configured
    if (activeProvider === 'openai' && config.openaiApiKey) {
      try {
        const client = getOpenAIClient();
        const completion = await client.chat.completions.create({
          model: config.openaiModel,
          messages: [
            { role: 'system', content: `${systemPrompt}\n\nKnowledge Base:\n${kbContext}` },
            ...history.slice(-4).map((h) => ({
              role: h.sender === 'customer' ? 'user' : 'assistant',
              content: h.text
            })),
            { role: 'user', content: query }
          ],
          temperature: 0.3
        });

        const text = completion.choices[0]?.message?.content || '';
        return {
          text,
          provider: 'openai',
          model: config.openaiModel,
          latencyMs: Date.now() - startTime
        };
      } catch (openaiErr) {
        console.warn(`[LLM] OpenAI API error: ${openaiErr.message}. Falling back to Local AI.`);
      }
    }

    // 3. Fallback Local Engine
    const localAnswer = generateLocalAiResponse(query, matches, history);
    return {
      text: localAnswer,
      provider: 'local-ai',
      model: 'Nova-Semantic-Engine-v1',
      latencyMs: Date.now() - startTime
    };
  }
}
