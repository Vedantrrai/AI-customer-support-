import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, index: true },
    sender: {
      type: String,
      enum: ['customer', 'bot', 'agent', 'system'],
      required: true
    },
    text: { type: String, required: true },
    sources: [
      {
        faqId: { type: mongoose.Schema.Types.ObjectId, ref: 'Faq' },
        question: String,
        category: String,
        relevanceScore: Number
      }
    ],
    confidence: { type: Number, default: 1.0 },
    feedback: {
      type: String,
      enum: ['helpful', 'unhelpful', null],
      default: null
    },
    escalationSuggested: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);
