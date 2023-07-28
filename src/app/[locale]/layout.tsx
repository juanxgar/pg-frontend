"use client";

import { notFound, usePathname } from "next/navigation";
import { createTranslator, NextIntlClientProvider } from "next-intl";
import { ReactElement, ReactNode, useEffect, useState } from "react";
import { es } from "@/translations";
import { NextAuthProvider } from "../providers";
import { QueryClient, QueryClientProvider } from "react-query";
import Layout from "@/components/general/layout/Layout";

interface Props {
  children?: ReactNode;
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

export async function generateStaticParams() {
  return ["es"].map((locale) => ({ locale }));
}

export function generateMetadata({ params: { locale } }: Props) {
  const messages = getMessages(locale);

  const t = createTranslator({ locale, messages });

  return {
    title: t("title"),
  };
}

export default function LocaleLayout(props: Props): ReactElement {
  const { children, params } = props;
  const messages = getMessages(params.locale);
  const pathname:string = usePathname();

  const [background, setBackground] = useState<string>("#000000");
  const queryClient = new QueryClient();

  useEffect(() => {
    if (pathname == `/${params.locale}`) {
      setBackground("linear-gradient(to right, white, #048014)");
    } else {
      setBackground("white");
    }
  }, [pathname]);

  return (
    <html lang={params.locale}>
      <body
        style={{
          background: background,
        }}
      >
        <NextIntlClientProvider locale={params.locale} messages={messages}>
          <NextAuthProvider>
            <QueryClientProvider client={queryClient}>
              <Layout params={{ locale: params.locale }}>{children}</Layout>
            </QueryClientProvider>
          </NextAuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
