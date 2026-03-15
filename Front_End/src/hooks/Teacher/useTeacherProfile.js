import { useState, useEffect, useRef } from "react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";

export const useTeacherProfile = () => {
  const encodeData = (data) =>
    btoa(unescape(encodeURIComponent(JSON.stringify(data))));

  const decodeData = (encoded) => {
    if (!encoded) return null;
    try {
      return JSON.parse(decodeURIComponent(escape(atob(encoded))));
    } catch (e) {
      return null;
    }
  };

  const [teacherData, setTeacherData] = useState(() =>
    decodeData(sessionStorage.getItem("teacher_profile_data")),
  );

  const [loading, setLoading] = useState(!teacherData);
  const [isImageUpdating, setIsImageUpdating] = useState(false);
  const fileInputRef = useRef(null);

  const fetchProfileData = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const response = await axiosInstance.get("/teacher/profile");
      const data = response.data?.Teacher || response.data;

      setTeacherData(data);
      sessionStorage.setItem("teacher_profile_data", encodeData(data));
    } catch (error) {
      if (!teacherData) {
        toast.error("Failed to load teacher profile data. Please try again.");
      }
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData(!teacherData);
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

      const updatedData = response.data.Teacher || response.data;

      setTeacherData(updatedData);
      sessionStorage.setItem("teacher_profile_data", encodeData(updatedData));

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

      const updatedData = response.data.Teacher || response.data;

      setTeacherData(updatedData);
      sessionStorage.setItem("teacher_profile_data", encodeData(updatedData));

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
