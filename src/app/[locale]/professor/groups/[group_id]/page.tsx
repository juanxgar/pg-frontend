"use client";
import { LinearProgressComponent, GroupDetail } from "@/components";
import { ReactElement, useState } from "react";
import { LocaleGroup } from "@/types";
import { Box } from "@mui/material";

interface Props {
  params: LocaleGroup;
}

export default function Page(props: Props): ReactElement {
  const { params } = props;

  const [isLoading, setLoading] = useState<boolean>(true);

  return (
    <>
      {isLoading && <LinearProgressComponent />}
      <Box sx={{ width: "100%", padding: "20px" }}>
        <GroupDetail
          locale={params.locale}
          group_id={params.group_id}
          setLoading={setLoading}
        />
      </Box>
    </>
  );
}
