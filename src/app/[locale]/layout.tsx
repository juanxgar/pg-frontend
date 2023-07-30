import { notFound } from "next/navigation";
import { createTranslator, NextIntlClientProvider } from "next-intl";
import { ReactElement, ReactNode } from "react";
import { es } from "@/translations";
import { NextAuthProvider } from "../providers";
import { Layout } from "@/components";

interface Props {
  children: ReactNode;
  params: { locale: string };
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

export async function generateStaticParams(): Promise<
  {
    locale: string;
  }[]
> {
  return ["es"].map((locale) => ({ locale }));
}

export function generateMetadata({ params: { locale } }: Props): {
  title: string;
} {
  const messages = getMessages(locale);

  const t = createTranslator({ locale, messages });

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
            <Layout params={{ locale: params.locale }}>{children}</Layout>
          </NextAuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
