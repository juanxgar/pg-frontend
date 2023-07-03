import { Alert, AlertColor, Snackbar } from "@mui/material";
import React from "react";

export default function SnackbarComponent({
  open,
  handleClose,
  severity,
  message,
}: {
  open: any;
  handleClose: any;
  severity: AlertColor;
  message: string;
}) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        sx={{ width: "300%"}}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
