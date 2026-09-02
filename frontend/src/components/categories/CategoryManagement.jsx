import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [name, setName] = useState('');
  const [editingCat, setEditingCat] = useState(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (err) {
      alert(typeof err === 'string' ? err : 'Failed to load categories.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const onChange = (e) => {
    setName(e.target.value);
  };

  const onEdit = (cat) => {
    setEditingCat(cat);
    setName(cat.name);
  };

  const onCancelEdit = () => {
    setEditingCat(null);
    setName('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCat) {
        await api.put(`/categories/${editingCat.id}`, { name });
      } else {
        await api.post('/categories', { name });
      }
      setName('');
      setEditingCat(null);
      fetchCategories();
    } catch (err) {
      alert(typeof err === 'string' ? err : 'Failed to save category.');
    }
  };

  const onDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await api.delete(`/categories/${id}`);
        fetchCategories();
      } catch (err) {
        alert(typeof err === 'string' ? err : 'Failed to delete category.');
      }
    }
  };

  if (isLoading) {
    return <div className="loading">Loading categories...</div>;
  }

  return (
    <div className="category-management-container">
      <h1>Category Management</h1>

      <form onSubmit={onSubmit} className="category-form">
        <input
          type="text"
          placeholder="Category Name (e.g. Finance, Healthcare)"
          value={name}
          onChange={onChange}
          required
        />
        <button type="submit" className="btn-primary">
          {editingCat ? 'Update' : 'Add Category'}
        </button>
        {editingCat && (
          <button type="button" className="btn-secondary" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </form>

      <table className="category-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Slug</th>
            <th>Templates</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id}>
              <td>{cat.id}</td>
              <td>{cat.name}</td>
              <td><code>{cat.slug}</code></td>
              <td>{cat.templateCount || 0}</td>
              <td>
                <button className="btn-edit" onClick={() => onEdit(cat)}>
                  Edit
                </button>
                <button className="btn-delete" onClick={() => onDelete(cat.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryManagement;