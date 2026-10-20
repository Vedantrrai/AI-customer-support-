import React, { useState, useRef } from 'react';
import { ArrowRight, Sparkles, Plus } from 'lucide-react';

export function ChatInput({ onSendMessage, onEscalateClick, disabled, isEscalated }) {
  const [text, setText] = useState('');
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!text.trim() || disabled) return;
    onSendMessage(text.trim());
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      style={{
        padding: '12px 24px 20px 24px',
        display: 'flex',
        justifyContent: 'center',
        background: 'transparent',
        position: 'relative',
        zIndex: 10
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          maxWidth: '820px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-light)',
          borderRadius: '9999px',
          padding: '8px 12px 8px 16px',
          boxShadow: 'var(--shadow-floating)',
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease'
        }}
      >
        {/* Left Sparkles / Plus Icon (matches reference) */}
        <button
          type="button"
          onClick={onEscalateClick}
          title="Connect to Human Agent"
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6366f1',
            cursor: 'pointer'
          }}
        >
          <Sparkles size={18} />
        </button>

        {/* Text Input */}
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            isEscalated
              ? 'Message connected human agent...'
              : 'Ask or search for anything. Use @ to tag a file or collection.'
          }
          disabled={disabled}
          id="chat-textarea-input"
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-main)',
            fontSize: '0.9rem',
            lineHeight: 1.5,
            padding: '4px 0'
          }}
        />

        {/* Right Arrow Submit Button (matches reference circle arrow button) */}
        <button
          type="submit"
          disabled={!text.trim() || disabled}
          id="send-message-btn"
          aria-label="Send Message"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: text.trim() && !disabled ? '#2563eb' : 'var(--bg-secondary)',
            color: text.trim() && !disabled ? '#ffffff' : 'var(--text-light)',
            border: 'none',
            flexShrink: 0,
            cursor: text.trim() && !disabled ? 'pointer' : 'default',
            transition: 'background 0.15s ease, color 0.15s ease'
          }}
        >
          <ArrowRight size={16} />
        </button>
      </form>
    </div>
  );
}
