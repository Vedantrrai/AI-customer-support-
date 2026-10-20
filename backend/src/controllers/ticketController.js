import { Ticket } from '../models/Ticket.js';
import { Conversation } from '../models/Conversation.js';
import { Message } from '../models/Message.js';

export class TicketController {
  static async getAll(req, res) {
    try {
      const { status, priority, search } = req.query;
      const filter = {};

      if (status && status !== 'all') {
        filter.status = status;
      }

      if (priority && priority !== 'all') {
        filter.priority = priority;
      }

      if (search && search.trim()) {
        const regex = new RegExp(search.trim(), 'i');
        filter.$or = [
          { ticketNumber: regex },
          { customerName: regex },
          { customerEmail: regex },
          { subject: regex },
          { summary: regex }
        ];
      }

      const tickets = await Ticket.find(filter).sort({ createdAt: -1 });
      return res.json({ success: true, count: tickets.length, tickets });
    } catch (err) {
      console.error('[TicketController] getAll error:', err);
      return res.status(500).json({ success: false, error: 'Failed to retrieve tickets' });
    }
  }

  static async getById(req, res) {
    try {
      const ticket = await Ticket.findById(req.params.id);
      if (!ticket) return res.status(404).json({ success: false, error: 'Ticket not found' });

      // Fetch corresponding conversation transcript
      const messages = await Message.find({ sessionId: ticket.sessionId }).sort({ createdAt: 1 });
      const conversation = await Conversation.findOne({ sessionId: ticket.sessionId });

      return res.json({
        success: true,
        ticket,
        messages,
        conversation
      });
    } catch (err) {
      console.error('[TicketController] getById error:', err);
      return res.status(500).json({ success: false, error: 'Failed to retrieve ticket' });
    }
  }

  static async assign(req, res) {
    try {
      const { agentName } = req.body;
      const ticket = await Ticket.findByIdAndUpdate(
        req.params.id,
        {
          assignedAgent: agentName || 'Agent Specialist',
          status: 'in_progress'
        },
        { new: true }
      );

      if (!ticket) return res.status(404).json({ success: false, error: 'Ticket not found' });

      // Post system announcement to session
      await Message.create({
        sessionId: ticket.sessionId,
        sender: 'system',
        text: `👨‍💼 **${ticket.assignedAgent}** has joined the conversation to assist you.`
      });

      return res.json({ success: true, ticket });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Failed to assign ticket' });
    }
  }

  /**
   * Human Agent replies directly to customer chat
   */
  static async reply(req, res) {
    try {
      const { id } = req.params;
      const { text, agentName } = req.body;

      if (!text?.trim()) {
        return res.status(400).json({ success: false, error: 'Message text is required' });
      }

      const ticket = await Ticket.findById(id);
      if (!ticket) return res.status(404).json({ success: false, error: 'Ticket not found' });

      const senderName = agentName || ticket.assignedAgent || 'Support Specialist';

      // Post agent message into conversation
      const agentMsg = await Message.create({
        sessionId: ticket.sessionId,
        sender: 'agent',
        text: text.trim(),
        confidence: 1.0
      });

      // Update ticket status to in_progress if open
      if (ticket.status === 'open') {
        ticket.status = 'in_progress';
        ticket.assignedAgent = senderName;
        await ticket.save();
      }

      return res.json({ success: true, message: agentMsg, ticket });
    } catch (err) {
      console.error('[TicketController] reply error:', err);
      return res.status(500).json({ success: false, error: 'Failed to reply to ticket' });
    }
  }

  static async resolve(req, res) {
    try {
      const { resolutionNotes } = req.body;
      const ticket = await Ticket.findByIdAndUpdate(
        req.params.id,
        {
          status: 'resolved',
          resolutionNotes: resolutionNotes || 'Resolved by human support agent.',
          resolvedAt: new Date()
        },
        { new: true }
      );

      if (!ticket) return res.status(404).json({ success: false, error: 'Ticket not found' });

      // Update conversation status
      await Conversation.findOneAndUpdate(
        { sessionId: ticket.sessionId },
        { status: 'resolved', escalatedToHuman: false }
      );

      // Post system notification into chat
      await Message.create({
        sessionId: ticket.sessionId,
        sender: 'system',
        text: `✅ **Ticket #${ticket.ticketNumber} Resolved**\n\n${resolutionNotes || 'This support request has been marked as resolved.'}\n\nPlease let us know if you need any additional help!`
      });

      return res.json({ success: true, ticket });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Failed to resolve ticket' });
    }
  }
}
