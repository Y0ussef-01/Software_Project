import { useState } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../../api/axiosInstance';

export const useSubmitComplaint = () => {
  const [loading, setLoading] = useState(false);

  const submitComplaint = async (data) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/api/student/complaint', data);
      toast.success(response.data?.message || 'Submitted successfully!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to submit. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { submitComplaint, loading };
};
