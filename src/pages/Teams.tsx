import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import type { Team } from '../types';
import { FaPlus, FaTrash, FaEdit, FaMapMarkerAlt, FaTimes, FaUsers } from 'react-icons/fa';

const Teams: React.FC = () => {
  // --- STATE MANAGEMENT ---
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    conference: 'East' // Default dropdown value
  });

  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- 1. GET ALL TEAMS ---
  const fetchTeams = async () => {
    try {
      const res = await api.get<Team[]>('/teams');
      setTeams(res.data);
    } catch (err) {
      console.error(err);
      alert('Gagal mengambil data teams. Cek koneksi internet atau backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  // --- 2. PREPARE EDIT (GET BY ID) ---
  const handleEditClick = async (id: string) => {
    try {
      setLoading(true);
      // Fetch single data untuk memastikan data terbaru sebelum diedit
      const res = await api.get<Team>(`/teams/${id}`);
      const teamData = res.data;

      // Populate form
      setFormData({
        name: teamData.name,
        city: teamData.city,
        conference: teamData.conference || 'East'
      });
      
      setEditId(id);
      setIsEditing(true);
      setIsModalOpen(true);
    } catch (err) {
      alert('Gagal mengambil detail team ID: ' + id);
    } finally {
      setLoading(false);
    }
  };

  // --- 3. SUBMIT (POST / PUT) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isEditing && editId) {
        // --- PUT REQUEST (UPDATE) ---
        await api.put(`/teams/${editId}`, formData);
        alert(`Team ${formData.name} berhasil diupdate!`);
      } else {
        // --- POST REQUEST (CREATE) ---
        await api.post('/teams', formData);
        alert(`Team ${formData.name} berhasil dibuat!`);
      }

      // Reset & Refresh
      resetForm();
      fetchTeams();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menyimpan data.');
    } finally {
      setSubmitting(false);
    }
  };

  // --- 4. DELETE REQUEST ---
  const handleDelete = async (id: string) => {
    if (confirm('Yakin ingin menghapus franchise ini secara permanen?')) {
      try {
        await api.delete(`/teams/${id}`);
        fetchTeams(); // Refresh UI
      } catch (err) {
        alert('Gagal menghapus team.');
      }
    }
  };

  // Helper: Reset Form
  const resetForm = () => {
    setFormData({ name: '', city: '', conference: 'East' });
    setIsEditing(false);
    setEditId(null);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto animate-fade-in pb-20">
        {/* Header */}
        <div className="mb-8 border-b border-slate-800 pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              League <span className="text-orange-500">Franchises</span>
            </h1>
            <p className="text-slate-400 mt-2 text-sm">
              Manage NBA Teams Database. Create, update, or remove teams from the league.
            </p>
          </div>
          <button 
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="w-full md:w-auto btn-primary font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2"
          >
            <FaPlus /> Create Team
          </button>
        </div>

        {/* --- DATA GRID --- */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <div className="w-10 h-10 border-4 border-slate-800 border-t-orange-500 rounded-full animate-spin mb-4"></div>
            <p className="text-xs uppercase tracking-widest animate-pulse">Fetching Data from API...</p>
          </div>
        ) : teams.length === 0 ? (
          <div className="text-center py-20 glass-panel rounded-2xl border-dashed">
            <p className="text-slate-500">No teams found. Start by creating one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {teams.map(t => (
              <div 
                key={t.id} 
                className={`group relative bg-gradient-to-b from-slate-800/40 to-slate-900/40 border border-white/10 rounded-3xl p-6 pb-20 md:pb-6 hover:border-orange-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/10 overflow-hidden ${
                  editId === t.id ? 'ring-2 ring-blue-500 border-transparent' : ''
                }`}
              >
                 {/* Hover Gradient Background */}
                 <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                 
                 {/* Content */}
                 <div className="relative z-10 flex items-center gap-6">
                    {/* Avatar */}
                    <div className={`w-20 h-20 rounded-2xl border border-white/5 flex items-center justify-center text-3xl font-black shadow-inner group-hover:scale-110 transition-transform duration-500 group-hover:border-orange-500/30 ${
                      editId === t.id 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gradient-to-br from-slate-800 to-slate-950 text-white'
                    }`}>
                       {t.name.charAt(0)}
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                       <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-bold tracking-widest uppercase text-orange-400 bg-orange-400/10 px-2 py-1 rounded-lg border border-orange-400/20">
                             {t.city}
                          </span>
                       </div>
                       <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-orange-400 transition-colors truncate">
                          {t.name}
                       </h3>
                       <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                          <span className={`w-1.5 h-1.5 rounded-full ${t.conference === 'West' ? 'bg-red-500' : 'bg-blue-500'}`} />
                          {t.conference} Conference
                       </div>
                    </div>
                 </div>

                 {/* Actions (Always visible on mobile, Slide up on hover desktop) */}
                 <div className="absolute bottom-0 left-0 w-full p-4 bg-slate-950/80 backdrop-blur-md border-t border-white/5 translate-y-0 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-300 flex justify-around z-20">
                   <Link 
                     to={`/teams/${t.id}`}
                     className="flex-1 flex items-center justify-center gap-2 text-xs font-bold text-slate-300 hover:text-white py-2 rounded-lg hover:bg-white/5 transition-colors"
                   >
                      <FaUsers /> Roster
                   </Link>
                   <div className="w-px bg-white/10 mx-2" />
                   <button 
                     onClick={() => handleEditClick(t.id)} 
                     className="flex-1 flex items-center justify-center gap-2 text-xs font-bold text-blue-400 hover:text-blue-300 py-2 rounded-lg hover:bg-blue-500/10 transition-colors"
                   >
                      <FaEdit /> Edit
                   </button>
                   <div className="w-px bg-white/10 mx-2" />
                   <button 
                     onClick={() => handleDelete(t.id)} 
                     className="flex-1 flex items-center justify-center gap-2 text-xs font-bold text-red-400 hover:text-red-300 py-2 rounded-lg hover:bg-red-500/10 transition-colors"
                   >
                      <FaTrash /> Delete
                   </button>
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- MODAL FORM (Create / Edit) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className={`w-full max-w-md p-6 rounded-2xl border shadow-2xl relative glass-panel ${isEditing ? 'border-blue-500/50' : ''}`}>
            
            {/* Close Button */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
            >
              <FaTimes size={20} />
            </button>

            {/* Label Mode */}
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-lg font-bold uppercase tracking-widest flex items-center gap-2 ${isEditing ? 'text-blue-400' : 'text-orange-500'}`}>
                {isEditing ? (
                  <><FaEdit /> Edit Team</>
                ) : (
                  <><FaPlus /> Create New Team</>
                )}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Input City */}
              <div className="w-full">
                <label className="text-[10px] text-slate-500 font-bold mb-1.5 block uppercase tracking-wider">City Location</label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-3.5 text-slate-600" />
                  <input 
                    type="text" 
                    placeholder="e.g. San Francisco" 
                    className="w-full glass-input rounded-xl pl-9 pr-4 py-3" 
                    required
                    value={formData.city} 
                    onChange={e => setFormData({...formData, city: e.target.value})} 
                  />
                </div>
              </div>

              {/* Input Name */}
              <div className="w-full">
                <label className="text-[10px] text-slate-500 font-bold mb-1.5 block uppercase tracking-wider">Team Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Warriors" 
                  className="w-full glass-input rounded-xl px-4 py-3" 
                  required
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                />
              </div>

              {/* Input Conference */}
              <div className="w-full">
                <label className="text-[10px] text-slate-500 font-bold mb-1.5 block uppercase tracking-wider">Conference</label>
                <div className="relative">
                  <select 
                    className="w-full glass-input rounded-xl px-4 py-3 appearance-none cursor-pointer" 
                    value={formData.conference} 
                    onChange={e => setFormData({...formData, conference: e.target.value})}
                  >
                    <option value="East" className="bg-slate-900">Eastern</option>
                    <option value="West" className="bg-slate-900">Western</option>
                  </select>
                  <div className="absolute right-4 top-4 pointer-events-none text-slate-500 text-xs">▼</div>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                disabled={submitting}
                className={`w-full font-bold px-8 py-3 rounded-xl shadow-lg transition transform active:scale-95 flex items-center justify-center gap-2 mt-2 ${
                  isEditing 
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20' 
                    : 'btn-primary'
                } ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {submitting ? 'Saving...' : (isEditing ? 'Update Team' : 'Create Team')}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Teams;