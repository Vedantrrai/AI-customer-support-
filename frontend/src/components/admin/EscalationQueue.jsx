import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import {
  ShieldAlert,
  Search,
  Filter,
  CheckCircle,
  UserCheck,
  Send,
  X,
  MessageSquare,
  AlertCircle,
  Clock
} from 'lucide-react';
import { formatMarkdown } from '../../utils/formatMarkdown';

export function EscalationQueue({ selectedTicketId, onClearSelectedTicket }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Active Ticket Drawer
  const [activeTicket, setActiveTicket] = useState(null);
  const [ticketDetails, setTicketDetails] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [agentName, setAgentName] = useState('Agent Sarah');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await api.getTickets({
        status: statusFilter,
        search
      });
      if (res.success) {
        setTickets(res.tickets || []);
      }
    } catch (e) {
      console.error('Failed to fetch tickets', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [statusFilter, search]);

  const openTicketDrawer = async (ticket) => {
    setActiveTicket(ticket);
    try {
      const res = await api.getTicketById(ticket._id);
      if (res.success) {
        setTicketDetails(res);
      }
    } catch (e) {
      console.error('Failed to load ticket details', e);
    }
  };

  useEffect(() => {
    if (selectedTicketId && tickets.length > 0) {
      const match = tickets.find((t) => t._id === selectedTicketId);
      if (match) openTicketDrawer(match);
    }
  }, [selectedTicketId, tickets]);

  const handleAssignToMe = async () => {
    if (!activeTicket) return;
    try {
      const res = await api.assignTicket(activeTicket._id, agentName);
      if (res.success) {
        setActiveTicket(res.ticket);
        fetchTickets();
      }
    } catch (e) {
      console.error('Failed to assign ticket', e);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTicket) return;

    try {
      setSubmittingReply(true);
      const res = await api.replyToTicket(activeTicket._id, {
        text: replyText.trim(),
        agentName
      });
      if (res.success) {
        setReplyText('');
        // Refresh details
        const updated = await api.getTicketById(activeTicket._id);
        if (updated.success) setTicketDetails(updated);
        fetchTickets();
      }
    } catch (e) {
      console.error('Failed to reply', e);
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleResolveTicket = async () => {
    if (!activeTicket) return;
    try {
      const res = await api.resolveTicket(activeTicket._id, {
        resolutionNotes: resolutionNotes || 'Resolved by human support agent.'
      });
      if (res.success) {
        setActiveTicket(res.ticket);
        const updated = await api.getTicketById(activeTicket._id);
        if (updated.success) setTicketDetails(updated);
        fetchTickets();
      }
    } catch (e) {
      console.error('Failed to resolve', e);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Header and Controls */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>
            Human Escalation Live Queue
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Tickets requiring human agent intervention, replies, and resolution.
          </p>
        </div>

        {/* Filter controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tickets, customers..."
              style={{
                padding: '8px 12px 8px 30px',
                borderRadius: '8px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-light)',
                color: 'var(--text-primary)',
                fontSize: '0.82rem',
                outline: 'none',
                width: '210px'
              }}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-light)',
              color: 'var(--text-primary)',
              fontSize: '0.82rem',
              outline: 'none'
            }}
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Tickets Table */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-light)',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Ticket #</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Customer</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Subject</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Priority</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Assigned Agent</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Loading escalation queue...
                </td>
              </tr>
            ) : tickets.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No escalation tickets found matching your filter.
                </td>
              </tr>
            ) : (
              tickets.map((t) => (
                <tr
                  key={t._id}
                  style={{
                    borderBottom: '1px solid var(--border-light)',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-card-hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--accent-primary)' }}>
                    {t.ticketNumber}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{t.customerName}</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{t.customerEmail || 'No email provided'}</div>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)', maxWidth: '240px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {t.subject}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background:
                          t.priority === 'urgent'
                            ? 'rgba(239, 68, 68, 0.15)'
                            : t.priority === 'high'
                            ? 'rgba(245, 158, 11, 0.15)'
                            : 'rgba(99, 102, 241, 0.15)',
                        color:
                          t.priority === 'urgent'
                            ? '#ef4444'
                            : t.priority === 'high'
                            ? '#f59e0b'
                            : '#6366f1'
                      }}
                    >
                      {t.priority?.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background:
                          t.status === 'resolved'
                            ? 'rgba(34, 197, 94, 0.15)'
                            : t.status === 'in_progress'
                            ? 'rgba(56, 189, 248, 0.15)'
                            : 'rgba(245, 158, 11, 0.15)',
                        color:
                          t.status === 'resolved'
                            ? '#22c55e'
                            : t.status === 'in_progress'
                            ? '#38bdf8'
                            : '#f59e0b'
                      }}
                    >
                      {t.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>
                    {t.assignedAgent || 'Unassigned'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <button
                      onClick={() => openTicketDrawer(t)}
                      id={`inspect-ticket-${t.ticketNumber}`}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-light)',
                        color: 'var(--text-primary)',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Inspect & Reply
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Ticket Details Inspector Drawer / Modal */}
      {activeTicket && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 60,
            display: 'flex',
            justifyContent: 'flex-end',
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)'
          }}
        >
          <div
            className="animate-fade-in"
            style={{
              width: '100%',
              maxWidth: '560px',
              height: '100%',
              background: 'var(--bg-secondary)',
              borderLeft: '1px solid var(--border-light)',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            {/* Drawer Header */}
            <div
              style={{
                padding: '18px 20px',
                borderBottom: '1px solid var(--border-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'var(--bg-glass)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                    {activeTicket.ticketNumber}
                  </h3>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: 'rgba(245, 158, 11, 0.15)',
                      color: '#f59e0b',
                      fontWeight: 600
                    }}
                  >
                    {activeTicket.status.toUpperCase()}
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Customer: <strong>{activeTicket.customerName}</strong> ({activeTicket.customerEmail || 'No email'})
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveTicket(null);
                  if (onClearSelectedTicket) onClearSelectedTicket();
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Agent Assignment Bar */}
            <div
              style={{
                padding: '10px 20px',
                background: 'var(--bg-card)',
                borderBottom: '1px solid var(--border-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Assigned Agent:</span>
                <strong style={{ color: 'var(--text-primary)' }}>{activeTicket.assignedAgent || 'Unassigned'}</strong>
              </div>

              {activeTicket.assignedAgent === 'Unassigned' && (
                <button
                  onClick={handleAssignToMe}
                  id="claim-ticket-btn"
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    background: 'var(--accent-primary)',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Claim Ticket
                </button>
              )}
            </div>

            {/* Conversation Transcript Stream */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Live Chat Transcript
              </div>

              {!ticketDetails ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>
                  Loading chat transcript...
                </div>
              ) : ticketDetails.messages?.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>
                  No messages recorded in this session.
                </div>
              ) : (
                ticketDetails.messages.map((m, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background:
                        m.sender === 'customer'
                          ? 'var(--bg-card)'
                          : m.sender === 'agent'
                          ? 'rgba(2, 132, 199, 0.15)'
                          : 'rgba(99, 102, 241, 0.1)',
                      border: '1px solid var(--border-light)',
                      fontSize: '0.84rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.72rem' }}>
                      <strong
                        style={{
                          color:
                            m.sender === 'customer'
                              ? 'var(--text-primary)'
                              : m.sender === 'agent'
                              ? '#38bdf8'
                              : 'var(--accent-primary)'
                        }}
                      >
                        {m.sender === 'customer'
                          ? activeTicket.customerName
                          : m.sender === 'agent'
                          ? '👨‍💼 Human Agent'
                          : '🤖 Nova AI'}
                      </strong>
                      <span style={{ color: 'var(--text-muted)' }}>
                        {m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                    <div>{formatMarkdown(m.text)}</div>
                  </div>
                ))
              )}
            </div>

            {/* Agent Reply Box */}
            <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border-light)', background: 'var(--bg-glass)' }}>
              <form onSubmit={handleSendReply} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type message directly to the customer as live agent..."
                  rows={2}
                  id="admin-agent-reply-input"
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

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {activeTicket.status !== 'resolved' ? (
                    <button
                      type="button"
                      onClick={handleResolveTicket}
                      id="resolve-ticket-btn"
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        background: 'rgba(34, 197, 94, 0.15)',
                        border: '1px solid #22c55e',
                        color: '#22c55e',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <CheckCircle size={14} />
                      Mark Resolved
                    </button>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: '#22c55e', fontWeight: 600 }}>
                      ✓ Ticket Marked Resolved
                    </span>
                  )}

                  <button
                    type="submit"
                    disabled={!replyText.trim() || submittingReply}
                    id="submit-agent-reply-btn"
                    className="btn-primary"
                    style={{
                      padding: '7px 16px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      opacity: !replyText.trim() ? 0.5 : 1
                    }}
                  >
                    <Send size={14} />
                    <span>Send to Customer</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
