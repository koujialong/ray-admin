import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Md5 } from "ts-md5";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function MD5(msg: string) {
  return new Md5()
    .appendStr(msg)
    .appendAsciiStr(process?.env?.NEXTAUTH_SECRET || "")
    .end();
}
