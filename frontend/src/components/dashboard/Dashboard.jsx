import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getPublicTemplates } from '../../store/slices/templateSlice';
import { getMyTemplates } from '../../store/slices/templateSlice';
import { getMyCollections } from '../../store/slices/collectionSlice';
import StatCards from './StatCards';
import TemplateCard from '../templates/TemplateCard';
import EmptyState from '../common/EmptyState';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { templates, myTemplates, isLoading } = useSelector(
    (state) => state.templates
  );

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(getPublicTemplates());
    if (user) {
      dispatch(getMyTemplates());
      dispatch(getMyCollections());
    }
  }, [dispatch, user]);

  const filterTemplates = (list) => {
    if (!list) return [];
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (t) =>
        t.title?.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        t.category?.name?.toLowerCase().includes(q) ||
        (typeof t.category === 'string' && t.category.toLowerCase().includes(q))
    );
  };

  const filteredMyTemplates = filterTemplates(myTemplates);
  const filteredTemplates = filterTemplates(templates);

  if (isLoading) {
    return (
      <div className="loading">
        <span className="spinner" style={{ width: '28px', height: '28px', borderWidth: '3px' }} />
        <span>Loading PromptPort Studio...</span>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="hero-section">
        <div className="hero-badge">
          <span>⚡</span> AI Prompt Engineering Workspace
        </div>
        <h1 className="hero-title">
          Build, optimize, and orchestrate <span className="gradient-text">AI Prompts</span>
        </h1>
        <p className="hero-subtitle">
          Collaborate on production-grade prompt templates, version control every iteration, and leverage Gemini AI to optimize prompt efficacy.
        </p>
        <div className="hero-actions">
          {user ? (
            <button
              className="btn-primary"
              onClick={() => navigate('/templates/new')}
            >
              <span>+</span> Create New Template
            </button>
          ) : (
            <button
              className="btn-primary"
              onClick={() => navigate('/register')}
            >
              Get Started Free <span>→</span>
            </button>
          )}
          <button
            className="btn-secondary"
            onClick={() => navigate('/library')}
          >
            Explore Library
          </button>
        </div>
      </div>

      <StatCards />

      <div className="search-filter-bar">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search prompt templates by title, description, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {user && (
        <section className="my-templates-section">
          <div className="section-header-row">
            <h2>
              <span>My Templates</span>
              <span className="section-badge">{filteredMyTemplates.length}</span>
            </h2>
            <button
              className="btn-secondary"
              onClick={() => navigate('/templates/new')}
              style={{ fontSize: '0.8rem', padding: '6px 14px' }}
            >
              + Add Template
            </button>
          </div>

          {filteredMyTemplates && filteredMyTemplates.length > 0 ? (
            <div className="template-grid">
              {filteredMyTemplates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          ) : (
            <EmptyState
              message={
                searchQuery
                  ? 'No matching personal templates found.'
                  : "You haven't created any prompt templates yet."
              }
              actionText={searchQuery ? '' : '+ Create Your First Template'}
              onAction={() => navigate('/templates/new')}
            />
          )}
        </section>
      )}

      <section className="recent-templates-section">
        <div className="section-header-row">
          <h2>
            <span>Recently Published Templates</span>
            <span className="section-badge">{filteredTemplates.length}</span>
          </h2>
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
              searchQuery
                ? 'No matching templates found in the library.'
                : 'No public templates found yet.'
            }
          />
        )}
      </section>
    </div>
  );
};

export default Dashboard;