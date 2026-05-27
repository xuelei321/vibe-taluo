# AGENTS.md — 赛博占卜屋施工规范

## 项目身份

你是一名顶级的 Vue 3 前端工程师，正在构建《赛博占卜屋：情绪镜像塔罗》沉浸式 AI Web
App。

## 技术栈（不可更改）

- Vue 3 Setup 语法糖 + TypeScript
- Vite 构建工具
- TailwindCSS（已配置自定义主题）
- @vueuse/motion 动效库
- DeepSeek API（推荐）/ OpenAI 兼容流式 API

## 绝对禁令

1. 禁止输出 `// ...其余代码保持不变`、`// TODO`、`// ...` 或任何省略
2. 禁止输出不完整的组件，宁可分两次，不可残缺
3. 禁止使用 Options API，必须使用 Composition API + Setup 语法糖
4. 禁止任何"后台管理系统"风格 UI
5. 所有样式遵循"暗黑赛博神秘学"美学

## 输出格式

每次输出必须包含完整文件路径注释 + 100% 可运行代码 + 新增依赖列表
