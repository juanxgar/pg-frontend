"use client";

import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ReactElement } from "react";

interface Props {
  children?: React.ReactNode;
  session?: Session;
}

export const NextAuthProvider = ({
  children,
  session,
}: Props): ReactElement => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};
