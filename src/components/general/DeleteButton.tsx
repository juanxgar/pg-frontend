import { Delete } from "@mui/icons-material";
import { Button, ButtonProps, Theme, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslations } from "next-intl";
import { ReactElement } from "react";

export default function DeleteButton(props: ButtonProps): ReactElement {
  const t = useTranslations();
  const theme: Theme = useTheme();
  const lg: boolean = useMediaQuery(theme.breakpoints.up("lg"));
  return (
    <Button
      {...props}
      sx={{
        color: "#f44336",
        width: { lg: "120px", xs: "auto" },
      }}
      startIcon={lg && <Delete />}
    >
      {lg && t("commons.delete")}
      {!lg && <Delete />}
    </Button>
  );
}
