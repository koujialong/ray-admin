"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "@/trpc/react";
import { set } from "zod";

export function CreatePost() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [user, setUser] = useState<any>({ id: "", name: "默认" });

  const createPost = api.post.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setName("");
    },
  });
  const getUserDB = api.post.getUser.useQuery({ name },{
    enabled:false
  });

  const usersC = api.post.getAllUser.useMutation();

  const getUser = () => {
    usersC.mutate()
    getUserDB.refetch()
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createPost.mutate({ name });
        }}
        className="flex flex-col gap-2"
      >
        <input
          type="text"
          placeholder="Title"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-full px-4 py-2 text-black"
        />
        <button
          type="submit"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
          disabled={createPost.isLoading}
        >
          {createPost.isLoading ? "Submitting..." : "Submit"}
        </button>
      </form>
      <div className="truncate">{getUserDB.data?.name}</div>
      <div className="truncate">{getUserDB.data?.id}</div>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
        onClick={() => getUser()}
      >
        查询
      </button>
      {/*{user.data?.map((user) => {*/}
      {/*  return <div>{user.name}</div>;*/}
      {/*})}*/}

    </>
  );
}
