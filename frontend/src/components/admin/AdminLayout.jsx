import React, { useState, useEffect } from 'react';
import { DashboardOverview } from './DashboardOverview';
import { EscalationQueue } from './EscalationQueue';
import { FaqManager } from './FaqManager';
import { BotSandbox } from './BotSandbox';
import { SettingsModal } from './SettingsModal';
import { ThemeToggle } from '../common/ThemeToggle';
import { api } from '../../services/api';
import {
  LayoutDashboard,
  ShieldAlert,
  BookOpen,
  FlaskConical,
  Settings,
  ArrowLeft
} from 'lucide-react';

export function AdminLayout({ onBackToChat }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [analytics, setAnalytics] = useState(null);
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  const fetchAnalytics = async () => {
    try {
      const res = await api.getAnalytics();
      if (res.success) {
        setAnalytics(res);
      }
    } catch (e) {
      console.error('Failed to load analytics', e);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [activeTab]);

  const handleInspectTicket = (ticket) => {
    setSelectedTicketId(ticket._id);
    setActiveTab('tickets');
  };

  const navItems = [
    { id: 'overview', label: 'Analytics', icon: LayoutDashboard },
    { id: 'tickets', label: 'Escalations Queue', icon: ShieldAlert, badge: analytics?.overview?.openTickets },
    { id: 'faqs', label: 'Knowledge Base', icon: BookOpen },
    { id: 'sandbox', label: 'AI Sandbox', icon: FlaskConical },
    { id: 'settings', label: 'System Settings', icon: Settings }
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: 'var(--bg-primary)'
      }}
    >
      {/* Admin Navbar */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 24px',
          borderBottom: '1px solid var(--border-light)',
          background: 'var(--bg-card)',
          position: 'sticky',
          top: 0,
          zIndex: 30
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={onBackToChat}
            id="back-to-customer-chat-btn"
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
          >
            <ArrowLeft size={14} />
            <span>Customer View</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '8px',
                background: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.86rem'
              }}
            >
              S
            </div>
            <div>
              <h1 style={{ fontSize: '0.98rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Stratify Admin
              </h1>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Support Operations & Agent Hub
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '4px', overflowX: 'auto' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                id={`admin-nav-${item.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 12px',
                  borderRadius: '8px',
                  background: active ? 'var(--bg-secondary)' : 'transparent',
                  color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                  border: '1px solid ' + (active ? 'var(--border-light)' : 'transparent'),
                  fontSize: '0.82rem',
                  fontWeight: active ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={14} style={{ color: active ? '#2563eb' : 'var(--text-muted)' }} />
                <span>{item.label}</span>
                {item.badge > 0 && (
                  <span
                    style={{
                      fontSize: '0.68rem',
                      background: '#fef2f2',
                      color: '#b42318',
                      border: '1px solid #fee4e2',
                      padding: '1px 6px',
                      borderRadius: '999px',
                      fontWeight: 600
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '24px', maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
        {activeTab === 'overview' && (
          <DashboardOverview
            analytics={analytics}
            onSelectTab={setActiveTab}
            onInspectTicket={handleInspectTicket}
          />
        )}
        {activeTab === 'tickets' && (
          <EscalationQueue
            selectedTicketId={selectedTicketId}
            onClearSelectedTicket={() => setSelectedTicketId(null)}
          />
        )}
        {activeTab === 'faqs' && <FaqManager />}
        {activeTab === 'sandbox' && <BotSandbox />}
        {activeTab === 'settings' && <SettingsModal />}
      </main>
    </div>
  );
}
