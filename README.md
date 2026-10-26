# 박건 PARK GUN - 배우 프로필 사이트

Figma Make로 만든 디자인을 로컬에서 바로 열 수 있게 정리한 프로젝트입니다. React 19 + Vite + Tailwind CSS 4.

## 로컬에서 열기

Node.js 22 이상과 pnpm이 필요합니다.

```bash
pnpm install
pnpm dev
```

브라우저에서 http://localhost:8443 을 열면 됩니다. 포트를 바꾸려면 `PORT=5173 pnpm dev` 로 실행하세요.

npm만 있다면 `npm install -g pnpm` 으로 pnpm을 먼저 설치하면 됩니다.

## 배포용 빌드

```bash
pnpm build      # dist 폴더 생성
pnpm preview    # 빌드 결과 확인
```

## 내용 고치는 곳

- 이름, 연락처, 영상 정보, 출연 이력: `src/App.tsx` 맨 위의 `PHONE`, `EMAIL`, `VIDEOS`, `CREDITS`
- 색상과 글꼴: `src/index.css`
- 탭 제목과 검색 노출 설정: `.figma/make/site.json` (검색엔진 노출은 꺼져 있음)

## 영상 연결 방식

영상 파일은 Supabase Storage의 비공개 버킷 `profile-videos`에 둡니다. 재생 버튼을 누르면 `/api/video?id=1` 이 1시간짜리 임시 주소를 발급하고, 그 주소로 재생합니다. 서비스 키는 서버에서만 쓰이고 브라우저에는 노출되지 않습니다.

1. Supabase 대시보드 > Storage > `profile-videos` 에 영상을 `video-1.mp4`, `video-2.mp4` 이름으로 업로드합니다. (무료 플랜은 파일당 50MB 제한이라 H.264로 압축해 두세요.)
2. Vercel 프로젝트 Settings > Environment Variables 에 `.env.example` 의 세 값을 넣고 재배포합니다. `SUPABASE_SERVICE_ROLE_KEY` 에는 Supabase의 secret 키를 넣습니다.
3. 로컬에서 보려면 `.env.example` 을 `.env.local` 로 복사해 값을 채우고 `pnpm dev` 를 실행합니다.

작품명, 배역, 방송사, 연락처 문구는 아직 시안용 임시값이니 `src/App.tsx` 에서 실제 내용으로 고치세요.
