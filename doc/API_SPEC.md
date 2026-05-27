# 赛博占卜屋 - 后端 API 技术规范

**版本**: 1.0.0
**最后更新**: 2026-05-27
**项目**: 赛博占卜屋：情绪镜像塔罗

---

## 目录

1. [概述](#1-概述)
2. [通用规范](#2-通用规范)
3. [用户认证模块](#3-用户认证模块)
4. [阅读记录模块](#4-阅读记录模块)
5. [AI 服务模块](#5-ai-服务模块)
6. [系统模块](#6-系统模块)
7. [数据模型](#7-数据模型)
8. [错误码定义](#8-错误码定义)

---

## 1. 概述

### 1.1 项目背景

为《赛博占卜屋：情绪镜像塔罗》前端应用提供后端服务支撑，包括用户管理、数据持久化、AI API 代理等功能。

### 1.2 基础信息

- **Base URL**: `http://localhost:3000/api`
- **Content-Type**: `application/json`
- **认证方式**: JWT Bearer Token
- **字符编码**: UTF-8

### 1.3 通用响应格式

#### 成功响应

```json
{
  "success": true,
  "data": { ... },
  "message": "操作成功"
}
```

#### 失败响应

```json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "请求参数错误",
    "details": { ... }
  }
}
```

#### 分页响应

```json
{
  "success": true,
  "data": {
    "items": [ ... ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

---

## 2. 通用规范

### 2.1 请求头

| 名称            | 类型   | 必填 | 说明                   |
| --------------- | ------ | ---- | ---------------------- |
| `Content-Type`  | string | 是   | `application/json`     |
| `Authorization` | string | 否   | `Bearer <token>`       |
| `X-Request-ID`  | string | 否   | 请求唯一ID（用于追踪） |

### 2.2 HTTP 状态码

| 状态码 | 说明           |
| ------ | -------------- |
| 200    | 请求成功       |
| 201    | 创建成功       |
| 400    | 请求参数错误   |
| 401    | 未授权         |
| 403    | 无权限         |
| 404    | 资源不存在     |
| 429    | 请求过于频繁   |
| 500    | 服务器内部错误 |

### 2.3 分页参数

| 参数        | 类型   | 必填 | 默认值      | 说明                 |
| ----------- | ------ | ---- | ----------- | -------------------- |
| `page`      | number | 否   | 1           | 页码                 |
| `pageSize`  | number | 否   | 10          | 每页数量             |
| `sortBy`    | string | 否   | `createdAt` | 排序字段             |
| `sortOrder` | string | 否   | `desc`      | 排序方向（asc/desc） |

---

## 3. 用户认证模块

### 3.1 用户注册

**接口**: `POST /auth/register`

**请求参数**:

```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "nickname": "神秘访客"
}
```

**响应**:

```json
{
  "success": true,
  "data": {
    "userId": "66a1b2c3d4e5f67890abc123",
    "email": "user@example.com",
    "nickname": "神秘访客",
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "注册成功"
}
```

---

### 3.2 用户登录

**接口**: `POST /auth/login`

**请求参数**:

```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**响应**:

```json
{
  "success": true,
  "data": {
    "userId": "66a1b2c3d4e5f67890abc123",
    "email": "user@example.com",
    "nickname": "神秘访客",
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 86400
  },
  "message": "登录成功"
}
```

---

### 3.3 刷新 Token

**接口**: `POST /auth/refresh`

**请求参数**:

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**响应**:

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 86400
  }
}
```

---

### 3.4 获取当前用户信息

**接口**: `GET /auth/me`

**认证**: 需要 JWT Token

**响应**:

```json
{
  "success": true,
  "data": {
    "userId": "66a1b2c3d4e5f67890abc123",
    "email": "user@example.com",
    "nickname": "神秘访客",
    "avatar": "https://example.com/avatar.jpg",
    "settings": {
      "theme": "dark",
      "language": "zh-CN",
      "aiModel": "deepseek-chat"
    },
    "createdAt": "2026-05-20T10:00:00.000Z"
  }
}
```

---

### 3.5 更新用户信息

**接口**: `PUT /auth/me`

**认证**: 需要 JWT Token

**请求参数**:

```json
{
  "nickname": "新昵称",
  "avatar": "https://example.com/new-avatar.jpg",
  "settings": {
    "theme": "dark"
  }
}
```

**响应**:

```json
{
  "success": true,
  "data": {
    "userId": "66a1b2c3d4e5f67890abc123",
    "nickname": "新昵称",
    "avatar": "https://example.com/new-avatar.jpg",
    "settings": { ... }
  },
  "message": "更新成功"
}
```

---

## 4. 阅读记录模块

### 4.1 创建阅读记录

**接口**: `POST /readings`

**认证**: 需要 JWT Token

**请求参数**:

```json
{
  "diaryExcerpt": "今天心情有些复杂...",
  "drawnCards": [
    {
      "cardId": 0,
      "cardName": "愚者",
      "cardNameEn": "The Fool",
      "cardIcon": "🃏",
      "positionLabel": "过去 · 根源",
      "isReversed": false,
      "oracleText": "这张牌揭示了..."
    }
  ],
  "oracleSummary": "三张牌共同诉说着...",
  "emotionIntensity": 0.75,
  "dominantMood": "迷茫"
}
```

**响应**:

```json
{
  "success": true,
  "data": {
    "readingId": "66a1b2c3d4e5f67890abc124",
    "createdAt": "2026-05-27T10:00:00.000Z"
  },
  "message": "保存成功"
}
```

---

### 4.2 获取阅读记录列表

**接口**: `GET /readings`

**认证**: 需要 JWT Token

**查询参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `page` | number | 否 | 页码 |
| `pageSize` | number | 否 | 每页数量 |
| `keyword` | string | 否 | 搜索关键词 |
| `startDate` | string | 否 | 开始日期（ISO 8601） |
| `endDate` | string | 否 | 结束日期（ISO 8601） |
| `mood` | string | 否 | 情绪筛选 |

**响应**:

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "readingId": "66a1b2c3d4e5f67890abc124",
        "diaryExcerpt": "今天心情有些复杂...",
        "dominantMood": "迷茫",
        "emotionIntensity": 0.75,
        "cardCount": 3,
        "createdAt": "2026-05-27T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 30,
      "totalPages": 3
    }
  }
}
```

---

### 4.3 获取单条阅读详情

**接口**: `GET /readings/:id`

**认证**: 需要 JWT Token

**响应**:

```json
{
  "success": true,
  "data": {
    "readingId": "66a1b2c3d4e5f67890abc124",
    "diaryExcerpt": "今天心情有些复杂...",
    "drawnCards": [
      {
        "cardId": 0,
        "cardName": "愚者",
        "cardNameEn": "The Fool",
        "cardIcon": "🃏",
        "positionLabel": "过去 · 根源",
        "isReversed": false,
        "oracleText": "这张牌揭示了..."
      }
    ],
    "oracleSummary": "三张牌共同诉说着...",
    "emotionIntensity": 0.75,
    "dominantMood": "迷茫",
    "createdAt": "2026-05-27T10:00:00.000Z"
  }
}
```

---

### 4.4 删除阅读记录

**接口**: `DELETE /readings/:id`

**认证**: 需要 JWT Token

**响应**:

```json
{
  "success": true,
  "message": "删除成功"
}
```

---

### 4.5 获取情绪统计

**接口**: `GET /readings/stats/emotions`

**认证**: 需要 JWT Token

**查询参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `days` | number | 否 | 统计天数，默认30天 |

**响应**:

```json
{
  "success": true,
  "data": {
    "totalReadings": 30,
    "emotionDistribution": [
      { "mood": "迷茫", "count": 10, "percentage": 33.3 },
      { "mood": "平静", "count": 8, "percentage": 26.7 },
      { "mood": "焦虑", "count": 7, "percentage": 23.3 },
      { "mood": "喜悦", "count": 5, "percentage": 16.7 }
    ],
    "averageIntensity": 0.65,
    "trend": [
      { "date": "2026-05-01", "intensity": 0.7 },
      { "date": "2026-05-02", "intensity": 0.5 }
    ]
  }
}
```

---

## 5. AI 服务模块

### 5.1 AI 对话（流式响应）

**接口**: `POST /ai/chat`

**认证**: 需要 JWT Token

**请求参数**:

```json
{
  "systemPrompt": "你是一位塔罗解读师...",
  "userPrompt": "用户今天的情绪日记...",
  "maxTokens": 400,
  "temperature": 0.85,
  "stream": true
}
```

**响应**（Server-Sent Events）:

```
data: {"delta":"你"}

data: {"delta":"好"}

data: {"delta":"，"}

data: [DONE]
```

---

### 5.2 单张塔罗牌解读

**接口**: `POST /ai/card-reading`

**认证**: 需要 JWT Token

**请求参数**:

```json
{
  "diaryText": "今天心情有些复杂...",
  "card": {
    "id": 0,
    "name": "愚者",
    "nameEn": "The Fool",
    "lightMeaning": "...",
    "shadowMeaning": "..."
  },
  "positionLabel": "过去 · 根源",
  "isReversed": false,
  "stream": true
}
```

**响应**（流式）: 同上

---

### 5.3 塔罗牌阵综合解读

**接口**: `POST /ai/summary`

**认证**: 需要 JWT Token

**请求参数**:

```json
{
  "diaryText": "今天心情有些复杂...",
  "readings": [
    {
      "cardName": "愚者",
      "positionLabel": "过去 · 根源",
      "isReversed": false,
      "oracleText": "..."
    }
  ],
  "stream": true
}
```

**响应**（流式）: 同上

---

## 6. 系统模块

### 6.1 健康检查

**接口**: `GET /health`

**响应**:

```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2026-05-27T10:00:00.000Z",
    "version": "1.0.0",
    "services": {
      "mongodb": "connected",
      "redis": "connected"
    }
  }
}
```

---

### 6.2 获取系统配置

**接口**: `GET /config`

**响应**:

```json
{
  "success": true,
  "data": {
    "aiModels": [
      { "id": "deepseek-chat", "name": "DeepSeek Chat" },
      { "id": "gpt-4o", "name": "GPT-4o" }
    ],
    "features": {
      "streaming": true,
      "historySync": true
    }
  }
}
```

---

## 7. 数据模型

### 7.1 User（用户）

```typescript
interface User {
  _id: ObjectId;
  email?: string;
  passwordHash?: string;
  nickname: string;
  avatar?: string;
  settings: {
    theme: string;
    language: string;
    aiModel: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### 7.2 Reading（阅读记录）

```typescript
interface CardReading {
  cardId: number;
  cardName: string;
  cardNameEn: string;
  cardIcon: string;
  positionLabel: string;
  isReversed: boolean;
  oracleText: string;
}

interface Reading {
  _id: ObjectId;
  userId: ObjectId;
  diaryExcerpt: string;
  drawnCards: CardReading[];
  oracleSummary?: string;
  emotionIntensity: number;
  dominantMood: string;
  createdAt: Date;
}
```

---

## 8. 错误码定义

| 错误码                | HTTP状态码 | 说明                |
| --------------------- | ---------- | ------------------- |
| `VALIDATION_ERROR`    | 400        | 请求参数验证失败    |
| `UNAUTHORIZED`        | 401        | 未授权或 Token 失效 |
| `FORBIDDEN`           | 403        | 无权限访问          |
| `NOT_FOUND`           | 404        | 资源不存在          |
| `USER_EXISTS`         | 409        | 用户已存在          |
| `INVALID_CREDENTIALS` | 401        | 邮箱或密码错误      |
| `RATE_LIMIT_EXCEEDED` | 429        | 请求过于频繁        |
| `AI_SERVICE_ERROR`    | 503        | AI 服务不可用       |
| `INTERNAL_ERROR`      | 500        | 服务器内部错误      |

---

## 9. 安全要求

1. **身份认证**: 所有业务接口（除登录、注册、健康检查外）必须携带有效 JWT Token
2. **密码安全**: 密码使用 bcrypt 加密存储，至少 8 位，包含大小写字母和数字
3. **HTTPS**: 生产环境必须使用 HTTPS
4. **CORS**: 仅允许配置的域名访问
5. **请求限流**: 单个 IP 15 分钟内最多 100 次请求
6. **输入验证**: 所有输入参数必须经过 zod 验证
7. **SQL 注入防护**: 使用 Mongoose ORM，不直接拼接 SQL
8. **XSS 防护**: 输出内容进行转义，使用 helmet 设置安全头

---

## 10. 性能要求

| 指标                | 要求      |
| ------------------- | --------- |
| API 响应时间（P95） | < 300ms   |
| API 响应时间（P99） | < 500ms   |
| 并发用户数          | 200+      |
| 吞吐量              | > 100 RPS |
| 数据库查询时间      | < 100ms   |
