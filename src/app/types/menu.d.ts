export interface MenuType {
  label?: string;
  key?: string;
  icon?: string;
  order?: number;
  parent?: Menu;
  menuType?: string;
  status?: string;
  children?: MenuType[];
  parentMenu?: MenuType[];
}
