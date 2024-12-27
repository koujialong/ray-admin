import { api } from "@/trpc/react";
import React, { type Ref, useImperativeHandle, useRef, useState } from "react";
import { MENU_ICONS, MENU_TYPE_MAP, STATUS } from "@/app/[locale]/constant";
import { FormDialog, type FromDialogRef } from "@/components/form-dialog";
import { z } from "zod";
import { type MenuType } from "@/app/types/menu";
import { useToast } from "@/hooks/use-toast";
import { type Menu } from "@prisma/client";

type ViewType = "edit" | "view" | "add";

export interface MenuDialogRefType {
  setModel(open: boolean, type: ViewType, menu?: Menu): void;
}

export interface MenuDialogType {
  reloadList: () => void;
}

function Index(params: MenuDialogType, ref: Ref<MenuDialogRefType>) {
  const [open, setOpen] = useState(false);
  const [viewType, setViewType] = useState<ViewType>("add");
  const [id, setId] = useState<string>();
  const [menuOption, setMenuOption] = useState<
    Array<MenuType & { id: string }>
  >([]);
  const formRef = useRef<FromDialogRef>(null);
  const { toast } = useToast();
  const allMenuApi = api.menu.getOtherAllMenu.useMutation({
    onSuccess(menus) {
      setMenuOption(menus);
    },
  });

  const setModel = (open: boolean, type: ViewType, menu?: Menu) => {
    setOpen(open);
    setViewType(type);
    menu && setId(menu.id);
    if (open) {
      if (menu && ["view", "edit"].includes(type)) {
        requestAnimationFrame(()=>{
          formRef?.current.setFormData(menu);
        })
      }
    }
    allMenuApi.mutate(menu?.id ?? "");
  };

  useImperativeHandle(
    ref,
    () => ({
      setModel,
    }),
    [],
  );

  const menuUpdateApi = api.menu.upDateMenuById.useMutation({
    async onSuccess(data) {
      if (data.id) {
        toast({
          title: "修改菜单成功",
        });
        setOpen(false);
        params.reloadList();
      }
    },
  });

  const addMenuApi = api.menu.addMenu.useMutation({
    async onSuccess(data) {
      if (data.id) {
        toast({
          type: "foreground",
          title: "添加菜单成功",
        });
        setOpen(false);
        params.reloadList();
      }
    },
  });

  const [icons] = useState(
    MENU_ICONS.map(({ name, icon }) => {
      const MenuIcon = icon;
      return {
        name,
        label: (
          <div className="flex items-center text-sm">
            <MenuIcon size="16" />
            <span className="ml-2">{name}</span>
          </div>
        ),
      };
    }),
  );

  const submit = async (menu: Menu) => {
    if (viewType === "edit" && id) {
      menuUpdateApi.mutate({
        ...menu,
        id,
      });
      return;
    }
    addMenuApi.mutate(menu);
  };
  return (
    <FormDialog
      ref={formRef}
      open={open}
      setOpen={setOpen}
      onSubmit={submit}
      title="菜单"
      formItems={[
        {
          title: "标题",
          key: "label",
          type: "Input",
          placeholder: "请输入标题",
          rule: z.string().min(1, "请输入标题"),
          defaultValue: "",
          disabled: viewType === "view",
        },
        {
          title: "类型",
          key: "menuType",
          type: "RadioGroup",
          placeholder: "请选择类型",
          rule: z.string().min(1, "请选择类型"),
          options: Object.keys(MENU_TYPE_MAP).map((key) => ({
            title: MENU_TYPE_MAP[key],
            key,
          })),
          defaultValue: "M",
          disabled: viewType === "view",
        },
        {
          title: "地址",
          key: "key",
          type: "Input",
          placeholder: "请输入地址",
          rule: z.string().min(0, "请输入地址"),
          defaultValue: "",
          disabled: ["view", "edit"].includes(viewType),
        },
        {
          title: "父级菜单",
          key: "parent",
          type: "Select",
          options: menuOption.map(({ id, label }) => ({
            title: label,
            key: id,
          })),
          defaultValue: "",
          multiple: true,
          disabled: viewType === "view",
        },
        {
          title: "状态",
          key: "status",
          type: "RadioGroup",
          defaultValue: "0",
          rule: z.string().min(1, "请选择状态"),
          options: Object.keys(STATUS).map((key) => ({
            title: STATUS[key],
            key,
          })),
          disabled: viewType === "view",
        },
        {
          title: "图标",
          key: "icon",
          type: "Select",
          rule: z.string().min(0, "请选择图标"),
          defaultValue: "",
          options: icons.map(({ name, label }) => ({
            title: label,
            key: name,
          })),
          disabled: viewType === "view",
        },
        {
          title: "排序",
          key: "order",
          type: "Input",
          defaultValue: 0,
          rule: z.number().min(0, "请输入排序"),
          inputType: "number",
          disabled: viewType === "view",
        },
      ]}
    />
  );
}
export default React.forwardRef<MenuDialogRefType, MenuDialogType>(Index);
