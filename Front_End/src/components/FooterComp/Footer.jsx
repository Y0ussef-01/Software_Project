import React from "react";
import { Box, Container, Stack, Typography, Link } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#152b48", // نفس لون الخلفية الأساسية بالظبط
        borderRadius: 0, // لغينا أي كيرفات من هنا لأن الأبيض هو اللي مقصوص
        py: 3,
        mt: "auto",
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Typography variant="body2" sx={{ color: "#fff", opacity: 0.8 }}>
            © 2026 Cairo University. All rights reserved.
          </Typography>

          <Stack direction="row" spacing={3}>
            <Link
              href="#"
              underline="hover"
              sx={{ color: "#fff", fontSize: "0.875rem" }}
            >
              Academic Calendar
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
