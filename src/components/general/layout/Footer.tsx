'use client';
import { Typography, Link as LinkMaterial } from "@mui/material";
import React from 'react';

export default function Footer() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <LinkMaterial color="inherit" href="https://www.uceva.edu.co/facultad-de-ciencias-de-la-salud/">
        Unidad Central del Valle del Cauca - Facultad de Ciencias de la Salud, 
      </LinkMaterial>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
