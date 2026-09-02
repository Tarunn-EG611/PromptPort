import api from './api';

const getAllCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

const rebuildStats = async (categoryId) => {
  const response = await api.post(`/categories/${categoryId}/rebuild-stats`);
  return response.data;
};

const categoryService = { getAllCategories, rebuildStats };

export default categoryService;