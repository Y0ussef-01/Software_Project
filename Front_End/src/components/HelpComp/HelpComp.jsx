import React from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
  Divider,
} from "@mui/material";
import { useHelp } from "./useHelp";

const HelpComp = () => {
  const { helpData } = useHelp();

  return (
    <Box
      sx={{
        backgroundColor: "#f4f6f8",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 149px)",
        padding: "20px",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: "900px" }}>
        <Typography
          variant="h4"
          sx={{ mb: 3, fontWeight: "bold", color: "#333" }}
        >
          Help
        </Typography>

        <Paper
          elevation={0}
          sx={{
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.05)",
          }}
        >
          <List sx={{ p: 0 }}>
            {helpData.map((item, index) => (
              <React.Fragment key={item.id}>
                <ListItem
                  sx={{
                    px: 3,
                    display: "flex",
                    justifyContent: "space-between",
                    "&:hover": { bgcolor: "#eef0f2" },
                  }}
                >
                  <ListItemText
                    primary={item.title}
                    slotProps={{
                      primary: {
                        sx: {
                          color: "#04365f",
                          fontWeight: 500,
                          fontSize: "1.1rem",
                          p: "13px 0px",
                        },
                      },
                    }}
                  />

                  <Button
                    variant="outlined"
                    sx={{
                      textTransform: "none",
                      borderRadius: "8px",
                      borderColor: "#ccc",
                      color: "#555",
                      px: 3,
                      boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    Show Video
                  </Button>
                </ListItem>

                {index < helpData.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Box>
    </Box>
  );
};

export default HelpComp;
