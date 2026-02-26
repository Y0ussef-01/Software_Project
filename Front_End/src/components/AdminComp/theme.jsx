export const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          // palette values for light mode
          //تكتب هنا اكواد الليت مود لو انت عاوز تعدل في الوان الموقع بتاعك
        }
      : {
          // palette values for dark mode
          //ده لو عاوز تعدل في الالوان بتاعت الدارك مود بتاعك
        }),
  },
});
