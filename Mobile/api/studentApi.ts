import API from './axiosConfig';

export const getStudentProfile = async () => {
  const response = await API.get('/student/Profile');
  return response.data;
};