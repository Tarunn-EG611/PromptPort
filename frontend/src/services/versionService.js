import api from './api';

const getVersionHistory = async (templateId) => {
  const response = await api.get(`/versions/template/${templateId}`);
  return response.data;
};

const publishVersion = async (templateId, versionData) => {
  const response = await api.post(`/versions/template/${templateId}`, versionData);
  return response.data;
};

const versionService = { getVersionHistory, publishVersion };

export default versionService;
export { getVersionHistory, publishVersion };