import { useState } from "react";

export const useHeader = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [language, setLanguage] = useState("En");

  const open = Boolean(anchorEl);

  const handleLanguageClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectLanguage = (lang) => {
    setLanguage(lang);
    handleClose();
  };

  const interactiveStyles = {
    transition: "all 0.3s ease-in-out",
    borderRadius: "8px",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.08)",
    },
  };

  return {
    anchorEl,
    open,
    language,
    handleLanguageClick,
    handleClose,
    handleSelectLanguage,
    interactiveStyles,
  };
};
