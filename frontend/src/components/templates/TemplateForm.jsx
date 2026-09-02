import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { createTemplate, reset } from '../../store/slices/templateSlice';
import AIPromptOptimizer from './AIPromptOptimizer';

const TemplateForm = ({ mode = 'create' }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.templates);

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    initialPromptText: '',
    modelProvider: 'Google Gemini',
    isPublic: false,
  });

  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { title, description, categoryId, initialPromptText, modelProvider, isPublic } =
    formData;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data);
      } catch (err) {
        // silently ignore category fetch failure
      }
    };
    fetchCategories();
  }, []);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const onReset = () => {
    setFormData((prev) => ({
      ...prev,
      title: '',
      description: '',
      initialPromptText: '',
      modelProvider: '',
    }));
  };

  const onOptimize = (optimizedPrompt) => {
    setFormData((prev) => ({
      ...prev,
      initialPromptText: optimizedPrompt,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!categoryId) {
      setMessage('Please select a category');
      setIsError(true);
      return;
    }

    try {
      const response = await dispatch(createTemplate(formData)).unwrap();
      setMessage(
        (typeof response === 'string' && response) ||
          'PromptTemplate created successfully.'
      );
      setIsError(false);
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/library');
      }, 2000);
    } catch (err) {
      setMessage(`Unable to save template: ${err}`);
      setIsError(true);
      setIsSuccess(false);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  return (
    <div className="template-form-container">
      <h2>{mode === 'edit' ? 'Update Template' : 'Create New Template'}</h2>

      {isError && <div className="alert-danger">{message}</div>}
      {isSuccess && <div className="alert-success">{message}</div>}

      <form onSubmit={onSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={title}
            onChange={onChange}
            required
          />
        </div>

        <div className="form-group">
          <textarea
            name="description"
            placeholder="Description"
            value={description}
            onChange={onChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="categoryId">Category</label>
          <select
            id="categoryId"
            name="categoryId"
            value={categoryId}
            onChange={onChange}
            required
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {mode === 'create' && (
          <div className="form-group">
            <textarea
              name="initialPromptText"
              placeholder="Initial Prompt Text"
              value={initialPromptText}
              onChange={onChange}
              required
            />
          </div>
        )}

        {mode === 'create' && user?.role === 'PROMPT_ENGINEER' && (
          <AIPromptOptimizer
            initialPrompt={initialPromptText}
            onOptimize={onOptimize}
          />
        )}

        <div className="form-group">
          <input
            type="text"
            name="modelProvider"
            placeholder="Model Provider"
            value={modelProvider}
            onChange={onChange}
          />
        </div>

        {user?.role !== 'PROMPT_COLLECTOR' && (
          <div className="form-group">
            <label htmlFor="isPublic">
              <input
                type="checkbox"
                id="isPublic"
                name="isPublic"
                checked={isPublic}
                onChange={onChange}
              />
              Make Public
            </label>
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {mode === 'edit' ? 'Update' : 'Create'}
          </button>

          {mode === 'create' && (
            <button type="button" className="btn-reset" onClick={onReset}>
              Reset
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TemplateForm;