import React, {
  createElement,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Button, Form, Input, InputNumber, Modal, Radio, Select } from "antd";
import FormItem from "antd/es/form/FormItem";
import { MENU_TYPE_MAP, STATUS } from "@/app/[locale]/constant";
import { MenuType } from "@/app/[locale]/(pages)/main/system/menu/page";
import * as Icon from "@ant-design/icons";
import { api } from "@/trpc/react";
import { useSearchParams } from "next/navigation";
import { PageContext } from "@/app/context/pageContext";

const Icons: { [key: string]: any } = Icon;

type ViewType = "edit" | "view" | "add";

export interface MenuModalRefType {
  setModal(open: boolean, type: ViewType, id?: string): void;
}

export interface MenuModalType {
  reloadList: () => void;
}

export default React.forwardRef<MenuModalRefType, MenuModalType>(
  (params, ref) => {
    const searchParams = useSearchParams();
    const id = searchParams.get("id") as string;
    const [open, setOpen] = useState(false);
    const [menuOption, setMenuOption] = useState<MenuType[]>([]);
    const [viewType, setViewType] = useState<ViewType>("add");
    const setModal = (open: boolean, type: ViewType, id?: string) => {
      setOpen(open);
      setViewType(type);
      if (open) {
        form.resetFields()
        if (id && ["view", "edit"].includes(type)) {
          findMenu.mutate({ id });
        }
      }
    };

    const allMenuApi = api.menu.getOtherAllMenu.useMutation({
      onSuccess(menus) {
        setMenuOption(menus);
      },
    });

    const findMenu = api.menu.findMenuById.useMutation({
      onSuccess(menu) {
        form.setFieldsValue(menu);
      },
    });

    const { messageApi } = useContext(PageContext);
    const menuUpdateApi = api.menu.upDateMenuById.useMutation({
      async onSuccess(data) {
        if (data.id) {
          await messageApi.open({
            type: "success",
            content: "修改菜单成功",
            duration: 0.3,
          });
          setOpen(false);
        }
      },
    });

    const addMenuApi = api.menu.addMenu.useMutation({
      async onSuccess(data) {
        if (data.id) {
          await messageApi.open({
            type: "success",
            content: "新增菜单成功",
            duration: 0.3,
          });
          setOpen(false);
        }
      },
    });

    const form = Form.useForm()[0];
    useEffect(() => {
      form.setFieldsValue({
        menuType: "D",
        status: "0",
      });
      if (["view", "edit"].includes(viewType)) {
        findMenu.mutate({ id });
      }
      allMenuApi.mutate(id || "");
    }, []);

    const [icons, setIcons] = useState(
      Object.keys(Icon).map((value) => ({
        value,
        label: createElement(Icons[value]),
      })),
    );

    const submit = async (val: any) => {
      if (viewType === "edit") {
        menuUpdateApi.mutate({
          ...val,
          id,
        });
        return;
      }
      addMenuApi.mutate(val);
    };

    useImperativeHandle(ref, () => ({ setModal }), []);

    return (
      <Modal
        title="菜单"
        open={open}
        onOk={submit}
        onCancel={() => setOpen(false)}
        okButtonProps={{
          style: { display: viewType === "view" ? "none" : "" },
        }}
        okText={viewType === "edit" ? "修改" : "添加"}
      >
        <Form
          form={form}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          style={{ maxWidth: 600 }}
          disabled={viewType === "view"}
          onFinish={submit}
        >
          <FormItem
            name="label"
            label="标题"
            rules={[{ required: true, message: "请输入标题" }]}
          >
            <Input placeholder="标题"></Input>
          </FormItem>
          <FormItem name="menuType" label="类型" rules={[{ required: true }]}>
            <Radio.Group>
              {Object.keys(MENU_TYPE_MAP).map((key) => (
                <Radio value={key} key={key}>
                  {MENU_TYPE_MAP[key]}
                </Radio>
              ))}
            </Radio.Group>
          </FormItem>
          <FormItem
            name="key"
            label="地址"
            rules={[{ required: true, message: "请输入地址" }]}
          >
            <Input
              placeholder="地址"
              disabled={viewType === "edit" || viewType === "view"}
            ></Input>
          </FormItem>
          <FormItem name="parent" label="父级菜单">
            <Select placeholder="请选择父级菜单">
              {menuOption.map(({ id, label }) => (
                <Select.Option value={id} key={id}>
                  {label}
                </Select.Option>
              ))}
            </Select>
          </FormItem>
          <FormItem name="status" label="状态" rules={[{ required: true }]}>
            <Radio.Group>
              {Object.keys(STATUS).map((key) => (
                <Radio value={key} key={key}>
                  {STATUS[key]}
                </Radio>
              ))}
            </Radio.Group>
          </FormItem>
          <FormItem name="icon" label="图标">
            <Select placeholder="请选择图标" showSearch>
              {icons.map(({ value, label }) => (
                <Select.Option value={value} key={value}>
                  {label}
                  <span className="ml-2">{value}</span>
                </Select.Option>
              ))}
            </Select>
          </FormItem>
          <FormItem
            name="order"
            label="排序"
            rules={[{ required: true, message: "请输入排序" }]}
          >
            <InputNumber min="0" placeholder="排序"></InputNumber>
          </FormItem>
        </Form>
      </Modal>
    );
  },
);
