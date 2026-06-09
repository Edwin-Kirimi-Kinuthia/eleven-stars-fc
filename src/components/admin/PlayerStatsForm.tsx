'use client'

import { useState } from 'react'

interface PlayerStatsFormProps {
  position: string
  stats: Record<string, any>
  onChange: (stats: Record<string, number | boolean>) => void
}

export default function PlayerStatsForm({ position, stats, onChange }: PlayerStatsFormProps) {
  const handleStatChange = (field: string, value: string) => {
    const parsed = field === 'fifaRegistered'
      ? value === 'yes'
      : (value ? parseInt(value) : 0)
    onChange({ ...stats, [field]: parsed })
  }

  return (
    <div className="space-y-4">
      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
        <h3 className="text-white font-bold text-sm mb-4">{position} Stats</h3>

        {/* Common stats */}
        <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-white/10">
          <div>
            <label className="text-gray-400 text-xs font-bold block mb-2">Appearances</label>
            <input
              type="number"
              value={stats.appearances || 0}
              onChange={(e) => handleStatChange('appearances', e.target.value)}
              className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm"
            />
          </div>
          <div>
            <label className="text-gray-400 text-xs font-bold block mb-2">FIFA Registered</label>
            <select
              value={stats.fifaRegistered ? 'yes' : 'no'}
              onChange={(e) => handleStatChange('fifaRegistered', e.target.value)}
              className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm"
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
        </div>

        {/* Goalkeeper Stats */}
        {position === 'Goalkeeper' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-xs font-bold block mb-2">Saves</label>
              <input type="number" value={stats.saves || 0} onChange={(e) => handleStatChange('saves', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm" />
            </div>
            <div>
              <label className="text-gray-400 text-xs font-bold block mb-2">Clean Sheets</label>
              <input type="number" value={stats.cleanSheets || 0} onChange={(e) => handleStatChange('cleanSheets', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm" />
            </div>
            <div>
              <label className="text-gray-400 text-xs font-bold block mb-2">Goals Against</label>
              <input type="number" value={stats.goalsAgainst || 0} onChange={(e) => handleStatChange('goalsAgainst', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm" />
            </div>
          </div>
        )}

        {/* Defender/Center Back Stats */}
        {(position === 'Defender' || position === 'Center Back') && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-xs font-bold block mb-2">Tackles</label>
              <input type="number" value={stats.tackles || 0} onChange={(e) => handleStatChange('tackles', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm" />
            </div>
            <div>
              <label className="text-gray-400 text-xs font-bold block mb-2">Interceptions</label>
              <input type="number" value={stats.interceptions || 0} onChange={(e) => handleStatChange('interceptions', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm" />
            </div>
            <div>
              <label className="text-gray-400 text-xs font-bold block mb-2">Clearances</label>
              <input type="number" value={stats.clearances || 0} onChange={(e) => handleStatChange('clearances', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm" />
            </div>
            <div>
              <label className="text-gray-400 text-xs font-bold block mb-2">Blocks</label>
              <input type="number" value={stats.blocks || 0} onChange={(e) => handleStatChange('blocks', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm" />
            </div>
          </div>
        )}

        {/* Midfielder Stats */}
        {position === 'Midfielder' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-xs font-bold block mb-2">Passes</label>
              <input type="number" value={stats.passes || 0} onChange={(e) => handleStatChange('passes', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm" />
            </div>
            <div>
              <label className="text-gray-400 text-xs font-bold block mb-2">Pass Completion %</label>
              <input type="number" value={stats.passCompletion || 0} onChange={(e) => handleStatChange('passCompletion', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm" min="0" max="100" />
            </div>
            <div>
              <label className="text-gray-400 text-xs font-bold block mb-2">Tackles</label>
              <input type="number" value={stats.tackles || 0} onChange={(e) => handleStatChange('tackles', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm" />
            </div>
            <div>
              <label className="text-gray-400 text-xs font-bold block mb-2">Assists</label>
              <input type="number" value={stats.assists || 0} onChange={(e) => handleStatChange('assists', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm" />
            </div>
          </div>
        )}

        {/* Forward Stats */}
        {position === 'Forward' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-xs font-bold block mb-2">Goals</label>
              <input type="number" value={stats.goals || 0} onChange={(e) => handleStatChange('goals', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm" />
            </div>
            <div>
              <label className="text-gray-400 text-xs font-bold block mb-2">Assists</label>
              <input type="number" value={stats.assists || 0} onChange={(e) => handleStatChange('assists', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm" />
            </div>
            <div>
              <label className="text-gray-400 text-xs font-bold block mb-2">Shots</label>
              <input type="number" value={stats.shots || 0} onChange={(e) => handleStatChange('shots', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm" />
            </div>
            <div>
              <label className="text-gray-400 text-xs font-bold block mb-2">Shot Accuracy %</label>
              <input type="number" value={stats.shotAccuracy || 0} onChange={(e) => handleStatChange('shotAccuracy', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm" min="0" max="100" />
            </div>
            <div>
              <label className="text-gray-400 text-xs font-bold block mb-2">Dribbles</label>
              <input type="number" value={stats.dribbles || 0} onChange={(e) => handleStatChange('dribbles', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
