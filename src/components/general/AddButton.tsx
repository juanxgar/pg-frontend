import { Add } from "@mui/icons-material";
import { Box, Button, ButtonProps } from "@mui/material";
import { useTranslations } from "next-intl";
import { ReactElement } from "react";

export function AddButton(props: ButtonProps): ReactElement {
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
        type="button"
        sx={{
          width: { lg: "50px", xs: "50px" },
          marginTop: { lg: "10px", xs: "0px" },
          marginRight: "10px",
        }}
      >
        <Add />
      </Button>
    </Box>
  );
}
