# Mobile Infrastructure Guide

This guide captures the mobile app conventions found under `/Users/giorgi/Dev` and applies them to Grammacho so Offtasks, Case Tracker, Etlyn, and future apps can converge on a similar React Native setup.

## Scan Results

| App          | Path                                      | React Native | React    | Structure notes                                                                                                        |
| ------------ | ----------------------------------------- | ------------ | -------- | ---------------------------------------------------------------------------------------------------------------------- |
| Offtasks     | `/Users/giorgi/Dev/offtasks.com/mobile`   | `0.82.0`     | `19.1.1` | Full RN CLI app with `src/components`, `src/features`, `src/navigation`, `src/providers`, `src/theme`, and `@/` alias. |
| Case Tracker | `/Users/giorgi/Dev/case-tracker/mobile`   | `0.82.0`     | `19.1.1` | Full RN CLI app, simpler source surface, matching dependency baseline and Metro resolutions.                           |
| Etlyn        | `/Users/giorgi/Dev/etlyn-hub/apps/mobile` | `0.75.4`     | `18.2.0` | Older RN baseline with app, components, navigation, store, theme, and feature folders.                                 |
| Grammacho    | `/Users/giorgi/Dev/grammar-app/mobile`    | `0.82.0`     | `19.1.1` | New scaffold following the Offtasks and Case Tracker baseline.                                                         |

## Standard Baseline

Use this baseline for new mobile apps unless there is a project-specific reason not to:

- React Native `0.82.0`
- React `19.1.1`
- React Native CLI `20.0.0`
- TypeScript `^5.8.3`
- Node `>=20`
- AsyncStorage for durable local state
- React Navigation 7 for native tabs, drawers, and stacks
- `react-native-dotenv` with an app-local `.env`
- `react-native-reanimated` `4.1.3` plus `react-native-worklets` `0.6.1`
- Metro `0.83.3` resolutions when Yarn dependency resolution drifts

Etlyn is the outlier. To make all three existing apps feel the same operationally, upgrade Etlyn deliberately from RN `0.75.4` to `0.82.0` rather than copying config piecemeal.

## Folder Contract

Each app should keep this source shape:

```text
mobile/
  App.tsx
  index.js
  app.json
  babel.config.js
  metro.config.js
  package.json
  tsconfig.json
  src/
    components/
    features/ or screens/
    hooks/
    lib/
    navigation/
    providers/
    services/
    theme/
    types/
    utils/
```

Use `@/` for mobile source imports. If a mobile app shares pure TypeScript modules with its web app, add a second explicit alias like `@grammar/` instead of reaching through long relative paths.

## Design Contract

- Match the web app's product identity, but adapt it to mobile with fewer panels and shorter lines.
- Use translucent surfaces, soft borders, and shadows for basic glass effects. Avoid new native blur dependencies unless a screen truly needs blur.
- Keep primary workflows on the first screen: progress, current item, and obvious next actions.
- Put domain content in screens, not marketing sections.
- Prefer a shared `theme/colors.ts` and reusable surface components over one-off inline palettes.

## Native Project Creation

For new apps, create native shells from the official CLI template and then layer the standard source structure on top:

```sh
npx @react-native-community/cli@20.0.0 init AppNameMobile --version 0.82.0 --skip-install
```

For Grammacho, the source scaffold and native shell already exist under `mobile/`. If the native shell ever needs to be regenerated, generate a temporary native shell, then copy only native project files into `mobile/`:

```sh
cd /Users/giorgi/Dev/grammar-app
npx @react-native-community/cli@20.0.0 init GrammachoMobile --version 0.82.0 --skip-install --directory mobile-native
cp -R mobile-native/ios mobile-native/android mobile-native/Gemfile mobile-native/.watchmanconfig mobile/
rm -rf mobile-native
```

Then install and prepare pods:

```sh
cd mobile
yarn install --ignore-engines
yarn ios:pods
```

Do not run a production build until the app-specific bundle id, display name, icons, signing team, and environment values are in place.

For React Native 0.82 on iOS, keep the `fmt` pod compiling as C++17 through the `ios/Podfile` post-install hook. This avoids the `fmt` 11.0.2 Apple Clang C++20 `consteval` failure in `format-inl.h`.

## Cross-App Maintenance Checklist

- Keep RN, React, CLI, Reanimated, Worklets, Safe Area, Screens, and React Navigation versions aligned.
- Keep `babel.config.js` plugin order consistent: dotenv, module resolver, Reanimated last.
- Keep `tsconfig.json` aliases and Jest `moduleNameMapper` in sync.
- Keep local persistence isolated with app-prefixed AsyncStorage keys.
- Keep public environment names documented in each app's `mobile/README.md`.
- Avoid copying native `ios/` or `android/` folders from another product. Generate from the target RN version and then apply app-specific changes.
