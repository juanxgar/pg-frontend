"use client";

import { ReactElement } from "react";
import {
  Home,
  LocalHospital,
  MedicalInformation,
  People,
  Person,
} from "@mui/icons-material";
import { MenuOptions } from "@/types";

export const MenuOptionsAdminEs: Array<MenuOptions> = [
  {
    name: "Inicio",
    pathname: "/home",
    icon: (): ReactElement => <Home />,
    items: [],
  },
  {
    name: "Gestión de Usuarios",
    pathname: undefined,
    icon: (): ReactElement => <Person />,
    items: [
      {
        name: "Usuarios",
        pathname: "/admin/users",
        icon: (): ReactElement => <Person />,
      },
      {
        name: "Grupos",
        pathname: "/admin/groups",
        icon: (): ReactElement => <People />,
      },
    ],
  },
  {
    name: "Especialidades",
    pathname: "/admin/specialities",
    icon: (): ReactElement => <MedicalInformation />,
    items: [],
  },
  {
    name: "Centros Médicos",
    pathname: "/admin/locations",
    icon: (): ReactElement => <LocalHospital />,
    items: [],
  },
];

export const MenuOptionsStudentEs: Array<MenuOptions> = [];

export const MenuOptionsProfessorEs: Array<MenuOptions> = [];
