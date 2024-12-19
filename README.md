# 服务搭建
## 数据库
* 创建.env配置文件
```shell
# 配置数据库连接，以postgres为例
DATABASE_URL="postgres://{用户名}:{密码}@{域名}:{端口}/{库名}"
```
修改/prisma/schema.prisma 到对应数据库类型
```
datasource db {
  provider = "postgres"
  url      = env("DATABASE_URL")
}
```
[其他数据库配置](https://www.prisma.io/docs/reference/database-reference/connection-urls#env)
```shell
# 配置NEXTAUTH_SECRET
NEXTAUTH_SECRET="xxxxxx"
```
```shell
#秘钥生成方式
openssl rand -base64 32
```

* 初始化表结构
```shell
pnpm db:push
```
* 初始化表数据
```shell
pnpm db:seed
```
或者
```shell
node --loader ts-node/esm .\prisma\seed.ts
```
## 本地启动服务
```shell
pnpm i
pnpm dev
```
默认账号：admin/admin@123
