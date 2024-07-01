"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button, Popconfirm, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { api } from "@/trpc/react";
import { STATUS } from "@/app/[locale]/constant";
import RuleModal, { RoleModalRefType } from "@/app/[locale]/(pages)/main/system/role/components/RoleModal";


export interface RoleType {
  id: string;
  roleName: string;
  roleKey: string;
}

const pageSize = 10;


const RoleList: React.FC = () => {
  const [roles, setRoles] = useState<any>({ list: [] });
  const [pageNum, setPageNum] = useState(1);
  const ruleModalRef = useRef<RoleModalRefType>(null);
  const roleController = api.role.getRoleList.useMutation({
    onSuccess(data) {
      setRoles(data);
    }
  });
  useEffect(() => {
    roleController.mutate({
      pageNum,
      pageSize
    });
  }, []);

  const roleDeleteApi = api.role.deleteRoleById.useMutation({
    onSuccess() {
      roleController.mutate({ pageNum, pageSize });
    }
  });
  const deleteRole = (id: string) => {
    roleDeleteApi.mutate({ id });
  };

  const columns: ColumnsType<RoleType> = [
    {
      title: "角色名",
      dataIndex: "roleName",
      key: "roleName",
      render: (text, record) => (
        <Button
          type="link"
          onClick={() => ruleModalRef.current?.setModel(true, "view", record.roleKey)}
        >
          {text}
        </Button>
      )
    },
    {
      title: "角色Key",
      dataIndex: "roleKey",
      key: "roleKey"
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status) => STATUS[status]
    },
    {
      title: "备注",
      dataIndex: "remark",
      key: "remark",
    },
    {
      title: "排序",
      dataIndex: "order",
      key: "order"
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="删除用户"
            description={`确认删除菜单${record.roleName}?`}
            okText="确认"
            cancelText="取消"
            onConfirm={() => deleteRole(record.id)}
          >
            <Button type="link">删除</Button>
          </Popconfirm>
          <Button
            type="link"
            onClick={() =>
              ruleModalRef.current?.setModel(true, "edit", record.roleKey)
            }
          >
            编辑
          </Button>
        </Space>
      )
    }
  ];

  const changePage = (page: number, pageSize: number) => {
    setPageNum(page);
    roleController.mutate({
      pageNum: page,
      pageSize
    });
  };

  const reloadList=()=>{
    roleController.mutate({
      pageNum,
      pageSize
    });
  }

  return (
    <>
      <Space className="mb-4">
        <Button
          type="primary"
          onClick={() => ruleModalRef.current?.setModel(true, "add")}
        >
          新增角色
        </Button>
      </Space>
      <Table
        loading={roleController.isLoading}
        columns={columns}
        dataSource={roles.list}
        rowKey="id"
        pagination={{ total: roles.total, pageSize, onChange: changePage }}
      />
      <RuleModal ref={ruleModalRef} reloadList={reloadList}/>
    </>
  );
};

export default RoleList;
