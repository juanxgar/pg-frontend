import { ReactElement } from "react";

export type MenuOptionItem = {
  name: string;
  pathname: string;
  icon: () => ReactElement;
};

export type MenuOptions = {
  name: string;
  pathname: string | undefined;
  icon: () => ReactElement;
  items: Array<MenuOptionItem>;
};

export type Navigator = {
  ref: string;
  name: string;
};

export type ErrorResponse = {
  status?: number;
};

export type ContentModal = {
  title?: string;
  description: string;
};

export type Locale = {
  locale: string;
};

export type LocaleGroup = {
  locale: string;
  group_id: string;
};

export type LocaleLocation = {
  locale: string;
  location_id: string;
};

export type LocaleRotation = {
  locale: string;
  rotation_id: string;
};

export type StudentGroupItem = {
  user_id: number;
  name: string;
  code: string;
};

export type SpecialityLocationItem = {
  speciality_id: number;
  speciality_description: string;
  limit_capacity: number;
  location_speciality_id?: number;
};

export type SpecialityRotationItem = {
  speciality_id: number;
  speciality_description: string;
  professor_user_id: number;
  professor_name: string;
  number_weeks: number;
};

export type GradesColumn = {
  id: number;
  description: string;
  value: string;
};
