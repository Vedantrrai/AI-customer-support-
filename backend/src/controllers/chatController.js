import { Conversation } from '../models/Conversation.js';
import { Message } from '../models/Message.js';
import { Faq } from '../models/Faq.js';
import { Ticket } from '../models/Ticket.js';
import { KnowledgeBaseService } from '../services/knowledgeBaseService.js';
import { LLMService } from '../services/llmService.js';
import { EscalationService } from '../services/escalationService.js';
import { v4 as uuidv4 } from 'uuid';

export class ChatController {
  /**
   * Initializes or fetches a chat session
   */
  static async initSession(req, res) {
    try {
      const { sessionId, customerName, customerEmail } = req.body;
      const sid = sessionId || `session_${uuidv4().substring(0, 8)}`;

      let conversation = await Conversation.findOne({ sessionId: sid });
      if (!conversation) {
        conversation = await Conversation.create({
          sessionId: sid,
          customerName: customerName || 'Guest Customer',
          customerEmail: customerEmail || '',
          status: 'active'
        });

        // Send initial welcoming bot message
        await Message.create({
          sessionId: sid,
          sender: 'bot',
          text: `👋 Hello${customerName ? ' ' + customerName : ''}! I am **Nova**, your 24/7 AI Customer Support Assistant.\n\nHow can I help you today? You can ask about order status, returns, billing, technical troubleshooting, or click one of the suggested prompts below!`,
          confidence: 1.0,
          sources: []
        });
      }

      const messages = await Message.find({ sessionId: sid }).sort({ createdAt: 1 });
      const ticket = await Ticket.findOne({ sessionId: sid, status: { $in: ['open', 'in_progress'] } });

      return res.json({
        success: true,
        session: conversation,
        messages,
        escalated: conversation.escalatedToHuman,
        activeTicket: ticket
      });
    } catch (err) {
      console.error('[ChatController] initSession error:', err);
      return res.status(500).json({ success: false, error: 'Failed to initialize session' });
    }
  }

  /**
   * Processes a customer message, searches knowledge base, calls LLM, checks escalation
   */
  static async sendMessage(req, res) {
    try {
      const { sessionId, text, customerName, customerEmail } = req.body;
      if (!sessionId || !text?.trim()) {
        return res.status(400).json({ success: false, error: 'Session ID and message text required' });
      }

      // Ensure conversation exists
      let conv = await Conversation.findOne({ sessionId });
      if (!conv) {
        conv = await Conversation.create({
          sessionId,
          customerName: customerName || 'Guest Customer',
          customerEmail: customerEmail || '',
          status: 'active'
        });
      }

      // 1. Save customer message
      const customerMsg = await Message.create({
        sessionId,
        sender: 'customer',
        text: text.trim()
      });

      // 2. Count unhelpful votes in this session to detect frustration
      const unhelpfulCount = await Message.countDocuments({ sessionId, feedback: 'unhelpful' });

      // 3. Search Knowledge Base
      const searchResult = await KnowledgeBaseService.search(text.trim());
      const { matches, confidence } = searchResult;

      // 4. Analyze message for human escalation triggers
      const escalationCheck = EscalationService.analyzeMessage(text.trim(), confidence, unhelpfulCount);

      // If conversation is already escalated to human or triggered now
      let ticket = null;
      let botText = '';
      let escalationSuggested = false;

      if (conv.escalatedToHuman || escalationCheck.shouldEscalate) {
        ticket = await EscalationService.createEscalationTicket({
          sessionId,
          customerName: conv.customerName,
          customerEmail: conv.customerEmail,
          reason: escalationCheck.reason || 'customer_request',
          priority: escalationCheck.priority || 'medium',
          subject: `Support Request: ${text.substring(0, 45)}...`,
          summary: text
        });

        conv.status = 'escalated';
        conv.escalatedToHuman = true;
        await conv.save();

        botText = escalationCheck.message ||
          `🛡️ **Connected to Human Support Queue** (Ticket #${ticket.ticketNumber})\n\n` +
          `A human support agent has been notified and will reply shortly. You may leave additional details below.`;
      } else {
        // 5. Generate AI answer via LLM
        const history = await Message.find({ sessionId }).sort({ createdAt: -1 }).limit(6).lean();
        const llmResult = await LLMService.generateAnswer({
          query: text.trim(),
          matches,
          history: history.reverse(),
          sessionInfo: { customerName: conv.customerName }
        });

        botText = llmResult.text;
        escalationSuggested = escalationCheck.suggestEscalation || confidence < 0.25;
      }

      // 6. Save bot message
      const botMsg = await Message.create({
        sessionId,
        sender: conv.escalatedToHuman && ticket ? 'system' : 'bot',
        text: botText,
        confidence,
        sources: matches.map((m) => ({
          faqId: m.faqId,
          question: m.question,
          category: m.category,
          relevanceScore: m.score
        })),
        escalationSuggested
      });

      return res.json({
        success: true,
        customerMessage: customerMsg,
        botMessage: botMsg,
        escalated: conv.escalatedToHuman,
        ticket: ticket || null
      });
    } catch (err) {
      console.error('[ChatController] sendMessage error:', err);
      return res.status(500).json({ success: false, error: 'Failed to process message' });
    }
  }

  /**
   * Retrieves full conversation message history
   */
  static async getHistory(req, res) {
    try {
      const { sessionId } = req.params;
      const conversation = await Conversation.findOne({ sessionId });
      if (!conversation) {
        return res.status(404).json({ success: false, error: 'Conversation not found' });
      }

      const messages = await Message.find({ sessionId }).sort({ createdAt: 1 });
      const ticket = await Ticket.findOne({ sessionId, status: { $in: ['open', 'in_progress'] } });

      return res.json({
        success: true,
        conversation,
        messages,
        ticket
      });
    } catch (err) {
      console.error('[ChatController] getHistory error:', err);
      return res.status(500).json({ success: false, error: 'Failed to fetch history' });
    }
  }

  /**
   * Records helpful / unhelpful rating for a specific bot message
   */
  static async rateMessage(req, res) {
    try {
      const { messageId } = req.params;
      const { rating } = req.body; // 'helpful' | 'unhelpful'

      if (!['helpful', 'unhelpful'].includes(rating)) {
        return res.status(400).json({ success: false, error: 'Rating must be helpful or unhelpful' });
      }

      const message = await Message.findById(messageId);
      if (!message) {
        return res.status(404).json({ success: false, error: 'Message not found' });
      }

      message.feedback = rating;
      await message.save();

      // If message has linked FAQ sources, increment helpful/unhelpful counter
      if (message.sources && message.sources.length > 0) {
        const topFaqId = message.sources[0].faqId;
        if (topFaqId) {
          const updateField = rating === 'helpful' ? { $inc: { helpfulCount: 1 } } : { $inc: { unhelpfulCount: 1 } };
          await Faq.findByIdAndUpdate(topFaqId, updateField);
        }
      }

      // If unhelpful rating, check if session unhelpful count triggers escalation prompt
      const unhelpfulCount = await Message.countDocuments({ sessionId: message.sessionId, feedback: 'unhelpful' });
      let shouldOfferEscalation = unhelpfulCount >= 2;

      return res.json({
        success: true,
        message,
        shouldOfferEscalation
      });
    } catch (err) {
      console.error('[ChatController] rateMessage error:', err);
      return res.status(500).json({ success: false, error: 'Failed to rate message' });
    }
  }

  /**
   * Explicitly triggers human escalation for current session
   */
  static async escalateSession(req, res) {
    try {
      const { sessionId, reason, customerName, customerEmail } = req.body;
      if (!sessionId) {
        return res.status(400).json({ success: false, error: 'sessionId is required' });
      }

      const ticket = await EscalationService.createEscalationTicket({
        sessionId,
        customerName,
        customerEmail,
        reason: reason || 'customer_request',
        priority: 'high',
        subject: 'Customer Escalated to Human Support',
        summary: 'Customer pressed "Talk to Human Agent" in the chat interface.'
      });

      // Add system message
      const systemMsg = await Message.create({
        sessionId,
        sender: 'system',
        text: `🛎️ **Human Escalation Initiated** (Ticket #${ticket.ticketNumber})\n\nOur customer support team has received your ticket. A support agent will connect with you here shortly.`,
        confidence: 1.0
      });

      return res.json({
        success: true,
        ticket,
        systemMessage: systemMsg
      });
    } catch (err) {
      console.error('[ChatController] escalateSession error:', err);
      return res.status(500).json({ success: false, error: 'Failed to escalate session' });
    }
  }

  /**
   * Submit overall session satisfaction rating (1 to 5 stars)
   */
  static async submitFeedback(req, res) {
    try {
      const { sessionId, score, note } = req.body;
      const numScore = parseInt(score, 10);
      if (isNaN(numScore) || numScore < 1 || numScore > 5) {
        return res.status(400).json({ success: false, error: 'Score must be between 1 and 5' });
      }

      const conv = await Conversation.findOneAndUpdate(
        { sessionId },
        { satisfactionScore: numScore, feedbackNote: note || '', status: 'resolved' },
        { new: true }
      );

      return res.json({ success: true, conversation: conv });
    } catch (err) {
      console.error('[ChatController] submitFeedback error:', err);
      return res.status(500).json({ success: false, error: 'Failed to submit feedback' });
    }
  }

  /**
   * List recent sessions for sidebar history
   */
  static async listSessions(req, res) {
    try {
      const sessions = await Conversation.find()
        .sort({ updatedAt: -1 })
        .limit(20)
        .lean();

      // Attach last message preview to each session
      const sessionsWithPreview = await Promise.all(
        sessions.map(async (s) => {
          const lastMsg = await Message.findOne({ sessionId: s.sessionId })
            .sort({ createdAt: -1 })
            .select('text sender createdAt')
            .lean();
          return {
            ...s,
            lastMessage: lastMsg?.text || 'New conversation',
            lastMessageTime: lastMsg?.createdAt || s.updatedAt
          };
        })
      );

      return res.json({ success: true, sessions: sessionsWithPreview });
    } catch (err) {
      console.error('[ChatController] listSessions error:', err);
      return res.status(500).json({ success: false, error: 'Failed to list sessions' });
    }
  }
}
