"use client";
import { ReactElement } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import "moment/locale/es";
import { Locale } from "@/types";

interface Props {
  children?: React.ReactNode;
  params: Locale;
}

export const DatePickerProvider = (props: Props): ReactElement => {
  const { children, params } = props;
  return (
    <LocalizationProvider
      adapterLocale={params.locale}
      dateAdapter={AdapterMoment}
    >
      {children}
    </LocalizationProvider>
  );
};
