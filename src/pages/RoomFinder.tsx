import { useMemo, useState, type ChangeEvent } from 'react';
import SearchBar from '../components/SearchBar';
import rooms from '../data/rooms.json';

const filterOptions = ['All', 'Classrooms', 'Labs', 'Seminar Halls', 'Staff Rooms'] as const;
const typeLabels: Record<string, string> = {
  classroom: 'Classroom',
  lab: 'Lab',
  seminar: 'Seminar Hall',
  staff: 'Staff Room',
};
const typeColors: Record<string, string> = {
  classroom: 'bg-blue-100 text-blue-700',
  lab: 'bg-emerald-100 text-emerald-700',
  seminar: 'bg-yellow-100 text-amber-700',
  staff: 'bg-orange-100 text-orange-700',
};

const roomCoordinates: Record<string, { x: number; y: number }> = {
  'CS-101': { x: 20, y: 18 },
  'CS-205': { x: 110, y: 18 },
  'ML-Lab-1': { x: 200, y: 18 },
  'ML-Lab-2': { x: 290, y: 18 },
  'ECE-Seminar-Hall': { x: 20, y: 90 },
  'ECE-102': { x: 110, y: 90 },
  'ECE-208': { x: 200, y: 90 },
  'MECH-Lab-A': { x: 290, y: 90 },
  'MECH-Lab-B': { x: 20, y: 160 },
  'MECH-201': { x: 110, y: 160 },
  'CIVIL-102': { x: 200, y: 160 },
  'CIVIL-Seminar-Hall': { x: 290, y: 160 },
  'ADMIN-Boardroom': { x: 20, y: 230 },
  'ADMIN-121': { x: 110, y: 230 },
  'CSE-Workshop': { x: 200, y: 230 },
  'AIML-301': { x: 290, y: 230 },
  'ISE-204': { x: 20, y: 300 },
  'ISE-Lab-1': { x: 110, y: 300 },
  'ECE-Staff-Office': { x: 200, y: 300 },
  'MECH-Seminar-102': { x: 290, y: 300 },
};

const filterMatches = (roomType: string, filter: typeof filterOptions[number]) => {
  if (filter === 'All') return true;
  if (filter === 'Classrooms') return roomType === 'classroom';
  if (filter === 'Labs') return roomType === 'lab';
  if (filter === 'Seminar Halls') return roomType === 'seminar';
  if (filter === 'Staff Rooms') return roomType === 'staff';
  return true;
};

export default function RoomFinder() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<typeof filterOptions[number]>('All');
  const [selectedRoomId, setSelectedRoomId] = useState(rooms[0]?.id ?? '');

  const filteredRooms = useMemo(() => {
    const query = search.trim().toLowerCase();
    return rooms.filter((room) => {
      const matchesSearch =
        !query ||
        room.name.toLowerCase().includes(query) ||
        room.block.toLowerCase().includes(query) ||
        room.id.toLowerCase().includes(query);
      return matchesSearch && filterMatches(room.type, activeFilter);
    });
  }, [search, activeFilter]);

  const selectedRoom = useMemo(
    () => rooms.find((room) => room.id === selectedRoomId) ?? filteredRooms[0] ?? rooms[0],
    [selectedRoomId, filteredRooms]
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="rounded-3xl bg-white p-4 shadow-soft sm:p-8">
        <h1 className="text-xl font-semibold text-primary sm:text-2xl">Room Finder</h1>
        <p className="mt-2 text-sm text-slate-600 sm:mt-3">Search and explore classrooms, labs, seminar halls, and staff rooms in real time.</p>
      </div>

      <div className="grid gap-6 sm:gap-8 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4 sm:space-y-6">
          <SearchBar
            placeholder="Search by room name, block, or id"
            value={search}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setSearch(event.target.value)}
          />

          <div className="flex flex-wrap gap-2 sm:gap-3">
            {filterOptions.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition sm:px-4 sm:py-2 sm:text-sm ${
                  activeFilter === filter
                    ? 'bg-primary text-white shadow-soft'
                    : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="grid gap-3 sm:gap-4">
            {filteredRooms.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 sm:p-6">
                No rooms match your search.
              </div>
            ) : (
              filteredRooms.map((room) => (
                <button
                  key={room.id}
                  type="button"
                  onClick={() => setSelectedRoomId(room.id)}
                  className={`flex w-full flex-col gap-3 rounded-3xl border px-4 py-4 text-left transition sm:gap-4 sm:px-5 sm:py-5 ${
                    selectedRoom?.id === room.id
                      ? 'border-primary/25 bg-primary/5 shadow-soft'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 sm:text-sm">{room.block}</p>
                      <h2 className="mt-1 text-base font-semibold text-slate-900 sm:mt-2 sm:text-xl">{room.name}</h2>
                    </div>
                    <span className={`whitespace-nowrap rounded-full px-2 py-1 text-xs font-semibold sm:px-3 sm:py-1 sm:text-sm ${typeColors[room.type]}`}>
                      {typeLabels[room.type] ?? room.type}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 sm:grid-cols-4 sm:gap-3 sm:text-sm">
                    <div>
                      <p className="font-semibold text-slate-900">Floor</p>
                      <p>{room.floor}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Capacity</p>
                      <p>{room.capacity}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="font-semibold text-slate-900">Room ID</p>
                      <p>{room.id}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-soft sm:p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500 sm:text-sm">Room details</p>
            <h2 className="mt-2 text-lg font-semibold text-slate-900 sm:mt-3 sm:text-2xl">{selectedRoom?.name}</h2>
            <div className="mt-3 grid gap-3 text-xs text-slate-600 sm:mt-5 sm:gap-4 sm:text-sm sm:grid-cols-2">
              <div>
                <p className="font-semibold text-slate-900">Type</p>
                <p>{typeLabels[selectedRoom?.type ?? ''] ?? selectedRoom?.type}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Block</p>
                <p>{selectedRoom?.block}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Floor</p>
                <p>{selectedRoom?.floor}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Capacity</p>
                <p>{selectedRoom?.capacity}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-soft sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500 sm:text-sm">Floor map</p>
                <p className="mt-1 text-xs text-slate-600 sm:mt-2 sm:text-sm">Approximate location on the selected floor.</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-sm font-semibold ${typeColors[selectedRoom?.type ?? '']}`}>
                {typeLabels[selectedRoom?.type ?? ''] ?? selectedRoom?.type}
              </span>
            </div>

            <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <svg viewBox="0 0 340 220" className="h-[260px] w-full">
                <rect x="10" y="10" width="320" height="200" rx="24" fill="#f8fafc" stroke="#e2e8f0" />
                {rooms
                  .filter((room) => room.floor === selectedRoom?.floor && room.block === selectedRoom?.block)
                  .map((room, index) => {
                    const coords = roomCoordinates[room.id] ?? { x: 30 + (index % 3) * 100, y: 30 + Math.floor(index / 3) * 70 };
                    const isActive = room.id === selectedRoom?.id;
                    return (
                      <g key={room.id}>
                        <rect
                          x={coords.x}
                          y={coords.y}
                          width={80}
                          height={50}
                          rx="14"
                          fill={isActive ? '#2563EB' : '#ffffff'}
                          stroke={isActive ? '#1D4ED8' : '#cbd5e1'}
                          strokeWidth={isActive ? 4 : 1}
                        />
                        <text
                          x={coords.x + 40}
                          y={coords.y + 28}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fontSize="11"
                          fontWeight="700"
                          fill={isActive ? '#ffffff' : '#0f172a'}
                        >
                          {room.name}
                        </text>
                      </g>
                    );
                  })}
                {(!selectedRoom || rooms.filter((room) => room.floor === selectedRoom.floor && room.block === selectedRoom.block).length === 0) && (
                  <text x="170" y="110" textAnchor="middle" dominantBaseline="middle" fill="#64748b" fontSize="14">
                    No mapped rooms for this floor.
                  </text>
                )}
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
