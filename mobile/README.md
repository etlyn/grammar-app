# Grammacho Mobile

Pure React Native mobile client for Grammacho. The source uses the same React Native 0.82 baseline as `offtasks.com/mobile` and `case-tracker/mobile`, with the same provider, navigation, theme, and config conventions.

## Current Scaffold

- `App.tsx` wires `GestureHandlerRootView`, `SafeAreaProvider`, preferences, learning state, and bottom tabs.
- `src/providers/` owns theme preferences and local grammar progress through AsyncStorage.
- `src/theme/colors.ts` defines the light/dark glass palette used by the screens.
- `src/screens/` contains Home, Topics, Practice, and Reader flows.
- `src/services/contentService.ts` loads the shared web curriculum and can hydrate Supabase content when `.env` is configured.
- `metro.config.js`, `babel.config.js`, and `tsconfig.json` expose `@/` for mobile code and `@grammar/` for shared web grammar modules.

## Native Shell

The `ios/` and `android/` folders were generated from the React Native 0.82 template. Keep `mobile/package.json`, `mobile/App.tsx`, `mobile/index.js`, and the config files in this scaffold as the source of truth.

The iOS `fmt` pod is pinned to compile as C++17 in `ios/Podfile` because `fmt` 11.0.2 can hit an Apple Clang C++20 `consteval` failure in `format-inl.h`. The existing generated Pods project and `fmt` xcconfigs have the same C++17 setting applied directly so Xcode can pick up the fix immediately.

## Setup

```sh
cd mobile
cp .env.example .env
yarn install --ignore-engines
yarn ios:pods
```

Copy the public Supabase browser values from the web app into `mobile/.env`:

```sh
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-public-anon-key
```

The app works with seed content when those values are blank.

## Run

```sh
yarn start
yarn ios
```

The app was intentionally not built as part of this scaffold.
