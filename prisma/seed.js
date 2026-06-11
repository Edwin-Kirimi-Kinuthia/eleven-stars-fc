// npx prisma db seed
// Populates: standings + fixtures for Conference League 2026
// Run with: DATABASE_URL=... npx prisma db seed

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const LEAGUE = 'Conference League 2026'

function dt(dateStr, hour = 13) {
  const d = new Date(`${dateStr}T${String(hour).padStart(2,'0')}:00:00`)
  return d
}

async function main() {
  console.log('Seeding standings…')
  await prisma.standing.deleteMany()
  await prisma.standing.createMany({ data: [
    { leagueName: LEAGUE, position:  1, teamName: 'Mwanika FC',           played: 2, won: 2, drawn: 0, lost: 0, gf: 7, ga: 1, points: 6,  isOurTeam: false },
    { leagueName: LEAGUE, position:  2, teamName: 'Eleven Stars FC',      played: 2, won: 2, drawn: 0, lost: 0, gf: 7, ga: 4, points: 6,  isOurTeam: true  },
    { leagueName: LEAGUE, position:  3, teamName: 'Supervisor FC',        played: 2, won: 2, drawn: 0, lost: 0, gf: 4, ga: 2, points: 6,  isOurTeam: false },
    { leagueName: LEAGUE, position:  4, teamName: 'Gachua United',        played: 2, won: 2, drawn: 0, lost: 0, gf: 2, ga: 0, points: 6,  isOurTeam: false },
    { leagueName: LEAGUE, position:  5, teamName: 'Classic FC',           played: 3, won: 1, drawn: 1, lost: 1, gf: 8, ga: 4, points: 4,  isOurTeam: false },
    { leagueName: LEAGUE, position:  6, teamName: 'Kambiti Dynamics FC',  played: 2, won: 1, drawn: 1, lost: 0, gf: 3, ga: 1, points: 4,  isOurTeam: false },
    { leagueName: LEAGUE, position:  7, teamName: "Kaing'inyo FC",        played: 2, won: 1, drawn: 0, lost: 1, gf: 2, ga: 2, points: 3,  isOurTeam: false },
    { leagueName: LEAGUE, position:  8, teamName: 'Ghetto FC',            played: 3, won: 0, drawn: 2, lost: 1, gf: 3, ga: 4, points: 2,  isOurTeam: false },
    { leagueName: LEAGUE, position:  9, teamName: 'South Strikes FC',     played: 3, won: 0, drawn: 1, lost: 2, gf: 6, ga: 8, points: 1,  isOurTeam: false },
    { leagueName: LEAGUE, position: 10, teamName: 'Santos FC',            played: 3, won: 0, drawn: 1, lost: 2, gf: 2, ga: 6, points: 1,  isOurTeam: false },
    { leagueName: LEAGUE, position: 11, teamName: 'Dragon Hills',         played: 2, won: 0, drawn: 0, lost: 2, gf: 1, ga: 4, points: 0,  isOurTeam: false },
    { leagueName: LEAGUE, position: 12, teamName: 'Elite Kickers',        played: 2, won: 0, drawn: 0, lost: 2, gf: 0, ga: 9, points: 0,  isOurTeam: false },
  ]})
  console.log('  12 standings created.')

  console.log('Seeding fixtures…')
  await prisma.fixture.deleteMany()

  // ── COMPLETED ──────────────────────────────────────────────────
  const completed = [
    // May 17
    { date: dt('2026-05-17'), homeTeam: 'Supervisor FC',       awayTeam: 'South Strikes FC',    homeScore: 3, awayScore: 2, venue: 'Mwiteria Primary School'   },
    { date: dt('2026-05-17'), homeTeam: 'Eleven Stars FC',     awayTeam: 'Santos FC',            homeScore: 3, awayScore: 1, venue: 'Mwirine Primary School'    },
    { date: dt('2026-05-17'), homeTeam: 'Ghetto FC',           awayTeam: 'Kambiti Dynamics FC',  homeScore: 1, awayScore: 1, venue: 'Irinda Primary School'     },
    { date: dt('2026-05-17'), homeTeam: 'Mwanika FC',          awayTeam: 'Dragon Hills',         homeScore: 3, awayScore: 1, venue: 'Gichunge Primary School'   },
    { date: dt('2026-05-17'), homeTeam: 'Gachua United',       awayTeam: "Kaing'inyo FC",        homeScore: 1, awayScore: 0, venue: 'Gachua Primary School'     },
    { date: dt('2026-05-17'), homeTeam: 'Classic FC',          awayTeam: 'Elite Kickers',        homeScore: 5, awayScore: 0, venue: 'Gachua Primary School'     },
    // May 24
    { date: dt('2026-05-24'), homeTeam: 'Elite Kickers',       awayTeam: 'Mwanika FC',           homeScore: 0, awayScore: 4, venue: 'Kianthumbi Primary School' },
    { date: dt('2026-05-24'), homeTeam: 'South Strikes FC',    awayTeam: 'Eleven Stars FC',      homeScore: 3, awayScore: 4, venue: 'Karirwara Primary School'  },
    { date: dt('2026-05-24'), homeTeam: 'Kambiti Dynamics FC', awayTeam: 'Santos FC',            homeScore: 2, awayScore: 0, venue: 'Kambiti Primary School'    },
    { date: dt('2026-05-24'), homeTeam: "Kaing'inyo FC",       awayTeam: 'Classic FC',           homeScore: 2, awayScore: 1, venue: 'Kainginyo Primary School'  },
    { date: dt('2026-05-24'), homeTeam: 'Ghetto FC',           awayTeam: 'Gachua United',        homeScore: 0, awayScore: 1, venue: 'Irinda Primary School'     },
    { date: dt('2026-05-24'), homeTeam: 'Dragon Hills',        awayTeam: 'Supervisor FC',        homeScore: 0, awayScore: 1, venue: 'Gikumene Primary School'   },
    // May 31
    { date: dt('2026-05-31'), homeTeam: 'Santos FC',           awayTeam: 'South Strikes FC',    homeScore: 1, awayScore: 1, venue: 'Mwirine Primary School'    },
    { date: dt('2026-05-31'), homeTeam: 'Classic FC',          awayTeam: 'Ghetto FC',            homeScore: 2, awayScore: 2, venue: 'Gachua Primary School'     },
  ]

  // ── UPCOMING ───────────────────────────────────────────────────
  const upcoming = [
    // May 31 — postponed, to be rescheduled
    { date: dt('2026-05-31'), homeTeam: 'Supervisor FC',       awayTeam: 'Elite Kickers',        venue: 'Mwiteria Primary School'   },
    { date: dt('2026-05-31'), homeTeam: 'Eleven Stars FC',     awayTeam: 'Dragon Hills',          venue: 'Mwirine Primary School'    },
    { date: dt('2026-05-31'), homeTeam: 'Mwanika FC',          awayTeam: "Kaing'inyo FC",         venue: 'Gichunge Primary School'   },
    { date: dt('2026-05-31'), homeTeam: 'Gachua United',       awayTeam: 'Kambiti Dynamics FC',   venue: 'Gachua Primary School'     },
    // Jun 7
    { date: dt('2026-06-07'), homeTeam: "Kaing'inyo FC",       awayTeam: 'Supervisor FC',         venue: 'Kainginyo Primary School'  },
    { date: dt('2026-06-07'), homeTeam: 'Ghetto FC',           awayTeam: 'Mwanika FC',            venue: 'Irinda Primary School'     },
    { date: dt('2026-06-07'), homeTeam: 'Dragon Hills',        awayTeam: 'Santos FC',             venue: 'Gikumene Primary School'   },
    { date: dt('2026-06-07'), homeTeam: 'Gachua United',       awayTeam: 'Classic FC',            venue: 'Gachua Primary School'     },
    { date: dt('2026-06-07'), homeTeam: 'Elite Kickers',       awayTeam: 'Eleven Stars FC',       venue: 'Kianthumbi Primary School' },
    { date: dt('2026-06-07'), homeTeam: 'Kambiti Dynamics FC', awayTeam: 'South Strikes FC',      venue: 'Kambiti Primary School'    },
    // Jun 14
    { date: dt('2026-06-14'), homeTeam: 'Supervisor FC',       awayTeam: 'Ghetto FC',             venue: 'Mwiteria Primary School'   },
    { date: dt('2026-06-14'), homeTeam: 'Eleven Stars FC',     awayTeam: "Kaing'inyo FC",         venue: 'Mwirine Primary School'    },
    { date: dt('2026-06-14'), homeTeam: 'Santos FC',           awayTeam: 'Elite Kickers',         venue: 'Mwirine Primary School'    },
    { date: dt('2026-06-14'), homeTeam: 'South Strikes FC',    awayTeam: 'Dragon Hills',          venue: 'Karirwara Primary School'  },
    { date: dt('2026-06-14'), homeTeam: 'Mwanika FC',          awayTeam: 'Gachua United',         venue: 'Gichunge Primary School'   },
    { date: dt('2026-06-14'), homeTeam: 'Classic FC',          awayTeam: 'Kambiti Dynamics FC',   venue: 'Gachua Primary School'     },
    // Jun 21
    { date: dt('2026-06-21'), homeTeam: 'Elite Kickers',       awayTeam: 'South Strikes FC',      venue: 'Kianthumbi Primary School' },
    { date: dt('2026-06-21'), homeTeam: 'Kambiti Dynamics FC', awayTeam: 'Dragon Hills',          venue: 'Kambiti Primary School'    },
    { date: dt('2026-06-21'), homeTeam: "Kaing'inyo FC",       awayTeam: 'Santos FC',             venue: 'Kainginyo Primary School'  },
    { date: dt('2026-06-21'), homeTeam: 'Ghetto FC',           awayTeam: 'Eleven Stars FC',       venue: 'Irinda Primary School'     },
    { date: dt('2026-06-21'), homeTeam: 'Gachua United',       awayTeam: 'Supervisor FC',         venue: 'Gachua Primary School'     },
    { date: dt('2026-06-21'), homeTeam: 'Classic FC',          awayTeam: 'Mwanika FC',            venue: 'Gachua Primary School'     },
    // Jun 28
    { date: dt('2026-06-28'), homeTeam: 'Supervisor FC',       awayTeam: 'Classic FC',            venue: 'Mwiteria Primary School'   },
    { date: dt('2026-06-28'), homeTeam: 'Eleven Stars FC',     awayTeam: 'Gachua United',         venue: 'Mwirine Primary School'    },
    { date: dt('2026-06-28'), homeTeam: 'Santos FC',           awayTeam: 'Ghetto FC',             venue: 'Mwirine Primary School'    },
    { date: dt('2026-06-28'), homeTeam: 'South Strikes FC',    awayTeam: "Kaing'inyo FC",         venue: 'Karirwara Primary School'  },
    { date: dt('2026-06-28'), homeTeam: 'Dragon Hills',        awayTeam: 'Elite Kickers',         venue: 'Gikumene Primary School'   },
    { date: dt('2026-06-28'), homeTeam: 'Mwanika FC',          awayTeam: 'Kambiti Dynamics FC',   venue: 'Gichunge Primary School'   },
    // Jul 5
    { date: dt('2026-07-05'), homeTeam: 'Kambiti Dynamics FC', awayTeam: 'Elite Kickers',         venue: 'Kambiti Primary School'    },
    { date: dt('2026-07-05'), homeTeam: "Kaing'inyo FC",       awayTeam: 'Dragon Hills',          venue: 'Kainginyo Primary School'  },
    { date: dt('2026-07-05'), homeTeam: 'Ghetto FC',           awayTeam: 'South Strikes FC',      venue: 'Irinda Primary School'     },
    { date: dt('2026-07-05'), homeTeam: 'Mwanika FC',          awayTeam: 'Supervisor FC',         venue: 'Gichunge Primary School'   },
    { date: dt('2026-07-05'), homeTeam: 'Gachua United',       awayTeam: 'Santos FC',             venue: 'Gachua Primary School'     },
    { date: dt('2026-07-05'), homeTeam: 'Classic FC',          awayTeam: 'Eleven Stars FC',       venue: 'Gachua Primary School'     },
    // Jul 12
    { date: dt('2026-07-12'), homeTeam: 'Supervisor FC',       awayTeam: 'Kambiti Dynamics FC',   venue: 'Mwiteria Primary School'   },
    { date: dt('2026-07-12'), homeTeam: 'Eleven Stars FC',     awayTeam: 'Mwanika FC',            venue: 'Mwirine Primary School'    },
    { date: dt('2026-07-12'), homeTeam: 'Santos FC',           awayTeam: 'Classic FC',            venue: 'Mwirine Primary School'    },
    { date: dt('2026-07-12'), homeTeam: 'Elite Kickers',       awayTeam: "Kaing'inyo FC",         venue: 'Kianthumbi Primary School' },
    { date: dt('2026-07-12'), homeTeam: 'South Strikes FC',    awayTeam: 'Gachua United',         venue: 'Karirwara Primary School'  },
    { date: dt('2026-07-12'), homeTeam: 'Dragon Hills',        awayTeam: 'Ghetto FC',             venue: 'Gikumene Primary School'   },
    // Jul 19
    { date: dt('2026-07-19'), homeTeam: 'Supervisor FC',       awayTeam: 'Eleven Stars FC',       venue: 'Mwiteria Primary School'   },
    { date: dt('2026-07-19'), homeTeam: 'Kambiti Dynamics FC', awayTeam: "Kaing'inyo FC",         venue: 'Kambiti Primary School'    },
    { date: dt('2026-07-19'), homeTeam: 'Ghetto FC',           awayTeam: 'Elite Kickers',         venue: 'Irinda Primary School'     },
    { date: dt('2026-07-19'), homeTeam: 'Mwanika FC',          awayTeam: 'Santos FC',             venue: 'Gichunge Primary School'   },
    { date: dt('2026-07-19'), homeTeam: 'Gachua United',       awayTeam: 'Dragon Hills',          venue: 'Gachua Primary School'     },
    { date: dt('2026-07-19'), homeTeam: 'Classic FC',          awayTeam: 'South Strikes FC',      venue: 'Gachua Primary School'     },
  ]

  await prisma.fixture.createMany({
    data: completed.map(f => ({ ...f, status: 'completed', leagueName: LEAGUE })),
  })
  await prisma.fixture.createMany({
    data: upcoming.map(f => ({ ...f, status: 'upcoming', leagueName: LEAGUE })),
  })

  console.log(`  ${completed.length} completed + ${upcoming.length} upcoming fixtures created.`)
  console.log('Done.')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
