import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";

export const useAdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/api/admin/complaints");
      let data = response.data?.complaints || response.data || [];
      // Ensure unique ID for DataGrid
      data = data.map((item) => ({ ...item, id: item._id || item.id }));
      setComplaints(data);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to fetch complaints");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const updateComplaintStatus = async (id, status = "Reviewed") => {
    try {
      await axiosInstance.patch(`/api/admin/complaint/${id}`, { status });
      toast.success(`Complaint marked as ${status}`);
      setComplaints((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status } : c))
      );
      return true;
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update status");
      return false;
    }
  };

  return { complaints, loading, updateComplaintStatus, refetch: fetchComplaints };
};
