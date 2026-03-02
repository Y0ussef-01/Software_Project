import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AdminProfileContext = createContext(null);

export const AdminProfileProvider = ({ children }) => {
  const [adminData, setAdminData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isImageUpdating, setIsImageUpdating] = useState(false);

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/admin/getAdmin", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdminData(response.data);
    } catch (error) {
      console.error("Error fetching admin profile:", error);
      toast.error("Failed to load admin profile.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const updateProfileImage = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsImageUpdating(true);
    try {
      const base64Image = await convertToBase64(file);
      const token = localStorage.getItem("token");

      const response = await axios.put(
        "http://localhost:5000/admin/updateProfileImg",
        { profileImg: base64Image },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success(response.data.message || "Image updated successfully!");

      if (response.data.admin) {
        setAdminData(response.data.admin);
      } else {
        fetchAdminData();
      }
    } catch (error) {
      console.error("Error updating image:", error);
      toast.error("Failed to update image.");
    } finally {
      setIsImageUpdating(false);
    }
  };

  const removeProfileImage = async () => {
    setIsImageUpdating(true);
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        "http://localhost:5000/admin/updateProfileImg",
        { profileImg: null },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success("Image removed successfully!");

      setAdminData((prev) => ({ ...prev, profileImg: "" }));
    } catch (error) {
      console.error("Error removing image:", error);
      toast.error("Failed to remove image.");
    } finally {
      setIsImageUpdating(false);
    }
  };

  return (
    <AdminProfileContext.Provider
      value={{
        adminData,
        isLoading,
        isImageUpdating,
        updateProfileImage,
        removeProfileImage,
      }}
    >
      {children}
    </AdminProfileContext.Provider>
  );
};

export const useAdminProfile = () => useContext(AdminProfileContext);
