import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import type { AccountAuth } from "../hooks/useAuth";
import { apiUrl } from "../lib/account";

type Props = {
  auth: AccountAuth;
  syncing: boolean;
  syncMessage: string;
  pendingCount: number;
  onSync: () => Promise<void>;
  onClear: () => Promise<void>;
  clearing: boolean;
  showTrigger?: boolean;
  openRequest?: number;
};
export function AuthPanel({
  auth,
  syncing,
  syncMessage,
  pendingCount,
  onSync,
  onClear,
  clearing,
  showTrigger = true,
  openRequest = 0,
}: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const [mode, setMode] = useState<"sign-in" | "sign-up" | "reset">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [availability, setAvailability] = useState<{
    enabled: boolean;
    googleEnabled: boolean;
  } | null>(null);
  const [checking, setChecking] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [clearText, setClearText] = useState("");
  const available = availability?.enabled ?? false;
  const changeMode = (value: typeof mode) => {
    setMode(value);
    setPassword("");
    setConfirmation("");
    setFormMessage("");
    auth.dismissMessage();
  };
  const checkAvailability = useCallback(async () => {
    setChecking(true);
    try {
      const response = await fetch(
        new URL("/api/grammacho/v1/availability", apiUrl),
        { cache: "no-store" },
      );
      const body = response.ok ? await response.json() : null;
      setAvailability({
        enabled: body?.enabled === true,
        googleEnabled: body?.googleEnabled === true,
      });
    } catch {
      setAvailability({ enabled: false, googleEnabled: false });
    } finally {
      setChecking(false);
    }
  }, []);
  const open = useCallback(() => {
    returnFocus.current = document.activeElement as HTMLElement | null;
    dialog.current?.showModal();
    if (auth.isConfigured) void checkAvailability();
  }, [auth.isConfigured, checkAvailability]);
  const previousRequest = useRef(0);
  useEffect(() => {
    if (openRequest > previousRequest.current) open();
    previousRequest.current = openRequest;
  }, [open, openRequest]);
  const close = () => {
    dialog.current?.close();
    setPassword("");
    setConfirmation("");
    (opener.current ?? returnFocus.current)?.focus();
  };
  useEffect(() => {
    const url = new URL(window.location.href);
    const resetRequested =
      auth.isConfigured && url.searchParams.get("account") === "reset";
    if (resetRequested) {
      url.searchParams.delete("account");
      window.history.replaceState(
        null,
        "",
        url.pathname + url.search + url.hash,
      );
      setMode("reset");
    }
    if (auth.recovery || auth.callbackFeedback || resetRequested) {
      if (!dialog.current?.open) dialog.current?.showModal();
      if (auth.isConfigured && !auth.recovery) void checkAvailability();
    }
  }, [
    auth.recovery,
    auth.callbackFeedback,
    auth.isConfigured,
    checkAvailability,
  ]);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setFormMessage("");
    if (auth.recovery) {
      if (password !== confirmation) {
        setFormMessage("The two passwords do not match.");
        return;
      }
      await auth.savePassword(password);
      setPassword("");
      setConfirmation("");
      return;
    }
    if (!available || checking) return;
    if (mode === "reset") await auth.resetPassword(email.trim());
    else if (mode === "sign-up") await auth.signUp(email.trim(), password);
    else await auth.signIn(email.trim(), password);
    setPassword("");
  };
  return (
    <>
      {showTrigger && (
        <button
          ref={opener}
          className="button secondary account-trigger"
          type="button"
          onClick={open}
          aria-haspopup="dialog"
        >
          {auth.user ? "Account" : "Sign in"}
        </button>
      )}
      <dialog
        ref={dialog}
        className="account-dialog"
        aria-labelledby="account-title"
        onCancel={close}
        onClick={(event) => {
          if (event.target === dialog.current) close();
        }}
      >
        <div className="account-dialog-header">
          <h2 id="account-title">
            {auth.recovery
              ? "Set a new password"
              : auth.user
                ? "Your Grammacho account"
                : mode === "sign-up"
                  ? "Create your account"
                  : mode === "reset"
                    ? "Reset your password"
                    : "Keep learning, anywhere"}
          </h2>
          <button
            type="button"
            className="text-button account-close"
            aria-label="Close account"
            onClick={close}
          >
            ×
          </button>
        </div>
        {auth.recovery ? (
          <p className="muted">Choose a new password for your Etlyn account.</p>
        ) : auth.user ? (
          <>
            {auth.user.displayName && <p>{auth.user.displayName}</p>}
            <p className="muted">
              Your learning and mistakes are kept with this account. Guest
              progress on this browser stays separate.
            </p>
            <p role="status" className="account-status">
              {syncing
                ? "Syncing your learning…"
                : syncMessage || "Your account is saved on this browser."}
              {pendingCount > 0 && ` ${pendingCount} updates waiting to sync.`}
            </p>
            <div className="account-actions">
              <button
                className="button primary"
                disabled={syncing || auth.loading || clearing}
                onClick={() => void onSync()}
                type="button"
              >
                Sync now
              </button>
              <button
                className="button secondary"
                disabled={auth.loading || clearing}
                onClick={() => void auth.signOut()}
                type="button"
              >
                Sign out
              </button>
            </div>
            {!confirmClear ? (
              <button
                type="button"
                className="text-button account-clear"
                onClick={() => {
                  setConfirmClear(true);
                  setFormMessage("");
                }}
              >
                Clear Grammacho learning
              </button>
            ) : (
              <div className="account-clear-confirm">
                <p>
                  This clears progress and saved mistakes from this Grammacho
                  account, including queued work on this browser. Your shared
                  Etlyn account, other apps and separate guest history are kept.
                </p>
                <label>
                  Type DELETE MY GRAMMACHO DATA
                  <input
                    value={clearText}
                    onChange={(event) => setClearText(event.target.value)}
                    autoComplete="off"
                  />
                </label>
                <div className="account-actions">
                  <button
                    className="button secondary"
                    type="button"
                    disabled={clearing}
                    onClick={() => {
                      setConfirmClear(false);
                      setClearText("");
                    }}
                  >
                    Keep learning
                  </button>
                  <button
                    className="button primary"
                    type="button"
                    disabled={
                      clearing ||
                      syncing ||
                      clearText !== "DELETE MY GRAMMACHO DATA"
                    }
                    onClick={() => {
                      void onClear()
                        .then(() => {
                          setConfirmClear(false);
                          setClearText("");
                        })
                        .catch((error) =>
                          setFormMessage(
                            error instanceof Error
                              ? error.message
                              : "Your learning could not be cleared. Try again.",
                          ),
                        );
                    }}
                  >
                    {clearing ? "Clearing…" : "Clear my learning"}
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <p className="muted">
              Sign in to save your progress and learn from mistakes across
              devices. You can always keep learning without an account.
            </p>
            {!auth.isConfigured ? (
              <p className="notice">
                Accounts are available on the public Grammacho website. Your
                browser progress keeps working here.
              </p>
            ) : (
              <>
                {checking && (
                  <p role="status" className="account-status">
                    Checking account availability…
                  </p>
                )}
                {!checking && availability && !available && (
                  <p role="status" className="notice">
                    Accounts are temporarily unavailable. Your learning is still
                    saved on this browser.{" "}
                    <button
                      type="button"
                      className="text-button"
                      onClick={() => void checkAvailability()}
                    >
                      Try again
                    </button>
                  </p>
                )}
                {mode !== "reset" && auth.googleEnabled && (
                  <button
                    className="button google-button"
                    type="button"
                    disabled={
                      !available ||
                      !availability?.googleEnabled ||
                      auth.loading ||
                      checking
                    }
                    onClick={() => void auth.google()}
                  >
                    <GoogleMark /> Continue with Google
                  </button>
                )}
                {mode !== "reset" && (
                  <p className="account-divider">or use email</p>
                )}
              </>
            )}
          </>
        )}
        {(auth.recovery || (!auth.user && auth.isConfigured)) && (
          <form className="account-form" onSubmit={submit}>
            {!auth.recovery && (
              <label>
                Email
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </label>
            )}
            {(auth.recovery || mode !== "reset") && (
              <label>
                {auth.recovery ? "New password" : "Password"}
                <input
                  name="password"
                  type="password"
                  autoComplete={
                    auth.recovery || mode === "sign-up"
                      ? "new-password"
                      : "current-password"
                  }
                  minLength={
                    auth.recovery || mode === "sign-up" ? 8 : undefined
                  }
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </label>
            )}
            {auth.recovery && (
              <label>
                Confirm new password
                <input
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  value={confirmation}
                  onChange={(event) => setConfirmation(event.target.value)}
                />
              </label>
            )}
            <button
              type="submit"
              className="button primary"
              disabled={
                auth.loading || (!auth.recovery && (!available || checking))
              }
            >
              {auth.loading
                ? "Please wait…"
                : auth.recovery
                  ? "Save password"
                  : mode === "sign-up"
                    ? "Create account"
                    : mode === "reset"
                      ? "Send reset link"
                      : "Sign in with email"}
            </button>
          </form>
        )}
        {(formMessage || auth.message) && (
          <p className="account-status" role="status">
            {formMessage || auth.message}
          </p>
        )}
        {!auth.user && !auth.recovery && auth.isConfigured && (
          <div className="account-links">
            <button
              className="text-button"
              onClick={() =>
                changeMode(mode === "sign-up" ? "sign-in" : "sign-up")
              }
              type="button"
            >
              {mode === "sign-up"
                ? "Already have an account? Sign in"
                : "Create an account"}
            </button>
            <button
              className="text-button"
              onClick={() => changeMode(mode === "reset" ? "sign-in" : "reset")}
              type="button"
            >
              {mode === "reset" ? "Back to sign in" : "Forgot your password?"}
            </button>
          </div>
        )}
        {!auth.user && !auth.recovery && (
          <button
            className="text-button account-guest"
            type="button"
            onClick={close}
          >
            Continue without an account
          </button>
        )}
      </dialog>
    </>
  );
}
function GoogleMark() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 48 48">
      <path
        fill="#4285F4"
        d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.1v5.1h6.6c3.9-3.6 6.1-8.9 6.1-14.9Z"
      />
      <path
        fill="#34A853"
        d="M24 44c5.5 0 10.1-1.8 13.5-4.9L30.9 34a12.3 12.3 0 0 1-18.3-6.4H5.8v5.3A20.4 20.4 0 0 0 24 44Z"
      />
      <path
        fill="#FBBC05"
        d="M12.6 27.6a12.2 12.2 0 0 1 0-7.2v-5.3H5.8a20.3 20.3 0 0 0 0 17.8l6.8-5.3Z"
      />
      <path
        fill="#EA4335"
        d="M24 12c3 0 5.7 1 7.8 3l5.9-5.9A19.8 19.8 0 0 0 24 4 20.4 20.4 0 0 0 5.8 15.1l6.8 5.3A12.2 12.2 0 0 1 24 12Z"
      />
    </svg>
  );
}
