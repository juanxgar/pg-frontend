import { Box, Grid, Skeleton } from "@mui/material";
import { ReactElement } from "react";

export function FormSkeleton(): ReactElement {
  return (
    <Grid
      container
      sx={{
        maxHeight: "98vh",
        alignItems: "center",
      }}
    >
      <Grid item xs={12}>
        <Box
          sx={{
            direction: "column",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
          }}
        >
          <Skeleton
            variant="rounded"
            width="60%"
            height={30}
            sx={{ marginBottom: "10px" }}
          />
        </Box>

        <Skeleton
          variant="rounded"
          width="100%"
          height={60}
          sx={{ marginBottom: "10px" }}
        />
        <Skeleton
          variant="rounded"
          width="100%"
          height={60}
          sx={{ marginBottom: "10px" }}
        />
        <Skeleton variant="rounded" width="40%" height={20} />
        <Box
          sx={{
            width: "40%",
            marginTop: "30px",
            float: "right",
          }}
        >
          <Skeleton variant="rounded" width="100%" height={40} />
        </Box>
      </Grid>
    </Grid>
  );
}
