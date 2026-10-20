import React, { useState } from 'react';
import { Headphones, X, Send } from 'lucide-react';

export function EscalationModal({ isOpen, onClose, onConfirm, initialEmail = '', initialName = '' }) {
  const [name, setName] = useState(initialName || '');
  const [email, setEmail] = useState(initialEmail || '');
  const [reason, setReason] = useState('customer_request');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await onConfirm({
      customerName: name || 'Customer',
      customerEmail: email,
      reason,
      notes
    });
    setSubmitting(false);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(16, 24, 40, 0.4)',
        padding: '16px'
      }}
    >
      <div
        className="clean-card"
        style={{
          width: '100%',
          maxWidth: '460px',
          background: '#ffffff',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: 'var(--shadow-lg)',
          position: 'relative'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              background: '#eff8ff',
              border: '1px solid #d1e9ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2563eb'
            }}
          >
            <Headphones size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Connect to Human Support
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Transfer your chat session to an active support specialist.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sam Smith"
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-light)',
                color: 'var(--text-primary)',
                fontSize: '0.86rem',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sam@example.com"
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-light)',
                color: 'var(--text-primary)',
                fontSize: '0.86rem',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Primary Issue Category
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-light)',
                color: 'var(--text-primary)',
                fontSize: '0.86rem',
                outline: 'none'
              }}
            >
              <option value="customer_request">General Inquiry</option>
              <option value="order_issue">Shipping / Delivery Issue</option>
              <option value="billing">Billing & Invoices</option>
              <option value="technical">Account / Technical Issue</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Additional Details (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Briefly describe what you need assistance with..."
              rows={2}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-light)',
                color: 'var(--text-primary)',
                fontSize: '0.86rem',
                outline: 'none',
                resize: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              id="confirm-escalation-submit-btn"
              className="btn-primary"
              style={{ flex: 2 }}
            >
              <Send size={14} />
              <span>{submitting ? 'Connecting...' : 'Request Specialist'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
