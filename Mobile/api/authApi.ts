import API from './axiosConfig';


interface LoginData {
  id: string;
  password: string;
}

interface LoginResponse {
  user: any;
  token: string;
  role: 'student' | 'teacher' | 'admin';
}


export const login = async (data: LoginData): Promise<LoginResponse> => {
  try {
    const response = await API.post('/auth/login', data);
    return response.data;
  } catch (err: any) {
    console.log('❌ Error:', err.message);
    console.log('❌ Response:', JSON.stringify(err.response?.data));
    console.log('❌ Status:', err.response?.status);
    throw err;
  }
};