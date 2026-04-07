import { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";

export const useHeader = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { language, toggleLanguage } = useLanguage();

  const open = Boolean(anchorEl);

  const handleLanguageClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectLanguage = (lang) => {
    toggleLanguage(lang);
    handleClose();
  };

  const displayLanguage = language === "ar" ? "Ar" : "En";

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
    displayLanguage,
    handleLanguageClick,
    handleClose,
    handleSelectLanguage,
    interactiveStyles,
  };
};
