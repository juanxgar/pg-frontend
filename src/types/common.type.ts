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
