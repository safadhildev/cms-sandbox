import React from "react";
import { Alert as MuiAlert, Snackbar } from "@mui/material";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Toast = ({ open, onClose, message, severity }) => {
  return (
    <Snackbar
      open={open}
      anchorOrigin={{ horizontal: "center", vertical: "top" }}
      autoHideDuration={3000}
      onClose={onClose}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Toast;
