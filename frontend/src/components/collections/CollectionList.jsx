import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../../services/api';
import EmptyState from '../common/EmptyState';

const CollectionList = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [collections, setCollections] = useState([]);
  const [userTemplates, setUserTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    capacity: 10,
    description: '',
  });

  const [syncModalCollection, setSyncModalCollection] = useState(null);
  const [selectedTemplates, setSelectedTemplates] = useState([]);
  const [modalSearch, setModalSearch] = useState('');

  const { name, capacity, description } = formData;

  const fetchData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const [collectionsRes, templatesRes] = await Promise.all([
        api.get('/collections/mine'),
        api.get('/templates/mine'),
      ]);
      setCollections(collectionsRes.data);
      setUserTemplates(templatesRes.data);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to load collections.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const token = localStorage.getItem('promptport_token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onChange = (e) => {
    const { name: fieldName, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [fieldName]: fieldName === 'capacity' ? Number(value) : value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/collections', { name, maxCapacity: capacity, description });
      setFormData({ name: '', capacity: 10, description: '' });
      setShowForm(false);
      fetchData();
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to save collection.');
    }
  };

  const onDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this collection?')) {
      try {
        await api.delete(`/collections/${id}`);
        alert('Collection deleted successfully');
        fetchData();
      } catch (err) {
        setError(typeof err === 'string' ? err : 'Failed to delete collection.');
      }
    }
  };

  const openSyncModal = (collection) => {
    setSyncModalCollection(collection);
    setSelectedTemplates(
      (collection.templates || []).map((t) => t.id)
    );
    setModalSearch('');
  };

  const closeSyncModal = () => {
    setSyncModalCollection(null);
    setSelectedTemplates([]);
    setModalSearch('');
  };

  const toggleTemplateSelection = (templateId) => {
    setSelectedTemplates((prev) =>
      prev.includes(templateId)
        ? prev.filter((id) => id !== templateId)
        : [...prev, templateId]
    );
  };

  const onSaveSync = async () => {
    try {
      await api.post(`/collections/${syncModalCollection.id}/sync`, selectedTemplates);
      closeSyncModal();
      fetchData();
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to sync templates.');
    }
  };

  const filteredUserTemplates = userTemplates.filter(
    (t) =>
      !modalSearch.trim() ||
      t.title?.toLowerCase().includes(modalSearch.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="loading">
        <span className="spinner" style={{ width: '28px', height: '28px', borderWidth: '3px' }} />
        <span>Loading Collections...</span>
      </div>
    );
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="collection-list-container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2>My Collections</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Organize personal prompt workflows into curated collections.
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => setShowForm((prev) => !prev)}
        >
          {showForm ? 'Close Form' : '+ New Collection'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={onSubmit} className="collection-form">
          <h3 style={{ marginBottom: '18px', fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>
            Create New Collection
          </h3>
          <div className="form-group">
            <label>Collection Name</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Sales Pitches, Code Review Agents"
              value={name}
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Maximum Capacity</label>
            <input
              type="number"
              name="capacity"
              min="1"
              max="100"
              placeholder="Capacity"
              value={capacity}
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              placeholder="Optional notes or purpose of this collection..."
              value={description}
              onChange={onChange}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">
              Save Collection
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {collections.length > 0 ? (
        <div className="table-wrapper">
          <table className="collections-table">
            <thead>
              <tr>
                <th>Collection</th>
                <th>Capacity Utilization</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {collections.map((col) => {
                const max = col.maxCapacity || col.capacity || 10;
                const count = col.templates?.length || 0;
                const percent = Math.min(100, Math.round((count / max) * 100));

                return (
                  <tr key={col.id}>
                    <td>
                      <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>
                        {col.name}
                      </div>
                      {col.description && (
                        <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {col.description}
                        </div>
                      )}
                    </td>
                    <td style={{ minWidth: '180px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', color: 'var(--text-secondary)' }}>
                        <span>{count} / {max} prompts</span>
                        <span>{percent}%</span>
                      </div>
                      <div className="progress-bar-container">
                        <div
                          className="progress-bar-fill"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="btn-secondary"
                          onClick={() => openSyncModal(col)}
                          style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                        >
                          Sync Prompts
                        </button>
                        <button
                          className="btn-danger"
                          onClick={() => onDelete(col.id)}
                          style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          message="You haven't created any collections yet."
          actionText="+ Create Your First Collection"
          onAction={() => setShowForm(true)}
        />
      )}

      {syncModalCollection && (
        <div className="sync-modal">
          <div className="sync-modal-content">
            <h3>Manage Prompts in {syncModalCollection.name}</h3>

            <div className="search-input-wrapper" style={{ marginBottom: '16px' }}>
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Filter templates..."
                value={modalSearch}
                onChange={(e) => setModalSearch(e.target.value)}
              />
            </div>

            <div className="template-checkboxes">
              {filteredUserTemplates.length > 0 ? (
                filteredUserTemplates.map((template) => (
                  <label key={template.id}>
                    <input
                      type="checkbox"
                      checked={selectedTemplates.includes(template.id)}
                      onChange={() => toggleTemplateSelection(template.id)}
                    />
                    <span>{template.title}</span>
                  </label>
                ))
              ) : (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  No available templates found.
                </p>
              )}
            </div>

            <div className="sync-modal-actions">
              <button className="btn-primary" onClick={onSaveSync}>
                Save Changes ({selectedTemplates.length} selected)
              </button>
              <button className="btn-secondary" onClick={closeSyncModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionList;