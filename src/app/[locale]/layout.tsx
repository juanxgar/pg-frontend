"use client";

import { notFound, usePathname } from "next/navigation";
import { createTranslator, NextIntlClientProvider } from "next-intl";
import { ReactNode, useEffect, useState } from "react";
import { es } from "@/translations";
import { NextAuthProvider } from "../providers";

type Props = {
  children?: ReactNode;
  params: { locale: string };
};

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

export default function LocaleLayout({ children, params: { locale } }: Props) {
  const messages = getMessages(locale);
  const pathname = usePathname();

  const [background, setBackground] = useState("white");

  useEffect(() => {
    if (pathname == `/${locale}`) {
      setBackground("linear-gradient(to right, white, #048014)");
    } else {
      setBackground("white");
    }
  }, [pathname]);

  return (
    <html lang={locale}>
      <body
        style={{
          background: background,
        }}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <NextAuthProvider>{children}</NextAuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
