import { atom } from "jotai";

export interface User {
  id: string;
  username: string;
  image: string;
  email: string;
}

export const initialUser = {
  id: "",
  username: "",
  image: "",
  email: "",
};

const user = atom(initialUser);
export const userAtom = atom(
  (get) => get(user),
  (get, set, update: User) => {
    return set(user, {
      ...get(user),
      ...update,
    });
  },
);
