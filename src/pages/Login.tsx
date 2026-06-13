import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const usernameRegex = /^1AY(23|24|25)(CS|IS|EC|EE|ME|CV|AE|AI|CY|DS)(\d{3})$/i;

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ username: '', password: '' });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = { username: '', password: '' };

    if (!usernameRegex.test(username.trim())) {
      nextErrors.username = 'Username must be like 1AY24CS132.';
    }

    if (!password) {
      nextErrors.password = 'Password is required.';
    }

    setErrors(nextErrors);

    if (!nextErrors.username && !nextErrors.password) {
      localStorage.setItem('ait-username', username.trim());
      navigate('/home');
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col rounded-3xl overflow-hidden bg-white shadow-soft md:flex-row md:rounded-[2rem]">
      <div className="relative w-full bg-primary px-6 py-8 text-white md:w-[52%] md:px-12 md:py-14">
        <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-primary/90 md:block" />
        <div className="relative z-10 space-y-6">
          <div className="rounded-3xl border border-white/20 bg-white/5 p-6 shadow-soft">
            <h1 className="text-2xl font-semibold md:text-3xl">AIT Campus Login</h1>
            <p className="mt-3 text-sm text-slate-200/90 md:text-base">Access campus navigation, rooms, faculty details, and upcoming events.</p>
          </div>

          <div className="space-y-3 rounded-3xl bg-white/10 p-6">
            <p className="text-sm font-semibold text-white md:text-base">Campus Map Preview</p>
            <svg viewBox="0 0 360 220" className="h-40 w-full overflow-visible rounded-3xl border border-white/15 bg-slate-950/20 p-3 md:h-48">
              <rect x="16" y="28" width="92" height="68" rx="10" fill="#378ADD" />
              <rect x="126" y="18" width="72" height="110" rx="10" fill="#F59E0B" />
              <rect x="210" y="62" width="118" height="86" rx="10" fill="#FBBF24" />
              <rect x="38" y="118" width="60" height="46" rx="10" fill="#60A5FA" />
              <rect x="160" y="140" width="88" height="50" rx="10" fill="#F97316" />
              <rect x="286" y="22" width="46" height="46" rx="12" fill="#A5F3FC" />
              <circle cx="70" cy="196" r="18" fill="#C7D2FE" opacity="0.9" />
              <circle cx="210" cy="206" r="14" fill="#93C5FD" opacity="0.9" />
              <path d="M26 180 C 50 150, 100 160, 120 180" stroke="#BFDBFE" strokeWidth="6" fill="none" opacity="0.7" />
            </svg>
          </div>
        </div>
      </div>

      <div className="w-full bg-white p-6 md:w-[48%] md:p-12">
        <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">Login</h2>
        <p className="mt-2 text-sm text-slate-600 md:text-base">Enter your credentials to continue to the AIT Navigate dashboard.</p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
          <label className="block text-sm font-medium text-slate-700">
            Username
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="1AY24CS132"
              className={`mt-2 w-full rounded-3xl border px-4 py-3 text-slate-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20 ${errors.username ? 'border-red-500 bg-red-50' : 'border-slate-200 bg-slate-50'}`}
            />
            {errors.username ? <p className="mt-2 text-sm text-red-600">{errors.username}</p> : null}
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Password
            <div className="relative mt-2">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                className={`w-full rounded-3xl border px-4 py-3 text-slate-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20 ${errors.password ? 'border-red-500 bg-red-50' : 'border-slate-200 bg-slate-50'}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((state) => !state)}
                className="absolute inset-y-0 right-3 inline-flex items-center text-slate-500 transition hover:text-slate-900"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password ? <p className="mt-2 text-sm text-red-600">{errors.password}</p> : null}
          </label>

          <button
            type="submit"
            className="w-full rounded-3xl bg-primary px-5 py-3 text-base font-semibold text-white transition hover:bg-slate-900"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
