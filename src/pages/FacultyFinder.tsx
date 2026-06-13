import { useMemo, useState, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import faculty from '../data/faculty.json';

const departments = ['All', 'CSE', 'AIML', 'ECE', 'MECH', 'CIVIL', 'ISE'] as const;
const deptColors: Record<string, string> = {
  CSE: 'bg-sky-100 text-sky-800',
  AIML: 'bg-fuchsia-100 text-fuchsia-800',
  ECE: 'bg-amber-100 text-amber-800',
  MECH: 'bg-orange-100 text-orange-800',
  CIVIL: 'bg-emerald-100 text-emerald-800',
  ISE: 'bg-cyan-100 text-cyan-800',
};

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export default function FacultyFinder() {
  const [query, setQuery] = useState('');
  const [activeDept, setActiveDept] = useState<typeof departments[number]>('All');
  const [expandedId, setExpandedId] = useState(faculty[0]?.id ?? '');
  const navigate = useNavigate();

  const filteredFaculty = useMemo(() => {
    const search = query.trim().toLowerCase();
    return faculty.filter((person) => {
      const matchesQuery =
        !search ||
        person.name.toLowerCase().includes(search) ||
        person.department.toLowerCase().includes(search);
      const matchesDept = activeDept === 'All' || person.department === activeDept;
      return matchesQuery && matchesDept;
    });
  }, [query, activeDept]);

  const selectedProfile = useMemo(
    () => faculty.find((person) => person.id === expandedId) ?? filteredFaculty[0] ?? faculty[0],
    [expandedId, filteredFaculty]
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="rounded-3xl bg-white p-4 shadow-soft sm:p-8">
        <h1 className="text-xl font-semibold text-primary sm:text-2xl">Faculty Finder</h1>
        <p className="mt-2 text-sm text-slate-600 sm:mt-3">Search faculty by name or department and locate their rooms quickly.</p>
      </div>

      <div className="rounded-3xl bg-white p-4 shadow-soft sm:p-6">
        <div className="grid gap-4 sm:gap-6 xl:grid-cols-[1.35fr_0.9fr]">
          <div className="space-y-4 sm:space-y-5">
            <SearchBar
              placeholder="Search faculty name or department"
              value={query}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)}
            />

            <div className="flex flex-wrap gap-2 sm:gap-3">
              {departments.map((dept) => (
                <button
                  key={dept}
                  type="button"
                  onClick={() => setActiveDept(dept)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition sm:px-4 sm:py-2 sm:text-sm ${
                    activeDept === dept
                      ? 'bg-primary text-white shadow-soft'
                      : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>

            <div className="grid gap-3 sm:gap-4">
              {filteredFaculty.length === 0 ? (
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 sm:p-6">
                  No faculty matched your search.
                </div>
              ) : (
                filteredFaculty.map((person) => (
                  <button
                    key={person.id}
                    type="button"
                    onClick={() => setExpandedId(person.id)}
                    className={`w-full rounded-3xl border px-3 py-4 text-left transition sm:px-5 sm:py-5 ${
                      expandedId === person.id
                        ? 'border-primary/30 bg-primary/5'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 sm:gap-4">
                      <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold sm:h-14 sm:w-14 sm:text-lg ${deptColors[person.department] ?? 'bg-slate-100 text-slate-800'}`}>
                        {initials(person.name)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900 sm:text-lg">{person.name}</p>
                        <p className="mt-0.5 text-xs text-slate-600 sm:mt-1 sm:text-sm">{person.designation}</p>
                      </div>
                      <span className="whitespace-nowrap rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700 sm:px-3 sm:py-1 sm:text-sm">
                        {person.department}
                      </span>
                    </div>
                    <div className="mt-2 grid gap-2 grid-cols-2 text-xs text-slate-600 sm:mt-4 sm:gap-3 sm:text-sm sm:grid-cols-2">
                      <div>
                        <p className="font-semibold text-slate-900">Room</p>
                        <p>{person.room}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">Block</p>
                        <p>{person.block}</p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500 sm:text-sm">Selected faculty</p>
            <div className="mt-3 space-y-3 sm:mt-5 sm:space-y-4">
              <div className="flex items-center gap-2 sm:gap-4">
                <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-lg font-semibold sm:h-16 sm:w-16 sm:text-2xl ${deptColors[selectedProfile.department] ?? 'bg-slate-200 text-slate-800'}`}>
                  {initials(selectedProfile.name)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 sm:text-base">{selectedProfile.name}</p>
                  <p className="text-xs text-slate-600 sm:text-sm">{selectedProfile.designation}</p>
                </div>
              </div>

              <div className="grid gap-2 rounded-3xl bg-white p-3 text-xs text-slate-600 shadow-sm sm:gap-3 sm:p-4 sm:text-sm">
                <div>
                  <p className="font-semibold text-slate-900">Department</p>
                  <p>{selectedProfile.department}</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Room</p>
                  <p>{selectedProfile.room}</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Block</p>
                  <p>{selectedProfile.block}</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Faculty ID</p>
                  <p>{selectedProfile.id}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate(`/map?selected=${selectedProfile.block}`)}
                className="w-full rounded-3xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-900 sm:text-base"
              >
                Find Room
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
