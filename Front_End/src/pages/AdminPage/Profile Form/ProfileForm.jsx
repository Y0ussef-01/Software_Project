import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  useTheme,
  Grid,
  Alert,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

// ============================================================
// 📋 نموذج تعديل البيانات الشخصية - Profile Form
// ============================================================
const ProfileForm = () => {
  const theme = useTheme();

  // 💾 البيانات الأولية للمستخدم
  const initialData = {
    fullName: "Anishtain",
    email: "anishtain@example.com",
    phone: "+20 123 456 7890",
    role: "Admin",
    department: "Administration",
    password: "••••••••",
  };

  // 📝 State لحفظ القيم المتغيرة - تحميل من localStorage
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem("userProfileData");
    if (savedData) {
      return { ...initialData, ...JSON.parse(savedData) };
    }
    return initialData;
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  // 🎯 معالج تغيير القيم
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setSaveSuccess(false);
  };

  // 💾 معالج الحفظ - حفظ دائم في localStorage
  const handleSave = () => {
    // حفظ البيانات في localStorage
    localStorage.setItem("userProfileData", JSON.stringify(formData));
    console.log("✅ تم حفظ البيانات:", formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // ↩️ معالج الإلغاء
  const handleCancel = () => {
    const savedData = localStorage.getItem("userProfileData");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    } else {
      setFormData(initialData);
    }
    setSaveSuccess(false);
  };

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
      {/* 📋 بطاقة النموذج */}
      <Card
        sx={{
          maxWidth: 600,
          width: "100%",
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        {/* 🎨 رأس النموذج */}
        <Box
          sx={{
            padding: 3,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "white",
              textAlign: "center",
            }}
          >
            ✏️ تعديل البيانات الشخصية
          </Typography>
        </Box>

        {/* 📝 محتوى النموذج */}
        <CardContent sx={{ padding: 3 }}>
          {/* رسالة النجاح */}
          {saveSuccess && (
            <Alert severity="success" sx={{ marginBottom: 2 }}>
              تم حفظ البيانات بنجاح ✅
            </Alert>
          )}

          {/* شبكة الحقول */}
          <Grid container spacing={2}>
            {/* اسم المستخدم */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="الاسم الكامل"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
              />
            </Grid>

            {/* البريد الإلكتروني */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="البريد الإلكتروني"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>

            {/* رقم الهاتف */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="رقم الهاتف"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>

            {/* الدور */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="الدور"
                name="role"
                value={formData.role}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>

            {/* القسم */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="القسم"
                name="department"
                value={formData.department}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>

            {/* كلمة المرور */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="كلمة المرور"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
          </Grid>

          {/* أزرار التحكم */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              marginTop: 3,
              justifyContent: "center",
            }}
          >
            {/* زر الحفظ */}
            <Button
              variant="contained"
              color="success"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              sx={{
                padding: "10px 30px",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              حفظ
            </Button>

            {/* زر الإلغاء */}
            <Button
              variant="outlined"
              color="error"
              startIcon={<CancelIcon />}
              onClick={handleCancel}
              sx={{
                padding: "10px 30px",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              إلغاء
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProfileForm;