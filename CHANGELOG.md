# Changelog

## 1.2.0

### Added
- First-launch monthly salary setup.
- Monthly salary persistence with AsyncStorage.
- Month-to-date spending vs salary percentage.
- Remaining salary calculation.
- Approximate safe daily spending allowance for the remaining days.
- Context-aware salary comments and comedy reactions.
- ₹20,000 per-expense ceiling.
- CID-style reaction punchlines.
- Instagram/Reels-style meme punchlines.
- Expanded Desi roast and Gaali Mode content.
- Animated success toasts.
- Delete confirmation sheet for long-press deletion.
- Accessibility labels/state for bottom navigation.
- Automated product-level QA assertions.
- Red/black/maroon/white Gen-Z visual polish.

### Fixed
- Local-date calculation no longer relies on UTC ISO date slicing for daily expense keys.
- Invalid and oversized manual expense amounts are rejected.
- Oversized quick-entry amounts are rejected.
- Comma-formatted numeric values are accepted.
- Onboarding and quick-entry surfaces are safer with the keyboard open.
- Removed misleading reminder UI that had no notification implementation.
- Removed unused `react-native-safe-area-context` and `react-native-screens` dependencies.
- Fixed a missing comma in the onboarding stylesheet found during release QA.

### Dependency / release notes
- Application version aligned at 1.2.0 in `package.json` and `app.json`.
- Expo primary colour aligned with the red release theme.
- Node engine documented as >=20.18.0.
- Expo SDK 51 remains intentionally frozen for this release; upgrade work should be handled separately and incrementally.

### Known release gate
A fresh EAS Android build and real-device smoke test are still required against the final release commit. Static/product QA is covered by the repository's GitHub Actions checks.
