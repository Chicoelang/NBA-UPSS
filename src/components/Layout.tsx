import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { FaBasketballBall, FaListOl, FaChartBar, FaUser } from 'react-icons/fa';

const Layout: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Teams', icon: <FaBasketballBall /> },
    { path: '/standings', label: 'Standings', icon: <FaListOl /> },
    { path: '/box-scores', label: 'Stats', icon: <FaChartBar /> },
    { path: '/profile', label: 'Profile', icon: <FaUser /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      
      {/* --- TOP NAVBAR (Replaces Sidebar) --- */}
      <header className="fixed top-0 left-0 w-full bg-slate-950/70 backdrop-blur-xl border-b border-white/5 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo Area */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl flex items-center justify-center shadow-lg shadow-orange-900/50 border border-white/10">
              <FaBasketballBall className="text-white text-lg animate-spin-slow" />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-wide text-red-500 leading-none">NBA <span className="text-blue-500">APP</span></h1>
              <p className="text-[9px] text-slate-500 uppercase tracking-widest hidden sm:block">Official App</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.2)]' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className={`text-lg ${isActive ? 'text-blue-400' : 'text-slate-500'}`}>
                    {item.icon}
                  </span>
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* --- MAIN CONTENT WRAPPER --- */}
      <main className="pt-24 pb-24 md:pb-10 px-4 md:px-8 max-w-7xl mx-auto relative min-h-screen">
        {/* Decorative Background Glow */}
        <div className="fixed top-0 left-0 w-full h-96 bg-blue-900/10 blur-[120px] -z-10 rounded-full pointer-events-none" />
        
        <Outlet />
      </main>

      {/* --- MOBILE BOTTOM NAVIGATION (Hidden on Desktop) --- */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-slate-950/80 backdrop-blur-xl border-t border-white/5 z-50 flex justify-around items-center px-2 py-3 safe-area-bottom">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center gap-1 w-full"
            >
              <div className={`text-xl transition-all duration-300 ${isActive ? 'text-orange-500 -translate-y-1' : 'text-slate-500'}`}>
                {item.icon}
              </div>
              <span className={`text-[10px] font-medium ${isActive ? 'text-white' : 'text-slate-600'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;