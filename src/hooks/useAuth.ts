import { useEffect, useState, useSyncExternalStore } from "react";
import {
  accountClient,
  accountEnabled,
  accountSupabase,
  completeAccountCallback,
  continueWithGoogle,
  createAccount,
  googleEnabled,
  requestPasswordReset,
  updatePassword,
} from "../lib/account";

export function useAuth() {
  const state = useSyncExternalStore(
    accountClient.subscribe,
    accountClient.getSnapshot,
    accountClient.getSnapshot,
  );
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [recovery, setRecovery] = useState(false);
  const [callbackFeedback, setCallbackFeedback] = useState(false);
  const [providerId, setProviderId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(!accountEnabled);

  useEffect(() => {
    let active = true;
    const subscription = accountSupabase?.auth.onAuthStateChange(
      (event, session) => {
        setProviderId(session?.user.id ?? null);
        setHydrated(true);
        if (event === "PASSWORD_RECOVERY") setRecovery(true);
        // Never await a Supabase request inside its own auth-state callback.
        if (event !== "INITIAL_SESSION")
          window.setTimeout(() => {
            if (active) void accountClient.refresh();
          }, 0);
      },
    );
    void completeAccountCallback()
      .catch((error) => {
        if (active) {
          setCallbackFeedback(true);
          setMessage(
            error instanceof Error
              ? error.message
              : "The sign-in link could not be completed.",
          );
        }
      })
      .then(async () => {
        const saved = await accountSupabase?.auth.getSession();
        if (active) {
          setProviderId(saved?.data.session?.user.id ?? null);
          setHydrated(true);
          void accountClient.refresh();
        }
      });
    return () => {
      active = false;
      subscription?.data.subscription.unsubscribe();
    };
  }, []);

  const perform = async (task: () => Promise<void>) => {
    setBusy(true);
    setMessage("");
    try {
      await task();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "The account request could not be completed. Try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  return {
    ...state,
    // The provider subject keys local app data even during an offline identity
    // lookup. Server requests independently verify the token and owner.
    user: providerId
      ? { id: providerId, displayName: state.session?.user.displayName }
      : null,
    hydrated,
    isConfigured: accountEnabled,
    googleEnabled,
    loading: busy || Boolean(state.pending) || state.status === "checking",
    message: message || state.error || "",
    recovery,
    callbackFeedback,
    dismissMessage: () => setMessage(""),
    signIn: (email: string, password: string) =>
      perform(() => accountClient.signIn({ email, password })),
    google: () => perform(continueWithGoogle),
    signUp: (email: string, password: string) =>
      perform(async () => {
        const signedIn = await createAccount(email, password);
        if (!signedIn)
          setMessage(
            "Check your email to confirm your account, then return here to sign in.",
          );
      }),
    resetPassword: (email: string) =>
      perform(async () => {
        await requestPasswordReset(email);
        setMessage(
          "If that address has an account, you will receive a password-reset link.",
        );
      }),
    savePassword: (password: string) =>
      perform(async () => {
        await updatePassword(password);
        setRecovery(false);
        setMessage("Your password has been updated.");
        await accountClient.refresh();
      }),
    signOut: () =>
      perform(async () => {
        await accountClient.signOut();
        setRecovery(false);
      }),
    refresh: () => perform(() => accountClient.refresh()),
  };
}
export type AccountAuth = ReturnType<typeof useAuth>;
