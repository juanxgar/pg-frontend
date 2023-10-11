"use client";
import { LinearProgressComponent, RotationDateCreation } from "@/components";
import { ReactElement, useState } from "react";
import { Locale } from "@/types";
import { Box } from "@mui/material";

interface Props {
  params: Locale;
  rotation_id: string;
}

export default function Page(props: Props): ReactElement {
  const { params } = props;

  const [isLoading, setLoading] = useState<boolean>(true);

  return (
    <>
      {isLoading && <LinearProgressComponent />}
      <Box sx={{ width: "100%", padding: "20px" }}>
        <RotationDateCreation locale={params.locale} setLoading={setLoading} />
      </Box>
    </>
  );
}
