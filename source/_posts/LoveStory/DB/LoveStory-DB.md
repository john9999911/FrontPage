---
title: LoveStory-DB
categories: 
    - 技术
    - 建站
tags: 
    - nextjs
    - cloudflare
    - html
    - GPT
description: 
    首先要设计数据库
date: 2025-06-19 00:07:00
---

好的！我们一步一步来，假设你完全没有配置过 Cloudflare Worker 和 D1 数据库。这里是**超详细入门流程**，你只需按步骤操作即可。

---

## 1. 注册 Cloudflare 账号

- 如果还没注册，访问 [Cloudflare 官网](https://dash.cloudflare.com/) 免费注册。

---

## 2. 安装 Wrangler CLI

Wrangler 是 Cloudflare 官方命令行工具，用于开发和部署 Worker、管理 D1 数据库等。

```bash
npm install -g wrangler
```
> 需要 Node.js 环境，没装可以先去 [nodejs.org](https://nodejs.org/) 下一个。

---

## 3. 登录 Cloudflare

```bash
wrangler login
```
会弹出网页让你授权。

---

## 4. 创建 Worker 项目

```bash
wrangler init love-you-api
cd love-you-api
```
- 选择 `Hello World` 模板即可，语言选 JavaScript 或 TypeScript，都可以。
- 目录结构类似：
  ```
  love-you-api/
    ├── src/
    │   └── index.js
    ├── wrangler.jsonc
    └── package.json
  ```

---

## 5. 创建 D1 数据库

```bash
wrangler d1 create love_you
```
- “love_you” 是数据库名字，可以自定义。

---

## 6. 绑定 D1 数据库到 Worker

编辑 `wrangler.jsonc`，加入：

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "love-you-api",
  "main": "src/index.ts",
  "compatibility_date": "2025-06-18",
  "observability": {
    "enabled": true
  },
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "love_you",
      "database_id": "xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
    }
  ]
}
```

---

## 7. 初始化数据库表结构

创建建表 SQL 文件（如 `init.sql`），内容如下：

```sql
CREATE TABLE languages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  country TEXT NOT NULL,
  flag_url TEXT,
  male_text TEXT NOT NULL,
  female_text TEXT,
  male_audio TEXT,
  female_audio TEXT
);
```

执行：

```bash
wrangler d1 execute love_you --file=init.sql
```
（love_you 为你的 D1 数据库名）

---

## 8. 本地开发 Worker

启动本地开发环境：

```bash
wrangler dev
```
- 默认监听 http://localhost:8787
- 你可以用 Postman、curl 或浏览器访问测试。
  ```
  wrangler d1 execute love_you --command "INSERT INTO languages (country, flag_url, male_text, female_text, male_audio, female_audio) VALUES ('China', '🇨🇳', '我爱你', '我爱你', '', '');"
  wrangler d1 execute love_you --command "SELECT * FROM languages;"
  ```
---

## 9. 部署到 Cloudflare

测试无误后，部署：

```bash
wrangler deploy
```

---

## 总结表格

| 步骤           | 命令或操作                                        |
|--------------|----------------------------------------------|
| 注册账号         | Cloudflare 官网注册                              |
| 安装 wrangler  | npm install -g wrangler                      |
| 登录           | wrangler login                               |
| 创建 Worker 项目 | wrangler init love-you-api                   |
| 创建 D1 数据库    | wrangler d1 create love_you                  |
| 绑定数据库        | 编辑 wrangler.jsonc，添加 d1_databases 部分         |
| 建表           | wrangler d1 execute love_you --file=init.sql |
| 本地开发         | wrangler dev                                 |
| 部署           | wrangler deploy                              |

---

## 你只需按顺序操作
做到第8步，本地 Worker 就能连上 D1 数据库，CRUD 接口开发准备完毕！  
接下来即可编写和测试 API 代码。

---

**如果哪一步卡住了，直接把报错发给我即可，我帮你解决。**  
完成到 “本地开发 Worker” 这一步后，我再教你如何写 API 代码。