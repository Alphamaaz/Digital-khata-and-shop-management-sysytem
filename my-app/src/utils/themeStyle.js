export const getThemeStyles = (theme) => ({
  backgroundColor: theme === "light" ? "#fff" : "#2B2B2B",
  textColor: theme === "light" ? "#000" : "#FFFFFF",
  borderColor:
    theme === "light" ? "rgba(0, 0, 0, 0.2)" : "rgba(255, 255, 255, 0.2)",
  iconFilter:
    theme === "light" ? "invert(0) brightness(0.5)" : "invert(1) brightness(2)",
  headBgColor: theme === "light" ? "rgb(223, 242, 225)" : "#3A3F44",
  containerBgColor: theme === "light" ? "rgb(247, 243, 233)" : "#1E1E1E",
});
