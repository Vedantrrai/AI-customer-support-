import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      id="theme-toggle-btn"
      title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-light)',
        color: 'var(--text-muted)',
        cursor: 'pointer',
        transition: 'border-color 0.15s ease'
      }}
    >
      {theme === 'dark' ? (
        <Sun size={15} style={{ color: '#f59e0b' }} />
      ) : (
        <Moon size={15} style={{ color: '#475467' }} />
      )}
    </button>
  );
}
