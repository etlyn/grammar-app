const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { resolveAccountConfig } = require(
  path.join(process.env.LEARNING_BUILD_DIR, "lib/accountConfig.js"),
);
const production = {
  url: "https://current.supabase.test",
  anonKey: "public-current",
  apiUrl: "https://api.etlyn.test",
  canonicalWebOrigin: "https://www.grammacho.test",
};
const stale = {
  url: "https://retired.supabase.test",
  anonKey: "public-retired",
  apiUrl: "https://retired-api.test",
};

test("canonical web always uses the reviewed provider, API and callback despite stale hosting variables", () => {
  assert.deepEqual(
    resolveAccountConfig(production, production.canonicalWebOrigin, stale),
    {
      hostEnabled: true,
      url: production.url,
      anonKey: production.anonKey,
      apiUrl: production.apiUrl,
      callbackOrigin: production.canonicalWebOrigin,
    },
  );
});

test("explicit isolated test hosts keep their own provider and callback; unconfigured previews stay guest-only", () => {
  const origin = "http://127.0.0.1:4189";
  assert.deepEqual(resolveAccountConfig(production, origin, stale), {
    hostEnabled: true,
    url: stale.url,
    anonKey: stale.anonKey,
    apiUrl: stale.apiUrl,
    callbackOrigin: origin,
  });
  const guest = resolveAccountConfig(production, "https://preview.test", {});
  assert.equal(guest.hostEnabled, false);
  assert.equal(guest.callbackOrigin, production.canonicalWebOrigin);
});
