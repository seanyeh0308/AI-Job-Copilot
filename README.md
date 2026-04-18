# AI Job Copilot

AI Job Copilot 是一个面向求职者的 Next.js MVP：根据职位描述和简历内容，生成简历优化建议、面试问答和岗位匹配分析。当前版本优先保证可运行、可部署、可演示，并为 Supabase、OpenAI、Stripe、Vercel 部署留好扩展结构。

## 1. 项目目录结构

```txt
.
├── src
│   ├── app
│   │   ├── api
│   │   │   ├── analyses
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   └── stripe/checkout/route.ts
│   │   ├── auth
│   │   │   ├── callback/route.ts
│   │   │   └── page.tsx
│   │   ├── dashboard
│   │   │   ├── history/page.tsx
│   │   │   ├── new/page.tsx
│   │   │   ├── results/[id]/page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components
│   │   ├── ui
│   │   ├── analysis-form.tsx
│   │   ├── dashboard-nav.tsx
│   │   ├── history-list.tsx
│   │   ├── module-selector.tsx
│   │   └── result-renderer.tsx
│   └── lib
│       ├── ai
│       │   ├── mock.ts
│       │   ├── openai.ts
│       │   └── prompts.ts
│       ├── supabase
│       ├── constants.ts
│       ├── stripe.ts
│       ├── types.ts
│       ├── usage.ts
│       └── validations.ts
├── supabase/schema.sql
├── .env.example
└── package.json
```

## 2. 数据库 schema 建议

核心表在 `supabase/schema.sql`：

- `profiles`：用户资料与套餐状态，默认 `free`。
- `analyses`：一次 JD + 简历分析任务，保存输入、模块选择和状态。
- `analysis_results`：按模块保存 AI JSON 结果，便于单模块重跑与展示。
- `usage_logs`：记录生成次数，当前免费用户限制为 3 次。
- `payment_records`：Stripe 付款和订阅记录预留。

已包含 RLS 策略，用户只能访问自己的分析、结果、用量和支付记录。Supabase Auth 的 `auth.users` 自带用户表，不建议在 public schema 中重复建 `users` 表；业务用户扩展放在 `profiles`。

## 3. 关键页面与组件设计

- Landing Page：产品名称、价值主张、三个功能模块、免费试用入口。
- Auth Page：邮箱密码登录与注册，基于 Supabase Auth。
- Dashboard：模块入口、最近一次任务、历史记录摘要。
- New Analysis：JD 输入、简历粘贴、模块选择、生成按钮。
- Result：按 Tab 展示三个模块结果，支持复制 JSON、再次编辑并重新生成。
- History：历史任务列表，点击进入详情页。

主要组件：

- `AnalysisForm`：新建和重新生成复用。
- `ResultRenderer`：按模块格式化渲染 JSON 结果。
- `ModuleSelector`：选择简历优化、面试问答、匹配分析。
- `HistoryList`：历史记录空状态与列表。

## 4. 后端接口与 AI 调用设计

### API

- `GET /api/analyses`：获取当前用户全部分析。
- `POST /api/analyses`：创建分析、调用 AI、保存结果、记录 usage。
- `GET /api/analyses/:id`：获取单次分析和结果。
- `PATCH /api/analyses/:id`：更新输入并重新生成结果。
- `POST /api/stripe/checkout`：Stripe Checkout 占位，配置密钥和 price 后可创建订阅 session。

### AI

AI 逻辑在 `src/lib/ai`：

- `prompts.ts`：三个模块独立 prompt builder。
- `openai.ts`：统一 OpenAI 调用，要求 JSON 输出。
- `mock.ts`：未配置 `OPENAI_API_KEY` 时返回结构化 demo 结果，方便本地演示。

输出优先 JSON，再由前端格式化。Prompt 已明确约束不虚构用户经历，信息不足时标注建议补充信息。

## 5. 核心代码

核心代码已按模块落在 `src` 目录。最重要的入口：

- 页面入口：`src/app/page.tsx`、`src/app/dashboard/new/page.tsx`、`src/app/dashboard/results/[id]/page.tsx`
- 生成接口：`src/app/api/analyses/route.ts`
- 重新生成接口：`src/app/api/analyses/[id]/route.ts`
- Prompt：`src/lib/ai/prompts.ts`
- 类型定义：`src/lib/types.ts`
- 数据库 schema：`supabase/schema.sql`

## 6. 本地运行与部署

### 本地运行

```bash
npm install
cp .env.example .env.local
npm run dev
```

打开 `http://localhost:3000`。

### Supabase 配置

1. 创建 Supabase 项目。
2. 在 SQL Editor 执行 `supabase/schema.sql`。
3. 在 Authentication 中启用 Email 登录。
4. 复制 Project URL 和 anon key 到 `.env.local`。
5. 如果启用邮箱确认，把回调地址设置为：

```txt
http://localhost:3000/auth/callback
https://your-domain.vercel.app/auth/callback
```

### 环境变量

```txt
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
OPENAI_MODEL=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_PRICE_ID=
```

`OPENAI_MODEL` 可先留空，代码默认使用 `gpt-4o-mini`。未配置 OpenAI key 时，应用会使用 mock 结果，便于演示页面。

### Vercel 部署

1. 将项目推送到 GitHub。
2. 在 Vercel 导入项目。
3. 在 Vercel Project Settings 添加环境变量。
4. 部署后把 Supabase Auth Redirect URL 加上 Vercel 域名。
5. 需要收费能力时，创建 Stripe Product/Price，填入 `STRIPE_PRICE_ID`。

## 7. 后续迭代建议

1. PDF / DOCX 上传：接入 Supabase Storage，使用服务端解析简历文本。
2. 会员订阅：补充 Stripe webhook，按 `profiles.plan` 控制用量。
3. 导出 PDF：把结果转换为结构化报告，支持下载与分享。
4. 面试练习记录：保存用户回答，AI 评分并给出改进建议。
5. 单模块重跑：允许只重新生成简历优化或面试问答。
6. 多语言简历版本：中英文简历优化、岗位地域化表达。
7. 团队版：职业顾问可管理多个候选人的分析任务。
