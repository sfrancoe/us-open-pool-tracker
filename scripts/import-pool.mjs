import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import readXlsxFile from 'read-excel-file/node'

const inputPath = process.argv[2]

if (!inputPath) {
  console.error('Usage: npm run import:pool -- "/path/to/pool.xlsx"')
  process.exit(1)
}

const absoluteInput = path.resolve(inputPath)
const rows = await readXlsxFile(absoluteInput)

if (rows.length < 2) {
  console.error('The spreadsheet needs a header row and at least one entrant row.')
  process.exit(1)
}

const headers = rows[0].map((cell) => normalizeHeader(String(cell ?? '')))
const body = rows.slice(1)

function normalizeHeader(value) {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '')
}

function cell(row, names) {
  for (const name of names) {
    const index = headers.indexOf(normalizeHeader(name))
    if (index >= 0) return String(row[index] ?? '').trim()
  }
  return ''
}

function splitPlayers(value) {
  return value
    .split(/\r?\n|,|;/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function slug(value) {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

const entries = body
  .map((row, index) => {
    const name = cell(row, ['entrant', 'entry', 'name', 'player', 'owner', 'team'])
    if (!name) return null

    const groupValue = cell(row, ['group', 'pool', 'division', 'type'])
    const startersFromCombined = splitPlayers(cell(row, ['starters', 'main golfers', 'main', 'picks']))
    const benchFromCombined = splitPlayers(cell(row, ['bench', 'bench players', 'alternates', 'subs']))

    const starters = startersFromCombined.length
      ? startersFromCombined
      : [
          cell(row, ['starter 1', 'main 1', 'golfer 1', 'pick 1']),
          cell(row, ['starter 2', 'main 2', 'golfer 2', 'pick 2']),
          cell(row, ['starter 3', 'main 3', 'golfer 3', 'pick 3']),
          cell(row, ['starter 4', 'main 4', 'golfer 4', 'pick 4']),
        ].filter(Boolean)

    const bench = benchFromCombined.length
      ? benchFromCombined
      : [
          cell(row, ['bench 1', 'alternate 1', 'sub 1']),
          cell(row, ['bench 2', 'alternate 2', 'sub 2']),
        ].filter(Boolean)

    return {
      id: slug(name) || `entry-${index + 1}`,
      name,
      group: /family|francoeur/i.test(groupValue) ? 'family' : 'overall',
      starters: starters.slice(0, 4),
      bench: bench.slice(0, 2),
    }
  })
  .filter(Boolean)

const invalid = entries.filter((entry) => entry.starters.length !== 4 || entry.bench.length !== 2)
if (invalid.length) {
  console.error('These entries do not have exactly four starters and two bench players:')
  for (const entry of invalid) {
    console.error(`- ${entry.name}: ${entry.starters.length} starters, ${entry.bench.length} bench`)
  }
  process.exit(1)
}

const output = `export type PoolGroup = 'family' | 'overall'

export type PoolEntry = {
  id: string
  name: string
  group: PoolGroup
  starters: string[]
  bench: string[]
}

export const poolEntries: PoolEntry[] = ${JSON.stringify(entries, null, 2)}
`

const outputPath = path.resolve('src/data/poolEntries.ts')
await fs.writeFile(outputPath, output)
console.log(`Imported ${entries.length} entries into ${outputPath}`)
