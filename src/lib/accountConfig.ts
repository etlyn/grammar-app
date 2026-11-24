type PublicAccountConfig = {
  url: string;
  anonKey: string;
  apiUrl: string;
  canonicalWebOrigin: string;
};

/** Production identity must not be redirected by stale hosting build values.
 * Explicit provider overrides belong only to isolated preview/local hosts. */
export function resolveAccountConfig(
  production: PublicAccountConfig,
  origin: string,
  override: { url?: string; anonKey?: string; apiUrl?: string },
) {
  const canonical = origin === production.canonicalWebOrigin;
  const configured = !canonical && Boolean(override.url && override.anonKey);
  return {
    hostEnabled: canonical || configured,
    url: canonical ? production.url : override.url || production.url,
    anonKey: canonical
      ? production.anonKey
      : override.anonKey || production.anonKey,
    apiUrl: canonical
      ? production.apiUrl
      : override.apiUrl || production.apiUrl,
    callbackOrigin: configured ? origin : production.canonicalWebOrigin,
  };
}
