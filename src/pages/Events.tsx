import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import events from '../data/events.json';

const filterTabs = ['Upcoming', 'Today', 'This Week', 'By Department'] as const;
const departments = ['CSE', 'AIML', 'ECE', 'MECH', 'CIVIL', 'ISE'] as const;

const typeColors: Record<string, string> = {
  fest: 'border-l-blue-500 bg-blue-50',
  hackathon: 'border-l-emerald-500 bg-emerald-50',
  fresher: 'border-l-yellow-500 bg-yellow-50',
  cultural: 'border-l-pink-500 bg-pink-50',
};

const typeBadges: Record<string, string> = {
  fest: 'bg-blue-100 text-blue-700',
  hackathon: 'bg-emerald-100 text-emerald-700',
  fresher: 'bg-yellow-100 text-yellow-700',
  cultural: 'bg-pink-100 text-pink-700',
};

function parseEventDate(dateString: string) {
  const parsed = new Date(dateString);
  parsed.setHours(0, 0, 0, 0);
  return parsed;
}

function isToday(eventDate: Date) {
  const now = new Date();
  const normalizedToday = new Date(now);
  normalizedToday.setHours(0, 0, 0, 0);
  return eventDate.getTime() === normalizedToday.getTime();
}

function isThisWeek(eventDate: Date) {
  const now = new Date();
  const currentDay = now.getDay();
  const weekStart = new Date(now);
  weekStart.setDate(weekStart.getDate() - currentDay);
  weekStart.setHours(0, 0, 0, 0);
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  
  return eventDate >= weekStart && eventDate <= weekEnd;
}

export default function Events() {
  const [activeTab, setActiveTab] = useState<typeof filterTabs[number]>('Upcoming');
  const [activeDept, setActiveDept] = useState<typeof departments[number]>('CSE');
  const [expandedId, setExpandedId] = useState(events[0]?.id ?? '');
  const navigate = useNavigate();

  const filteredEvents = useMemo(() => {
    const sorted = [...events].sort(
      (a, b) => parseEventDate(a.date).getTime() - parseEventDate(b.date).getTime()
    );

    if (activeTab === 'Upcoming') {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      return sorted.filter((event) => parseEventDate(event.date) >= now);
    }
    if (activeTab === 'Today') {
      return sorted.filter((event) => isToday(parseEventDate(event.date)));
    }
    if (activeTab === 'This Week') {
      return sorted.filter((event) => isThisWeek(parseEventDate(event.date)));
    }
    if (activeTab === 'By Department') {
      return sorted.filter((event) => event.department === activeDept);
    }
    return sorted;
  }, [activeTab, activeDept]);

  const selectedEvent = useMemo(
    () => filteredEvents.find((event) => event.id === expandedId) ?? filteredEvents[0] ?? events[0],
    [expandedId, filteredEvents]
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="rounded-3xl bg-white p-4 shadow-soft sm:p-8">
        <h1 className="text-xl font-semibold text-primary sm:text-2xl">Events</h1>
        <p className="mt-2 text-sm text-slate-600 sm:mt-3">Discover and attend upcoming campus activities, workshops, and cultural events.</p>
      </div>

      <div className="rounded-3xl bg-white p-4 shadow-soft sm:p-6">
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition sm:px-5 sm:py-2 sm:text-sm ${
                activeTab === tab
                  ? 'bg-primary text-white shadow-soft'
                  : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'By Department' && (
          <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-200 pt-3 sm:mt-5 sm:gap-3 sm:pt-5">
            {departments.map((dept) => (
              <button
                key={dept}
                type="button"
                onClick={() => setActiveDept(dept)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition sm:px-4 sm:py-2 sm:text-sm ${
                  activeDept === dept
                    ? 'bg-slate-900 text-white'
                    : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-3 sm:space-y-4">
          {filteredEvents.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 sm:p-6">
              No events match your filter.
            </div>
          ) : (
            filteredEvents.map((event) => (
              <button
                key={event.id}
                type="button"
                onClick={() => setExpandedId(event.id)}
                className={`w-full rounded-3xl border-l-4 p-4 text-left transition sm:p-6 ${
                  expandedId === event.id
                    ? `${typeColors[event.type]} border border-l-4 shadow-soft`
                    : `${typeColors[event.type]} border border-slate-200 hover:shadow-soft`
                }`}
              >
                <div className="flex items-start justify-between gap-2 sm:gap-4">
                  <div className="flex-1">
                    <h2 className="text-base font-semibold text-slate-900 sm:text-xl">{event.title}</h2>
                    <p className="mt-1 text-xs text-slate-600 sm:mt-2 sm:text-sm">{event.date}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-600 sm:mt-1 sm:gap-2 sm:text-sm">
                      <MapPin size={14} className="flex-shrink-0 sm:size-4" />
                      {event.venue}
                    </p>
                  </div>
                  <span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize sm:px-3 sm:py-1 sm:text-xs ${typeBadges[event.type]}`}>
                    {event.type}
                  </span>
                </div>
                <p className="mt-2 text-xs font-semibold text-slate-700 sm:mt-4 sm:text-sm">{event.department}</p>
              </button>
            ))
          )}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-soft sm:p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500 sm:text-sm">Event details</p>
          <div className="mt-3 space-y-3 sm:mt-5 sm:space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 sm:text-2xl">{selectedEvent?.title}</h2>
              <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-semibold capitalize sm:mt-3 sm:px-3 sm:py-1 sm:text-sm ${typeBadges[selectedEvent?.type ?? '']}`}>
                {selectedEvent?.type}
              </span>
            </div>

            <div className="grid gap-2 rounded-3xl bg-white p-3 text-xs text-slate-600 shadow-sm sm:gap-3 sm:p-4 sm:text-sm">
              <div>
                <p className="font-semibold text-slate-900">Date</p>
                <p>{selectedEvent?.date}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Time</p>
                <p>{selectedEvent?.time}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Venue</p>
                <p>{selectedEvent?.venue}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Department</p>
                <p>{selectedEvent?.department}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Block</p>
                <p>{selectedEvent?.block}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate(`/map?selected=${selectedEvent?.block}`)}
              className="w-full rounded-3xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-900 sm:text-base"
            >
              Find Venue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
