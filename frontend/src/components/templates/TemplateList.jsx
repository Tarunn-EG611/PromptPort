import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getPublicTemplates } from '../../store/slices/templateSlice';
import TemplateCard from './TemplateCard';

const TemplateList = () => {
  const dispatch = useDispatch();

  const { templates, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.templates
  );

  useEffect(() => {
    dispatch(getPublicTemplates());
  }, [dispatch]);

  if (isLoading) {
    return <div className="loading">Loading Templates...</div>;
  }

  if (isError) {
    return <div className="error">{message}</div>;
  }

  return (
    <div className="template-list-container">
      <h2>Prompt Template Library</h2>

      {isSuccess && message && (
        <div className="alert-success">{message}</div>
      )}

      {templates && templates.length > 0 ? (
        <div className="template-grid">
          {templates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      ) : (
        <p>No templates available in the library.</p>
      )}
    </div>
  );
};

export default TemplateList;