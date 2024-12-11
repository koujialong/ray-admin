import { api } from "@/trpc/react";
import React, {
  type Ref,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { STATUS } from "@/app/[locale]/constant";
import { FormDialog, FromDialogRef } from "@/components/form-dialog";
import { z } from "zod";
import { MenuType } from "@/app/types/menu";
import { IconComponent, TreeDataItem } from "@/components/tree-view";
import { useToast } from "@/hooks/use-toast";
import { Role } from "@prisma/client";

type ViewType = "edit" | "view" | "add";

export interface RoleModalRefType {
  setModel(open: boolean, type: ViewType, role?: Role): void;
}

export interface RoleModalType {
  reloadList: () => void;
}

function Index(params: RoleModalType, ref: Ref<RoleModalRefType>) {
  const [open, setOpen] = useState(false);
  const [viewType, setViewType] = useState<ViewType>("add");
  const [id, setId] = useState<string>();
  const [selMenus, setSelMenus] = useState<string[]>([]);
  const [treeData, setTreeData] = useState<TreeDataItem[]>([]);
  const formRef = useRef<FromDialogRef>();
  const { toast } = useToast();
  useEffect(() => {
    menuApi.mutate({ isSetting: true });
  }, []);
  const menuApi = api.menu.getAllMenu.useMutation({
    onSuccess(data) {
      function transTree(tree: MenuType[]): TreeDataItem[] {
        return tree.map((item) => ({
          id: item.key,
          name: item.label,
          icon: item.icon as unknown as IconComponent,
          children: item.children?.length ? transTree(item.children) : null,
        }));
      }
      setTreeData(transTree(data.tree));
    },
  });

  const setModel = (open: boolean, type: ViewType, role?: Role) => {
    setOpen(open);
    setViewType(type);
    role && setId(role.id);
    if (open) {
      setSelMenus([]);
      if (role && ["view", "edit"].includes(type)) {
        findRole.mutate({ id: role.id });
        getRoleMenuApi.mutate({ roleId: role.roleKey });
      }
    }
  };

  useImperativeHandle(
    ref,
    () => ({
      setModel,
    }),
    [],
  );

  const findRole = api.role.findRoleById.useMutation({
    onSuccess(role) {
      formRef?.current.setFormData(role);
    },
  });

  const roleUpdateApi = api.role.upDateRoleById.useMutation({
    async onSuccess(data) {
      if (data.id) {
        toast({
          type: "foreground",
          title: "修改角色成功",
        });
        setOpen(false);
        params.reloadList();
      }
    },
  });

  const addRoleApi = api.role.addRole.useMutation({
    async onSuccess(data) {
      if (data.id) {
        toast({
          type: "foreground",
          title: "新增角色成功",
        });
        setOpen(false);
        params.reloadList();
      }
    },
  });

  const getRoleMenuApi = api.role.getRoleMenu.useMutation({
    onSuccess(data) {
      formRef?.current.setFormData({
        menuIds: data.map((it) => it.menuId),
      });
    },
  });

  const addRoleMenuApi = api.role.addRoleMenu.useMutation();

  const submit = async (role: Role & { menuIds: string[] }) => {
    if (viewType === "edit" && id) {
      roleUpdateApi.mutate({
        ...role,
        id,
      });
      addRoleMenuApi.mutate({
        roleId: role.roleKey,
        menuIds: role.menuIds,
      });
      return;
    }
    addRoleApi.mutate(role);
    addRoleMenuApi.mutate({
      roleId: role.roleKey,
      menuIds: role.menuIds,
    });
  };
  return (
    <FormDialog
      ref={formRef}
      open={open}
      setOpen={setOpen}
      onSubmit={submit}
      title="角色"
      formItems={[
        {
          title: "角色名称",
          key: "roleName",
          type: "Input",
          placeholder: "请输入角色名称",
          rule: z.string().min(1, "请输入角色名称"),
          defaultValue: "",
          disabled: viewType === "view",
        },
        {
          title: "权限字符",
          key: "roleKey",
          type: "Input",
          placeholder: "请输入权限字符",
          rule: z.string().min(1, "请输入权限字符"),
          defaultValue: "",
          disabled: viewType === "view",
        },
        {
          title: "排序",
          key: "order",
          type: "Input",
          placeholder: "请输入排序",
          rule: z.number().min(0, "请输入排序"),
          defaultValue: 0,
          inputType: "number",
          disabled: viewType === "view",
        },
        {
          title: "菜单权限",
          key: "menuIds",
          type: "TreeView",
          options: treeData,
          rule: z.any().refine((value) => value != null && value !== "", {
            message: "请选择菜单权限",
          }),
          defaultValue: [],
          multiple: true,
          disabled: viewType === "view",
        },
        {
          title: "状态",
          key: "status",
          type: "RadioGroup",
          rule: z.string().min(0, "请输入排序"),
          defaultValue: "0",
          options: Object.keys(STATUS).map((key) => ({
            title: STATUS[key],
            key,
          })),
          disabled: viewType === "view",
        },
        {
          title: "备注",
          key: "remark",
          type: "Textarea",
          defaultValue: "",
          disabled: viewType === "view",
        },
      ]}
    />
  );
}
export default React.forwardRef<RoleModalRefType, RoleModalType>(Index);
