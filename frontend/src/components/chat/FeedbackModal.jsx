import React, { useState } from 'react';
import { Star, X, Check, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

export function FeedbackModal({ isOpen, onClose, onSubmitRating }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    setSubmitted(true);
    await onSubmitRating(rating, note);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1200);
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
          maxWidth: '400px',
          background: '#ffffff',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: 'var(--shadow-lg)',
          textAlign: 'center',
          position: 'relative'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        {submitted ? (
          <div style={{ padding: '16px 0' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: '#f0fdf4',
                color: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto'
              }}
            >
              <Check size={22} />
            </div>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
              Thank You for Your Feedback!
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Your rating helps improve our AI customer support.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#eff8ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto'
              }}
            >
              <Heart size={20} />
            </div>

            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
              How was your experience?
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Please rate the resolution of your support inquiry.
            </p>

            {/* Stars Row */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = (hoverRating || rating) >= star;
                return (
                  <button
                    type="button"
                    key={star}
                    id={`star-rating-btn-${star}`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: isFilled ? '#f59e0b' : '#d0d5dd',
                      transition: 'transform 0.1s ease'
                    }}
                  >
                    <Star size={26} fill={isFilled ? '#f59e0b' : 'none'} />
                  </button>
                );
              })}
            </div>

            <div style={{ marginBottom: '16px' }}>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Optional notes or feedback..."
                rows={2}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-light)',
                  color: 'var(--text-primary)',
                  fontSize: '0.84rem',
                  outline: 'none',
                  resize: 'none'
                }}
              />
            </div>

            <button
              type="submit"
              id="submit-csat-feedback-btn"
              className="btn-primary"
              style={{ width: '100%', padding: '9px' }}
            >
              Submit Feedback
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
