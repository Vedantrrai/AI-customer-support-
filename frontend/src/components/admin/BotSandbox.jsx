import React, { useState } from 'react';
import { api } from '../../services/api';
import { Sparkles, Search, Layers, Play, CheckCircle, AlertTriangle } from 'lucide-react';
import { formatMarkdown } from '../../utils/formatMarkdown';

export function BotSandbox() {
  const [testQuery, setTestQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const sampleQueries = [
    'How do I track my order?',
    'What is your return policy?',
    'I want to speak with a human support agent',
    'Do you support Apple Pay and PayPal?',
    'How do I make sourdough bread?'
  ];

  const handleTest = async (queryToTest) => {
    const q = queryToTest || testQuery;
    if (!q.trim()) return;

    try {
      setLoading(true);
      const res = await api.testFaqMatch(q.trim());
      if (res.success) {
        setResult(res);
      }
    } catch (e) {
      console.error('Test match failed', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>
          AI Knowledge Retrieval & Sandbox Tester
        </h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Test customer queries in real-time to inspect retrieval confidence scores and matched knowledge articles.
        </p>
      </div>

      {/* Input and Test Form */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-light)',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
          <input
            type="text"
            value={testQuery}
            onChange={(e) => setTestQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleTest()}
            placeholder="Type sample customer query to test knowledge matching..."
            id="sandbox-test-query-input"
            style={{
              flex: 1,
              padding: '11px 14px',
              borderRadius: '10px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-light)',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              outline: 'none'
            }}
          />
          <button
            onClick={() => handleTest()}
            disabled={!testQuery.trim() || loading}
            id="run-sandbox-test-btn"
            className="btn-primary"
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.86rem'
            }}
          >
            <Play size={14} />
            <span>{loading ? 'Evaluating...' : 'Run Test'}</span>
          </button>
        </div>

        {/* Quick query chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Quick tests:</span>
          {sampleQueries.map((sq, i) => (
            <button
              key={i}
              onClick={() => {
                setTestQuery(sq);
                handleTest(sq);
              }}
              style={{
                fontSize: '0.75rem',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-light)',
                borderRadius: '6px',
                padding: '3px 8px',
                color: 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              "{sq}"
            </button>
          ))}
        </div>
      </div>

      {/* Results View */}
      {result && (
        <div
          className="animate-fade-in"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '16px'
          }}
        >
          {/* Match Score & Confidence Card */}
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-light)',
              borderRadius: '16px',
              padding: '20px'
            }}
          >
            <h3 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '12px' }}>
              Retrieval Confidence Analysis
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <div
                style={{
                  fontSize: '2.2rem',
                  fontWeight: 800,
                  color: result.confidence >= 0.5 ? '#22c55e' : result.confidence >= 0.25 ? '#f59e0b' : '#ef4444'
                }}
              >
                {Math.round(result.confidence * 100)}%
              </div>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                  {result.confidence >= 0.5
                    ? 'High Confidence Match'
                    : result.confidence >= 0.25
                    ? 'Moderate Match'
                    : 'Low / Uncertain Match'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {result.confidence >= 0.25
                    ? 'Eligible for direct automated answer'
                    : 'Triggers human escalation suggestion'}
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Total Verified Articles Matched: <strong>{result.matches?.length || 0}</strong>
            </div>
          </div>

          {/* Ranked Articles List */}
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-light)',
              borderRadius: '16px',
              padding: '20px',
              gridColumn: '1 / -1'
            }}
          >
            <h3 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '14px' }}>
              Ranked Knowledge Articles Retrieved
            </h3>

            {result.matches?.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No articles passed the minimum relevance threshold for this query.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {result.matches.map((m, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '10px',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-light)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.72rem', background: 'var(--tag-bg)', color: 'var(--accent-primary)', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                        Rank #{idx + 1} • {m.category}
                      </span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#22c55e' }}>
                        Relevance: {Math.round(m.score * 100)}%
                      </span>
                    </div>

                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.88rem', marginBottom: '4px' }}>
                      {m.question}
                    </div>

                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {m.answer}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
