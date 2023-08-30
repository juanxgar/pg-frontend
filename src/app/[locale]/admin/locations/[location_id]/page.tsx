"use client";
import { LinearProgressComponent, LocationDetail } from "@/components";
import { ReactElement, useState } from "react";
import { LocaleLocation } from "@/types";
import { Box } from "@mui/material";

interface Props {
  params: LocaleLocation;
}

export default function Page(props: Props): ReactElement {
  const { params } = props;

  const [isLoading, setLoading] = useState<boolean>(true);

  return (
    <>
      {isLoading && <LinearProgressComponent />}
      <Box sx={{ width: "100%", padding: "20px" }}>
        <LocationDetail
          locale={params.locale}
          location_id={params.location_id}
          setLoading={setLoading}
        />
      </Box>
    </>
  );
}
