---
title: LoveStory 建站思路
categories: 
    - 技术
    - 建站
tags: 
    - nextjs
    - cloudflare
    - html
    - GPT
description: 
    我要为我们的爱情故事搭建网站记录
date: 2025-06-17 23:50:00
---


## 🧩 你的需求回顾一下：

> ✅ 博客展示 + ✅ 管理员登录界面 + ✅ 简单增删改查
> 🚫 不想租服务器
> ✅ 想用 Cloudflare 完成全部部署

---

## 🧱 推荐技术栈总览（无服务器全家桶）：

| 功能          | 技术方案                                         |
|-------------|----------------------------------------------|
| 前端页面展示（博客）  | **Next.js** 静态导出（或 Astro） + Cloudflare Pages |
| 管理员界面（增删改查） | Next.js + Tailwind UI 或 React 后台组件           |
| 后端接口（API）   | **Cloudflare Workers**                       |
| 数据存储        | **Cloudflare D1**（SQLite）或 Durable Objects   |
| 静态资源加速      | Cloudflare CDN（自动附带）                         |
| 用户认证        | 简易账号密码登录 → 存 JWT 或 Session 在 Cookie          |
| 自定义域名+SSL   | Cloudflare 免费支持                              |

---

## 🏗️ 架构怎么搭？

```text
[用户浏览器]
      ↓         静态 HTML/CSS/JS
[Cloudflare Pages (Next.js Build)]
      ↓         请求 API（增删改查）
[Cloudflare Worker → D1 数据库]
```

* 所有网页部署在 Cloudflare Pages（免费）
* 所有动态请求（如新增文章、验证登录）走 Worker
* Worker 访问 Cloudflare D1 数据库读写数据
* 你自己做个管理页面，也静态部署在 Pages 上（登录后才能访问）

---

## 🌟 为什么这套组合好？

| 优点       | 描述                           |
|----------|------------------------------|
| 💸 免费为主  | Pages、Worker、D1 的免费额度很大，小站够用 |
| 🌍 全球分发  | 你的博客在全球访问都超快，CDN 加持！         |
| 🧳 无部署负担 | 不需要维护服务器、数据库主机等              |
| 🔐 自带安全  | Cloudflare 自带防火墙、SSL         |
| 🚀 易于扩展  | 以后加评论、标签、搜索都可以扩展             |

---

## 🔧 技术实现关键点拆解：
### 1️⃣ 博客展示页面

* 用 **Next.js 的 `getStaticProps` + `next export`** 预渲染博客内容
* 生成 HTML + JSON，部署到 Cloudflare Pages
* 数据源可以是 D1，也可以一开始先用 Markdown 文件

### 2️⃣ 管理员后台

* 用 React + TailwindCSS 做简单的后台界面（比如：文章列表 + 编辑框）
* 登录后保存 token 在 Cookie
* 所有操作发 API 到 Worker：比如 `/api/createPost`、`/api/deletePost`

### 3️⃣ 后端接口（Cloudflare Workers）

* 写 JS/TS 处理 API 请求，验证 token
* 使用 `@cloudflare/kv-asset-handler` 或 `cloudflare/wrangler` 部署
* 请求数据库：用 `D1` 的 `env.DB.prepare("SELECT * FROM posts")` 等操作

### 4️⃣ 数据库（D1）

* 一张表 `posts(id, title, content, created_at)`
* 一张表 `users(id, username, password_hash)`
* 你可以通过 Wrangler CLI 直接建表、迁移、初始化

---

## ✨ 最小可用项目（MVP）划分

| 功能     | 推荐技术               | 是否必须 |
|--------|--------------------|------|
| 博客展示   | Next.js → Pages    | ✅    |
| 管理页面   | Next.js + React UI | ✅    |
| 登录验证   | Worker + Cookie    | ✅    |
| 数据增删改查 | Worker + D1        | ✅    |
| 评论系统   | 可后加（或用别家）          | ❌    |
| 搜索功能   | 先不加                | ❌    |

---

## 🐣 总结一句话：

你完全可以**不租服务器，100% 用 Cloudflare** 搭建一个可登录、可增删改查的博客系统！而且现代、安全、全球可访问！🌍

---

