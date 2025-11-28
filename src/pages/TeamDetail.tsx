import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import type { Team, Player } from '../types';
import { FaArrowLeft, FaUserAlt, FaMapMarkerAlt, FaGlobeAmericas } from 'react-icons/fa';

const TeamDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [team, setTeam] = useState<Team | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;
        
        // Fetch Team Detail
        const teamRes = await api.get<Team>(`/teams/${id}`);
        setTeam(teamRes.data);

        // Fetch All Players (and filter client-side)
        // Ideally the API would support /teams/:id/players or /players?team_id=:id
        const playersRes = await api.get<Player[]>('/players');
        const teamPlayers = playersRes.data.filter(p => p.team_id === id);
        setPlayers(teamPlayers);

      } catch (err) {
        console.error(err);
        alert('Failed to load team details.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-4">Team Not Found</h2>
        <Link to="/" className="text-blue-400 hover:underline">Back to Teams</Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto pt-24">
      <Link to="/" className="inline-flex items-center text-slate-400 hover:text-white mb-6 transition-colors">
        <FaArrowLeft className="mr-2" /> Back to Teams
      </Link>

      {/* Team Header */}
      <div className="glass-panel rounded-2xl p-8 mb-8 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">{team.name}</h1>
            <div className="flex flex-wrap gap-4 text-slate-400 text-lg">
              <div className="flex items-center">
                <FaMapMarkerAlt className="mr-2 text-blue-500" />
                {team.city}
              </div>
              <div className="flex items-center">
                <FaGlobeAmericas className="mr-2 text-green-500" />
                {team.conference} Conference
              </div>
            </div>
          </div>
          <div className="glass-card px-8 py-4 rounded-xl text-center">
            <span className="block text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">Roster Size</span>
            <span className="block text-4xl font-black text-white">{players.length}</span>
          </div>
        </div>
      </div>

      {/* Players Roster */}
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <FaUserAlt className="mr-3 text-blue-500" /> Team Roster
      </h2>

      {players.length === 0 ? (
        <div className="text-slate-500 italic glass-panel p-8 rounded-xl text-center">
          No players found for this team.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {players.map((player) => (
            <div key={player.id} className="group relative bg-gradient-to-b from-slate-800/40 to-slate-900/40 border border-white/10 rounded-3xl p-6 hover:border-blue-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 overflow-hidden">
              {/* Jersey Number Background */}
              <div className="absolute -right-6 -bottom-10 text-[140px] font-black text-white/5 group-hover:text-white/10 transition-colors select-none leading-none z-0 pointer-events-none">
                  {player.jersey_number}
              </div>
              
              {/* Content */}
              <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-white/5 flex items-center justify-center text-xl text-slate-400 group-hover:text-white group-hover:border-blue-500/30 transition-all shadow-inner">
                          <FaUserAlt />
                      </div>
                      <div className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest">
                          {player.position}
                      </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                      {player.name}
                  </h3>
                  <p className="text-slate-500 text-sm font-medium">
                      Jersey #{player.jersey_number}
                  </p>
              </div>
              
              {/* Hover Line */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamDetail;