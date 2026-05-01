# AI Job Copilot Project State

Last updated: 2026-04-29

## Canonical Local Project

- Active project folder: `D:\Codex Projects\AI Job Copilot Publish`
- Old workspace folder: `C:\Users\My Rog\OneDrive\...\New project`
- The old workspace is no longer needed for this project. Continue future work from the D drive folder above.

## Remote And Deployment

- GitHub repository: `https://github.com/seanyeh0308/AI-Job-Copilot`
- Git remote: `origin https://github.com/seanyeh0308/AI-Job-Copilot.git`
- Main branch: `main`
- Vercel app: `https://ai-job-copilot-seven.vercel.app`
- Supabase is used for auth, profiles, analyses, results, usage logs, and payment records.
- DeepSeek API is used for AI generation.

## Last Pushed Commits

- `3959052 Sync paid checkout on dashboard`
- `e680061 Switch Stripe checkout to one-time payment`
- `fe2524a Improve Stripe checkout error handling`
- `0077d53 Add Stripe upgrade flow`
- `156b549 Build AI Job Copilot MVP`

## Current Local Git State

The D drive project has local changes that are not yet committed. Review before pushing.

Modified files:

- `src/app/auth/page.tsx`
- `src/app/dashboard/history/page.tsx`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/components/copy-button.tsx`
- `src/components/dashboard-nav.tsx`
- `src/components/history-list.tsx`
- `src/components/result-renderer.tsx`
- `src/lib/ai/mock.ts`
- `src/lib/ai/prompts.ts`
- `src/lib/constants.ts`
- `src/lib/types.ts`
- `src/lib/usage.ts`
- `src/lib/validations.ts`

Untracked files:

- `PADDLE_ONBOARDING_CHECKLIST.md`
- `src/app/pricing/page.tsx`
- `src/app/privacy/page.tsx`
- `src/app/refund-policy/page.tsx`
- `src/app/terms/page.tsx`
- `src/lib/site.ts`

## Payment Strategy Notes

Stripe was implemented and tested, including one-time Checkout and paid-session sync on Dashboard, but Stripe account onboarding may be difficult.

Current strategic direction discussed:

- Target overseas users.
- Deploy overseas.
- Use overseas payment.
- Price in English/USD.
- Avoid China-specific payment rails for this product phase.
- Lemon Squeezy is preferred over direct personal PayPal for a more SaaS-friendly MVP because it can act as Merchant of Record and can pay out to verified PayPal.
- Direct personal PayPal can be used only as a very early manual validation path, not as the long-term payment foundation.

## Useful Commands

Run from `D:\Codex Projects\AI Job Copilot Publish`:

```powershell
npm.cmd install
npm.cmd run dev
npm.cmd run typecheck
npm.cmd run build
git status --short --branch
```

## Environment Files

- `.env.local` exists in the D drive project and should stay local only.
- `.env.local` is ignored by Git.
- `.env.example` is safe to commit and documents required variables.

## Recommended Next Step

Start the next session by asking:

```text
Continue from D:\Codex Projects\AI Job Copilot Publish. First check git status, then help me review the current uncommitted changes and payment strategy.
```
