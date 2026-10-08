import fs from 'node:fs'

const app = fs.readFileSync('App.tsx', 'utf8')
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
const expo = JSON.parse(fs.readFileSync('app.json', 'utf8'))

const styleStart = app.indexOf('const styles = StyleSheet.create({')
const styleRefs = [...new Set([...app.matchAll(/styles\\.([A-Za-z0-9_]+)/g)].map(match => match[1]))]
const styleKeys = styleStart >= 0
  ? [...new Set([...app.slice(styleStart).matchAll(/^\\s{2}([A-Za-z0-9_]+):/gm)].map(match => match[1]))]
  : []
const missingStyles = styleRefs.filter(name => !styleKeys.includes(name))

const punchlineStart = app.indexOf('const getPunchline')
const punchlineEnd = app.indexOf('const currency', punchlineStart)
const punchlineBody = punchlineStart >= 0 && punchlineEnd > punchlineStart
  ? app.slice(punchlineStart, punchlineEnd)
  : ''


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
  ['Opening logo matches launcher asset', app.includes("require('./assets/app-icon.png')") && app.includes('styles.bootLogo') && app.includes('bootLogoScale')],
  ['Onboarding crash fix: punchline helper has no component-local date calculation', !punchlineBody.includes('today.getFullYear') && !punchlineBody.includes('today.getMonth') && !punchlineBody.includes('today.getDate')],
  ['Onboarding crash fix: punchline helper has no component-local salaryRemaining reference', !punchlineBody.includes('salaryRemaining')],
  ['Expense update flow exists', app.includes('const updateExpense = () =>') && app.includes('onPress={() => startEditExpense(expense)}')],
  ['Expense edit modal exists', app.includes('Expense edit karo') && app.includes('Save changes')],
  ['Salary update flow exists', app.includes('const saveSalary = (raw: string)')],
  ['Salary delete/reset flow exists', app.includes('const resetSalary = () =>') && app.includes('Reset salary')],
  ['No misleading reminder toggle remains', !app.includes('Roz ka hisaab') && !app.includes('REMINDERS_KEY')],
  ['Every styles.* reference has a StyleSheet key', missingStyles.length === 0],
  ['No orphaned delete handler remains', !app.includes('deleteExpense(')],
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
