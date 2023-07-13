import { LinearProgress } from "@mui/material";
import React from "react";

export default function LinearProgressComponent() {
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
