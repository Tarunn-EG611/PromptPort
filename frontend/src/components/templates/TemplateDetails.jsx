import React, { useEffect, useState } from 'react';
<<<<<<< HEAD
import { useParams, useNavigate, Link } from 'react-router-dom';
=======
import { useParams, useNavigate } from 'react-router-dom';
>>>>>>> fd936892dfefaa27be028f9cc03c24a107783add
import { useSelector, useDispatch } from 'react-redux';
import {
  getTemplateById,
  publishVersion,
  forkTemplate,
  deleteVersion,
  reset,
} from '../../store/slices/templateSlice';
import AIPromptOptimizer from './AIPromptOptimizer';

const TemplateDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { currentTemplate, isLoading, isError, message } = useSelector(
    (state) => state.templates
  );

  const [showVersionForm, setShowVersionForm] = useState(false);
  const [versionForm, setVersionForm] = useState({
    versionTag: '',
    promptText: '',
<<<<<<< HEAD
    modelProvider: 'Google Gemini',
  });
  const [versionError, setVersionError] = useState('');
  const [versionSuccess, setVersionSuccess] = useState('');
  const [copiedPrompt, setCopiedPrompt] = useState(false);
=======
    modelProvider: '',
  });
  const [versionError, setVersionError] = useState('');
  const [versionSuccess, setVersionSuccess] = useState('');
>>>>>>> fd936892dfefaa27be028f9cc03c24a107783add

  useEffect(() => {
    dispatch(getTemplateById(id));
    return () => {
      dispatch(reset());
    };
  }, [dispatch, id]);

  if (isLoading) {
    return (
      <div className="loading">
        <span className="spinner" style={{ width: '28px', height: '28px', borderWidth: '3px' }} />
        <span>Loading Template Details...</span>
      </div>
    );
  }

  if (isError) {
    return <div className="error">Error: {message}</div>;
  }

  if (!currentTemplate) {
    return null;
  }

  const isCreator =
    user &&
    currentTemplate.creator &&
    (user.id === currentTemplate.creator.id ||
      user.username === currentTemplate.creator.username);

  const canDelete =
    user &&
    currentTemplate.creator &&
    (user.username === currentTemplate.creator.username || user.role === 'TEAM_LEAD');

  const onDeleteVersion = (versionId) => {
    if (window.confirm('Delete this version?')) {
      dispatch(deleteVersion(versionId));
    }
  };

  const versions = currentTemplate.versions || [];
  const latestVersion = versions.length > 0 ? versions[versions.length - 1] : null;
  const activePromptText = latestVersion?.promptText || currentTemplate.promptText || '';

  const onOptimize = (optimizedPrompt) => {
    const versionTag = `v1.0.${versions.length + 1}`;
    dispatch(
      publishVersion({
        templateId: currentTemplate.id,
        versionData: {
          versionTag,
          promptText: optimizedPrompt,
          modelProvider: latestVersion?.modelProvider || 'Google Gemini',
        },
      })
    );
  };

  const onVersionFormChange = (e) => {
    setVersionForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setVersionError('');
  };

  const onVersionOptimize = (optimizedPrompt) => {
    setVersionForm((prev) => ({ ...prev, promptText: optimizedPrompt }));
  };

  const onVersionSubmit = async (e) => {
    e.preventDefault();
    setVersionError('');
    setVersionSuccess('');

    if (!versionForm.versionTag.trim()) {
      setVersionError('Version tag is required.');
      return;
    }
    if (!versionForm.promptText.trim()) {
      setVersionError('Prompt text is required.');
      return;
    }
    if (!versionForm.modelProvider.trim()) {
      setVersionError('Model provider is required.');
      return;
    }

    try {
      await dispatch(
        publishVersion({
          templateId: currentTemplate.id,
          versionData: {
            versionTag: versionForm.versionTag.trim(),
            promptText: versionForm.promptText.trim(),
            modelProvider: versionForm.modelProvider.trim(),
          },
        })
      ).unwrap();

<<<<<<< HEAD
      setVersionSuccess('New version added successfully.');
      setVersionForm({ versionTag: '', promptText: '', modelProvider: 'Google Gemini' });
=======
      setVersionSuccess('Version added successfully.');
      setVersionForm({ versionTag: '', promptText: '', modelProvider: '' });
>>>>>>> fd936892dfefaa27be028f9cc03c24a107783add
      setShowVersionForm(false);
    } catch (err) {
      setVersionError(typeof err === 'string' ? err : 'Failed to add version.');
    }
  };

<<<<<<< HEAD
  const onCopyActivePrompt = () => {
    if (!activePromptText) return;
    navigator.clipboard.writeText(activePromptText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const creatorName = currentTemplate.creator?.username || currentTemplate.creator || 'Anonymous';
  const creatorInitial = creatorName ? creatorName.charAt(0).toUpperCase() : 'A';

  const getModelClass = (provider) => {
    if (!provider) return 'default';
    const lower = provider.toLowerCase();
    if (lower.includes('gemini')) return 'gemini';
    if (lower.includes('claude')) return 'claude';
    if (lower.includes('gpt') || lower.includes('chatgpt') || lower.includes('openai')) return 'chatgpt';
    return 'default';
  };

  const wordCount = activePromptText ? activePromptText.trim().split(/\s+/).length : 0;

=======
>>>>>>> fd936892dfefaa27be028f9cc03c24a107783add
  return (
    <div className="template-details-container">
      <div className="breadcrumb-nav">
        <Link to="/">Dashboard</Link>
        <span>/</span>
        <Link to="/library">Library</Link>
        <span>/</span>
        <span style={{ color: 'var(--text-main)' }}>{currentTemplate.title}</span>
      </div>

<<<<<<< HEAD
      <div className="details-header">
        <div className="tag-pills-row">
          <span className="category-tag">
            {currentTemplate.category?.name || currentTemplate.category || 'General'}
          </span>
          {latestVersion?.modelProvider && (
            <span className={`model-tag ${getModelClass(latestVersion.modelProvider)}`}>
              {latestVersion.modelProvider}
            </span>
          )}
          {currentTemplate.isPublic && (
            <span className="section-badge">Public</span>
          )}
        </div>

        <h1>{currentTemplate.title}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.6' }}>
          {currentTemplate.description}
        </p>

        <div className="details-meta-row">
          <div className="details-meta-left">
            <div className="template-meta-author">
              <div className="author-avatar-sm">{creatorInitial}</div>
              <span>{creatorName}</span>
            </div>
            {currentTemplate.createdAt && (
              <span>Created {currentTemplate.createdAt.slice(0, 10)}</span>
            )}
            <span className="versions-count">
              {versions.length} {versions.length === 1 ? 'version' : 'versions'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {!isCreator && user && (
              <button
                className="btn-fork"
                onClick={() => dispatch(forkTemplate(currentTemplate.id))}
              >
                ⑂ Fork Template
              </button>
            )}
          </div>
        </div>
      </div>

      {activePromptText && (
        <div className="prompt-showcase-box">
          <div className="prompt-showcase-header">
            <span className="prompt-showcase-title">
              Current Prompt Content ({wordCount} words, {activePromptText.length} characters)
            </span>
            <div className="prompt-showcase-actions">
              <button
                type="button"
                className={`btn-copy ${copiedPrompt ? 'copied' : ''}`}
                onClick={onCopyActivePrompt}
              >
                {copiedPrompt ? '✓ Copied' : '📋 Copy Prompt'}
              </button>
            </div>
          </div>
          <div className="prompt-showcase-body">{activePromptText}</div>
        </div>
=======
      {!isCreator && (
        <button
          className="btn-fork"
          onClick={() => dispatch(forkTemplate(currentTemplate.id))}
        >
          Fork Template
        </button>
>>>>>>> fd936892dfefaa27be028f9cc03c24a107783add
      )}

      {isCreator && (
        <AIPromptOptimizer
          initialPrompt={activePromptText}
          onOptimize={onOptimize}
        />
      )}

      {versionSuccess && <div className="alert-success">{versionSuccess}</div>}

<<<<<<< HEAD
      <div className="section-header-row" style={{ marginTop: '32px' }}>
        <h2>
          <span>Version History</span>
          <span className="section-badge">{versions.length}</span>
        </h2>
        {user && (
          <button
            className="btn-primary"
            onClick={() => {
              setShowVersionForm((prev) => !prev);
              setVersionError('');
              setVersionSuccess('');
            }}
            style={{ fontSize: '0.825rem', padding: '7px 14px' }}
          >
            {showVersionForm ? 'Close Form' : '+ Add New Version'}
          </button>
        )}
      </div>

      {versions.length > 0 ? (
        <div className="table-wrapper">
          <table className="version-history-table">
            <thead>
              <tr>
                <th>Tag</th>
                <th>Model</th>
                <th>Prompt Snippet</th>
                <th>Created</th>
                {canDelete && <th>Actions</th>}
=======
      <h2>Version History</h2>
      {versions.length > 0 ? (
        <table className="version-history-table">
          <thead>
            <tr>
              <th>Tag</th>
              <th>Model</th>
              <th>Prompt Snippet</th>
              <th>Created At</th>
              {canDelete && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {versions.map((version) => (
              <tr key={version.id || version.versionTag}>
                <td>{version.versionTag}</td>
                <td>{version.modelProvider}</td>
                <td>
                  {version.promptText
                    ? `${version.promptText.slice(0, 50)}...`
                    : ''}
                </td>
                <td>{version.createdAt}</td>
                {canDelete && (
                  <td>
                    <button
                      className="btn-danger"
                      onClick={() => onDeleteVersion(version.id)}
                    >
                      🗑
                    </button>
                  </td>
                )}
>>>>>>> fd936892dfefaa27be028f9cc03c24a107783add
              </tr>
            </thead>
            <tbody>
              {versions.map((version) => (
                <tr key={version.id || version.versionTag}>
                  <td>{version.versionTag}</td>
                  <td>
                    <span className={`model-tag ${getModelClass(version.modelProvider)}`}>
                      {version.modelProvider}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                      {version.promptText
                        ? `${version.promptText.slice(0, 60)}...`
                        : ''}
                    </span>
                  </td>
                  <td>{version.createdAt ? version.createdAt.slice(0, 10) : 'Recent'}</td>
                  {canDelete && (
                    <td>
                      <button
                        className="btn-danger"
                        onClick={() => onDeleteVersion(version.id)}
                      >
                        🗑 Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p style={{ color: 'var(--text-secondary)', padding: '16px 0' }}>
          No version history found.
        </p>
      )}

      {showVersionForm && (
        <div className="add-version-form">
<<<<<<< HEAD
          <h3>Publish New Prompt Version</h3>
=======
          <h3>Add New Prompt</h3>
>>>>>>> fd936892dfefaa27be028f9cc03c24a107783add

          {versionError && <div className="alert-danger">{versionError}</div>}

          <form onSubmit={onVersionSubmit}>
            <div className="form-group">
<<<<<<< HEAD
              <label>Version Tag</label>
              <input
                type="text"
                name="versionTag"
                placeholder="e.g. v1.1.0"
=======
              <input
                type="text"
                name="versionTag"
                placeholder="Version Tag (e.g. v1.0.2)"
>>>>>>> fd936892dfefaa27be028f9cc03c24a107783add
                value={versionForm.versionTag}
                onChange={onVersionFormChange}
                required
              />
            </div>

            <div className="form-group">
<<<<<<< HEAD
              <label>Model Provider</label>
=======
              <textarea
                name="promptText"
                placeholder="Prompt Text"
                value={versionForm.promptText}
                onChange={onVersionFormChange}
                required
              />
            </div>

            <div className="form-group">
>>>>>>> fd936892dfefaa27be028f9cc03c24a107783add
              <select
                name="modelProvider"
                value={versionForm.modelProvider}
                onChange={onVersionFormChange}
                required
              >
<<<<<<< HEAD
                <option value="Google Gemini">Google Gemini</option>
                <option value="Claude">Claude</option>
                <option value="ChatGPT">ChatGPT (OpenAI)</option>
                <option value="Llama 3">Llama 3</option>
                <option value="Mistral">Mistral</option>
              </select>
            </div>

            <div className="form-group">
              <label>Prompt Text</label>
              <textarea
                name="promptText"
                placeholder="Enter prompt template content..."
                value={versionForm.promptText}
                onChange={onVersionFormChange}
                required
              />
            </div>

=======
                <option value="">-- Select Model Provider --</option>
                <option value="Google Gemini">Google Gemini</option>
                <option value="Claude">Claude</option>
                <option value="ChatGPT">ChatGPT</option>
              </select>
            </div>

>>>>>>> fd936892dfefaa27be028f9cc03c24a107783add
            <AIPromptOptimizer
              initialPrompt={versionForm.promptText}
              onOptimize={onVersionOptimize}
            />

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                Save Version
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setShowVersionForm(false);
                  setVersionError('');
<<<<<<< HEAD
                  setVersionForm({ versionTag: '', promptText: '', modelProvider: 'Google Gemini' });
=======
                  setVersionForm({ versionTag: '', promptText: '', modelProvider: '' });
>>>>>>> fd936892dfefaa27be028f9cc03c24a107783add
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

<<<<<<< HEAD
      <div style={{ marginTop: '36px', display: 'flex', gap: '12px' }}>
        <button className="btn-secondary" onClick={() => navigate(-1)}>
          ← Back
=======
      <div className="form-actions" style={{ marginTop: '24px' }}>
        {user && (
          <button
            className="btn-primary"
            onClick={() => {
              setShowVersionForm((prev) => !prev);
              setVersionError('');
              setVersionSuccess('');
            }}
          >
            {showVersionForm ? 'Cancel' : '+ Add New Prompt'}
          </button>
        )}
        <button className="btn-secondary" onClick={() => navigate(-1)}>
          Back
>>>>>>> fd936892dfefaa27be028f9cc03c24a107783add
        </button>
      </div>
    </div>
  );
};

export default TemplateDetails;
