// 비공개 버킷의 영상에 대해 1시간짜리 임시 재생 주소를 발급합니다.
// 서비스 키는 서버에서만 사용하며 브라우저로 내려가지 않습니다.

export type SignEnv = {
  SUPABASE_URL?: string
  SUPABASE_SERVICE_ROLE_KEY?: string
  SUPABASE_VIDEO_BUCKET?: string
  ADMIN_PASSWORD?: string
}

// 영상 id -> 버킷 안의 파일명. 영상을 올릴 때 이 이름으로 올립니다.
export const VIDEO_FILES: Record<string, string> = {
  '1': 'video-1.mp4',
  '2': 'video-2.mp4',
}

export async function signVideo(
  id: string,
  env: SignEnv,
): Promise<{ status: number; body: { url?: string; error?: string } }> {
  const file = VIDEO_FILES[id]
  if (!file) return { status: 404, body: { error: 'not found' } }

  const base = env.SUPABASE_URL?.replace(/\/$/, '')
  const key = env.SUPABASE_SERVICE_ROLE_KEY
  if (!base || !key) return { status: 500, body: { error: 'server not configured' } }
  const bucket = env.SUPABASE_VIDEO_BUCKET || 'profile-videos'

  const res = await fetch(`${base}/storage/v1/object/sign/${bucket}/${file}`, {
    method: 'POST',
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ expiresIn: 3600 }),
  })
  if (!res.ok) return { status: 404, body: { error: 'video file missing' } }

  const data = (await res.json()) as { signedURL?: string }
  if (!data.signedURL) return { status: 500, body: { error: 'sign failed' } }
  return { status: 200, body: { url: `${base}/storage/v1${data.signedURL}` } }
}

// 관리자 화면에서 브라우저가 Supabase로 직접 올릴 수 있는 1회용 업로드 주소를 발급합니다.
// (파일이 서버를 거치지 않으므로 Vercel의 요청 크기 제한과 무관합니다.)
export async function signUpload(
  id: string,
  adminKey: string | undefined,
  env: SignEnv,
): Promise<{ status: number; body: { url?: string; error?: string } }> {
  if (!env.ADMIN_PASSWORD || adminKey !== env.ADMIN_PASSWORD) {
    return { status: 401, body: { error: 'unauthorized' } }
  }
  const file = VIDEO_FILES[id]
  if (!file) return { status: 404, body: { error: 'not found' } }

  const base = env.SUPABASE_URL?.replace(/\/$/, '')
  const key = env.SUPABASE_SERVICE_ROLE_KEY
  if (!base || !key) return { status: 500, body: { error: 'server not configured' } }
  const bucket = env.SUPABASE_VIDEO_BUCKET || 'profile-videos'

  const res = await fetch(`${base}/storage/v1/object/upload/sign/${bucket}/${file}`, {
    method: 'POST',
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'x-upsert': 'true' },
  })
  if (!res.ok) return { status: 500, body: { error: 'sign failed' } }
  const data = (await res.json()) as { url?: string }
  if (!data.url) return { status: 500, body: { error: 'sign failed' } }
  return { status: 200, body: { url: `${base}/storage/v1${data.url}` } }
}
