"use client";
import { LinearProgressComponent, RotationDateView } from "@/components";
import { ReactElement, useState } from "react";
import { LocaleRotation } from "@/types";
import { Box } from "@mui/material";

interface Props {
  params: LocaleRotation;
}

export default function Page(props: Props): ReactElement {
  const { params } = props;

  const [isLoading, setLoading] = useState<boolean>(true);

  return (
    <>
      {isLoading && <LinearProgressComponent />}
      <Box sx={{ width: "100%", padding: "20px" }}>
        <RotationDateView
          locale={params.locale}
          setLoading={setLoading}
          rotation_id={params.rotation_id}
          isStudent={true}
        />
      </Box>
    </>
  );
}
