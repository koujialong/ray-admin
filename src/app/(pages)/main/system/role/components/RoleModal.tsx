import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/trpc/react";
import React, { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Form, Input, InputNumber, Modal, Radio } from "antd";
import FormItem from "antd/es/form/FormItem";
import { PageContext } from "@/app/context/pageContext";
import { MenuType } from "@/app/(pages)/main/system/menu/page";
import { STATUS } from "@/app/constant";
import TextArea from "antd/es/input/TextArea";


type Payload = {
  onOk?(): void;
  onCancel?(): void;
  [others: string]: any;
};

type ViewType = "edit" | "view" | "add"

export interface RoleModalRefType {
  setModel(open: Boolean, type: ViewType): void;
}

export interface RoleModalType {
}

export default React.forwardRef<RoleModalRefType, RoleModalType>((params, ref) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") as string;
  const [menuOption, setMenuOption] = useState<MenuType[]>([]);
  const payloadRef = useRef<Payload>({});
  const [open, setOpen] = useState(false);
  const [viewType, setViewType] = useState<ViewType>("add");

  const setModel = (open: boolean, type: ViewType) => {
    setOpen(open);
    setViewType(type);
  };

  useImperativeHandle(
    ref,
    () => ({
      setModel
    }),
    []
  );

  const showModal = () => {

  };


  const findMenu = api.menu.findMenuById.useMutation({
    onSuccess(menu) {
      form.setFieldsValue(menu);
    }
  });

  const allMenuApi = api.menu.getOtherAllMenu.useMutation({
    onSuccess(menus) {
      setMenuOption(menus);
    }
  });

  const form = Form.useForm()[0];
  useEffect(() => {
    form.setFieldsValue({
      menuType: "D",
      status: "0"
    });
    if (["view", "edit"].includes(viewType)) {
      findMenu.mutate({ id });
    }
    allMenuApi.mutate(id || "");
  }, []);

  const menuUpdateApi = api.menu.upDateMenuById.useMutation({
    async onSuccess(data) {
      if (data.id) {
        await messageApi.open({
          type: "success",
          content: "修改菜单成功",
          duration: 0.3
        });
        router.back();
      }
    }
  });

  const { messageApi } = useContext(PageContext);
  const addMenuApi = api.role.addRole.useMutation({
    async onSuccess(data) {
      if (data.id) {
        await messageApi.open({
          type: "success",
          content: "新增角色成功",
          duration: 0.3
        });
        // router.back();
      }
    }
  });

  const submit = async () => {
    await form.validateFields();
    const rule = form.getFieldsValue();
    if (viewType === "edit") {
      menuUpdateApi.mutate({
        ...rule,
        id
      });
      return;
    }
    addMenuApi.mutate(rule);
  };
  return (
    <Modal title="角色" open={open} onOk={submit} onCancel={() => setOpen(false)}
           okButtonProps={{ style: { display: viewType === "view" ? "none" : "" } }}
           okText={viewType === "edit" ? "修改" : "添加"}
    >
      <Form
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        style={{ maxWidth: 600 }}
        disabled={viewType === "view"}
      >
        <FormItem
          name="roleName"
          label="角色名称"
          rules={[{ required: true, message: "请输入角色名称" }]}
        >
          <Input placeholder="角色名称"></Input>
        </FormItem>
        <FormItem
          name="roleKey"
          label="权限字符"
          rules={[{ required: true, message: "请输入权限字符" }]}
        >
          <Input placeholder="权限字符"></Input>
        </FormItem>
        <FormItem
          name="order"
          label="排序"
          rules={[{ required: true, message: "请输入排序" }]}
        >
          <InputNumber min="0" placeholder="排序"></InputNumber>
        </FormItem>
        <FormItem name="status"
                  label="状态">
          <Radio.Group>
            {Object.keys(STATUS).map(key =>
              <Radio value={key} key={key}>{STATUS[key]}</Radio>)}
          </Radio.Group>
        </FormItem>
        <FormItem
          name="remark"
          label="备注"
        >
          <TextArea placeholder="备注"></TextArea>
        </FormItem>

      </Form>
    </Modal>
  );
});
