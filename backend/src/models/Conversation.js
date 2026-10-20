import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    customerName: { type: String, default: 'Guest Customer' },
    customerEmail: { type: String, default: '' },
    status: {
      type: String,
      enum: ['active', 'escalated', 'resolved', 'closed'],
      default: 'active'
    },
    escalatedToHuman: { type: Boolean, default: false },
    assignedAgent: { type: String, default: null },
    satisfactionScore: { type: Number, min: 1, max: 5, default: null },
    feedbackNote: { type: String, default: '' },
    metadata: {
      userAgent: String,
      ip: String,
      escalationReason: String
    }
  },
  { timestamps: true }
);

export const Conversation =
  mongoose.models.Conversation || mongoose.model('Conversation', conversationSchema);
