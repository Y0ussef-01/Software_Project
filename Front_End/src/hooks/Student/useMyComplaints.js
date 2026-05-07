import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../../api/axiosInstance';

export const useMyComplaints = (isOpen) => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchComplaints = useCallback(async () => {
        if (!isOpen) return;

        setLoading(true);
        try {
            const response = await axiosInstance.get('/student/myComplaints');
            setComplaints(response.data.complaints || []);
        } catch (error) {
            const errMsg = error.response?.data?.message || 'Failed to fetch complaints.';
            toast.error(errMsg);
        } finally {
            setLoading(false);
        }
    }, [isOpen]);

    useEffect(() => {
        fetchComplaints();
    }, [fetchComplaints]);

    return { complaints, loading, refetch: fetchComplaints };
};