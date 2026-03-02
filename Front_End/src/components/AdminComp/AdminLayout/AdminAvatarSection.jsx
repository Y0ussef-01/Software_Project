import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Tooltip,
  CircularProgress,
  useTheme,
} from "@mui/material";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { useAdminProfile } from "../../../context/Admin/AdminProfileContext";

export default function AdminAvatarSection({
  variant = "profile",
  isCollapsed = false,
}) {
  const theme = useTheme();
  const fileInputRef = useRef(null);

  const { adminData, isImageUpdating, updateProfileImage, removeProfileImage } =
    useAdminProfile();

  const isProfile = variant === "profile";

  const name = adminData?.name || "Loading...";
  const role = adminData?.role || "Super Admin";
  const profileImg = adminData?.profileImg || "";

  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [profileImg]);

  const isStringValid =
    profileImg &&
    typeof profileImg === "string" &&
    profileImg.trim() !== "" &&
    profileImg !== "null" &&
    profileImg !== "undefined" &&
    !profileImg.endsWith("/null") &&
    !profileImg.endsWith("/undefined");

  const isValid = isStringValid && !imageError;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: isProfile ? { xs: 0, md: -5 } : 0,
        mb: isProfile ? 0 : 2,
        transition: "0.3s ease",
      }}
    >
      <Box sx={{ position: "relative", display: "inline-block" }}>
        <Box
          sx={{
            position: "relative",
            borderRadius: "50%",
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Avatar
            src={isValid ? profileImg : ""}
            imgProps={{
              onError: () => {
                setImageError(true);
              },
            }}
            sx={{
              width: isProfile
                ? { xs: 100, sm: 120, md: 150 }
                : isCollapsed
                  ? 40
                  : 80,
              height: isProfile
                ? { xs: 100, sm: 120, md: 150 }
                : isCollapsed
                  ? 40
                  : 80,
              border: isProfile
                ? `5px solid ${theme.palette.background.paper}`
                : "none",
              boxShadow: isProfile ? "0px 10px 25px rgba(0,0,0,0.15)" : "none",
              fontSize: isProfile
                ? { xs: "2.5rem", sm: "3rem", md: "4rem" }
                : isCollapsed
                  ? "1.2rem"
                  : "2.5rem",
              backgroundColor: theme.palette.primary.main,
              color: "#fff",
              opacity: isImageUpdating ? 0.5 : 1,
              transition: "all 0.3s ease",
            }}
          >
            {!isValid && name.charAt(0)}
          </Avatar>

          {isImageUpdating && (
            <CircularProgress
              size={isProfile ? 50 : 30}
              sx={{ position: "absolute", color: theme.palette.primary.main }}
            />
          )}
        </Box>

        {isProfile && (
          <>
            {isValid && !isImageUpdating && (
              <Tooltip title="Remove photo" placement="left">
                <IconButton
                  onClick={removeProfileImage}
                  size="small"
                  sx={{
                    position: "absolute",
                    bottom: 5,
                    left: 0,
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.error.main,
                    boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
                    "&:hover": {
                      backgroundColor: theme.palette.error.light,
                      color: "#fff",
                    },
                  }}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            <Tooltip
              title={isValid ? "Change photo" : "Upload photo"}
              placement="right"
            >
              <IconButton
                onClick={() => fileInputRef.current?.click()}
                disabled={isImageUpdating}
                size="small"
                sx={{
                  position: "absolute",
                  bottom: 10,
                  right: 0,
                  backgroundColor: theme.palette.background.paper,
                  color: theme.palette.primary.main,
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
                  "&:hover": { backgroundColor: theme.palette.action.hover },
                }}
              >
                <CameraAltOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={updateProfileImage}
              style={{ display: "none" }}
            />
          </>
        )}
      </Box>

      {(!isCollapsed || isProfile) && (
        <>
          <Typography
            variant={isProfile ? "h6" : "h6"}
            sx={{
              fontWeight: isProfile ? "900" : "600",
              color: theme.palette.text.primary,
              mt: isProfile ? 2 : 1,
              textAlign: "center",
              fontSize: isProfile
                ? { xs: "1.1rem", sm: "1.25rem", md: "1.5rem" }
                : "16px",
              transition: "all 0.3s ease",
            }}
          >
            {name}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: isProfile
                ? theme.palette.text.secondary
                : theme.palette.primary.main,
              fontWeight: isProfile ? 700 : 500,
              fontSize: isProfile
                ? { xs: "0.8rem", sm: "0.875rem", md: "1rem" }
                : "13px",
              transition: "all 0.3s ease",
            }}
          >
            {role}
          </Typography>
        </>
      )}
    </Box>
  );
}
