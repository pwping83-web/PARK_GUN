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

## 현재 상태 (다음 작업)

화면 디자인은 완성되어 있지만 영상 재생은 목업입니다. 재생 화면은 이미지와 가짜 재생바이며, 실제 영상 파일은 아직 연결되지 않았습니다. 다음 단계는 영상 2개를 Supabase Storage(비공개 버킷)에 올리고 플레이어를 실제 `<video>`로 교체하는 것입니다.
