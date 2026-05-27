# 情绪镜像塔罗 · The Mood Mirror Tarot

<div align="center">

![Mood Mirror Tarot](./public/pwa-512x512.svg)

*用塔罗牌投射你的潜意识，AI 神谕为情绪照镜*

**Tarot card projection of your subconscious, AI oracle as a mirror for your emotions**

</div>

---

## 项目介绍 / Project Introduction

情绪镜像塔罗是一个沉浸式 AI 塔罗占卜体验，结合了塔罗牌的古老智慧与现代赛博朋克美学。通过分析用户的日记文字，AI 能够理解用户的情绪状态，并抽取三张塔罗牌来揭示潜意识中的信息。

Mood Mirror Tarot is an immersive AI-powered tarot reading experience, combining ancient tarot wisdom with modern cyberpunk aesthetics. By analyzing your journal entries, the AI understands your emotional state and draws three tarot cards to reveal messages from your subconscious mind.

## 技术栈 / Tech Stack

| 分类 | 技术 |
|------|------|
| 前端框架 | Vue 3 + TypeScript + Vite |
| 样式 | Tailwind CSS + 自定义 CSS |
| 动画 | Vue Motion + CSS Transitions |
| AI | DeepSeek API（推荐）/ OpenAI 兼容 API |
| 状态管理 | Vue Composables |
| PWA | vite-plugin-pwa |
| 部署 | Vercel |

## 本地启动 / Local Setup

```bash
# 1. 克隆项目
git clone https://github.com/xuelei321/vibe-taluo.git
cd vibe-taluo

# 2. 安装依赖
npm install

# 3. 配置环境变量
# 创建 .env.local 文件，推荐使用 DeepSeek API（便宜且国内可直连）：
# VITE_OPENAI_API_KEY=sk-your-deepseek-api-key
# VITE_OPENAI_BASE_URL=https://api.deepseek.com/v1
# VITE_OPENAI_MODEL=deepseek-chat

# 4. 启动开发服务器
npm run dev
```

## Vercel 部署 / Deploy on Vercel

### 方式一：GitHub 集成（推荐）

1. Fork 本仓库到你的 GitHub
2. 登录 [Vercel](https://vercel.com)，点击 "Import Project"
3. 选择 GitHub 仓库
4. 在 Environment Variables 中配置（推荐 DeepSeek）：
   - `VITE_OPENAI_API_KEY` → 你的 DeepSeek API Key
   - `VITE_OPENAI_BASE_URL` → `https://api.deepseek.com/v1`
   - `VITE_OPENAI_MODEL` → `deepseek-chat`
5. 点击 Deploy

### 方式二：CLI 部署

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录
vercel login

# 3. 部署
vercel

# 4. 生产环境部署
vercel --prod
```

详细配置说明请查看 [ENV_PRODUCTION.md](./ENV_PRODUCTION.md)

## 项目结构 / Project Structure

```
src/
├── components/
│   ├── background/     # 星空 & 极光背景
│   ├── chat/           # AI 神谕对话 & 打字机效果
│   ├── emotion/        # 情绪日记输入 & 情绪分析
│   ├── history/        # 占卜历史记录
│   ├── settings/       # 设置面板
│   ├── tarot/          # 塔罗牌组件 & 卡牌动画
│   └── ui/             # 通用 UI（光标、骨架屏等）
├── composables/        # Vue Composables 状态管理
├── data/               # 78 张塔罗牌数据
├── utils/              # 工具函数
└── doc/                # 开发文档
```

## 功能特色 / Features

- **智能情绪分析** - AI 分析日记内容，理解你的情绪状态
- **塔罗占卜** - 78 张塔罗牌随机抽取，三张牌阵揭示潜意识
- **神谕对话** - AI 流式解读，打字机效果逐字呈现
- **情绪星档** - 历史记录与情绪趋势可视化
- **赛博美学** - 霓虹发光、毛玻璃、星空极光动态背景
- **PWA 支持** - 可安装到桌面，离线可用
- **移动端适配** - 完全响应式设计

## License

MIT License
