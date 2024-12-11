'use client'
import { api } from "@/trpc/react";
import React, {
  type Ref,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { FormDialog, FromDialogRef } from "@/components/form-dialog";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Role, User } from "@prisma/client";

type ViewType = "edit" | "view" | "add";

export interface UserModalRefType {
  setModel(open: boolean, type: ViewType, user?: User): void;
}

export interface UserModalType {
  reloadList: () => void;
}

function Index(params: UserModalType, ref: Ref<UserModalRefType>) {
  const [open, setOpen] = useState(false);
  const [viewType, setViewType] = useState<ViewType>("add");
  const [id, setId] = useState<string>();
  const formRef = useRef<FromDialogRef>();
  const [roleOptions, setRoleOptions] = useState<Role[]>([]);
  const { toast } = useToast();
  useEffect(() => {
    getAllRoleApi.mutate();
  }, []);

  const setModel = (open: boolean, type: ViewType, user?: User) => {
    setOpen(open);
    setViewType(type);
    user && setId(user.id);
    if (open) {
      if (user && ["view", "edit"].includes(type)) {
        formRef?.current.setFormData(user);
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

  const getAllRoleApi = api.role.getAllRole.useMutation({
    onSuccess(data) {
      setRoleOptions(data);
    },
  });
  const userUpdateApi = api.user.upDateUserById.useMutation({
    async onSuccess(data) {
      if (data.id) {
        toast({
          type: "foreground",
          title: "修改用户成功",
        });
        setOpen(false);
        params.reloadList();
      }
    },
  });

  const registerApi = api.user.register.useMutation({
    async onSuccess(data) {
      if (data.id) {
        toast({
          type: "foreground",
          title: "新增用户成功",
        });
        setOpen(false);
        params.reloadList();
      }
    },
  });

  const submit = async (user: User) => {
    if (viewType === "edit" && id) {
      userUpdateApi.mutate({
        ...user,
        id
      });
      return;
    }
    registerApi.mutate(user);
  };
  return (
    <FormDialog
      ref={formRef}
      open={open}
      setOpen={setOpen}
      onSubmit={submit}
      title="用户"
      formItems={[
        {
          title: "用户名",
          key: "username",
          type: "Input",
          placeholder: "请输入用户名",
          rule: z.string().min(1, "请输入用户名"),
          defaultValue: "",
          disabled: viewType === "view",
        },
        {
          title: "邮箱",
          key: "email",
          type: "Input",
          placeholder: "请输入邮箱",
          rule: z.string().min(1, "请输入邮箱").email(),
          defaultValue: "",
          disabled: viewType !== "add",
        },
        {
          title: "密码",
          key: "password",
          type: "Input",
          placeholder: "请输入密码",
          rule: z.string().min(0, "请输入密码"),
          defaultValue: '',
          inputType: "password",
          disabled: viewType === "view",
        },
        {
          title: "用户角色",
          key: "role",
          type: "Select",
          options: roleOptions.map((role) => ({
            title: role.roleName,
            key: role.roleKey,
          })),
          rule: z.string().min(0, "请选择用户角色"),
          defaultValue: '',
          multiple: true,
          disabled: viewType === "view",
        },
      ]}
    />
  );
}
export default React.forwardRef<UserModalRefType, UserModalType>(Index);
