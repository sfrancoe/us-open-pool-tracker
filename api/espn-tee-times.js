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
  const start = lines.findIndex((line) => line === 'Tournament Field')
  const end = lines.findIndex((line, index) => index > start && line === 'Glossary')
  if (start < 0 || end < 0) return []

  const rows = lines.slice(start, end)
  const teeTimes = []
  for (let index = 0; index < rows.length - 1; index += 1) {
    const name = rows[index]
    const time = rows[index + 1]
    if (!/^\d{1,2}:\d{2}\s[AP]M\*?$/i.test(time)) continue
    if (['Auto Update:', 'On', 'PLAYER', 'TEE TIME'].includes(name)) continue

    teeTimes.push({
      name: name.replace(/\s*\(a\)$/i, ''),
      teeTime: time.replace('*', ''),
      startHole: time.includes('*') ? 10 : 1,
    })
    index += 1
  }
  return teeTimes
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
