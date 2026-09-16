import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";

export const useSignupForm = () => {
    const [userId, setUserId] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();

    const validateForm = () => {
        setError("");
        if (!userId.trim() || !name.trim() || !password.trim()) {
            setError("Please fill in all fields.");
            return false;
        }
        return true;
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);

        try {
            const response = await axiosInstance.post("/auth/signup", {
                id: userId,
                name,
                password,
            });

            const { user, token, role } = response.data;

            toast.success(`Account created! Welcome ${user?.name || ""}`, {
                position: "top-right",
                autoClose: 2000,
            });

            setTimeout(() => {
                login(user, token, role);
            }, 1500);
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.message || "Server Error. Please try again later.");
        }
    };

    return { userId, setUserId, name, setName, password, setPassword, error, loading, handleSignup };
};