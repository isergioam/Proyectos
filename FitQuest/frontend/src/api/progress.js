import api from './axios';

export const logProgress = (data) => api.post('/progress', data);
export const getMyProgress = (challengeId) => api.get(`/progress/my-progress/${challengeId}`);
