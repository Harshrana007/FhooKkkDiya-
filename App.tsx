import { useEffect, useMemo, useRef, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Animated, Easing, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SvgXml } from 'react-native-svg'
import { StatusBar } from 'expo-status-bar'

const GUTZ_AVATAR_SVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 128 128\">\n  <defs>\n    <linearGradient id=\"bg\" x1=\"0\" x2=\"1\" y1=\"0\" y2=\"1\"><stop stop-color=\"#191326\"/><stop offset=\"1\" stop-color=\"#090b11\"/></linearGradient>\n  </defs>\n  <rect width=\"128\" height=\"128\" rx=\"32\" fill=\"url(#bg)\"/>\n  <circle cx=\"64\" cy=\"66\" r=\"34\" fill=\"#e9e1ce\"/>\n  <path d=\"M31 54c2-27 14-39 21-42 2 10 6 13 11 5 4 10 10 3 14-9 4 9 10 12 16 1 4 12 12 11 16 3 2 15 1 27-3 40-10-12-21-16-37-16-15 0-28 5-38 18z\" fill=\"#121116\"/>\n  <path d=\"M44 49c3-13 9-19 20-22 12 2 21 8 25 22-7-6-14-9-25-9-9 0-14 3-20 9z\" fill=\"#ffffff\" opacity=\".65\"/>\n  <circle cx=\"53\" cy=\"67\" r=\"5\" fill=\"#17151a\"/>\n  <circle cx=\"76\" cy=\"67\" r=\"5\" fill=\"#17151a\"/>\n  <path d=\"M56 83c5 4 15 4 20 0\" fill=\"none\" stroke=\"#1a171b\" stroke-width=\"3\" stroke-linecap=\"round\"/>\n  <path d=\"M30 78c12 9 21 12 34 13 12 0 23-3 34-12\" fill=\"none\" stroke=\"#0d0d11\" stroke-width=\"11\" stroke-linecap=\"round\"/>\n  <path d=\"M50 99c7 6 20 6 28 0\" fill=\"none\" stroke=\"#0d0d11\" stroke-width=\"6\" stroke-linecap=\"round\"/>\n</svg>"

type Tab = 'today' | 'history' | 'reports' | 'settings'
type Expense = { id: number; amount: number; description: string; category: string; date: string }

const EXPENSES_KEY = '@fhookkdiya/expenses'
const REMINDERS_KEY = '@fhookkdiya/reminders'
const GAALI_MODE_KEY = '@fhookkdiya/gaali-mode'
const WELCOME_KEY = '@fhookkdiya/welcome-seen'
const LEGACY_EXPENSES_KEY = '@spendly/expenses'
const LEGACY_REMINDERS_KEY = '@spendly/reminders'
const LEGACY_WELCOME_KEY = '@spendly/welcome-seen'

const categories = ['Food', 'Chai', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Travel', 'Family', 'Other']
const cleanPunchlines = [
  'Paisa gaya. At least ab pata hai kahan gaya.',
  'Wallet: bhai bas kar. Tu: ek last spend.',
  'Zindagi short hai. Expense list surprisingly long.',
  'Aaj ka mood: kharcha hua, hisaab bhi hua.',
  'Kharcha chhota tha. Bank balance ka reaction bada tha.',
  'Allah jaane paisa kahan jaata hai. FhooKkkDiya jaanta hai.',
  'Kharchon ka hisaab rakho, warna kharchay tumhara hisaab rakh lenge.',
  'Dekho beta, paisa hawa mein nahi gaya. Tumne hi udaaya hai.',
  'Jaanne ki koshish karo: paisa gaya kahan? Saboot yahin pada hai.',
  'Case solved. Culprit: tum.',
]

const gaaliPunchlines = [
  'Abe MC, wallet ko oxygen de de. Har baar shopping pe ghusa deta hai.',
  'Ye le BC, ek aur expense. Ab report khol ke shayari sun.',
  'BC, ₹500 ki chai? Bhai chai thi ya IPO?',
  'MC, ek last spend bol-bol ke poora bazaar khareed liya.',
  'Wah BC wah. Paisa tha hi kitna jo itne confidence se uda diya?',
  'Abe kya kar raha hai MC? Salary ko farewell de raha hai kya?',
  'For fuck\'s sake, kharcha dekh ke calculator bhi resign kar raha hai.',
  'Well shit. Bank balance ne seen kar diya.',
  'Chal MC, entry maar. Kal phir bolenge budget kyun toot gaya.',
  'BC ye expense nahi, emotional damage hai.',
  'Abe yaar, paisa sambhal le. Tu kharchon ka Ashoka nahi hai.',
]

const filmyPunchlines = [
  'Yeh paisa tumse kisne kaha tha ki itna udne ka?',
  'Aaj hisaab hoga. Drama baad mein.',
  'Dialogues bahut ho gaye. Ab receipt dikhao.',
  'Scene simple hai: paisa kam, confidence zyada.',
  'Picture abhi baaki hai, budget pehle hi over hai.',
  'Hero tum ho. Villain bank balance hai.',
  'Entry grand thi. Exit expense ne kar di.',
]

const cidPunchlines = [
  'Kuch toh gadbad hai, Daya. Expense list check karo.',
  'Investigation complete. Paisa missing nahi, kharch hua hai.',
  'Team, sabse pehle last transaction pe focus karo.',
  'Case kaafi serious hai. Suspect khud user hai.',
  'Evidence mil gaya. ₹ amount ne sab bata diya.',
]

const getPunchline = (gaaliMode: boolean, index: number) => {
  const pool = gaaliMode ? [...cleanPunchlines, ...gaaliPunchlines, ...filmyPunchlines, ...cidPunchlines] : [...cleanPunchlines, ...filmyPunchlines, ...cidPunchlines]
  return pool[index % pool.length]
}

const currency = (amount: number) => \`₹\${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}\`
const dateKey = (date: Date) => date.toISOString().slice(0, 10)
const readableDate = (date: Date) => date.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })

export default function App() {
  const today = new Date()
  const todayKey = dateKey(today)

  const [tab, setTab] = useState<Tab>('today')
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Food')
  const [quickEntry, setQuickEntry] = useState(false)
  const [quickText, setQuickText] = useState('')
  const [reminders, setReminders] = useState(true)
  const [gaaliMode, setGaaliMode] = useState(true)
  const [storageReady, setStorageReady] = useState(false)
  const [welcomeVisible, setWelcomeVisible] = useState(false)

  const screenOpacity = useRef(new Animated.Value(1)).current
  const screenY = useRef(new Animated.Value(0)).current
  const welcomeOpacity = useRef(new Animated.Value(0)).current
  const welcomeY = useRef(new Animated.Value(28)).current
  const orbScale = useRef(new Animated.Value(0.9)).current
  const buttonScale = useRef(new Animated.Value(1)).current
  const avatarScale = useRef(new Animated.Value(1)).current

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const [savedExpensesNew, savedRemindersNew, gaaliModeSaved, welcomeSeenNew, savedExpensesLegacy, savedRemindersLegacy, welcomeSeenLegacy] = await Promise.all([
          AsyncStorage.getItem(EXPENSES_KEY),
          AsyncStorage.getItem(REMINDERS_KEY),
          AsyncStorage.getItem(GAALI_MODE_KEY),
          AsyncStorage.getItem(WELCOME_KEY),
          AsyncStorage.getItem(LEGACY_EXPENSES_KEY),
          AsyncStorage.getItem(LEGACY_REMINDERS_KEY),
          AsyncStorage.getItem(LEGACY_WELCOME_KEY),
        ])
        const savedExpenses = savedExpensesNew ?? savedExpensesLegacy
        const savedReminders = savedRemindersNew ?? savedRemindersLegacy
        const welcomeSeen = welcomeSeenNew ?? welcomeSeenLegacy
        if (!mounted) return
        if (savedExpenses) {
          const parsed = JSON.parse(savedExpenses)
          if (Array.isArray(parsed)) {
            setExpenses(parsed)
            if (!savedExpensesNew && parsed.length) {
              AsyncStorage.setItem(EXPENSES_KEY, JSON.stringify(parsed)).catch(() => {})
            }
          }
        }
        if (savedReminders !== null) {
          setReminders(savedReminders === 'true')
          if (savedRemindersNew === null) AsyncStorage.setItem(REMINDERS_KEY, savedReminders).catch(() => {})
        }
        if (gaaliModeSaved !== null) setGaaliMode(gaaliModeSaved === 'true')
        setWelcomeVisible(welcomeSeen !== 'true')
        if (!welcomeSeenNew && welcomeSeenLegacy === 'true') AsyncStorage.setItem(WELCOME_KEY, 'true').catch(() => {})
      } finally {
        if (mounted) setStorageReady(true)
      }
    })()
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    if (!storageReady) return
    AsyncStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses)).catch(() => {})
  }, [expenses, storageReady])

  useEffect(() => {
    if (!storageReady) return
    AsyncStorage.setItem(REMINDERS_KEY, String(reminders)).catch(() => {})
  }, [reminders, storageReady])

  useEffect(() => {
    if (!storageReady) return
    AsyncStorage.setItem(GAALI_MODE_KEY, String(gaaliMode)).catch(() => {})
  }, [gaaliMode, storageReady])

  useEffect(() => {
    screenOpacity.setValue(0)
    screenY.setValue(10)
    Animated.parallel([
      Animated.timing(screenOpacity, { toValue: 1, duration: 300, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(screenY, { toValue: 0, duration: 360, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start()
  }, [tab, screenOpacity, screenY])

  useEffect(() => {
    if (!welcomeVisible) return
    Animated.parallel([
      Animated.timing(welcomeOpacity, { toValue: 1, duration: 620, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.spring(welcomeY, { toValue: 0, friction: 8, tension: 55, useNativeDriver: true }),
    ]).start()
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(orbScale, { toValue: 1.06, duration: 1700, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(orbScale, { toValue: 0.9, duration: 1700, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    )
    pulse.start()
    return () => pulse.stop()
  }, [welcomeVisible, welcomeOpacity, welcomeY, orbScale])

  const press = (value: Animated.Value, target: number) =>
    Animated.spring(value, { toValue: target, friction: 8, tension: 120, useNativeDriver: true }).start()

  const enterApp = () => {
    Animated.parallel([
      Animated.timing(welcomeOpacity, { toValue: 0, duration: 240, useNativeDriver: true }),
      Animated.timing(welcomeY, { toValue: -16, duration: 240, useNativeDriver: true }),
    ]).start(async () => {
      setWelcomeVisible(false)
      await AsyncStorage.setItem(WELCOME_KEY, 'true')
    })
  }

  const triggerAvatar = () => {
    Animated.sequence([
      Animated.spring(avatarScale, { toValue: 1.1, useNativeDriver: true }),
      Animated.spring(avatarScale, { toValue: 1, useNativeDriver: true }),
    ]).start()
  }

  const todayExpenses = expenses.filter(e => e.date === todayKey)
  const total = todayExpenses.reduce((sum, e) => sum + e.amount, 0)
  const allTotal = expenses.reduce((sum, e) => sum + e.amount, 0)

  const categoryTotals = useMemo(
    () => categories.map(name => ({
      name,
      amount: expenses.filter(e => e.category === name).reduce((sum, e) => sum + e.amount, 0),
    })).filter(item => item.amount > 0).sort((a, b) => b.amount - a.amount),
    [expenses],
  )

  const addExpense = () => {
    const numericAmount = Number(amount)
    if (!description.trim() || !Number.isFinite(numericAmount) || numericAmount <= 0) return
    setExpenses(current => [{
      id: Date.now(),
      description: description.trim(),
      amount: numericAmount,
      category,
      date: todayKey,
    }, ...current])
    setDescription('')
    setAmount('')
  }

  const deleteExpense = (id: number) => {
    setExpenses(current => current.filter(e => e.id !== id))
  }

  const addQuickExpenses = () => {
    const parsed = quickText.split(/[\n,]+/).map(s => s.trim()).filter(Boolean).map(entry => {
      const match = entry.match(/^(.*?)[\s-:–—]*(\d+(?:\.\d{1,2})?)$/)
      return match ? { description: match[1].trim(), amount: Number(match[2]) } : null
    })
    if (!parsed.length || parsed.some(item => !item?.description || !item.amount)) return
    setExpenses(current => [
      ...parsed.map((item, i) => ({ id: Date.now() + i, description: item!.description, amount: item!.amount, category: 'Other', date: todayKey })),
      ...current,
    ])
    setQuickText('')
    setQuickEntry(false)
  }

  if (!storageReady) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar style="light" />
        <View style={styles.boot}>
          <View style={styles.logoMark}><Text style={styles.logoText}>₹</Text></View>
          <Text style={styles.bootTitle}>FhooKkkDiya</Text>
          <Text style={styles.bootCopy}>Paisa ka post-mortem set ho raha hai...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (welcomeVisible) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar style="light" />
        <View style={styles.welcomeScreen}>
          <Animated.View pointerEvents="none" style={[styles.orb, { transform: [{ scale: orbScale }] }]} />
          <Animated.View pointerEvents="none" style={[styles.orb2, { transform: [{ scale: orbScale }] }]} />
          <Animated.View style={[styles.welcomeContent, { opacity: welcomeOpacity, transform: [{ translateY: welcomeY }] }]}>
            <TouchableOpacity onPress={triggerAvatar} activeOpacity={0.9}>
              <Animated.View style={[styles.avatarLargeWrap, { transform: [{ scale: avatarScale }] }]}>
                <SvgXml xml={GUTZ_AVATAR_SVG} width="112" height="112" />
              </Animated.View>
            </TouchableOpacity>

            <Text style={styles.kicker}>PRIVATE EXPENSE TRACKER • NO BAKWAAS</Text>
            <Text style={styles.welcomeTitle}>Hi Gutz Bhoiii.</Text>
            <Text style={styles.welcomeAccent}>FhooKkkDiya mein khush aamdeed.</Text>
            <Text style={styles.welcomeCopy}>
              Welcome! Pehle hi bata do, khud ki marzi se aaye ho ya bank balance dekh ke rona aa raha tha?
            </Text>
            <View style={styles.quoteCard}>
              <Text style={styles.quoteKicker}>AAGEY KA SAMPLE</Text>
              <Text style={styles.quoteText}>“BC, paisa toh tha hi nahi... phir yeh expense kaise aa gaya?”</Text>
            </View>

            <View style={styles.pills}>
              {['LOCAL', 'PRIVATE', 'SARCASTIC'].map(label => (
                <View key={label} style={styles.pill}><Text style={styles.pillText}>{label}</Text></View>
              ))}
            </View>

            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <TouchableOpacity
                style={styles.enterButton}
                activeOpacity={0.92}
                onPressIn={() => press(buttonScale, 0.97)}
                onPressOut={() => press(buttonScale, 1)}
                onPress={enterApp}
              >
                <Text style={styles.enterText}>Chalo paisa ginte hain</Text>
                <Text style={styles.enterArrow}>→</Text>
              </TouchableOpacity>
            </Animated.View>

            <Text style={styles.welcomeFoot}>Data local storage mein. App band karo, drama band nahi hoga.</Text>
          </Animated.View>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <View style={styles.app}>
        <View style={styles.header}>
          <TouchableOpacity onPress={triggerAvatar} activeOpacity={0.9} style={styles.avatarSmallWrap}>
            <SvgXml xml={GUTZ_AVATAR_SVG} width="46" height="46" />
          </TouchableOpacity>
          <View style={styles.headerCopy}>
            <Text style={styles.kicker}>GUTZ BHOIII • MONEY FILES</Text>
            <Text style={styles.brand}>FhooKkkDiya</Text>
          </View>
          <View style={styles.liveDot} />
        </View>

        <Animated.View style={[styles.screen, { opacity: screenOpacity, transform: [{ translateY: screenY }] }]}>
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            {tab === 'today' && (
              <>
                <View style={styles.rowBetween}>
                  <View style={styles.flex}>
                    <Text style={styles.kicker}>AAJ KA HAAL</Text>
                    <Text style={styles.title}>{readableDate(today)}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setQuickEntry(true)} style={styles.quickButton}>
                    <Text style={styles.quickText}>Jaldi se daal</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.hero}>
                  <View style={styles.heroGlow} />
                  <Text style={styles.label}>AAJ KITNA UDAA?</Text>
                  <Text style={styles.total}>{currency(total)}</Text>
                  <Text style={styles.heroSub}>{todayExpenses.length ? \`\${todayExpenses.length} kharcha\${todayExpenses.length === 1 ? '' : 'y'} recorded\` : 'Aaj abhi tak paisa zinda hai. Mashallah.'}</Text>
                  <View style={styles.divider} />
                  <Text style={styles.heroHint}>{getPunchline(gaaliMode, todayExpenses.length + expenses.length)}</Text>
                </View>

                <View style={styles.rowBetween}>
                  <Text style={styles.sectionTitle}>Aaj ka qissa</Text>
                  <Text style={styles.muted}>{todayExpenses.length} items</Text>
                </View>

                {todayExpenses.length === 0 ? (
                  <View style={styles.empty}>
                    <Text style={styles.emptyBig}>₹0</Text>
                    <Text style={styles.emptyTitle}>Abhi tak koi barbaadi nahi.</Text>
                    <Text style={styles.muted}>Neeche se pehla kharcha chipkao.</Text>
                  </View>
                ) : (
                  todayExpenses.map(expense => (
                    <TouchableOpacity key={expense.id} activeOpacity={0.86} onLongPress={() => deleteExpense(expense.id)} style={styles.expenseRow}>
                      <View style={styles.expenseIcon}><Text style={styles.expenseIconText}>₹</Text></View>
                      <View style={styles.expenseCopy}>
                        <Text style={styles.expenseName}>{expense.description}</Text>
                        <Text style={styles.muted}>{expense.category} • long press = delete</Text>
                      </View>
                      <Text style={styles.expenseAmount}>{currency(expense.amount)}</Text>
                    </TouchableOpacity>
                  ))
                )}

                <View style={styles.card}>
                  <Text style={styles.sectionTitle}>Kharcha chipka</Text>
                  <Text style={styles.formHint}>Bas sach bol. App judge karega, par silently.</Text>
                  <TextInput value={description} onChangeText={setDescription} placeholder="Kis cheez pe udaaya?" placeholderTextColor={colors.dim} style={styles.input} />
                  <TextInput value={amount} onChangeText={setAmount} keyboardType="decimal-pad" placeholder="Kitne rupaye?" placeholderTextColor={colors.dim} style={styles.input} />
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
                    {categories.map(item => (
                      <TouchableOpacity key={item} onPress={() => setCategory(item)} style={[styles.chip, item === category && styles.chipActive]}>
                        <Text style={[styles.chipText, item === category && styles.chipTextActive]}>{item}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  <TouchableOpacity onPress={addExpense} style={styles.primaryButton}>
                    <Text style={styles.primaryText}>Kharcha chipka</Text><Text style={styles.primaryArrow}>↗</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {tab === 'history' && (
              <>
                <Text style={styles.kicker}>MONEY TRAIL</Text>
                <Text style={styles.title}>Kharchon ka Qissa</Text>
                <View style={styles.miniHero}>
                  <View><Text style={styles.label}>ALL TIME</Text><Text style={styles.miniTotal}>{currency(allTotal)}</Text></View>
                  <View style={styles.badge}><Text style={styles.badgeNum}>{expenses.length}</Text><Text style={styles.muted}>entries</Text></View>
                </View>
                {expenses.map(expense => (
                  <TouchableOpacity key={expense.id} onLongPress={() => deleteExpense(expense.id)} style={styles.expenseRow}>
                    <View style={styles.expenseIcon}><Text style={styles.expenseIconText}>₹</Text></View>
                    <View style={styles.expenseCopy}><Text style={styles.expenseName}>{expense.description}</Text><Text style={styles.muted}>{expense.category} • {expense.date}</Text></View>
                    <Text style={styles.expenseAmount}>{currency(expense.amount)}</Text>
                  </TouchableOpacity>
                ))}
                {!expenses.length && <View style={styles.empty}><Text style={styles.emptyBig}>404</Text><Text style={styles.emptyTitle}>History bhi tumhari tarah shareef hai.</Text><Text style={styles.muted}>Abhi kuch nahi mila.</Text></View>}
              </>
            )}

            {tab === 'reports' && (
              <>
                <Text style={styles.kicker}>PAISA KAHAN GAYA?</Text>
                <Text style={styles.title}>Hisaab</Text>
                <View style={styles.miniHero}>
                  <View><Text style={styles.label}>TOTAL SPENDING</Text><Text style={styles.miniTotal}>{currency(allTotal)}</Text></View>
                  <Text style={styles.muted}>{expenses.length} expenses</Text>
                </View>
                <View style={styles.card}>
                  <Text style={styles.sectionTitle}>Paisa gaya kahan, janaab?</Text>
                  {!categoryTotals.length && <Text style={styles.muted}>Pehle paisa udaao, phir breakdown pe rona.</Text>}
                  {categoryTotals.map(item => (
                    <View key={item.name} style={styles.reportRow}>
                      <View style={styles.rowBetween}><Text style={styles.expenseName}>{item.name}</Text><Text style={styles.muted}>{currency(item.amount)}</Text></View>
                      <View style={styles.track}><View style={[styles.fill, { width: \`\${allTotal ? item.amount / allTotal * 100 : 0}%\` }]} /></View>
                    </View>
                  ))}
                </View>
              </>
            )}

            {tab === 'settings' && (
              <>
                <Text style={styles.kicker}>JUGAAD ZONE</Text>
                <Text style={styles.title}>Jugaad</Text>
                <View style={styles.card}>
                  <View style={styles.rowBetween}>
                    <View style={styles.flex}>
                      <Text style={styles.expenseName}>Roz ka hisaab</Text>
                      <Text style={styles.muted}>Shaam ko yaad dilaana ke paisa phir udd gaya.</Text>
                    </View>
                    <TouchableOpacity onPress={() => setReminders(v => !v)} style={[styles.toggle, reminders && styles.toggleOn]}>
                      <View style={[styles.knob, reminders && styles.knobOn]} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.rowBetween}>
                    <View style={styles.flex}>
                      <Text style={styles.expenseName}>Gaali Mode</Text>
                      <Text style={styles.muted}>MC/BC + desi abuse when the wallet deserves it.</Text>
                    </View>
                    <TouchableOpacity onPress={() => setGaaliMode(v => !v)} style={[styles.toggle, gaaliMode && styles.toggleOn]}>
                      <View style={[styles.knob, gaaliMode && styles.knobOn]} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.divider} />
                  <Text style={styles.sectionTitle}>About FhooKkkDiya</Text>
                  <Text style={styles.muted}>Private, local aur thoda besharam expense tracker. No account. No bank connection. Sirf sach. Gaali Mode optional hai. Wallet ko tameez se bhi daant sakte ho.</Text>
                </View>
              </>
            )}
          </ScrollView>
        </Animated.View>

        <View style={styles.nav}>
          {([
            ['today', 'Aaj Ka Haal', '⌂'],
            ['history', 'Qissa', '▤'],
            ['reports', 'Hisaab', '◒'],
            ['settings', 'Jugaad', '⚙'],
          ] as const).map(([key, label, icon]) => (
            <TouchableOpacity key={key} onPress={() => setTab(key)} style={styles.navItem}>
              <Text style={[styles.navIcon, tab === key && styles.active]}>{icon}</Text>
              <Text style={[styles.navLabel, tab === key && styles.active]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {quickEntry && (
          <View style={styles.modalBackdrop}>
            <View style={styles.modal}>
              <View style={styles.modalHandle} />
              <Text style={styles.title}>Jaldi se daal</Text>
              <Text style={styles.muted}>Ek line mein ek barbaadi. Example: Chai 120. Galti se 12000 mat likh dena, hum judge karenge.</Text>
              <TextInput autoFocus multiline value={quickText} onChangeText={setQuickText} placeholder={'Chai 120\nMetro 80'} placeholderTextColor={colors.dim} style={[styles.input, styles.quickInput]} />
              <View style={styles.modalActions}>
                <TouchableOpacity onPress={() => setQuickEntry(false)} style={styles.secondaryButton}><Text style={styles.secondaryText}>Rehne de</Text></TouchableOpacity>
                <TouchableOpacity onPress={addQuickExpenses} style={styles.primaryButton}><Text style={styles.primaryText}>Add all</Text><Text style={styles.primaryArrow}>↗</Text></TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  )
}

const colors = {
  bg: '#07080B',
  surface: '#0E1118',
  surface2: '#121621',
  border: '#202636',
  text: '#F7F8FC',
  muted: '#8C93A3',
  dim: '#62697A',
  purple: '#9B7CFF',
  purpleSoft: '#201A35',
  mint: '#4CE1B6',
  white: '#FFFFFF',
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  app: { flex: 1, backgroundColor: colors.bg },
  boot: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
  bootTitle: { marginTop: 14, color: colors.text, fontSize: 25, fontWeight: '900' },
  bootCopy: { marginTop: 7, color: colors.muted, fontSize: 13 },
  logoMark: { width: 62, height: 62, borderRadius: 21, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.purple },
  logoText: { color: colors.white, fontSize: 29, fontWeight: '900' },

  welcomeScreen: { flex: 1, justifyContent: 'center', padding: 25, overflow: 'hidden', backgroundColor: colors.bg },
  orb: { position: 'absolute', width: 340, height: 340, borderRadius: 170, backgroundColor: colors.purple, opacity: 0.12, right: -130, top: -110 },
  orb2: { position: 'absolute', width: 260, height: 260, borderRadius: 130, backgroundColor: colors.mint, opacity: 0.07, left: -140, bottom: -100 },
  welcomeContent: { width: '100%' },
  avatarLargeWrap: { width: 112, height: 112, borderRadius: 56, overflow: 'hidden', borderWidth: 2, borderColor: '#44376C', backgroundColor: '#151925', marginBottom: 18 },
  quoteCard: { marginTop: 16, padding: 15, borderRadius: 17, backgroundColor: '#0E1118', borderWidth: 1, borderColor: '#2A3040' },
  quoteKicker: { color: colors.mint, fontSize: 8, fontWeight: '900', letterSpacing: 1.5, marginBottom: 7 },
  quoteText: { color: '#D6D1E8', fontSize: 13.5, lineHeight: 20, fontWeight: '800' },

  avatarSmallWrap: { width: 46, height: 46, borderRadius: 23, overflow: 'hidden', borderWidth: 1, borderColor: '#3A315B' },

  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 21, paddingTop: 15, paddingBottom: 11 },
  headerCopy: { flex: 1, marginLeft: 11 },
  kicker: { color: '#7B8292', fontSize: 9, letterSpacing: 1.5, fontWeight: '900' },
  brand: { color: colors.text, fontSize: 22, fontWeight: '900', marginTop: 2 },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.mint },
  content: { padding: 21, paddingBottom: 30, gap: 17 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  flex: { flex: 1 },
  title: { color: colors.text, fontSize: 29, lineHeight: 34, fontWeight: '900', letterSpacing: -0.8, marginTop: 5 },
  welcomeTitle: { color: colors.text, fontSize: 42, lineHeight: 46, fontWeight: '900', letterSpacing: -1.4 },
  welcomeAccent: { color: '#C9BCFF', fontSize: 24, lineHeight: 30, fontWeight: '800', marginTop: 3 },
  welcomeCopy: { color: colors.muted, fontSize: 15, lineHeight: 23, marginTop: 16, maxWidth: 420 },
  pills: { flexDirection: 'row', gap: 8, marginTop: 21, marginBottom: 27 },
  pill: { paddingHorizontal: 10, paddingVertical: 7, borderRadius: 20, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border },
  pillText: { color: '#AAB0BF', fontSize: 9, fontWeight: '900', letterSpacing: 1.1 },
  enterButton: { minHeight: 58, borderRadius: 18, backgroundColor: colors.purple, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 19 },
  enterText: { color: colors.white, fontSize: 15, fontWeight: '900' },
  enterArrow: { color: colors.white, fontSize: 22, fontWeight: '900' },
  welcomeFoot: { textAlign: 'center', color: '#555D6C', fontSize: 11, marginTop: 13 },

  quickButton: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  quickText: { color: '#C1B2FF', fontSize: 12, fontWeight: '900' },
  hero: { position: 'relative', overflow: 'hidden', backgroundColor: colors.surface2, borderRadius: 25, padding: 22, borderWidth: 1, borderColor: '#282F40' },
  heroGlow: { position: 'absolute', width: 180, height: 180, borderRadius: 90, backgroundColor: colors.purple, opacity: 0.1, right: -70, top: -80 },
  label: { color: '#848B9B', fontSize: 9, fontWeight: '900', letterSpacing: 1.6 },
  total: { color: colors.text, fontSize: 43, fontWeight: '900', letterSpacing: -1.3, marginVertical: 7 },
  heroSub: { color: '#A1A8B7', fontSize: 13 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 17 },
  heroHint: { color: '#8D95A6', fontSize: 11, fontWeight: '800' },
  sectionTitle: { color: colors.text, fontSize: 17, fontWeight: '900' },
  muted: { color: colors.muted, fontSize: 12.5, lineHeight: 19 },
  empty: { alignItems: 'center', paddingVertical: 30, borderRadius: 20, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.border, backgroundColor: '#090C11' },
  emptyBig: { color: '#B8ACFF', fontSize: 30, fontWeight: '900' },
  emptyTitle: { color: colors.text, marginTop: 7, marginBottom: 4, fontWeight: '900' },
  expenseRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 7 },
  expenseIcon: { width: 41, height: 41, borderRadius: 13, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  expenseIconText: { color: colors.mint, fontWeight: '900' },
  expenseCopy: { flex: 1, marginLeft: 12 },
  expenseName: { color: colors.text, fontSize: 14, fontWeight: '900' },
  expenseAmount: { color: colors.text, fontSize: 14, fontWeight: '900' },
  card: { backgroundColor: colors.surface, borderRadius: 20, padding: 17, borderWidth: 1, borderColor: colors.border, gap: 13 },
  formHint: { color: colors.dim, fontSize: 11 },
  input: { borderRadius: 13, borderWidth: 1, borderColor: colors.border, backgroundColor: '#0A0D13', color: colors.text, paddingHorizontal: 14, paddingVertical: 13, fontSize: 14 },
  chips: { gap: 7 },
  chip: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: '#222838', backgroundColor: '#151923' },
  chipActive: { backgroundColor: colors.purpleSoft, borderColor: '#54448B' },
  chipText: { color: '#7D8493', fontSize: 12 },
  chipTextActive: { color: '#D0C6FF', fontWeight: '900' },
  primaryButton: { flex: 1, minHeight: 48, borderRadius: 13, backgroundColor: colors.purple, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 },
  primaryText: { color: colors.white, fontWeight: '900' },
  primaryArrow: { color: colors.white, fontSize: 17, fontWeight: '900' },
  miniHero: { backgroundColor: colors.surface2, borderRadius: 20, borderWidth: 1, borderColor: colors.border, padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  miniTotal: { color: colors.text, fontSize: 31, fontWeight: '900', marginTop: 4 },
  badge: { width: 62, height: 62, borderRadius: 20, backgroundColor: colors.purpleSoft, borderWidth: 1, borderColor: '#463773', alignItems: 'center', justifyContent: 'center' },
  badgeNum: { color: colors.purple, fontSize: 18, fontWeight: '900' },
  reportRow: { gap: 8 },
  track: { height: 8, borderRadius: 5, overflow: 'hidden', backgroundColor: '#1A1F2A' },
  fill: { height: 8, borderRadius: 5, backgroundColor: colors.purple },
  toggle: { width: 48, height: 28, borderRadius: 16, padding: 3, justifyContent: 'center', backgroundColor: '#252A37' },
  toggleOn: { backgroundColor: colors.purple },
  knob: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#F2F3F7' },
  knobOn: { alignSelf: 'flex-end' },
  nav: { flexDirection: 'row', paddingTop: 9, paddingBottom: 7, backgroundColor: '#090C12', borderTopWidth: 1, borderTopColor: colors.border },
  navItem: { flex: 1, alignItems: 'center', gap: 3 },
  navIcon: { fontSize: 18, color: '#61687A' },
  navLabel: { fontSize: 10, fontWeight: '900', color: '#61687A' },
  active: { color: colors.purple },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(2,3,7,0.82)', justifyContent: 'flex-end' },
  modal: { backgroundColor: '#0C1017', padding: 22, borderTopLeftRadius: 27, borderTopRightRadius: 27, borderWidth: 1, borderColor: colors.border, gap: 13 },
  modalHandle: { width: 42, height: 4, borderRadius: 2, backgroundColor: '#3A4050', alignSelf: 'center', marginBottom: 2 },
  quickInput: { minHeight: 125, textAlignVertical: 'top' },
  modalActions: { flexDirection: 'row', gap: 10 },
  secondaryButton: { flex: 1, minHeight: 48, borderRadius: 13, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' },
  secondaryText: { color: '#BEB0FF', fontWeight: '900' },
})
