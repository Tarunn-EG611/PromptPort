import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AIPromptOptimizer = ({ initialPrompt, onOptimize }) => {
  const [prompt, setPrompt] = useState(initialPrompt || '');
  const [optimizedPrompt, setOptimizedPrompt] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  const onChange = (e) => {
    setPrompt(e.target.value);
  };

  const onOptimizeClick = async () => {
    if (!prompt.trim()) return;

    setIsOptimizing(true);
    setError('');

    try {
      const response = await api.post('/ai/optimize', { prompt });
      setOptimizedPrompt(response.data.response);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to optimize prompt.');
    } finally {
      setIsOptimizing(false);
    }
  };

  const onUseVersion = () => {
    onOptimize(optimizedPrompt);
  };

  const onCopy = () => {
    if (!optimizedPrompt) return;
    navigator.clipboard.writeText(optimizedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="ai-prompt-optimizer">
      <div className="ai-optimizer-header">
        <div className="ai-optimizer-title">
          <span className="spark">✨</span>
          <span>Gemini AI Prompt Optimizer</span>
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          {prompt.length} chars
        </span>
      </div>

      <textarea
        placeholder="Enter your draft prompt or instructions here to be refined by Gemini..."
        value={prompt}
        onChange={onChange}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          type="button"
          className="btn-primary"
          onClick={onOptimizeClick}
          disabled={isOptimizing || !prompt.trim()}
          style={{ width: 'fit-content' }}
        >
          {isOptimizing ? (
            <>
              <span className="spinner" /> Enhancing with Gemini...
            </>
          ) : (
            '✨ Optimize with Gemini AI'
          )}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {optimizedPrompt && (
        <div className="optimized-result">
          <div className="optimized-result-header">
            <h4>Optimized Output</h4>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className={`btn-copy ${copied ? 'copied' : ''}`}
                onClick={onCopy}
              >
                {copied ? '✓ Copied' : '📋 Copy'}
              </button>
            </div>
          </div>
          <pre>{optimizedPrompt}</pre>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className="btn-primary"
              onClick={onUseVersion}
              style={{ fontSize: '0.825rem', padding: '7px 14px' }}
            >
              ✓ Apply This Prompt
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIPromptOptimizer;