const teeTimesUrl = 'https://www.espn.com/golf/leaderboard/_/tournamentId/401811952'

function parseTeeTimes(html) {
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, '\n')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')

  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
  const rows = lines
  const teeTimes = []
  const seen = new Set()

  for (let index = 0; index < rows.length; index += 1) {
    const time = rows[index]
    if (!/^\d{1,2}:\d{2}\s[AP]M\*?$/i.test(time)) continue

    const name = findGolferNameBeforeTime(rows, index)
    if (!name) continue

    const normalizedName = name.replace(/\s*\(a\)$/i, '')
    if (seen.has(normalizedName.toLowerCase())) continue
    seen.add(normalizedName.toLowerCase())

    teeTimes.push({
      name: normalizedName,
      teeTime: time.replace('*', ''),
      startHole: time.includes('*') ? 10 : 1,
    })
  }
  return teeTimes
}

function findGolferNameBeforeTime(rows, timeIndex) {
  for (let offset = 1; offset <= 8; offset += 1) {
    const candidate = rows[timeIndex - offset]
    if (isLikelyGolferName(candidate)) return candidate
  }
  return null
}

function isLikelyGolferName(value) {
  if (!value) return false
  if (['Auto Update:', 'On', 'PLAYER', 'TEE TIME', 'Leaderboard', 'Round 1'].includes(value)) return false
  if (/^\d{1,2}:\d{2}\s[AP]M\*?$/i.test(value)) return false
  if (/^(?:-|--|E|F|WD|CUT|T?\d+\*?|[+-]\d+)$/i.test(value)) return false
  return /[A-Za-zÀ-ÖØ-öø-ÿ]/.test(value)
}

export default async function handler(_request, response) {
  try {
    const espnResponse = await fetch(`${teeTimesUrl}?_=${Date.now()}`)

    if (!espnResponse.ok) {
      response.status(espnResponse.status).json({ error: 'Unable to load ESPN tee times' })
      return
    }

    const html = await espnResponse.text()
    response.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=1800')
    response.status(200).json({ teeTimes: parseTeeTimes(html) })
  } catch {
    response.status(502).json({ error: 'Tee-time feed unavailable' })
  }
}
