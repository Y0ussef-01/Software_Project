import { useState, useEffect, useRef } from "react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";

export const useTeacherProfile = () => {
  const [teacherData, setTeacherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isImageUpdating, setIsImageUpdating] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axiosInstance.get("/teacher/profile");
        setTeacherData(response.data);
      } catch (error) {
        toast.error("Failed to load teacher profile data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageClick = () => {
    if (!isImageUpdating && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setIsImageUpdating(true);
      const base64Image = await convertToBase64(file);

      const response = await axiosInstance.put("/teacher/update-profile-img", {
        profileImg: base64Image,
      });

      
      setTeacherData(response.data.Teacher);
      toast.success("Profile image updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile image.");
    } finally {
      setIsImageUpdating(false);
      if (fileInputRef.current) fileInputRef.current.value = "";    
    }
  };

  const handleRemoveImage = async (e) => {
    e.stopPropagation();
    try {
      setIsImageUpdating(true);
      const response = await axiosInstance.put("/teacher/update-profile-img", {
        profileImg: "default-teacher.jpg", 
      });

      setTeacherData(response.data.Teacher);
      toast.success("Profile image removed successfully!");
    } catch (error) {
      toast.error("Failed to remove profile image.");
    } finally {
      setIsImageUpdating(false);
    }
  };

  return {
    teacherData,
    loading,
    isImageUpdating,
    fileInputRef,
    handleImageClick,
    handleImageChange,
    handleRemoveImage,
  };
};
