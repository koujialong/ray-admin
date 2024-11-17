export interface MenuType {
  label?: string;
  key?: string;
  icon?: any;
  order?: string;
  parent?: Menu;
  menuType?: string;
  status?: string;
  children?: MenuType[];
}
