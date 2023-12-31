"use client";
import {
  LinearProgressComponent,
  TabsComponent,
  ProfessorsView,
  StudentsView,
} from "@/components";
import { useTranslations } from "next-intl";
import { ReactElement, SyntheticEvent, useState } from "react";
import { Locale } from "@/types";

interface Props {
  params: Locale;
}

export default function Page(props: Props): ReactElement {
  const { params } = props;
  const t = useTranslations();
  const tabsTitle = [t("commons.professors"), t("commons.students")];

  const [value, setValue] = useState<number>(0);
  const [isLoading, setLoading] = useState<boolean>(true);

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
