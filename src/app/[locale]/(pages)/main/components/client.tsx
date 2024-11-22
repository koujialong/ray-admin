"use client";
import React from "react";

function ClientCom({ data }) {
  const isClient = typeof window !== "undefined";
  return (
    <>
      <div onClick={() => console.log("点击")}>
        {data.name}:{data.age}:{data.time}
      </div>
      <div>{isClient ? "1" : "2"}</div>
      <h1>{typeof localStorage !== 'undefined' ? localStorage.getItem("name") : ''}</h1>
      <h1>{+new Date()}</h1>
    </>
  );
}

export default ClientCom;
