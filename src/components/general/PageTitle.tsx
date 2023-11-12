import { Typography, useMediaQuery } from "@mui/material";
import { ReactElement, ReactNode } from "react";
import { Theme, useTheme } from "@mui/material/styles";

interface Props {
  children?: ReactNode;
}
export function PageTitle(props: Props): ReactElement {
  const { children } = props;
  const theme: Theme = useTheme();
  const lg: boolean = useMediaQuery(theme.breakpoints.up("lg"));
  return (
    <Typography
      variant="h4"
      fontWeight="500"
      color="#048014"
      align={lg ? "right" : "left"}
    >
      {children}
    </Typography>
  );
}
