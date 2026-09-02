import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const CollectionList = () => {
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
    fetchData();
  }, []);

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
      await api.post('/collections', { name, capacity, description });
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
  };

  const closeSyncModal = () => {
    setSyncModalCollection(null);
    setSelectedTemplates([]);
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

  if (isLoading) {
    return <div className="loading">Loading Collections...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="collection-list-container">
      <h2>My Collections</h2>

      <button className="btn-primary" onClick={() => setShowForm((prev) => !prev)}>
        + Create New Collection
      </button>

      {showForm && (
        <form onSubmit={onSubmit} className="collection-form">
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={name}
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="number"
              name="capacity"
              placeholder="Capacity"
              value={capacity}
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
          <button type="submit" className="btn-primary">
            Save Collection
          </button>
        </form>
      )}

      {collections.length > 0 ? (
        <table className="collections-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Capacity</th>
              <th>Templates</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {collections.map((col) => (
              <tr key={col.id}>
                <td>{col.name}</td>
                <td>{col.description}</td>
                <td>{col.capacity}</td>
                <td>{col.templates?.length || 0}</td>
                <td>
                  <button
                    className="btn-secondary"
                    onClick={() => openSyncModal(col)}
                  >
                    Add/Remove Templates
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => onDelete(col.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>You haven't created any collections yet.</p>
      )}

      {syncModalCollection && (
        <div className="sync-modal">
          <div className="sync-modal-content">
            <h3>Sync Templates — {syncModalCollection.name}</h3>
            <div className="template-checkboxes">
              {userTemplates.map((template) => (
                <label key={template.id}>
                  <input
                    type="checkbox"
                    checked={selectedTemplates.includes(template.id)}
                    onChange={() => toggleTemplateSelection(template.id)}
                  />
                  {template.title}
                </label>
              ))}
            </div>
            <div className="sync-modal-actions">
              <button className="btn-primary" onClick={onSaveSync}>
                Save Changes
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