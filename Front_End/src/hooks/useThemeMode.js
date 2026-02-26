import React from "react";

export const useThemeMode = () => {
  const [mode, setMode] = React.useState(
    localStorage.getItem("CurrentMode")
      ? localStorage.getItem("CurrentMode")
      : "light"
  );

  const toggleTheme = (newMode) => {
    setMode(newMode);
    localStorage.setItem("CurrentMode", newMode);
  };

  return { mode, setMode: toggleTheme };
};
