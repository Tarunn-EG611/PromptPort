import api from './api';

const getPublicTemplates = async () => {
  const response = await api.get('/templates/public');
  return response.data;
};

const createTemplate = async (templateData) => {
  const response = await api.post('/templates', templateData);
  return response.data;
};

const forkTemplate = async (id) => {
  const response = await api.post(`/templates/${id}/fork`);
  return response.data;
};

const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

const getTemplate = async (id) => {
  const response = await api.get(`/templates/${id}`);
  return response.data;
};

const getMyTemplates = async () => {
  const response = await api.get('/templates/mine');
  return response.data;
};

const deleteTemplate = async (id) => {
  await api.delete(`/templates/${id}`);
  return id;
};

const publishVersion = async (templateId, versionData) => {
  const response = await api.post(`/versions/template/${templateId}`, versionData);
  return response.data;
};

const deleteVersion = async (versionId) => {
  await api.delete(`/versions/${versionId}`);
};

const templateService = {
  getPublicTemplates,
  createTemplate,
  forkTemplate,
  getCategories,
  getTemplate,
  getMyTemplates,
  deleteTemplate,
  publishVersion,
  deleteVersion,
};

export default templateService;