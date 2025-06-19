---
title: LoveStory 后端完善
categories: 
    - 技术
    - 建站
tags: 
    - cloudflare
    - GPT
description: 
    后端有很多细节要处理
date: 2025-06-20 03:07:00
---

# 项目对话信息总结

## 1. 项目技术选型与需求

### 1.1 前端
- 使用 Next.js + TailwindCSS。
- 前端展示国旗采用 [flagcdn.com](https://flagcdn.com/) 静态资源。
    - 例如，`https://flagcdn.com/cn.svg` 展示中国国旗。
    - 国家代码与英文名映射使用 `https://flagcdn.com/en/codes.json` ，即标准的 ISO 3166-1 alpha-2 码。
- 前端上传表单，字段包括：
    - country（ISO3166码）
    - male_text
    - female_text
    - male（音频文件）
    - female（音频文件）

### 1.2 后端
- 使用 Cloudflare Workers（Wrangler 部署）+ Cloudflare R2（音频存储）+ D1（数据库）。
- 音频文件直接随 `/api/languages` 的 `multipart/form-data` 一并上传，由后端生成 uuid 作为存储键。
- 数据表结构：
    - id
    - country（ISO3166码）
    - male_text
    - female_text
    - male_audio（uuid 作为 R2 对象键）
    - female_audio（uuid 作为 R2 对象键）
    - **flag_url 字段已移除**，前端根据 country 动态拼接国旗图片 URL。
- 后端所有 API 支持 CORS。
- 首页 `/` 返回欢迎语，其余 404。

## 2. Cloudflare 相关配置

- wrangler.jsonc 配置了 D1 数据库和 R2 bucket（AUDIO/IMAGES）。
- 可选 `vars` 字段，用于存放如最大音频大小、bucket名等。
- R2 访问有鉴权设计（可用自定义 header 或 secret）。

## 3. 主要接口设计

- `/api/languages` （GET）：获取全部语言记录。
- `/api/languages` （POST, multipart）：新增一条记录，并上传 male/female 音频文件，生成 uuid 存储到 R2 和数据库。
- `/api/languages/:id` （GET/PUT/DELETE）：单条读写删，更新/新增时音频字段为 uuid。
- `/r2/audio/:uuid` （GET）：按 uuid 取音频流。
- 首页 `/` 返回欢迎语，其他为 404。

## 4. 数据表结构

```sql
CREATE TABLE languages (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   country TEXT NOT NULL,        -- ISO3166-1 alpha-2 码
   male_text TEXT NOT NULL,
   female_text TEXT,
   male_audio TEXT,
   female_audio TEXT
);
```

## 5. 代码要点

- 后端所有接口均已移除 flag_url 字段。
- 新增/更新时，音频文件直接随表单一并上传，生成 uuid 存储至 R2，并以 uuid 填充数据库字段。
- 读取时，前端基于 country 字段拼接国旗 URL。

## 6. 国旗显示（前端）

- 通过 country 字段拼接国旗图片，例如：
  ```html
  <img src="https://flagcdn.com/48x36/{country}.png" alt="flag" />
  ```
  其中 `{country}` 替换为小写的 ISO3166 码（如 us、cn、ua 等）。
- 可使用 `https://flagcdn.com/en/codes.json` 获取所有支持的国家码及名称。

---

**备注**
- 系统高度解耦，国旗显示完全前端实现，后端仅需存储标准国家码。
- 音频文件归档和索引采用 uuid，安全且高效。
- 代码结构已根据最佳实践和 Cloudflare 官方文档优化。