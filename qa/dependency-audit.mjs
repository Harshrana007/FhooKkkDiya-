import fs from 'node:fs'

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
const app = fs.readFileSync('App.tsx', 'utf8')

const deps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) }

const required = [
  'expo',
  'react',
  'react-native',
  '@react-native-async-storage/async-storage',
  'expo-status-bar',
  'react-native-svg',
]

const removed = [
  'expo-router',
  'lucide-react-native',
  'react-native-reanimated',
  'react-native-safe-area-context',
  'react-native-screens',
]

const checks = [
  ...required.map(name => ['Required dependency present: ' + name, Boolean(deps[name])]),
  ...removed.map(name => ['Unused/removed dependency absent: ' + name, !deps[name] && !app.includes(name)]),
  ['React version is 18.2.0 for SDK 51 release', pkg.dependencies?.react === '18.2.0'],
  ['React Native version is 0.74.5 for SDK 51 release', pkg.dependencies?.['react-native'] === '0.74.5'],
  ['react-native-svg pinned to 15.2.0', pkg.dependencies?.['react-native-svg'] === '15.2.0'],
  ['AsyncStorage pinned to 1.23.1', pkg.dependencies?.['@react-native-async-storage/async-storage'] === '1.23.1'],
  ['Node runtime is documented', pkg.engines?.node === '>=20.18.0'],
  ['TypeScript compiler is pinned for CI', pkg.devDependencies?.typescript === '5.3.3'],
  ['React type definitions are pinned', pkg.devDependencies?.['@types/react'] === '18.2.79'],
  ['React DOM type definitions are pinned', pkg.devDependencies?.['@types/react-dom'] === '18.2.25'],
  ['No stale Reanimated Babel config', !fs.readFileSync('babel.config.js', 'utf8').includes('react-native-reanimated/plugin')],
]

let failed = 0
for (const [name, pass] of checks) {
  console.log((pass ? 'PASS' : 'FAIL') + ' | ' + name)
  if (!pass) failed += 1
}

if (failed) {
  console.error('\nDEPENDENCY AUDIT FAILED: ' + failed + ' check(s)')
  process.exit(1)
}

console.log('\nDEPENDENCY AUDIT PASSED: ' + checks.length + ' checks')
