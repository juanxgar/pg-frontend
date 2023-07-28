"use client";

import { ReactElement, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

export default function AdminLayout(props: Props): ReactElement {
  const { children } = props;
  return <section>{children}</section>;
}
