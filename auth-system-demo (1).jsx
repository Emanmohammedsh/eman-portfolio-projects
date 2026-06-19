import React, { useState, useMemo } from 'react';
import { Eye, EyeOff, Loader2, Check, Flame, Lock, Mail, ShieldCheck, LogOut, ArrowLeft, User } from 'lucide-react';

// ---------------------------------------------------------------------------
// Mock backend — simulates a real auth service (latency, validation, errors)
// so the demo behaves like a wired-up app. Swap for real Firebase calls using
// the integration files provided alongside this component.
// ---------------------------------------------------------------------------
const mockUsers = new Map();

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getPasswordStrength(password) {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return Math.min(score, 4);
}

const STRENGTH_LABELS = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'];
const STRENGTH_COLORS = ['bg-slate-700', 'bg-rose-500', 'bg-amber-500', 'bg-amber-400', 'bg-emerald-500'];

export default function AuthSystemDemo() {
  const [view, setView] = useState('signin'); // signin | signup | reset
  const [currentUser, setCurrentUser] = useState(null);

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(null); // 'email' | 'google' | 'apple' | null
  const [resetSent, setResetSent] = useState(false);

  const strength = useMemo(() => getPasswordStrength(form.password), [form.password]);

  function updateField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: null }));
  }

  function resetForm() {
    setForm({ name: '', email: '', password: '', confirm: '' });
    setErrors({});
    setShowPassword(false);
    setResetSent(false);
  }

  function switchView(next) {
    resetForm();
    setView(next);
  }

  async function handleSignIn(e) {
    e.preventDefault();
    const newErrors = {};
    if (!isValidEmail(form.email)) newErrors.email = 'Enter a valid email address.';
    if (!form.password) newErrors.password = 'Enter your password.';
    if (Object.keys(newErrors).length) return setErrors(newErrors);

    setLoading('email');
    await delay(700);
    const account = mockUsers.get(form.email.toLowerCase());
    if (!account || account.password !== form.password) {
      setErrors({ form: 'Invalid email or password.' });
      setLoading(null);
      return;
    }
    setCurrentUser({ name: account.name, email: form.email, provider: 'Email' });
    setLoading(null);
  }

  async function handleSignUp(e) {
    e.preventDefault();
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Enter your name.';
    if (!isValidEmail(form.email)) newErrors.email = 'Enter a valid email address.';
    if (strength < 2) newErrors.password = 'Use at least 8 characters, mixing letters and numbers.';
    if (form.confirm !== form.password) newErrors.confirm = 'Passwords don\u2019t match.';
    if (Object.keys(newErrors).length) return setErrors(newErrors);

    setLoading('email');
    await delay(900);
    const key = form.email.toLowerCase();
    if (mockUsers.has(key)) {
      setErrors({ form: 'An account with this email already exists.' });
      setLoading(null);
      return;
    }
    mockUsers.set(key, { name: form.name, password: form.password });
    setCurrentUser({ name: form.name, email: form.email, provider: 'Email' });
    setLoading(null);
  }

  async function handleOAuth(provider) {
    setLoading(provider);
    setErrors({});
    await delay(900);
    const fakeEmail = provider === 'google' ? 'you@gmail.com' : 'you@icloud.com';
    setCurrentUser({
      name: provider === 'google' ? 'Google User' : 'Apple User',
      email: fakeEmail,
      provider: provider === 'google' ? 'Google' : 'Apple',
    });
    setLoading(null);
  }

  async function handleReset(e) {
    e.preventDefault();
    if (!isValidEmail(form.email)) {
      setErrors({ email: 'Enter a valid email address.' });
      return;
    }
    setLoading('email');
    await delay(800);
    setLoading(null);
    setResetSent(true);
  }

  function handleSignOut() {
    setCurrentUser(null);
    switchView('signin');
  }

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md">

        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-4 justify-center">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
          <span className="font-mono text-[11px] tracking-widest uppercase text-indigo-400">
            Portfolio Project · Auth System
          </span>
        </div>

        {currentUser ? (
          <SessionCard user={currentUser} onSignOut={handleSignOut} />
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7 shadow-2xl shadow-black/40">

            {view !== 'reset' && (
              <>
                <h1 className="text-xl font-bold text-slate-100 text-center mb-1">
                  {view === 'signin' ? 'Welcome back' : 'Create your account'}
                </h1>
                <p className="text-sm text-slate-400 text-center mb-6">
                  {view === 'signin' ? 'Sign in to continue' : 'Takes less than a minute'}
                </p>

                {/* Tabs */}
                <div className="grid grid-cols-2 gap-1 bg-slate-800/60 rounded-lg p-1 mb-6">
                  <button
                    onClick={() => switchView('signin')}
                    className={`text-sm font-semibold py-2 rounded-md transition-colors ${
                      view === 'signin' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => switchView('signup')}
                    className={`text-sm font-semibold py-2 rounded-md transition-colors ${
                      view === 'signup' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Create account
                  </button>
                </div>

                {/* OAuth buttons */}
                <div className="flex flex-col gap-2.5 mb-5">
                  <button
                    onClick={() => handleOAuth('google')}
                    disabled={loading !== null}
                    className="flex items-center justify-center gap-2.5 w-full py-2.5 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-800 transition-colors text-sm font-medium text-slate-200 disabled:opacity-50"
                  >
                    {loading === 'google' ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <GoogleIcon />
                    )}
                    Continue with Google
                  </button>
                  <button
                    onClick={() => handleOAuth('apple')}
                    disabled={loading !== null}
                    className="flex items-center justify-center gap-2.5 w-full py-2.5 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-800 transition-colors text-sm font-medium text-slate-200 disabled:opacity-50"
                  >
                    {loading === 'apple' ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <AppleIcon />
                    )}
                    Continue with Apple
                  </button>
                </div>

                <div className="flex items-center gap-3 mb-5">
                  <div className="h-px bg-slate-800 flex-1" />
                  <span className="text-[11px] uppercase tracking-wider text-slate-500 font-mono">or</span>
                  <div className="h-px bg-slate-800 flex-1" />
                </div>

                {errors.form && (
                  <div className="mb-4 px-3 py-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
                    {errors.form}
                  </div>
                )}

                <form onSubmit={view === 'signin' ? handleSignIn : handleSignUp} className="flex flex-col gap-4">
                  {view === 'signup' && (
                    <Field
                      label="Name"
                      icon={<User size={15} />}
                      value={form.name}
                      onChange={(v) => updateField('name', v)}
                      error={errors.name}
                      placeholder="Eman"
                    />
                  )}

                  <Field
                    label="Email"
                    icon={<Mail size={15} />}
                    type="email"
                    value={form.email}
                    onChange={(v) => updateField('email', v)}
                    error={errors.email}
                    placeholder="you@example.com"
                  />

                  <div>
                    <Field
                      label="Password"
                      icon={<Lock size={15} />}
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={(v) => updateField('password', v)}
                      error={errors.password}
                      placeholder="••••••••"
                      trailing={
                        <button
                          type="button"
                          onClick={() => setShowPassword((s) => !s)}
                          className="text-slate-500 hover:text-slate-300"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      }
                    />
                    {view === 'signup' && form.password && (
                      <div className="mt-2">
                        <div className="flex gap-1">
                          {[0, 1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className={`h-1 flex-1 rounded-full ${i < strength ? STRENGTH_COLORS[strength] : 'bg-slate-800'}`}
                            />
                          ))}
                        </div>
                        <span className="text-[11px] text-slate-500 mt-1 inline-block">
                          {STRENGTH_LABELS[strength]}
                        </span>
                      </div>
                    )}
                  </div>

                  {view === 'signup' && (
                    <Field
                      label="Confirm password"
                      icon={<Lock size={15} />}
                      type={showPassword ? 'text' : 'password'}
                      value={form.confirm}
                      onChange={(v) => updateField('confirm', v)}
                      error={errors.confirm}
                      placeholder="••••••••"
                    />
                  )}

                  {view === 'signin' && (
                    <div className="flex items-center justify-between -mt-1">
                      <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-3.5 h-3.5 rounded border-slate-600 bg-slate-800 accent-indigo-500"
                        />
                        Remember me
                      </label>
                      <button
                        type="button"
                        onClick={() => switchView('reset')}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading !== null}
                    className="w-full py-2.5 rounded-lg bg-indigo-500 hover:bg-indigo-400 transition-colors text-sm font-bold text-white disabled:opacity-60 flex items-center justify-center gap-2 mt-1"
                  >
                    {loading === 'email' && <Loader2 size={15} className="animate-spin" />}
                    {view === 'signin' ? 'Sign in' : 'Create account'}
                  </button>
                </form>
              </>
            )}

            {view === 'reset' && (
              <ResetView
                email={form.email}
                error={errors.email}
                loading={loading === 'email'}
                sent={resetSent}
                onChange={(v) => updateField('email', v)}
                onSubmit={handleReset}
                onBack={() => switchView('signin')}
              />
            )}
          </div>
        )}

        <p className="text-center text-[11px] text-slate-600 mt-5 font-mono">
          Demo mode — mock backend, no real accounts created.
        </p>
      </div>
    </div>
  );
}

function Field({ label, icon, type = 'text', value, onChange, error, placeholder, trailing }) {
  return (
    <div>
      <label className="text-xs font-medium text-slate-400 mb-1.5 block">{label}</label>
      <div
        className={`flex items-center gap-2 px-3 py-2.5 rounded-lg bg-slate-800/50 border ${
          error ? 'border-rose-500/60' : 'border-slate-700'
        } focus-within:border-indigo-400 transition-colors`}
      >
        <span className="text-slate-500">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="bg-transparent outline-none text-sm text-slate-100 placeholder-slate-600 flex-1 min-w-0"
        />
        {trailing}
      </div>
      {error && <span className="text-[11px] text-rose-400 mt-1 block">{error}</span>}
    </div>
  );
}

function ResetView({ email, error, loading, sent, onChange, onSubmit, onBack }) {
  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 mb-5">
        <ArrowLeft size={13} /> Back to sign in
      </button>

      {sent ? (
        <div className="text-center py-4">
          <div className="w-11 h-11 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
            <Check size={18} className="text-emerald-400" />
          </div>
          <h2 className="text-base font-bold text-slate-100 mb-1.5">Check your email</h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            If an account exists for that address, we've sent a link to reset the password.
          </p>
        </div>
      ) : (
        <>
          <h1 className="text-xl font-bold text-slate-100 mb-1.5">Reset password</h1>
          <p className="text-sm text-slate-400 mb-6">We'll email you a link to get back in.</p>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <Field
              label="Email"
              icon={<Mail size={15} />}
              type="email"
              value={email}
              onChange={onChange}
              error={error}
              placeholder="you@example.com"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-indigo-500 hover:bg-indigo-400 transition-colors text-sm font-bold text-white disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={15} className="animate-spin" />}
              Send reset link
            </button>
          </form>
        </>
      )}
    </div>
  );
}

function SessionCard({ user, onSignOut }) {
  const initials = user.name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7 shadow-2xl shadow-black/40 text-center">
      <div className="w-16 h-16 rounded-full bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center mx-auto mb-4">
        <span className="text-lg font-bold text-indigo-300">{initials}</span>
      </div>
      <div className="flex items-center justify-center gap-1.5 mb-1">
        <ShieldCheck size={14} className="text-emerald-400" />
        <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Signed in</span>
      </div>
      <h2 className="text-lg font-bold text-slate-100">{user.name}</h2>
      <p className="text-sm text-slate-400 mb-1">{user.email}</p>
      <p className="text-[11px] text-slate-600 font-mono mb-6">via {user.provider}</p>
      <button
        onClick={onSignOut}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors"
      >
        <LogOut size={14} /> Sign out
      </button>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.13-.84 2.08-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A8.997 8.997 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.97 10.72A5.4 5.4 0 0 1 3.69 9c0-.6.1-1.18.28-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.05l3.01-2.33z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A8.997 8.997 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 17 20" fill="currentColor" className="text-slate-100">
      <path d="M13.93 10.6c-.02-2.1 1.72-3.1 1.8-3.16-.98-1.43-2.5-1.63-3.04-1.65-1.3-.13-2.53.76-3.19.76-.66 0-1.67-.74-2.75-.72-1.41.02-2.72.82-3.45 2.08-1.47 2.55-.38 6.32 1.06 8.38.7 1.01 1.53 2.14 2.62 2.1 1.05-.04 1.45-.68 2.72-.68 1.27 0 1.63.68 2.74.66 1.13-.02 1.85-1.02 2.54-2.04.8-1.17 1.13-2.31 1.14-2.37-.02-.01-2.18-.84-2.2-3.36zM11.7 4.13c.58-.7.97-1.68.86-2.65-.83.03-1.84.55-2.44 1.25-.53.61-1.01 1.62-.89 2.57.93.07 1.88-.47 2.47-1.17z" />
    </svg>
  );
}
