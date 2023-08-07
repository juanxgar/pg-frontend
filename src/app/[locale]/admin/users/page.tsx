"use client";
import {
  LinearProgressComponent,
  TabsComponent,
  ProfessorsView,
  StudentsView,
} from "@/components";
import { Theme, useMediaQuery } from "@mui/material";
import { useTranslations } from "next-intl";
import { ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { Locale } from "@/types";

interface Props {
  params: Locale;
}

export async function generateStaticParams(): Promise<Locale[]> {
  return ["es"].map((locale) => ({ locale }));
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
      {isLoading && <LinearProgressComponent />}
      <TabsComponent
        handleChange={handleChange}
        value={value}
        tabsTitle={tabsTitle}
      >
        {value === 0 ? (
          <ProfessorsView locale={params.locale} setLoading={setLoading} />
        ) : (
          <StudentsView locale={params.locale} setLoading={setLoading} />
        )}
      </TabsComponent>
    </>
  );
}
