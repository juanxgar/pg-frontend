"use client";

import { Search } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useTranslations } from "next-intl";
import { ReactElement } from "react";

export default function SearchButton(): ReactElement {
  const t = useTranslations();
  return (
    <Button
      variant="contained"
      color="success"
      type="submit"
      startIcon={<Search />}
      sx={{ width: { lg: "180px", xs: "150px" } }}
    >
      {t("commons.search")}
    </Button>
  );
}
