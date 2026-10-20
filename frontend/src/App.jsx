import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import { SessionSidebar } from './components/chat/SessionSidebar';
import { ChatWindow } from './components/chat/ChatWindow';
import { AdminLayout } from './components/admin/AdminLayout';

export function App() {
  const [view, setView] = useState('chat'); // 'chat' | 'admin'
  const [activeNav, setActiveNav] = useState('home'); // 'home' | 'chat' | 'tasks' | 'knowledge'
  const [sessionId, setSessionId] = useState(() => {
    return localStorage.getItem('nova_session_id') || `session_${Math.random().toString(36).substring(2, 9)}`;
  });
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isEscalated, setIsEscalated] = useState(false);
  const [activeTicket, setActiveTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Initialize Session
  const initSession = async (sid) => {
    try {
      setLoading(true);
      const res = await api.initSession({ sessionId: sid });
      if (res.success) {
        setSession(res.session);
        setMessages(res.messages || []);
        setIsEscalated(res.escalated || false);
        setActiveTicket(res.activeTicket || null);
        localStorage.setItem('nova_session_id', sid);
      }
    } catch (e) {
      console.error('Failed to initialize session', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initSession(sessionId);
  }, [sessionId]);

  // Periodic polling for human agent messages if session is escalated
  useEffect(() => {
    if (!isEscalated || view !== 'chat') return;

    const interval = setInterval(async () => {
      try {
        const res = await api.getHistory(sessionId);
        if (res.success) {
          if (res.messages && res.messages.length > messages.length) {
            setMessages(res.messages);
          }
          if (res.ticket) {
            setActiveTicket(res.ticket);
            if (res.ticket.status === 'resolved' && isEscalated) {
              setIsEscalated(false);
            }
          }
        }
      } catch (e) {}
    }, 4000);

    return () => clearInterval(interval);
  }, [sessionId, isEscalated, messages.length, view]);

  // Send message
  const handleSendMessage = async (text) => {
    // Switch to chat view
    setActiveNav('chat');

    // Optimistic customer message
    const tempMsg = {
      _id: `temp_${Date.now()}`,
      sessionId,
      sender: 'customer',
      text,
      createdAt: new Date().toISOString()
    };
    setMessages((prev) => [...prev, tempMsg]);
    setLoading(true);

    try {
      const res = await api.sendMessage({
        sessionId,
        text,
        customerName: session?.customerName || 'Sam'
      });

      if (res.success) {
        setMessages((prev) => [
          ...prev.filter((m) => m._id !== tempMsg._id),
          res.customerMessage,
          res.botMessage
        ]);

        if (res.escalated) {
          setIsEscalated(true);
          setActiveTicket(res.ticket);
        }
      }
    } catch (e) {
      console.error('Failed to send message', e);
    } finally {
      setLoading(false);
    }
  };

  // Rate bot message
  const handleRateMessage = async (messageId, rating) => {
    try {
      const res = await api.rateMessage(messageId, rating);
      if (res.success) {
        setMessages((prev) =>
          prev.map((m) => (m._id === messageId ? { ...m, feedback: rating } : m))
        );
      }
    } catch (e) {
      console.error('Failed to rate message', e);
    }
  };

  // Trigger Human Escalation
  const handleEscalate = async ({ customerName, customerEmail, reason, notes }) => {
    try {
      setLoading(true);
      const res = await api.escalateSession({
        sessionId,
        customerName: customerName || 'Sam',
        customerEmail,
        reason,
        notes
      });

      if (res.success) {
        setIsEscalated(true);
        setActiveTicket(res.ticket);
        if (res.systemMessage) {
          setMessages((prev) => [...prev, res.systemMessage]);
        }
      }
    } catch (e) {
      console.error('Failed to escalate session', e);
    } finally {
      setLoading(false);
    }
  };

  // Submit CSAT Satisfaction Rating
  const handleSubmitRating = async (score, note) => {
    try {
      await api.submitFeedback({
        sessionId,
        score,
        note
      });
    } catch (e) {
      console.error('Failed to submit satisfaction rating', e);
    }
  };

  // Start a fresh conversation
  const handleNewSession = () => {
    const newSid = `session_${Math.random().toString(36).substring(2, 9)}`;
    setSessionId(newSid);
    setActiveNav('chat');
  };

  // Select existing past conversation
  const handleSelectSession = (sid) => {
    setSessionId(sid);
    setActiveNav('chat');
  };

  if (view === 'admin') {
    return <AdminLayout onBackToChat={() => setView('chat')} />;
  }

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        background: 'var(--bg-primary)'
      }}
    >
      {/* Clean Minimal Sidebar (matching reference) */}
      <SessionSidebar
        currentSessionId={sessionId}
        onSelectSession={handleSelectSession}
        onNewSession={handleNewSession}
        onGoHome={() => setActiveNav('home')}
        activeNav={activeNav}
        onSelectNav={(nav) => setActiveNav(nav)}
        onOpenAdmin={() => setView('admin')}
        onEscalateClick={() => handleSendMessage('I want to speak with a human support specialist')}
        customerName={session?.customerName || 'Sam Smith'}
        isOpen={sidebarOpen}
        onToggleOpen={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Spacious Dashboard & Chat */}
      <ChatWindow
        session={session}
        messages={messages}
        isEscalated={isEscalated}
        activeTicket={activeTicket}
        loading={loading}
        onSendMessage={handleSendMessage}
        onRateMessage={handleRateMessage}
        onEscalate={handleEscalate}
        onSubmitRating={handleSubmitRating}
        onNewSession={handleNewSession}
        onOpenSidebar={() => setSidebarOpen(!sidebarOpen)}
        onOpenAdmin={() => setView('admin')}
        activeNav={activeNav}
        onSelectNav={(nav) => setActiveNav(nav)}
      />
    </div>
  );
}

export default App;
