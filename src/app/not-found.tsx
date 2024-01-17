import { Button, Result } from "antd";
import Link from "next/link";

export default function () {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Result
        status="404"
        title="404"
        subTitle="抱歉, 当前访问的页面不存在"
        extra={
          <Button type="primary">
            <Link href="/main">返回主页</Link>
          </Button>
        }
      />
    </div>
  );
}
