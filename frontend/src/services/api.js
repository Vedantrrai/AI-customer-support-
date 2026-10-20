const API_BASE = '/api';

export const api = {
  // Chat endpoints
  async initSession(payload = {}) {
    const res = await fetch(`${API_BASE}/chat/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async sendMessage(payload) {
    const res = await fetch(`${API_BASE}/chat/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async getHistory(sessionId) {
    const res = await fetch(`${API_BASE}/chat/history/${sessionId}`);
    return res.json();
  },

  async rateMessage(messageId, rating) {
    const res = await fetch(`${API_BASE}/chat/message/${messageId}/rate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating })
    });
    return res.json();
  },

  async escalateSession(payload) {
    const res = await fetch(`${API_BASE}/chat/escalate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async submitFeedback(payload) {
    const res = await fetch(`${API_BASE}/chat/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async listSessions() {
    const res = await fetch(`${API_BASE}/chat/sessions`);
    return res.json();
  },

  // FAQ endpoints
  async getFaqs(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/faqs${query ? '?' + query : ''}`);
    return res.json();
  },

  async createFaq(payload) {
    const res = await fetch(`${API_BASE}/faqs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async updateFaq(id, payload) {
    const res = await fetch(`${API_BASE}/faqs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async deleteFaq(id) {
    const res = await fetch(`${API_BASE}/faqs/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  async testFaqMatch(query) {
    const res = await fetch(`${API_BASE}/faqs/test-match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    return res.json();
  },

  // Ticket endpoints
  async getTickets(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/tickets${query ? '?' + query : ''}`);
    return res.json();
  },

  async getTicketById(id) {
    const res = await fetch(`${API_BASE}/tickets/${id}`);
    return res.json();
  },

  async assignTicket(id, agentName) {
    const res = await fetch(`${API_BASE}/tickets/${id}/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agentName })
    });
    return res.json();
  },

  async replyToTicket(id, payload) {
    const res = await fetch(`${API_BASE}/tickets/${id}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async resolveTicket(id, payload) {
    const res = await fetch(`${API_BASE}/tickets/${id}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  // Analytics
  async getAnalytics() {
    const res = await fetch(`${API_BASE}/analytics/overview`);
    return res.json();
  },

  // Settings
  async getSettings() {
    const res = await fetch(`${API_BASE}/settings`);
    return res.json();
  },

  async updateSettings(payload) {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  }
};
