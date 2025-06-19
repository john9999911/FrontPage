---
title: LoveStory-DB-test
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

非常好！下面是超详细**TypeScript 版本 API Worker 文件的写法**、**本地测试方法**和**Postman/curl 的具体使用教程**，一步步带你入门。

---

## 1. 编写 Worker API 代码

请将如下 TypeScript 代码粘贴到你的 `src/index.ts` 文件：

```typescript name=src/index.ts
export default {
  async fetch(request: Request, env: any) {
    const url = new URL(request.url);
    const { pathname } = url;

    // 获取所有语言
    if (pathname === "/api/languages" && request.method === "GET") {
      const { results } = await env.DB.prepare("SELECT * FROM languages").all();
      return Response.json(results);
    }

    // 新增语言
    if (pathname === "/api/languages" && request.method === "POST") {
      const body = await request.json();
      const { country, flag_url, male_text, female_text, male_audio, female_audio } = body;
      if (!country || !male_text) {
        return Response.json({ error: "Missing required fields" }, { status: 400 });
      }
      await env.DB.prepare(
        `INSERT INTO languages (country, flag_url, male_text, female_text, male_audio, female_audio)
         VALUES (?, ?, ?, ?, ?, ?)`
      ).bind(
        country, flag_url || "", male_text, female_text || "", male_audio || "", female_audio || ""
      ).run();
      return Response.json({ success: true });
    }

    // 匹配 /api/languages/:id
    const languageIdMatch = pathname.match(/^\/api\/languages\/(\d+)$/);
    const id = languageIdMatch ? languageIdMatch[1] : null;

    // 获取单条
    if (id && request.method === "GET") {
      const { results } = await env.DB.prepare("SELECT * FROM languages WHERE id = ?").bind(id).all();
      if (!results.length) return Response.json({ error: "Not found" }, { status: 404 });
      return Response.json(results[0]);
    }

    // 更新
    if (id && request.method === "PUT") {
      const body = await request.json();
      const { country, flag_url, male_text, female_text, male_audio, female_audio } = body;
      await env.DB.prepare(
        `UPDATE languages SET country=?, flag_url=?, male_text=?, female_text=?, male_audio=?, female_audio=? WHERE id=?`
      ).bind(
        country, flag_url, male_text, female_text, male_audio, female_audio, id
      ).run();
      return Response.json({ success: true });
    }

    // 删除
    if (id && request.method === "DELETE") {
      await env.DB.prepare("DELETE FROM languages WHERE id=?").bind(id).run();
      return Response.json({ success: true });
    }

    // 默认 404
    return new Response("Not found", { status: 404 });
  }
};
```

---

## 2. 启动本地开发环境

在你的项目根目录终端输入：

```bash
wrangler dev
```

默认会在 [http://localhost:8787](http://localhost:8787) 启动本地服务。

---

## 3. 用浏览器或 curl 测试 GET 请求

### 用浏览器
直接访问：
- [http://localhost:8787/api/languages](http://localhost:8787/api/languages)  
  （看到空数组 `[]` 或数据，说明正常）

### 用 curl
```bash
curl http://localhost:8787/api/languages
```

---

## 4. 用 Postman 或 curl 测试 POST（新增）

### 用 Postman

1. 新建 Request，选择 `POST` 方法，URL 填写  
   `http://localhost:8787/api/languages`
2. 切换到 **Body**，选 **raw**，类型选 **JSON**。
3. 粘贴如下示例：
   ```json
   {
     "country": "Japan",
     "flag_url": "🇯🇵",
     "male_text": "愛してる",
     "female_text": "愛してる",
     "male_audio": "",
     "female_audio": ""
   }
   ```
4. 点击 **Send**，看到 `{ "success": true }` 就成功了。

### 用 curl

```bash
curl -X POST http://localhost:8787/api/languages \
  -H "Content-Type: application/json" \
  -d '{"country":"Japan","flag_url":"🇯🇵","male_text":"愛してる","female_text":"愛してる","male_audio":"","female_audio":""}'
```

---

## 5. 用浏览器/curl/Postman 测试 “获取单条/更新/删除”

### 获取单条
浏览器访问  
`http://localhost:8787/api/languages/1`

### 更新（PUT）

**curl 示例：**
```bash
curl -X PUT http://localhost:8787/api/languages/1 \
  -H "Content-Type: application/json" \
  -d '{"country":"Japan","flag_url":"🇯🇵","male_text":"大好き","female_text":"大好き","male_audio":"","female_audio":""}'
```

### 删除（DELETE）

**curl 示例：**
```bash
curl -X DELETE http://localhost:8787/api/languages/1
```

---

## 6. 检查结果

- 每次增删改后，用 GET 刷新查看数据变化。
- 如有报错，终端会有详细输出，直接发出来我帮你看。

---

## 总结流程

1. 粘贴 TypeScript 代码到 `src/index.ts`
2. `wrangler dev` 启动服务
3. 用 Postman/curl/浏览器按上面方法测试每个接口
4. 一切 OK 后就可以开发前端啦！

---
