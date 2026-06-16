This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 자동 블로그 번역

한글(`/content/blog/ko`) 포스팅을 커밋하면 husky post-commit 훅이 실행되어 OpenAI로 영어 번역본을 `/content/blog/en`에 자동 생성합니다.

### 설정
1. `.env.local` (또는 `.env`)에 `OPENAI_API_KEY` 설정 (`.env.example` 참고)
2. `yarn install` 후 `yarn prepare` (husky 초기화)

### 사용법
- `content/blog/ko/*.mdx` 파일을 수정/추가 후 `git commit`
- post-commit에서 `scripts/translate-post.ts`가 ko 파일을 감지해 en MDX 생성
- 생성된 en 파일은 자동으로 `git add` 되어 다음 커밋에 포함 가능

### 주의
- 번역 품질은 GPT-4o에 의존하므로 생성 후 검토 권장
- 코드 블록, 이미지 경로, MDX 컴포넌트는 보존됨
- `.env*`는 `.gitignore`에 의해 무시됨
- Node 20 환경에서는 lint-staged v13 사용
