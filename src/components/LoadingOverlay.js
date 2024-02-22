import React from "react";
import { CircularProgress } from "@mui/material";
const styles = {
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    backgroundColor: "rgba(255,255,255,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};

const LoadingOverlay = () => {
  return (
    <div style={styles.loadingOverlay}>
      <CircularProgress size={40} thickness={5} />
    </div>
  );
};

export default LoadingOverlay;
