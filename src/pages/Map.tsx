import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { useLocation } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import buildings from '../data/buildings.json';
import rooms from '../data/rooms.json';

const chips = ['All blocks', 'CSE', 'ECE', 'MECH', 'Labs'] as const;
const floorTabs = ['Ground', '1st', '2nd'] as const;
const typeColors: Record<string, string> = {
  classroom: '#60A5FA',
  lab: '#34D399',
  seminar: '#FBBF24',
  staff: '#F97316',
};

export default function Map() {
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [selectedChip, setSelectedChip] = useState<typeof chips[number]>('All blocks');
  const [selectedBuildingId, setSelectedBuildingId] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const selected = params.get('selected')?.toUpperCase();
    const matched = buildings.find((building) => building.id === selected || building.shortName === selected);
    return matched?.id ?? buildings[0]?.id ?? '';
  });
  const [selectedFloor, setSelectedFloor] = useState<typeof floorTabs[number]>('Ground');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const selectedParam = params.get('selected')?.toUpperCase();
    const matched = buildings.find((building) => building.id === selectedParam || building.shortName === selectedParam);
    if (matched) {
      setSelectedBuildingId(matched.id);
      setSelectedFloor('Ground');
    }
  }, [location.search]);

  const filteredBuildings = useMemo(() => {
    const query = search.trim().toLowerCase();

    return buildings.filter((building) => {
      const matchesSearch =
        !query ||
        building.name.toLowerCase().includes(query) ||
        building.shortName.toLowerCase().includes(query) ||
        building.description.toLowerCase().includes(query);

      const matchesChip =
        selectedChip === 'All blocks'
          ? true
          : selectedChip === 'Labs'
          ? rooms.some((room) => room.type === 'lab' && room.block === building.shortName)
          : building.shortName === selectedChip;

      return matchesSearch && matchesChip;
    });
  }, [search, selectedChip]);

  const selectedBuilding = useMemo(
    () => buildings.find((building) => building.id === selectedBuildingId) ?? filteredBuildings[0] ?? null,
    [selectedBuildingId, filteredBuildings]
  );

  const buildingRoomCount = useMemo(() => {
    if (!selectedBuilding) return 0;
    return rooms.filter((room) => room.block === selectedBuilding.shortName).length;
  }, [selectedBuilding]);

  const floorRooms = useMemo(() => {
    if (!selectedBuilding) return [];
    return rooms.filter(
      (room) => room.floor === selectedFloor && room.block === selectedBuilding.shortName
    );
  }, [selectedBuilding, selectedFloor]);

  const handleBuildingClick = (buildingId: string) => {
    setSelectedBuildingId(buildingId);
    setSelectedFloor('Ground');
  };

  const roomLayout = floorRooms.map((room, index) => {
    const columns = 3;
    const x = 12 + (index % columns) * 84;
    const y = 12 + Math.floor(index / columns) * 66;
    return {
      ...room,
      x,
      y,
      width: 80,
      height: 50,
    };
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="rounded-3xl bg-white p-4 shadow-soft sm:p-8">
        <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-primary sm:text-2xl">Campus Map</h1>
            <p className="mt-1 text-sm text-slate-600 sm:mt-2">Browse buildings and drill into floor plans for every department.</p>
          </div>
          <div className="w-full max-w-lg flex-1">
            <SearchBar
              placeholder="Search buildings or blocks"
              value={search}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setSearch(event.target.value)}
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 sm:mt-6 sm:gap-3">
          {chips.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => setSelectedChip(chip)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition sm:px-4 sm:py-2 sm:text-sm ${
                chip === selectedChip
                  ? 'bg-primary text-white shadow-soft'
                  : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-3xl bg-white p-4 shadow-soft sm:p-6">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
          <svg viewBox="0 0 600 300" className="h-[280px] w-full sm:h-[320px]">
            <defs>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000" floodOpacity="0.08" />
              </filter>
            </defs>
            {buildings.map((building) => {
              const isFiltered = filteredBuildings.some((filtered) => filtered.id === building.id);
              const isSelected = building.id === selectedBuilding?.id;
              const buildingColor =
                building.shortName === 'CSE'
                  ? '#60A5FA'
                  : building.shortName === 'ECE'
                  ? '#F59E0B'
                  : building.shortName === 'MECH'
                  ? '#F97316'
                  : building.shortName === 'CIVIL'
                  ? '#FBBF24'
                  : building.shortName === 'ADMIN'
                  ? '#A3E635'
                  : building.shortName === 'ISE'
                  ? '#38BDF8'
                  : building.shortName === 'INNOV'
                  ? '#38A169'
                  : '#8B5CF6';
              return (
                <g key={building.id} opacity={isFiltered ? 1 : 0.25} cursor="pointer">
                  <rect
                    x={building.svgX}
                    y={building.svgY}
                    width={building.svgW}
                    height={building.svgH}
                    rx="14"
                    fill={buildingColor}
                    stroke={isSelected ? '#2563EB' : '#ffffff'}
                    strokeWidth={isSelected ? 6 : 0}
                    filter={isSelected ? 'url(#shadow)' : undefined}
                    onClick={() => handleBuildingClick(building.id)}
                  />
                  <text
                    x={building.svgX + building.svgW / 2}
                    y={building.svgY + building.svgH / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="18"
                    fontWeight="700"
                    fill="#ffffff"
                    style={{ pointerEvents: 'none' }}
                  >
                    {building.shortName}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-4 sm:mt-6 sm:p-6">
          {selectedBuilding ? (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col gap-3 sm:gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-500 sm:text-sm">Building</p>
                  <h2 className="mt-1 text-lg font-semibold text-slate-900 sm:mt-2 sm:text-2xl">{selectedBuilding.name}</h2>
                </div>
                <div className="grid gap-2 grid-cols-3 sm:gap-3">
                  <div className="rounded-3xl bg-slate-50 p-3 text-center sm:p-4">
                    <p className="text-xs text-slate-500 sm:text-sm">Floors</p>
                    <p className="mt-1 text-base font-semibold text-slate-900 sm:mt-2 sm:text-lg">{selectedBuilding.floors}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-3 text-center sm:p-4">
                    <p className="text-xs text-slate-500 sm:text-sm">Rooms</p>
                    <p className="mt-1 text-base font-semibold text-slate-900 sm:mt-2 sm:text-lg">{buildingRoomCount}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-3 text-center sm:p-4">
                    <p className="text-xs text-slate-500 sm:text-sm">Block</p>
                    <p className="mt-1 text-base font-semibold text-slate-900 sm:mt-2 sm:text-lg">{selectedBuilding.shortName}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {floorTabs.slice(0, selectedBuilding.floors).map((floor) => (
                    <button
                      key={floor}
                      type="button"
                      onClick={() => setSelectedFloor(floor)}
                      className={`rounded-full px-4 py-1.5 text-xs font-medium transition sm:px-5 sm:py-2 sm:text-sm ${
                        selectedFloor === floor
                          ? 'bg-primary text-white'
                          : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {floor}
                    </button>
                  ))}
                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
                  <div className="mb-3 flex items-center gap-2 sm:mb-4 sm:gap-3">
                    <div className="h-2.5 w-2.5 rounded-full bg-blue-500 sm:h-3 sm:w-3" />
                    <p className="text-xs font-medium text-slate-700 sm:text-sm">Floor plan</p>
                  </div>
                  <svg viewBox="0 0 280 180" className="h-[240px] w-full rounded-3xl bg-white sm:h-[260px]">
                    <rect x="8" y="8" width="264" height="164" rx="20" fill="#f8fafc" stroke="#e2e8f0" />
                    {roomLayout.length === 0 ? (
                      <text x="140" y="90" fill="#64748b" textAnchor="middle" dominantBaseline="middle" fontSize="16">
                        No room data for this floor.
                      </text>
                    ) : (
                      roomLayout.map((room) => (
                        <g key={room.id}>
                          <rect
                            x={room.x}
                            y={room.y}
                            width={room.width}
                            height={room.height}
                            rx="14"
                            fill={typeColors[room.type] ?? '#c7d2fe'}
                            stroke="#cbd5e1"
                          />
                          <text
                            x={room.x + room.width / 2}
                            y={room.y + room.height / 2 - 6}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fontSize="11"
                            fontWeight="700"
                            fill="#0f172a"
                          >
                            {room.name}
                          </text>
                          <text
                            x={room.x + room.width / 2}
                            y={room.y + room.height / 2 + 12}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fontSize="10"
                            fill="#334155"
                          >
                            {room.type}
                          </text>
                        </g>
                      ))
                    )}
                  </svg>
                  <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-600">
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#60A5FA]" /> Classroom
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#34D399]" /> Lab
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#FBBF24]" /> Seminar
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#F97316]" /> Staff
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl bg-slate-50 p-6 text-slate-600">Select a building on the map to view its floor plan and room details.</div>
          )}
        </div>
      </div>
    </div>
  );
}
