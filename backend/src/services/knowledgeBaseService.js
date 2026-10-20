import { Faq } from '../models/Faq.js';

const STOPWORDS = new Set([
  'the', 'is', 'at', 'which', 'on', 'and', 'a', 'an', 'in', 'to', 'for', 'of',
  'with', 'as', 'by', 'that', 'this', 'it', 'from', 'or', 'are', 'was', 'were',
  'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'but',
  'can', 'could', 'should', 'would', 'will', 'how', 'what', 'where', 'when',
  'who', 'why', 'i', 'my', 'me', 'we', 'our', 'you', 'your', 'they', 'their'
]);

/**
 * Clean and tokenize text, filtering out stop words
 */
function tokenize(text, keepStopwords = false) {
  if (!text) return [];
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2);

  if (keepStopwords) return words;
  const filtered = words.filter((w) => !STOPWORDS.has(w));
  return filtered.length > 0 ? filtered : words; // fallback to words if all were stopwords
}

/**
 * Calculates a lexical similarity score between query tokens and target text tokens
 */
function calculateScore(queryTokens, targetText, boost = 1.0) {
  if (!targetText || queryTokens.length === 0) return 0;
  const targetTokens = new Set(tokenize(targetText));
  if (targetTokens.size === 0) return 0;

  let matched = 0;
  for (const token of queryTokens) {
    if (targetTokens.has(token)) {
      matched += 1;
    } else {
      // Partial prefix matching for plurals/stems (e.g., 'refund' vs 'refunds')
      for (const t of targetTokens) {
        if ((t.length > 3 && token.length > 3) && (t.startsWith(token) || token.startsWith(t))) {
          matched += 0.75;
          break;
        }
      }
    }
  }

  return (matched / Math.max(queryTokens.length, 1)) * boost;
}

export class KnowledgeBaseService {
  /**
   * Search knowledge base for articles matching the user query
   * Returns top matching FAQs with confidence score
   */
  static async search(query, limit = 4) {
    const cleanQuery = (query || '').trim();
    if (!cleanQuery) {
      return { matches: [], confidence: 0, topMatch: null };
    }

    const queryTokens = tokenize(cleanQuery);
    const faqs = await Faq.find({ isActive: true }).lean();

    if (!faqs || faqs.length === 0) {
      return { matches: [], confidence: 0, topMatch: null };
    }

    const scored = faqs.map((faq) => {
      // Question (weight 2.5), Keywords (weight 2.2), Tags (weight 1.8), Answer (weight 0.8)
      const qScore = calculateScore(queryTokens, faq.question, 2.5);
      const kScore = calculateScore(queryTokens, (faq.keywords || []).join(' '), 2.2);
      const tScore = calculateScore(queryTokens, (faq.tags || []).join(' '), 1.8);
      const aScore = calculateScore(queryTokens, faq.answer, 0.8);

      // Exact phrase match bonus
      const lowerQ = cleanQuery.toLowerCase();
      let bonus = 0;
      if (lowerQ.length > 6 && faq.question.toLowerCase().includes(lowerQ)) {
        bonus += 1.2;
      }
      if (faq.keywords && faq.keywords.some((k) => k.length > 3 && lowerQ.includes(k.toLowerCase()))) {
        bonus += 0.8;
      }

      const rawScore = qScore + kScore + tScore + aScore + bonus;
      // Normalize to 0 - 1 confidence scale
      const normalizedScore = Math.min(Math.round((rawScore / 3.5) * 100) / 100, 1.0);

      return {
        faqId: faq._id,
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
        tags: faq.tags || [],
        score: normalizedScore
      };
    });

    // Filter by relevance threshold and sort descending
    const matches = scored
      .filter((m) => m.score >= 0.20)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    const topMatch = matches.length > 0 ? matches[0] : null;
    const confidence = topMatch ? topMatch.score : 0;

    return {
      matches,
      confidence,
      topMatch
    };
  }
}
