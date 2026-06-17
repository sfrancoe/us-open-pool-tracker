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
    id: 'scott',
    name: 'Scott',
    group: 'family',
    starters: ['Scottie Scheffler', 'Rory McIlroy', 'Cameron Young', 'Sam Burns'],
    bench: ['Patrick Reed', 'Brian Harman'],
  },
  {
    id: 'nicholas',
    name: 'Nicholas',
    group: 'family',
    starters: ['Scottie Scheffler', 'Ludvig Åberg', 'Viktor Hovland', 'Tommy Fleetwood'],
    bench: ['Sepp Straka', 'Keegan Bradley'],
  },
  {
    id: 'christopher',
    name: 'Christopher',
    group: 'family',
    starters: ['Rory McIlroy', 'Jon Rahm', 'Matt Fitzpatrick', 'Xander Schauffele'],
    bench: ['Justin Thomas', 'Adam Scott'],
  },
  {
    id: 'tara',
    name: 'Tara',
    group: 'family',
    starters: ['Collin Morikawa', 'Brooks Koepka', 'Bryson DeChambeau', 'Cameron Smith'],
    bench: ['Hideki Matsuyama', 'Sahith Theegala'],
  },
  {
    id: 'andrew',
    name: 'Andrew',
    group: 'family',
    starters: ['Scottie Scheffler', 'Xander Schauffele', 'Patrick Cantlay', 'Jordan Spieth'],
    bench: ['Russell Henley', 'Corey Conners'],
  },
  {
    id: 'mike',
    name: 'Mike',
    group: 'family',
    starters: ['Jon Rahm', 'Rory McIlroy', 'Brooks Koepka', 'Viktor Hovland'],
    bench: ['Daniel Berger', 'Shane Lowry'],
  },
  {
    id: 'sample-1',
    name: 'North Fork Draw',
    group: 'overall',
    starters: ['Scottie Scheffler', 'Tommy Fleetwood', 'Sam Burns', 'Adam Scott'],
    bench: ['Max Greyserman', 'Chris Kirk'],
  },
  {
    id: 'sample-2',
    name: 'Back Nine Syndicate',
    group: 'overall',
    starters: ['Rory McIlroy', 'Ludvig Åberg', 'Patrick Reed', 'Brian Harman'],
    bench: ['Jake Knapp', 'Michael Kim'],
  },
  {
    id: 'sample-3',
    name: 'Sunday Redacted',
    group: 'overall',
    starters: ['Bryson DeChambeau', 'Xander Schauffele', 'Collin Morikawa', 'Justin Thomas'],
    bench: ['Akshay Bhatia', 'Nick Taylor'],
  },
  {
    id: 'sample-4',
    name: 'The Cut Makers',
    group: 'overall',
    starters: ['Jon Rahm', 'Viktor Hovland', 'Matt Fitzpatrick', 'Brooks Koepka'],
    bench: ['Ryan Fox', 'Alex Noren'],
  },
]
