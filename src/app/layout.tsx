import { ReactElement, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function RootLayout({ children }: Props): ReactElement {
  return <>{children}</>;
}
