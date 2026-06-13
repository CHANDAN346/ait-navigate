import { Link, useNavigate } from 'react-router-dom';
import { Compass, Home, MapPin, UserCircle2, CalendarDays, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/map', label: 'Map', icon: MapPin },
  { path: '/room-finder', label: 'Rooms', icon: Compass },
  { path: '/faculty-finder', label: 'Faculty', icon: UserCircle2 },
  { path: '/events', label: 'Events', icon: CalendarDays },
];

export default function Navbar() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    setUsername(localStorage.getItem('ait-username'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('ait-username');
    navigate('/login');
  };

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-lg font-semibold text-primary">
          AIT Navigate
        </Link>
        <nav className="flex flex-wrap items-center gap-2 sm:gap-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-accent hover:bg-accent/10 hover:text-primary sm:px-4 sm:text-sm"
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        {username && (
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-2xl bg-red-100 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-200 sm:px-4 sm:text-sm"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        )}
      </div>
    </header>
  );
}
