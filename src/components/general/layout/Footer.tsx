"use client";
import { Typography, Link as LinkMaterial } from "@mui/material";
import { useTranslations } from "next-intl";
import React, { ReactElement } from "react";

export default function Footer(): ReactElement {
  const t = useTranslations();
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <LinkMaterial
        color="inherit"
        href="https://www.uceva.edu.co/facultad-de-ciencias-de-la-salud/"
      >
        {t("commons.uceva")},
      </LinkMaterial>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
