"use client";

import { notFound } from "next/navigation";
import { createTranslator, NextIntlClientProvider } from "next-intl";
import { ReactNode } from "react";
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

  return (
    <html lang={locale}>
      <body style={{ background: "linear-gradient(to right, white, #048014)" }}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <NextAuthProvider>{children}</NextAuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
