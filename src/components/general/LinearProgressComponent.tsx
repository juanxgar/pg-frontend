import { LinearProgress } from "@mui/material";
import React, { ReactElement } from "react";

export function LinearProgressComponent(): ReactElement {
  return (
    <>
      <LinearProgress
        sx={{
          background: "#82C08A",
          "& .MuiLinearProgress-bar": {
            backgroundColor: "green",
          },
        }}
      />
    </>
  );
}
