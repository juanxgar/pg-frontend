import { ArrowBack } from "@mui/icons-material";
import { Button, ButtonProps, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslations } from "next-intl";
import { ReactElement } from "react";

export function BackButton(props: ButtonProps): ReactElement {
  const theme = useTheme();
  const lg = useMediaQuery(theme.breakpoints.up("lg"));
  const t = useTranslations();
  return (
    <Button
      {...props}
      sx={{
        width: { lg: "180px", xs: "150px" },
        marginLeft: "10px",
        backgroundColor: "#EEEEEE",
        color: "black",
        "&:hover": {
          backgroundColor: "#E6E6E6",
        },
      }}
      startIcon={<ArrowBack />}
    >
      {t("commons.back")}
    </Button>
  );
}
