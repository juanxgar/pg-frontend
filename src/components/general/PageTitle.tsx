import { Typography } from "@mui/material";
import { ReactElement, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}
export function PageTitle(props: Props): ReactElement {
  const { children } = props;
  return (
    <Typography variant="h4" fontWeight="500" color="#048014">
      {children}
    </Typography>
  );
}
