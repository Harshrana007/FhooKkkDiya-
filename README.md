# FhooKkkDiya

FhooKkkDiya is a sleek, local-first expense tracker built with Expo and React Native. It helps users quickly log their daily spending, review past entries, and understand where their money goes without needing a bank connection, account setup, or any backend service.

The app is intentionally simple: add an expense, assign a category, track today’s spending, and check category-wise totals in seconds.

## Features

- Add expenses with description, amount, and category
- View today’s spending summary
- Browse complete expense history
- See category-wise spending reports
- Use quick entry for multiple expenses at once
- Toggle reminder preferences
- Keep all data private on the device using AsyncStorage
- Clean dark UI for mobile and web experiences

## Tech Stack

- React Native
- Expo
- TypeScript
- AsyncStorage
- React Native Web

## Project Structure

```text
FhooKkkDiya/
├── App.tsx              # Main application UI and logic
├── index.js             # Expo app entry point
├── app.json             # Expo project configuration
├── eas.json             # EAS configuration
├── vercel.json          # Vercel deployment config
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript config
├── public/              # Public web assets
├── dist/                # Generated web build output
├── .gitignore           # Ignore rules
├── README.md            # Project documentation
└── ...
```

## Screens

The app includes these main sections:

- Today: add expenses and see today’s total
- History: review all entries
- Reports: view spending by category
- Settings: manage reminder settings and app preferences

A welcome screen appears on first launch, and the app stores all entry data locally.

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- Expo CLI (optional; you can use npx)

### Install dependencies

```bash
git clone https://github.com/Niteshkanwar007/FhooKkkDiya.git
cd FhooKkkDiya
npm install
```

### Run the app

```bash
npm start
```

Then run one of the following:

```bash
npm run android
npm run ios
npm run web
```

### Build for web

```bash
npx expo export --platform web
```

## Local Storage

FhooKkkDiya stores expenses and preferences locally with AsyncStorage. That means:

- data stays on the same device/browser
- there is no multi-device sync
- there is no backend database
- web builds remain client-side unless additional persistence is added

## Example Usage

Add an expense like this:

- Description: Coffee
- Amount: 180
- Category: Food

The total for the day updates immediately and the entry appears in the history view.

Quick entry also supports a simple format:

```text
Lunch 250
Metro 80
Groceries 540
```

## Notes

This project is a small, personal finance app rather than a full-stack product. It focuses on a lightweight, low-friction workflow for tracking daily spending without unnecessary complexity.

## License

This repository does not currently include an explicit license file. If you plan to distribute or reuse the project publicly, consider adding a license.

## Possible Future Improvements

- recurring expense tracking
- monthly analytics
- CSV export/import
- editable or removable expense entries
- cloud sync and multi-device support
