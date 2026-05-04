import { FormEvent, useEffect, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";

type AuthPanelProps = {
  isConfigured: boolean;
  user: User | null;
  loading: boolean;
  message: string;
  onSendMagicLink: (email: string) => Promise<void>;
  onSignOut: () => Promise<void>;
};

export function AuthPanel({
  isConfigured,
  user,
  loading,
  message,
  onSendMagicLink,
  onSignOut,
}: AuthPanelProps) {
  const [email, setEmail] = useState("");
  const [showSignIn, setShowSignIn] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showSignIn) return;

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setShowSignIn(false);
      }
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowSignIn(false);
      }
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [showSignIn]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;
    await onSendMagicLink(email.trim());
  };

  if (!isConfigured) {
    return (
      <div className="flex items-center gap-2 rounded-full border border-amber-100 bg-amber-50/90 px-2 py-1 text-sm text-amber-900 shadow-sm shadow-amber-100/80">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-200 to-orange-300 text-sm shadow-inner">
          🦊
        </div>
        <p className="hidden text-xs font-bold sm:block">Guest mode</p>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-2 rounded-full border border-teal-100 bg-white/85 px-2 py-1 text-sm shadow-sm shadow-teal-100/70 backdrop-blur">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-300 to-sky-400 text-xs font-bold text-white shadow-inner">
          {user.email?.charAt(0).toUpperCase() ?? "✓"}
        </div>
        <div className="hidden min-w-0 sm:block">
          <p className="max-w-36 truncate text-xs font-bold text-slate-950 lg:max-w-52">
            {user.email}
          </p>
        </div>
        <button
          className="rounded-full border border-indigo-100 px-3 py-1 text-xs font-bold text-indigo-600 transition hover:border-indigo-200 hover:bg-indigo-50"
          onClick={onSignOut}
          type="button"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={containerRef}>
      <div className="flex items-center gap-2 rounded-full border border-indigo-100 bg-white/85 px-2 py-1 text-sm shadow-sm shadow-indigo-100/70 backdrop-blur">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-300 via-amber-200 to-sky-300 text-sm shadow-inner">
          🐝
        </div>
        <p className="hidden text-xs font-bold text-slate-700 sm:block">
          Guest
        </p>
        <button
          className="rounded-full bg-gradient-to-r from-indigo-600 to-sky-500 px-2.5 py-1 text-xs font-bold text-white shadow-sm shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
          disabled={loading}
          onClick={() => setShowSignIn((value) => !value)}
          type="button"
        >
          Sign in
        </button>
      </div>
      {showSignIn ? (
        <form
          className="absolute right-0 top-full z-40 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-3xl border border-indigo-100 bg-white p-4 shadow-soft"
          onSubmit={submit}
        >
          <p className="text-sm font-black text-slate-950">
            Save progress with magic-link sign in
          </p>
          <label
            className="mt-3 block text-xs font-medium uppercase tracking-wide text-slate-500"
            htmlFor="email"
          >
            Email
          </label>
          <div className="mt-2 flex gap-2">
            <input
              id="email"
              className="min-w-0 flex-1 rounded-2xl border border-indigo-100 bg-indigo-50/40 px-3 py-2 text-sm outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="email@example.com"
              type="email"
              value={email}
            />
            <button
              className="rounded-2xl bg-gradient-to-r from-indigo-600 to-sky-500 px-4 py-2 text-sm font-bold text-white shadow-sm shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
              disabled={loading}
              type="submit"
            >
              {loading ? "Sending" : "Send"}
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Already have an account? Use the same email.
          </p>
          {message && <p className="mt-2 text-xs text-slate-500">{message}</p>}
        </form>
      ) : null}
    </div>
  );
}
