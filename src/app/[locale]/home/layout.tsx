"use client";

import { ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

export default function AdminLayout(props: Props) {
  const { children } = props;
  return <section>{children}</section>;
}
