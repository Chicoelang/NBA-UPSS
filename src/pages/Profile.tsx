import React from 'react';
import { FaIdCard, FaHeart, FaInstagram, FaWhatsapp, FaBasketballBall } from 'react-icons/fa';

const Profile: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto animate-fade-in pt-10">
      {/* Profile Card */}
      <div className="glass-panel rounded-3xl overflow-hidden relative">
        {/* Header Background */}
        <div className="h-32 bg-gradient-to-r from-blue-900 via-slate-900 to-orange-900 relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
        </div>

        {/* Avatar & Name */}
        <div className="px-8 pb-8 relative">
            <div className="mt-8 text-center">
                <h1 className="text-3xl font-bold text-white">Chicochaesa Elang Z</h1>
                <p className="text-slate-400 font-medium mt-1">Mahasiswa</p>
            </div>

            {/* Info Grid */}
            <div className="mt-8 grid grid-cols-1 gap-4">
                {/* NIM */}
                <div className="glass-card p-4 rounded-xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 text-xl">
                        <FaIdCard />
                    </div>
                    <div>
                        <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">NIM</div>
                        <div className="text-lg font-bold text-white">21120123140134</div>
                    </div>
                </div>

                {/* Favorite Team */}
                <div className="glass-card p-4 rounded-xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400 text-xl">
                        <FaBasketballBall />
                    </div>
                    <div>
                        <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Favorite Team</div>
                        <div className="text-lg font-bold text-white">Golden State Warriors</div>
                    </div>
                </div>

                {/* Favorite Player */}
                <div className="glass-card p-4 rounded-xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 text-xl">
                        <FaHeart />
                    </div>
                    <div>
                        <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Favorite Player</div>
                        <div className="text-lg font-bold text-white">Stephen Curry</div>
                    </div>
                </div>
            </div>

            {/* Social Links */}
            <div className="mt-8 flex gap-4 justify-center">
                <a href="https://instagram.com/eaglemyboy" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:opacity-90 transition-opacity shadow-lg shadow-purple-900/20">
                    <FaInstagram className="text-xl" /> Instagram
                </a>
                <a href="https://wa.me/81213206303" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-500 transition-colors shadow-lg shadow-green-900/20">
                    <FaWhatsapp className="text-xl" /> WhatsApp
                </a>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
