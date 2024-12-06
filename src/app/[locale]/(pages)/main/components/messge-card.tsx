"use client";
import { Avatar, List } from "antd";
import React from "react";
const data = [
  {
    title: "消息1",
  },
  {
    title: "消息2",
  },
  {
    title: "消息3",
  },
  {
    title: "消息4",
  },
];
function MessageCard() {
  return (
    <List
      itemLayout="horizontal"
      dataSource={data}
      renderItem={(item, index) => (
        <List.Item>
          <List.Item.Meta
            className="pl-4"
            avatar={
              <Avatar
                src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
              />
            }
            title={<a className="text-lg">{item.title}</a>}
            description={<a className="text-sm">{item.title}的内容</a>}
          />
        </List.Item>
      )}
    />
  );
}

export default MessageCard;
