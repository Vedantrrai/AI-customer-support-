import React from 'react';
import { Package, RefreshCw, MapPin, CreditCard, Lock, Headphones } from 'lucide-react';

const SUGGESTIONS = [
  { label: 'Track My Order', icon: Package, query: 'How do I track my order?' },
  { label: 'Return Policy', icon: RefreshCw, query: 'What is your return policy?' },
  { label: 'Change Address', icon: MapPin, query: 'Can I change my delivery address?' },
  { label: 'Payment Options', icon: CreditCard, query: 'What payment methods do you accept?' },
  { label: 'Reset Password', icon: Lock, query: 'How do I reset my password?' },
  { label: 'Live Support', icon: Headphones, query: 'I want to speak with a human support agent' }
];

export function QuickPrompts({ onSelectPrompt }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto',
        padding: '10px 20px',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}
    >
      <span
        style={{
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          fontWeight: 600,
          whiteSpace: 'nowrap'
        }}
      >
        Suggested:
      </span>
      {SUGGESTIONS.map((item, idx) => {
        const Icon = item.icon;
        return (
          <button
            key={idx}
            onClick={() => onSelectPrompt(item.query)}
            id={`quick-prompt-${idx}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '999px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-light)',
              color: 'var(--text-secondary)',
              fontSize: '0.78rem',
              fontWeight: 500,
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-primary)';
              e.currentTarget.style.color = 'var(--accent-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-light)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            <Icon size={12} style={{ color: 'var(--accent-primary)' }} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
