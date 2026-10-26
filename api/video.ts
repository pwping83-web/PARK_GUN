// Vercel 서버리스 함수: GET /api/video?id=1
import { signVideo } from './_lib/sign.js'

export default async function handler(
  req: { query: Record<string, string | string[] | undefined> },
  res: {
    status: (n: number) => { json: (b: unknown) => void }
    setHeader: (k: string, v: string) => void
  },
) {
  const raw = req.query.id
  const id = Array.isArray(raw) ? raw[0] : raw
  const out = await signVideo(String(id ?? ''), process.env)
  res.setHeader('Cache-Control', 'no-store')
  res.status(out.status).json(out.body)
}
