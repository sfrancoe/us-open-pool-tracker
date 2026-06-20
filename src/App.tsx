import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  RefreshCw,
  Search,
  Shield,
} from 'lucide-react'
import './App.css'
import { poolEntries } from './data/poolEntries'
import { staticTeeTimes } from './data/teeTimes'
import {
  behindLabel,
  buildGolferMap,
  buildTeeTimeMap,
  isPoolCut,
  normalizeName,
  scoreEntries,
  timeToMinutes,
  toGolferScores,
  type EntryScore,
  type EspnEvent,
  type GolferScore,
  type TeeTime,
} from './lib/scoring'

type ActiveView = 'family' | 'overall' | 'tee-times'

const ESPN_EVENT_ID = '401811952'

const scoreboardUrl =
  import.meta.env.DEV
    ? `/espn-site/apis/site/v2/sports/golf/pga/scoreboard?event=${ESPN_EVENT_ID}`
    : '/api/espn-scoreboard'

const teeTimesUrl = import.meta.env.DEV
  ? '/espn-page/golf/leaderboard/_/tournamentId/401811952'
  : '/api/espn-tee-times'

function cacheBustedUrl(url: string) {
  return `${url}${url.includes('?') ? '&' : '?'}_=${Date.now()}`
}

function App() {
  const [activeView, setActiveView] = useState<ActiveView>('tee-times')
  const { event, liveScores, teeTimes, updatedAt, isLoading, isRefreshing, error, refreshScores } = useTournamentData()
  const golferMap = useMemo(() => buildGolferMap(liveScores, staticTeeTimes), [liveScores])
  const scoredEntries = useMemo(() => scoreEntries(poolEntries, golferMap), [golferMap])
  const familyEntries = scoredEntries
    .filter((entry) => entry.group === 'family')
    .sort((a, b) => (a.familyRank ?? 99) - (b.familyRank ?? 99) || a.name.localeCompare(b.name))
  const overallEntries = scoredEntries
  const currentRound = useMemo(() => currentRoundDay(liveScores), [liveScores])

  return (
    <main className="app-shell">
      <Header
        event={event}
        updatedAt={updatedAt}
        isLoading={isLoading}
        isRefreshing={isRefreshing}
        error={error}
        refreshScores={refreshScores}
      />
      <ViewTabs activeView={activeView} setActiveView={setActiveView} />
      <section className="mobile-stage">
        {activeView === 'family' && (
          <FamilyView
            entries={familyEntries}
            currentRound={currentRound}
          />
        )}
        {activeView === 'overall' && <OverallView entries={overallEntries} currentRound={currentRound} />}
        {activeView === 'tee-times' && <TeeTimesView liveScores={liveScores} teeTimes={teeTimes} currentRound={currentRound} />}
      </section>
    </main>
  )
}

function useTournamentData() {
  const [event, setEvent] = useState<EspnEvent | null>(null)
  const [teeTimes, setTeeTimes] = useState<TeeTime[]>(staticTeeTimes)
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isMounted = useRef(true)

  const load = useCallback(async ({ silent = false }: { silent?: boolean } = {}) => {
    if (!silent) setIsRefreshing(true)
    try {
      const [scoreboardResponse, teeTimesResponse] = await Promise.allSettled([
        fetch(cacheBustedUrl(scoreboardUrl)),
        fetch(cacheBustedUrl(teeTimesUrl)),
      ])

      if (scoreboardResponse.status !== 'fulfilled' || !scoreboardResponse.value.ok) {
        throw new Error('Unable to load ESPN scores')
      }

      const scoreboardData = await scoreboardResponse.value.json()
      const nextEvent = scoreboardData?.events?.[0] as EspnEvent | undefined
      if (!nextEvent?.competitions?.[0]?.competitors?.length) {
        throw new Error('No U.S. Open leaderboard rows found')
      }

      let nextTeeTimes = staticTeeTimes
      if (teeTimesResponse.status === 'fulfilled' && teeTimesResponse.value.ok) {
        const contentType = teeTimesResponse.value.headers.get('content-type') ?? ''
        if (contentType.includes('application/json')) {
          const data = await teeTimesResponse.value.json()
          if (Array.isArray(data.teeTimes) && data.teeTimes.length) nextTeeTimes = mergeTeeTimes(staticTeeTimes, data.teeTimes)
        } else {
          const html = await teeTimesResponse.value.text()
          const parsed = parseEspnTeeTimesFromHtml(html)
          if (parsed.length) nextTeeTimes = mergeTeeTimes(staticTeeTimes, parsed)
        }
      }

      if (!isMounted.current) return
      setEvent(nextEvent)
      setTeeTimes(nextTeeTimes)
      setUpdatedAt(new Date())
      setError(null)
    } catch (caught) {
      if (!isMounted.current) return
      setError(caught instanceof Error ? caught.message : 'Unable to load tournament data')
    } finally {
      if (isMounted.current) {
        setIsLoading(false)
        if (!silent) setIsRefreshing(false)
      }
    }
  }, [])

  useEffect(() => {
    isMounted.current = true
    window.setTimeout(() => {
      if (isMounted.current) load({ silent: true })
    }, 0)
    const timer = window.setInterval(() => {
      load({ silent: true })
    }, 60000)

    return () => {
      isMounted.current = false
      window.clearInterval(timer)
    }
  }, [load])

  const liveScores = useMemo(() => {
    const teeMap = buildTeeTimeMap(staticTeeTimes, teeTimes)
    return toGolferScores(event, [...teeMap.values()])
  }, [event, teeTimes])

  return { event, liveScores, teeTimes, updatedAt, isLoading, isRefreshing, error, refreshScores: load }
}

function mergeTeeTimes(fallbackTeeTimes: TeeTime[], updatedTeeTimes: TeeTime[]) {
  const updatesByName = new Map(updatedTeeTimes.map((teeTime) => [normalizeName(teeTime.name), teeTime]))
  const fallbackNames = new Set(fallbackTeeTimes.map((teeTime) => normalizeName(teeTime.name)))

  return [
    ...fallbackTeeTimes.map((teeTime) => updatesByName.get(normalizeName(teeTime.name)) ?? teeTime),
    ...updatedTeeTimes.filter((teeTime) => !fallbackNames.has(normalizeName(teeTime.name))),
  ]
}

function parseEspnTeeTimesFromHtml(html: string): TeeTime[] {
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
  const teeTimes: TeeTime[] = []
  const seen = new Set<string>()

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

function findGolferNameBeforeTime(rows: string[], timeIndex: number) {
  for (let offset = 1; offset <= 8; offset += 1) {
    const candidate = rows[timeIndex - offset]
    if (isLikelyGolferName(candidate)) return candidate
  }
  return null
}

function isLikelyGolferName(value?: string) {
  if (!value) return false
  if (['Auto Update:', 'On', 'PLAYER', 'TEE TIME', 'Leaderboard', 'Round 1'].includes(value)) return false
  if (/^\d{1,2}:\d{2}\s[AP]M\*?$/i.test(value)) return false
  if (/^(?:-|--|E|F|WD|CUT|T?\d+\*?|[+-]\d+)$/i.test(value)) return false
  return /[A-Za-zÀ-ÖØ-öø-ÿ]/.test(value)
}

function Header({
  event,
  updatedAt,
  isLoading,
  isRefreshing,
  error,
  refreshScores,
}: {
  event: EspnEvent | null
  updatedAt: Date | null
  isLoading: boolean
  isRefreshing: boolean
  error: string | null
  refreshScores: () => void
}) {
  const statusLabel = isLoading ? 'Syncing' : error ? 'Retry needed' : 'Live'

  return (
    <header className="app-header">
      <div className="brand-mark" aria-hidden="true">
        <Shield size={24} />
      </div>
      <div className="header-copy">
        <p>2026 Pool Tracker</p>
        <h1>{event?.name ?? 'US Open Pool Tracker'}</h1>
        <span>Shinnecock Hills · Southampton, NY · ESPN live scoring</span>
      </div>
      <div className={`sync-panel ${error ? 'error' : ''}`}>
        <div className="sync-copy">
          <span>{statusLabel}</span>
          <small>{updatedAt ? `Updated ${formatUpdateTime(updatedAt)}` : 'Update pending'}</small>
        </div>
        <button type="button" className="refresh-button" onClick={refreshScores} disabled={isRefreshing || isLoading}>
          <RefreshCw size={15} className={isRefreshing || isLoading ? 'spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>
    </header>
  )
}

function formatUpdateTime(date: Date) {
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

function ViewTabs({ activeView, setActiveView }: { activeView: ActiveView; setActiveView: (view: ActiveView) => void }) {
  const tabs: Array<{ id: ActiveView; label: string }> = [
    { id: 'tee-times', label: 'Leaderboard' },
    { id: 'overall', label: 'Overall' },
    { id: 'family', label: 'Francoeur Family' },
  ]

  return (
    <nav className="view-tabs" aria-label="Pool views">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={activeView === tab.id ? 'active' : ''}
          onClick={() => setActiveView(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}

function FamilyView({
  entries,
  currentRound,
}: {
  entries: EntryScore[]
  currentRound: number
}) {
  return (
    <div className="view-stack">
      <section className="scoreboard-card">
        <div className="entry-list family-list">
          {entries.map((entry) => (
            <FamilyEntryCard key={entry.id} entry={entry} leader={entries[0]} currentRound={currentRound} />
          ))}
        </div>
      </section>
    </div>
  )
}

function FamilyEntryCard({ entry, leader, currentRound }: { entry: EntryScore; leader?: EntryScore; currentRound: number }) {
  return (
    <article className={`entry-card ${entry.familyRank === 1 ? 'leader' : ''} ${entry.eliminated ? 'eliminated' : ''}`}>
      <div className="entry-topline">
        <span className="rank-token">{entry.familyRank}</span>
        <div className="entry-name">
          <strong>{entry.name}</strong>
          <small>
            Pool #{entry.poolRank} · {behindLabel(entry.poolBehind)} overall
          </small>
        </div>
        <div className="entry-score">
          <strong className={scoreClass(entry.total)}>{entry.totalLabel}</strong>
          <small>{behindLabel(entry.familyBehind ?? entry.total - (leader?.total ?? entry.total))}</small>
        </div>
      </div>
      <RosterChips entry={entry} currentRound={currentRound} />
    </article>
  )
}

function RosterChips({ entry, currentRound }: { entry: EntryScore; currentRound: number }) {
  return (
    <div className="roster-grid with-scores">
      <div className="roster-score-header" aria-hidden="true">
        <span>Today</span>
        <span>Hole</span>
        <span>Total</span>
      </div>
      {entry.roster.map((slot, index) => {
        const today = todayScore(slot.golfer, currentRound)
        return (
          <span key={`${entry.id}-${slot.name}-${slot.state}-${index}`} className={`player-chip with-scores ${slot.state}`}>
            <small>{slot.role === 'bench' ? (slot.state === 'promoted' ? 'B+' : 'B') : 'S'}</small>
            <b>{slot.name}</b>
            <span className={`today-score ${today.score === null ? '' : scoreClass(today.score)}`}>{today.label}</span>
            <span className="hole-label">{playPositionLabel(slot.golfer, currentRound)}</span>
            <em className={scoreClass(slot.golfer.score)}>{slot.golfer.scoreLabel}</em>
          </span>
        )
      })}
      {entry.penaltyStrokes > 0 && (
        <div className="penalty-row">
          <span>Bench penalty</span>
          <b className="over">+{entry.penaltyStrokes}</b>
        </div>
      )}
    </div>
  )
}

function OverallView({ entries, currentRound }: { entries: EntryScore[]; currentRound: number }) {
  const [query, setQuery] = useState('')
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null)
  const filtered = entries.filter((entry) => entry.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <section className="scoreboard-card">
      <SectionTitle kicker="Full Pool" title="Overall standings" />
      <label className="search-box">
        <Search size={16} />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search entrants" />
      </label>
      <div className="overall-list">
        {filtered.map((entry) => {
          const isExpanded = expandedEntryId === entry.id
          const picksId = `overall-picks-${entry.id}`

          return (
            <article key={entry.id} className={`overall-entry ${entry.group === 'family' ? 'family' : ''} ${entry.eliminated ? 'eliminated' : ''}`}>
              <button
                type="button"
                className="overall-row"
                aria-expanded={isExpanded}
                aria-controls={picksId}
                onClick={() => setExpandedEntryId(isExpanded ? null : entry.id)}
              >
                <span className="rank-token">{entry.poolRank}</span>
                <div>
                  <strong>{entry.name}</strong>
                </div>
                <span>{behindLabel(entry.poolBehind)}</span>
                <b className={scoreClass(entry.total)}>{entry.totalLabel}</b>
              </button>
              {isExpanded && (
                <div id={picksId} className="overall-picks">
                  <RosterChips entry={entry} currentRound={currentRound} />
                </div>
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}

function TeeTimesView({ liveScores, teeTimes, currentRound }: { liveScores: GolferScore[]; teeTimes: TeeTime[]; currentRound: number }) {
  const [query, setQuery] = useState('')
  const golferMap = buildGolferMap(liveScores, staticTeeTimes)
  const rows = teeTimes
    .filter((teeTime) => teeTime.name.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => {
      const golferA = golferMap.get(normalizeName(a.name))
      const golferB = golferMap.get(normalizeName(b.name))
      const cutA = isPoolCut(golferA) ? 1 : 0
      const cutB = isPoolCut(golferB) ? 1 : 0
      const startedA = cutA ? 0 : hasStartedRound(golferA, currentRound) ? 0 : 1
      const startedB = cutB ? 0 : hasStartedRound(golferB, currentRound) ? 0 : 1
      return (
        cutA - cutB ||
        startedA - startedB ||
        (golferA?.score ?? 0) - (golferB?.score ?? 0) ||
        (golferA?.place ?? 999) - (golferB?.place ?? 999) ||
        timeToMinutes(a.teeTime) - timeToMinutes(b.teeTime) ||
        a.name.localeCompare(b.name)
      )
    })

  return (
    <section className="scoreboard-card">
      <SectionTitle kicker="Tournament" title="Leaderboard" />
      <label className="search-box">
        <Search size={16} />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search golfers" />
      </label>
      <div className="tee-header" aria-hidden="true">
        <span />
        <span>Today</span>
        <span>Hole</span>
        <span>Total</span>
      </div>
      <div className="tee-list">
        {rows.map((teeTime) => {
          const golfer = golferMap.get(normalizeName(teeTime.name))
          const today = todayScore(golfer, currentRound, teeTime)
          return (
            <article key={`${teeTime.name}-${teeTime.teeTime}-${teeTime.startHole}`} className={`tee-row ${isPoolCut(golfer) ? 'cut' : ''}`}>
              <div>
                <strong>{teeTime.name}</strong>
                <small>{golfer?.country ?? 'U.S. Open field'}</small>
              </div>
              <strong className={`today-score ${today.score === null ? '' : scoreClass(today.score)}`}>{today.label}</strong>
              <span className="hole-label">{playPositionLabel(golfer, currentRound, teeTime)}</span>
              <em className={scoreClass(golfer?.score ?? 0)}>{golfer?.scoreLabel ?? 'E'}</em>
            </article>
          )
        })}
      </div>
    </section>
  )
}

function hasStartedRound(golfer: GolferScore | undefined, currentRound: number) {
  const round = golfer?.rounds.find((score) => score.day === currentRound)
  if (!round?.available) return false
  const thru = Number(round.thru)
  const completedHoles = Number.isFinite(thru) ? thru : round.holes.length
  return round.score !== null || completedHoles > 0
}

function currentRoundDay(golfers: GolferScore[]) {
  const dataRound = golfers.reduce((round, golfer) => {
    const latestRound = golfer.rounds.reduce((latest, score) => score.available ? Math.max(latest, score.day) : latest, 1)
    return Math.max(round, latestRound)
  }, 1)

  return Math.max(dataRound, scheduledRoundDay())
}

function scheduledRoundDay(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now)
  const datePart = (type: string) => Number(parts.find((part) => part.type === type)?.value)
  const currentDate = Date.UTC(datePart('year'), datePart('month') - 1, datePart('day'))
  const roundOneDate = Date.UTC(2026, 5, 18)
  const round = Math.floor((currentDate - roundOneDate) / 86_400_000) + 1
  return Math.min(4, Math.max(1, round))
}

function todayScore(golfer: GolferScore | undefined, currentRound: number, teeTime?: TeeTime) {
  const round = golfer?.rounds.find((score) => score.day === currentRound)
  if (!round?.available || round.score === null) {
    if (isPoolCut(golfer)) return { label: '-', score: null }
    return { label: golfer?.teeTime ?? teeTime?.teeTime ?? '-', score: null }
  }
  return { label: round.scoreLabel, score: round.score }
}

function playPositionLabel(golfer: GolferScore | undefined, currentRound: number, teeTime?: TeeTime) {
  const round = golfer?.rounds.find((score) => score.day === currentRound)
  if (!golfer || !round?.available) return '-'
  if (golfer.status === 'withdrawn') return 'WD'
  if (golfer.status === 'cut') return 'CUT'
  if (round.status === 'final' || round.thru === 'F') return 'F'

  const thru = Number(round.thru)
  const completedHoles = Number.isFinite(thru) ? thru : round.holes.length
  if (round.score === null && completedHoles === 0) return '-'
  if (completedHoles >= 18) return 'F'

  const startHole = golfer.startHole ?? teeTime?.startHole ?? 1
  const marker = startHole === 10 ? '*' : ''
  return `${nextHoleFromStart(startHole, Math.max(completedHoles, 0))}${marker}`
}

function nextHoleFromStart(startHole: TeeTime['startHole'], completedHoles: number) {
  return ((startHole - 1 + completedHoles) % 18) + 1
}

function SectionTitle({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="section-title">
      <div>
        <span className="eyebrow">{kicker}</span>
        <h3>{title}</h3>
      </div>
    </div>
  )
}

function scoreClass(score: number) {
  if (score < 0) return 'under'
  if (score > 0) return 'over'
  return 'even'
}

export default App
