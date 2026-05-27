# 环境变量配置说明 / Environment Variables Setup

## Vercel 部署配置 / Vercel Deployment Configuration

在 Vercel 控制台配置以下环境变量 / Configure these environment variables in Vercel Project Settings:

### Environment Variables

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `VITE_OPENAI_API_KEY` | `sk-xxxxxxxxxxxxxxxx` | 你的 API 密钥（推荐 DeepSeek） |
| `VITE_OPENAI_BASE_URL` | `https://api.deepseek.com/v1` | API 端点（推荐 DeepSeek） |
| `VITE_OPENAI_MODEL` | `deepseek-chat` | 使用的模型名称 |

## 配置步骤 / Setup Steps

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 进入你的项目 → Settings → Environment Variables
3. 添加以上三个变量
4. 重新 Deploy

## 本地开发 / Local Development

本地开发需要在项目根目录创建 `.env.local` 文件：

```env
# 推荐使用 DeepSeek API（国内可直连、便宜）
VITE_OPENAI_API_KEY=sk-your-deepseek-api-key
VITE_OPENAI_BASE_URL=https://api.deepseek.com/v1
VITE_OPENAI_MODEL=deepseek-chat
```

> ⚠️ 注意：`.env.local` 不要提交到 Git！
