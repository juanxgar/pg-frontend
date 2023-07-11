"use client";

import { Box, Divider } from "@mui/material";

interface Props {
  params: { locale: string };
}

export default function Page(props: Props) {
  return <Box>{props.params.locale} home</Box>;
}
