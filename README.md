# Next.js 14 (App Router) + Supabase 시작 가이드

이 프로젝트는 Next.js 14의 App Router, TypeScript, 그리고 Supabase를 사용하여 최신 웹 애플리케이션을 구축하기 위한 기본 구조를 제공합니다.

## 🚀 프로젝트 구조 설명

- **`.env.local.example`**: Supabase 프로젝트의 URL과 `anon` 키와 같은 환경 변수를 저장하는 예제 파일입니다. 실제 프로젝트에서는 `.env.local`로 복사하여 사용합니다.
- **`next.config.mjs`, `tsconfig.json`, `tailwind.config.ts`**: Next.js, TypeScript, TailwindCSS 관련 설정 파일입니다.
- **`src/app`**: Next.js App Router의 핵심 폴더입니다.
  - `globals.css`: 전역적으로 적용될 TailwindCSS 기본 스타일입니다.
  - `layout.tsx`: 모든 페이지를 감싸는 최상위 레이아웃 컴포넌트입니다.
  - `page.tsx`: 애플리케이션의 메인 페이지로, 서버 컴포넌트에서 데이터를 가져오는 예제를 포함합니다.
- **`src/lib/supabase`**: Supabase 클라이언트 생성을 위한 코드를 모아둔 폴더입니다.
  - `client.ts`: **클라이언트 컴포넌트** (`'use client'`)에서 사용될 Supabase 클라이언트를 생성합니다. 브라우저 환경에서 실행됩니다.
  - `server.ts`: **서버 컴포넌트**, **Route Handlers**, **Server Actions**에서 사용될 Supabase 클라이언트를 생성합니다. 서버 환경에서 실행되며 쿠키를 통해 인증을 처리합니다.
- **`src/middleware.ts`**: Next.js 미들웨어 파일입니다. 모든 요청을 처리하기 전에 실행되어 Supabase의 인증 세션을 최신 상태로 유지하는 중요한 역할을 합니다.
- **`src/components`**: 공통적으로 사용될 리액트 컴포넌트를 저장하는 폴더입니다. (현재 비어있음)
- **`package.json`**: 프로젝트에 필요한 라이브러리(dependencies) 목록과 실행 스크립트를 정의합니다.

## 🛠️ 시작하기

1.  **필요한 라이브러리 설치**:
    터미널에서 다음 명령어를 실행하여 `package.json`에 명시된 모든 라이브러리를 설치합니다.
    ```bash
    npm install
    ```

2.  **환경 변수 설정**:
    - ` .env.local.example` 파일의 이름을 `.env.local`로 변경합니다.
    - 당신의 Supabase 프로젝트 대시보드에서 **Project Settings > API** 메뉴로 이동합니다.
    - `Project URL`과 `anon` 키 값을 복사하여 `.env.local` 파일에 붙여넣습니다.

    ```env
    # .env.local
    NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    ```

3.  **개발 서버 실행**:
    ```bash
    npm run dev
    ```

    브라우저에서 [http://localhost:3000](http://localhost:3000) 주소로 접속하여 결과를 확인합니다.

    **참고**: `page.tsx`는 `countries`라는 테이블에서 데이터를 가져오도록 되어있습니다. 만약 해당 테이블이 없다면 Supabase 에러가 발생할 수 있습니다. Supabase 대시보드의 SQL Editor에서 간단한 테이블을 생성하여 테스트할 수 있습니다.
