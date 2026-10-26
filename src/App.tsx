import { useEffect, useRef, useState } from 'react'

const PHONE = '010-1234-5678'
const EMAIL = 'parkgun.actor@gmail.com'

const VIDEOS = [
  {
    id: 1,
    title: '그날의 증언',
    role: '용의자 김도현 역',
    channel: 'KBS2',
    length: '3:02',
    seconds: 182,
    img: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1600&h=900&fit=crop&auto=format',
  },
  {
    id: 2,
    title: '침묵의 골목',
    role: '형사 이민재 역',
    channel: 'SBS',
    length: '2:54',
    seconds: 174,
    img: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1600&h=900&fit=crop&auto=format',
  },
]

const CREDITS = [
  '그날의 증언 · KBS2',
  '침묵의 골목 · SBS',
  '사건의 재구성 · MBC',
  '실화탐사 · SBS',
  '그것이 알고 싶다 · SBS',
]

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

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
        이메일
      </a>
    </div>
  )
}

function Player({ video, onClose }: { video: (typeof VIDEOS)[number]; onClose: () => void }) {
  const [playing, setPlaying] = useState(true)
  const [t, setT] = useState(0)
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setT((x) => Math.min(video.seconds, x + 0.25)), 250)
    return () => clearInterval(id)
  }, [playing, video.seconds])

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !document.fullscreenElement) onClose()
      if (e.key === ' ') {
        e.preventDefault()
        setPlaying((p) => !p)
      }
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', k)
    return () => {
      window.removeEventListener('keydown', k)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const toggleFs = () => {
    if (document.fullscreenElement) document.exitFullscreen()
    else root.current?.requestFullscreen?.()
  }

  return (
    <div ref={root} className="fixed inset-0 z-50 bg-black flex flex-col fade-in" role="dialog" aria-modal aria-label={video.title}>
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

      <div className="relative flex-1 min-h-0 grid place-items-center" onClick={() => setPlaying((p) => !p)}>
        <img src={video.img} alt="" className={`absolute inset-0 size-full object-contain md:object-cover transition-opacity duration-500 ${playing ? 'opacity-90' : 'opacity-50'}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" />
        {!playing && (
          <span className="relative size-20 rounded-full bg-bone/90 text-ink grid place-items-center">
            <Play className="size-8 ml-1" />
          </span>
        )}
      </div>

      <div className="shrink-0 px-5 md:px-10 pt-4 pb-6 bg-black">
        <input
          type="range"
          min={0}
          max={video.seconds}
          step={0.25}
          value={t}
          onChange={(e) => setT(Number(e.target.value))}
          aria-label="재생 위치"
          className="w-full h-1 appearance-none rounded-full cursor-pointer accent-[#e0a458]"
          style={{
            background: `linear-gradient(to right, #e0a458 ${(t / video.seconds) * 100}%, rgba(244,236,224,.18) 0)`,
          }}
        />
        <div className="mt-4 flex items-center gap-4 text-sm tabular-nums">
          <button
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? '일시정지' : '재생'}
            className="size-11 grid place-items-center rounded-full bg-bone text-ink hover:bg-ember transition-colors"
          >
            {playing ? (
              <svg viewBox="0 0 24 24" className="size-5" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
            ) : (
              <Play className="size-5 ml-0.5" />
            )}
          </button>
          <span className="text-dim">
            {fmt(t)} / {video.length}
          </span>
          <button
            onClick={toggleFs}
            aria-label="전체화면"
            className="ml-auto size-11 grid place-items-center rounded-full border border-line hover:border-ember hover:text-ember transition-colors"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
            </svg>
          </button>
        </div>
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
        {v.role} <span className="mx-1 text-line">·</span> 약 3분
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
          <p className="mt-10 text-lg md:text-xl text-bone/90">재연배우 · 범죄·사건 재현 전문</p>
          <div className="mt-10">
            <ContactButtons />
          </div>
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
        <div className="mt-20 md:flex items-end justify-between gap-8">
          <div className="mb-8 md:mb-0">
            <p className="font-display text-3xl font-light">박건</p>
            <p className="text-xs tracking-[0.4em] text-dim mt-1">PARK GUN</p>
          </div>
          <ContactButtons />
        </div>
      </footer>

      {current && <Player video={current} onClose={() => setOpen(null)} />}
    </div>
  )
}
