import { Box, Grid, Skeleton } from "@mui/material";
import { ReactElement } from "react";

interface Props {
  lg: boolean;
}
export function LogoSkeleton(props: Props): ReactElement {
  const { lg } = props;
  return (
    <Grid
      container
      style={{
        maxWidth: "100%",
        height: "auto",
        padding: 0,
        margin: 0,
      }}
    >
      <Grid item xs={4} sx={{ marginTop: { lg: "0px", xs: "40px" } }}>
        <Box
          sx={{
            direction: "column",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
          }}
        >
          <Skeleton
            variant="circular"
            width={lg ? 200 : 100}
            height={lg ? 160 : 100}
            sx={{ marginLeft: { lg: "50px", xs: "0px" } }}
          />
        </Box>
      </Grid>
      <Grid item xs={8} marginTop={"30px"}>
        <Skeleton
          variant="rounded"
          width="100%"
          height={30}
          sx={{ marginBottom: "10px" }}
        />
        <Skeleton variant="rounded" width="100%" height={50} />
        <Skeleton
          variant="rounded"
          width="100%"
          height={30}
          sx={{ marginTop: "10px" }}
        />
      </Grid>
    </Grid>
  );
}
