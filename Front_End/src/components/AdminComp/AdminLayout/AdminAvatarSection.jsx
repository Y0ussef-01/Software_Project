import React, { useRef, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Tooltip,
  CircularProgress,
  Button,
  useTheme,
} from "@mui/material";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

/**
 * @param {string} variant
 * @param {boolean} isCollapsed
 */
export default function AdminAvatarSection({
  variant = "profile",
  isCollapsed = false,
}) {
  const theme = useTheme();
  const fileInputRef = useRef(null);
  const [isImageUpdating, setIsImageUpdating] = useState(false);

  const [adminData, setAdminData] = useState({
    name: "Anishtain Admin",
    role: "Super Admin",
    profileImg: "",
  });

  const isProfile = variant === "profile";

  const handleCameraClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsImageUpdating(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setTimeout(() => {
          setAdminData((prev) => ({ ...prev, profileImg: reader.result }));
          setIsImageUpdating(false);
        }, 1500);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setIsImageUpdating(true);
    setTimeout(() => {
      setAdminData((prev) => ({ ...prev, profileImg: "" }));
      setIsImageUpdating(false);
    }, 1000);
  };

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
            src={adminData.profileImg}
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
            {!adminData.profileImg && adminData.name.charAt(0)}
          </Avatar>

          {isImageUpdating && (
            <CircularProgress
              size={isProfile ? 50 : 30}
              sx={{
                position: "absolute",
                color: theme.palette.primary.main,
              }}
            />
          )}
        </Box>

        {isProfile && (
          <>
            {adminData.profileImg && !isImageUpdating && (
              <Tooltip title="Remove photo" placement="left">
                <IconButton
                  onClick={handleRemoveImage}
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
              title={adminData.profileImg ? "Change photo" : "Upload photo"}
              placement="right"
            >
              <IconButton
                onClick={handleCameraClick}
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
              onChange={handleImageChange}
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
            {adminData.name}
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
            {adminData.role}
          </Typography>
        </>
      )}

      {isProfile && (
        <Button
          variant="outlined"
          startIcon={<EditOutlinedIcon />}
          size="small"
          sx={{
            mt: 2,
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 700,
            px: { xs: 2, md: 3 },
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
            borderWidth: "2px",
            borderColor: theme.palette.divider,
            color: theme.palette.text.primary,
            "&:hover": {
              borderWidth: "2px",
              borderColor: theme.palette.primary.main,
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          Edit Profile
        </Button>
      )}
    </Box>
  );
}
