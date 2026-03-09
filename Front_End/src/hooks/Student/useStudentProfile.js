import { useState, useEffect, useRef } from "react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";

export const useProfile = () => {
  const encodeData = (data) =>
    btoa(unescape(encodeURIComponent(JSON.stringify(data))));
  const decodeData = (encoded) => {
    try {
      return JSON.parse(decodeURIComponent(escape(atob(encoded))));
    } catch (e) {
      return null;
    }
  };

  const [studentData, setStudentData] = useState(() => {
    const cachedEncoded = sessionStorage.getItem("user_data");
    return cachedEncoded ? decodeData(cachedEncoded) : null;
  });

  const [loading, setLoading] = useState(!sessionStorage.getItem("user_data"));
  const [isImageUpdating, setIsImageUpdating] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axiosInstance.get("/student/Profile");
        const freshData = response.data;
        setStudentData(freshData);
        sessionStorage.setItem("user_data", encodeData(freshData));
      } catch (error) {
        if (!studentData) toast.error("Failed to load profile data.");
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
    if (!isImageUpdating && fileInputRef.current) fileInputRef.current.click();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      setIsImageUpdating(true);
      const base64Image = await convertToBase64(file);
      const response = await axiosInstance.put("/student/updateProfileImg", {
        profileImg: base64Image,
      });
      const updatedData = response.data.student;
      setStudentData(updatedData);
      sessionStorage.setItem("user_data", encodeData(updatedData));
      toast.success("Profile image updated!");
    } catch (error) {
      toast.error("Failed to update image.");
    } finally {
      setIsImageUpdating(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = async (e) => {
    e.stopPropagation();
    try {
      setIsImageUpdating(true);
      const response = await axiosInstance.put("/student/updateProfileImg", {
        profileImg: "default-student.jpg",
      });
      const updatedData = response.data.student;
      setStudentData(updatedData);
      sessionStorage.setItem("user_data", encodeData(updatedData));
      toast.success("Image removed!");
    } catch (error) {
      toast.error("Failed to remove image.");
    } finally {
      setIsImageUpdating(false);
    }
  };

  return {
    studentData,
    loading,
    isImageUpdating,
    fileInputRef,
    handleImageClick,
    handleImageChange,
    handleRemoveImage,
  };
};
