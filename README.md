# FhooKkkDiya

A private, local-first Gen-Z expense tracker built with React Native + Expo. It is designed around one idea:

> track the money before the money tracks you.

The app combines practical expense logging with Indian meme energy, Hinglish roasting, salary-aware spending context, and an optional unfiltered  Mode.

## Release

Current release: **1.2.0**

This release adds the salary system, context-aware comedy tiers, CID/Instagram-style reactions, stronger input validation, safer delete flows, red/black/maroon visual polish, and automated product QA checks.

## Highlights

### Money tracking
- Add an expense with description, amount, and category.
- Tap an expense to edit it; long-press to delete with confirmation.
- Quick-add multiple expenses in one go.
- Salary can be created, updated, read on the dashboard, or reset from Jugaad without touching expenses.
- Today, History/Qissa, Hisaab/Reports, and Jugaad/Settings modules.
- All expense data is stored locally with AsyncStorage.
- Legacy Spendly expense data is migrated forward when present.

### Salary-aware spending
- First launch asks: **"Is month salary kitni aayi?"**
- Salary is saved locally.
- Home shows monthly salary, spent amount, remaining amount, percentage used, and an approximate safe daily amount for the remaining days of the month.
- Salary can be edited later from **Jugaad**.
- Salary context feeds the comedy engine as well as the spending summary.

### The ₹comedy ladder
The app is tuned around a maximum individual expense of **₹20,000**.

The roast intensity changes with:
- today's total
- the largest individual expense today
- number of expenses today
- salary percentage used
-  Mode state

Higher tiers move into investigation/CID-style reactions and final-boss jokes rather than repeating the same generic punchline.

### Comedy modes
- Original Hinglish sarcasm.
- Optional MC/BC/English profanity through Gaali Mode.
- Indian comedy-film archetype humour.
- CID-style investigation reactions.
- Instagram/Reels-style meme language.
- Desi roast lines.
- Deadpan corporate-style burns.

The lines are original riffs rather than long verbatim reproductions of movie dialogue.

## UX / UI

The visual system is intentionally Gen-Z and high contrast:
- black and near-black surfaces
- deep maroon panels
- bright red action colour
- white text
- subtle motion and ambient glows
- animated tab transitions
- tactile press feedback
- scroll-safe onboarding
- keyboard-aware entry sheets
- SVG interface icons for consistent Android rendering

The launcher icon is configured through Expo/Android using `dist/apple-icon.png`.

## Architecture

The app currently uses a deliberately small dependency surface:

- **Expo SDK 51**
- **React Native 0.74.5**
- **React 18.2**
- **AsyncStorage 1.23.1**
- **react-native-svg 15.2.0**
- **expo-status-bar**
- Expo web runtime packages for web builds

The codebase uses a direct `index.js -> App.tsx` entry point and does not use Expo Router, Reanimated, or Lucide.

## Storage

Current local keys:

- `@fhookkdiya/expenses`
- `@fhookkdiya/monthly-salary`
- `@fhookkdiya/gaali-mode`
- `@fhookkdiya/welcome-seen`

Legacy Spendly keys for expenses and onboarding are still read for migration compatibility.

No account, bank connection, or remote database is required for the current app.

## Development

Install dependencies:

```bash
npm install
```

Start Expo:

```bash
npm start
```

Android:

```npm run android
```

iOS:

```bash
npm run ios
```

Web:

```bash
npm run web
```

## Android release build

Preview APK:

```bash
npx eas-cli@latest build -p android --profile preview
```

Production Android App Bundle:

```bash
npx eas-cli@latest build -p android --profile production
```

The EAS profiles currently target Node 20.18.0.

Android application id: `com.gutzx007s.fhookkkdiya`.

## QA

Automated product assertions live in:

```
qa/static-qa.mjs
qa/dependency-audit.mjs
```

GitHub Actions runs:

1. dependency installation
2. Prettier source/config check
3. JSON validation
4. explicit dependency compatibility audit
5. TypeScript strict check
6. Expo web bundle smoke test
7. product-level static assertions

The QA assertions cover:
- stale dependency/config cleanup
- ₹20,000 expense limits
- salary persistence
- salary-aware calculations
- comedy tier wiring
- delete confirmation
- onboarding scrolling
- theme configuration
- version alignment
- strict TypeScript compilation
- Expo web bundle export

## Dependency policy

This release keeps the project on **Expo SDK 51** intentionally so the final product can be stabilized without introducing a last-minute SDK migration.

Expo's current documentation says SDK 51 is significantly outdated and recommends upgrading incrementally rather than jumping versions blindly. The next maintenance cycle should therefore handle SDK upgrades separately from product-feature changes.

When upgrading Expo later:
1. move one SDK at a time
2. run Expo's dependency/version validation
3. rebuild native Android/iOS binaries
4. retest storage migration and animations
5. verify the final EAS build on a real device

## Project structure

```
.
├── App.tsx
├── index.js
├── app.json
├── eas.json
├── babel.config.js
├── package.json
├── qa/
│   └── static-qa.mjs
├── .github/
│   └── workflows/
│       └── final-qa.yml
├── dist/
│   └── apple-icon.png
└── public/
    └── icon.svg
```

## Release notes

See [CHANGELOG.md](./CHANGELOG.md).

## Product status

The app is feature-complete for the current MVP scope. The remaining release gate is a fresh EAS build and real-device smoke test against the exact final commit after the latest QA changes.
