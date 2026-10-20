import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true },
    category: {
      type: String,
      default: 'General',
      enum: ['General', 'Billing', 'Shipping', 'Returns', 'Account', 'Technical', 'Orders']
    },
    tags: [{ type: String, trim: true }],
    keywords: [{ type: String, trim: true }],
    helpfulCount: { type: Number, default: 0 },
    unhelpfulCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

faqSchema.index({ question: 'text', answer: 'text', keywords: 'text', tags: 'text' });

export const Faq = mongoose.models.Faq || mongoose.model('Faq', faqSchema);
