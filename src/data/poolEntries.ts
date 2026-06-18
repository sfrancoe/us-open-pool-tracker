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
    "id": "rick-m",
    "name": "Rick M.",
    "group": "overall",
    "starters": [
      "McIlroy, R",
      "Rahm, J",
      "Fleetwood, T",
      "Rose, J"
    ],
    "bench": [
      "Hatton, T",
      "Lowry, S"
    ]
  },
  {
    "id": "chico",
    "name": "Chico",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Rahm, J",
      "Koepka, B",
      "Burns, S"
    ],
    "bench": [
      "Morikawa, C",
      "Henley, R"
    ]
  },
  {
    "id": "quathy-wu-wu",
    "name": "Quathy Wu Wu",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Rahm, J",
      "Aberg, L",
      "Fitzpatrick, M"
    ],
    "bench": [
      "Fleetwood, T",
      "Young, Cam"
    ]
  },
  {
    "id": "jeff-g",
    "name": "Jeff G",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Rahm, J",
      "Aberg, L",
      "Kim, Si Woo"
    ],
    "bench": [
      "Young, C",
      "Fleetwood, T"
    ]
  },
  {
    "id": "don-j",
    "name": "Don J",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Schauffele, X",
      "Fleetwood, T",
      "Clark, W"
    ],
    "bench": [
      "Aberg, L",
      "Henley, R"
    ]
  },
  {
    "id": "scarboro",
    "name": "Scarboro",
    "group": "overall",
    "starters": [
      "Aberg, L",
      "Young, C",
      "Henley, R",
      "Gotterup, C"
    ],
    "bench": [
      "Fleetwood, T",
      "Fitzpatrick, M"
    ]
  },
  {
    "id": "dusty-1",
    "name": "Dusty 1",
    "group": "overall",
    "starters": [
      "McIlroy, R",
      "Fleetwood, T",
      "Rose, J",
      "Young, C"
    ],
    "bench": [
      "Gotterup, C",
      "Rahm, J"
    ]
  },
  {
    "id": "dusty-2",
    "name": "Dusty 2",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Schauffele, X",
      "Reed, P",
      "Hatton, T"
    ],
    "bench": [
      "Rahm, Jon",
      "Fitzpatrick, M"
    ]
  },
  {
    "id": "jack-flynn-1",
    "name": "Jack Flynn 1",
    "group": "overall",
    "starters": [
      "Rahm, J",
      "Scheffler, S",
      "Henley, R",
      "Woodland, G"
    ],
    "bench": [
      "Young, C",
      "Koepka, B"
    ]
  },
  {
    "id": "jack-flynn-2",
    "name": "Jack Flynn 2",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Fitzpatrick, M",
      "Young, C",
      "Clark, W"
    ],
    "bench": [
      "Koepka, B",
      "Aberg, L"
    ]
  },
  {
    "id": "rudy-1",
    "name": "Rudy 1",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "McIlroy, R",
      "Reed, P",
      "Rai, A"
    ],
    "bench": [
      "Young, C",
      "Fleetwood, T"
    ]
  },
  {
    "id": "rudy-2",
    "name": "Rudy 2",
    "group": "overall",
    "starters": [
      "McIlroy, R",
      "Schauffele, X",
      "Fleetwood, T",
      "Young, C"
    ],
    "bench": [
      "Rahm, Jon",
      "DeChambeau, B"
    ]
  },
  {
    "id": "rudy-3",
    "name": "Rudy 3",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Schauffele, X",
      "Rahm, J",
      "DeChambeau, B"
    ],
    "bench": [
      "Young, C",
      "Fleetwood, T"
    ]
  },
  {
    "id": "rudy-4",
    "name": "Rudy 4",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Rose, J",
      "Rahm, J",
      "Young, C"
    ],
    "bench": [
      "Kim, Si Woo",
      "Connors, C"
    ]
  },
  {
    "id": "rudy-5",
    "name": "Rudy 5",
    "group": "overall",
    "starters": [
      "McIlroy, R",
      "Aberg, L",
      "Rahm, J",
      "DeChambeau, B"
    ],
    "bench": [
      "Koepka, B",
      "Spaun, JJ"
    ]
  },
  {
    "id": "ranaghan-1",
    "name": "Ranaghan 1",
    "group": "overall",
    "starters": [
      "McIlroy, R",
      "Fleetwood, T",
      "Rose, J",
      "English, H"
    ],
    "bench": [
      "Lowry, S",
      "Thomas, J"
    ]
  },
  {
    "id": "ranaghan-2",
    "name": "Ranaghan 2",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Bradley, K",
      "Fitzpatrick, M",
      "Day, J"
    ],
    "bench": [
      "Griffin, B",
      "Hovland, V"
    ]
  },
  {
    "id": "dock-fore",
    "name": "Dock Fore",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Schauffele, X",
      "Rahm, J",
      "Reed, P"
    ],
    "bench": [
      "DeChambeau, B",
      "Fitzpatrick, M"
    ]
  },
  {
    "id": "steve-morris-1",
    "name": "Steve Morris 1",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Fleetwood, T",
      "Clark, W",
      "Young, C"
    ],
    "bench": [
      "Rahm, Jon",
      "Aberg, L"
    ]
  },
  {
    "id": "steve-morris-2",
    "name": "Steve Morris 2",
    "group": "overall",
    "starters": [
      "McIlroy, R",
      "Rahm, J",
      "Clark, W",
      "Young, C"
    ],
    "bench": [
      "Fleetwood, T",
      "Spaun, JJ"
    ]
  },
  {
    "id": "roofa-1",
    "name": "Roofa 1",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Fleetwood, T",
      "Rose, J",
      "Gotterup, C"
    ],
    "bench": [
      "Fitzpatrick, M",
      "Hovland, V"
    ]
  },
  {
    "id": "roofa-2",
    "name": "Roofa 2",
    "group": "overall",
    "starters": [
      "DeChambeau, B",
      "Schauffele, X",
      "Clark, W",
      "Reed, P"
    ],
    "bench": [
      "Scheffler, S",
      "Fleetwood, T"
    ]
  },
  {
    "id": "overdue",
    "name": "Overdue",
    "group": "overall",
    "starters": [
      "Rahm, J",
      "Aberg, L",
      "Kim, Si Woo",
      "Gotterup, C"
    ],
    "bench": [
      "Smith C",
      "Henley, R"
    ]
  },
  {
    "id": "y-tim-1",
    "name": "Y-Tim 1",
    "group": "overall",
    "starters": [
      "McIlroy, R",
      "DeChambeau, B",
      "Koepka, B",
      "Fitzpatrick, M"
    ],
    "bench": [
      "Clark, W",
      "Spaun, JJ"
    ]
  },
  {
    "id": "y-tim-2",
    "name": "Y-Tim 2",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Fleetwood, T",
      "Rahm, J",
      "Reed, P"
    ],
    "bench": [
      "Aberg, L",
      "Lowry, S"
    ]
  },
  {
    "id": "jim-totten",
    "name": "Jim Totten",
    "group": "overall",
    "starters": [
      "McIlroy, R",
      "Burns, S",
      "Rahm, J",
      "Fitzpatrick, M"
    ],
    "bench": [
      "Aberg, L",
      "Clark, W"
    ]
  },
  {
    "id": "yipper",
    "name": "Yipper",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Fleetwood, T",
      "Young, C",
      "Gotterup, C"
    ],
    "bench": [
      "Fitzpatrick, M",
      "Schauffele, X"
    ]
  },
  {
    "id": "betty-deegan",
    "name": "Betty Deegan",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Aberg, L",
      "Fleetwood, T",
      "Hovland, V"
    ],
    "bench": [
      "Hall, H",
      "Hebert, L"
    ]
  },
  {
    "id": "henry-deegan",
    "name": "Henry Deegan",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Fleetwood, T",
      "Rahm, J",
      "Young, C"
    ],
    "bench": [
      "Rose, J",
      "Fitzpatrick, M"
    ]
  },
  {
    "id": "killer",
    "name": "Killer",
    "group": "overall",
    "starters": [
      "McIlroy, R",
      "Fleetwood, T",
      "Koepka, B",
      "Hovland, V"
    ],
    "bench": [
      "Rai, A",
      "Young, Cam"
    ]
  },
  {
    "id": "eddie-flaherty",
    "name": "Eddie Flaherty",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Fleetwood, T",
      "Morikawa, C",
      "Young, C"
    ],
    "bench": [
      "Fitzpatrick, M",
      "Aberg, L"
    ]
  },
  {
    "id": "fred-fasulo",
    "name": "Fred Fasulo",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Schauffele, X",
      "Koepka, B",
      "Young, C"
    ],
    "bench": [
      "Fitzpatrick, M",
      "Fleetwood, T"
    ]
  },
  {
    "id": "nick-cliche",
    "name": "Nick Cliche",
    "group": "overall",
    "starters": [
      "Young, C",
      "Schauffele, X",
      "Fleetwood, T",
      "Fitzpatrick, M"
    ],
    "bench": [
      "Gotterup, C",
      "Reed, P"
    ]
  },
  {
    "id": "paul-robinson-1",
    "name": "Paul Robinson 1",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Fleetwood, T",
      "Aberg, L",
      "Rahm, J"
    ],
    "bench": [
      "Rose, J",
      "Thomas, J"
    ]
  },
  {
    "id": "paul-robinson-2",
    "name": "Paul Robinson 2",
    "group": "overall",
    "starters": [
      "McIlroy, R",
      "DeChambeau, B",
      "Koepka, B",
      "Matsuyama, H"
    ],
    "bench": [
      "Fleetwood, T",
      "Young, Cam"
    ]
  },
  {
    "id": "pk-binjola-1",
    "name": "PK Binjola 1",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Rahm, J",
      "Fitzpatrick, M",
      "Young, C"
    ],
    "bench": [
      "Fleetwood, T",
      "Gotterup, C"
    ]
  },
  {
    "id": "pk-binjola-2",
    "name": "PK Binjola 2",
    "group": "overall",
    "starters": [
      "McIlroy, R",
      "DeChambeau, B",
      "Schauffele, X",
      "Burns, S"
    ],
    "bench": [
      "Koepka, B",
      "Hatton, T"
    ]
  },
  {
    "id": "sailor-rob-1",
    "name": "Sailor Rob 1",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Koepka, B",
      "Young, C",
      "Henley, R"
    ],
    "bench": [
      "Fitzpatrick, M",
      "Reed, P"
    ]
  },
  {
    "id": "sailor-rob-2",
    "name": "Sailor Rob 2",
    "group": "overall",
    "starters": [
      "McIlroy, R",
      "Schauffele, X",
      "Rahm, J",
      "Young, C"
    ],
    "bench": [
      "Aberg, L",
      "Thomas, J"
    ]
  },
  {
    "id": "poor-tery-1",
    "name": "Poor Tery 1",
    "group": "overall",
    "starters": [
      "Rahm, J",
      "Fleetwood, T",
      "Fitzpatrick, M",
      "Rose, J"
    ],
    "bench": [
      "McIlroy, R",
      "Young, Cam"
    ]
  },
  {
    "id": "poor-tery-2",
    "name": "Poor Tery 2",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Hovland, V",
      "Clark, W",
      "Young, C"
    ],
    "bench": [
      "Aberg, L",
      "Hatton, T"
    ]
  },
  {
    "id": "gallagher-1",
    "name": "Gallagher 1",
    "group": "overall",
    "starters": [
      "Schauffele, X",
      "Henley, R",
      "Rahm, J",
      "Burns, S"
    ],
    "bench": [
      "Fleetwood, T",
      "Young, Cam"
    ]
  },
  {
    "id": "skip-norton-1",
    "name": "Skip Norton 1",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Young, C",
      "Fleetwood, T",
      "Burns, S"
    ],
    "bench": [
      "Fitzpatrick, M",
      "Henley, R"
    ]
  },
  {
    "id": "skip-norton-2",
    "name": "Skip Norton 2",
    "group": "overall",
    "starters": [
      "Fitzpatrick, M",
      "Henley, R",
      "Burns, S",
      "Henley, R"
    ],
    "bench": [
      "Young, C",
      "McIlroy, R"
    ]
  },
  {
    "id": "barbara-norton",
    "name": "Barbara Norton",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Rahm, J",
      "Schauffele, X",
      "Reed, P"
    ],
    "bench": [
      "Young, C",
      "Fleetwood, T"
    ]
  },
  {
    "id": "marshall-j",
    "name": "Marshall J.",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Burns, S",
      "Bradley, K",
      "Young, C"
    ],
    "bench": [
      "Theegala, S",
      "Im, S"
    ]
  },
  {
    "id": "nick-cliche-2",
    "name": "Nick Cliche 2",
    "group": "overall",
    "starters": [
      "Schauffele, X",
      "Burns, S",
      "Hatton, T",
      "Henley, R"
    ],
    "bench": [
      "McIlroy, R",
      "Fitzpatrick, M"
    ]
  },
  {
    "id": "matt-o",
    "name": "Matt O",
    "group": "overall",
    "starters": [
      "Fitzpatrick, M",
      "Fleetwood, T",
      "Hatton, T",
      "Matsuyama, H"
    ],
    "bench": [
      "Schaufele, X",
      "Burns, S"
    ]
  },
  {
    "id": "dan-l",
    "name": "Dan L.",
    "group": "overall",
    "starters": [
      "McIlroy, R",
      "Rahm, J",
      "Fleetwood, T",
      "Schauffele, X"
    ],
    "bench": [
      "Reed, P",
      "Fitzpatrick, M"
    ]
  },
  {
    "id": "elliot-1",
    "name": "Elliot 1",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Fitzpatrick, M",
      "Rahm, J",
      "Young, C"
    ],
    "bench": [
      "Fleetwood, T",
      "Schauffele, X"
    ]
  },
  {
    "id": "elliot-2",
    "name": "Elliot 2",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "DeChambeau, B",
      "Aberg, L",
      "Fleetwood, T"
    ],
    "bench": [
      "Scott. A",
      "smith, C"
    ]
  },
  {
    "id": "mike-s-vodka",
    "name": "Mike’s Vodka",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Burns, S",
      "Reed, P",
      "Young, C"
    ],
    "bench": [
      "Fleetwood, T",
      "Woodland, G"
    ]
  },
  {
    "id": "troth-1",
    "name": "Troth 1",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Schauffele, X",
      "Aberg, L",
      "Fitzpatrick, M"
    ],
    "bench": [
      "Henley, T",
      "Burns, S"
    ]
  },
  {
    "id": "troth-2",
    "name": "Troth 2",
    "group": "overall",
    "starters": [
      "McIlroy, R",
      "Rahm, J",
      "Fleetwood, T",
      "Young, C"
    ],
    "bench": [
      "Koepka, B",
      "Clark, W"
    ]
  },
  {
    "id": "i-am-steve",
    "name": "I Am Steve",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Fitzpatrick, M",
      "Fleetwood, T",
      "Schauffele, X"
    ],
    "bench": [
      "Reed, P",
      "Rahm, J"
    ]
  },
  {
    "id": "bob-lalley-1",
    "name": "Bob Lalley 1",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Fitzpatrick, M",
      "Rahm, J",
      "Schauffele, X"
    ],
    "bench": [
      "Fleetwood, T",
      "Morikawa, C"
    ]
  },
  {
    "id": "bob-lalley-2",
    "name": "Bob Lalley 2",
    "group": "overall",
    "starters": [
      "McIlroy, R",
      "Fleetwood, T",
      "Koepka, B",
      "Morikawa, C"
    ],
    "bench": [
      "Spaun, JJ",
      "Schauffele, X"
    ]
  },
  {
    "id": "ambjir",
    "name": "Ambjir",
    "group": "overall",
    "starters": [
      "Hatton, T",
      "Kityama, K",
      "Reed, P",
      "Henley, R"
    ],
    "bench": [
      "Canylay, P",
      "Hovland, V"
    ]
  },
  {
    "id": "buddyboy-i",
    "name": "Buddyboy I",
    "group": "overall",
    "starters": [
      "McIlroy, R",
      "Rahm, J",
      "Schauffele, X",
      "DeChambeau, B"
    ],
    "bench": [
      "Hatton, T",
      "Henley, R"
    ]
  },
  {
    "id": "buddyboy-ii",
    "name": "Buddyboy II",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Young, C",
      "Fleetwood, T",
      "Henley, R"
    ],
    "bench": [
      "Morikawa, C",
      "Fitzpatrick, M"
    ]
  },
  {
    "id": "mad-mac-i",
    "name": "Mad Mac I",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Reed, P",
      "Fleetwood, T",
      "Henley, R"
    ],
    "bench": [
      "Burns, S",
      "Kitiyama, K"
    ]
  },
  {
    "id": "mad-mac-ii",
    "name": "Mad Mac II",
    "group": "overall",
    "starters": [
      "McIlroy, R",
      "Fitzpatrick, M",
      "Reed, P",
      "Young, C"
    ],
    "bench": [
      "Thomas, J",
      "Berger, D"
    ]
  },
  {
    "id": "nico-buddy",
    "name": "Nico + Buddy",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Rahm, J",
      "Schauffele, X",
      "DeChambeau, B"
    ],
    "bench": [
      "Hatton, T",
      "Aberg, L"
    ]
  },
  {
    "id": "mom-and-me",
    "name": "Mom & Me",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Fitzpatrick, M",
      "Koepka, B",
      "Hovland, V"
    ],
    "bench": [
      "Schaufele, X",
      "Aberg, L"
    ]
  },
  {
    "id": "mom-and-me-2",
    "name": "Mom & Me 2",
    "group": "overall",
    "starters": [
      "Rahm, J",
      "McIlroy, R",
      "Fleetwood, T",
      "Rose, J"
    ],
    "bench": [
      "Schaufele, X",
      "Koepka, B"
    ]
  },
  {
    "id": "wood-man-i",
    "name": "Wood-man I",
    "group": "overall",
    "starters": [
      "McIlroy, R",
      "Schauffele, X",
      "Reed, P",
      "Hatton, T"
    ],
    "bench": [
      "Canylay, P",
      "Rose, J"
    ]
  },
  {
    "id": "wood-man-ii",
    "name": "Wood-man II",
    "group": "overall",
    "starters": [
      "McIlroy, R",
      "Schauffele, X",
      "Rahm, J",
      "Henley, R"
    ],
    "bench": [
      "Reed, P",
      "Hatton, T"
    ]
  },
  {
    "id": "k-le-e-i",
    "name": "K Le e I",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Rahm, J",
      "Aberg, L",
      "Young, C"
    ],
    "bench": [
      "Fitzpatrick, M",
      "Reed, P"
    ]
  },
  {
    "id": "k-lee-ii",
    "name": "K Lee II",
    "group": "overall",
    "starters": [
      "Fleetwood, T",
      "McIlroy, R",
      "Schauffele, X",
      "Hatton, T"
    ],
    "bench": [
      "Henley, T",
      "Reed, P"
    ]
  },
  {
    "id": "jw-kl",
    "name": "JW + KL",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Rahm, J",
      "Aberg, L",
      "DeChambeau, B"
    ],
    "bench": [
      "Morikawa, C",
      "Gotterup, C"
    ]
  },
  {
    "id": "woods-14-0",
    "name": "Woods/14-0",
    "group": "overall",
    "starters": [
      "McIlroy, R",
      "Schauffele, X",
      "Fitzpatrick, M",
      "Burns, S"
    ],
    "bench": [
      "Berger, D",
      "Rai, A"
    ]
  },
  {
    "id": "jw-mw",
    "name": "JW + MW",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Aberg, L",
      "Rahm, J",
      "Young, C"
    ],
    "bench": [
      "DeChambeau, B",
      "Koepka, B"
    ]
  },
  {
    "id": "woodsy",
    "name": "Woodsy",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Aberg, L",
      "Rahm, J",
      "DeChambeau, B"
    ],
    "bench": [
      "Young, C",
      "Hatton, T"
    ]
  },
  {
    "id": "devin-locke",
    "name": "Devin Locke",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Rahm, J",
      "Schauffele, X",
      "Matsuyama, H"
    ],
    "bench": [
      "DeChambeau, B",
      "Lowry, S"
    ]
  },
  {
    "id": "devin-locke-2",
    "name": "Devin Locke 2",
    "group": "overall",
    "starters": [
      "McIlroy, R",
      "Morikawa, C",
      "Schauffele, X",
      "Rose, J"
    ],
    "bench": [
      "Matsuyama, H",
      "Lowry, S"
    ]
  },
  {
    "id": "uncle-buck",
    "name": "Uncle Buck",
    "group": "overall",
    "starters": [
      "Schauffele, X",
      "Scheffler, S",
      "Morikawa, C",
      "Young, C"
    ],
    "bench": [
      "Aberg, L",
      "Fitzpatrick, M"
    ]
  },
  {
    "id": "o-learys-tavern",
    "name": "O’Learys Tavern",
    "group": "overall",
    "starters": [
      "McIlroy, R",
      "Schauffele, X",
      "Rahm, J",
      "Thomas, J"
    ],
    "bench": [
      "Fleetwood, T",
      "Koepka, B"
    ]
  },
  {
    "id": "jay-o-leary",
    "name": "Jay O’Leary",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Rahm, J",
      "Fitzpatrick, M",
      "Fleetwood, T"
    ],
    "bench": [
      "Reed, P",
      "Young, Cam"
    ]
  },
  {
    "id": "jerome-o-leary",
    "name": "Jerome O’Leary",
    "group": "overall",
    "starters": [
      "McIlroy, R",
      "Aberg, L",
      "Fleetwood, T",
      "Young, C"
    ],
    "bench": [
      "Rahm, Jon",
      "Schauffele, X"
    ]
  },
  {
    "id": "jt-o-leary",
    "name": "JT O’Leary",
    "group": "overall",
    "starters": [
      "McIlroy, R",
      "Rahm, J",
      "Reed, P",
      "Young, C"
    ],
    "bench": [
      "Koepka, B",
      "Schauffele, X"
    ]
  },
  {
    "id": "jerry-jones",
    "name": "Jerry Jones",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Fleetwood, T",
      "Morikawa, C",
      "Thomas, J"
    ],
    "bench": [
      "Schaufele, X",
      "Rose, J"
    ]
  },
  {
    "id": "teddy-o-leary",
    "name": "Teddy O’Leary",
    "group": "overall",
    "starters": [
      "Aberg, L",
      "Scheffler, S",
      "Fitzpatrick, M",
      "Reed, P"
    ],
    "bench": [
      "DeChambeau, B",
      "Rahm, J"
    ]
  },
  {
    "id": "dallas",
    "name": "Dallas",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Rahm, J",
      "Kim, Si Woo",
      "Young, C"
    ],
    "bench": [
      "Morikawa, C",
      "Day, J"
    ]
  },
  {
    "id": "dennis-brown",
    "name": "Dennis Brown",
    "group": "overall",
    "starters": [
      "McIlroy, R",
      "Morikawa, C",
      "Spieth, J",
      "Henley, R"
    ],
    "bench": [
      "Schaufele, X",
      "Thomas, J"
    ]
  },
  {
    "id": "macisso-bartlett",
    "name": "Macisso/Bartlett",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Fleetwood, T",
      "Fitzpatrick, M",
      "Young, C"
    ],
    "bench": [
      "Aberg, L",
      "Koepka, B"
    ]
  },
  {
    "id": "mkt-2",
    "name": "MKT 2",
    "group": "overall",
    "starters": [
      "McIlroy, R",
      "Fleetwood, T",
      "DeChambeau, B",
      "Cantlay, P"
    ],
    "bench": [
      "Koepka, B",
      "Schauffele, X"
    ]
  },
  {
    "id": "r-14-0-woods",
    "name": "R. 14-0/Woods",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Schauffele, X",
      "Young, C",
      "Clark, W"
    ],
    "bench": [
      "Aberg, L",
      "Rahm, J"
    ]
  },
  {
    "id": "mkt-1",
    "name": "MKT 1",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Aberg, L",
      "Rahm, J",
      "Young, C"
    ],
    "bench": [
      "Kim, Si Woo",
      "Morikawa, C"
    ]
  },
  {
    "id": "rum-no-mike",
    "name": "Rum no Mike",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Aberg, L",
      "Burns, S",
      "Young, C"
    ],
    "bench": [
      "Rose, J",
      "Schauffele, X"
    ]
  },
  {
    "id": "jay-carl",
    "name": "Jay/Carl",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Schauffele, X",
      "Burns, S",
      "Young, C"
    ],
    "bench": [
      "Rahm, Jon",
      "Fitzpatrick, M"
    ]
  },
  {
    "id": "mike-no-rum",
    "name": "Mike no Rum",
    "group": "overall",
    "starters": [
      "McIlroy, R",
      "Henley, R",
      "Burns, S",
      "Young, C"
    ],
    "bench": [
      "Morikawa, C",
      "Hatton, T"
    ]
  },
  {
    "id": "our-turn",
    "name": "Our Turn",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Fleetwood, T",
      "Hatton, T",
      "Rose, J"
    ],
    "bench": [
      "Schaufele, X",
      "Gotterup, C"
    ]
  },
  {
    "id": "pickle",
    "name": "Pickle",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Schauffele, X",
      "Burns, S",
      "Young, C"
    ],
    "bench": [
      "Fleetwood, T",
      "Clark, W"
    ]
  },
  {
    "id": "beth-pajak",
    "name": "Beth Pajak",
    "group": "overall",
    "starters": [
      "Fitzpatrick, M",
      "Spieth, J",
      "Smith, Cam",
      "Thomas, J"
    ],
    "bench": [
      "Scheffler, S"
    ]
  },
  {
    "id": "nick-ustic",
    "name": "Nick Ustic",
    "group": "overall",
    "starters": [
      "Schauffele, X",
      "Burns, S",
      "Hatton, T",
      "Rahm, J"
    ],
    "bench": [
      "Rose, J",
      "Morikawa, C"
    ]
  },
  {
    "id": "bob-hill",
    "name": "Bob Hill",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Clark, W",
      "Fitzpatrick, M",
      "Hovland, V"
    ],
    "bench": [
      "Fleetwood, T",
      "Fitzpatrick, A"
    ]
  },
  {
    "id": "tony-menario",
    "name": "Tony Menario",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Fleetwood, T",
      "Reed, P",
      "Young, C"
    ],
    "bench": [
      "Fitzpatrick, M",
      "Rahm, J"
    ]
  },
  {
    "id": "dennis-ranaghan",
    "name": "Dennis Ranaghan",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Fleetwood, T",
      "Hatton, T",
      "Rahm, J"
    ],
    "bench": [
      "Kirk, C",
      "Reed, P"
    ]
  },
  {
    "id": "mike-malone",
    "name": "Mike Malone",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Schauffele, X",
      "Aberg, L",
      "Young, C"
    ],
    "bench": [
      "Morikawa, C",
      "Rahm, J"
    ]
  },
  {
    "id": "cookie-jay-1",
    "name": "Cookie/Jay 1",
    "group": "overall",
    "starters": [
      "Schauffele, X",
      "Fitzpatrick, M",
      "Hatton, T",
      "Rahm, J"
    ],
    "bench": [
      "Reed, P",
      "Henley, R"
    ]
  },
  {
    "id": "cookie-jay-2",
    "name": "Cookie/Jay 2",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Clark, W",
      "Fleetwood, T",
      "Young, C"
    ],
    "bench": [
      "Spieth, J",
      "Lowry, S"
    ]
  },
  {
    "id": "jars-1",
    "name": "Jars 1",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Fitzpatrick, M",
      "Rai, A",
      "Young, C"
    ],
    "bench": [
      "Mitchell, K",
      "Fleetwood, T"
    ]
  },
  {
    "id": "jars-2",
    "name": "Jars 2",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Fitzpatrick, M",
      "Rai, A",
      "Mitchell, K"
    ],
    "bench": [
      "Young, C",
      "Fleetwood, T"
    ]
  },
  {
    "id": "lance-1",
    "name": "Lance 1",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Schauffele, X",
      "Reed, P",
      "Young, C"
    ],
    "bench": [
      "Aberg, L",
      "Gotterup, C"
    ]
  },
  {
    "id": "lance-2",
    "name": "Lance 2",
    "group": "overall",
    "starters": [
      "McIlroy, R",
      "Fitzpatrick, M",
      "Reed, P",
      "Koepka, B"
    ],
    "bench": [
      "Aberg, L",
      "Gotterup, C"
    ]
  },
  {
    "id": "bart",
    "name": "Bart",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Schauffele, X",
      "Fitzpatrick, M",
      "Morikawa, C"
    ],
    "bench": [
      "Rose, J",
      "Scott, A"
    ]
  },
  {
    "id": "jay-rich",
    "name": "Jay Rich",
    "group": "overall",
    "starters": [
      "Schauffele, X",
      "Fitzpatrick, M",
      "Reed, P",
      "Rahm, J"
    ],
    "bench": [
      "Scheffler, S",
      "Hatton, T"
    ]
  },
  {
    "id": "duffers-1",
    "name": "Duffers 1",
    "group": "overall",
    "starters": [
      "Schauffele, X",
      "Scheffler, S",
      "Hatton, T",
      "Spaun, JJ"
    ],
    "bench": [
      "Burns, S",
      "Fitzpatrick, M"
    ]
  },
  {
    "id": "duffers-2",
    "name": "Duffers 2",
    "group": "overall",
    "starters": [
      "McIlroy, R",
      "Fleetwood, T",
      "Fitzpatrick, M",
      "Young, C"
    ],
    "bench": [
      "Rahm, Jon",
      "Burns, S"
    ]
  },
  {
    "id": "duffers-3",
    "name": "Duffers 3",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Burns, S",
      "Henley, R",
      "Kim, Si Woo"
    ],
    "bench": [
      "Schaufele, X",
      "Aberg, L"
    ]
  },
  {
    "id": "rob-hastings",
    "name": "Rob Hastings",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Schauffele, X",
      "Fleetwood, T",
      "Young, C"
    ],
    "bench": [
      "Fleetwood, T",
      "Burns, S"
    ]
  },
  {
    "id": "rob-y-1",
    "name": "Rob Y 1",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Schauffele, X",
      "Fitzpatrick, M",
      "Young, C"
    ],
    "bench": [
      "Aberg, L",
      "Fleetwood, T"
    ]
  },
  {
    "id": "rob-y-2",
    "name": "Rob Y 2",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Schauffele, X",
      "Aberg, L",
      "DeChambeau, B"
    ],
    "bench": [
      "Rahm, Jon",
      "Fitzpatrick, M"
    ]
  },
  {
    "id": "rob-y-3",
    "name": "Rob Y 3",
    "group": "overall",
    "starters": [
      "McIlroy, R",
      "Schauffele, X",
      "Aberg, L",
      "Young, C"
    ],
    "bench": [
      "Fleetwood, T",
      "Rahm, J"
    ]
  },
  {
    "id": "rob-y-4",
    "name": "Rob Y 4",
    "group": "overall",
    "starters": [
      "McIlroy, R",
      "Fitzpatrick, M",
      "Fleetwood, T",
      "Young, C"
    ],
    "bench": [
      "Schaufele, X",
      "Koepka, B"
    ]
  },
  {
    "id": "mike",
    "name": "Mike",
    "group": "family",
    "starters": [
      "Scheffler, S",
      "Fleetwood, T",
      "Fitzpatrick, M",
      "Henley, R"
    ],
    "bench": [
      "Koepka, B",
      "Clark, W"
    ]
  },
  {
    "id": "scott",
    "name": "Scott",
    "group": "family",
    "starters": [
      "Scheffler, S",
      "Fleetwood, T",
      "Schauffele, X",
      "Reed, P"
    ],
    "bench": [
      "English, H",
      "Clark, W"
    ]
  },
  {
    "id": "nicholas",
    "name": "Nicholas",
    "group": "family",
    "starters": [
      "Scheffler, S",
      "Hatton, T",
      "DeChambeau, B",
      "Aberg, L"
    ],
    "bench": [
      "Reed, P",
      "Kim, Si Woo"
    ]
  },
  {
    "id": "christopher",
    "name": "Christopher",
    "group": "family",
    "starters": [
      "Scheffler, S",
      "Schauffele, X",
      "Fitzpatrick, M",
      "Young, C"
    ],
    "bench": [
      "Reed, P",
      "Kim, Si Woo"
    ]
  },
  {
    "id": "andrew-tara",
    "name": "Andrew/Tara",
    "group": "family",
    "starters": [
      "McIlroy, R",
      "Hatton, T",
      "Morikawa, C",
      "Young, C"
    ],
    "bench": [
      "Henley, T",
      "Fleetwood, T"
    ]
  },
  {
    "id": "jim-bob-1",
    "name": "Jim Bob 1",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Fitzpatrick, M",
      "Henley, R",
      "Young, C"
    ],
    "bench": [
      "Rahm, Jon",
      "Schauffele, X"
    ]
  },
  {
    "id": "jim-bob-2",
    "name": "Jim Bob 2",
    "group": "overall",
    "starters": [
      "Scheffler, S",
      "Fitzpatrick, M",
      "Henley, R",
      "Fleetwood, T"
    ],
    "bench": [
      "Young, C",
      "Kim, Si Woo"
    ]
  },
  {
    "id": "jim-bob-3",
    "name": "Jim Bob 3",
    "group": "overall",
    "starters": [
      "McIlroy, R",
      "Clark, W",
      "Aberg, L",
      "Young, C"
    ],
    "bench": [
      "Fleetwood, T",
      "smith, C"
    ]
  },
  {
    "id": "jim-bob-4",
    "name": "Jim Bob 4",
    "group": "overall",
    "starters": [
      "McIlroy, R",
      "Hatton, T",
      "McNealy, M",
      "Young, C"
    ],
    "bench": [
      "Henley, T",
      "Fitzpatrick, M"
    ]
  }
]
