# 情绪镜像塔罗 · Mood Mirror Tarot

<div align="center">

![Mood Mirror Tarot](./public/pwa-512x512.svg)

**用塔罗牌投射你的潜意识，AI 神谕为情绪照镜**

*Tarot card projection of your subconscious, AI oracle as a mirror for your emotions*

[![Vue 3](https://img.shields.io/badge/Vue-3-42b883?logo=vue.js)](https://vuejs.org)
[![TypeScript](https://img.shields.io/badge/TS-5-3178c6?logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite)](https://vitejs.dev)
[![Tailwind](https://img.shields.io/badge/Tailwind-3-06b6d4?logo=tailwindcss)](https://tailwindcss.com)
[![PWA](https://img.shields.io/badge/PWA-ready-5a0fc8?logo=pwa)](https://vite-pwa-org.netlify.app)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

</div>

---

## 关于项目

情绪镜像塔罗是一个沉浸式 AI 塔罗占卜体验，融合塔罗牌的古老智慧与赛博朋克视觉风格。输入你的心情日记，AI 分析情绪状态，抽取三张塔罗牌揭示潜意识中的讯息。

> Mood Mirror Tarot is an immersive AI tarot experience blending ancient card wisdom with cyberpunk aesthetics. Write a journal entry, let AI decode your emotions, and draw three cards to reveal subconscious insights.

## 功能特色

| 模块 | 说明 |
|------|------|
| 情绪日记 | 输入文字，AI 实时分析情绪状态，可视化情绪分布 |
| 塔罗牌阵 | 78 张塔罗牌，三张经典牌阵揭示过去/现在/未来 |
| AI 神谕 | DeepSeek / OpenAI 兼容 API 流式解读，打字机逐字呈现 |
| 情绪星档 | 历史记录抽屉，情绪趋势图追踪心情变化 |
| 赛博美学 | 霓虹发光、毛玻璃 UI、星空极光动态背景、自定义光标 |
| PWA | 可安装到桌面，离线使用 |

## 技术栈

| 类别 | 方案 |
|------|------|
| 框架 | Vue 3 + TypeScript + Vite 5 |
| 样式 | Tailwind CSS 3 + PostCSS |
| 动效 | `@vueuse/motion` + CSS Transitions |
| AI | DeepSeek API（推荐）/ OpenAI 兼容 API |
| 状态 | Vue Composables |
| 离线 | `vite-plugin-pwa` (Vite PWA) |
| 部署 | Vercel |

## 快速开始

```bash
# 克隆
git clone https://github.com/xuelei321/vibe-taluo.git
cd vibe-taluo

# 安装依赖
npm install

# 配置环境变量（推荐 DeepSeek，国内可直连）
cat > .env.local << EOF
VITE_OPENAI_API_KEY=sk-your-deepseek-api-key
VITE_OPENAI_BASE_URL=https://api.deepseek.com/v1
VITE_OPENAI_MODEL=deepseek-chat
EOF

# 启动
npm run dev
```

> 详细配置说明见 [ENV_PRODUCTION.md](./ENV_PRODUCTION.md)

## 项目结构

```
src/
├── components/
│   ├── background/        # 星空 & 极光动态背景
│   ├── chat/              # AI 神谕对话、打字机效果、提交入口
│   ├── emotion/           # 日记输入、情绪标记、预测展示、星图
│   ├── history/           # 历史抽屉 & 记录条目
│   ├── settings/          # 设置按钮 & 面板
│   ├── tarot/             # 塔罗牌、牌阵、神秘卡牌、牌阵解读
│   └── ui/                # 通用 UI（自定义光标、骨架屏）
├── composables/           # Vue Composables 状态逻辑
│   ├── ai/                #   AI 异步管线 & 神谕调用
│   ├── data/              #   占卜历史 & 用户设置
│   ├── emotion/           #   情绪检测 & 模式引擎
│   ├── tarot/             #   牌阵分析 & 抽取逻辑
│   └── ui/                #   光标状态
├── data/                  # 78 张塔罗牌静态数据
├── utils/                 # Markdown 解析等工具
├── doc/                   # 开发文档
└── public/                # 静态资源 & PWA 图标
```

## 部署

### Vercel（推荐）

1. Fork 仓库 → Vercel Import Project
2. 配置环境变量（推荐 DeepSeek）：

| Key | Value |
|-----|-------|
| `VITE_OPENAI_API_KEY` | `sk-xxx` |
| `VITE_OPENAI_BASE_URL` | `https://api.deepseek.com/v1` |
| `VITE_OPENAI_MODEL` | `deepseek-chat` |

3. Deploy

### CLI

```bash
npm i -g vercel && vercel
```

> 完整部署说明见 [ENV_PRODUCTION.md](./ENV_PRODUCTION.md)

## 开发文档

| 文档 | 内容 |
|------|------|
| [AGENTS.md](./doc/AGENTS.md) | 项目施工规范 |
| [API_SPEC.md](./doc/API_SPEC.md) | API 接口说明 |
| [IMPLEMENTATION_PROMPT.md](./doc/IMPLEMENTATION_PROMPT.md) | 实现提示词 |
| [ENV_PRODUCTION.md](./ENV_PRODUCTION.md) | 环境变量与部署配置 |

## License

MIT
