import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
    modelProvider: '',
  });
  const [versionError, setVersionError] = useState('');
  const [versionSuccess, setVersionSuccess] = useState('');

  useEffect(() => {
    dispatch(getTemplateById(id));
    return () => {
      dispatch(reset());
    };
  }, [dispatch, id]);

  if (isLoading) {
    return <div className="loading">Loading details...</div>;
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

  const onOptimize = (optimizedPrompt) => {
    const versionTag = `v1.0.${versions.length + 1}`;
    dispatch(
      publishVersion({
        templateId: currentTemplate.id,
        versionData: {
          versionTag,
          promptText: optimizedPrompt,
          modelProvider: currentTemplate.modelProvider,
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

      setVersionSuccess('Version added successfully.');
      setVersionForm({ versionTag: '', promptText: '', modelProvider: '' });
      setShowVersionForm(false);
    } catch (err) {
      setVersionError(typeof err === 'string' ? err : 'Failed to add version.');
    }
  };

  return (
    <div className="template-details-container">
      <span className="category-tag">
        {currentTemplate.category?.name || currentTemplate.category}
      </span>

      <h1>{currentTemplate.title}</h1>

      <div className="template-meta">
        <span className="creator">
          {currentTemplate.creator?.username || currentTemplate.creator}
        </span>
        <span className="created-at">{currentTemplate.createdAt}</span>
      </div>

      {!isCreator && (
        <button
          className="btn-fork"
          onClick={() => dispatch(forkTemplate(currentTemplate.id))}
        >
          Fork Template
        </button>
      )}

      {isCreator && (
        <AIPromptOptimizer
          initialPrompt={currentTemplate.promptText}
          onOptimize={onOptimize}
        />
      )}

      {versionSuccess && <div className="alert-success">{versionSuccess}</div>}

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
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No version history found.</p>
      )}

      {showVersionForm && (
        <div className="add-version-form">
          <h3>Add New Prompt</h3>

          {versionError && <div className="alert-danger">{versionError}</div>}

          <form onSubmit={onVersionSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="versionTag"
                placeholder="Version Tag (e.g. v1.0.2)"
                value={versionForm.versionTag}
                onChange={onVersionFormChange}
                required
              />
            </div>

            <div className="form-group">
              <textarea
                name="promptText"
                placeholder="Prompt Text"
                value={versionForm.promptText}
                onChange={onVersionFormChange}
                required
              />
            </div>

            <div className="form-group">
              <select
                name="modelProvider"
                value={versionForm.modelProvider}
                onChange={onVersionFormChange}
                required
              >
                <option value="">-- Select Model Provider --</option>
                <option value="Google Gemini">Google Gemini</option>
                <option value="Claude">Claude</option>
                <option value="ChatGPT">ChatGPT</option>
              </select>
            </div>

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
                  setVersionForm({ versionTag: '', promptText: '', modelProvider: '' });
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

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
        </button>
      </div>
    </div>
  );
};

export default TemplateDetails;
