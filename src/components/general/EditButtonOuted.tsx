import { ModeEdit } from "@mui/icons-material";
import { Button, ButtonProps, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslations } from "next-intl";
import { ReactElement } from "react";

export function EditButtonOuted(props: ButtonProps): ReactElement {
  const theme = useTheme();
  const lg = useMediaQuery(theme.breakpoints.up("lg"));
  const t = useTranslations();
  return (
    <Button
      {...props}
      sx={{
        color: "#048014",
        width: lg ? "120px" : "auto",
      }}
      startIcon={lg && <ModeEdit />}
    >
      {lg && t("commons.edit")}
      {!lg && <ModeEdit />}
    </Button>
  );
}
