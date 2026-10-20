import { Faq } from '../models/Faq.js';
import { Ticket } from '../models/Ticket.js';
import { Conversation } from '../models/Conversation.js';
import { Message } from '../models/Message.js';
import { Setting } from '../models/Setting.js';

export const initialFaqs = [
  {
    question: 'How do I track my order?',
    answer: 'You can track your order in real time by clicking on **"Track Order"** at the top of our website or inside your confirmation email. Enter your **Order Number** (e.g., #ORD-8831) and shipping zip code to see courier updates and live GPS tracking.',
    category: 'Orders',
    tags: ['tracking', 'order status', 'delivery', 'courier'],
    keywords: ['track', 'order', 'status', 'where is', 'package', 'tracking number'],
    helpfulCount: 42,
    unhelpfulCount: 1
  },
  {
    question: 'What is your return policy?',
    answer: 'We offer a **30-day risk-free return window** for all unused items in their original packaging. Return shipping is 100% free within the United States. Once received at our fulfillment center, refunds are processed to your original payment method within **3-5 business days**.',
    category: 'Returns',
    tags: ['returns', 'refund', 'policy', 'money back'],
    keywords: ['return', 'refund', 'exchange', 'send back', 'money back', '30 days'],
    helpfulCount: 88,
    unhelpfulCount: 3
  },
  {
    question: 'How can I change or cancel my delivery address?',
    answer: 'If your order has not yet entered the "Shipped" stage, you can modify your shipping address directly in **Account > Recent Orders > Edit Address**. If it has already shipped, please contact our support team immediately so we can request a courier package reroute.',
    category: 'Shipping',
    tags: ['address', 'cancel order', 'change delivery'],
    keywords: ['address', 'change address', 'wrong address', 'cancel', 'modify order'],
    helpfulCount: 35,
    unhelpfulCount: 2
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We support all major payment providers including **Visa, MasterCard, American Express, PayPal, Apple Pay, Google Pay, and Klarna / Affirm** installment plans. All transactions are protected by end-to-end 256-bit SSL encryption.',
    category: 'Billing',
    tags: ['payment', 'credit card', 'paypal', 'apple pay'],
    keywords: ['payment', 'credit card', 'paypal', 'pay', 'billing', 'apple pay'],
    helpfulCount: 29,
    unhelpfulCount: 0
  },
  {
    question: 'How do I download my invoice or tax receipt?',
    answer: 'To view or download invoices: navigate to **Account Settings > Billing & Invoices**. Click **"Download PDF"** next to any purchase date. For VAT or corporate tax ID additions, click "Edit Billing Details" before downloading.',
    category: 'Billing',
    tags: ['invoice', 'receipt', 'tax', 'vat'],
    keywords: ['invoice', 'receipt', 'bill', 'tax', 'pdf invoice'],
    helpfulCount: 19,
    unhelpfulCount: 1
  },
  {
    question: 'How do I reset my account password?',
    answer: 'Go to the login screen and click **"Forgot Password?"**. Enter the email associated with your account, and we will email you a secure 6-digit verification code or single-use reset link valid for 15 minutes. Check your spam folder if it doesn\'t arrive within 60 seconds.',
    category: 'Account',
    tags: ['password', 'login', 'reset', 'security'],
    keywords: ['password', 'reset password', 'forgot password', 'login issue', 'locked out'],
    helpfulCount: 54,
    unhelpfulCount: 4
  },
  {
    question: 'How do I enable Two-Factor Authentication (2FA)?',
    answer: 'To activate 2FA for maximum account safety: Go to **Account Settings > Security > Two-Factor Authentication**. We support standard TOTP authenticator apps such as Google Authenticator, Authy, and 1Password, as well as SMS verification.',
    category: 'Account',
    tags: ['security', '2fa', 'mfa', 'authenticator'],
    keywords: ['2fa', 'two-factor', 'mfa', 'authenticator', 'security code'],
    helpfulCount: 15,
    unhelpfulCount: 0
  },
  {
    question: 'What should I do if my package arrived damaged?',
    answer: 'We sincerely apologize! If your package arrived damaged or missing parts, please take a quick photo of the shipping box and the damaged product, then click **"Talk to Human Agent"** right here or email us at claims@novasupport.io. We will ship a replacement free of charge immediately.',
    category: 'Shipping',
    tags: ['damaged', 'broken', 'replacement', 'claim'],
    keywords: ['damaged', 'broken', 'defective', 'missing item', 'crushed', 'replacement'],
    helpfulCount: 63,
    unhelpfulCount: 2
  },
  {
    question: 'How do I contact a human customer support agent?',
    answer: 'You can connect directly with our human support team at any time! Click the **"Talk to Human Agent"** button at the top right of this chat window, or type *"I need to speak to a person"*. Our live support specialists are available 24/7.',
    category: 'General',
    tags: ['human support', 'agent', 'representative', 'helpdesk'],
    keywords: ['human', 'agent', 'representative', 'person', 'operator', 'talk to human'],
    helpfulCount: 112,
    unhelpfulCount: 5
  },
  {
    question: 'How long does standard and expedited shipping take?',
    answer: 'Standard shipping takes **3-5 business days** within the continental US. Priority Expedited shipping takes **1-2 business days**. International shipments typically take **7-12 business days** depending on customs clearance.',
    category: 'Shipping',
    tags: ['shipping time', 'delivery speed', 'expedited'],
    keywords: ['how long', 'shipping time', 'delivery speed', 'express', 'delivery days'],
    helpfulCount: 47,
    unhelpfulCount: 1
  }
];

export async function seedDatabase() {
  try {
    const count = await Faq.countDocuments();
    if (count === 0) {
      console.log('[Seed] Seeding initial knowledge base FAQs...');
      await Faq.insertMany(initialFaqs);
      console.log(`[Seed] Seeded ${initialFaqs.length} knowledge base articles.`);
    }

    // Seed sample tickets if empty
    const ticketCount = await Ticket.countDocuments();
    if (ticketCount === 0) {
      console.log('[Seed] Seeding sample escalation tickets for admin review...');
      await Ticket.insertMany([
        {
          ticketNumber: 'TICK-482019',
          sessionId: 'session_demo_01',
          customerName: 'Marcus Vance',
          customerEmail: 'marcus.v@example.com',
          subject: 'Package marked delivered but not found',
          summary: 'Customer reports courier marked parcel delivered at porch 2 hours ago, but CCTV shows no delivery attempt.',
          priority: 'high',
          status: 'open',
          reason: 'order_issue',
          assignedAgent: 'Unassigned'
        },
        {
          ticketNumber: 'TICK-391402',
          sessionId: 'session_demo_02',
          customerName: 'Elena Rostova',
          customerEmail: 'elena.rostova@example.com',
          subject: 'Custom invoice required for EU VAT deduction',
          summary: 'Enterprise customer requested VAT ID EU99281928 added to annual subscription invoice receipt.',
          priority: 'medium',
          status: 'in_progress',
          reason: 'customer_request',
          assignedAgent: 'Agent Jessica'
        },
        {
          ticketNumber: 'TICK-218491',
          sessionId: 'session_demo_03',
          customerName: 'David Chen',
          customerEmail: 'david.chen@example.com',
          subject: 'Defective power unit replacement',
          summary: 'Serial number SN-98218 power supply failure. Replacement unit approved and dispatched via FedEx Overnight.',
          priority: 'urgent',
          status: 'resolved',
          reason: 'order_issue',
          assignedAgent: 'Agent Carlos',
          resolutionNotes: 'Dispatched expedited replacement order #REP-99218. Customer satisfied.',
          resolvedAt: new Date(Date.now() - 3600000 * 4)
        }
      ]);

      // Seed sample conversations for the tickets
      await Conversation.create([
        {
          sessionId: 'session_demo_01',
          customerName: 'Marcus Vance',
          customerEmail: 'marcus.v@example.com',
          status: 'escalated',
          escalatedToHuman: true
        },
        {
          sessionId: 'session_demo_02',
          customerName: 'Elena Rostova',
          customerEmail: 'elena.rostova@example.com',
          status: 'escalated',
          escalatedToHuman: true,
          assignedAgent: 'Agent Jessica'
        },
        {
          sessionId: 'session_demo_03',
          customerName: 'David Chen',
          customerEmail: 'david.chen@example.com',
          status: 'resolved',
          satisfactionScore: 5,
          feedbackNote: 'Fast replacement, Carlos was exceptional!'
        }
      ]);

      // Seed messages for demo session 1
      await Message.insertMany([
        {
          sessionId: 'session_demo_01',
          sender: 'customer',
          text: 'Hi, my tracking says package was delivered but nothing is at my front door.'
        },
        {
          sessionId: 'session_demo_01',
          sender: 'bot',
          text: 'I apologize for the inconvenience! Sometimes couriers prematurely scan parcels before arrival. Would you like me to connect you with our live shipping escalation team to open a courier investigation?'
        },
        {
          sessionId: 'session_demo_01',
          sender: 'customer',
          text: 'Yes please get me a human agent immediately.'
        },
        {
          sessionId: 'session_demo_01',
          sender: 'system',
          text: '🛡️ **Connected to Human Support Queue** (Ticket #TICK-482019). A support specialist will respond shortly.'
        }
      ]);
    }

    // Default settings
    await Setting.findOneAndUpdate(
      { key: 'llm_provider' },
      { value: 'mock', description: 'Active LLM Engine (gemini, openai, mock)' },
      { upsert: true }
    );
  } catch (err) {
    console.error('[Seed] Error seeding database:', err.message);
  }
}
