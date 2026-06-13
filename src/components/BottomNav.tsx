import { Link, useLocation } from 'react-router-dom';
import { Home, MapPin, Grid, Users, CalendarDays } from 'lucide-react';

const items = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/map', label: 'Map', icon: MapPin },
  { path: '/room-finder', label: 'Rooms', icon: Grid },
  { path: '/faculty-finder', label: 'Faculty', icon: Users },
  { path: '/events', label: 'Events', icon: CalendarDays },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-slate-200 bg-white/95 backdrop-blur-xl sm:hidden">
      <div className="mx-auto flex max-w-6xl justify-between px-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path || (item.path === '/' && location.pathname === '/home');
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-1 flex-col items-center gap-1 py-3 text-[11px] font-medium transition ${
                active ? 'text-primary' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
