import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Sliders, Cpu, Key, Check, ShieldCheck, Info } from 'lucide-react';

export function SettingsModal() {
  const [settings, setSettings] = useState({
    llm_provider: 'mock',
    confidence_threshold: 0.65,
    system_prompt: '',
    gemini_api_key: '',
    openai_api_key: '',
    has_gemini_key: false,
    has_openai_key: false
  });

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await api.getSettings();
      if (res.success && res.settings) {
        setSettings((prev) => ({
          ...prev,
          ...res.settings
        }));
      }
    } catch (e) {
      console.error('Failed to load settings', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.updateSettings({
        llm_provider: settings.llm_provider,
        confidence_threshold: settings.confidence_threshold,
        system_prompt: settings.system_prompt,
        gemini_api_key: settings.gemini_api_key || undefined,
        openai_api_key: settings.openai_api_key || undefined
      });

      if (res.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
        loadSettings();
      }
    } catch (e) {
      console.error('Failed to update settings', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '720px' }}>
      <div>
        <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>
          AI Engine & System Configuration
        </h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Configure active LLM provider, custom API keys, system persona prompts, and confidence thresholds.
        </p>
      </div>

      <form
        onSubmit={handleSave}
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-light)',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        {/* LLM Engine Selector */}
        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
            Active AI LLM Provider
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
            {[
              { id: 'mock', name: 'Smart Local AI Engine', desc: 'Zero API keys required. Contextual rule synthesis.' },
              { id: 'gemini', name: 'Google Gemini AI', desc: 'Fast, high-quality multimodal support reasoning.' },
              { id: 'openai', name: 'OpenAI GPT-4o Mini', desc: 'Industry standard conversational LLM.' }
            ].map((p) => {
              const active = settings.llm_provider === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSettings({ ...settings, llm_provider: p.id })}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    background: active ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-secondary)',
                    border: '1px solid ' + (active ? 'var(--accent-primary)' : 'var(--border-light)'),
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: '0.86rem', color: active ? 'var(--accent-primary)' : 'var(--text-primary)', marginBottom: '4px' }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>
                    {p.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Gemini API Key */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Google Gemini API Key
            </label>
            {settings.has_gemini_key && (
              <span style={{ fontSize: '0.72rem', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <ShieldCheck size={12} /> Configured in Environment
              </span>
            )}
          </div>
          <input
            type="password"
            value={settings.gemini_api_key}
            onChange={(e) => setSettings({ ...settings, gemini_api_key: e.target.value })}
            placeholder={settings.has_gemini_key ? '••••••••••••••••••••••••••••••••' : 'AIzaSy... (Paste Gemini API Key)'}
            style={{
              width: '100%',
              padding: '9px 12px',
              borderRadius: '8px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-light)',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          />
        </div>

        {/* OpenAI API Key */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              OpenAI API Key
            </label>
            {settings.has_openai_key && (
              <span style={{ fontSize: '0.72rem', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <ShieldCheck size={12} /> Configured in Environment
              </span>
            )}
          </div>
          <input
            type="password"
            value={settings.openai_api_key}
            onChange={(e) => setSettings({ ...settings, openai_api_key: e.target.value })}
            placeholder={settings.has_openai_key ? '••••••••••••••••••••••••••••••••' : 'sk-... (Paste OpenAI API Key)'}
            style={{
              width: '100%',
              padding: '9px 12px',
              borderRadius: '8px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-light)',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          />
        </div>

        {/* Confidence Threshold Slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Knowledge Base Confidence Threshold
            </label>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
              {Math.round(settings.confidence_threshold * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.2"
            max="0.9"
            step="0.05"
            value={settings.confidence_threshold}
            onChange={(e) => setSettings({ ...settings, confidence_threshold: parseFloat(e.target.value) })}
            style={{ width: '100%', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
          />
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Answers with similarity below this threshold will automatically offer human agent escalation.
          </div>
        </div>

        {/* System Persona Prompt */}
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
            AI Assistant Persona & System Instructions
          </label>
          <textarea
            rows={3}
            value={settings.system_prompt}
            onChange={(e) => setSettings({ ...settings, system_prompt: e.target.value })}
            style={{
              width: '100%',
              padding: '9px 12px',
              borderRadius: '8px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-light)',
              color: 'var(--text-primary)',
              fontSize: '0.84rem',
              outline: 'none',
              resize: 'none',
              lineHeight: 1.45
            }}
          />
        </div>

        {/* Save Button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
          {saved && (
            <span style={{ fontSize: '0.82rem', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Check size={16} /> Settings saved successfully
            </span>
          )}
          <button
            type="submit"
            disabled={loading}
            id="save-system-settings-btn"
            className="btn-primary"
            style={{
              padding: '9px 20px',
              borderRadius: '8px',
              fontSize: '0.86rem'
            }}
          >
            {loading ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </form>
    </div>
  );
}
