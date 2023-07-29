import { Alert, AlertColor, Snackbar } from "@mui/material";
import React, { ReactElement } from "react";

interface Props {
  open: boolean;
  handleClose: () => void;
  severity: AlertColor;
  message: string;
}
export function SnackbarComponent(props: Props): ReactElement {
  const { handleClose, message, open, severity } = props;
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: "300%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
