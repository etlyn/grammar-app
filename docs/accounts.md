# Accounts and progress sync

Grammacho opens in guest mode. Reading and practice work without registration or an internet connection after the initial web load. Guest history stays in the browser or the native app on that device. Clearing its storage or uninstalling the app removes that local history.

Learners can sign in with Google or email. They can choose to copy the guest history on a device into their Grammacho account. Signed-in progress syncs across devices, with missed answers used to suggest practice or reading for the affected topics. Each account has its own history. Signing out returns to the guest history on that device.

Grammacho uses the published Etlyn Auth SDK and the shared Etlyn Apps Supabase Auth project. The production browser configuration contains the Supabase public client key and the `https://api.etlyn.com` origin. The learning API validates the managed account and writes only that learner’s progress to the private Grammar schema. The browser has no direct permissions on that schema. See [Etlyn server](https://github.com/etlyn/etlyn-server).

## Deployment

The production web callback is `https://www.grammacho.com/`. The apex redirects to `www` before sign-in starts. The native callback is `grammacho://auth/callback`. Register the exact callback URLs in the shared project's Auth redirect allowlist. The iPhone password reset opens the web form at `/?account=reset`, so the browser can request the email and complete the same-browser link. Preview hosts are guest-only by default. For a local account-flow test, use the variables in [`.env.example`](../.env.example) and a test project's allowed callback.

Deploy the API and verify its Grammacho availability route before enabling production accounts. Verify guest practice, sign-in, explicit guest import, incorrect-answer review and sign-out from separate browser contexts. Use a test account to verify the same history across web and mobile. The native app uses the same account and sync service.
