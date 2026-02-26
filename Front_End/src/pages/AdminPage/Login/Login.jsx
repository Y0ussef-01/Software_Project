

/*import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Container,
} from "@mui/material";
import { adminLogin } from "../../api/apiClient";
import LockIcon from "@mui/icons-material/Lock";

const Login = () => {
  const navigate = useNavigate();

  const [id, setId] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(""); 

  
  const handleLogin = async (e) => {
    e.preventDefault(); 
    setError(""); 

    
    if (!id || !password) {
      setError("من فضلك أدخل ID والـ Password");
      return;
    }

    setLoading(true); 

    try {
      
      const response = await adminLogin(id, password);

      
      localStorage.setItem("adminToken", response.token); 
      localStorage.setItem("adminUser", JSON.stringify(response.user)); 
      localStorage.setItem("adminRole", response.role); 

      
      navigate("/");
    } catch (err) {
      
      setError(err.message || "فشل تسجيل الدخول. تحقق من البيانات.");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Card
          sx={{
            width: "100%",
            padding: 4,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 3,
            }}
          >
            <LockIcon sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              Admin Login
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              سجل الدخول للوصول لـ Dashboard
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLogin}>
            
            <TextField
              fullWidth
              label="Admin ID"
              placeholder="ادخل رقم الـ Admin"
              value={id}
              onChange={(e) => setId(e.target.value)}
              variant="outlined"
              margin="normal"
              disabled={loading}
            />

        
            <TextField
              fullWidth
              label="Password"
              type="password"
              placeholder="ادخل كلمة السر"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              margin="normal"
              disabled={loading}
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
              onClick={handleLogin}
            >
              {loading ? <CircularProgress size={24} /> : "تسجيل الدخول"}
            </Button>
          </Box>

          
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ textAlign: "center", display: "block", mt: 2 }}
          >
            البيانات محفوظة في الـ Backend
          </Typography>
        </Card>
      </Box>
    </Container>
  );
};

export default Login;*/
