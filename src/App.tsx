import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  AlertTriangle,
  ArrowDownUp,
  BadgeCheck,
  ChevronRight,
  Clipboard,
  Flame,
  Medal,
  RefreshCw,
  Search,
  Shield,
  Trophy,
  Users,
} from 'lucide-react'
import './App.css'
import { poolEntries } from './data/poolEntries'
import { staticTeeTimes } from './data/teeTimes'
import {
  behindLabel,
  buildGolferMap,
  buildTeeTimeMap,
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
  const familyLeader = familyEntries[0]
  const poolLeader = overallEntries[0]
  const bestFamilyPoolRank = [...familyEntries].sort((a, b) => a.poolRank - b.poolRank)[0]
  const familyLeaderCount = familyEntries.filter((entry) => entry.total === familyLeader?.total).length
  const poolLeaderCount = overallEntries.filter((entry) => entry.total === poolLeader?.total).length

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
        <HeroPanel
          familyLeader={familyLeader}
          familyLeaderCount={familyLeaderCount}
          poolLeader={poolLeader}
          poolLeaderCount={poolLeaderCount}
          bestFamilyPoolRank={bestFamilyPoolRank}
          familyEntries={familyEntries}
        />
        {activeView === 'family' && (
          <FamilyView
            entries={familyEntries}
            overallEntries={overallEntries}
          />
        )}
        {activeView === 'overall' && <OverallView entries={overallEntries} />}
        {activeView === 'tee-times' && <TeeTimesView liveScores={liveScores} teeTimes={teeTimes} />}
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
          if (Array.isArray(data.teeTimes) && data.teeTimes.length) nextTeeTimes = data.teeTimes
        } else {
          const html = await teeTimesResponse.value.text()
          const parsed = parseEspnTeeTimesFromHtml(html)
          if (parsed.length) nextTeeTimes = parsed
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
  const start = lines.findIndex((line) => line === 'Tournament Field')
  const end = lines.findIndex((line, index) => index > start && line === 'Glossary')
  if (start < 0 || end < 0) return []

  const rows = lines.slice(start, end)
  const teeTimes: TeeTime[] = []
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

function HeroPanel({
  familyLeader,
  familyLeaderCount,
  poolLeader,
  poolLeaderCount,
  bestFamilyPoolRank,
  familyEntries,
}: {
  familyLeader?: EntryScore
  familyLeaderCount: number
  poolLeader?: EntryScore
  poolLeaderCount: number
  bestFamilyPoolRank?: EntryScore
  familyEntries: EntryScore[]
}) {
  const cutAlerts = familyEntries.reduce((sum, entry) => sum + entry.cutCount, 0)

  return (
    <section className="hero-grid summary-grid">
      <MetricCard icon={<Trophy size={17} />} label="Family leader" value={familyLeaderCount > 1 ? `${familyLeaderCount} tied` : familyLeader?.name ?? '-'} detail={familyLeader?.totalLabel ?? '-'} />
      <MetricCard icon={<Medal size={17} />} label="Overall leader" value={poolLeaderCount > 1 ? `${poolLeaderCount} tied` : poolLeader?.name ?? '-'} detail={poolLeader?.totalLabel ?? '-'} />
      <MetricCard icon={<Users size={17} />} label="Best family pool pos." value={bestFamilyPoolRank ? `#${bestFamilyPoolRank.poolRank}` : '-'} detail={bestFamilyPoolRank?.name ?? '-'} />
      <MetricCard icon={<AlertTriangle size={17} />} label="Cut alerts" value={`${cutAlerts}`} detail="family starters" />
    </section>
  )
}

function MetricCard({ icon, label, value, detail }: { icon: React.ReactNode; label: string; value: string; detail: string }) {
  return (
    <article className="metric-card">
      <span>{icon}</span>
      <p>{label}</p>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  )
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
  overallEntries,
}: {
  entries: EntryScore[]
  overallEntries: EntryScore[]
}) {
  return (
    <div className="view-stack">
      <DramaPanel entries={entries} overallEntries={overallEntries} />
      <section className="scoreboard-card">
        <SectionTitle kicker="Family Race" title="Francoeur standings" action={<CopyStandingsButton entries={entries} />} />
        <div className="entry-list family-list">
          {entries.map((entry) => (
            <FamilyEntryCard key={entry.id} entry={entry} leader={entries[0]} />
          ))}
        </div>
      </section>
    </div>
  )
}

function FamilyEntryCard({ entry, leader }: { entry: EntryScore; leader?: EntryScore }) {
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
          <strong>{entry.totalLabel}</strong>
          <small>{behindLabel(entry.familyBehind ?? entry.total - (leader?.total ?? entry.total))}</small>
        </div>
      </div>
      <RosterChips entry={entry} />
      <div className="bench-status">
        <BadgeCheck size={15} />
        <span>{benchStatus(entry)}</span>
      </div>
    </article>
  )
}

function RosterChips({ entry }: { entry: EntryScore }) {
  return (
    <div className="roster-grid">
      {entry.roster.map((slot, index) => (
        <span key={`${entry.id}-${slot.name}-${slot.state}-${index}`} className={`player-chip ${slot.state}`}>
          <small>{slot.role === 'bench' ? (slot.state === 'promoted' ? 'B+' : 'B') : 'S'}</small>
          <b>{slot.name}</b>
          <em>{slot.golfer.scoreLabel}</em>
        </span>
      ))}
    </div>
  )
}

function benchStatus(entry: EntryScore) {
  if (entry.eliminated) return 'Three starters missed the cut: entry is out after Friday.'
  if (entry.promotedCount === 2) return 'Both bench players are active.'
  if (entry.promotedCount === 1) return 'First bench player is promoted.'
  if (entry.cutCount > 0) return 'Cut pressure is building.'
  return 'Four starters counting; bench is standing by.'
}

function DramaPanel({
  entries,
  overallEntries,
}: {
  entries: EntryScore[]
  overallEntries: EntryScore[]
}) {
  const bestPick = [...entries.flatMap((entry) => entry.roster.map((slot) => ({ ...slot, owner: entry.name })))]
    .sort((a, b) => a.golfer.score - b.golfer.score)[0]
  const topFamily = entries[0]
  const tiedFamilyCount = entries.filter((entry) => entry.total === topFamily?.total).length
  const poolContext = topFamily ? overallEntries.find((entry) => entry.id === topFamily.id) : undefined

  return (
    <section className="drama-panel">
      <article className="drama-card feature">
        <span><Flame size={16} /> Family Drama</span>
        <strong>
          {topFamily
            ? tiedFamilyCount > 1
              ? `${tiedFamilyCount} family entries are tied at ${topFamily.totalLabel}; best big-pool slot is #${poolContext?.poolRank ?? topFamily.poolRank}.`
              : `${topFamily.name} has the house lead, sitting #${poolContext?.poolRank ?? topFamily.poolRank} in the big pool.`
            : 'Waiting for entries.'}
        </strong>
      </article>
      <article className="drama-card">
        <span><ArrowDownUp size={16} /> Pick Swing</span>
        <strong>{bestPick ? `${bestPick.name} is carrying ${bestPick.owner} at ${bestPick.golfer.scoreLabel}.` : 'No picks yet.'}</strong>
      </article>
    </section>
  )
}

function OverallView({ entries }: { entries: EntryScore[] }) {
  const [query, setQuery] = useState('')
  const filtered = entries.filter((entry) => entry.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <section className="scoreboard-card">
      <SectionTitle kicker="Full Pool" title="Overall standings" />
      <label className="search-box">
        <Search size={16} />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search entrants" />
      </label>
      <div className="overall-list">
        {filtered.map((entry) => (
          <article key={entry.id} className={`overall-row ${entry.group === 'family' ? 'family' : ''}`}>
            <span className="rank-token">{entry.poolRank}</span>
            <div>
              <strong>{entry.name}</strong>
            </div>
            <span>{behindLabel(entry.poolBehind)}</span>
            <b>{entry.totalLabel}</b>
            <ChevronRight size={16} />
          </article>
        ))}
      </div>
    </section>
  )
}

function TeeTimesView({ liveScores, teeTimes }: { liveScores: GolferScore[]; teeTimes: TeeTime[] }) {
  const [query, setQuery] = useState('')
  const golferMap = buildGolferMap(liveScores, staticTeeTimes)
  const rows = teeTimes
    .filter((teeTime) => teeTime.name.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => {
      const golferA = golferMap.get(normalizeName(a.name))
      const golferB = golferMap.get(normalizeName(b.name))
      const pendingA = !golferA || golferA.status === 'pending' ? 1 : 0
      const pendingB = !golferB || golferB.status === 'pending' ? 1 : 0
      return (
        pendingA - pendingB ||
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
      <div className="tee-list">
        {rows.map((teeTime) => {
          const golfer = golferMap.get(normalizeName(teeTime.name))
          return (
            <article key={`${teeTime.name}-${teeTime.teeTime}-${teeTime.startHole}`} className="tee-row">
              <div>
                <strong>{teeTime.name}</strong>
                <small>{golfer?.country ?? 'U.S. Open field'}</small>
              </div>
              <em className={scoreClass(golfer?.score ?? 0)}>
                <span>{golfer?.scoreLabel ?? 'E'}</span>
                <small>({playPositionLabel(golfer, teeTime)})</small>
              </em>
            </article>
          )
        })}
      </div>
    </section>
  )
}

function playPositionLabel(golfer: GolferScore | undefined, teeTime: TeeTime) {
  if (!golfer || golfer.status === 'pending') return teeTime.teeTime
  if (golfer.status === 'withdrawn') return 'WD'
  if (golfer.status === 'cut') return 'CUT'
  if (golfer.status === 'final' || golfer.thru === 'F') return 'F'

  const thru = Number(golfer.thru)
  const completedHoles = Number.isFinite(thru) ? thru : golfer.holes.length
  if (completedHoles >= 18) return 'F'

  const startHole = golfer.startHole ?? teeTime.startHole
  return String(nextHoleFromStart(startHole, Math.max(completedHoles, 0)))
}

function nextHoleFromStart(startHole: TeeTime['startHole'], completedHoles: number) {
  return ((startHole - 1 + completedHoles) % 18) + 1
}

function SectionTitle({ kicker, title, action }: { kicker: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="section-title">
      <div>
        <span className="eyebrow">{kicker}</span>
        <h3>{title}</h3>
      </div>
      {action}
    </div>
  )
}

function CopyStandingsButton({ entries }: { entries: EntryScore[] }) {
  const [copied, setCopied] = useState(false)

  async function copyStandings() {
    const text = [
      'Francoeur Family US Open Pool',
      '',
      ...entries.map((entry) => `${entry.familyRank}. ${entry.name} ${entry.totalLabel} · Pool #${entry.poolRank} · ${behindLabel(entry.familyBehind ?? 0)}`),
    ].join('\n')

    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1400)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button type="button" className="copy-button" onClick={copyStandings}>
      <Clipboard size={15} />
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

function scoreClass(score: number) {
  if (score < 0) return 'under'
  if (score > 0) return 'over'
  return 'even'
}

export default App
