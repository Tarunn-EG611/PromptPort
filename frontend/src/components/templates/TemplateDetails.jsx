import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  getTemplateById,
  publishVersion,
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
          onClick={() => {
            /* fork action handled via TemplateCard elsewhere, or dispatch forkTemplate here if needed */
          }}
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

      <h2>Version History</h2>
      {versions.length > 0 ? (
        <table className="version-history-table">
          <thead>
            <tr>
              <th>Tag</th>
              <th>Model</th>
              <th>Prompt Snippet</th>
              <th>Created At</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No version history found.</p>
      )}

      <button className="btn-secondary" onClick={() => navigate(-1)}>
        Back
      </button>
    </div>
  );
};

export default TemplateDetails;