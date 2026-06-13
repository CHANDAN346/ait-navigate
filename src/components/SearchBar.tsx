import type { ChangeEventHandler } from 'react';

type SearchBarProps = {
  placeholder?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
};

export default function SearchBar({ placeholder = 'Search', value = '', onChange }: SearchBarProps) {
  return (
    <div className="mt-6">
      <label className="relative block">
        <input
          type="search"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
      </label>
    </div>
  );
}
