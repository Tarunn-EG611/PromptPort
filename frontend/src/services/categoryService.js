import api from './api';

const getAllCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

const categoryService = { getAllCategories };

export default categoryService;