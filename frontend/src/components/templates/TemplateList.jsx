import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
<<<<<<< HEAD
import { useNavigate } from 'react-router-dom';
=======
>>>>>>> fd936892dfefaa27be028f9cc03c24a107783add
import { getPublicTemplates, reset } from '../../store/slices/templateSlice';
import TemplateCard from './TemplateCard';
import EmptyState from '../common/EmptyState';

const TemplateList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { templates, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.templates
  );
  const { user } = useSelector((state) => state.auth);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    dispatch(reset());
    dispatch(getPublicTemplates());
  }, [dispatch]);

  const categories = ['All', ...new Set(
    (templates || [])
      .map((t) => t.category?.name || t.category)
      .filter(Boolean)
  )];

  const filteredTemplates = (templates || []).filter((template) => {
    const matchesSearch =
      !searchQuery.trim() ||
      template.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const categoryName = template.category?.name || template.category;
    const matchesCategory =
      selectedCategory === 'All' || categoryName === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="loading">
        <span className="spinner" style={{ width: '28px', height: '28px', borderWidth: '3px' }} />
        <span>Loading Template Library...</span>
      </div>
    );
  }

  if (isError) {
    return <div className="error">{message}</div>;
  }

  return (
    <div className="template-list-container">
      <div className="template-list-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2>Prompt Template Library</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Explore community and shared prompt templates ready for use and optimization.
            </p>
          </div>
          {user && (
            <button
              className="btn-primary"
              onClick={() => navigate('/templates/new')}
            >
              + Create Template
            </button>
          )}
        </div>
      </div>

      {isSuccess && message && (
        <div className="alert-success">{message}</div>
      )}

      <div className="search-filter-bar">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search templates by keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {categories.length > 1 && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className="category-tag"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  cursor: 'pointer',
                  opacity: selectedCategory === cat ? 1 : 0.6,
                  background:
                    selectedCategory === cat
                      ? 'rgba(99, 102, 241, 0.25)'
                      : 'var(--bg-card)',
                  borderColor:
                    selectedCategory === cat
                      ? 'var(--accent-primary)'
                      : 'var(--border-subtle)',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {filteredTemplates && filteredTemplates.length > 0 ? (
        <div className="template-grid">
          {filteredTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      ) : (
        <EmptyState
          message={
            searchQuery || selectedCategory !== 'All'
              ? 'No templates found matching your filters.'
              : 'No templates available in the library yet.'
          }
          actionText={user ? '+ Create a Template' : 'Sign In to Contribute'}
          onAction={() => (user ? navigate('/templates/new') : navigate('/login'))}
        />
      )}
    </div>
  );
};

export default TemplateList;