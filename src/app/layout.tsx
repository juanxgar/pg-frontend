import { ReactElement, ReactNode } from "react";
import { NextAuthProvider } from "./providers";

interface Props {
  children: ReactNode;
}

export default function RootLayout({ children }: Props): ReactElement {
  return <NextAuthProvider>{children}</NextAuthProvider>;
}
