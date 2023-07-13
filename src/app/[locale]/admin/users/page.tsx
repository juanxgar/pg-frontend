"use client";

import LinearProgressComponent from "@/components/general/LinearProgressComponent";
import TabsComponent from "@/components/general/Tabs";
import { Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { SyntheticEvent, useState } from "react";

export default function Page() {
  const t = useTranslations();
  const tabsTitle = [t("commons.professors"), t("commons.students")];
  const [value, setValue] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <>
      <LinearProgressComponent />
      <TabsComponent
        handleChange={handleChange}
        value={value}
        tabsTitle={tabsTitle}
      >
        {value === 0 ? (
          <Typography>hola</Typography>
        ) : (
          <Typography>hola2</Typography>
        )}
      </TabsComponent>
    </>
  );
}
