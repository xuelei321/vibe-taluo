<div align="center">
  <img src="./public/pwa-512x512.svg" width="120" alt="Mood Mirror Tarot Logo" />
</div>

<p align="center">
  <a href="#english">English</a> • <a href="#chinese">中文</a>
</p>

---

<a id="english"></a>

<div align="center">

# Mood Mirror Tarot

**Journal your feelings. Let AI read between the cards.**

<p>
  <a href="https://github.com/xuelei321/vibe-taluo"><img src="https://img.shields.io/github/stars/xuelei321/vibe-taluo?style=flat&logo=github" alt="Stars" /></a>
  <a href="https://github.com/xuelei321/vibe-taluo/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-green" alt="MIT License" /></a>
  <img src="https://img.shields.io/github/repo-size/xuelei321/vibe-taluo" alt="Repo Size" />
  <br />
  <img src="https://img.shields.io/badge/Vue_3-42b883?logo=vue.js" alt="Vue 3" />
  <img src="https://img.shields.io/badge/TypeScript-3178c6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-646cff?logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06b6d4?logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/PWA-5a0fc8?logo=pwa" alt="PWA" />
</p>

<p>
  <a href="#features">Features</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#project-structure">Structure</a> •
  <a href="#roadmap">Roadmap</a> •
  <a href="#contributing">Contributing</a>
</p>

</div>

**Mood Mirror Tarot** is an immersive AI-powered tarot reading app with a cyberpunk aesthetic. Write a journal entry — AI analyzes your emotional state, draws three tarot cards, and reveals subconscious insights with streaming oracle interpretations.

> Why this project? Tarot meets modern AI — a unique intersection of ancient symbolism, emotional introspection, and cutting-edge web tech.

---

### Features

| Module | What It Does |
|--------|-------------|
| **📝 Emotion Journal** | Write freely; AI analyzes your mood in real time with visual emotion breakdown |
| **🔮 Tarot Spread** | 78 classic cards, three-card spread (past / present / future) |
| **🤖 AI Oracle** | Streaming interpretation via DeepSeek / OpenAI APIs, typewriter-style reveal |
| **📊 Mood Timeline** | Persistent history drawer with emotion trend charts |
| **🌌 Cyberpunk UI** | Neon glow, glassmorphism, animated starfield & aurora, custom cursor |
| **📱 PWA Ready** | Installable on desktop & mobile, works offline |

---

### Quick Start

```bash
git clone https://github.com/xuelei321/vibe-taluo.git
cd vibe-taluo
npm install

# Setup environment (recommended: DeepSeek — cheap, fast)
cat > .env.local << 'EOF'
VITE_OPENAI_API_KEY=sk-your-api-key
VITE_OPENAI_BASE_URL=https://api.deepseek.com/v1
VITE_OPENAI_MODEL=deepseek-chat
EOF

npm run dev
```

> See [ENV_PRODUCTION.md](./ENV_PRODUCTION.md) for full environment reference and Vercel deployment.

---

### Tech Stack

| Category | Choice | Why |
|----------|--------|-----|
| Framework | **Vue 3** + **TypeScript** | Composition API, strict typing |
| Build | **Vite 5** | Sub-second HMR, fast builds |
| Styling | **Tailwind CSS 3** | Utility-first, easy theming |
| Animations | `@vueuse/motion` | Declarative, performant |
| AI SDK | DeepSeek / OpenAI compatible | Streaming, cost-effective |
| PWA | `vite-plugin-pwa` | Offline support, installable |
| Deploy | Vercel | Zero-config SPA hosting |

---

### Project Structure

```
src/
├── components/
│   ├── background/      # Starfield & aurora nebula
│   ├── chat/            # AI oracle dialog, typewriter, submit
│   ├── emotion/         # Journal input, badges, prediction, star map
│   ├── history/         # Session history drawer & entries
│   ├── settings/        # Settings panel
│   ├── tarot/           # Card components, spread, mystic reveal
│   └── ui/              # Shared (custom cursor, skeleton loader)
├── composables/
│   ├── ai/              # Async pipeline & oracle API
│   ├── data/            # Reading history & user settings
│   ├── emotion/         # Emotion detection & pattern engine
│   ├── tarot/           # Spread analysis
│   └── ui/              # Cursor state
├── data/                # 78 tarot card definitions
├── doc/                 # Development docs
├── utils/               # Markdown parser, helpers
└── public/              # Static assets & PWA icons
```

---

### API Providers

| Provider | Base URL | Model | Notes |
|----------|----------|-------|-------|
| **DeepSeek** (recommended) | `https://api.deepseek.com/v1` | `deepseek-chat` | Cheap, fast, direct in China |
| OpenAI | `https://api.openai.com/v1` | `gpt-4o-mini` | Higher cost, requires proxy in CN |

---

### Roadmap

- [x] Core tarot reading flow
- [x] Emotion analysis & journaling
- [x] Streaming AI oracle
- [x] History & mood tracking
- [ ] Multi-language support (EN / ZH / JP)
- [ ] Tarot card animation & 3D flip
- [ ] Shareable reading cards (social image)
- [ ] User accounts & cloud sync
- [ ] Community spreads (user-created layouts)
- [ ] Mobile app (Capacitor / Tauri)

---

### Contributing

Contributions welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

1. Fork the repo
2. `git checkout -b feat/my-feature`
3. Commit using [conventional commits](https://www.conventionalcommits.org/)
4. Open a Pull Request

### Community

- [Issues](https://github.com/xuelei321/vibe-taluo/issues) — bugs & feature requests
- [Discussions](https://github.com/xuelei321/vibe-taluo/discussions) — Q&A & ideas

### License

[MIT](./LICENSE) © 2025 xuelei321

---

<a id="chinese"></a>

<div align="center">

# 情绪镜像塔罗

**用塔罗牌投射你的潜意识，AI 神谕为情绪照镜**

<p>
  <a href="https://github.com/xuelei321/vibe-taluo"><img src="https://img.shields.io/github/stars/xuelei321/vibe-taluo?style=flat&logo=github" alt="Stars" /></a>
  <a href="https://github.com/xuelei321/vibe-taluo/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-green" alt="许可证" /></a>
  <img src="https://img.shields.io/github/repo-size/xuelei321/vibe-taluo" alt="仓库大小" />
  <br />
  <img src="https://img.shields.io/badge/Vue_3-42b883?logo=vue.js" alt="Vue 3" />
  <img src="https://img.shields.io/badge/TypeScript-3178c6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-646cff?logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06b6d4?logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/PWA-5a0fc8?logo=pwa" alt="PWA" />
</p>

<p>
  <a href="#功能特色">功能特色</a> •
  <a href="#快速开始">快速开始</a> •
  <a href="#技术栈">技术栈</a> •
  <a href="#项目结构">项目结构</a> •
  <a href="#路线图">路线图</a> •
  <a href="#参与贡献">参与贡献</a>
</p>

</div>

情绪镜像塔罗是一个沉浸式 AI 塔罗占卜体验，融合塔罗牌的古老智慧与赛博朋克视觉美学。写下你的心情日记，AI 实时分析情绪状态，抽取三张塔罗牌，以流式神谕解读揭示潜意识中的讯息。

> 当古老塔罗符号遇上现代 AI，一场独特的内心探索之旅。

---

### 功能特色

| 模块 | 说明 |
|------|------|
| **📝 情绪日记** | 输入任意文字，AI 实时分析情绪并可视化展示 |
| **🔮 塔罗牌阵** | 78 张经典塔罗，三张牌阵揭示过去 / 现在 / 未来 |
| **🤖 AI 神谕** | 基于 DeepSeek / OpenAI 兼容 API 的流式解读，打字机逐字呈现 |
| **📊 情绪星档** | 历史记录抽屉，情绪趋势图表追踪心情变化 |
| **🌌 赛博美学** | 霓虹发光、毛玻璃、星空极光动态背景、自定义光标 |
| **📱 PWA 支持** | 可安装到桌面和手机，离线可用 |

---

### 快速开始

```bash
git clone https://github.com/xuelei321/vibe-taluo.git
cd vibe-taluo
npm install

# 配置环境变量（推荐 DeepSeek，国内可直连、价格低）
cat > .env.local << 'EOF'
VITE_OPENAI_API_KEY=sk-your-api-key
VITE_OPENAI_BASE_URL=https://api.deepseek.com/v1
VITE_OPENAI_MODEL=deepseek-chat
EOF

npm run dev
```

> 完整环境配置和 Vercel 部署说明见 [ENV_PRODUCTION.md](./ENV_PRODUCTION.md)

---

### 技术栈

| 类别 | 方案 | 说明 |
|------|------|------|
| 框架 | **Vue 3** + **TypeScript** | 组合式 API、严格类型 |
| 构建 | **Vite 5** | 毫秒级热更新、快速构建 |
| 样式 | **Tailwind CSS 3** | 原子化 CSS、易于主题 |
| 动效 | `@vueuse/motion` | 声明式、高性能 |
| AI | DeepSeek / OpenAI 兼容 | 流式输出、成本低廉 |
| PWA | `vite-plugin-pwa` | 离线支持、可安装 |
| 部署 | Vercel | 零配置 SPA 托管 |

---

### 项目结构

```
src/
├── components/
│   ├── background/      # 星空 & 极光背景
│   ├── chat/            # AI 神谕对话、打字机效果、提交入口
│   ├── emotion/         # 日记输入、情绪标记、预测展示、星图
│   ├── history/         # 占卜历史抽屉 & 记录条目
│   ├── settings/        # 设置面板
│   ├── tarot/           # 塔罗牌组件、牌阵、神秘揭示
│   └── ui/              # 通用 UI（自定义光标、骨架屏）
├── composables/
│   ├── ai/              # AI 异步管线 & 神谕 API
│   ├── data/            # 占卜历史 & 用户设置
│   ├── emotion/         # 情绪检测 & 模式引擎
│   ├── tarot/           # 牌阵分析
│   └── ui/              # 光标状态
├── data/                # 78 张塔罗牌数据
├── doc/                 # 开发文档
├── utils/               # Markdown 解析等工具
└── public/              # 静态资源 & PWA 图标
```

---

### API 提供商

| 提供商 | 接口地址 | 模型 | 说明 |
|--------|----------|------|------|
| **DeepSeek**（推荐） | `https://api.deepseek.com/v1` | `deepseek-chat` | 价格低、速度快、国内直连 |
| OpenAI | `https://api.openai.com/v1` | `gpt-4o-mini` | 价格较高，国内需代理 |

---

### 路线图

- [x] 核心塔罗占卜流程
- [x] 情绪分析与日记功能
- [x] AI 流式神谕解读
- [x] 历史记录与情绪追踪
- [ ] 多语言支持（EN / ZH / JP）
- [ ] 塔罗牌动画与 3D 翻转
- [ ] 可分享的占卜结果卡片
- [ ] 用户账户与云同步
- [ ] 社区牌阵（用户自定义布局）
- [ ] 移动端 App（Capacitor / Tauri）

---

### 参与贡献

欢迎所有形式的贡献！详见 [CONTRIBUTING.md](./CONTRIBUTING.md)。

1. Fork 本仓库
2. 创建特性分支 `git checkout -b feat/my-feature`
3. 遵循 [约定式提交](https://www.conventionalcommits.org/)
4. 提交 Pull Request

### 社区

- [Issues](https://github.com/xuelei321/vibe-taluo/issues) — 报告 Bug 和提交功能建议
- [Discussions](https://github.com/xuelei321/vibe-taluo/discussions) — 问答 & 想法交流

### 许可证

[MIT](./LICENSE) © 2025 xuelei321
