"use client";

import LinearProgressComponent from "@/components/general/LinearProgressComponent";
import TabsComponent from "@/components/general/Tabs";
import { Theme, Typography, useMediaQuery } from "@mui/material";
import { useTranslations } from "next-intl";
import { ReactElement, SyntheticEvent, useEffect, useState } from "react";
import ProfessorsView from "@/components/users/professors/ProfessorsView";
import { useTheme } from "@mui/material/styles";

interface Props {
  params: { locale: string };
}

export default function Page(props: Props): ReactElement {
  const { params } = props;
  const t = useTranslations();
  const tabsTitle = [t("commons.professors"), t("commons.students")];

  const [value, setValue] = useState<number>(0);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [show, setShow] = useState<boolean>(false);

  const theme: Theme = useTheme();
  const lg: boolean = useMediaQuery(theme.breakpoints.up("lg"));

  useEffect(() => {
    if (lg) {
      setShow(true);
    }
  }, [lg]);
  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      {show && (
        <>
          {isLoading && <LinearProgressComponent />}
          <TabsComponent
            handleChange={handleChange}
            value={value}
            tabsTitle={tabsTitle}
          >
            {value === 0 ? (
              <ProfessorsView locale={params.locale} setLoading={setLoading} />
            ) : (
              <Typography>hola2</Typography>
            )}
          </TabsComponent>
        </>
      )}
    </>
  );
}
