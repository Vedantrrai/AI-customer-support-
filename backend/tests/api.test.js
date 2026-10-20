import test from 'node:test';
import assert from 'node:assert';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { seedDatabase } from '../src/data/seedData.js';
import { KnowledgeBaseService } from '../src/services/knowledgeBaseService.js';
import { EscalationService } from '../src/services/escalationService.js';
import { Faq } from '../src/models/Faq.js';
import { Conversation } from '../src/models/Conversation.js';
import { Message } from '../src/models/Message.js';
import { Ticket } from '../src/models/Ticket.js';

test('NovaSupport AI Backend Test Suite', async (t) => {
  await t.test('Database Connection & Seeding', async () => {
    process.env.USE_IN_MEMORY_DB = 'true';
    await connectDB();
    await seedDatabase();

    const faqCount = await Faq.countDocuments();
    assert.ok(faqCount >= 8, `Expected at least 8 seeded FAQs, got ${faqCount}`);
  });

  await t.test('KnowledgeBaseService - Semantic & Token Search', async () => {
    // 1. Search for return policy
    const returnResult = await KnowledgeBaseService.search('How do I return an item?');
    assert.ok(returnResult.matches.length > 0, 'Should find return policy');
    assert.strictEqual(returnResult.topMatch.category, 'Returns');
    assert.ok(returnResult.confidence > 0.4, 'Confidence should be high for direct question');

    // 2. Search for password reset
    const pwdResult = await KnowledgeBaseService.search('forgot my password can i reset it');
    assert.ok(pwdResult.matches.length > 0, 'Should find password reset');
    assert.strictEqual(pwdResult.topMatch.category, 'Account');

    // 3. Search for unknown question
    const unknownResult = await KnowledgeBaseService.search('how to bake sourdough bread');
    assert.ok(unknownResult.matches.length === 0 || unknownResult.confidence < 0.25, 'Should have low confidence for irrelevant question');
  });

  await t.test('EscalationService - Sentiment & Trigger Detection', async () => {
    // 1. Explicit request for human
    const res1 = EscalationService.analyzeMessage('I want to speak to a human representative right now');
    assert.strictEqual(res1.shouldEscalate, true);
    assert.strictEqual(res1.reason, 'customer_request');

    // 2. High frustration / legal threat
    const res2 = EscalationService.analyzeMessage('This is a complete scam I will contact my lawyer');
    assert.strictEqual(res2.shouldEscalate, true);
    assert.strictEqual(res2.priority, 'urgent');

    // 3. Normal question should not escalate
    const res3 = EscalationService.analyzeMessage('What payment methods do you accept?');
    assert.strictEqual(res3.shouldEscalate, false);
  });

  await t.test('Ticket Creation and Resolution Cycle', async () => {
    const testSessionId = 'test_session_xyz99';
    const ticket = await EscalationService.createEscalationTicket({
      sessionId: testSessionId,
      customerName: 'Test User',
      customerEmail: 'test@example.com',
      reason: 'customer_request',
      priority: 'high',
      subject: 'Test Ticket Cycle',
      summary: 'Testing lifecycle'
    });

    assert.ok(ticket.ticketNumber.startsWith('TICK-'));
    assert.strictEqual(ticket.status, 'open');

    // Check conversation status
    const conv = await Conversation.findOne({ sessionId: testSessionId });
    assert.strictEqual(conv.status, 'escalated');
    assert.strictEqual(conv.escalatedToHuman, true);

    // Resolve ticket
    ticket.status = 'resolved';
    ticket.resolvedAt = new Date();
    await ticket.save();

    assert.strictEqual(ticket.status, 'resolved');
  });

  // Teardown
  t.after(async () => {
    await disconnectDB();
  });
});
