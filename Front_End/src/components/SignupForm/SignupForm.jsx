import React, { useState } from "react";
import { Box, Paper, Typography, OutlinedInput, InputAdornment, IconButton, Button, Stack, Alert, CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { useSignupForm } from "../../hooks/useSignupForm.js";

export default function SignupForm() {
    const { userId, setUserId, name, setName, password, setPassword, error, loading, handleSignup } = useSignupForm();
    const [showPassword, setShowPassword] = useState(false);

    const isSubmitDisabled = userId.trim() === "" || name.trim() === "" || password.trim() === "" || loading;

    return (
        <Paper
            elevation={3}
            component="form"
            onSubmit={handleSignup}
            sx={{ p: { xs: 3, sm: 4, md: 5 }, borderRadius: "16px", display: "flex", flexDirection: "column", justifyContent: "center" }}
        >
            <Box sx={{ textAlign: "center", mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "#063f6d", mb: 1 }}>
                    Create an account
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Sign up to get started
                </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3, borderRadius: "10px" }}>{error}</Alert>}

            <Stack spacing={3}>
                <OutlinedInput
                    fullWidth
                    placeholder="User ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    disabled={loading}
                    startAdornment={<InputAdornment position="start"><BadgeOutlinedIcon /></InputAdornment>}
                    sx={{ borderRadius: "12px", height: "55px" }}
                />
                <OutlinedInput
                    fullWidth
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                    startAdornment={<InputAdornment position="start"><PersonOutlineIcon /></InputAdornment>}
                    sx={{ borderRadius: "12px", height: "55px" }}
                />
                <OutlinedInput
                    fullWidth
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    startAdornment={<InputAdornment position="start"><LockOutlinedIcon /></InputAdornment>}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword((p) => !p)} edge="end">
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    }
                    sx={{ borderRadius: "12px", height: "55px" }}
                />
            </Stack>

            <Box sx={{ mt: 4 }}>
                <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    disabled={isSubmitDisabled}
                    sx={{ py: 1.5, borderRadius: "12px", backgroundColor: isSubmitDisabled ? "action.disabledBackground" : "#152b48", "&:hover": { backgroundColor: "#0f1f35" } }}
                >
                    {loading ? <CircularProgress size={26} color="inherit" /> : "Sign Up"}
                </Button>
                <Typography sx={{ textAlign: "center", mt: 2 }}>
                    Already have an account? <Link to="/">Login</Link>
                </Typography>
            </Box>
        </Paper>
    );
}