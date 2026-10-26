// Vercel 서버리스 함수: POST /api/upload  (헤더 x-admin-key, 본문 {"id":"1"})
import { signUpload } from './_lib/sign.js'

export default async function handler(
  req: { method?: string; body?: unknown; headers: Record<string, string | string[] | undefined> },
  res: {
    status: (n: number) => { json: (b: unknown) => void }
    setHeader: (k: string, v: string) => void
  },
) {
  res.setHeader('Cache-Control', 'no-store')
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' })

  const body = (typeof req.body === 'string' ? safeJson(req.body) : req.body) as { id?: unknown } | null
  const rawKey = req.headers['x-admin-key']
  const adminKey = Array.isArray(rawKey) ? rawKey[0] : rawKey
  const out = await signUpload(String(body?.id ?? ''), adminKey, process.env)
  res.status(out.status).json(out.body)
}

function safeJson(s: string) {
  try {
    return JSON.parse(s)
  } catch {
    return null
  }
}
