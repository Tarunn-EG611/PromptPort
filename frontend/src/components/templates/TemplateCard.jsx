import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { deleteTemplate, forkTemplate } from '../../store/slices/templateSlice';

const TemplateCard = ({ template }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const isCreator =
    user &&
    template.creator &&
    (user.id === template.creator.id ||
      user.username === template.creator.username);

  const canFork = user && !isCreator;

  const onDelete = () => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      dispatch(deleteTemplate(template.id))
        .unwrap()
        .then(() => {
          alert('Template deleted successfully');
        })
        .catch(() => {});
    }
  };

  const onFork = () => {
    dispatch(forkTemplate(template.id));
  };

  return (
    <div className="template-card">
      <span className="category-tag">
        {template.category?.name || template.category}
      </span>

      <h3>{template.title}</h3>
      <p className="template-description">{template.description}</p>

      <div className="template-meta">
        <span className="creator">
          {template.creator?.username || template.creator}
        </span>
        <span className="versions-count">
          {template.versions?.length || 0} versions
        </span>
      </div>

      <div className="template-actions">
        <Link to={`/templates/${template.id}`} className="view-btn">
          View Details
        </Link>

        {canFork && (
          <button className="btn-fork" onClick={onFork}>
            Fork
          </button>
        )}

        {isCreator && (
          <button
            className="delete-icon-btn"
            title="Delete Template"
            onClick={onDelete}
          >
            🗑
          </button>
        )}
      </div>
    </div>
  );
};

export default TemplateCard;