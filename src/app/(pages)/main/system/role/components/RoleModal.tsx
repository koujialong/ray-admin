import { api } from "@/trpc/react";
import React, { useContext, useImperativeHandle, useRef, useState } from "react";
import { Form, Input, InputNumber, Modal, Radio } from "antd";
import FormItem from "antd/es/form/FormItem";
import { PageContext } from "@/app/context/pageContext";
import { STATUS } from "@/app/constant";
import TextArea from "antd/es/input/TextArea";
import MenuTree from "@/app/(pages)/main/system/role/components/MenuTree";

type ViewType = "edit" | "view" | "add"

export interface RoleModalRefType {
  setModel(open: Boolean, type: ViewType, id?: string): void;
}

export interface RoleModalType {
  reloadList: () => void;
}

export default React.forwardRef<RoleModalRefType, RoleModalType>((params, ref) => {
  const [open, setOpen] = useState(false);
  const [viewType, setViewType] = useState<ViewType>("add");
  const [id, setId] = useState<string>();
  const [selMenus, setSelMenus] = useState<string[]>([]);
  const form = Form.useForm()[0];

  const setModel = (open: boolean, type: ViewType, id?: string) => {
    setOpen(open);
    setViewType(type);
    id && setId(id);
    if (open) {
      form.setFieldsValue({
        status: "0",
        remark: "",
        roleName: "",
        roleKey: "",
        order: 1
      });
      setSelMenus([]);
      if (id && ["view", "edit"].includes(type)) {
        findRole.mutate({ id });
        getRuleMenuApi.mutate({ roleId: id });
      }
    }
  };

  useImperativeHandle(
    ref,
    () => ({
      setModel
    }),
    []
  );

  const findRole = api.role.findRoleById.useMutation({
    onSuccess(menu) {
      form.setFieldsValue(menu);
    }
  });

  const roleUpdateApi = api.role.upDateRoleById.useMutation({
    async onSuccess(data) {
      if (data.id) {
        await messageApi.open({
          type: "success",
          content: "修改角色成功",
          duration: 0.3
        });
        setOpen(false);
        params.reloadList();
      }
    }
  });

  const { messageApi } = useContext(PageContext);
  const addMenuApi = api.role.addRole.useMutation({
    async onSuccess(data) {
      if (data.id) {
        addRuleMenuApi.mutate({
          roleId: data.roleKey,
          menuIds: selMenus
        });
        await messageApi.open({
          type: "success",
          content: "新增角色成功",
          duration: 0.3
        });
        setOpen(false);
        params.reloadList();
      }
    }
  });

  const getRuleMenuApi = api.role.getRuleMenu.useMutation({
    onSuccess(data) {
      setSelMenus(data.map(it => it.menuId));
    }
  });


  const addRuleMenuApi = api.role.addRuleMenu.useMutation({
    onSuccess() {

    }
  });

  const submit = async () => {
    await form.validateFields();
    const role = form.getFieldsValue();
    if (viewType === "edit" && id) {
      roleUpdateApi.mutate({
        ...role,
        id
      });
      addRuleMenuApi.mutate({
        roleId: role.roleKey,
        menuIds: selMenus
      });
      return;
    }
    addMenuApi.mutate(role);
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
        <FormItem label="菜单权限">
          <MenuTree selMenus={selMenus} setSelMenus={setSelMenus} />
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
