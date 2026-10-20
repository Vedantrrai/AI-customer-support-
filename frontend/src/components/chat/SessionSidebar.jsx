import React, { useEffect, useState } from 'react';
import {
  Home,
  Plus,
  MessageSquare,
  CheckSquare,
  BookOpen,
  LayoutDashboard,
  ChevronsLeft,
  ChevronsRight,
  Settings,
  MoreHorizontal,
  Headphones,
  Search,
  Sparkles
} from 'lucide-react';
import { api } from '../../services/api';

export function SessionSidebar({
  currentSessionId,
  onSelectSession,
  onNewSession,
  onGoHome,
  activeNav = 'home',
  onSelectNav,
  onOpenAdmin,
  onEscalateClick,
  customerName = 'Sam Smith',
  isOpen,
  onToggleOpen
}) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const res = await api.listSessions();
      if (res.success) {
        setSessions(res.sessions || []);
      }
    } catch (e) {
      console.error('Failed to load sessions', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, [currentSessionId]);

  // Group sessions into Today and Yesterday
  const todaySessions = sessions.slice(0, 3);
  const yesterdaySessions = sessions.slice(3, 7);

  if (!isOpen) {
    return (
      <div
        style={{
          width: '56px',
          background: 'var(--bg-sidebar)',
          borderRight: '1px solid var(--border-light)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '16px 0',
          gap: '16px',
          height: '100%'
        }}
      >
        <button
          onClick={onToggleOpen}
          title="Expand Sidebar"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-muted)'
          }}
        >
          <ChevronsRight size={18} />
        </button>
        <button
          onClick={onGoHome}
          title="Home"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: activeNav === 'home' ? 'var(--bg-secondary)' : 'transparent',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: activeNav === 'home' ? 'var(--text-primary)' : 'var(--text-muted)'
          }}
        >
          <Home size={18} />
        </button>
        <button
          onClick={onNewSession}
          title="New Chat"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'transparent',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-muted)'
          }}
        >
          <Plus size={18} />
        </button>
      </div>
    );
  }

  return (
    <aside
      style={{
        width: '240px',
        background: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-light)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        flexShrink: 0,
        zIndex: 20
      }}
    >
      {/* User Profile Header (matches reference) */}
      <div
        style={{
          padding: '16px 16px 12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
            alt="Sam Smith"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              objectFit: 'cover'
            }}
          />
          <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            {customerName || 'Sam Smith'}
          </span>
        </div>

        <button
          onClick={onToggleOpen}
          title="Collapse Sidebar"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-light)',
            display: 'flex',
            alignItems: 'center',
            padding: '2px'
          }}
        >
          <ChevronsLeft size={16} />
        </button>
      </div>

      {/* Main Nav Links (matches reference) */}
      <div style={{ padding: '4px 10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <button
          onClick={onGoHome}
          id="sidebar-nav-home"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            padding: '8px 12px',
            borderRadius: '8px',
            background: activeNav === 'home' ? 'var(--bg-secondary)' : 'transparent',
            border: 'none',
            color: activeNav === 'home' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontSize: '0.85rem',
            fontWeight: activeNav === 'home' ? 600 : 500,
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Home size={16} style={{ color: activeNav === 'home' ? 'var(--text-primary)' : 'var(--text-muted)' }} />
            <span>Home</span>
          </div>
          {activeNav === 'home' && (
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--text-primary)' }} />
          )}
        </button>

        <button
          onClick={onNewSession}
          id="sidebar-nav-new-chat"
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            padding: '8px 12px',
            borderRadius: '8px',
            background: activeNav === 'new_chat' ? 'var(--bg-secondary)' : 'transparent',
            border: 'none',
            color: activeNav === 'new_chat' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontSize: '0.85rem',
            fontWeight: 500,
            cursor: 'pointer',
            gap: '10px'
          }}
        >
          <MessageSquare size={16} style={{ color: 'var(--text-muted)' }} />
          <span>New Chat</span>
        </button>

        <button
          onClick={() => onSelectNav && onSelectNav('tasks')}
          id="sidebar-nav-tasks"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            padding: '8px 12px',
            borderRadius: '8px',
            background: activeNav === 'tasks' ? 'var(--bg-secondary)' : 'transparent',
            border: 'none',
            color: activeNav === 'tasks' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontSize: '0.85rem',
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckSquare size={16} style={{ color: 'var(--text-muted)' }} />
            <span>My Tasks</span>
          </div>
          <span
            style={{
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              background: 'var(--tag-bg)',
              padding: '1px 6px',
              borderRadius: '999px',
              fontWeight: 500
            }}
          >
            13
          </span>
        </button>

        <button
          onClick={() => onSelectNav && onSelectNav('knowledge')}
          id="sidebar-nav-knowledge"
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            padding: '8px 12px',
            borderRadius: '8px',
            background: activeNav === 'knowledge' ? 'var(--bg-secondary)' : 'transparent',
            border: 'none',
            color: activeNav === 'knowledge' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontSize: '0.85rem',
            fontWeight: 500,
            cursor: 'pointer',
            gap: '10px'
          }}
        >
          <BookOpen size={16} style={{ color: 'var(--text-muted)' }} />
          <span>Knowledge Base</span>
        </button>

        <button
          onClick={onOpenAdmin}
          id="sidebar-nav-admin"
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            padding: '8px 12px',
            borderRadius: '8px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            fontSize: '0.85rem',
            fontWeight: 500,
            cursor: 'pointer',
            gap: '10px'
          }}
        >
          <LayoutDashboard size={16} style={{ color: 'var(--text-muted)' }} />
          <span>Admin Portal</span>
        </button>
      </div>

      {/* Recent History Sections: Today / Yesterday (matches reference) */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 10px 10px 10px' }}>
        {/* Today */}
        <div style={{ marginBottom: '16px' }}>
          <div
            style={{
              fontSize: '0.72rem',
              fontWeight: 600,
              color: 'var(--text-light)',
              padding: '0 12px 6px 12px'
            }}
          >
            Today
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            {todaySessions.length === 0 ? (
              <div
                onClick={() => onSelectSession && onSelectSession(currentSessionId)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                Research Assistance Request
              </div>
            ) : (
              todaySessions.map((s, idx) => (
                <div
                  key={s.sessionId || idx}
                  onClick={() => onSelectSession(s.sessionId)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    color: s.sessionId === currentSessionId && activeNav !== 'home' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    fontWeight: s.sessionId === currentSessionId && activeNav !== 'home' ? 600 : 400,
                    background: s.sessionId === currentSessionId && activeNav !== 'home' ? 'var(--bg-secondary)' : 'transparent',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                  title={s.lastMessage || 'Customer Support Inquiry'}
                >
                  {s.lastMessage?.substring(0, 28) || 'Order Tracking & Support'}
                </div>
              ))
            )}
            <div
              onClick={() => onSelectNav && onSelectNav('tasks')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              Summarizing Last Meeting
            </div>
            <div
              onClick={() => onSelectNav && onSelectNav('tasks')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              Prioritizing Tasks Request
            </div>
          </div>
        </div>

        {/* Yesterday */}
        <div>
          <div
            style={{
              fontSize: '0.72rem',
              fontWeight: 600,
              color: 'var(--text-light)',
              padding: '0 12px 6px 12px'
            }}
          >
            Yesterday
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            <div
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              Document Summary Request
            </div>
            {yesterdaySessions.map((s, idx) => (
              <div
                key={s.sessionId || idx}
                onClick={() => onSelectSession(s.sessionId)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {s.lastMessage?.substring(0, 26) || 'Return policy inquiry'}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Promo / Status Card (matches reference bottom left card) */}
      <div style={{ padding: '12px 14px' }}>
        <div
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-light)',
            borderRadius: '12px',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: '#2563eb',
                display: 'inline-block'
              }}
            />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              AI Support Active
            </span>
          </div>

          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>
            24/7 Knowledge Base retrieval & instant human agent handoff.
          </p>

          <button
            onClick={onEscalateClick}
            id="sidebar-upgrade-agent-btn"
            style={{
              width: '100%',
              padding: '6px 12px',
              borderRadius: '999px',
              background: '#2563eb',
              color: '#ffffff',
              border: 'none',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'background 0.15s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#1d4ed8')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#2563eb')}
          >
            <Headphones size={13} />
            <span>Live Agent</span>
          </button>
        </div>
      </div>

      {/* Settings bottom row */}
      <div
        style={{
          padding: '10px 16px 14px 16px',
          borderTop: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <button
          onClick={onOpenAdmin}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--text-secondary)',
            fontSize: '0.82rem',
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          <Settings size={15} style={{ color: 'var(--text-muted)' }} />
          <span>Settings</span>
        </button>

        <button
          onClick={onOpenAdmin}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <MoreHorizontal size={16} />
        </button>
      </div>
    </aside>
  );
}
