import { useEffect, useState } from 'react'

const PHONE = '010-4639-2673'
const EMAIL = 'tseizou@naver.com'

const VIDEOS = [
  {
    id: 1,
    title: '히든카드',
    role: '변호사 남편 역',
    channel: 'SBS',
    length: '1:49',
    img: '/thumbs/video-1.jpg',
  },
  {
    id: 2,
    title: '굿모닝 대한민국 · 사건의 재구성',
    role: '첫사랑 남훈 역',
    channel: 'KBS',
    length: '1:35',
    img: '/thumbs/video-2.jpg',
  },
]

const CREDITS = [
  '히든카드 19회 · SBS',
  '굿모닝 대한민국 사건의 재구성 · KBS',
  '아이엠 닥터 33회 · 채널A',
  '범죄의 재구성 · tvN 2008',
  '오페라스타 · 2011',
]

const Play = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
  </svg>
)

function ContactButtons() {
  const base =
    'inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full text-[15px] tracking-wide transition-colors'
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <a href={`tel:${PHONE.replace(/-/g, '')}`} className={`${base} bg-bone text-ink hover:bg-ember`}>
        전화 {PHONE}
      </a>
      <a href={`mailto:${EMAIL}`} className={`${base} border border-line text-bone hover:border-ember hover:text-ember`}>
        이메일 {EMAIL}
      </a>
    </div>
  )
}

function Player({ video, onClose }: { video: (typeof VIDEOS)[number]; onClose: () => void }) {
  const [src, setSrc] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch(`/api/video?id=${video.id}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: { url?: string }) => {
        if (cancelled) return
        if (d.url) setSrc(d.url)
        else setFailed(true)
      })
      .catch(() => !cancelled && setFailed(true))
    return () => {
      cancelled = true
    }
  }, [video.id])

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !document.fullscreenElement) onClose()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', k)
    return () => {
      window.removeEventListener('keydown', k)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col fade-in" role="dialog" aria-modal aria-label={video.title}>
      <div className="flex items-center justify-between px-5 md:px-10 h-16 shrink-0">
        <div className="min-w-0">
          <p className="font-display truncate">{video.title}</p>
          <p className="text-xs text-dim truncate">
            {video.role} · {video.channel}
          </p>
        </div>
        <button
          onClick={onClose}
          aria-label="닫기"
          className="size-11 grid place-items-center rounded-full border border-line hover:border-ember hover:text-ember transition-colors"
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M5 5l14 14M19 5L5 19" />
          </svg>
        </button>
      </div>

      <div className="flex-1 min-h-0 grid place-items-center px-0 md:px-10 pb-6">
        {src ? (
          <video
            src={src}
            controls
            autoPlay
            playsInline
            preload="metadata"
            poster={video.img}
            controlsList="nodownload"
            onContextMenu={(e) => e.preventDefault()}
            className="max-h-full w-full max-w-5xl bg-black"
          />
        ) : failed ? (
          <p className="text-dim text-center px-6">영상을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>
        ) : (
          <p className="text-dim">불러오는 중…</p>
        )}
      </div>
    </div>
  )
}

function VideoCard({ v, i, onOpen }: { v: (typeof VIDEOS)[number]; i: number; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="group block w-full text-left fade-up"
      style={{ animationDelay: `${0.25 + i * 0.15}s` }}
      aria-label={`${v.title} 재생`}
    >
      <div className="relative aspect-video overflow-hidden rounded-sm bg-panel">
        <img src={v.img} alt={`${v.title} 장면`} className="size-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />
        <span className="absolute inset-0 grid place-items-center">
          <span className="size-16 md:size-20 rounded-full bg-bone/90 text-ink grid place-items-center transition-all duration-300 group-hover:bg-ember group-hover:scale-110">
            <Play className="size-7 md:size-8 ml-1" />
          </span>
        </span>
        <span className="absolute right-3 bottom-3 text-xs tabular-nums bg-black/60 px-2 py-1 rounded-sm">{v.length}</span>
        <span className="absolute left-4 top-4 text-[11px] tracking-[0.3em] text-bone/80">0{i + 1}</span>
      </div>
      <div className="mt-5 flex items-baseline justify-between gap-4">
        <h3 className="font-display text-2xl md:text-3xl font-light">{v.title}</h3>
        <span className="text-xs tracking-[0.25em] text-ember shrink-0">{v.channel}</span>
      </div>
      <p className="mt-1 text-dim">
        {v.role} <span className="mx-1 text-line">·</span> {v.length}
      </p>
    </button>
  )
}

export default function App() {
  const [open, setOpen] = useState<number | null>(null)
  const current = VIDEOS.find((v) => v.id === open)

  return (
    <div className="min-h-screen grain">
      <header className="relative px-6 md:px-12 pt-20 md:pt-28 pb-16 md:pb-24 max-w-6xl mx-auto">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[120%] h-96 bg-[radial-gradient(ellipse_at_center,rgba(224,164,88,0.1),transparent_65%)] pointer-events-none" />
        <div className="relative fade-up">
          <p className="text-[11px] tracking-[0.4em] text-ember mb-6">ACTOR</p>
          <h1 className="font-display font-light text-6xl md:text-8xl leading-none">박건</h1>
          <p className="mt-3 tracking-[0.5em] text-dim text-sm md:text-lg">PARK GUN</p>
          <p className="mt-10 text-lg md:text-xl text-bone/90">배우 · 모든 장르 연기 가능</p>
        </div>
      </header>

      <main className="px-6 md:px-12 max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-[11px] tracking-[0.4em] text-dim">SHOWREEL</h2>
          <span className="h-px flex-1 bg-line" />
        </div>
        <div className="grid gap-14 md:gap-20 max-w-4xl mx-auto md:mx-0 md:ml-auto md:w-[88%]">
          {VIDEOS.map((v, i) => (
            <VideoCard key={v.id} v={v} i={i} onOpen={() => setOpen(v.id)} />
          ))}
        </div>
      </main>

      <footer className="px-6 md:px-12 max-w-6xl mx-auto mt-28 md:mt-40 pb-16">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-[11px] tracking-[0.4em] text-dim">CREDITS</h2>
          <span className="h-px flex-1 bg-line" />
        </div>
        <ul className="divide-y divide-line border-y border-line">
          {CREDITS.map((c) => {
            const [a, b] = c.split(' · ')
            return (
              <li key={c} className="flex items-baseline justify-between py-4">
                <span className="font-display">{a}</span>
                <span className="text-xs tracking-[0.25em] text-dim">{b}</span>
              </li>
            )
          })}
        </ul>
        <div className="mt-16">
          <ContactButtons />
        </div>
      </footer>

      {current && <Player video={current} onClose={() => setOpen(null)} />}
    </div>
  )
}
