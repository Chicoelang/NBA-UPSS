import React, { useEffect, useState } from 'react';
import { getBoxScores, getPlayers, createBoxScore, updateBoxScore, deleteBoxScore } from '../api';
import type { BoxScore, Player } from '../types';
import { FaChartBar, FaEdit, FaTrash, FaPlus, FaTimes, FaBasketballBall } from 'react-icons/fa';

const BoxScores: React.FC = () => {
  const [scores, setScores] = useState<BoxScore[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    player_id: '',
    points: 0,
    rebounds: 0,
    assists: 0,
    game_date: new Date().toISOString().split('T')[0],
    opponent: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [bData, pData] = await Promise.all([getBoxScores(), getPlayers()]);
      // Sort by date descending
      const sorted = bData.sort((a, b) => new Date(b.game_date).getTime() - new Date(a.game_date).getTime());
      setScores(sorted);
      setPlayers(pData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (score: BoxScore) => {
    setFormData({
      player_id: score.player_id,
      points: score.points,
      rebounds: score.rebounds,
      assists: score.assists,
      game_date: score.game_date,
      opponent: score.opponent
    });
    setEditId(score.id);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this game stat?')) {
      try {
        await deleteBoxScore(id);
        fetchData();
      } catch (error) {
        console.error("Error deleting stat:", error);
        alert("Failed to delete stat");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      player_id: '',
      points: 0,
      rebounds: 0,
      assists: 0,
      game_date: new Date().toISOString().split('T')[0],
      opponent: ''
    });
    setIsEditing(false);
    setEditId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && editId) {
        await updateBoxScore(editId, formData);
      } else {
        await createBoxScore(formData);
      }
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Error saving stat:", error);
      alert("Failed to save stat");
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto animate-fade-in">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-500/10 rounded-xl">
              <FaChartBar className="text-orange-500 text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Game Statistics</h1>
              <p className="text-slate-400 text-sm">Track player performances and box scores</p>
            </div>
          </div>
          <button 
            onClick={() => { resetForm(); setShowForm(true); }}
            className="w-full md:w-auto justify-center flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all btn-primary"
          >
            <FaPlus /> Add Stats
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full p-12 text-center text-slate-500">Loading statistics...</div>
          ) : scores.length === 0 ? (
            <div className="col-span-full p-12 text-center text-slate-500">No game statistics found. Add one to get started.</div>
          ) : (
            scores.map((score) => (
              <div key={score.id} className="group relative bg-gradient-to-b from-slate-800/40 to-slate-900/40 border border-white/10 rounded-3xl p-6 hover:border-blue-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-blue-500/10 pointer-events-none" />

                {/* Header */}
                <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-white/5 flex items-center justify-center text-2xl text-slate-400 group-hover:text-white group-hover:border-blue-500/30 transition-all shadow-inner">
                        <FaBasketballBall />
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-lg font-bold text-white leading-tight group-hover:text-blue-400 transition-colors truncate">
                            {score.players?.name || 'Unknown Player'}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                            <span className="font-bold text-slate-400">{score.players?.teams?.name}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-600" />
                            <span>{score.players?.position}</span>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 mb-6 relative z-10">
                    <div className="bg-slate-950/50 rounded-2xl p-3 text-center border border-white/5 group-hover:border-white/10 transition-colors">
                        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">PTS</div>
                        <div className="text-2xl font-black text-white">{score.points}</div>
                    </div>
                    <div className="bg-slate-950/50 rounded-2xl p-3 text-center border border-white/5 group-hover:border-white/10 transition-colors">
                        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">REB</div>
                        <div className="text-2xl font-black text-blue-400">{score.rebounds}</div>
                    </div>
                    <div className="bg-slate-950/50 rounded-2xl p-3 text-center border border-white/5 group-hover:border-white/10 transition-colors">
                        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">AST</div>
                        <div className="text-2xl font-black text-orange-400">{score.assists}</div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs font-medium text-slate-500 border-t border-white/5 pt-4 relative z-10">
                    <div className="flex items-center gap-2">
                        <span className="text-slate-600">VS</span>
                        <span className="text-slate-300 font-bold">{score.opponent}</span>
                    </div>
                    <div>{new Date(score.game_date).toLocaleDateString()}</div>
                </div>

                {/* Actions Overlay (Always visible on mobile, hover on desktop) */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 z-20">
                    <button onClick={() => handleEdit(score)} className="w-8 h-8 rounded-lg bg-slate-800/80 text-blue-400 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-all backdrop-blur-sm border border-white/5">
                        <FaEdit size={12} />
                    </button>
                    <button onClick={() => handleDelete(score.id)} className="w-8 h-8 rounded-lg bg-slate-800/80 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all backdrop-blur-sm border border-white/5">
                        <FaTrash size={12} />
                    </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="glass-panel w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/5 flex justify-between items-center sticky top-0 bg-slate-900/90 backdrop-blur-xl z-10">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                {isEditing ? <FaEdit className="text-blue-400" /> : <FaPlus className="text-green-400" />}
                {isEditing ? 'Edit Game Stats' : 'Add New Game Stats'}
              </h2>
              <button onClick={resetForm} className="text-slate-400 hover:text-white transition-colors">
                <FaTimes size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-500 mb-1 block uppercase">Player</label>
                  <select 
                    className="w-full glass-input rounded-lg px-3 py-2.5" 
                    required 
                    value={formData.player_id} 
                    onChange={e => setFormData({...formData, player_id: e.target.value})}
                  >
                    <option value="" className="bg-slate-900">Select Player</option>
                    {players.map(p => (
                      <option key={p.id} value={p.id} className="bg-slate-900">
                        {p.name} ({p.teams?.name || 'FA'})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-500 mb-1 block uppercase">Opponent</label>
                  <input 
                    type="text" 
                    className="w-full glass-input rounded-lg px-3 py-2.5" 
                    required 
                    placeholder="e.g. Miami Heat"
                    value={formData.opponent} 
                    onChange={e => setFormData({...formData, opponent: e.target.value})} 
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-500 mb-1 block uppercase">Game Date</label>
                  <input 
                    type="date" 
                    className="w-full glass-input rounded-lg px-3 py-2.5" 
                    required 
                    value={formData.game_date} 
                    onChange={e => setFormData({...formData, game_date: e.target.value})} 
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block uppercase">Points</label>
                  <input 
                    type="number" 
                    min="0" 
                    className="w-full glass-input rounded-lg px-3 py-2.5" 
                    required 
                    value={formData.points} 
                    onChange={e => setFormData({...formData, points: Number(e.target.value)})} 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block uppercase">Rebounds</label>
                  <input 
                    type="number" 
                    min="0" 
                    className="w-full glass-input rounded-lg px-3 py-2.5" 
                    required 
                    value={formData.rebounds} 
                    onChange={e => setFormData({...formData, rebounds: Number(e.target.value)})} 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block uppercase">Assists</label>
                  <input 
                    type="number" 
                    min="0" 
                    className="w-full glass-input rounded-lg px-3 py-2.5" 
                    required 
                    value={formData.assists} 
                    onChange={e => setFormData({...formData, assists: Number(e.target.value)})} 
                  />
                </div>

                <div className="md:col-span-2 flex flex-col-reverse md:flex-row justify-end gap-3 mt-4 pt-4 border-t border-white/5">
                  <button 
                    type="button" 
                    onClick={resetForm}
                    className="w-full md:w-auto px-4 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-center"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="w-full md:w-auto btn-primary px-6 py-2.5 rounded-lg font-medium text-center"
                  >
                    {isEditing ? 'Update Stats' : 'Save Stats'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BoxScores;