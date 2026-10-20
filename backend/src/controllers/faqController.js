import { Faq } from '../models/Faq.js';
import { KnowledgeBaseService } from '../services/knowledgeBaseService.js';

export class FaqController {
  static async getAll(req, res) {
    try {
      const { category, search, activeOnly } = req.query;
      const filter = {};

      if (category && category !== 'All') {
        filter.category = category;
      }

      if (activeOnly === 'true') {
        filter.isActive = true;
      }

      if (search && search.trim()) {
        const regex = new RegExp(search.trim(), 'i');
        filter.$or = [
          { question: regex },
          { answer: regex },
          { tags: regex },
          { keywords: regex }
        ];
      }

      const faqs = await Faq.find(filter).sort({ createdAt: -1 });
      return res.json({ success: true, count: faqs.length, faqs });
    } catch (err) {
      console.error('[FaqController] getAll error:', err);
      return res.status(500).json({ success: false, error: 'Failed to retrieve FAQs' });
    }
  }

  static async getById(req, res) {
    try {
      const faq = await Faq.findById(req.params.id);
      if (!faq) return res.status(404).json({ success: false, error: 'FAQ not found' });
      return res.json({ success: true, faq });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Failed to retrieve FAQ' });
    }
  }

  static async create(req, res) {
    try {
      const { question, answer, category, tags, keywords } = req.body;
      if (!question?.trim() || !answer?.trim()) {
        return res.status(400).json({ success: false, error: 'Question and answer are required' });
      }

      const parsedTags = Array.isArray(tags)
        ? tags
        : (tags || '').split(',').map((t) => t.trim()).filter(Boolean);

      const parsedKeywords = Array.isArray(keywords)
        ? keywords
        : (keywords || '').split(',').map((k) => k.trim()).filter(Boolean);

      const faq = await Faq.create({
        question: question.trim(),
        answer: answer.trim(),
        category: category || 'General',
        tags: parsedTags,
        keywords: parsedKeywords
      });

      return res.status(201).json({ success: true, faq });
    } catch (err) {
      console.error('[FaqController] create error:', err);
      return res.status(500).json({ success: false, error: 'Failed to create FAQ' });
    }
  }

  static async update(req, res) {
    try {
      const { question, answer, category, tags, keywords, isActive } = req.body;
      const updateData = {};

      if (question !== undefined) updateData.question = question.trim();
      if (answer !== undefined) updateData.answer = answer.trim();
      if (category !== undefined) updateData.category = category;
      if (isActive !== undefined) updateData.isActive = Boolean(isActive);

      if (tags !== undefined) {
        updateData.tags = Array.isArray(tags)
          ? tags
          : tags.split(',').map((t) => t.trim()).filter(Boolean);
      }

      if (keywords !== undefined) {
        updateData.keywords = Array.isArray(keywords)
          ? keywords
          : keywords.split(',').map((k) => k.trim()).filter(Boolean);
      }

      const faq = await Faq.findByIdAndUpdate(req.params.id, updateData, { new: true });
      if (!faq) return res.status(404).json({ success: false, error: 'FAQ not found' });

      return res.json({ success: true, faq });
    } catch (err) {
      console.error('[FaqController] update error:', err);
      return res.status(500).json({ success: false, error: 'Failed to update FAQ' });
    }
  }

  static async delete(req, res) {
    try {
      const faq = await Faq.findByIdAndDelete(req.params.id);
      if (!faq) return res.status(404).json({ success: false, error: 'FAQ not found' });
      return res.json({ success: true, message: 'FAQ deleted successfully' });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Failed to delete FAQ' });
    }
  }

  static async testMatch(req, res) {
    try {
      const { query } = req.body;
      if (!query?.trim()) {
        return res.status(400).json({ success: false, error: 'Query is required' });
      }

      const result = await KnowledgeBaseService.search(query.trim(), 5);
      return res.json({ success: true, ...result });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Failed to test match' });
    }
  }
}
