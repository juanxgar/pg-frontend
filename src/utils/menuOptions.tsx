"use client";

import { ReactElement } from "react";
import { People, Person } from "@mui/icons-material";

export const MenuOptionsEs = [
  {
    name: "Gestión de Usuarios",
    pathname: undefined,
    icon: (): ReactElement => <Person />,
    items: [
      {
        name: "Usuarios",
        pathname: "/users",
        icon: (): ReactElement => <Person />,
      },
      {
        name: "Grupos",
        pathname: "/groups",
        icon: (): ReactElement => <People />,
      },
    ],
  },
];
