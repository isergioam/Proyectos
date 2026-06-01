import api from './axios';

export const getChallenges = () => api.get('/challenges');
export const getChallenge = (id) => api.get(`/challenges/${id}`);
export const createChallenge = (data) => api.post('/challenges', data);
export const updateChallenge = (id, data) => api.put(`/challenges/${id}`, data);
export const deleteChallenge = (id) => api.delete(`/challenges/${id}`);
export const joinChallenge = (id) => api.post(`/challenges/${id}/join`);
export const leaveChallenge = (id) => api.delete(`/challenges/${id}/leave`);
export const getMyChallenges = () => api.get('/challenges/my-challenges');
export const getRanking = (id) => api.get(`/challenges/ranking/${id}`);
