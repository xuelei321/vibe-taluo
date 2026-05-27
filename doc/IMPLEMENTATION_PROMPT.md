# 赛博占卜屋 Express 后端 - 分阶段实施 Prompt

你是一名顶级的全栈工程师，正在为《赛博占卜屋：情绪镜像塔罗》项目构建基于 Express 的后端服务。

## 技术栈约束（不可更改）

- **后端**：Express 4.x + TypeScript
- **数据库**：MongoDB + Mongoose
- **身份认证**：JWT (jsonwebtoken)
- **AI 集成**：OpenAI 兼容 API（支持 DeepSeek）
- **日志**：winston + morgan
- **安全**：helmet, cors, express-rate-limit
- **验证**：zod

## 绝对禁令

1. 禁止输出 `// ...其余代码保持不变`、`// TODO`、`// ...` 或任何省略
2. 禁止输出不完整的代码，宁可分两次，不可残缺
3. 禁止使用任何省略号表示未完成的代码
4. 每次输出必须包含完整文件路径注释 + 100% 可运行代码

---

## Phase 1: 基础核心能力（优先实施）

### Phase 1 目标

搭建最小可行后端，支撑核心塔罗功能。

### Phase 1 任务清单

#### 1.1 项目初始化

**任务**：创建后端项目目录结构

- 创建 `server/` 目录作为后端根目录
- 初始化 `server/package.json`，包含所有必要依赖
- 配置 `server/tsconfig.json`
- 创建 `.env.example` 模板文件

**文件清单**：

```
server/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── types/
│   └── app.ts
├── tests/
├── .env.example
├── package.json
└── tsconfig.json
```

**依赖包**：

- express
- typescript
- @types/express
- @types/node
- ts-node-dev
- cors
- helmet
- express-rate-limit
- morgan
- winston
- mongoose
- openai
- dotenv
- zod

#### 1.2 基础配置与中间件

**任务**：配置基础 Express 应用

- 创建 `src/config/index.ts` - 加载环境变量
- 创建 `src/middleware/index.ts` - 配置所有中间件
- 创建 `src/utils/logger.ts` - 日志配置
- 创建 `src/app.ts` - Express 应用入口

#### 1.3 数据库连接与模型

**任务**：定义数据模型

- 创建 `src/config/database.ts` - MongoDB 连接
- 创建 `src/models/Reading.ts` - 阅读记录模型
- 创建 `src/types/index.ts` - TypeScript 类型定义

#### 1.4 AI 代理服务

**任务**：封装 AI API 代理

- 创建 `src/services/aiService.ts` - AI 服务封装
- 支持流式响应
- 支持 DeepSeek / OpenAI 兼容 API
- API Key 隐藏在后端

#### 1.5 阅读记录 API

**任务**：实现阅读记录 CRUD

- 创建 `src/controllers/readingController.ts`
- 创建 `src/routes/readingRoutes.ts`
- 创建 `src/middleware/errorHandler.ts` - 错误处理

#### 1.6 健康检查与启动

**任务**：完善应用启动

- 创建 `src/server.ts` - 服务器启动文件
- 添加健康检查接口 `/api/health`
- 测试后端服务可正常启动

#### 1.7 前端适配

**任务**：修改前端代码调用后端 API

- 修改 `src/composables/useOracleAI.ts` - 修改 AI 调用改为调用后端
- 修改 `src/composables/useReadingHistory.ts` - 历史记录改为调用后端

---

## Phase 2: 增强功能

### Phase 2 目标

完善用户系统，增强业务能力。

### Phase 2 任务清单

#### 2.1 用户认证系统

**任务**：实现用户注册/登录

- 创建 `src/models/User.ts` - 用户模型
- 创建 `src/services/authService.ts` - 认证服务
- 创建 `src/controllers/authController.ts`
- 创建 `src/routes/authRoutes.ts`
- 创建 `src/middleware/authMiddleware.ts` - JWT 验证中间件
- 密码加密使用 bcryptjs
- JWT Token 生成与刷新

#### 2.2 用户信息管理

**任务**：用户资料 API

- 用户信息获取与更新
- 用户设置管理

#### 2.3 Redis 缓存集成

**任务**：添加 Redis 缓存

- 安装 redis 依赖
- 创建 `src/config/redis.ts`
- 缓存用户 Session
- 缓存热点数据

#### 2.4 阅读记录增强

**任务**：增强阅读记录功能

- 搜索与筛选
- 分页查询
- 情绪数据分析接口

#### 2.5 单元测试

**任务**：添加测试

- 安装 jest, supertest
- 核心业务测试覆盖 > 70%

---

## Phase 3: 性能优化

### Phase 3 目标

提升系统性能，保障生产环境稳定运行。

### Phase 3 任务清单

#### 3.1 性能优化

**任务**：数据库与 API 优化

- 数据库索引优化
- API 响应压缩
- 数据库查询优化

#### 3.2 监控与告警

**任务**：添加监控

- 性能监控集成
- 错误追踪（Sentry）
- 健康检查增强

#### 3.3 部署配置

**任务**：生产环境部署

- 创建 Dockerfile
- 创建 docker-compose.yml
- PM2 配置
- Nginx 反向代理配置

---

## 输出规范

每次执行任务时，严格按照以下格式输出：

1. **完整文件路径注释**
2. **100% 可运行代码**
3. **新增依赖列表（如需要）**
4. \*\*下一步操作说明

**示例格式**：

```typescript
// server/src/app.ts
import express from "express";
// ... 完整代码
```

依赖：`npm install xxx`

接下来：执行 xxx 命令
