import { ReactNode } from "react";
import { NextAuthProvider } from "./providers";

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
  return <NextAuthProvider>{children}</NextAuthProvider>;
}
