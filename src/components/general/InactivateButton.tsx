import { ToggleOff, ToggleOn } from "@mui/icons-material";
import { Button, ButtonProps, Theme, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ReactElement } from "react";

interface Props {
  state?: boolean;
  buttonProps: ButtonProps;
}
export default function InactivateButton(props: Props): ReactElement {
  const theme: Theme = useTheme();
  const lg: boolean = useMediaQuery(theme.breakpoints.up("lg"));
  const { state, buttonProps } = props;
  return (
    <Button
      {...buttonProps}
      sx={{
        color: state ? "#f44336" : "#048014",
        width: { lg: "120px", xs: "auto" },
      }}
      startIcon={lg && (state ? <ToggleOff /> : <ToggleOn />)}
    >
      {lg && (state ? "Inhabilitar" : "Habilitar")}
      {!lg && (state ? <ToggleOff /> : <ToggleOn />)}
    </Button>
  );
}
