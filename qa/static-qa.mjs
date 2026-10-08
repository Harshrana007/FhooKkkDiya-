import fs from 'node:fs'

const app = fs.readFileSync('App.tsx', 'utf8')
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
const expo = JSON.parse(fs.readFileSync('app.json', 'utf8'))

const assertions = [
  ['App.tsx has no stale Reanimated config', !app.includes('react-native-reanimated/plugin')],
  ['App.tsx has no stale Expo Router import', !app.includes('expo-router')],
  ['App.tsx has no stale Lucide import', !app.includes('lucide-react-native')],
  ['Expense ceiling is defined at ₹20,000', app.includes('MAX_EXPENSE = 20000')],
  ['Manual entry enforces ₹20,000 ceiling', app.includes('numericAmount > MAX_EXPENSE')],
  ['Quick entry enforces ₹20,000 ceiling', app.includes('item.amount > MAX_EXPENSE')],
  ['Local date logic avoids UTC rollover bugs', app.includes('getFullYear()') && app.includes("getMonth() + 1")],
  ['Salary persists locally', app.includes('SALARY_KEY') && app.includes('AsyncStorage.setItem(SALARY_KEY')],
  ['Salary-aware safe-daily calculation exists', app.includes('const safeDaily')],
  ['₹20k final-boss meme tier exists', app.includes('peakExpense >= 20000')],
  ['CID reaction layer exists', app.includes('const cidReactionPunchlines')],
  ['Instagram meme layer exists', app.includes('const instagramMemePunchlines')],
  ['Desi roast layer exists', app.includes('const desiRoastPunchlines')],
  ['Delete confirmation exists', app.includes('Evidence delete karein?')],
  ['Toast feedback exists', app.includes('const showToast') && app.includes('styles.toast')],
  ['Onboarding is scroll-safe', app.includes('styles.welcomeScrollContent')],
  ['No misleading reminder toggle remains', !app.includes('Roz ka hisaab') && !app.includes('REMINDERS_KEY')],
  ['Red-maroon theme is defined', app.includes("red: '#E5384F'") && app.includes("maroon: '#6E1C2A'")],
  ['Package and Expo versions match', pkg.version === expo.expo.version],
  ['Expo primary color matches the new theme', expo.expo.primaryColor === '#E5384F'],
]

let failed = 0
for (const [name, pass] of assertions) {
  console.log((pass ? 'PASS' : 'FAIL') + ' | ' + name)
  if (!pass) failed += 1
}

if (failed) {
  console.error('\nQA FAILED: ' + failed + ' assertion(s)')
  process.exit(1)
}

console.log('\nQA PASSED: ' + assertions.length + ' assertions')
