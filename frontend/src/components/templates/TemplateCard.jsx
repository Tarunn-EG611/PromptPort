import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { deleteTemplate, forkTemplate } from '../../store/slices/templateSlice';

const TemplateCard = ({ template }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [copied, setCopied] = useState(false);

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

  const activeVersion =
    template.versions && template.versions.length > 0
      ? template.versions[template.versions.length - 1]
      : null;

  const promptSnippet = activeVersion?.promptText || template.promptText || '';
  const modelProvider =
    activeVersion?.modelProvider || template.modelProvider || 'General';

  const getModelClass = (provider) => {
    if (!provider) return 'default';
    const lower = provider.toLowerCase();
    if (lower.includes('gemini')) return 'gemini';
    if (lower.includes('claude')) return 'claude';
    if (lower.includes('gpt') || lower.includes('chatgpt') || lower.includes('openai')) return 'chatgpt';
    return 'default';
  };

  const onCopyPrompt = (e) => {
    e.stopPropagation();
    if (!promptSnippet) return;
    navigator.clipboard.writeText(promptSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const creatorName = template.creator?.username || template.creator || 'Anonymous';
  const creatorInitial = creatorName ? creatorName.charAt(0).toUpperCase() : 'A';

  return (
    <div className="template-card">
      <div>
        <div className="template-card-top">
          <div className="tag-pills-row">
            <span className="category-tag">
              {template.category?.name || template.category || 'General'}
            </span>
            <span className={`model-tag ${getModelClass(modelProvider)}`}>
              {modelProvider}
            </span>
          </div>
          {template.isPublic && (
            <span className="section-badge">Public</span>
          )}
        </div>

        <h3 style={{ marginTop: '12px' }}>
          <Link to={`/templates/${template.id}`}>{template.title}</Link>
        </h3>

        <p className="template-description">{template.description}</p>

        {promptSnippet && (
          <div className="template-prompt-preview">
            <div className="template-prompt-header">
              <span className="prompt-mini-label">Prompt Preview</span>
              <button
                type="button"
                className={`btn-copy ${copied ? 'copied' : ''}`}
                onClick={onCopyPrompt}
              >
                {copied ? '✓ Copied' : '📋 Copy'}
              </button>
            </div>
            <code>{promptSnippet}</code>
          </div>
        )}
      </div>

      <div>
        <div className="template-meta">
          <div className="template-meta-author">
            <div className="author-avatar-sm">{creatorInitial}</div>
            <span>{creatorName}</span>
          </div>
          <span className="versions-count">
            {template.versions?.length || 1} {template.versions?.length === 1 ? 'version' : 'versions'}
          </span>
        </div>

        <div className="template-actions">
          <Link to={`/templates/${template.id}`} className="view-btn">
            View Details <span>→</span>
          </Link>

          <div className="template-actions-left">
            {canFork && (
              <button className="btn-fork" onClick={onFork} title="Fork template">
                ⑂ Fork
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
      </div>
    </div>
  );
};

export default TemplateCard;