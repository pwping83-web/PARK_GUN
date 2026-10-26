import { useState } from 'react'

const SLOTS = [
  { id: '1', label: '영상 1' },
  { id: '2', label: '영상 2' },
]

type Status = { kind: 'idle' | 'busy' | 'ok' | 'err'; text: string }

function upload(url: string, file: File, onProgress: (p: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('PUT', url)
    xhr.setRequestHeader('Content-Type', 'video/mp4')
    xhr.setRequestHeader('x-upsert', 'true')
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100))
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve()
      else if (xhr.status === 413) reject(new Error('파일이 너무 큽니다. 50MB 이하로 압축해 주세요.'))
      else reject(new Error(`업로드 실패 (${xhr.status})`))
    }
    xhr.onerror = () => reject(new Error('네트워크 오류로 업로드하지 못했습니다.'))
    xhr.send(file)
  })
}

function Slot({ id, label, adminKey }: { id: string; label: string; adminKey: string }) {
  const [status, setStatus] = useState<Status>({ kind: 'idle', text: '파일을 선택하면 바로 올라갑니다.' })
  const [preview, setPreview] = useState<string | null>(null)

  const onPick = async (file: File | undefined) => {
    if (!file) return
    setPreview(null)
    if (!/\.(mp4|m4v)$/i.test(file.name) && file.type !== 'video/mp4') {
      setStatus({ kind: 'err', text: 'mp4 파일만 올릴 수 있습니다.' })
      return
    }
    setStatus({ kind: 'busy', text: '준비 중…' })
    try {
      const r = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
        body: JSON.stringify({ id }),
      })
      if (r.status === 401) throw new Error('관리자 비밀번호가 맞지 않습니다.')
      const d = (await r.json()) as { url?: string }
      if (!r.ok || !d.url) throw new Error('업로드 주소를 받지 못했습니다.')
      await upload(d.url, file, (p) => setStatus({ kind: 'busy', text: `올리는 중… ${p}%` }))
      setStatus({ kind: 'ok', text: `올라갔습니다 (${(file.size / 1024 / 1024).toFixed(1)}MB)` })
      const v = await fetch(`/api/video?id=${id}`).then((x) => x.json() as Promise<{ url?: string }>)
      if (v.url) setPreview(v.url)
    } catch (e) {
      setStatus({ kind: 'err', text: e instanceof Error ? e.message : '업로드에 실패했습니다.' })
    }
  }

  const color =
    status.kind === 'ok' ? 'text-ember' : status.kind === 'err' ? 'text-red-400' : 'text-dim'

  return (
    <section className="border border-line rounded-sm p-5 bg-panel">
      <h2 className="font-display text-xl">{label}</h2>
      <p className="text-xs text-dim mt-1">저장 이름: video-{id}.mp4 (다시 올리면 교체됩니다)</p>
      <input
        type="file"
        accept="video/mp4"
        disabled={status.kind === 'busy'}
        onChange={(e) => onPick(e.target.files?.[0])}
        className="mt-4 block w-full text-sm file:mr-4 file:rounded-full file:border-0 file:bg-bone file:px-5 file:py-2.5 file:text-ink hover:file:bg-ember"
      />
      <p className={`mt-3 text-sm ${color}`}>{status.text}</p>
      {preview && <video src={preview} controls playsInline preload="metadata" className="mt-4 w-full bg-black" />}
    </section>
  )
}

export default function Admin() {
  const [key, setKey] = useState(() => {
    try {
      return sessionStorage.getItem('pg_admin') ?? ''
    } catch {
      return ''
    }
  })
  const [entered, setEntered] = useState(Boolean(key))

  if (!entered) {
    return (
      <div className="min-h-screen grid place-items-center px-6">
        <form
          className="w-full max-w-xs grid gap-3 text-center"
          onSubmit={(e) => {
            e.preventDefault()
            try {
              sessionStorage.setItem('pg_admin', key)
            } catch {
              /* 저장 실패해도 계속 진행 */
            }
            setEntered(true)
          }}
        >
          <h1 className="font-display text-2xl">영상 관리</h1>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="관리자 비밀번호"
            className="h-12 px-4 rounded-full bg-panel border border-line text-bone"
            autoFocus
          />
          <button className="h-12 rounded-full bg-bone text-ink hover:bg-ember transition-colors">입장</button>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-6 md:px-12 py-14 max-w-3xl mx-auto">
      <h1 className="font-display text-3xl font-light">영상 관리</h1>
      <p className="mt-2 text-dim text-sm">mp4 파일을 고르면 사이트의 재생 영상이 바로 바뀝니다. 파일당 50MB 이하.</p>
      <div className="mt-8 grid gap-6">
        {SLOTS.map((s) => (
          <Slot key={s.id} id={s.id} label={s.label} adminKey={key} />
        ))}
      </div>
      <a href="/" className="inline-block mt-10 text-sm text-dim hover:text-ember">
        ← 프로필 보기
      </a>
    </div>
  )
}
