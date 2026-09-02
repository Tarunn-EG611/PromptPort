import React, { useState } from 'react';
import api from '../../services/api';

const AIPromptOptimizer = ({ initialPrompt, onOptimize }) => {
  const [prompt, setPrompt] = useState(initialPrompt || '');
  const [optimizedPrompt, setOptimizedPrompt] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [error, setError] = useState('');

  const onChange = (e) => {
    setPrompt(e.target.value);
  };

  const onOptimizeClick = async () => {
    if (!prompt) {
      return;
    }

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

  return (
    <div className="ai-prompt-optimizer">
      <textarea
        placeholder="Enter your initial prompt idea here..."
        value={prompt}
        onChange={onChange}
      />

      <button
        className="btn-primary"
        onClick={onOptimizeClick}
        disabled={isOptimizing || !prompt}
      >
        {isOptimizing ? (
          <>
            <span className="spinner" /> Optimizing...
          </>
        ) : (
          '🚀 Optimize with Gemini AI'
        )}
      </button>

      {error && <div className="error">{error}</div>}

      {optimizedPrompt && (
        <div className="optimized-result">
          <h4>Optimized Prompt</h4>
          <pre>{optimizedPrompt}</pre>
          <button className="btn-secondary" onClick={onUseVersion}>
            Use This Version
          </button>
        </div>
      )}
    </div>
  );
};

export default AIPromptOptimizer;