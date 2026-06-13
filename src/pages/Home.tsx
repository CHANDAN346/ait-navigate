import { useMemo, useState, type ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Building2, MapPin, Users, CalendarDays } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import events from '../data/events.json';

function parseEventDate(dateString: string) {
  const parsed = new Date(dateString);
  parsed.setHours(0, 0, 0, 0);
  return parsed;
}

export default function Home() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const todayEvent = useMemo(() => {
    const now = new Date();
    const normalizedToday = new Date(now);
    normalizedToday.setHours(0, 0, 0, 0);

    const sortedEvents = [...events].sort((a, b) => parseEventDate(a.date).getTime() - parseEventDate(b.date).getTime());
    const todayMatch = sortedEvents.find((event) => parseEventDate(event.date).getTime() === normalizedToday.getTime());
    if (todayMatch) {
      return todayMatch;
    }
    return sortedEvents.find((event) => parseEventDate(event.date).getTime() > normalizedToday.getTime()) ?? sortedEvents[0];
  }, []);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    navigate(`/room-finder?search=${encodeURIComponent(value)}`);
  };

  const quickItems = [
    { label: 'Campus Map', subtitle: 'View building routes', icon: MapPin, to: '/map' },
    { label: 'Room Finder', subtitle: 'Locate classrooms', icon: Building2, to: '/room-finder' },
    { label: 'Faculty', subtitle: 'Find instructors', icon: Users, to: '/faculty-finder' },
    { label: 'Events', subtitle: 'See campus events', icon: CalendarDays, to: '/events' },
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-6 shadow-soft sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white sm:h-14 sm:w-14 sm:text-lg">
            AIT
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500 sm:text-sm">AIT Navigate</p>
            <h1 className="text-lg font-semibold text-slate-900 sm:text-2xl">Welcome back</h1>
          </div>
        </div>
        <button className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 sm:px-4 sm:py-3">
          <Bell size={18} />
          <span className="hidden sm:inline">Alerts</span>
        </button>
      </header>

      <section className="rounded-[2rem] bg-primary px-4 py-8 text-white sm:px-10 sm:py-12">
        <div className="max-w-3xl space-y-3 sm:space-y-5">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-200/80 sm:text-sm">Welcome to AIT</p>
          <h2 className="text-2xl font-semibold leading-tight sm:text-4xl">Explore your 120-acre Bangalore campus with ease.</h2>
          <p className="text-sm text-slate-200 sm:text-base">Navigate classrooms, faculty, and events from one smart campus dashboard.</p>
          <div className="inline-flex rounded-3xl border border-white/20 bg-white/10 px-4 py-2 text-xs text-slate-100 shadow-soft sm:px-5 sm:py-3 sm:text-sm">
            <span className="font-semibold text-white">120-acre campus</span>
            <span className="mx-2 sm:mx-3">·</span>
            Bangalore
          </div>
        </div>
      </section>

      <div className="rounded-3xl bg-white p-4 shadow-soft sm:p-6">
        <SearchBar placeholder="Search rooms, faculty, or events" value={query} onChange={handleSearchChange} />
      </div>

      <section className="grid gap-3 sm:gap-4 md:grid-cols-2">
        {quickItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              to={item.to}
              className="rounded-3xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-soft sm:p-6"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-primary sm:h-14 sm:w-14">
                <Icon size={20} />
              </div>
              <h3 className="mt-3 text-base font-semibold text-slate-900 sm:mt-5 sm:text-xl">{item.label}</h3>
              <p className="mt-1 text-sm text-slate-600 sm:mt-2">{item.subtitle}</p>
            </Link>
          );
        })}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-soft sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500 sm:text-sm">Today at AIT</p>
            <h3 className="mt-2 text-lg font-semibold text-slate-900 sm:text-2xl">Campus highlights</h3>
          </div>
          <span className="rounded-2xl bg-slate-100 px-3 py-1 text-xs text-slate-700 sm:px-4 sm:py-2 sm:text-sm">{todayEvent ? todayEvent.type.toUpperCase() : 'No event'}</span>
        </div>

        {todayEvent ? (
          <div className="mt-4 grid gap-3 sm:mt-6 sm:gap-4 md:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-4 sm:p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500 sm:text-sm">{todayEvent.department} · {todayEvent.block}</p>
              <h4 className="mt-2 text-base font-semibold text-slate-900 sm:mt-3 sm:text-xl">{todayEvent.title}</h4>
              <p className="mt-2 text-sm text-slate-600 sm:mt-3">{todayEvent.venue}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4 sm:p-6">
              <p className="text-xs text-slate-500">Date</p>
              <p className="mt-1 text-base font-semibold text-slate-900 sm:mt-2 sm:text-lg">{todayEvent.date}</p>
              <p className="mt-3 text-xs text-slate-500 sm:mt-4">Time</p>
              <p className="mt-1 text-base font-semibold text-slate-900 sm:mt-2 sm:text-lg">{todayEvent.time}</p>
            </div>
          </div>
        ) : (
          <div className="mt-4 rounded-3xl bg-slate-50 p-4 text-sm text-slate-600 sm:mt-6 sm:p-6">No events scheduled for today. Check back soon for the next campus activity.</div>
        )}
      </section>
    </div>
  );
}
