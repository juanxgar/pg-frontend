import { Add, Save } from "@mui/icons-material";
import { Box, Button, ButtonProps } from "@mui/material";
import { useTranslations } from "next-intl";
import { ReactElement } from "react";

export function SaveButton(props: ButtonProps): ReactElement {
  const t = useTranslations();

  return (
    <Box
      sx={{
        float: "right",
      }}
    >
      <Button
        {...props}
        variant="contained"
        color="success"
        type="submit"
        startIcon={<Save />}
        sx={{
          width: { lg: "180px", xs: "100px" },
          marginTop: { lg: "10px", xs: "0px" },
        }}
      >
        {t("commons.save")}
      </Button>
    </Box>
  );
}
