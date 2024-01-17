"use client";
import React, { useEffect, useState } from "react";
import { Button, Popconfirm, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

interface DataType {
  id: string;
  username: string;
  email: string;
  image: string;
}

const pageSize = 10;

const UserList: React.FC = () => {
  const router = useRouter();
  const [users, setUsers] = useState<any>({ list: [] });
  const [pageNum, setPageNum] = useState(1);
  // getUserList
  const userController = api.user.getUserList.useMutation({
    onSuccess(data) {
      setUsers(data);
    },
  });
  useEffect(() => {
    userController.mutate({
      pageNum,
      pageSize,
    });
  }, []);

  const userDeleteApi = api.user.deleteUserById.useMutation({
    onSuccess() {
      userController.mutate({ pageNum, pageSize });
    },
  });
  const deleteUser = (id: string) => {
    userDeleteApi.mutate({ id });
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
      render: (text, record) => (
        <Button
          type="link"
          onClick={() => router.push(`/main/user/view?id=${record.id}`)}
        >
          {text}
        </Button>
      ),
    },
    {
      title: "邮箱",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "头像",
      dataIndex: "image",
      key: "image",
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="删除用户"
            description={`确认删除用户${record.username}?`}
            okText="确认"
            cancelText="取消"
            onConfirm={() => deleteUser(record.id)}
          >
            <Button type="link">删除</Button>
          </Popconfirm>
          <Button
            type="link"
            onClick={() => router.push(`/main/user/edit?id=${record.id}`)}
          >
            编辑
          </Button>
        </Space>
      ),
    },
  ];

  const changePage = (page: number, pageSize: number) => {
    setPageNum(page);
    userController.mutate({
      pageNum: page,
      pageSize,
    });
  };

  return (
    <div>
      <Space className="mb-4">
        <Button type="primary" onClick={() => router.push(`/main/user/add`)}>
          新增用户
        </Button>
      </Space>
      <Table
        loading={userController.isLoading}
        columns={columns}
        dataSource={users.list}
        rowKey="email"
        pagination={{ total: users.total, pageSize, onChange: changePage }}
      />
    </div>
  );
};

export default UserList;
