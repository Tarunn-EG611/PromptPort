import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getPublicTemplates } from '../../store/slices/templateSlice';
import { getMyTemplates } from '../../store/slices/templateSlice';
import { getMyCollections } from '../../store/slices/collectionSlice';
import StatCards from './StatCards';
import TemplateCard from '../templates/TemplateCard';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { templates, myTemplates, isLoading } = useSelector(
    (state) => state.templates
  );

  useEffect(() => {
    dispatch(getPublicTemplates());
    if (user) {
      dispatch(getMyTemplates());
      dispatch(getMyCollections());
    }
  }, [dispatch, user]);

  if (isLoading) {
    return <div className="loading">Loading Dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      <h1>Welcome to PromptPort</h1>

      {user && (
        <button
          className="btn-primary"
          onClick={() => navigate('/templates/new')}
        >
          + Create New Template
        </button>
      )}

      <StatCards />

      {user && (
        <section className="my-templates-section">
          <h2>My Templates</h2>
          {myTemplates && myTemplates.length > 0 ? (
            <div className="template-grid">
              {myTemplates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          ) : (
            <p>You haven't created any templates yet.</p>
          )}
        </section>
      )}

      <section className="recent-templates-section">
        <h2>Recently Published Templates</h2>
        {templates && templates.length > 0 ? (
          <div className="template-grid">
            {templates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        ) : (
          <p>No templates found.</p>
        )}
      </section>
    </div>
  );
};

export default Dashboard;