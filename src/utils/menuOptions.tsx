"use client";

import { ReactElement } from "react";
import { MedicalInformation, People, Person } from "@mui/icons-material";
import { MenuOptions } from "@/types/common.type";

export const MenuOptionsAdminEs: Array<MenuOptions> = [
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
  {
    name: "Especialidades",
    pathname: "/specialities",
    icon: (): ReactElement => <MedicalInformation />,
    items: [],
  },
];

export const MenuOptionsStudentEs: Array<MenuOptions> = [];

export const MenuOptionsProfessorEs: Array<MenuOptions> = [];
