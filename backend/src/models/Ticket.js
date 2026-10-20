import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema(
  {
    ticketNumber: {
      type: String,
      required: true,
      unique: true,
      default: () => 'TICK-' + Math.floor(100000 + Math.random() * 900000)
    },
    sessionId: { type: String, required: true, index: true },
    customerName: { type: String, default: 'Customer' },
    customerEmail: { type: String, default: '' },
    subject: { type: String, default: 'Human Support Request' },
    summary: { type: String, default: '' },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved', 'closed'],
      default: 'open'
    },
    assignedAgent: { type: String, default: 'Unassigned' },
    reason: {
      type: String,
      enum: [
        'customer_request',
        'negative_sentiment',
        'unresolved_faq',
        'low_confidence',
        'manual',
        'order_issue'
      ],
      default: 'customer_request'
    },
    resolutionNotes: { type: String, default: '' },
    resolvedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

export const Ticket = mongoose.models.Ticket || mongoose.model('Ticket', ticketSchema);
