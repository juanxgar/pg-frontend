"use client";

import { ReactElement } from "react";
import {
  Description,
  Home,
  LocalHospital,
  Loop,
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
  {
    name: "Rotaciones",
    pathname: "/admin/rotations",
    icon: (): ReactElement => <Loop />,
    items: [],
  },
  {
    name: "Evaluaciones",
    pathname: "/admin/evaluations",
    icon: (): ReactElement => <Description />,
    items: [],
  },
];

export const MenuOptionsStudentEs: Array<MenuOptions> = [
  {
    name: "Inicio",
    pathname: "/home",
    icon: (): ReactElement => <Home />,
    items: [],
  },

  {
    name: "Rotaciones",
    pathname: "/student/rotations",
    icon: (): ReactElement => <Loop />,
    items: [],
  },
  {
    name: "Evaluaciones",
    pathname: "/student/evaluations",
    icon: (): ReactElement => <Description />,
    items: [],
  },
];

export const MenuOptionsProfessorEs: Array<MenuOptions> = [
  {
    name: "Inicio",
    pathname: "/home",
    icon: (): ReactElement => <Home />,
    items: [],
  },
  {
    name: "Grupos",
    pathname: "/professor/groups",
    icon: (): ReactElement => <People />,
    items: [],
  },
  {
    name: "Rotaciones",
    pathname: "/professor/rotations",
    icon: (): ReactElement => <Loop />,
    items: [],
  },
  {
    name: "Evaluaciones",
    pathname: "/professor/evaluations",
    icon: (): ReactElement => <Description />,
    items: [],
  },
];
