import { createClient } from "@supabase/supabase-js";
import {
  createAuthClient,
  createAuthenticatedFetch,
  createIdentityClient,
} from "@etlyn/etlyn-auth";
import {
  createReturnPathStore,
  createSupabaseAuthAdapter,
  createSupabaseGoogleAuth,
} from "@etlyn/etlyn-auth/supabase";
import { productionAccountConfig } from "./productionAccountConfig";
import { resolveAccountConfig } from "./accountConfig";

const env = import.meta.env;
const allowPreviewAccounts = env.DEV || env.VITE_PREVIEW_ACCOUNTS === "true";
const {
  hostEnabled,
  url,
  anonKey,
  apiUrl: resolvedApiUrl,
  callbackOrigin,
} = resolveAccountConfig(
  productionAccountConfig,
  window.location.origin,
  allowPreviewAccounts
    ? {
        url: env.VITE_SUPABASE_URL as string | undefined,
        anonKey: env.VITE_SUPABASE_ANON_KEY as string | undefined,
        apiUrl: env.VITE_ETLYN_API_URL as string | undefined,
      }
    : {},
);
export const accountEnabled =
  hostEnabled &&
  env.VITE_ACCOUNT_ENABLED !== "false" &&
  Boolean(url && anonKey);
export const apiUrl = resolvedApiUrl;
export const googleEnabled =
  accountEnabled && env.VITE_GOOGLE_AUTH_ENABLED !== "false";
const callbackUrl = `${callbackOrigin}/`;
const incoming = new URL(window.location.href);
const managedCallback =
  incoming.pathname === "/" &&
  (incoming.searchParams.has("code") ||
    incoming.searchParams.has("error") ||
    new URLSearchParams(incoming.hash.slice(1)).has("error"));

// Public application configuration only. Supabase owns session persistence and
// refresh; no Grammar database tables are queried from the browser.
export const accountSupabase = accountEnabled
  ? createClient(url, anonKey, {
      auth: {
        flowType: "pkce",
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: !managedCallback,
        storageKey: "grammacho:account-session:v1",
      },
    })
  : null;

export const accessToken = async ({ refresh = false } = {}) => {
  if (!accountSupabase) return null;
  if (refresh) {
    const result = await accountSupabase.auth.refreshSession();
    if (result.error)
      throw new Error("Please sign in again to sync your progress.");
  }
  const result = await accountSupabase.auth.getSession();
  if (result.error)
    throw new Error("Please sign in again to sync your progress.");
  return result.data.session?.access_token ?? null;
};

const adapter = accountSupabase
  ? createSupabaseAuthAdapter({
      supabase: {
        auth: {
          getSession: () => accountSupabase.auth.getSession(),
          signInWithPassword: (credentials) =>
            accountSupabase.auth.signInWithPassword(credentials),
          refreshSession: () => accountSupabase.auth.refreshSession(),
          signOut: () => accountSupabase.auth.signOut({ scope: "local" }),
          onAuthStateChange: (callback) =>
            accountSupabase.auth.onAuthStateChange(callback),
        },
      },
      identity: createIdentityClient({
        baseUrl: apiUrl,
        getAccessToken: accessToken,
      }),
    })
  : {
      getSession: async () => null,
      signIn: async () => {
        throw new Error("Accounts are not available on this preview.");
      },
      signOut: async () => undefined,
    };

export const accountClient = createAuthClient<{
  email: string;
  password: string;
}>(adapter);
export const isCurrentAccount = async (owner: string) =>
  (await accountSupabase?.auth.getSession())?.data.session?.user.id === owner;
export const accountFetchFor = (owner: string) =>
  createAuthenticatedFetch({
    baseUrl: apiUrl,
    getAccessToken: async (options) => {
      if (!accountSupabase) return null;
      const current = options?.refresh
        ? await accountSupabase.auth.refreshSession()
        : await accountSupabase.auth.getSession();
      const session = current.data.session;
      if (current.error || !session?.access_token || session.user.id !== owner)
        throw new Error("The account changed. Please sign in again.");
      return session.access_token;
    },
  });
const google = accountSupabase
  ? createSupabaseGoogleAuth({
      client: accountSupabase,
      origin: callbackOrigin,
      callbackPath: "/",
      fallback: "/",
      returnPathStore: createReturnPathStore(
        () => window.sessionStorage,
        "grammacho:auth-return:v1",
      ),
      scrubCallbackUrl: (path) => window.history.replaceState(null, "", path),
    })
  : null;

let callback: Promise<void> | undefined;
export function completeAccountCallback() {
  if (!callback)
    callback = (async () => {
      if (managedCallback && google) await google.complete(incoming.toString());
    })();
  return callback;
}

export async function continueWithGoogle() {
  if (!googleEnabled || !google)
    throw new Error("Google sign-in is not available right now.");
  await google.start("/");
}

export async function createAccount(email: string, password: string) {
  if (!accountSupabase)
    throw new Error("Accounts are not available on this preview.");
  const { data, error } = await accountSupabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: callbackUrl },
  });
  if (error)
    throw new Error(
      "We could not create your account. Check your details and try again.",
    );
  if (data.session) await accountClient.refresh();
  return Boolean(data.session);
}

export async function requestPasswordReset(email: string) {
  if (!accountSupabase)
    throw new Error("Accounts are not available on this preview.");
  const { error } = await accountSupabase.auth.resetPasswordForEmail(email, {
    redirectTo: callbackUrl,
  });
  if (error)
    throw new Error("We could not send the reset link. Try again shortly.");
}

export async function updatePassword(password: string) {
  if (!accountSupabase)
    throw new Error("Please open your password-reset link again.");
  const { error } = await accountSupabase.auth.updateUser({ password });
  if (error)
    throw new Error(
      "We could not update your password. Open a fresh reset link and try again.",
    );
}
