import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ThumbsUp,
  ThumbsDown,
  X,
  BookOpen,
  Check,
  Tag
} from 'lucide-react';

const CATEGORIES = ['All', 'General', 'Orders', 'Shipping', 'Returns', 'Billing', 'Account', 'Technical'];

export function FaqManager() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'General',
    tags: '',
    keywords: ''
  });

  const loadFaqs = async () => {
    try {
      setLoading(true);
      const res = await api.getFaqs({
        category: selectedCategory,
        search
      });
      if (res.success) {
        setFaqs(res.faqs || []);
      }
    } catch (e) {
      console.error('Failed to load FAQs', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFaqs();
  }, [selectedCategory, search]);

  const openCreateModal = () => {
    setEditingFaq(null);
    setFormData({
      question: '',
      answer: '',
      category: 'General',
      tags: '',
      keywords: ''
    });
    setModalOpen(true);
  };

  const openEditModal = (faq) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category || 'General',
      tags: (faq.tags || []).join(', '),
      keywords: (faq.keywords || []).join(', ')
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this FAQ knowledge article?')) return;
    try {
      const res = await api.deleteFaq(id);
      if (res.success) loadFaqs();
    } catch (e) {
      console.error('Failed to delete FAQ', e);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFaq) {
        await api.updateFaq(editingFaq._id, formData);
      } else {
        await api.createFaq(formData);
      }
      setModalOpen(false);
      loadFaqs();
    } catch (e) {
      console.error('Failed to save FAQ', e);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header & New FAQ Button */}
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
            Knowledge Base & FAQ Management
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Add, update, and fine-tune support knowledge used by the AI retrieval agent.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          id="add-new-faq-btn"
          className="btn-primary"
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.84rem'
          }}
        >
          <Plus size={15} />
          <span>Add Knowledge Article</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}
      >
        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                background: selectedCategory === cat ? 'var(--accent-primary)' : 'var(--bg-card)',
                color: selectedCategory === cat ? '#ffffff' : 'var(--text-secondary)',
                border: '1px solid ' + (selectedCategory === cat ? 'var(--accent-primary)' : 'var(--border-light)'),
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search FAQs, keywords..."
            style={{
              padding: '8px 12px 8px 30px',
              borderRadius: '8px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-light)',
              color: 'var(--text-primary)',
              fontSize: '0.82rem',
              outline: 'none',
              width: '240px'
            }}
          />
        </div>
      </div>

      {/* FAQs Grid / Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '16px'
        }}
      >
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', gridColumn: '1 / -1' }}>
            Loading FAQs...
          </div>
        ) : faqs.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', gridColumn: '1 / -1' }}>
            No knowledge base articles found.
          </div>
        ) : (
          faqs.map((faq) => (
            <div
              key={faq._id}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-light)',
                borderRadius: '16px',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      background: 'var(--tag-bg)',
                      color: 'var(--accent-primary)',
                      padding: '2px 8px',
                      borderRadius: '6px'
                    }}
                  >
                    {faq.category}
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <ThumbsUp size={12} style={{ color: '#22c55e' }} /> {faq.helpfulCount || 0}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <ThumbsDown size={12} style={{ color: '#ef4444' }} /> {faq.unhelpfulCount || 0}
                    </span>
                  </div>
                </div>

                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px', lineHeight: 1.4 }}>
                  {faq.question}
                </h4>

                <p
                  style={{
                    fontSize: '0.82rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                    marginBottom: '12px',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {faq.answer}
                </p>

                {/* Keywords preview */}
                {faq.keywords && faq.keywords.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '14px' }}>
                    {faq.keywords.slice(0, 4).map((kw, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '0.68rem',
                          background: 'var(--bg-secondary)',
                          color: 'var(--text-muted)',
                          padding: '1px 6px',
                          borderRadius: '4px'
                        }}
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Bottom Actions */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '8px',
                  borderTop: '1px solid var(--border-light)',
                  paddingTop: '10px'
                }}
              >
                <button
                  onClick={() => openEditModal(faq)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '5px 10px',
                    borderRadius: '6px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-light)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  <Edit2 size={12} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(faq._id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '5px 10px',
                    borderRadius: '6px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    color: '#ef4444',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit FAQ Modal */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 70,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(8px)',
            padding: '16px'
          }}
        >
          <div
            className="animate-fade-in"
            style={{
              width: '100%',
              maxWidth: '520px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-light)',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)' }}>
                {editingFaq ? 'Edit Knowledge Article' : 'Create Knowledge Article'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Question / Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="e.g. How do I request an exchange?"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-light)',
                    color: 'var(--text-primary)',
                    fontSize: '0.86rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-light)',
                    color: 'var(--text-primary)',
                    fontSize: '0.86rem',
                    outline: 'none'
                  }}
                >
                  <option value="General">General</option>
                  <option value="Orders">Orders</option>
                  <option value="Shipping">Shipping</option>
                  <option value="Returns">Returns</option>
                  <option value="Billing">Billing</option>
                  <option value="Account">Account</option>
                  <option value="Technical">Technical</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Verified Answer (supports Markdown formatting)
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  placeholder="Write the clear, step-by-step verified response..."
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-light)',
                    color: 'var(--text-primary)',
                    fontSize: '0.86rem',
                    outline: 'none',
                    resize: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Keywords (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  placeholder="e.g. exchange, return item, replacement, swap"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-light)',
                    color: 'var(--text-primary)',
                    fontSize: '0.86rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '10px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-light)',
                    color: 'var(--text-secondary)',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="save-faq-submit-btn"
                  className="btn-primary"
                  style={{
                    flex: 2,
                    padding: '9px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Check size={16} />
                  <span>{editingFaq ? 'Save Changes' : 'Create Article'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
