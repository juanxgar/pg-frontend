export type MenuOptionItem = {
  name: string;
  pathname: string;
  icon: any;
};

export type MenuOptions = {
  name: string;
  pathname: string | undefined;
  icon: any;
  items: Array<MenuOptionItem>;
};
