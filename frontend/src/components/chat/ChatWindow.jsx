import React, { useEffect, useRef, useState } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { EscalationModal } from './EscalationModal';
import { FeedbackModal } from './FeedbackModal';
import { ThemeToggle } from '../common/ThemeToggle';
import {
  Menu,
  Headphones,
  LayoutDashboard,
  Star,
  Search,
  Sparkles,
  MoreHorizontal,
  ArrowLeft,
  FileText,
  Clock,
  CheckCircle2,
  Folder,
  Palette,
  FileCode,
  Calendar,
  Wand2
} from 'lucide-react';

export function ChatWindow({
  session,
  messages,
  isEscalated,
  activeTicket,
  loading,
  onSendMessage,
  onRateMessage,
  onEscalate,
  onSubmitRating,
  onNewSession,
  onOpenSidebar,
  onOpenAdmin,
  activeNav = 'home',
  onSelectNav
}) {
  const [escalateModalOpen, setEscalateModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [taskSearch, setTaskSearch] = useState('');
  const messagesEndRef = useRef(null);

  // Determine if we show the dashboard view or the conversation stream
  const showDashboard = activeNav === 'home';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!showDashboard) {
      scrollToBottom();
    }
  }, [messages, loading, showDashboard]);

  const customerName = session?.customerName || 'Sam';

  const mockTasks = [
    {
      id: 1,
      title: 'Design Meeting',
      time: '2 pm',
      action: '+ Join now',
      status: 'meeting',
      dotColor: '#f79009'
    },
    {
      id: 2,
      title: 'Refine UI components based on user feedback',
      badge: 'Urgent',
      badgeClass: 'pill-badge-urgent',
      time: 'By today',
      dotColor: '#f04438'
    },
    {
      id: 3,
      title: 'Prepare a prototype for usability testing',
      badge: 'In progress',
      badgeClass: 'pill-badge-progress',
      time: 'By tomorrow',
      dotColor: '#2563eb'
    },
    {
      id: 4,
      title: 'Collaborate with developers on implementation detail',
      badge: 'To do',
      badgeClass: 'pill-badge-todo',
      time: 'By tomorrow',
      dotColor: '#98a2b3'
    }
  ];

  const filteredTasks = mockTasks.filter((t) =>
    t.title.toLowerCase().includes(taskSearch.toLowerCase())
  );

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'var(--bg-primary)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Top Navbar Header */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 24px',
          borderBottom: '1px solid var(--border-light)',
          background: 'var(--bg-card)',
          zIndex: 10
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onOpenSidebar}
            id="mobile-sidebar-toggle-btn"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '4px'
            }}
          >
            <Menu size={18} />
          </button>

          {!showDashboard ? (
            <button
              onClick={() => onSelectNav && onSelectNav('home')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                fontSize: '0.84rem',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              <ArrowLeft size={16} />
              <span>Back to Dashboard</span>
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                stratify.com
              </span>
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '0.72rem',
                  fontWeight: 500,
                  color: isEscalated ? '#b45309' : '#15803d',
                  background: isEscalated ? '#fef3c7' : '#f0fdf4',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  border: isEscalated ? '1px solid #fde68a' : '1px solid #dcfce7'
                }}
              >
                <span className={isEscalated ? 'status-dot status-dot-orange' : 'status-dot status-dot-green'} />
                {isEscalated ? 'Live Agent Connected' : 'AI Assistant Ready'}
              </span>
            </div>
          )}
        </div>

        {/* Right Action Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {!isEscalated ? (
            <button
              onClick={() => setEscalateModalOpen(true)}
              id="top-talk-to-human-btn"
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
            >
              <Headphones size={14} style={{ color: '#2563eb' }} />
              <span>Talk to Human</span>
            </button>
          ) : (
            <span
              style={{
                fontSize: '0.75rem',
                color: '#b45309',
                background: '#fef3c7',
                padding: '4px 10px',
                borderRadius: '6px',
                fontWeight: 600
              }}
            >
              Ticket #{activeTicket?.ticketNumber || 'ACTIVE'}
            </span>
          )}

          <button
            onClick={() => setFeedbackModalOpen(true)}
            id="rate-session-btn"
            title="Rate support experience"
            className="btn-secondary"
            style={{ padding: '6px 10px', fontSize: '0.8rem' }}
          >
            <Star size={14} style={{ color: '#f59e0b' }} />
            <span>Rate</span>
          </button>

          <ThemeToggle />

          <button
            onClick={onOpenAdmin}
            id="nav-to-admin-btn"
            className="btn-primary"
            style={{ padding: '6px 14px', fontSize: '0.8rem' }}
          >
            <LayoutDashboard size={14} />
            <span>Admin</span>
          </button>
        </div>
      </header>

      {/* Main Spacious Content Canvas */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
      >
        {showDashboard ? (
          /* =========================================================
             SPACIOUS MAIN DASHBOARD (EXACT REFERENCE LAYOUT)
             ========================================================= */
          <div
            style={{
              maxWidth: '860px',
              width: '100%',
              margin: '0 auto',
              padding: '36px 24px 20px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}
          >
            {/* Top Greeting Header (matches reference) */}
            <div>
              <h1
                style={{
                  fontSize: '2.1rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '4px'
                }}
              >
                <span className="welcome-highlight">Welcome, {customerName}!</span>
                <span>👋</span>
              </h1>
              <p
                style={{
                  fontSize: '1.75rem',
                  fontWeight: 500,
                  color: 'var(--text-muted)',
                  letterSpacing: '-0.02em'
                }}
              >
                How can I help you today?
              </p>
            </div>

            {/* Top Cards Grid (matches reference) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
                gap: '16px'
              }}
            >
              {/* Card 1: Previously viewed files / Knowledge Base (Yellow Note style from reference) */}
              <div
                style={{
                  background: 'var(--bg-yellow-card)',
                  border: '1px solid var(--border-yellow-card)',
                  borderRadius: '16px',
                  padding: '18px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  boxShadow: 'var(--shadow-xs)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', fontWeight: 600, color: '#713f12' }}>
                    <Folder size={17} style={{ color: '#ca8a04' }} />
                    <span>Previously viewed files</span>
                  </div>
                  <button style={{ background: 'none', border: 'none', color: '#a16207', cursor: 'pointer' }}>
                    <MoreHorizontal size={16} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div
                    onClick={() => onSendMessage('What are your product analytics and statistics?')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      color: '#713f12',
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{ fontSize: '1rem' }}>📄</span>
                    <span>Miro - Product Analytics and Statistics</span>
                  </div>

                  <div
                    onClick={() => onSendMessage('What is your return and exchange policy?')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      color: '#713f12',
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{ fontSize: '1rem' }}>🎨</span>
                    <span>Figma - UX Research</span>
                  </div>

                  <div
                    onClick={() => onSendMessage('How long does standard and expedited shipping take?')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      color: '#713f12',
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{ fontSize: '1rem' }}>📕</span>
                    <span>R2 Strategic Goals & Objectives.pdf</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Summarize your last meeting / Support Status (matches reference) */}
              <div
                className="clean-card"
                style={{
                  padding: '18px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <Sparkles size={14} style={{ color: '#2563eb' }} />
                  <span>Summarize your last meeting</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
                    alt="Meeting Lead"
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '10px',
                      objectFit: 'cover'
                    }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.96rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        UX Strategy Meet up
                      </span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      1 Apr 2025, 14:00 pm
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => onSendMessage('Summarize the UX Strategy Meet up and next steps.')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#2563eb',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Generate Summary →
                  </button>
                </div>
              </div>
            </div>

            {/* Middle Row: Two Suggested Task Cards (matches reference) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
                gap: '16px'
              }}
            >
              <div
                className="clean-card"
                onClick={() => onSendMessage('How do I track my order status?')}
                style={{
                  padding: '16px 20px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <Sparkles size={13} style={{ color: '#2563eb' }} />
                  <span>Suggested Task</span>
                </div>
                <div style={{ fontSize: '0.96rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Conduct UX Research
                </div>
              </div>

              <div
                className="clean-card"
                onClick={() => onSendMessage('What payment methods do you accept?')}
                style={{
                  padding: '16px 20px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <Sparkles size={13} style={{ color: '#2563eb' }} />
                  <span>Suggested Task</span>
                </div>
                <div style={{ fontSize: '0.96rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Write a prospect email
                </div>
              </div>
            </div>

            {/* Bottom Large Card: My Tasks 13 (matches reference) */}
            <div
              className="clean-card"
              style={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}
            >
              {/* Task Header Bar */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={18} style={{ color: 'var(--text-secondary)' }} />
                  <span style={{ fontSize: '0.98rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    My Tasks
                  </span>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      background: 'var(--tag-bg)',
                      padding: '1px 8px',
                      borderRadius: '999px',
                      fontWeight: 600
                    }}
                  >
                    13
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {/* Search Input in header */}
                  <div style={{ position: 'relative' }}>
                    <Search
                      size={13}
                      style={{ position: 'absolute', left: '10px', top: '9px', color: 'var(--text-light)' }}
                    />
                    <input
                      type="text"
                      value={taskSearch}
                      onChange={(e) => setTaskSearch(e.target.value)}
                      placeholder="Search for name..."
                      style={{
                        padding: '6px 12px 6px 28px',
                        borderRadius: '999px',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-light)',
                        color: 'var(--text-primary)',
                        fontSize: '0.78rem',
                        outline: 'none',
                        width: '180px'
                      }}
                    />
                  </div>

                  {/* Prioritize Tasks Button with wand icon */}
                  <button
                    onClick={() => onSendMessage('Please prioritize my pending customer support tasks.')}
                    className="btn-secondary"
                    style={{
                      borderRadius: '999px',
                      padding: '6px 14px',
                      fontSize: '0.78rem',
                      borderColor: '#d0d5dd'
                    }}
                  >
                    <Wand2 size={13} style={{ color: '#7c3aed' }} />
                    <span style={{ color: '#6941c6', fontWeight: 600 }}>Prioritize Tasks</span>
                  </button>
                </div>
              </div>

              {/* Task Rows List (matches reference) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => onSendMessage(`What is the status of task: "${task.title}"?`)}
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-subtle)',
                      background: 'var(--bg-card-hover)',
                      cursor: 'pointer',
                      gap: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: task.dotColor,
                          display: 'inline-block'
                        }}
                      />
                      <span style={{ fontSize: '0.84rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                        {task.title}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {task.badge && (
                        <span className={`pill-badge ${task.badgeClass}`}>
                          ● {task.badge}
                        </span>
                      )}

                      {task.time && (
                        <span className="pill-badge pill-badge-time">
                          <Clock size={11} /> {task.time}
                        </span>
                      )}

                      {task.action && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSendMessage('Join Design Meeting now');
                          }}
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            padding: '3px 10px',
                            borderRadius: '999px',
                            background: '#eff8ff',
                            color: '#175cd3',
                            border: '1px solid #d1e9ff',
                            cursor: 'pointer'
                          }}
                        >
                          {task.action}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* =========================================================
             CLEAN CONVERSATION STREAM (MINIMAL SAAS DESIGN)
             ========================================================= */
          <div
            style={{
              maxWidth: '820px',
              width: '100%',
              margin: '0 auto',
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              flex: 1
            }}
          >
            {messages.map((msg, idx) => (
              <ChatMessage
                key={msg._id || idx}
                message={msg}
                onRate={onRateMessage}
                onEscalateClick={() => setEscalateModalOpen(true)}
              />
            ))}

            {/* Typing Indicator */}
            {loading && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  margin: '12px 0',
                  padding: '12px 16px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-light)',
                  borderRadius: '12px',
                  width: 'fit-content'
                }}
              >
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  AI is searching verified documentation...
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Floating Bottom Input Bar (Exact Reference Styling) */}
      <ChatInput
        onSendMessage={(text) => {
          onSendMessage(text);
          if (onSelectNav) onSelectNav('chat');
        }}
        onEscalateClick={() => setEscalateModalOpen(true)}
        disabled={loading}
        isEscalated={isEscalated}
      />

      {/* Escalation Modal */}
      <EscalationModal
        isOpen={escalateModalOpen}
        onClose={() => setEscalateModalOpen(false)}
        onConfirm={onEscalate}
        initialName={session?.customerName}
        initialEmail={session?.customerEmail}
      />

      {/* CSAT Rating Modal */}
      <FeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        onSubmitRating={onSubmitRating}
      />
    </div>
  );
}
