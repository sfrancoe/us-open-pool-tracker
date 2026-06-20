import type { PoolEntry } from '../data/poolEntries'
import type { StaticTeeTime } from '../data/teeTimes'

export type EspnHoleScore = {
  period?: number
  value?: number
  displayValue?: string
  scoreType?: {
    displayValue?: string
  }
}

export type EspnRoundScore = {
  period?: number
  value?: number
  displayValue?: string
  linescores?: EspnHoleScore[]
}

export type EspnCompetitor = {
  id: string
  order?: number
  score?: string
  status?: {
    type?: {
      name?: string
      state?: string
      description?: string
      detail?: string
      shortDetail?: string
    }
    displayValue?: string
    detail?: string
    teeTime?: string
    startHole?: number
    state?: string
  }
  athlete?: {
    displayName?: string
    fullName?: string
    shortName?: string
    flag?: {
      alt?: string
      href?: string
    }
  }
  linescores?: EspnRoundScore[]
  movement?: number
}

export type EspnHeaderGolfer = {
  id: string
  displayName: string
  score?: string
  place?: number
  headshot?: string
  logo?: string
  amateur?: boolean
  status?: {
    displayValue?: string
    detail?: string
    todayDetail?: string
    thru?: number
    period?: number
    state?: string
    teeTime?: string
    startHole?: number
  }
}

export type EspnEvent = {
  id: string
  name: string
  shortName?: string
  date?: string
  endDate?: string
  location?: string
  status?: {
    type?: {
      state?: string
      description?: string
      shortDetail?: string
    }
    period?: number
  }
  competitions?: Array<{
    competitors?: EspnCompetitor[]
  }>
  competitors?: EspnHeaderGolfer[]
}

export type TeeTime = {
  name: string
  teeTime: string
  startHole: 1 | 10
}

export type HoleScore = {
  hole: number
  par: number
  strokes: number
  relative: number
  relativeLabel: string
}

export type RoundScore = {
  day: 1 | 2 | 3 | 4
  score: number | null
  scoreLabel: string
  thru: string
  status: GolferStatus
  holes: HoleScore[]
  available: boolean
}

export type GolferStatus = 'pending' | 'live' | 'final' | 'cut' | 'withdrawn'

export type GolferScore = {
  id?: string
  name: string
  displayName: string
  score: number
  scoreLabel: string
  place?: number
  movement: number
  thru: string
  today: string
  country?: string
  flagUrl?: string
  headshot?: string
  status: GolferStatus
  teeTime?: string
  startHole?: 1 | 10
  rounds: RoundScore[]
  holes: HoleScore[]
}

export type RosterSlot = {
  name: string
  role: 'starter' | 'bench'
  state: 'counting' | 'promoted' | 'bench' | 'cut' | 'unavailable'
  golfer: GolferScore
}

export type EntryScore = PoolEntry & {
  total: number
  totalLabel: string
  rank: number
  poolRank: number
  poolBehind: number
  familyRank?: number
  familyBehind?: number
  eliminated: boolean
  cutCount: number
  promotedCount: number
  penaltyStrokes: number
  activeSlots: RosterSlot[]
  benchSlots: RosterSlot[]
  roster: RosterSlot[]
  bestPick: RosterSlot
  worstPick: RosterSlot
}

export function normalizeName(name: string) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\(a\)/gi, '')
    .replace(/\bjon\b/i, 'john')
    .replace(/\bmcilroy\b/i, 'mcilroy')
    .replace(/[^a-z]/gi, '')
    .toLowerCase()
}

export function formatScore(score: number) {
  if (score === 0) return 'E'
  return score > 0 ? `+${score}` : `${score}`
}

export function parseGolfScore(score?: string) {
  if (!score || score === '-' || score === 'E') return 0
  const parsed = Number(score.replace('+', ''))
  return Number.isFinite(parsed) ? parsed : 0
}

export function parseOptionalGolfScore(score?: string) {
  if (!score || score === '-') return null
  return parseGolfScore(score)
}

export function parseRelativeScore(value?: string) {
  if (!value || value === 'E') return 0
  const parsed = Number(value.replace('+', ''))
  return Number.isFinite(parsed) ? parsed : 0
}

export function makeEmptyRounds(): RoundScore[] {
  return [1, 2, 3, 4].map((day) => ({
    day: day as RoundScore['day'],
    score: null,
    scoreLabel: '-',
    thru: '-',
    status: 'pending',
    holes: [],
    available: false,
  }))
}

export function makeFallbackGolfer(name: string): GolferScore {
  return {
    name,
    displayName: name,
    score: 0,
    scoreLabel: 'E',
    movement: 0,
    thru: '-',
    today: '-',
    status: 'pending',
    rounds: makeEmptyRounds(),
    holes: [],
  }
}

function roundStatus(holesPlayed: number, score: number | null): GolferStatus {
  if (holesPlayed >= 18) return 'final'
  if (holesPlayed > 0) return 'live'
  return score === null ? 'pending' : 'pending'
}

function toHoleScores(linescores?: EspnHoleScore[]): HoleScore[] {
  return (
    linescores
      ?.map((hole) => {
        const strokes = typeof hole.value === 'number' ? hole.value : Number(hole.displayValue)
        const relative = parseRelativeScore(hole.scoreType?.displayValue)
        const period = hole.period ?? 0

        return {
          hole: period,
          par: Number.isFinite(strokes) ? strokes - relative : 0,
          strokes: Number.isFinite(strokes) ? strokes : 0,
          relative,
          relativeLabel: formatScore(relative),
        }
      })
      .filter((hole) => hole.hole >= 1 && hole.hole <= 18)
      .sort((a, b) => a.hole - b.hole) ?? []
  )
}

function toRoundScores(linescores?: EspnCompetitor['linescores']): RoundScore[] {
  const rounds = makeEmptyRounds()

  for (const round of linescores ?? []) {
    const day = round.period
    if (!day || day < 1 || day > 4) continue

    const holes = toHoleScores(round.linescores)
    const score = parseOptionalGolfScore(round.displayValue)
    const holesPlayed = holes.length

    rounds[day - 1] = {
      day: day as RoundScore['day'],
      score,
      scoreLabel: score === null ? '-' : formatScore(score),
      thru: holesPlayed >= 18 ? 'F' : holesPlayed > 0 ? `${holesPlayed}` : '-',
      status: roundStatus(holesPlayed, score),
      holes,
      available: Boolean(round.displayValue || round.value || round.linescores?.length),
    }
  }

  return rounds
}

function statusFromText(value?: string): GolferStatus | null {
  const text = value?.toLowerCase() ?? ''
  if (!text) return null
  if (text.includes('withdraw')) return 'withdrawn'
  if (text.includes('wd')) return 'withdrawn'
  if (text.includes('dq')) return 'withdrawn'
  if (text.includes('cut')) return 'cut'
  return null
}

function statusFromCompetitor(competitor: EspnCompetitor, rounds: RoundScore[]): GolferStatus {
  const explicit =
    statusFromText(competitor.status?.type?.description) ??
    statusFromText(competitor.status?.type?.detail) ??
    statusFromText(competitor.status?.type?.shortDetail) ??
    statusFromText(competitor.status?.displayValue) ??
    statusFromText(competitor.status?.detail)

  if (explicit) return explicit

  const activeRound = [...rounds].reverse().find((round) => round.available)
  if (activeRound) return activeRound.status

  const state = competitor.status?.type?.state ?? competitor.status?.state
  if (state === 'post') return 'final'
  if (state === 'pre') return 'pending'
  return 'pending'
}

function statusFromHeaderGolfer(golfer: EspnHeaderGolfer): GolferStatus {
  const explicit =
    statusFromText(golfer.status?.displayValue) ??
    statusFromText(golfer.status?.detail) ??
    statusFromText(golfer.status?.todayDetail)

  if (explicit) return explicit
  const state = golfer.status?.state
  if (state === 'post') return 'final'
  if (state === 'pre') return 'pending'
  return 'live'
}

function roundScoresFromHeaderGolfer(golfer: EspnHeaderGolfer, totalScore: number): RoundScore[] {
  const rounds = makeEmptyRounds()
  const period = golfer.status?.period
  const day = golfer.status?.state === 'pre' || golfer.status?.state === 'in' ? period : undefined

  if (day && day >= 1 && day <= 4) {
    const todayScore = parseOptionalGolfScore(golfer.status?.todayDetail?.split('(')[0])
    rounds[day - 1] = {
      ...rounds[day - 1],
      score: todayScore,
      scoreLabel: todayScore === null ? '-' : formatScore(todayScore),
      thru: golfer.status?.thru ? String(golfer.status.thru) : '-',
      status: statusFromHeaderGolfer(golfer),
      available: true,
    }
  } else {
    rounds[0] = {
      ...rounds[0],
      score: totalScore,
      scoreLabel: formatScore(totalScore),
      thru: golfer.status?.detail || golfer.status?.displayValue || '-',
      status: statusFromHeaderGolfer(golfer),
      available: true,
    }
  }

  return rounds
}

function buildRankLookup(competitors: EspnCompetitor[]) {
  const sortedScores = [
    ...new Set(
      competitors
        .map((competitor) => parseGolfScore(competitor.score))
        .sort((a, b) => a - b),
    ),
  ]

  return new Map(sortedScores.map((score, index) => [score, index + 1]))
}

export function buildTeeTimeMap(staticTeeTimes: StaticTeeTime[], liveTeeTimes: TeeTime[] = []) {
  const map = new Map<string, TeeTime>()
  for (const teeTime of staticTeeTimes) map.set(normalizeName(teeTime.name), teeTime)
  for (const teeTime of liveTeeTimes) map.set(normalizeName(teeTime.name), teeTime)
  return map
}

export function toGolferScores(event?: EspnEvent | null, teeTimes: TeeTime[] = []): GolferScore[] {
  const teeTimeMap = buildTeeTimeMap([], teeTimes)
  const fullCompetitors = event?.competitions?.[0]?.competitors

  if (fullCompetitors?.length) {
    const rankLookup = buildRankLookup(fullCompetitors)

    return fullCompetitors
      .map((competitor) => {
        const displayName = competitor.athlete?.displayName ?? competitor.athlete?.fullName ?? 'Unknown golfer'
        const score = parseGolfScore(competitor.score)
        const rounds = toRoundScores(competitor.linescores)
        const activeRound = [...rounds].reverse().find((round) => round.available)
        const teeTime = teeTimeMap.get(normalizeName(displayName))
        const status = statusFromCompetitor(competitor, rounds)
        const holes = activeRound?.holes ?? []
        const thru = status === 'cut' ? 'CUT' : status === 'withdrawn' ? 'WD' : activeRound?.thru ?? '-'

        return {
          id: competitor.id,
          name: displayName,
          displayName,
          score,
          scoreLabel: formatScore(score),
          place: rankLookup.get(score),
          movement: competitor.movement ?? 0,
          thru,
          today: activeRound?.score === null || !activeRound ? '-' : `${activeRound.scoreLabel} (${thru})`,
          country: competitor.athlete?.flag?.alt,
          flagUrl: competitor.athlete?.flag?.href,
          status,
          teeTime: teeTime?.teeTime,
          startHole: teeTime?.startHole,
          holes,
          rounds,
        }
      })
      .sort((a, b) => a.score - b.score || a.displayName.localeCompare(b.displayName))
  }

  return (
    event?.competitors?.map((golfer) => {
      const score = parseGolfScore(golfer.score)
      const teeTime = teeTimeMap.get(normalizeName(golfer.displayName))
      return {
        id: golfer.id,
        name: golfer.displayName,
        displayName: golfer.displayName,
        score,
        scoreLabel: formatScore(score),
        place: golfer.place,
        movement: 0,
        thru: golfer.status?.detail || golfer.status?.displayValue || '-',
        today: golfer.status?.todayDetail || golfer.status?.detail || '-',
        country: undefined,
        flagUrl: golfer.logo,
        headshot: golfer.headshot,
        status: statusFromHeaderGolfer(golfer),
        teeTime: golfer.status?.detail ?? teeTime?.teeTime,
        startHole: golfer.status?.startHole === 10 ? 10 : teeTime?.startHole,
        rounds: roundScoresFromHeaderGolfer(golfer, score),
        holes: [],
      }
    }) ?? []
  )
}

export function buildGolferMap(liveScores: GolferScore[], teeTimes: StaticTeeTime[] = []) {
  const map = new Map<string, GolferScore>()

  for (const score of liveScores) {
    map.set(normalizeName(score.name), score)
    map.set(normalizeName(score.displayName), score)
    for (const alias of golferAliases(score.displayName)) {
      map.set(alias, score)
    }
  }

  for (const teeTime of teeTimes) {
    const key = normalizeName(teeTime.name)
    if (!map.has(key)) {
      map.set(key, {
        ...makeFallbackGolfer(teeTime.name),
        teeTime: teeTime.teeTime,
        startHole: teeTime.startHole,
      })
    }
  }

  return map
}

const manualGolferAliasTargets: Record<string, string> = {
  'Bryson DeChambeau': 'dechambeaub',
  'Xander Schauffele': 'schaufelex',
  'Russell Henley': 'henleyt',
  'Patrick Cantlay': 'canylayp',
  'Kurt Kitayama': 'kityamak',
  'Maverick McNealy': 'mcneallym',
  'Matt McCarty': 'mccarthyd',
  'Hideki Matsuyama': 'matsuymah',
  'Sepp Straka': 'strakas',
  'Cameron Smith': 'smithc',
  'Lucas Herbert': 'hebertl',
  'Harry Hall': 'hallh',
  'Danny Willett': 'willettd',
  'Corey Conners': 'connorsc',
}

function golferAliases(displayName: string) {
  const normalized = new Set<string>()
  const parts = displayName.split(/\s+/).filter(Boolean)
  const lastName = parts.at(-1)
  const firstName = parts[0]

  if (lastName && firstName) {
    normalized.add(normalizeName(`${lastName}, ${firstName[0]}`))
    normalized.add(normalizeName(`${lastName} ${firstName[0]}`))
    normalized.add(normalizeName(`${lastName}, ${firstName.slice(0, 3)}`))
    normalized.add(normalizeName(`${lastName} ${firstName.slice(0, 3)}`))
  }

  if (displayName === 'J.J. Spaun') {
    normalized.add(normalizeName('Spaun, JJ'))
  }

  const manual = manualGolferAliasTargets[displayName]
  if (manual) normalized.add(manual)

  return normalized
}

export function isPoolCut(golfer?: GolferScore) {
  if (!golfer) return false
  return golfer.status === 'cut' || golfer.status === 'withdrawn' || golfer.score >= 5
}

function rankEntries<T extends { total: number; name: string; eliminated?: boolean }>(entries: T[]) {
  const activeEntries = entries.filter((entry) => !entry.eliminated)
  const activeScores = [...new Set(activeEntries.map((entry) => entry.total).sort((a, b) => a - b))]
  const eliminatedScores = [...new Set(entries.filter((entry) => entry.eliminated).map((entry) => entry.total).sort((a, b) => a - b))]

  return entries
    .map((entry) => ({
      ...entry,
      rank: entry.eliminated
        ? activeScores.length + eliminatedScores.indexOf(entry.total) + 1
        : activeScores.indexOf(entry.total) + 1,
    }))
    .sort((a, b) => Number(Boolean(a.eliminated)) - Number(Boolean(b.eliminated)) || a.rank - b.rank || a.name.localeCompare(b.name))
}

export function scoreEntries(entries: PoolEntry[], golferMap: Map<string, GolferScore>): EntryScore[] {
  const baseScores = entries.map((entry) => {
    const starters = entry.starters.map((name) => golferMap.get(normalizeName(name)) ?? makeFallbackGolfer(name))
    const bench = entry.bench.map((name) => golferMap.get(normalizeName(name)) ?? makeFallbackGolfer(name))
    const cutStarters = starters.filter(isPoolCut)
    const cutBench = bench.filter(isPoolCut)
    const promotedBench = bench.filter((golfer) => !isPoolCut(golfer)).slice(0, Math.min(cutStarters.length, 2))
    const activeStarters = starters.filter((golfer) => !isPoolCut(golfer))
    const missedCutCount = cutStarters.length + cutBench.length
    const eliminated = missedCutCount >= 3
    const activeGolfers = eliminated ? activeStarters : [...activeStarters, ...promotedBench].slice(0, 4)

    const starterSlots = starters.map((golfer): RosterSlot => ({
      name: golfer.displayName,
      role: 'starter',
      state: isPoolCut(golfer) ? 'cut' : 'counting',
      golfer,
    }))

    const promotedNames = new Set(promotedBench.map((golfer) => normalizeName(golfer.displayName)))
    const benchSlots = bench.map((golfer): RosterSlot => ({
      name: golfer.displayName,
      role: 'bench',
      state: isPoolCut(golfer) ? 'cut' : promotedNames.has(normalizeName(golfer.displayName)) ? 'promoted' : 'bench',
      golfer,
    }))

    const activeSlots: RosterSlot[] = [
      ...starterSlots,
      ...promotedBench.map((golfer): RosterSlot => ({
        name: golfer.displayName,
        role: 'bench',
        state: 'promoted',
        golfer,
      })),
    ]

    const penaltyStrokes = promotedBench.length
    const golferTotal = activeGolfers.reduce((sum, golfer) => sum + golfer.score, 0)
    const total = golferTotal + penaltyStrokes
    const roster = [...starterSlots, ...benchSlots]
    const sortedRoster = roster.length ? [...roster].sort((a, b) => a.golfer.score - b.golfer.score) : []

    return {
      ...entry,
      total,
      totalLabel: formatScore(total),
      rank: 0,
      poolRank: 0,
      poolBehind: 0,
      eliminated,
      cutCount: cutStarters.length,
      promotedCount: promotedBench.length,
      penaltyStrokes,
      activeSlots,
      benchSlots,
      roster,
      bestPick: sortedRoster[0],
      worstPick: sortedRoster[sortedRoster.length - 1],
    }
  })

  const rankedPool = rankEntries(baseScores)
  const poolLeader = rankedPool[0]
  const withPoolRank = rankedPool.map((entry) => ({
    ...entry,
    poolRank: entry.rank,
    poolBehind: poolLeader ? entry.total - poolLeader.total : 0,
  }))

  const familyRanked = rankEntries(withPoolRank.filter((entry) => entry.group === 'family'))
  const familyLeader = familyRanked[0]
  const familyLookup = new Map(
    familyRanked.map((entry) => [
      entry.id,
      {
        familyRank: entry.rank,
        familyBehind: familyLeader ? entry.total - familyLeader.total : 0,
      },
    ]),
  )

  return withPoolRank
    .map((entry) => ({
      ...entry,
      ...familyLookup.get(entry.id),
    }))
    .sort((a, b) => a.poolRank - b.poolRank || a.name.localeCompare(b.name))
}

export function behindLabel(value: number) {
  if (value === 0) return 'leader'
  return `${value} back`
}

export function timeToMinutes(label?: string) {
  if (!label) return Number.POSITIVE_INFINITY
  const match = label.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)
  if (!match) return Number.POSITIVE_INFINITY
  const [, h, m, meridiem] = match
  let hour = Number(h)
  if (meridiem.toUpperCase() === 'PM' && hour !== 12) hour += 12
  if (meridiem.toUpperCase() === 'AM' && hour === 12) hour = 0
  return hour * 60 + Number(m)
}
