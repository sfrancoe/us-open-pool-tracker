const espnUrl =
  'https://site.api.espn.com/apis/site/v2/sports/golf/pga/scoreboard?event=401811952'

export default async function handler(_request, response) {
  try {
    const espnResponse = await fetch(`${espnUrl}&_=${Date.now()}`)

    if (!espnResponse.ok) {
      response.status(espnResponse.status).json({ error: 'Unable to load ESPN scores' })
      return
    }

    response.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60')
    response.status(200).json(await espnResponse.json())
  } catch {
    response.status(502).json({ error: 'Score feed unavailable' })
  }
}
