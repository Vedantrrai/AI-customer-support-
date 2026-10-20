import { Ticket } from '../models/Ticket.js';
import { Conversation } from '../models/Conversation.js';

const ESCALATION_TRIGGERS = [
  { pattern: /\b(speak to (a |an )?(human|person|agent|representative|operator|manager|supervisor))\b/i, reason: 'customer_request', priority: 'high' },
  { pattern: /\b(real (person|human|agent))\b/i, reason: 'customer_request', priority: 'high' },
  { pattern: /\b(transfer me|get me an agent|talk to someone)\b/i, reason: 'customer_request', priority: 'high' },
  { pattern: /\b(useless|terrible|garbage|horrible|waste of time|hate this)\b/i, reason: 'negative_sentiment', priority: 'high' },
  { pattern: /\b(lawsuit|sue|lawyer|legal action|fraud|scam|stolen|chargeback|bbb)\b/i, reason: 'negative_sentiment', priority: 'urgent' },
  { pattern: /\b(wrong item|defective|damaged|never arrived|lost package)\b/i, reason: 'order_issue', priority: 'medium' }
];

export class EscalationService {
  /**
   * Evaluates whether a message or conversation context requires escalation
   */
  static analyzeMessage(text, confidenceScore = 1.0, unhelpfulCount = 0) {
    if (!text) return { shouldEscalate: false };

    // 1. Keyword / sentiment pattern matches
    for (const trigger of ESCALATION_TRIGGERS) {
      if (trigger.pattern.test(text)) {
        return {
          shouldEscalate: true,
          reason: trigger.reason,
          priority: trigger.priority,
          message: 'It sounds like you need personalized assistance from our team. I am connecting you with a human support specialist right away.'
        };
      }
    }

    // 2. Low confidence threshold
    if (confidenceScore < 0.25) {
      return {
        shouldEscalate: false,
        suggestEscalation: true,
        reason: 'low_confidence',
        priority: 'medium',
        message: 'I am not entirely sure about this from our current knowledge base. Would you like me to transfer you to a human support agent?'
      };
    }

    // 3. Repeated negative feedback
    if (unhelpfulCount >= 2) {
      return {
        shouldEscalate: true,
        reason: 'negative_sentiment',
        priority: 'high',
        message: 'I notice my previous answers did not fully resolve your issue. Let me route this conversation to one of our human support experts.'
      };
    }

    return { shouldEscalate: false };
  }

  /**
   * Creates an escalation ticket in the database and updates conversation status
   */
  static async createEscalationTicket({ sessionId, customerName, customerEmail, reason, priority, subject, summary }) {
    // Find or update conversation
    let conv = await Conversation.findOne({ sessionId });
    if (!conv) {
      conv = await Conversation.create({
        sessionId,
        customerName: customerName || 'Guest Customer',
        customerEmail: customerEmail || '',
        status: 'escalated',
        escalatedToHuman: true
      });
    } else {
      conv.status = 'escalated';
      conv.escalatedToHuman = true;
      await conv.save();
    }

    // Check if an open ticket already exists for this session
    let existingTicket = await Ticket.findOne({
      sessionId,
      status: { $in: ['open', 'in_progress'] }
    });

    if (existingTicket) {
      if (priority === 'urgent' && existingTicket.priority !== 'urgent') {
        existingTicket.priority = 'urgent';
        await existingTicket.save();
      }
      return existingTicket;
    }

    // Create new ticket
    const ticket = await Ticket.create({
      sessionId,
      customerName: customerName || conv.customerName || 'Customer',
      customerEmail: customerEmail || conv.customerEmail || '',
      subject: subject || `Escalation: ${reason.replace('_', ' ').toUpperCase()}`,
      summary: summary || 'Customer requested or triggered human agent escalation.',
      priority: priority || 'medium',
      reason: reason || 'customer_request',
      status: 'open'
    });

    return ticket;
  }
}
