import React from 'react';
import {
  MessageSquare,
  ShieldAlert,
  CheckCircle,
  TrendingUp,
  Star,
  Users,
  Layers,
  ArrowUpRight
} from 'lucide-react';

export function DashboardOverview({ analytics, onSelectTab, onInspectTicket }) {
  const { overview = {}, categoryStats = [], recentTickets = [] } = analytics || {};

  const statCards = [
    {
      title: 'Total Conversations',
      value: overview.totalConversations || 142,
      icon: Users,
      trend: '+14% this week',
      color: '#2563eb',
      bg: '#eff6ff'
    },
    {
      title: 'AI Resolution Rate',
      value: `${overview.automatedResolutionRate || 88}%`,
      icon: TrendingUp,
      trend: 'Automated deflection',
      color: '#16a34a',
      bg: '#f0fdf4'
    },
    {
      title: 'Open Escalations',
      value: overview.openTickets || 2,
      icon: ShieldAlert,
      trend: 'Requires human agent',
      color: '#d97706',
      bg: '#fef3c7'
    },
    {
      title: 'Customer CSAT',
      value: `${overview.csatAvg || 4.8} / 5.0`,
      icon: Star,
      trend: 'Satisfaction score',
      color: '#f59e0b',
      bg: '#fffbeb'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Metric Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px'
        }}
      >
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="clean-card"
              style={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  {card.title}
                </span>
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    background: card.bg,
                    color: card.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Icon size={16} />
                </div>
              </div>

              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {card.value}
              </div>

              <div style={{ fontSize: '0.74rem', color: card.color, fontWeight: 500 }}>
                {card.trend}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Category Distribution & Recent Escalation Tickets */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '20px'
        }}
      >
        {/* Knowledge Base Distribution */}
        <div
          className="clean-card"
          style={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={16} style={{ color: '#2563eb' }} />
              Knowledge Base Coverage
            </h3>
            <button
              onClick={() => onSelectTab('faqs')}
              style={{
                background: 'none',
                border: 'none',
                color: '#2563eb',
                fontSize: '0.78rem',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}
            >
              Manage FAQs <ArrowUpRight size={13} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {categoryStats.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem' }}>No category stats available.</p>
            ) : (
              categoryStats.map((cat, i) => {
                const max = Math.max(...categoryStats.map((c) => c.count), 1);
                const pct = Math.round((cat.count / max) * 100);
                return (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{cat.category}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{cat.count} articles</span>
                    </div>
                    <div style={{ height: '6px', background: 'var(--tag-bg)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${pct}%`,
                          background: '#2563eb',
                          borderRadius: '999px'
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Live Escalation Queue Preview */}
        <div
          className="clean-card"
          style={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={16} style={{ color: '#d97706' }} />
              Recent Support Tickets
            </h3>
            <button
              onClick={() => onSelectTab('tickets')}
              style={{
                background: 'none',
                border: 'none',
                color: '#2563eb',
                fontSize: '0.78rem',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}
            >
              View Queue <ArrowUpRight size={13} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {recentTickets.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem' }}>No recent escalation tickets.</p>
            ) : (
              recentTickets.map((t) => (
                <div
                  key={t._id}
                  onClick={() => onInspectTicket(t)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'border-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#d0d5dd')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-light)')}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#2563eb' }}>
                        {t.ticketNumber}
                      </span>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          background:
                            t.priority === 'urgent'
                              ? '#fef2f2'
                              : t.priority === 'high'
                              ? '#fffbeb'
                              : '#eff8ff',
                          color:
                            t.priority === 'urgent'
                              ? '#b42318'
                              : t.priority === 'high'
                              ? '#b45309'
                              : '#175cd3',
                          border: '1px solid ' + (t.priority === 'urgent' ? '#fee4e2' : t.priority === 'high' ? '#fde68a' : '#d1e9ff'),
                          padding: '1px 6px',
                          borderRadius: '4px',
                          fontWeight: 500
                        }}
                      >
                        {t.priority?.toUpperCase()}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {t.customerName} • {t.subject?.substring(0, 32)}...
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: '0.72rem',
                      color: t.status === 'resolved' ? '#16a34a' : '#d97706',
                      fontWeight: 600,
                      textTransform: 'capitalize'
                    }}
                  >
                    {t.status.replace('_', ' ')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
