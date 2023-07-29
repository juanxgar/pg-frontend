"use client";

import { Box } from "@mui/material";
import { ReactElement } from "react";

interface Props {
  params: { locale: string };
}

export default function Page(props: Props): ReactElement {
  return <Box>{props.params.locale}</Box>;
}
