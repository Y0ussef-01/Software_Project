import React from "react";

export const useDrawerState = () => {
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return { open, handleDrawerOpen, handleDrawerClose };
};
