import API from './axiosConfig';

export const getTeacherProfile = async () => {
  const response = await API.get('/teacher/profile');
  return response.data;
};