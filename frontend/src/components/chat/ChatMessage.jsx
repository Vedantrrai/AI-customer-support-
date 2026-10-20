import React, { useState } from 'react';
import { formatMarkdown } from '../../utils/formatMarkdown';
import {
  Bot,
  User,
  Headphones,
  CheckCircle,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ShieldCheck
} from 'lucide-react';

export function ChatMessage({ message, onRate, onEscalateClick }) {
  const [feedback, setFeedback] = useState(message.feedback || null);
  const [showSources, setShowSources] = useState(false);

  const handleFeedback = (rating) => {
    if (feedback === rating) return;
    setFeedback(rating);
    if (onRate) onRate(message._id, rating);
  };

  const isCustomer = message.sender === 'customer';
  const isBot = message.sender === 'bot';
  const isAgent = message.sender === 'agent';
  const isSystem = message.sender === 'system';

  // System notification styling (clean light pill)
  if (isSystem) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          margin: '16px 0'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-light)',
            padding: '8px 16px',
            borderRadius: '999px',
            fontSize: '0.82rem',
            color: 'var(--text-secondary)'
          }}
        >
          <ShieldCheck size={15} style={{ color: '#16a34a' }} />
          <div>{formatMarkdown(message.text)}</div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isCustomer ? 'row-reverse' : 'row',
        alignItems: 'flex-start',
        gap: '12px',
        marginBottom: '20px'
      }}
    >
      {/* Clean Avatar */}
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          background: isCustomer
            ? '#2563eb'
            : isAgent
            ? '#0284c7'
            : 'var(--bg-secondary)',
          color: isCustomer || isAgent ? '#ffffff' : 'var(--text-secondary)',
          border: '1px solid ' + (isCustomer || isAgent ? 'transparent' : 'var(--border-light)'),
          fontSize: '0.82rem',
          fontWeight: 600
        }}
      >
        {isCustomer && <User size={16} />}
        {isBot && <Bot size={16} />}
        {isAgent && <Headphones size={16} />}
      </div>

      {/* Message Content Container */}
      <div style={{ maxWidth: '82%' }}>
        {/* Sender Name & Meta */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '4px',
            justifyContent: isCustomer ? 'flex-end' : 'flex-start'
          }}
        >
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            {isCustomer ? 'You' : isAgent ? 'Support Specialist' : 'Nova AI'}
          </span>

          {isAgent && (
            <span
              style={{
                fontSize: '0.68rem',
                background: '#eff8ff',
                color: '#175cd3',
                border: '1px solid #d1e9ff',
                padding: '1px 6px',
                borderRadius: '4px',
                fontWeight: 600
              }}
            >
              HUMAN AGENT
            </span>
          )}

          {isBot && message.confidence !== undefined && (
            <span
              style={{
                fontSize: '0.7rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: message.confidence > 0.5 ? '#15803d' : '#b45309',
                background: message.confidence > 0.5 ? '#f0fdf4' : '#fef3c7',
                border: message.confidence > 0.5 ? '1px solid #dcfce7' : '1px solid #fde68a',
                padding: '1px 6px',
                borderRadius: '4px',
                fontWeight: 500
              }}
            >
              <CheckCircle size={11} />
              {message.confidence > 0.5 ? 'Verified KB' : 'AI Assistant'}
            </span>
          )}

          <span style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>
            {message.createdAt
              ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : 'Just now'}
          </span>
        </div>

        {/* Message Bubble (Clean Minimal Card) */}
        <div
          style={{
            padding: '14px 18px',
            borderRadius: '12px',
            background: isCustomer
              ? 'var(--customer-bubble-bg)'
              : 'var(--bot-bubble-bg)',
            color: 'var(--text-primary)',
            border: isCustomer
              ? '1px solid var(--customer-bubble-border)'
              : isAgent
              ? '1px solid #bfdbfe'
              : '1px solid var(--border-light)',
            borderLeft: isAgent ? '3px solid #2563eb' : undefined,
            boxShadow: 'var(--shadow-xs)',
            fontSize: '0.92rem',
            lineHeight: 1.6,
            wordBreak: 'break-word'
          }}
        >
          {formatMarkdown(message.text)}
        </div>

        {/* Knowledge Sources Drawer (for bot messages) */}
        {isBot && message.sources && message.sources.length > 0 && (
          <div style={{ marginTop: '6px' }}>
            <button
              onClick={() => setShowSources(!showSources)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                background: 'none',
                border: 'none',
                color: '#2563eb',
                fontSize: '0.76rem',
                fontWeight: 500,
                cursor: 'pointer',
                padding: '2px 0'
              }}
            >
              <ExternalLink size={12} />
              {showSources
                ? 'Hide Reference Sources'
                : `View ${message.sources.length} Referenced Article${message.sources.length > 1 ? 's' : ''}`}
              {showSources ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>

            {showSources && (
              <div
                style={{
                  marginTop: '6px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-light)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                {message.sources.map((src, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.78rem',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    <span>
                      • <strong>{src.category}:</strong> {src.question}
                    </span>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        color: 'var(--text-muted)'
                      }}
                    >
                      {Math.round((src.relevanceScore || 0.8) * 100)}% match
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Feedback Row */}
        {isBot && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '6px',
              padding: '0 2px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>Was this helpful?</span>
              <button
                onClick={() => handleFeedback('helpful')}
                title="Helpful"
                style={{
                  background: feedback === 'helpful' ? '#f0fdf4' : 'transparent',
                  color: feedback === 'helpful' ? '#16a34a' : 'var(--text-muted)',
                  border: '1px solid ' + (feedback === 'helpful' ? '#bbf7d0' : 'var(--border-light)'),
                  borderRadius: '4px',
                  padding: '2px 6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  fontSize: '0.72rem'
                }}
              >
                <ThumbsUp size={11} />
              </button>
              <button
                onClick={() => handleFeedback('unhelpful')}
                title="Not helpful"
                style={{
                  background: feedback === 'unhelpful' ? '#fef2f2' : 'transparent',
                  color: feedback === 'unhelpful' ? '#dc2626' : 'var(--text-muted)',
                  border: '1px solid ' + (feedback === 'unhelpful' ? '#fecaca' : 'var(--border-light)'),
                  borderRadius: '4px',
                  padding: '2px 6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  fontSize: '0.72rem'
                }}
              >
                <ThumbsDown size={11} />
              </button>
            </div>

            {(message.escalationSuggested || feedback === 'unhelpful') && (
              <button
                onClick={onEscalateClick}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2563eb',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Headphones size={12} />
                Connect to Live Specialist
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
