import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../../api/axiosInstance';

export const useMyComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchComplaints = useCallback(async () => {
        if (!isOpen) return;
        setLoading(true);
        try {
            const response = await axiosInstance.get('/student/complaints');
            setComplaints(response.data || []);
        } catch (error) {
            const errMsg = error.response?.data?.error || error.response?.data?.message || 'Failed to fetch complaints.';
            toast.error(errMsg);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchComplaints();
    }, [fetchComplaints]);

    return { complaints, loading, refetch: fetchComplaints };
};
