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
      } catch (err) {}
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
      modelProvider: 'Google Gemini',
      isPublic: false,
    }));
  };

  const onOptimize = (optimizedPrompt) => {
    setFormData((prev) => ({
      ...prev,
      initialPromptText: optimizedPrompt,
    }));
  };

  const insertVariable = (varName) => {
    setFormData((prev) => ({
      ...prev,
      initialPromptText: prev.initialPromptText
        ? `${prev.initialPromptText} {{${varName}}}`
        : `{{${varName}}}`,
    }));
  };

  const blueprints = [
    {
      label: 'Code Reviewer',
      title: 'Senior Code Reviewer & Architect',
      category: 'Development',
      provider: 'Google Gemini',
      description: 'Reviews pull requests for algorithmic complexity, security vulnerabilities, and clean architecture.',
      prompt: 'Act as a Principal Software Engineer. Review the following {{code_snippet}} written in {{language}}.\n\nEvaluation Criteria:\n1. Algorithmic efficiency & memory performance\n2. Security vulnerabilities & input validation\n3. Code readability and architectural consistency\n\nProvide constructive feedback with specific line-by-line refactoring suggestions.',
    },
    {
      label: 'Executive Brief',
      title: 'Executive Summary & Action Items',
      category: 'Productivity',
      provider: 'Claude',
      description: 'Condenses dense business reports or meeting transcripts into high-impact executive summaries.',
      prompt: 'You are an executive chief of staff. Review the provided {{document_content}}.\n\nDeliver the following structured briefing:\n1. Executive Summary (maximum 3 sentences)\n2. Top 3 Strategic Takeaways\n3. Action Items with prioritized owners and timelines\n4. Risk analysis and critical caveats',
    },
    {
      label: 'JSON Extractor',
      title: 'Structured JSON Entity Parser',
      category: 'Data Science',
      provider: 'ChatGPT',
      description: 'Transforms messy, unstructured text into strictly typed JSON complying with a given schema.',
      prompt: 'Extract structured information from the following text based on this schema {{json_schema}}.\n\nSource text: {{raw_text}}\n\nOutput Constraints:\n- Reply with raw, valid JSON only.\n- Do not wrap in markdown tags or include explanations.\n- Use null for unmentioned keys.',
    },
  ];

  const applyBlueprint = (bp) => {
    const matchedCategory = categories.find(
      (c) => c.name.toLowerCase() === bp.category.toLowerCase()
    );
    setFormData((prev) => ({
      ...prev,
      title: bp.title,
      description: bp.description,
      modelProvider: bp.provider,
      initialPromptText: bp.prompt,
      categoryId: matchedCategory ? matchedCategory.id : prev.categoryId,
    }));
  };

  const detectedVariables = Array.from(
    new Set(
      (initialPromptText.match(/\{\{([^}]+)\}\}/g) || []).map((v) =>
        v.replace(/[{}]/g, '').trim()
      )
    )
  );

  const wordCount = initialPromptText
    ? initialPromptText.trim().split(/\s+/).filter(Boolean).length
    : 0;
  const charCount = initialPromptText.length;
  const estimatedTokens = Math.ceil(charCount / 4);

  const checklist = [
    { label: 'Template title defined', done: !!title.trim() },
    { label: 'Clear description provided', done: !!description.trim() },
    { label: 'Category assigned', done: !!categoryId },
    { label: 'Prompt defined (> 20 chars)', done: charCount >= 20 },
    { label: 'Dynamic {{variables}} detected', done: detectedVariables.length > 0 },
  ];

  const completedCount = checklist.filter((item) => item.done).length;
  const readinessPercent = Math.round((completedCount / checklist.length) * 100);

  const modelSpecs = {
    'Google Gemini': {
      context: '1M - 2M tokens',
      strengths: 'Multimodal analysis, complex reasoning, and high throughput.',
    },
    'Claude': {
      context: '200k tokens',
      strengths: 'Nuanced writing, complex instructions, and thoughtful code analysis.',
    },
    'ChatGPT': {
      context: '128k tokens',
      strengths: 'Versatile agentic workflows, function calling, and structured JSON.',
    },
    'Llama 3': {
      context: '8k - 128k tokens',
      strengths: 'Fast open-weights execution and predictable formatting.',
    },
    'Mistral': {
      context: '32k - 128k tokens',
      strengths: 'Strong European multilingual mastery and concise generation.',
    },
    'General': {
      context: 'Universal',
      strengths: 'Standardized prompts designed to be portable across all LLMs.',
    },
  };

  const currentSpec = modelSpecs[modelProvider] || modelSpecs['Google Gemini'];

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!categoryId) {
      setMessage('Please select a category for this template.');
      setIsError(true);
      return;
    }

    try {
      const response = await dispatch(createTemplate(formData)).unwrap();
      setMessage(
        (typeof response === 'string' && response) ||
          'Prompt template created successfully!'
      );
      setIsError(false);
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/library');
      }, 1500);
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
    <div className="template-creation-wrapper">
      <div className="template-form-container">
        <h2>{mode === 'edit' ? 'Update Prompt Template' : 'Create New Prompt Template'}</h2>

        {isError && <div className="alert-danger">{message}</div>}
        {isSuccess && <div className="alert-success">{message}</div>}

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="title">Template Title</label>
            <input
              id="title"
              type="text"
              name="title"
              placeholder="e.g. Next.js Architecture Expert, SQL Query Optimizer"
              value={title}
              onChange={onChange}
              required
            />
          </div>

<<<<<<< HEAD
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Explain what this prompt accomplishes, target use-cases, and expected outputs..."
              value={description}
              onChange={onChange}
            />
          </div>
=======
        {mode === 'create' && (
          <AIPromptOptimizer
            initialPrompt={initialPromptText}
            onOptimize={onOptimize}
          />
        )}
>>>>>>> fd936892dfefaa27be028f9cc03c24a107783add

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

          <div className="form-group">
            <label htmlFor="modelProvider">Target Model Provider</label>
            <select
              id="modelProvider"
              name="modelProvider"
              value={modelProvider}
              onChange={onChange}
              required
            >
              <option value="Google Gemini">Google Gemini</option>
              <option value="Claude">Claude (Anthropic)</option>
              <option value="ChatGPT">ChatGPT (OpenAI)</option>
              <option value="Llama 3">Llama 3 (Meta)</option>
              <option value="Mistral">Mistral Large</option>
              <option value="General">Universal / Any LLM</option>
            </select>
          </div>

          {mode === 'create' && (
            <div className="form-group">
              <label htmlFor="initialPromptText">Initial Prompt Template</label>
              <textarea
                id="initialPromptText"
                name="initialPromptText"
                placeholder="Enter your system or user prompt template with any {{variables}}..."
                value={initialPromptText}
                onChange={onChange}
                required
                style={{ minHeight: '140px' }}
              />
            </div>
          )}

          {mode === 'create' && (
            <AIPromptOptimizer
              initialPrompt={initialPromptText}
              onOptimize={onOptimize}
            />
          )}

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
                Share publicly with the PromptPort library
              </label>
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading
                ? 'Saving...'
                : mode === 'edit'
                ? 'Save Changes'
                : 'Publish Template'}
            </button>

            {mode === 'create' && (
              <button type="button" className="btn-reset" onClick={onReset}>
                Reset Form
              </button>
            )}

            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate(-1)}
              style={{ marginLeft: 'auto' }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <aside className="template-side-panel">
        <div className="side-panel-card">
          <div className="side-panel-header">
            <span className="side-panel-title">
              <span>📊</span> Prompt Readiness
            </span>
            <span className="side-panel-badge">{readinessPercent}%</span>
          </div>

          <div className="readiness-meter">
            <div className="readiness-bar-bg">
              <div
                className="readiness-bar-fill"
                style={{ width: `${readinessPercent}%` }}
              />
            </div>
            <div className="readiness-score-label">
              <span>{completedCount} of {checklist.length} completed</span>
              <span>{readinessPercent === 100 ? 'Ready to ship!' : 'Drafting'}</span>
            </div>
          </div>

          <div className="checklist-group">
            {checklist.map((item) => (
              <div
                key={item.label}
                className={`checklist-item ${item.done ? 'checked' : ''}`}
              >
                <div className="checklist-indicator">
                  {item.done ? '✓' : '○'}
                </div>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="side-panel-card">
          <div className="side-panel-header">
            <span className="side-panel-title">
              <span>🧩</span> Dynamic Variables
            </span>
            <span className="side-panel-badge">
              {detectedVariables.length}
            </span>
          </div>

          {detectedVariables.length > 0 ? (
            <div className="variables-detected-box">
              {detectedVariables.map((v) => (
                <span key={v} className="variable-pill">
                  {`{{${v}}}`}
                </span>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              No variables detected. Add placeholders like <code>{`{{input}}`}</code> to make your prompt reusable.
            </p>
          )}

          <div style={{ marginTop: '6px' }}>
            <span style={{ fontSize: '0.725rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-secondary)' }}>
              Click to insert:
            </span>
            <div className="quick-var-chips" style={{ marginTop: '6px' }}>
              {['topic', 'context', 'instructions', 'tone', 'output_format'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="quick-var-btn"
                  onClick={() => insertVariable(tag)}
                >
                  + {`{{${tag}}}`}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="side-panel-card">
          <div className="side-panel-header">
            <span className="side-panel-title">
              <span>⚡</span> Model & Token Metrics
            </span>
            <span className="side-panel-badge">{modelProvider}</span>
          </div>

          <div className="model-stat-grid">
            <div className="model-stat-item">
              <span className="model-stat-value">{charCount}</span>
              <span className="model-stat-label">Characters</span>
            </div>
            <div className="model-stat-item">
              <span className="model-stat-value">{wordCount}</span>
              <span className="model-stat-label">Words</span>
            </div>
            <div className="model-stat-item">
              <span className="model-stat-value">~{estimatedTokens}</span>
              <span className="model-stat-label">Tokens</span>
            </div>
          </div>

          <div className="model-capability-info">
            <div style={{ fontWeight: '600', color: 'var(--text-main)', marginBottom: '3px' }}>
              Context Window: {currentSpec.context}
            </div>
            <div>{currentSpec.strengths}</div>
          </div>
        </div>

        {mode === 'create' && (
          <div className="side-panel-card">
            <div className="side-panel-header">
              <span className="side-panel-title">
                <span>💡</span> Starter Blueprints
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Load a pre-configured architecture pattern with one click:
            </p>
            <div className="blueprints-list">
              {blueprints.map((bp) => (
                <button
                  key={bp.label}
                  type="button"
                  className="blueprint-btn"
                  onClick={() => applyBlueprint(bp)}
                >
                  <span>{bp.label}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Apply →</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="side-panel-card">
          <div className="side-panel-header">
            <span className="side-panel-title">
              <span>🎯</span> Best Practices
            </span>
          </div>
          <div className="tips-list">
            <div className="tip-item">
              <span className="tip-icon">🔹</span>
              <span><strong>Explicit Output:</strong> Request JSON, tables, or markdown for consistent downstream parsing.</span>
            </div>
            <div className="tip-item">
              <span className="tip-icon">🔹</span>
              <span><strong>Role Persona:</strong> Start with "Act as an expert in..." to prime the model's domain knowledge.</span>
            </div>
            <div className="tip-item">
              <span className="tip-icon">🔹</span>
              <span><strong>Guardrails:</strong> Define negative constraints (e.g. "Do not assume missing variables").</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default TemplateForm;