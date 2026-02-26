import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Avatar,
  Typography,
  useTheme,
  Divider,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BadgeIcon from "@mui/icons-material/Badge";
import ImageIcon from "@mui/icons-material/Image";
import LockIcon from "@mui/icons-material/Lock";
import WorkIcon from "@mui/icons-material/Work";


// eslint-disable-next-line no-unused-vars
const DataRow = ({ icon: Icon, label, value, theme }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 2,
      padding: "12px 0",
      borderBottom: `1px solid ${theme.palette.divider}`,
      "&:last-child": {
        borderBottom: "none",
      },
    }}
  >
    <Icon sx={{ color: theme.palette.primary.main, fontSize: 24 }} />
    <Box sx={{ flex: 1 }}>
      <Typography
        variant="caption"
        sx={{ color: theme.palette.text.secondary, display: "block" }}
      >
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontWeight: 600,
          color: theme.palette.text.primary,
          marginTop: "4px",
        }}
      >
        {value}
      </Typography>
    </Box>
  </Box>
);


const Profile = () => {
  const theme = useTheme();

  const defaultUserData = {
    name: "Anishtain",
    email: "anishtain@example.com",
    phone: "+20 123 456 7890",
    role: "Admin",
    profileImage:
      "https://ichef.bbci.co.uk/ace/ws/640/amz/worldservice/live/assets/images/2016/02/12/160212210518_624x351_3.jpg.webp",
    password: "••••••••",
    department: "Administration",
  };

 
  // eslint-disable-next-line no-unused-vars
  const [userData, setUserData] = useState(() => {
    const savedData = localStorage.getItem("userProfileData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      return {
        name: parsedData.fullName || defaultUserData.name,
        email: parsedData.email || defaultUserData.email,
        phone: parsedData.phone || defaultUserData.phone,
        role: parsedData.role || defaultUserData.role,
        profileImage: defaultUserData.profileImage,
        password: parsedData.password || defaultUserData.password,
        department: parsedData.department || defaultUserData.department,
      };
    }
    return defaultUserData;
  });

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        minHeight: "100vh",
        padding: 3,
        backgroundColor: theme.palette.background.default,
        paddingTop: 4,
      }}
    >
      <Card
        sx={{
          maxWidth: 500,
          width: "100%",
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            padding: 3,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          }}
        >
          <Avatar
            sx={{
              width: 150,
              height: 150,
              border: `5px solid ${theme.palette.background.paper}`,
              boxShadow: 4,
            }}
            alt={userData.name}
            src={userData.profileImage}
          />
        </Box>

        <CardContent sx={{ padding: 3 }}>
          <Typography
            variant="h5"
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              marginBottom: 1,
              color: theme.palette.text.primary,
            }}
          >
            {userData.name}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              textAlign: "center",
              color: theme.palette.info.main,
              marginBottom: 2,
              fontWeight: 600,
            }}
          >
            {userData.role}
          </Typography>

          <Divider sx={{ marginBottom: 2 }} />

          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <DataRow
              icon={PersonIcon}
              label="🧑‍💼 Full Name"
              value={userData.name}
              theme={theme}
            />

            <DataRow
              icon={EmailIcon}
              label="📧 Email"
              value={userData.email}
              theme={theme}
            />

            <DataRow
              icon={PhoneIcon}
              label="📱 Phone"
              value={userData.phone}
              theme={theme}
            />

            <DataRow
              icon={BadgeIcon}
              label="🏷 Role"
              value={userData.role}
              theme={theme}
            />

            <DataRow
              icon={ImageIcon}
              label="🖼 Profile Image"
              value="Uploaded"
              theme={theme}
            />

            <DataRow
              icon={LockIcon}
              label="🔑 Password"
              value={userData.password}
              theme={theme}
            />

            <DataRow
              icon={WorkIcon}
              label="Department"
              value={userData.department}
              theme={theme}
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;
