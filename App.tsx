import { useEffect, useMemo, useRef, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Alert, Animated, Easing, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SvgXml } from 'react-native-svg'
import { StatusBar } from 'expo-status-bar'

const GUTZ_AVATAR_SVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 128 128\">\n  <defs>\n    <linearGradient id=\"bg\" x1=\"0\" x2=\"1\" y1=\"0\" y2=\"1\"><stop stop-color=\"#191326\"/><stop offset=\"1\" stop-color=\"#090b11\"/></linearGradient>\n  </defs>\n  <rect width=\"128\" height=\"128\" rx=\"32\" fill=\"url(#bg)\"/>\n  <circle cx=\"64\" cy=\"66\" r=\"34\" fill=\"#e9e1ce\"/>\n  <path d=\"M31 54c2-27 14-39 21-42 2 10 6 13 11 5 4 10 10 3 14-9 4 9 10 12 16 1 4 12 12 11 16 3 2 15 1 27-3 40-10-12-21-16-37-16-15 0-28 5-38 18z\" fill=\"#121116\"/>\n  <path d=\"M44 49c3-13 9-19 20-22 12 2 21 8 25 22-7-6-14-9-25-9-9 0-14 3-20 9z\" fill=\"#ffffff\" opacity=\".65\"/>\n  <circle cx=\"53\" cy=\"67\" r=\"5\" fill=\"#17151a\"/>\n  <circle cx=\"76\" cy=\"67\" r=\"5\" fill=\"#17151a\"/>\n  <path d=\"M56 83c5 4 15 4 20 0\" fill=\"none\" stroke=\"#1a171b\" stroke-width=\"3\" stroke-linecap=\"round\"/>\n  <path d=\"M30 78c12 9 21 12 34 13 12 0 23-3 34-12\" fill=\"none\" stroke=\"#0d0d11\" stroke-width=\"11\" stroke-linecap=\"round\"/>\n  <path d=\"M50 99c7 6 20 6 28 0\" fill=\"none\" stroke=\"#0d0d11\" stroke-width=\"6\" stroke-linecap=\"round\"/>\n</svg>"

const svgWithColor = (xml: string, color: string) => xml.replace(/CURRENT_COLOR/g, color)

const SvgIcon = ({ xml, size = 20, color = '#61687A' }: { xml: string; size?: number; color?: string }) => (
  <SvgXml xml={svgWithColor(xml, color)} width={size} height={size} />
)

const ICON_HOME = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="CURRENT_COLOR" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
  <path d="M3 10.8 12 3l9 7.8"/>
  <path d="M5.5 9.8V21h13V9.8"/>
  <path d="M9.5 21v-6h5v6"/>
</svg>`

const ICON_HISTORY = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="CURRENT_COLOR" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
  <path d="M6 4.5h12v15H6z"/>
  <path d="M9 8h6M9 12h6M9 16h4"/>
</svg>`

const ICON_REPORTS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="CURRENT_COLOR" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
  <path d="M5 19V9M12 19V5M19 19v-7"/>
  <path d="M3.5 19.5h17"/>
</svg>`

const ICON_SETTINGS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="CURRENT_COLOR" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="3.2"/>
  <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.07.07-1.95 1.95-.07-.07A1.7 1.7 0 0 0 15.92 18a1.7 1.7 0 0 0-1 1.55v.1h-2.76v-.1A1.7 1.7 0 0 0 11.08 18a1.7 1.7 0 0 0-1.87.34l-.07.07-1.95-1.95.07-.07A1.7 1.7 0 0 0 7.6 15a1.7 1.7 0 0 0-1.55-1H5.9v-2.76H6A1.7 1.7 0 0 0 7.6 10a1.7 1.7 0 0 0-.34-1.87l-.07-.07 1.95-1.95.07.07A1.7 1.7 0 0 0 11.08 6a1.7 1.7 0 0 0 1-1.55v-.1h2.76v.1A1.7 1.7 0 0 0 15.92 6a1.7 1.7 0 0 0 1.87-.34l.07-.07 1.95 1.95-.07.07A1.7 1.7 0 0 0 19.4 10a1.7 1.7 0 0 0 1.55 1h.1v2.76h-.1a1.7 1.7 0 0 0-1.55 1.24Z"/>
</svg>`

const ICON_MONEY = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="CURRENT_COLOR" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
  <rect x="3" y="6" width="18" height="12" rx="2.2"/>
  <circle cx="12" cy="12" r="2.8"/>
  <path d="M7 9.2h.01M17 14.8h.01"/>
</svg>`

const ICON_ARROW = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="CURRENT_COLOR" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M5 12h13"/>
  <path d="m13 6 6 6-6 6"/>
</svg>`

const ICON_ADD = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="CURRENT_COLOR" stroke-width="2.1" stroke-linecap="round">
  <path d="M12 5v14M5 12h14"/>
</svg>`

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

// The comedy engine intentionally uses original lines inspired by familiar Indian-comedy
// archetypes and meme culture rather than reproducing movie dialogue verbatim.
const cleanPunchlines = [
  'Paisa gaya. At least is baar culprit pakda gaya: tum.',
  'Wallet ne meeting bulayi hai. Agenda: tumhara questionable behaviour.',
  'Kharcha hua. Hisaab hua. Regret pending hai.',
  'Aaj ka budget dekh ke calculator bhi keh raha hai: main chalta hoon.',
  'Money left the chat. Tumne usko khud kick maara.',
  'Financial planning ka trailer aa gaya. Picture disaster hai.',
  'Paisa hawa mein nahi gaya. Tumne usse personally escort kiya.',
  'Aaj ka financial strategy: dekhte hain kya hota hai. Famous last words.',
  'Account balance ne tumhe disappoint nahi kiya. Tumne usse disappoint kiya.',
  'Expense list lambi hoti ja rahi hai. Kahani abhi baaki hai.',
  'Budget tha. Phir tum aaye.',
  'Wallet: ek last spend. Tum: bilkul. Also wallet: jhooth bol raha hai.',
  'Ye kharcha chhota hai. Collective trauma nahi.',
  'Aaj sirf paisa nahi gaya. Self-respect ka bhi ek hissa gaya.',
  'Case solved. Suspect tum. Evidence expenses mein padha hai.',
]

const gaaliPunchlines = [
  'Abe MC, wallet ko ICU kyun bhej raha hai?',
  'BC, ye kharcha hai ya account pe personal attack?',
  'MC, ek last spend bolte bolte poora bazaar khareed liya.',
  'For fuck\'s sake, calculator bhi tumse distance maintain kar raha hai.',
  'BC, budget ko funeral mein bhi tum hi late aaye ho.',
  'Abe kya kar raha hai? Salary ko farewell tour pe bhej diya kya?',
  'Well shit. Bank balance ne tumhara number block kar diya.',
  'Chal MC, receipt sambhal. Kal isi se khud ko roast karenge.',
  'BC ye financial planning nahi, organised bakchodi hai.',
  'Abe yaar, paisa sambhal le. Tu RBI ka secret sponsor nahi hai.',
  'MC, ₹500 ki chai ko itna emotional support kisne diya?',
  'BC, account balance dekh ke lag raha hai kisi ne loot liya. Phir yaad aaya: tum hi the.',
  'Fuck me, teesra expense bhi aa gaya. Tum rukega kab?',
  'Abe BC, paisa bachana tha. Tumne usko freedom de di.',
  'MC, ye spending streak tod de. Medal koi nahi de raha.',
  'BC, wallet ki beizzati ki bhi koi limit hoti hai.',
  'For fuck\'s sake, tum expense track nahi kar rahe. Tum evidence collect kar rahe ho.',
  'Abe kya hustle hai bhai? Paisa aata hai aur turant gaayab ho jaata hai.',
]

const comedyCinemaPunchlines = [
  'Baburao energy detected. Paisa kam, tension unlimited.',
  'Plan aisa bana tha jaise duniya jeetni hai. Result: ₹0 savings.',
  'Raju-level confidence. Account-level tragedy.',
  'Welcome committee ne spending approve kar di. Committee tum khud the.',
  'Majnu-level commitment: ek baar shopping shuru, phir seedha financial disaster.',
  'Dhamaal ho gaya. Expense bhi aaya aur explanation bhi nahi.',
  'Golmaal hai bhai. Paisa gaya, reason abhi missing hai.',
  'Hungama complete. Teen expenses, paanch explanations, zero accountability.',
  'Priyadarshan-level confusion: kharcha kisne kiya? Tum. Kya kharida? Accha sawaal.',
  'Garam Masala situation: ek expense ko do bana diya, do ko chaar.',
  'Chup Chup Ke spending pakdi gayi. Wallet sab dekh raha tha.',
  'Bhagam Bhag mode: paisa bhaaga, tum uske peeche.',
  'Fukrey economics: plan solid, budget imaginary.',
  'Comedy classic nahi, financial tragedy hai.',
  'Scene itna chaotic hai ki side character bhi budget advice de raha hai.',
  'Aaj ka plot twist: tumne phir se "sirf dekhne" jaake khareed liya.',
  'Director ne cut bola tha. Tumne card swipe kar diya.',
  'Background music dramatic hai. Expense real hai.',
  'Paisa gaya aur tumne acting shuru kar di: "yeh toh zaroori tha".',
  'Interval aa gaya. Hero ka balance already interval pe hai.',
]

const deadpanPunchlines = [
  'Excellent. Very responsible.',
  'Outstanding financial decision. Truly inspiring.',
  'Management would like to know why.',
  'Congratulations. Money has been converted into vibes.',
  'Very nice. Exactly what the budget needed.',
  'This expense has been reviewed by absolutely nobody and approved by you.',
  'We have examined the transaction. The transaction is stupid.',
  'Financially speaking, this is certainly a choice.',
  'Your wallet has requested a second opinion.',
  'No further questions. The receipt is embarrassing enough.',
  'Strong move. Terrible move. But strong.',
  'Everything is under control. There is no control.',
]

const getPunchline = (gaaliMode: boolean, index: number, total: number, count: number) => {
  const dynamic = [
    ...(total >= 10000 ? [
      '₹' + total.toLocaleString('en-IN') + ' already? Bhai ye expense tracker hai, IPL auction nahi.',
      '₹' + total.toLocaleString('en-IN') + ' ka nuksaan dekh ke accountant ne chai mangwa li.',
      '₹' + total.toLocaleString('en-IN') + ' uda diye. Bank balance ab witness protection mein hai.',
    ] : []),
    ...(total >= 5000 ? [
      '₹' + total.toLocaleString('en-IN') + ' today. Budget ne ab tumhe block kar diya hai.',
      'Five-thousand-plus club. Membership free thi, dignity nahi.',
    ] : []),
    ...(count >= 5 ? [
      count + ' expenses today. Bhai tu shopping nahi, side quest spam kar raha hai.',
      count + ' entries. Wallet ko aaj ka attendance award de do.',
      'Itne kharche? Spreadsheet bhi tumse breakup karegi.',
    ] : []),
    ...(count >= 3 ? [
      'Third expense detected. Coincidence naam ki cheez ab irrelevant hai.',
      'Teen kharche already. Lagta hai wallet ne resignation notice de diya.',
    ] : []),
  ]

  const pool = gaaliMode
    ? [...dynamic, ...cleanPunchlines, ...gaaliPunchlines, ...comedyCinemaPunchlines, ...deadpanPunchlines]
    : [...dynamic, ...cleanPunchlines, ...comedyCinemaPunchlines, ...deadpanPunchlines]

  return pool[index % pool.length]
}

const currency = (amount: number) => `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
const dateKey = (date: Date) => date.toISOString().slice(0, 10)
const readableDate = (date: Date) => date.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })

export default function App() {
  const today = new Date()
  const todayKey = dateKey(today)

  const [tab, setTab] = useState<Tab>('today')
  const [visibleTab, setVisibleTab] = useState<Tab>('today')
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
  const screenX = useRef(new Animated.Value(0)).current
  const scrollRef = useRef<ScrollView | null>(null)
  const firstTabRender = useRef(true)
  const welcomeOpacity = useRef(new Animated.Value(0)).current
  const welcomeY = useRef(new Animated.Value(28)).current
  const orbScale = useRef(new Animated.Value(0.9)).current
  const orbOpacity = useRef(new Animated.Value(0.35)).current
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
      } catch {
        if (mounted) {
          Alert.alert('Storage error', 'Saved expenses could not be loaded. Your existing entries have not been changed.')
          setWelcomeVisible(true)
        }
      } finally {
        if (mounted) setStorageReady(true)
      }
    })()
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    if (!storageReady) return
    AsyncStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses)).catch(() => {
      Alert.alert('Storage error', 'Your latest expense could not be saved locally.')
    })
  }, [expenses, storageReady])

  useEffect(() => {
    if (!storageReady) return
    AsyncStorage.setItem(REMINDERS_KEY, String(reminders)).catch(() => {
      Alert.alert('Storage error', 'Your reminder setting could not be saved locally.')
    })
  }, [reminders, storageReady])

  useEffect(() => {
    if (!storageReady) return
    AsyncStorage.setItem(GAALI_MODE_KEY, String(gaaliMode)).catch(() => {
      Alert.alert('Storage error', 'Gaali Mode setting could not be saved locally.')
    })
  }, [gaaliMode, storageReady])

  useEffect(() => {
    if (firstTabRender.current) {
      firstTabRender.current = false
      return
    }

    let cancelled = false
    screenOpacity.stopAnimation()
    screenY.stopAnimation()
    screenX.stopAnimation()

    Animated.parallel([
      Animated.timing(screenOpacity, { toValue: 0, duration: 150, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
      Animated.timing(screenX, { toValue: -10, duration: 170, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
    ]).start(({ finished }) => {
      if (!finished || cancelled) return
      setVisibleTab(tab)
      screenY.setValue(7)
      screenX.setValue(10)
      Animated.parallel([
        Animated.timing(screenOpacity, { toValue: 1, duration: 260, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(screenY, { toValue: 0, duration: 280, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(screenX, { toValue: 0, duration: 300, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]).start()
      scrollRef.current?.scrollTo({ y: 0, animated: true })
    })

    return () => {
      cancelled = true
    }
  }, [tab, screenOpacity, screenY, screenX])

  useEffect(() => {
    if (!welcomeVisible) return
    Animated.parallel([
      Animated.timing(welcomeOpacity, { toValue: 1, duration: 620, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.spring(welcomeY, { toValue: 0, friction: 8, tension: 55, useNativeDriver: true }),
    ]).start()
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(orbScale, { toValue: 1.06, duration: 1700, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(orbOpacity, { toValue: 0.62, duration: 1700, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(orbScale, { toValue: 0.9, duration: 1700, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(orbOpacity, { toValue: 0.35, duration: 1700, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ]),
      ]),
    )
    pulse.start()
    return () => pulse.stop()
  }, [welcomeVisible, welcomeOpacity, welcomeY, orbScale, orbOpacity])

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
    if (!description.trim() || !Number.isFinite(numericAmount) || numericAmount <= 0) {
      Alert.alert('Check your entry', 'Add a description and an amount greater than ₹0.')
      return
    }
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
    if (!parsed.length || parsed.some(item => !item?.description || !item.amount)) {
      Alert.alert('Could not read entries', 'Use a format like Lunch 250, one expense per line.')
      return
    }
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
          <View style={styles.logoMark}><SvgIcon xml={ICON_MONEY} size={30} color={colors.white} /></View>
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
          <Animated.View pointerEvents="none" style={[styles.orb, { opacity: orbOpacity, transform: [{ scale: orbScale }] }]} />
          <Animated.View pointerEvents="none" style={[styles.orb2, { opacity: Animated.multiply(orbOpacity, 0.7), transform: [{ scale: orbScale }] }]} />
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
                <SvgIcon xml={ICON_ARROW} size={21} color={colors.white} />
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

        <KeyboardAvoidingView
          style={styles.keyboardArea}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}
        >
          <Animated.View style={[styles.screen, { opacity: screenOpacity, transform: [{ translateY: screenY }, { translateX: screenX }] }]}>
          <ScrollView
            ref={scrollRef}
            style={styles.scroll}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            bounces
            removeClippedSubviews={false}
          >
            {visibleTab === 'today' && (
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
                  <Text style={styles.heroSub}>{todayExpenses.length ? `${todayExpenses.length} kharcha${todayExpenses.length === 1 ? '' : 'y'} recorded` : 'Aaj abhi tak paisa zinda hai. Mashallah.'}</Text>
                  <View style={styles.divider} />
                  <Text style={styles.heroHint}>{getPunchline(gaaliMode, todayExpenses.length + expenses.length, total, todayExpenses.length)}</Text>
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
                      <View style={styles.expenseIcon}><SvgIcon xml={ICON_MONEY} size={21} color={colors.mint} /></View>
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
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.chips}
                    nestedScrollEnabled
                    keyboardShouldPersistTaps="handled"
                  >
                    {categories.map(item => (
                      <TouchableOpacity key={item} onPress={() => setCategory(item)} style={[styles.chip, item === category && styles.chipActive]}>
                        <Text style={[styles.chipText, item === category && styles.chipTextActive]}>{item}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  <TouchableOpacity onPress={addExpense} style={styles.primaryButton}>
                    <Text style={styles.primaryText}>Kharcha chipka</Text><SvgIcon xml={ICON_ARROW} size={18} color={colors.white} />
                  </TouchableOpacity>
                </View>
              </>
            )}

            {visibleTab === 'history' && (
              <>
                <Text style={styles.kicker}>MONEY TRAIL</Text>
                <Text style={styles.title}>Kharchon ka Qissa</Text>
                <View style={styles.miniHero}>
                  <View><Text style={styles.label}>ALL TIME</Text><Text style={styles.miniTotal}>{currency(allTotal)}</Text></View>
                  <View style={styles.badge}><Text style={styles.badgeNum}>{expenses.length}</Text><Text style={styles.muted}>entries</Text></View>
                </View>
                {expenses.map(expense => (
                  <TouchableOpacity key={expense.id} onLongPress={() => deleteExpense(expense.id)} style={styles.expenseRow}>
                    <View style={styles.expenseIcon}><SvgIcon xml={ICON_MONEY} size={21} color={colors.mint} /></View>
                    <View style={styles.expenseCopy}><Text style={styles.expenseName}>{expense.description}</Text><Text style={styles.muted}>{expense.category} • {expense.date}</Text></View>
                    <Text style={styles.expenseAmount}>{currency(expense.amount)}</Text>
                  </TouchableOpacity>
                ))}
                {!expenses.length && <View style={styles.empty}><Text style={styles.emptyBig}>404</Text><Text style={styles.emptyTitle}>History bhi tumhari tarah shareef hai.</Text><Text style={styles.muted}>Abhi kuch nahi mila.</Text></View>}
              </>
            )}

            {visibleTab === 'reports' && (
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
                      <View style={styles.track}><View style={[styles.fill, { width: `${allTotal ? item.amount / allTotal * 100 : 0}%` }]} /></View>
                    </View>
                  ))}
                </View>
              </>
            )}

            {visibleTab === 'settings' && (
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
        </KeyboardAvoidingView>

        <View style={styles.nav}>
          {([
            ['today', 'Aaj Ka Haal'],
            ['history', 'Qissa'],
            ['reports', 'Hisaab'],
            ['settings', 'Jugaad'],
          ] as const).map(([key, label]) => (
            <TouchableOpacity key={key} onPress={() => setTab(key)} style={styles.navItem}>
              <SvgIcon
                xml={{ today: ICON_HOME, history: ICON_HISTORY, reports: ICON_REPORTS, settings: ICON_SETTINGS }[key]}
                size={20}
                color={tab === key ? colors.purple : colors.dim}
              />
              <Text style={[styles.navLabel, tab === key && styles.active]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {quickEntry && (
          <View style={styles.modalBackdrop}>
            <KeyboardAvoidingView
              style={styles.modalKeyboard}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={0}
            >
            <View style={styles.modal}>
              <View style={styles.modalHandle} />
              <Text style={styles.title}>Jaldi se daal</Text>
              <Text style={styles.muted}>Ek line mein ek barbaadi. Example: Chai 120. Galti se 12000 mat likh dena, hum judge karenge.</Text>
              <TextInput autoFocus multiline value={quickText} onChangeText={setQuickText} placeholder={'Chai 120\nMetro 80'} placeholderTextColor={colors.dim} style={[styles.input, styles.quickInput]} />
              <View style={styles.modalActions}>
                <TouchableOpacity onPress={() => setQuickEntry(false)} style={styles.secondaryButton}><Text style={styles.secondaryText}>Rehne de</Text></TouchableOpacity>
                <TouchableOpacity onPress={addQuickExpenses} style={styles.primaryButton}><Text style={styles.primaryText}>Add all</Text><SvgIcon xml={ICON_ADD} size={18} color={colors.white} /></TouchableOpacity>
              </View>
            </View>
            </KeyboardAvoidingView>
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
  navLabel: { fontSize: 10, fontWeight: '900', color: '#61687A' },
  active: { color: colors.purple },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(2,3,7,0.82)', justifyContent: 'flex-end' },
  modalKeyboard: { width: '100%' },
  modal: { backgroundColor: '#0C1017', padding: 22, borderTopLeftRadius: 27, borderTopRightRadius: 27, borderWidth: 1, borderColor: colors.border, gap: 13 },
  modalHandle: { width: 42, height: 4, borderRadius: 2, backgroundColor: '#3A4050', alignSelf: 'center', marginBottom: 2 },
  quickInput: { minHeight: 125, textAlignVertical: 'top' },
  modalActions: { flexDirection: 'row', gap: 10 },
  secondaryButton: { flex: 1, minHeight: 48, borderRadius: 13, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' },
  secondaryText: { color: '#BEB0FF', fontWeight: '900' },
})
