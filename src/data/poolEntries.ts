export type PoolGroup = 'family' | 'overall'

export type PoolEntry = {
  id: string
  name: string
  group: PoolGroup
  starters: string[]
  bench: string[]
}

export const poolEntries: PoolEntry[] = [
  {
    id: 'mike',
    name: 'Mike',
    group: 'family',
    starters: ['Scottie Scheffler', 'Tommy Fleetwood', 'Matt Fitzpatrick', 'Russell Henley'],
    bench: ['Brooks Koepka', 'Wyndham Clark'],
  },
  {
    id: 'scott',
    name: 'Scott',
    group: 'family',
    starters: ['Scottie Scheffler', 'Tommy Fleetwood', 'Patrick Reed', 'Xander Schauffele'],
    bench: ['Harris English', 'Wyndham Clark'],
  },
  {
    id: 'nicholas',
    name: 'Nicholas',
    group: 'family',
    starters: ['Scottie Scheffler', 'Bryson DeChambeau', 'Ludvig Åberg', 'Tyrrell Hatton'],
    bench: ['Patrick Reed', 'Si Woo Kim'],
  },
  {
    id: 'christopher',
    name: 'Christopher',
    group: 'family',
    starters: ['Scottie Scheffler', 'Xander Schauffele', 'Cameron Young', 'Matt Fitzpatrick'],
    bench: ['Patrick Reed', 'Si Woo Kim'],
  },
  {
    id: 'andrew-tara',
    name: 'Andrew/Tara',
    group: 'family',
    starters: ['Rory McIlroy', 'Cameron Young', 'Collin Morikawa', 'Tyrrell Hatton'],
    bench: ['Russell Henley', 'Tommy Fleetwood'],
  },
]
