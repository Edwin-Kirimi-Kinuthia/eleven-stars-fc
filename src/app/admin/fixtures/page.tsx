'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Calendar, MapPin, Clock, Loader2, Trophy } from 'lucide-react'

interface Fixture {
  id: string; homeTeam: string; awayTeam: string; date?: string | null
  venue: string; status: string; leagueName: string
  homeScore?: number | null; awayScore?: number | null
}

interface Standing {
  id: string; leagueName: string; teamName: string; position: number
  played: number; won: number; drawn: number; lost: number
  gf: number; ga: number; points: number; isOurTeam: boolean
}

interface FormState {
  home: string; away: string; competition: string; date: string
  time: string; venue: string; status: 'upcoming' | 'completed'
  homeScore: string; awayScore: string
}

const emptyForm: FormState = {
  home: 'Eleven Stars FC', away: '', competition: 'Conference League 2026',
  date: '', time: '', venue: 'Meru Stadium', status: 'upcoming', homeScore: '', awayScore: '',
}

const emptyStand = {
  leagueName: 'Conference League 2026', teamName: '', position: '',
  played: '', won: '', drawn: '', lost: '', gf: '', ga: '', points: '', isOurTeam: false,
}

const ic = 'w-full px-3 py-2.5 rounded-xl text-white text-sm outline-none'
const is = { background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)' }
const lbl = (t: string) => <label className="text-gray-400 text-xs font-medium block mb-1.5">{t}</label>

function fmtDate(d?: string | null) {
  if (!d) return 'TBA'
  try { return new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }) } catch { return 'TBA' }
}
function fmtTime(d?: string | null) {
  if (!d) return 'TBA'
  try { const dt = new Date(d); const h = dt.getHours(), m = dt.getMinutes(); if (h === 0 && m === 0) return 'TBA'; return dt.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' }) } catch { return 'TBA' }
}
function toDate(d?: string | null) { if (!d) return ''; try { return new Date(d).toISOString().split('T')[0] } catch { return '' } }
function toTime(d?: string | null) { if (!d) return ''; try { const dt = new Date(d); return `${String(dt.getHours()).padStart(2,'0')}:${String(dt.getMinutes()).padStart(2,'0')}` } catch { return '' } }

export default function AdminFixturesPage() {
  const [tab, setTab] = useState<'fixtures'|'standings'>('fixtures')
  const [seeding, setSeeding] = useState(false)
  const [seedMsg, setSeedMsg] = useState('')

  const [fixtures, setFixtures] = useState<Fixture[]>([])
  const [loadF, setLoadF] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string|null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)

  const [standings, setStandings] = useState<Standing[]>([])
  const [loadS, setLoadS] = useState(true)
  const [savingS, setSavingS] = useState(false)
  const [showStand, setShowStand] = useState(false)
  const [editSId, setEditSId] = useState<string|null>(null)
  const [sf, setSf] = useState(emptyStand)

  useEffect(() => { fetchF(); fetchS() }, [])

  const seedLeague2026 = async () => {
    if (!confirm('This will DELETE all existing fixtures and standings, then load the 2026 Conference League data. Continue?')) return
    setSeeding(true); setSeedMsg('')
    try {
      const r = await fetch('/api/admin/seed-league-2026', { method: 'POST' })
      const d = await r.json()
      if (r.ok) {
        setSeedMsg(`✓ Loaded: 12 standings · ${d.completed} results · ${d.upcoming} upcoming`)
        await fetchF(); await fetchS()
      } else {
        setSeedMsg(`Error: ${d.error}`)
      }
    } catch (e) { setSeedMsg(`Error: ${e}`) } finally { setSeeding(false) }
  }

  const fetchF = async () => {
    try { setLoadF(true); const r = await fetch('/api/fixtures'); const d = await r.json(); setFixtures(Array.isArray(d)?d:[]) } catch { setFixtures([]) } finally { setLoadF(false) }
  }
  const fetchS = async () => {
    try { setLoadS(true); const r = await fetch('/api/standings'); const d = await r.json(); setStandings(Array.isArray(d)?d:[]) } catch { setStandings([]) } finally { setLoadS(false) }
  }

  const set = (k: keyof FormState, v: string) => setForm(p => ({...p,[k]:v}))
  const ss = (k: string, v: string|boolean) => setSf(p => ({...p,[k]:v}))

  const openNew = () => { setEditId(null); setForm(emptyForm); setShowForm(true) }
  const openEdit = (f: Fixture) => {
    setEditId(f.id)
    setForm({ home: f.homeTeam, away: f.awayTeam, competition: f.leagueName, date: toDate(f.date), time: toTime(f.date), venue: f.venue, status: f.status as 'upcoming'|'completed', homeScore: f.homeScore!=null?String(f.homeScore):'', awayScore: f.awayScore!=null?String(f.awayScore):'' })
    setShowForm(true)
  }
  const openNewS = () => { setEditSId(null); setSf(emptyStand); setShowStand(true) }
  const openEditS = (s: Standing) => {
    setEditSId(s.id)
    setSf({ leagueName: s.leagueName, teamName: s.teamName, position: String(s.position), played: String(s.played), won: String(s.won), drawn: String(s.drawn), lost: String(s.lost), gf: String(s.gf), ga: String(s.ga), points: String(s.points), isOurTeam: s.isOurTeam })
    setShowStand(true)
  }

  const saveF = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    try {
      const method = editId ? 'PATCH' : 'POST'
      const url = editId ? `/api/fixtures/${editId}` : '/api/fixtures'
      const r = await fetch(url, { method, headers: {'Content-Type':'application/json'}, body: JSON.stringify(form) })
      if (r.ok) { await fetchF(); setShowForm(false) }
    } catch { /* ignore */ } finally { setSaving(false) }
  }

  const delF = async (id: string) => {
    if (!confirm('Delete this fixture?')) return
    try { const r = await fetch(`/api/fixtures/${id}`, { method: 'DELETE' }); if (r.ok) await fetchF() } catch { /* ignore */ }
  }

  const saveS = async (e: React.FormEvent) => {
    e.preventDefault(); setSavingS(true)
    try {
      const method = editSId ? 'PATCH' : 'POST'
      const url = editSId ? `/api/standings/${editSId}` : '/api/standings'
      const r = await fetch(url, { method, headers: {'Content-Type':'application/json'}, body: JSON.stringify(sf) })
      if (r.ok) { await fetchS(); setShowStand(false) }
    } catch { /* ignore */ } finally { setSavingS(false) }
  }

  const delS = async (id: string) => {
    if (!confirm('Remove team from table?')) return
    try { const r = await fetch(`/api/standings/${id}`, { method: 'DELETE' }); if (r.ok) await fetchS() } catch { /* ignore */ }
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-white text-2xl font-black">Fixtures &amp; Standings</h1>
        <p className="text-gray-400 text-sm mt-0.5">Manage matches and league table</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {([['fixtures','Fixtures',Calendar],['standings','League Table',Trophy]] as const).map(([id, label, Icon]) => (
          <button key={id} onClick={() => setTab(id)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ background: tab===id ? 'linear-gradient(135deg,#E91E8C,#C4186F)' : 'rgba(255,255,255,0.05)', color: tab===id?'white':'#9CA3AF', border:'1px solid '+(tab===id?'transparent':'rgba(255,255,255,0.08)') }}>
            <Icon size={14} /> {label}
          </button>
        ))}
        <div className="ml-auto flex flex-col items-end gap-1">
          <button onClick={seedLeague2026} disabled={seeding}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 transition-all hover:scale-105"
            style={{ background: 'rgba(201,168,76,0.15)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.3)' }}>
            {seeding ? <Loader2 size={14} className="animate-spin" /> : <Trophy size={14} />}
            Load 2026 Season Data
          </button>
          {seedMsg && <p className="text-xs" style={{ color: seedMsg.startsWith('✓') ? '#4ADE80' : '#F87171' }}>{seedMsg}</p>}
        </div>
      </div>

      {/* FIXTURES */}
      {tab === 'fixtures' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold hover:scale-105 transition-all" style={{ background: 'linear-gradient(135deg,#E91E8C,#C4186F)' }}>
              <Plus size={16} /> Add Fixture
            </button>
          </div>

          {showForm && (
            <div className="rounded-2xl p-6 space-y-4" style={{ background: '#141414', border: '1px solid rgba(233,30,140,0.2)' }}>
              <h3 className="text-white font-bold text-base">{editId ? 'Edit Fixture' : 'New Fixture'}</h3>
              <form onSubmit={saveF} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>{lbl('Home Team')}<input value={form.home} onChange={e=>set('home',e.target.value)} className={ic} style={is} required /></div>
                  <div>{lbl('Away Team')}<input value={form.away} onChange={e=>set('away',e.target.value)} placeholder="e.g. FC Tharaka" className={ic} style={is} required /></div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>{lbl('Date')}<input type="date" value={form.date} onChange={e=>set('date',e.target.value)} className={ic} style={is} /></div>
                  <div>{lbl('Time')}<input type="time" value={form.time} onChange={e=>set('time',e.target.value)} className={ic} style={is} /></div>
                  <div>{lbl('Status')}<select value={form.status} onChange={e=>set('status',e.target.value as 'upcoming'|'completed')} className={ic} style={{...is,cursor:'pointer'}}><option value="upcoming">Upcoming</option><option value="completed">Completed</option></select></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>{lbl('Venue')}<input value={form.venue} onChange={e=>set('venue',e.target.value)} className={ic} style={is} /></div>
                  <div>{lbl('Competition')}<input value={form.competition} onChange={e=>set('competition',e.target.value)} className={ic} style={is} /></div>
                </div>
                {form.status==='completed' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>{lbl('Home Score')}<input type="number" min="0" value={form.homeScore} onChange={e=>set('homeScore',e.target.value)} className={ic} style={is} /></div>
                    <div>{lbl('Away Score')}<input type="number" min="0" value={form.awayScore} onChange={e=>set('awayScore',e.target.value)} className={ic} style={is} /></div>
                  </div>
                )}
                <div className="flex gap-3">
                  <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold disabled:opacity-50" style={{ background: 'linear-gradient(135deg,#E91E8C,#C4186F)' }}>
                    {saving && <Loader2 size={14} className="animate-spin" />}{editId?'Update':'Add Fixture'}
                  </button>
                  <button type="button" onClick={()=>setShowForm(false)} className="px-5 py-2.5 rounded-xl text-gray-300 text-sm font-semibold" style={{ background: 'rgba(255,255,255,0.06)' }}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          {loadF ? <div className="flex justify-center py-12"><Loader2 size={28} className="text-pink animate-spin" /></div>
          : fixtures.length===0 ? <div className="p-10 rounded-2xl bg-surface border border-white/8 text-center"><p className="text-gray-400 text-sm">No fixtures yet.</p></div>
          : (
            <div className="space-y-3">
              {fixtures.map(f => (
                <div key={f.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-2xl" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex-1 space-y-2">
                    <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: f.status==='upcoming'?'rgba(233,30,140,0.15)':'rgba(34,197,94,0.15)', color: f.status==='upcoming'?'#E91E8C':'#4ADE80' }}>{f.status==='upcoming'?'Upcoming':'Completed'}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-white font-black text-base">{f.homeTeam}</span>
                      {f.status==='completed' ? <span className="px-3 py-1 rounded-lg font-black text-white" style={{ background: 'rgba(255,255,255,0.08)' }}>{f.homeScore} – {f.awayScore}</span> : <span className="px-3 py-1 rounded-lg font-black" style={{ background: 'rgba(201,168,76,0.1)', color: '#C9A84C' }}>VS</span>}
                      <span className="text-white font-black text-base">{f.awayTeam}</span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1.5"><Calendar size={11} style={{ color: '#E91E8C' }} />{fmtDate(f.date)}</span>
                      <span className="flex items-center gap-1.5"><Clock size={11} style={{ color: '#E91E8C' }} />{fmtTime(f.date)}</span>
                      <span className="flex items-center gap-1.5"><MapPin size={11} style={{ color: '#E91E8C' }} />{f.venue}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={()=>openEdit(f)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10"><Pencil size={14} /></button>
                    <button onClick={()=>delF(f.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-red-500/10"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* STANDINGS */}
      {tab === 'standings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">{standings.length} team(s)</p>
            <button onClick={openNewS} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold hover:scale-105 transition-all" style={{ background: 'linear-gradient(135deg,#E91E8C,#C4186F)' }}>
              <Plus size={16} /> Add Team
            </button>
          </div>

          {showStand && (
            <div className="rounded-2xl p-6 space-y-4" style={{ background: '#141414', border: '1px solid rgba(233,30,140,0.2)' }}>
              <h3 className="text-white font-bold text-base">{editSId ? 'Edit Team' : 'Add Team'}</h3>
              <form onSubmit={saveS} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>{lbl('Team Name')}<input value={sf.teamName} onChange={e=>ss('teamName',e.target.value)} className={ic} style={is} required placeholder="e.g. Eleven Stars FC" /></div>
                  <div>{lbl('Position')}<input type="number" min="1" value={sf.position as string} onChange={e=>ss('position',e.target.value)} className={ic} style={is} placeholder="1" /></div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>{lbl('Played')}<input type="number" min="0" value={sf.played as string} onChange={e=>ss('played',e.target.value)} className={ic} style={is} /></div>
                  <div>{lbl('Won')}<input type="number" min="0" value={sf.won as string} onChange={e=>ss('won',e.target.value)} className={ic} style={is} /></div>
                  <div>{lbl('Drawn')}<input type="number" min="0" value={sf.drawn as string} onChange={e=>ss('drawn',e.target.value)} className={ic} style={is} /></div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div>{lbl('Lost')}<input type="number" min="0" value={sf.lost as string} onChange={e=>ss('lost',e.target.value)} className={ic} style={is} /></div>
                  <div>{lbl('GF')}<input type="number" min="0" value={sf.gf as string} onChange={e=>ss('gf',e.target.value)} className={ic} style={is} /></div>
                  <div>{lbl('GA')}<input type="number" min="0" value={sf.ga as string} onChange={e=>ss('ga',e.target.value)} className={ic} style={is} /></div>
                  <div>{lbl('Pts')}<input type="number" min="0" value={sf.points as string} onChange={e=>ss('points',e.target.value)} className={ic} style={is} /></div>
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={sf.isOurTeam as boolean} onChange={e=>ss('isOurTeam',e.target.checked)} className="w-4 h-4 accent-pink" />
                  <span className="text-gray-400 text-sm">This is Eleven Stars FC (highlight in table)</span>
                </label>
                <div className="flex gap-3">
                  <button type="submit" disabled={savingS} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold disabled:opacity-50" style={{ background: 'linear-gradient(135deg,#E91E8C,#C4186F)' }}>
                    {savingS && <Loader2 size={14} className="animate-spin" />}{editSId?'Update':'Add Team'}
                  </button>
                  <button type="button" onClick={()=>setShowStand(false)} className="px-5 py-2.5 rounded-xl text-gray-300 text-sm font-semibold" style={{ background: 'rgba(255,255,255,0.06)' }}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          {loadS ? <div className="flex justify-center py-12"><Loader2 size={28} className="text-pink animate-spin" /></div>
          : standings.length===0 ? <div className="p-10 rounded-2xl bg-surface border border-white/8 text-center"><p className="text-gray-400 text-sm">No standings yet. Add teams to build the league table.</p></div>
          : (
            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: '#141414', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    {['#','Team','P','W','D','L','GF','GA','Pts',''].map(h => <th key={h} className="px-3 py-3 text-xs font-semibold text-gray-400" style={{ textAlign: h==='Team'||h===''?undefined:'center' }}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {[...standings].sort((a,b)=>a.position-b.position).map(s => (
                    <tr key={s.id} style={{ background: s.isOurTeam?'rgba(233,30,140,0.07)':'#0D0D0D', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td className="px-3 py-3 text-center text-gray-500 text-xs">{s.position}</td>
                      <td className="px-3 py-3 font-semibold" style={{ color: s.isOurTeam?'#E91E8C':'#fff' }}>{s.teamName}</td>
                      <td className="px-3 py-3 text-center text-gray-400">{s.played}</td>
                      <td className="px-3 py-3 text-center text-gray-400">{s.won}</td>
                      <td className="px-3 py-3 text-center text-gray-400">{s.drawn}</td>
                      <td className="px-3 py-3 text-center text-gray-400">{s.lost}</td>
                      <td className="px-3 py-3 text-center text-gray-400">{s.gf}</td>
                      <td className="px-3 py-3 text-center text-gray-400">{s.ga}</td>
                      <td className="px-3 py-3 text-center font-bold" style={{ color: s.isOurTeam?'#E91E8C':'#C9A84C' }}>{s.points}</td>
                      <td className="px-3 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={()=>openEditS(s)} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10"><Pencil size={12} /></button>
                          <button onClick={()=>delS(s.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-red-500/10"><Trash2 size={12} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
