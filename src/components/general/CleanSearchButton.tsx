import { ClearAll } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useTranslations } from "next-intl";
import { ReactElement } from "react";

interface Props {
  clearFunction: () => void;
}
export function CleanSearchButton(props: Props): ReactElement {
  const { clearFunction } = props;

  const t = useTranslations();

  return (
    <Button
      variant="contained"
      type="submit"
      color="inherit"
      startIcon={<ClearAll />}
      sx={{
        width: { lg: "180px", xs: "150px" },
        marginLeft: "10px",
        backgroundColor: "#EEEEEE",
        color: "black",
        "&:hover": {
          backgroundColor: "#E6E6E6",
        },
      }}
      onClick={clearFunction}
    >
      {t("commons.clear")}
    </Button>
  );
}
