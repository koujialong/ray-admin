export interface MenuType {
  label?: string;
  key?: string;
  icon?: any;
  order?: number;
  parent?: Menu;
  menuType?: string;
  status?: string;
  children?: MenuType[];
  parentMenu?: MenuType[];
}
