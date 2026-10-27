import api from './api';

const getMyCollections = async () => {
  const response = await api.get('/collections/mine');
  return response.data;
};

const syncCollection = async (id, promptIds) => {
  const response = await api.post(`/collections/${id}/sync`, promptIds);
  return response.data;
};

const collectionService = { getMyCollections, syncCollection };

export default collectionService;