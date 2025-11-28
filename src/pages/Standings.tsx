import React, { useEffect, useState } from 'react';
import { getStandings, getTeams, createStanding, updateStanding, deleteStanding } from '../api';
import type { Standing, Team } from '../types';
import { FaTrophy, FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';

const Standings: React.FC = () => {
  const [standings, setStandings] = useState<Standing[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterConference, setFilterConference] = useState<'All' | 'East' | 'West'>('All');
  
  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    team_id: '',
    wins: 0,
    losses: 0,
    conference: 'East',
    rank: 1
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sData, tData] = await Promise.all([getStandings(), getTeams()]);
      
      // Sort by Win % (descending), then Wins (descending), then Losses (ascending)
      const sorted = sData.sort((a, b) => {
        const winPctA = (a.wins + a.losses) > 0 ? a.wins / (a.wins + a.losses) : 0;
        const winPctB = (b.wins + b.losses) > 0 ? b.wins / (b.wins + b.losses) : 0;
        
        if (winPctA !== winPctB) return winPctB - winPctA;
        if (a.wins !== b.wins) return b.wins - a.wins;
        return a.losses - b.losses;
      });

      setStandings(sorted);
      setTeams(tData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (standing: Standing) => {
    setFormData({
      team_id: standing.team_id,
      wins: standing.wins,
      losses: standing.losses,
      conference: standing.conference || 'East',
      rank: standing.rank || 1
    });
    setEditId(standing.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this standing?')) {
      try {
        await deleteStanding(id);
        fetchData();
      } catch (error) {
        console.error("Error deleting standing:", error);
        alert("Failed to delete standing");
      }
    }
  };

  const resetForm = () => {
    setFormData({ team_id: '', wins: 0, losses: 0, conference: 'East', rank: 1 });
    setIsEditing(false);
    setEditId(null);
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && editId) {
        await updateStanding(editId, formData);
      } else {
        await createStanding(formData);
      }
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Error saving standing:", error);
      alert("Failed to save standing");
    }
  };

  const getTeamName = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    return team ? `${team.city} ${team.name}` : 'Unknown Team';
  };

  const filteredStandings = standings.filter(s => 
    filterConference === 'All' ? true : s.conference === filterConference
  );

  return (
    <>
      <div className="max-w-6xl mx-auto animate-fade-in pb-20">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-500/10 rounded-xl">
              <FaTrophy className="text-yellow-500 text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">League Standings</h1>
              <p className="text-slate-400 text-sm">Manage team rankings and records</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Filter Buttons */}
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
              {(['All', 'East', 'West'] as const).map((conf) => (
                <button
                  key={conf}
                  onClick={() => setFilterConference(conf)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    filterConference === conf 
                      ? 'bg-slate-800 text-white shadow-sm' 
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {conf}
                </button>
              ))}
            </div>

            <button 
              onClick={() => { resetForm(); setIsModalOpen(true); }}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all btn-primary"
            >
              <FaPlus /> Add Standing
            </button>
          </div>
        </div>

        {/* Standings Table */}
        <div className="glass-panel rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading standings...</div>
          ) : filteredStandings.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No standings found for this filter.</div>
          ) : (
            <>
              {/* Desktop View (Table) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-950/50 border-b border-white/10 text-xs uppercase tracking-widest text-slate-400">
                      <th className="p-4 font-bold">Rank</th>
                      <th className="p-4 font-bold">Team</th>
                      <th className="p-4 font-bold">Conf</th>
                      <th className="p-4 font-bold text-center">W</th>
                      <th className="p-4 font-bold text-center">L</th>
                      <th className="p-4 font-bold text-center">Win %</th>
                      <th className="p-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredStandings.map((standing, index) => {
                      const winPct = (standing.wins + standing.losses) > 0 
                        ? (standing.wins / (standing.wins + standing.losses)).toFixed(3) 
                        : '.000';
                      
                      // Global Rank based on sorted array index + 1
                      // If filtering, we might want to show their actual rank within that filter or global rank.
                      // Usually standings show rank 1..N for the current view.
                      const displayRank = index + 1; 
                      
                      return (
                        <tr key={standing.id} className="hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-transparent transition-all duration-300 group border-b border-white/5 last:border-0">
                          <td className="p-4 font-medium text-slate-400 group-hover:text-white transition-colors">#{displayRank}</td>
                          <td className="p-4 font-semibold text-white group-hover:text-blue-400 transition-colors">
                            {standing.teams ? `${standing.teams.city} ${standing.teams.name}` : getTeamName(standing.team_id)}
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                              standing.conference === 'East' 
                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>
                              {standing.conference}
                            </span>
                          </td>
                          <td className="p-4 text-center text-green-400 font-bold">{standing.wins}</td>
                          <td className="p-4 text-center text-red-400 font-bold">{standing.losses}</td>
                          <td className="p-4 text-center text-slate-300 font-mono">{winPct}</td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => handleEdit(standing)}
                                className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <FaEdit />
                              </button>
                              <button 
                                onClick={() => handleDelete(standing.id)}
                                className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile View (Cards) */}
              <div className="md:hidden space-y-4 p-4">
                {filteredStandings.map((standing, index) => {
                  const winPct = (standing.wins + standing.losses) > 0 
                    ? (standing.wins / (standing.wins + standing.losses)).toFixed(3) 
                    : '.000';
                  const displayRank = index + 1;

                  return (
                    <div key={standing.id} className="glass-card p-5 rounded-xl relative">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="text-3xl font-black text-slate-700">#{displayRank}</div>
                        <div className="flex-1">
                          <div className="font-bold text-white text-lg leading-tight mb-1">
                            {standing.teams ? `${standing.teams.city} ${standing.teams.name}` : getTeamName(standing.team_id)}
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            standing.conference === 'East' 
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                              : 'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}>
                            {standing.conference}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="bg-slate-950/50 p-3 rounded-xl text-center border border-white/5">
                          <div className="text-[10px] text-slate-500 font-bold uppercase">Wins</div>
                          <div className="text-xl font-bold text-green-400">{standing.wins}</div>
                        </div>
                        <div className="bg-slate-950/50 p-3 rounded-xl text-center border border-white/5">
                          <div className="text-[10px] text-slate-500 font-bold uppercase">Losses</div>
                          <div className="text-xl font-bold text-red-400">{standing.losses}</div>
                        </div>
                        <div className="bg-slate-950/50 p-3 rounded-xl text-center border border-white/5">
                          <div className="text-[10px] text-slate-500 font-bold uppercase">Win %</div>
                          <div className="text-xl font-bold text-slate-300">{winPct}</div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEdit(standing)} 
                          className="flex-1 py-2 rounded-lg bg-blue-500/10 text-blue-400 font-bold text-sm hover:bg-blue-500/20 transition-colors flex items-center justify-center gap-2"
                        >
                          <FaEdit /> Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(standing.id)} 
                          className="flex-1 py-2 rounded-lg bg-red-500/10 text-red-400 font-bold text-sm hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl glass-panel p-6 rounded-2xl relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
            >
              <FaTimes size={20} />
            </button>

            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-wider">
              {isEditing ? <FaEdit className="text-blue-400" /> : <FaPlus className="text-green-400" />}
              {isEditing ? 'Edit Standing' : 'Add New Standing'}
            </h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="text-[10px] font-bold text-slate-500 mb-1.5 block uppercase tracking-wider">Team</label>
                <select 
                  className="w-full glass-input rounded-xl px-4 py-3 appearance-none" 
                  required 
                  value={formData.team_id} 
                  onChange={e => setFormData({...formData, team_id: e.target.value})}
                >
                  <option value="" className="bg-slate-900">Select Team</option>
                  {teams.map(t => <option key={t.id} value={t.id} className="bg-slate-900">{t.city} {t.name}</option>)}
                </select>
              </div>
              
              <div>
                <label className="text-[10px] font-bold text-slate-500 mb-1.5 block uppercase tracking-wider">Conference</label>
                <select 
                  className="w-full glass-input rounded-xl px-4 py-3 appearance-none" 
                  required 
                  value={formData.conference} 
                  onChange={e => setFormData({...formData, conference: e.target.value})}
                >
                  <option value="East" className="bg-slate-900">East</option>
                  <option value="West" className="bg-slate-900">West</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 mb-1.5 block uppercase tracking-wider">Rank</label>
                <input 
                  type="number" 
                  min="1" 
                  max="30"
                  className="w-full glass-input rounded-xl px-4 py-3" 
                  required 
                  value={formData.rank} 
                  onChange={e => setFormData({...formData, rank: Number(e.target.value)})} 
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 mb-1.5 block uppercase tracking-wider">Wins</label>
                <input 
                  type="number" 
                  min="0" 
                  className="w-full glass-input rounded-xl px-4 py-3" 
                  required 
                  value={formData.wins} 
                  onChange={e => setFormData({...formData, wins: Number(e.target.value)})} 
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 mb-1.5 block uppercase tracking-wider">Losses</label>
                <input 
                  type="number" 
                  min="0" 
                  className="w-full glass-input rounded-xl px-4 py-3" 
                  required 
                  value={formData.losses} 
                  onChange={e => setFormData({...formData, losses: Number(e.target.value)})} 
                />
              </div>

              <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-500 shadow-lg shadow-blue-600/20 transition-all active:scale-95"
                >
                  {isEditing ? 'Update Standing' : 'Create Standing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Standings;