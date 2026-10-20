import React from 'react';

/**
 * Lightweight, safe markdown formatter for chat responses
 */
export function formatMarkdown(text) {
  if (!text) return null;

  const lines = text.split('\n');
  const elements = [];

  lines.forEach((line, lineIdx) => {
    // Bullet point line
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      const content = line.trim().substring(2);
      elements.push(
        <div key={lineIdx} style={{ display: 'flex', gap: '8px', margin: '4px 0', alignItems: 'flex-start' }}>
          <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>•</span>
          <div>{renderInline(content)}</div>
        </div>
      );
      return;
    }

    // Numbered list
    const numMatch = line.trim().match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      elements.push(
        <div key={lineIdx} style={{ display: 'flex', gap: '8px', margin: '4px 0', alignItems: 'flex-start' }}>
          <span style={{ color: 'var(--accent-primary)', fontWeight: '600', minWidth: '18px' }}>{numMatch[1]}.</span>
          <div>{renderInline(numMatch[2])}</div>
        </div>
      );
      return;
    }

    // Empty line = spacer
    if (!line.trim()) {
      elements.push(<div key={lineIdx} style={{ height: '8px' }} />);
      return;
    }

    // Standard paragraph
    elements.push(
      <p key={lineIdx} style={{ margin: '4px 0', lineHeight: 1.55 }}>
        {renderInline(line)}
      </p>
    );
  });

  return elements;
}

function renderInline(text) {
  if (!text) return '';

  // Handle Bold **text**
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    // Handle italics *text*
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return <em key={i} style={{ color: 'var(--text-secondary)' }}>{part.slice(1, -1)}</em>;
    }
    // Handle inline code `code`
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code
          key={i}
          style={{
            background: 'var(--tag-bg)',
            padding: '2px 6px',
            borderRadius: '4px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85em',
            color: 'var(--accent-primary)'
          }}
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}
