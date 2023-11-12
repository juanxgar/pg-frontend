import { notFound } from "next/navigation";
import { createTranslator, NextIntlClientProvider } from "next-intl";
import { ReactElement, ReactNode } from "react";
import { es } from "@/translations";
import { NextAuthProvider } from "../providers";
import { Layout } from "@/components";
import { Locale } from "@/types";
import { DatePickerProvider } from "../dateProvider";

interface Props {
  children: ReactNode;
  params: Locale;
}

function getMessages(locale: string) {
  try {
    if (locale === "es") {
      return es;
    }
  } catch (error) {
    notFound();
  }
}

export async function generateStaticParams(): Promise<Locale[]> {
  return ["locale"].map((locale) => ({ locale }));
}

export function generateMetadata(props: Props): {
  title: string;
} {
  const messages = getMessages(props.params.locale);

  const t = createTranslator({ locale: props.params.locale, messages });

  return {
    title: t("title"),
  };
}

export default function LocaleLayout(props: Props): ReactElement {
  const { children, params } = props;
  const messages = getMessages(params.locale);

  return (
    <html lang={params.locale}>
      <body
        style={{
          margin: "0px",
          background: "linear-gradient(to right, white, #048014)",
        }}
      >
        <NextIntlClientProvider locale={params.locale} messages={messages}>
          <NextAuthProvider>
            <DatePickerProvider params={{ locale: params.locale }}>
              <Layout params={{ locale: params.locale }}>{children}</Layout>
            </DatePickerProvider>
          </NextAuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
