import { useEffect, useMemo, useRef, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Alert, Animated, Easing, Image, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SvgXml } from 'react-native-svg'
import { StatusBar } from 'expo-status-bar'

const APP_LOGO = require('./dist/apple-icon.png')

const GUTZ_AVATAR_SVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 128 128\">\n  <defs>\n    <linearGradient id=\"bg\" x1=\"0\" x2=\"1\" y1=\"0\" y2=\"1\"><stop stop-color=\"#191326\"/><stop offset=\"1\" stop-color=\"#090b11\"/></linearGradient>\n  </defs>\n  <rect width=\"128\" height=\"128\" rx=\"32\" fill=\"url(#bg)\"/>\n  <circle cx=\"64\" cy=\"66\" r=\"34\" fill=\"#e9e1ce\"/>\n  <path d=\"M31 54c2-27 14-39 21-42 2 10 6 13 11 5 4 10 10 3 14-9 4 9 10 12 16 1 4 12 12 11 16 3 2 15 1 27-3 40-10-12-21-16-37-16-15 0-28 5-38 18z\" fill=\"#121116\"/>\n  <path d=\"M44 49c3-13 9-19 20-22 12 2 21 8 25 22-7-6-14-9-25-9-9 0-14 3-20 9z\" fill=\"#ffffff\" opacity=\".65\"/>\n  <circle cx=\"53\" cy=\"67\" r=\"5\" fill=\"#17151a\"/>\n  <circle cx=\"76\" cy=\"67\" r=\"5\" fill=\"#17151a\"/>\n  <path d=\"M56 83c5 4 15 4 20 0\" fill=\"none\" stroke=\"#1a171b\" stroke-width=\"3\" stroke-linecap=\"round\"/>\n  <path d=\"M30 78c12 9 21 12 34 13 12 0 23-3 34-12\" fill=\"none\" stroke=\"#0d0d11\" stroke-width=\"11\" stroke-linecap=\"round\"/>\n  <path d=\"M50 99c7 6 20 6 28 0\" fill=\"none\" stroke=\"#0d0d11\" stroke-width=\"6\" stroke-linecap=\"round\"/>\n</svg>"

const svgWithColor = (xml: string, color: string) => xml.replace(/CURRENT_COLOR/g, color)

const SvgIcon = ({ xml, size = 20, color = '#7E686C' }: { xml: string; size?: number; color?: string }) => (
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
const GAALI_MODE_KEY = '@fhookkdiya/gaali-mode'
const WELCOME_KEY = '@fhookkdiya/welcome-seen'
const SALARY_KEY = '@fhookkdiya/monthly-salary'
const LEGACY_EXPENSES_KEY = '@spendly/expenses'
const LEGACY_WELCOME_KEY = '@spendly/welcome-seen'

const MAX_EXPENSE = 20000
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

const cidReactionPunchlines = [
  'Hosh mein aao Abhijeet. Account balance dekho.',
  'Abhijeet, kuch toh gadbad hai. Receipt phir mil gayi.',
  'Daya ko bulao. Expense limit cross hone wali hai.',
  'Daya, darwaza nahi. Wallet kholo.',
  'Case serious hai. Suspect: tum. Evidence: transaction history.',
  'CID team ne investigation shuru kar di. Paisa already nikal chuka hai.',
  'ACP saab, scene ulta hai. Kharcha hua aur reason nahi mila.',
  'Crime scene secure karo. Ye shopping cart normal nahi hai.',
  'Motive unclear. Spending pattern highly suspicious.',
];

const instagramMemePunchlines = [
  'Aayein? Itna kaise uda diya?',
  'Bhai sahab. Ye kis line mein aa gaye ho?',
  'Moye moye. Wallet ka.',
  'Emotional damage. Financial damage. Bonus mein.',
  'POV: salary aayi thi.',
  'POV: tumne bola tha bas ek cheez leni hai.',
  'Bro is cooked. Wallet bhi.',
  'Main toh bas dekh raha tha. Receipt: jhooth.',
  'Kya hi bolun. Transaction khud jawab nahi de raha.',
  'Bhai, control. Card ko bhi thoda rest chahiye.',
  'Ye dekh ke system ne bhi do second socha.',
  'Absolute cinema. Zero financial planning.',
  'Bhai ruk ja. Plot already enough hai.',
  'Khatam. Tata. Bye-bye. Monthly peace.',
  'Arre baap re. Ye toh alag hi level ka kand hai.',
];

const desiRoastPunchlines = [
  'Abe ' + String.fromCharCode(77,67) + ', wallet ko ICU kyun bhej raha hai?',
  String.fromCharCode(66,67) + ', ye kharcha hai ya account pe personal attack?',
  'Nikal ' + String.fromCharCode(108,97,117,118,114,101) + '. Budget meeting khatam.',
  'Ye le ' + String.fromCharCode(108,97,117,118,114,101) + ' mode. Receipt phir se padh.',
  'Abe bhai, ek imaginary rapta maarne ka mann ho raha hai. Expense dekh ke.',
  'Paisa tera tha, dimaag kisne suspend kiya tha?',
  'Itni bakchodi bhi EMI pe aati hai kya?',
  'Bhai tu kharcha track nahi kar raha. Evidence collect kar raha hai.',
  'Aaj wallet ne tumhe dekha aur bola: bas kar.',
  'Ek aur expense aur budget officially RIP.',
  'Aukat se bahar spending ko confidence ke saath karne ka medal milta hai kya?',
  'Receipt dekh ke bhi keh raha hai "zaroori tha". Haan bhai, zaroori tha.',
  'Wallet ki taraf se formal complaint aa gayi hai.',
  'Bhai, paisa bachana tha. Tumne usko azaadi de di.',
];

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

const getPunchline = (gaaliMode: boolean, index: number, total: number, count: number, monthTotal = 0, salary = 0, peakExpense = 0) => {
  const salaryPercent = salary > 0 ? Math.round((monthTotal / salary) * 100) : 0
  const dynamic = [
    ...(peakExpense >= 20000 ? [
      '₹20,000. Bhai, hosh mein aao. Ye final boss hai.',
      'Poore ₹20,000? Abhijeet ko bulana padega.',
      '₹20k expense detected. Account balance ne aankhon ke saamne blackout kar liya.',
    ] : []),
    ...(peakExpense >= 18000 && peakExpense < 20000 ? [
      `₹${peakExpense.toLocaleString('en-IN')} ka single expense. Bas ₹${(20000 - peakExpense).toLocaleString('en-IN')} aur aur final boss unlocked.`,
      'Bhai 18k-plus? Budget ab tumhe seriously dekh raha hai.',
    ] : []),
    ...(peakExpense >= 15000 && peakExpense < 18000 ? [
      `₹${peakExpense.toLocaleString('en-IN')} ek hi hit mein. Hosh theek hai na?`,
      '15k-plus single spend. Daya ko door se bula rahe hain.',
    ] : []),
    ...(total >= 12000 && total < 15000 ? [
      '₹' + total.toLocaleString('en-IN') + ' today. Ab expense nahi, inquiry chal rahi hai.',
    ] : []),
    ...(total >= 10000 && total < 12000 ? [
      '₹' + total.toLocaleString('en-IN') + ' today? Salary ko yaad kar lo bhai.',
    ] : []),
    ...(total >= 8000 && total < 10000 ? [
      '₹' + total.toLocaleString('en-IN') + ' already. Wallet ko thoda oxygen do.',
    ] : []),
    ...(total >= 6000 && total < 8000 ? [
      '₹' + total.toLocaleString('en-IN') + ' today. Case suspicious ho raha hai.',
    ] : []),
    ...(total >= 4000 && total < 6000 ? [
      '₹' + total.toLocaleString('en-IN') + ' today. Investigation officially open.',
    ] : []),
    ...(total >= 2500 && total < 4000 ? [
      '₹' + total.toLocaleString('en-IN') + ' today. Kand ka trailer aa gaya.',
    ] : []),
    ...(total >= 1000 && total < 2500 ? [
      '₹' + total.toLocaleString('en-IN') + ' today. Bhai thoda brake bhi use hota hai.',
    ] : []),
    ...(salary >= 1 && salaryPercent >= 100 ? [
      `Salary ka ${salaryPercent}% touch ho gaya. Month abhi baaki hai, boss.`,
      'Monthly salary ne resignation letter draft kar diya hai.',
    ] : []),
    ...(salary >= 1 && salaryPercent >= 80 && salaryPercent < 100 ? [
      `Salary ka ${salaryPercent}% already committed. Thoda sa brake bhi use kar lo.`,
      'Month-end ne door se haath hila diya hai.',
    ] : []),
    ...(salary >= 1 && salaryPercent >= 60 && salaryPercent < 80 ? [
      `Salary ka ${salaryPercent}% gaya. Abhi comeback possible hai.`,
    ] : []),
    ...(salary >= 1 && salaryPercent > 0 && salaryPercent < 30 ? [
      `Salary ka sirf ${salaryPercent}% spent. Wallet abhi khush hai.`,
    ] : []),
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

  const basePool = gaaliMode
    ? [...dynamic, ...cleanPunchlines, ...gaaliPunchlines, ...comedyCinemaPunchlines, ...cidReactionPunchlines, ...instagramMemePunchlines, ...desiRoastPunchlines, ...deadpanPunchlines]
    : [...dynamic, ...cleanPunchlines, ...comedyCinemaPunchlines, ...cidReactionPunchlines, ...instagramMemePunchlines, ...deadpanPunchlines]

  const tierPool =
    peakExpense >= 20000
      ? [
          '₹20,000. Hosh mein aao bhai. Final boss unlocked.',
          'Poore ₹20,000? Abhijeet ko bulana padega.',
          '₹20k expense detected. Account balance ne blackout le liya.',
          ...cidReactionPunchlines,
          ...desiRoastPunchlines,
        ]
      : peakExpense >= 18000
        ? [
            '₹' + peakExpense.toLocaleString('en-IN') + ' ek hi hit mein. Bas thoda aur aur final boss unlocked.',
            '18k-plus single spend. Daya ko door se bula rahe hain.',
            ...cidReactionPunchlines,
            ...desiRoastPunchlines,
          ]
        : peakExpense >= 15000
          ? [
              '₹' + peakExpense.toLocaleString('en-IN') + ' ek hi hit mein. Hosh theek hai na?',
              '15k-plus single spend. Investigation mode on.',
              ...cidReactionPunchlines,
              ...instagramMemePunchlines,
            ]
          : total >= 12000
            ? [
                '₹' + total.toLocaleString('en-IN') + ' today. Ab expense nahi, inquiry chal rahi hai.',
                ...cidReactionPunchlines,
                ...instagramMemePunchlines,
              ]
            : total >= 10000
              ? [
                  '₹' + total.toLocaleString('en-IN') + ' today? Salary ko yaad kar lo bhai.',
                  ...instagramMemePunchlines,
                  ...comedyCinemaPunchlines,
                ]
              : total >= 8000
                ? [
                    '₹' + total.toLocaleString('en-IN') + ' already. Wallet ko oxygen do.',
                    ...instagramMemePunchlines,
                    ...comedyCinemaPunchlines,
                  ]
                : total >= 6000
                  ? [
                      '₹' + total.toLocaleString('en-IN') + ' today. Case suspicious ho raha hai.',
                      ...cidReactionPunchlines,
                      ...instagramMemePunchlines,
                    ]
                  : total >= 4000
                    ? [
                        '₹' + total.toLocaleString('en-IN') + ' today. Investigation officially open.',
                        ...cidReactionPunchlines,
                      ]
                    : total >= 2500
                      ? [
                          '₹' + total.toLocaleString('en-IN') + ' today. Kand ka trailer aa gaya.',
                          ...instagramMemePunchlines,
                          ...comedyCinemaPunchlines,
                        ]
                      : total >= 1000
                        ? [
                            '₹' + total.toLocaleString('en-IN') + ' today. Bhai thoda brake bhi use hota hai.',
                            ...cleanPunchlines,
                            ...instagramMemePunchlines,
                          ]
                        : basePool

  return tierPool[index % tierPool.length]
}

const currency = (amount: number) => `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
const dateKey = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return year + '-' + month + '-' + day
}
const monthKey = (date: Date) => dateKey(date).slice(0, 7)
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
  const [gaaliMode, setGaaliMode] = useState(true)
  const [storageReady, setStorageReady] = useState(false)
  const [welcomeVisible, setWelcomeVisible] = useState(false)
  const [salary, setSalary] = useState(0)
  const [salaryDraft, setSalaryDraft] = useState('')
  const [deleteCandidate, setDeleteCandidate] = useState<Expense | null>(null)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [editDescription, setEditDescription] = useState('')
  const [editAmount, setEditAmount] = useState('')
  const [editCategory, setEditCategory] = useState('Food')
  const [toast, setToast] = useState('')

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
  const toastY = useRef(new Animated.Value(12)).current
  const toastOpacity = useRef(new Animated.Value(0)).current
  const bootLogoScale = useRef(new Animated.Value(0.94)).current
  const bootLogoOpacity = useRef(new Animated.Value(0.65)).current

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const [savedExpensesNew, gaaliModeSaved, welcomeSeenNew, savedSalary, savedExpensesLegacy, welcomeSeenLegacy] = await Promise.all([
          AsyncStorage.getItem(EXPENSES_KEY),
          AsyncStorage.getItem(GAALI_MODE_KEY),
          AsyncStorage.getItem(WELCOME_KEY),
          AsyncStorage.getItem(SALARY_KEY),
          AsyncStorage.getItem(LEGACY_EXPENSES_KEY),
          AsyncStorage.getItem(LEGACY_WELCOME_KEY),
        ])
        const savedExpenses = savedExpensesNew ?? savedExpensesLegacy
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
        if (gaaliModeSaved !== null) setGaaliMode(gaaliModeSaved === 'true')
        if (savedSalary !== null) {
          const parsedSalary = Number(savedSalary)
          if (Number.isFinite(parsedSalary) && parsedSalary > 0) {
            setSalary(parsedSalary)
            setSalaryDraft(String(parsedSalary))
          }
        }
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
    AsyncStorage.setItem(SALARY_KEY, String(salary)).catch(() => {
      Alert.alert('Storage error', 'Your salary setting could not be saved locally.')
    })
  }, [salary, storageReady])

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
    if (storageReady) return
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(bootLogoScale, { toValue: 1.03, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(bootLogoOpacity, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(bootLogoScale, { toValue: 0.94, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(bootLogoOpacity, { toValue: 0.72, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ]),
      ]),
    )
    pulse.start()
    return () => pulse.stop()
  }, [storageReady, bootLogoScale, bootLogoOpacity])

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
    const trimmedSalary = salaryDraft.trim()
    if (trimmedSalary) saveSalary(trimmedSalary)
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
  const thisMonth = monthKey(today)
  const monthExpenses = expenses.filter(e => e.date?.slice(0, 7) === thisMonth)
  const monthTotal = monthExpenses.reduce((sum, e) => sum + e.amount, 0)
  const peakTodayExpense = todayExpenses.reduce((max, e) => Math.max(max, e.amount), 0)
  const salaryRemaining = salary - monthTotal
  const salaryPercent = salary > 0 ? Math.round((monthTotal / salary) * 100) : 0
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0)
  const remainingDays = Math.max(1, monthEnd.getDate() - today.getDate() + 1)
  const safeDaily = salary > 0 ? Math.max(0, salaryRemaining / remainingDays) : 0

  const categoryTotals = useMemo(
    () => categories.map(name => ({
      name,
      amount: expenses.filter(e => e.category === name).reduce((sum, e) => sum + e.amount, 0),
    })).filter(item => item.amount > 0).sort((a, b) => b.amount - a.amount),
    [expenses],
  )

  const showToast = (message: string) => {
    setToast(message)
    toastY.setValue(12)
    toastOpacity.setValue(0)
    Animated.parallel([
      Animated.spring(toastY, { toValue: 0, friction: 8, tension: 90, useNativeDriver: true }),
      Animated.timing(toastOpacity, { toValue: 1, duration: 160, useNativeDriver: true }),
    ]).start(() => {
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(toastOpacity, { toValue: 0, duration: 180, useNativeDriver: true }),
          Animated.timing(toastY, { toValue: 10, duration: 180, useNativeDriver: true }),
        ]).start(() => setToast(''))
      }, 1600)
    })
  }

  const saveSalary = (raw: string) => {
    const value = Number(raw.replace(/,/g, ''))
    if (!Number.isFinite(value) || value <= 0) {
      Alert.alert('Salary check', 'Enter a monthly salary greater than ₹0.')
      return false
    }
    setSalary(value)
    setSalaryDraft(String(value))
    showToast('💰 Salary locked in. Ab hisaab hoga.')
    return true
  }

  const startEditExpense = (expense: Expense) => {
    setEditingExpense(expense)
    setEditDescription(expense.description)
    setEditAmount(String(expense.amount))
    setEditCategory(expense.category)
  }

  const updateExpense = () => {
    if (!editingExpense) return
    const numericAmount = Number(editAmount.replace(/,/g, ''))
    if (!editDescription.trim() || !Number.isFinite(numericAmount) || numericAmount <= 0) {
      Alert.alert('Entry adhuri hai', 'Description aur ₹1 se zyada amount daalo.')
      return
    }
    if (numericAmount > MAX_EXPENSE) {
      Alert.alert('Bhai ruk 😭', 'Per expense max ₹20,000 hai. Isse zyada ko split kar de.')
      return
    }

    setExpenses(current => current.map(expense =>
      expense.id === editingExpense.id
        ? { ...expense, description: editDescription.trim(), amount: numericAmount, category: editCategory }
        : expense,
    ))
    setEditingExpense(null)
    setEditDescription('')
    setEditAmount('')
    showToast('✏️ Expense updated. Hisaab theek kiya.')
  }

  const resetSalary = () => {
    Alert.alert(
      'Salary reset karein?',
      'Salary hata di jayegi. Expenses safe rahenge.',
      [
        { text: 'Rehne de', style: 'cancel' },
        {
          text: 'Reset salary',
          style: 'destructive',
          onPress: () => {
            setSalary(0)
            setSalaryDraft('')
            showToast('🧹 Salary reset. Wallet ko fresh start.')
          },
        },
      ],
    )
  }

  const addExpense = () => {
    const numericAmount = Number(amount.replace(/,/g, ''))
    if (!description.trim() || !Number.isFinite(numericAmount) || numericAmount <= 0) {
      Alert.alert('Entry adhuri hai', 'Description aur ₹1 se zyada amount daalo.')
      return
    }
    if (numericAmount > MAX_EXPENSE) {
      Alert.alert('Bhai ruk 😭', 'Per expense max ₹20,000 hai. Isse zyada ko split kar de.')
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
    showToast('✅ Expense saved. Wallet ki FIR filed.')
  }

  const confirmDeleteExpense = () => {
    if (!deleteCandidate) return
    setExpenses(current => current.filter(e => e.id !== deleteCandidate.id))
    showToast('🗑️ Expense deleted. Evidence removed.')
    setDeleteCandidate(null)
  }

  const addQuickExpenses = () => {
    const parsed = quickText.split(/[\n,]+/).map(s => s.trim()).filter(Boolean).map(entry => {
      const match = entry.match(/^(.*?)[\s-:–—]*([\d,]+(?:\.\d{1,2})?)$/)
      return match ? { description: match[1].trim(), amount: Number(match[2].replace(/,/g, '')) } : null
    })
    if (!parsed.length || parsed.some(item => !item?.description || !item.amount)) {
      Alert.alert('Format samajh nahi aaya', 'Use: Lunch 250, one expense per line.')
      return
    }
    if (parsed.some(item => item && item.amount > MAX_EXPENSE)) {
      Alert.alert('Bhai ₹20k max hai 😭', 'Ek quick-entry expense bhi ₹20,000 se upar nahi ho sakta.')
      return
    }
    setExpenses(current => [
      ...parsed.map((item, i) => ({ id: Date.now() + i, description: item!.description, amount: item!.amount, category: 'Other', date: todayKey })),
      ...current,
    ])
    setQuickText('')
    setQuickEntry(false)
    showToast('✅ ' + parsed.length + ' expense' + (parsed.length === 1 ? '' : 's') + ' saved. Chaos logged.')
  }

  if (!storageReady) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar style="light" />
        <View style={styles.boot}>
          <Animated.View style={[styles.bootLogoWrap, { opacity: bootLogoOpacity, transform: [{ scale: bootLogoScale }] }]}>
            <Image source={APP_LOGO} style={styles.bootLogo} resizeMode="cover" accessibilityLabel="FhooKkkDiya app logo" />
          </Animated.View>
          <Text style={styles.bootTitle}>FhooKkkDiya</Text>
          <Text style={styles.bootCopy}>Paisa ka post-mortem loading...</Text>
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
          <KeyboardAvoidingView style={styles.welcomeKeyboard} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={styles.welcomeScrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
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
              Welcome. Khud ki marzi se aaye ho ya bank balance ne bulaya? 😭
            </Text>
            <View style={styles.quoteCard}>
              <Text style={styles.quoteKicker}>PEHLA SETUP</Text>
              <Text style={styles.quoteText}>Is month salary kitni aayi? Bata de. Phir app batayega ki paisa kitna bacha aur kitna cinematic ho gaya.</Text>
              <TextInput
                value={salaryDraft}
                onChangeText={setSalaryDraft}
                keyboardType="decimal-pad"
                maxLength={10}
                placeholder="Monthly salary e.g. 50000"
                placeholderTextColor={colors.dim}
                style={styles.salarySetupInput}
              />
              <View style={styles.presetRow}>
                {[15000, 25000, 50000, 75000].map(value => (
                  <TouchableOpacity key={value} onPress={() => setSalaryDraft(String(value))} style={styles.presetChip}>
                    <Text style={styles.presetChipText}>{currency(value)}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.salaryOptional}>Optional. Baad mein Jugaad mein bhi set kar sakte ho.</Text>
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

            <Text style={styles.welcomeFoot}>Data local storage mein. Salary aur expenses sirf isi device par rehte hain.</Text>
          </Animated.View>
            </ScrollView>
          </KeyboardAvoidingView>
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
                  <TouchableOpacity accessibilityRole="button" accessibilityLabel="Quick add expenses" onPress={() => setQuickEntry(true)} style={styles.quickButton}>
                    <Text style={styles.quickText}>Jaldi se daal</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.salaryCard}>
                  <View style={styles.rowBetween}>
                    <View style={styles.flex}>
                      <Text style={styles.label}>IS MONTH KI SALARY</Text>
                      <Text style={styles.salaryBig}>{salary > 0 ? currency(salary) : 'Set karo'}</Text>
                    </View>
                    <View style={styles.salaryBadge}>
                      <Text style={styles.salaryBadgeNum}>{salary > 0 ? `${salaryPercent}%` : '—'}</Text>
                      <Text style={styles.salaryBadgeLabel}>USED</Text>
                    </View>
                  </View>
                  <View style={styles.salaryStats}>
                    <View style={styles.salaryStat}><Text style={styles.salaryStatLabel}>SPENT</Text><Text style={styles.salaryStatValue}>{currency(monthTotal)}</Text></View>
                    <View style={styles.salaryStat}><Text style={styles.salaryStatLabel}>{salaryRemaining >= 0 ? 'LEFT' : 'OVER'}</Text><Text style={[styles.salaryStatValue, salaryRemaining < 0 && styles.salaryDanger]}>{currency(Math.abs(salaryRemaining))}</Text></View>
                  </View>
                  <View style={styles.salaryTrack}><View style={[styles.salaryFill, { width: `${Math.min(100, Math.max(0, salaryPercent))}%` }]} /></View>
                  <Text style={styles.salaryHint}>
                    {salary <= 0 ? 'Salary set karo. Phir FhooKkkDiya month ka reality check dega.' : salaryPercent >= 100 ? 'Salary se zyada kharch ho gaya. Calendar ko blame kar sakte ho, calculator ko nahi.' : salaryPercent >= 80 ? 'Month-end ko ab thoda space chahiye.' : salaryPercent >= 50 ? 'Halfway gone. Brake abhi bhi kaam karta hai.' : 'Wallet abhi comparatively theek chal raha hai.'}
                  </Text>
                </View>

                <View style={styles.safeDailyRow}>
                  <View style={styles.safeDailyIcon}><Text style={styles.safeDailyEmoji}>🎯</Text></View>
                  <View style={styles.flex}>
                    <Text style={styles.safeDailyLabel}>AAJ SE ROZ APPROX SAFE</Text>
                    <Text style={styles.safeDailyValue}>{salary > 0 ? currency(safeDaily) : 'Set salary first'}</Text>
                    <Text style={styles.safeDailyHint}>{salary > 0 ? remainingDays + ' day' + (remainingDays === 1 ? '' : 's') + ' left. Budget suggestion hai, hukum nahi.' : 'Salary set karo aur app daily reality-check dega.'}</Text>
                  </View>
                </View>

                <View style={styles.hero}>
                  <View style={styles.heroGlow} />
                  <Text style={styles.label}>AAJ KITNA UDAA?</Text>
                  <Text style={styles.total}>{currency(total)}</Text>
                  <Text style={styles.heroSub}>{todayExpenses.length ? `${todayExpenses.length} kharcha${todayExpenses.length === 1 ? '' : 'y'} recorded` : 'Aaj abhi tak paisa zinda hai. Mashallah.'}</Text>
                  <View style={styles.divider} />
                  <Text style={styles.heroHint}>{getPunchline(gaaliMode, todayExpenses.length + expenses.length, total, todayExpenses.length, monthTotal, salary, peakTodayExpense)}</Text>
                </View>

                <View style={styles.rowBetween}>
                  <Text style={styles.sectionTitle}>🧾 Aaj ka qissa</Text>
                  <Text style={styles.muted}>{todayExpenses.length} items</Text>
                </View>

                {todayExpenses.length === 0 ? (
                  <View style={styles.empty}>
                    <Text style={styles.emptyBig}>🫡 ₹0</Text>
                    <Text style={styles.emptyTitle}>Abhi tak koi barbaadi nahi.</Text>
                    <Text style={styles.muted}>Neeche se pehla kharcha chipkao.</Text>
                  </View>
                ) : (
                  todayExpenses.map(expense => (
                    <TouchableOpacity key={expense.id} activeOpacity={0.86} onPress={() => startEditExpense(expense)} onLongPress={() => setDeleteCandidate(expense)} style={styles.expenseRow}>
                      <View style={styles.expenseIcon}><SvgIcon xml={ICON_MONEY} size={21} color={colors.red} /></View>
                      <View style={styles.expenseCopy}>
                        <Text style={styles.expenseName}>{expense.description}</Text>
                        <Text style={styles.muted}>{expense.category} • tap = edit • long press = delete</Text>
                      </View>
                      <Text style={styles.expenseAmount}>{currency(expense.amount)}</Text>
                    </TouchableOpacity>
                  ))
                )}

                <View style={styles.card}>
                  <Text style={styles.sectionTitle}>💸 Kharcha chipka</Text>
                  <Text style={styles.formHint}>Bas sach bol. App judge karega, par silently.</Text>
                  <TextInput value={description} onChangeText={setDescription} placeholder="Kis cheez pe udaaya?" placeholderTextColor={colors.dim} maxLength={60} style={styles.input} />
                  <TextInput value={amount} onChangeText={setAmount} keyboardType="decimal-pad" maxLength={8} placeholder="Kitne rupaye?" placeholderTextColor={colors.dim} style={styles.input} />
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
                <Text style={styles.title}>🧾 Kharchon ka Qissa</Text>
                <View style={styles.miniHero}>
                  <View><Text style={styles.label}>ALL TIME</Text><Text style={styles.miniTotal}>{currency(allTotal)}</Text></View>
                  <View style={styles.badge}><Text style={styles.badgeNum}>{expenses.length}</Text><Text style={styles.muted}>entries</Text></View>
                </View>
                {expenses.map(expense => (
                  <TouchableOpacity key={expense.id} onPress={() => startEditExpense(expense)} onLongPress={() => setDeleteCandidate(expense)} style={styles.expenseRow}>
                    <View style={styles.expenseIcon}><SvgIcon xml={ICON_MONEY} size={21} color={colors.red} /></View>
                    <View style={styles.expenseCopy}><Text style={styles.expenseName}>{expense.description}</Text><Text style={styles.muted}>{expense.category} • {expense.date}</Text></View>
                    <Text style={styles.expenseAmount}>{currency(expense.amount)}</Text>
                  </TouchableOpacity>
                ))}
                {!expenses.length && <View style={styles.empty}><Text style={styles.emptyBig}>🕵️ 404</Text><Text style={styles.emptyTitle}>History bhi tumhari tarah shareef hai.</Text><Text style={styles.muted}>Abhi kuch nahi mila.</Text></View>}
              </>
            )}

            {visibleTab === 'reports' && (
              <>
                <Text style={styles.kicker}>PAISA KAHAN GAYA?</Text>
                <Text style={styles.title}>📊 Hisaab</Text>
                <View style={styles.miniHero}>
                  <View><Text style={styles.label}>TOTAL SPENDING</Text><Text style={styles.miniTotal}>{currency(allTotal)}</Text></View>
                  <Text style={styles.muted}>{expenses.length} expenses</Text>
                </View>
                <View style={styles.card}>
                  <Text style={styles.sectionTitle}>🕵️ Paisa gaya kahan, janaab?</Text>
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
                <Text style={styles.title}>⚙️ Jugaad</Text>
                <View style={styles.card}>
                  <Text style={styles.sectionTitle}>💰 Salary ka Jugaad</Text>
                  <Text style={styles.formHint}>Monthly salary set karo. Spending is month ke total se compare hoga.</Text>
                  <View style={styles.salaryEditRow}>
                    <TextInput value={salaryDraft} onChangeText={setSalaryDraft} keyboardType="decimal-pad" placeholder="Monthly salary" placeholderTextColor={colors.dim} style={styles.input} />
                    <TouchableOpacity onPress={() => saveSalary(salaryDraft)} style={styles.salarySaveButton}><Text style={styles.primaryText}>Save</Text></TouchableOpacity>
                  </View>
                  <Text style={styles.muted}>{salary > 0 ? `Current: ${currency(salary)} • ${currency(monthTotal)} spent this month` : 'Not set yet.'}</Text>
                  {salary > 0 && (
                    <TouchableOpacity accessibilityRole="button" onPress={resetSalary} style={styles.secondaryButton}>
                      <Text style={styles.secondaryText}>Reset salary</Text>
                    </TouchableOpacity>
                  )}
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
            <TouchableOpacity key={key} accessibilityRole="tab" accessibilityLabel={label} accessibilityState={{ selected: tab === key }} onPress={() => setTab(key)} style={styles.navItem}>
              <SvgIcon
                xml={{ today: ICON_HOME, history: ICON_HISTORY, reports: ICON_REPORTS, settings: ICON_SETTINGS }[key]}
                size={20}
                color={tab === key ? colors.red : colors.dim}
              />
              <Text style={[styles.navLabel, tab === key && styles.active]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {deleteCandidate && (
          <View style={styles.modalBackdrop}>
            <View style={styles.confirmModal}>
              <View style={styles.modalHandle} />
              <Text style={styles.confirmEmoji}>🧾</Text>
              <Text style={styles.confirmTitle}>Evidence delete karein?</Text>
              <Text style={styles.confirmCopy}>{deleteCandidate.description} • {currency(deleteCandidate.amount)}{`\n`}Ye entry wapas nahi aayegi.</Text>
              <View style={styles.modalActions}>
                <TouchableOpacity onPress={() => setDeleteCandidate(null)} style={styles.secondaryButton}>
                  <Text style={styles.secondaryText}>Rehne de</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={confirmDeleteExpense} style={styles.dangerButton}>
                  <Text style={styles.primaryText}>Haan, delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {editingExpense && (
          <View style={styles.modalBackdrop}>
            <KeyboardAvoidingView
              style={styles.modalKeyboard}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={0}
            >
              <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScrollContent}>
                <View style={styles.modal}>
                  <View style={styles.modalHandle} />
                  <Text style={styles.title}>✏️ Expense edit karo</Text>
                  <Text style={styles.muted}>Tap se edit, long press se delete. ₹20,000 max wahi rahega.</Text>
                  <TextInput
                    value={editDescription}
                    onChangeText={setEditDescription}
                    maxLength={60}
                    placeholder="Kis cheez pe udaaya?"
                    placeholderTextColor={colors.dim}
                    style={styles.input}
                  />
                  <TextInput
                    value={editAmount}
                    onChangeText={setEditAmount}
                    keyboardType="decimal-pad"
                    maxLength={8}
                    placeholder="Kitne rupaye?"
                    placeholderTextColor={colors.dim}
                    style={styles.input}
                  />
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.chips}
                    nestedScrollEnabled
                    keyboardShouldPersistTaps="handled"
                  >
                    {categories.map(item => (
                      <TouchableOpacity key={item} onPress={() => setEditCategory(item)} style={[styles.chip, item === editCategory && styles.chipActive]}>
                        <Text style={[styles.chipText, item === editCategory && styles.chipTextActive]}>{item}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  <View style={styles.modalActions}>
                    <TouchableOpacity onPress={() => setEditingExpense(null)} style={styles.secondaryButton}>
                      <Text style={styles.secondaryText}>Rehne de</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={updateExpense} style={styles.primaryButton}>
                      <Text style={styles.primaryText}>Save changes</Text>
                      <SvgIcon xml={ICON_ARROW} size={18} color={colors.white} />
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        )}

        {toast && (
          <Animated.View pointerEvents="none" style={[styles.toast, { opacity: toastOpacity, transform: [{ translateY: toastY }] }]}> 
            <Text style={styles.toastText}>{toast}</Text>
          </Animated.View>
        )}

        {quickEntry && (
          <View style={styles.modalBackdrop}>
            <KeyboardAvoidingView
              style={styles.modalKeyboard}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={0}
            >
            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScrollContent}>
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
            </ScrollView>
            </KeyboardAvoidingView>
          </View>
        )}
      </View>
    </SafeAreaView>
  )
}

const colors = {
  bg: '#080506',
  surface: '#120A0C',
  surface2: '#1A0D10',
  border: '#3A1D22',
  text: '#FFF8F6',
  muted: '#B99FA2',
  dim: '#7E686C',
  red: '#E5384F',
  redSoft: '#3A1118',
  maroon: '#6E1C2A',
  maroonDeep: '#350D15',
  white: '#FFFFFF',
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  app: { flex: 1, backgroundColor: colors.bg },
  boot: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
  bootTitle: { marginTop: 14, color: colors.text, fontSize: 25, fontWeight: '900' },
  bootCopy: { marginTop: 7, color: colors.muted, fontSize: 13 },
  logoMark: { width: 62, height: 62, borderRadius: 21, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.red },
  bootLogoWrap: { width: 112, height: 112, borderRadius: 29, overflow: 'hidden', marginBottom: 6 },
  bootLogo: { width: 112, height: 112 },
  logoText: { color: colors.white, fontSize: 29, fontWeight: '900' },

  welcomeScreen: { flex: 1, justifyContent: 'center', padding: 25, overflow: 'hidden', backgroundColor: colors.bg },
  orb: { position: 'absolute', width: 340, height: 340, borderRadius: 170, backgroundColor: colors.red, opacity: 0.12, right: -130, top: -110 },
  orb2: { position: 'absolute', width: 260, height: 260, borderRadius: 130, backgroundColor: colors.red, opacity: 0.07, left: -140, bottom: -100 },
  welcomeKeyboard: { flex: 1, width: '100%' },
  welcomeScrollContent: { flexGrow: 1, justifyContent: 'center', paddingVertical: 12 },
  welcomeContent: { width: '100%' },
  avatarLargeWrap: { width: 112, height: 112, borderRadius: 56, overflow: 'hidden', borderWidth: 2, borderColor: '#69202C', backgroundColor: '#170B0E', marginBottom: 18 },
  quoteCard: { marginTop: 16, padding: 15, borderRadius: 17, backgroundColor: '#0E1118', borderWidth: 1, borderColor: '#462329' },
  quoteKicker: { color: colors.red, fontSize: 8, fontWeight: '900', letterSpacing: 1.5, marginBottom: 7 },
  quoteText: { color: '#F3DDE1', fontSize: 13.5, lineHeight: 20, fontWeight: '800' },
  salarySetupInput: { marginTop: 12, borderRadius: 13, borderWidth: 1, borderColor: colors.border, backgroundColor: '#0B0709', color: colors.text, paddingHorizontal: 13, paddingVertical: 12, fontSize: 14, fontWeight: '800' },
  presetRow: { flexDirection: 'row', gap: 7, marginTop: 9, flexWrap: 'wrap' },
  presetChip: { paddingHorizontal: 9, paddingVertical: 7, borderRadius: 10, backgroundColor: '#1A0D10', borderWidth: 1, borderColor: colors.border },
  presetChipText: { color: '#F1B1B9', fontSize: 10, fontWeight: '900' },
  salaryOptional: { color: colors.dim, fontSize: 10, marginTop: 9 },

  avatarSmallWrap: { width: 46, height: 46, borderRadius: 23, overflow: 'hidden', borderWidth: 1, borderColor: '#5A1C27' },

  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 21, paddingTop: 15, paddingBottom: 11 },
  headerCopy: { flex: 1, marginLeft: 11 },
  kicker: { color: '#9A7E83', fontSize: 9, letterSpacing: 1.5, fontWeight: '900' },
  brand: { color: colors.text, fontSize: 22, fontWeight: '900', marginTop: 2 },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.red },
  content: { padding: 21, paddingBottom: 30, gap: 17 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  flex: { flex: 1 },
  title: { color: colors.text, fontSize: 29, lineHeight: 34, fontWeight: '900', letterSpacing: -0.8, marginTop: 5 },
  welcomeTitle: { color: colors.text, fontSize: 42, lineHeight: 46, fontWeight: '900', letterSpacing: -1.4 },
  welcomeAccent: { color: '#FFB7C0', fontSize: 24, lineHeight: 30, fontWeight: '800', marginTop: 3 },
  welcomeCopy: { color: colors.muted, fontSize: 15, lineHeight: 23, marginTop: 16, maxWidth: 420 },
  pills: { flexDirection: 'row', gap: 8, marginTop: 21, marginBottom: 27 },
  pill: { paddingHorizontal: 10, paddingVertical: 7, borderRadius: 20, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border },
  pillText: { color: '#C5AEB1', fontSize: 9, fontWeight: '900', letterSpacing: 1.1 },
  enterButton: { minHeight: 58, borderRadius: 18, backgroundColor: colors.red, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 19 },
  enterText: { color: colors.white, fontSize: 15, fontWeight: '900' },
  enterArrow: { color: colors.white, fontSize: 22, fontWeight: '900' },
  welcomeFoot: { textAlign: 'center', color: '#725D62', fontSize: 11, marginTop: 13 },

  quickButton: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  keyboardArea: { flex: 1 },
  screen: { flex: 1 },
  scroll: { flex: 1 },
  safeDailyRow: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 18, backgroundColor: colors.maroonDeep, borderWidth: 1, borderColor: '#55202A', gap: 12 },
  safeDailyIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: colors.maroonDeep, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#7A2734' },
  safeDailyEmoji: { fontSize: 21 },
  safeDailyLabel: { color: '#A98087', fontSize: 8, fontWeight: '900', letterSpacing: 1.4 },
  safeDailyValue: { color: colors.text, fontSize: 21, fontWeight: '900', marginTop: 3 },
  safeDailyHint: { color: colors.muted, fontSize: 10.5, lineHeight: 15, marginTop: 2 },
  quickText: { color: '#FF9BA8', fontSize: 12, fontWeight: '900' },
  salaryCard: { backgroundColor: '#13090C', borderRadius: 22, padding: 17, borderWidth: 1, borderColor: '#4D2028', gap: 13 },
  salaryBig: { color: colors.text, fontSize: 27, fontWeight: '900', marginTop: 4 },
  salaryBadge: { width: 58, height: 58, borderRadius: 18, backgroundColor: '#251015', borderWidth: 1, borderColor: '#6B2532', alignItems: 'center', justifyContent: 'center' },
  salaryBadgeNum: { color: colors.red, fontSize: 15, fontWeight: '900' },
  salaryBadgeLabel: { color: '#9D7179', fontSize: 8, fontWeight: '900', letterSpacing: 1 },
  salaryStats: { flexDirection: 'row', gap: 9 },
  salaryStat: { flex: 1, padding: 11, borderRadius: 14, backgroundColor: '#0A0F0D', borderWidth: 1, borderColor: '#1A2B25' },
  salaryStatLabel: { color: '#6F877D', fontSize: 8, fontWeight: '900', letterSpacing: 1.2 },
  salaryStatValue: { color: '#FFF1F2', fontSize: 15, fontWeight: '900', marginTop: 4 },
  salaryDanger: { color: '#FF8794' },
  salaryTrack: { height: 7, borderRadius: 5, overflow: 'hidden', backgroundColor: '#241014' },
  salaryFill: { height: 7, borderRadius: 5, backgroundColor: colors.red },
  salaryHint: { color: '#A98188', fontSize: 10.5, lineHeight: 16 },
  salaryEditRow: { flexDirection: 'row', gap: 9, alignItems: 'center' },
  salarySaveButton: { minHeight: 48, paddingHorizontal: 17, borderRadius: 13, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center' },
  toggle: { width: 48, height: 28, borderRadius: 16, padding: 3, justifyContent: 'center', backgroundColor: '#3C2228' },
  toggleOn: { backgroundColor: colors.red },
  knob: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.white },
  knobOn: { alignSelf: 'flex-end' },
  hero: { position: 'relative', overflow: 'hidden', backgroundColor: colors.surface2, borderRadius: 25, padding: 22, borderWidth: 1, borderColor: '#282F40' },
  heroGlow: { position: 'absolute', width: 180, height: 180, borderRadius: 90, backgroundColor: colors.red, opacity: 0.1, right: -70, top: -80 },
  label: { color: '#9B7D83', fontSize: 9, fontWeight: '900', letterSpacing: 1.6 },
  total: { color: colors.text, fontSize: 43, fontWeight: '900', letterSpacing: -1.3, marginVertical: 7 },
  heroSub: { color: '#C4A9AE', fontSize: 13 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 17 },
  heroHint: { color: '#B79AA0', fontSize: 11, fontWeight: '800' },
  sectionTitle: { color: colors.text, fontSize: 17, fontWeight: '900' },
  muted: { color: colors.muted, fontSize: 12.5, lineHeight: 19 },
  empty: { alignItems: 'center', paddingVertical: 30, borderRadius: 20, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.border, backgroundColor: '#0B0608' },
  emptyBig: { color: '#FF6B7C', fontSize: 30, fontWeight: '900' },
  emptyTitle: { color: colors.text, marginTop: 7, marginBottom: 4, fontWeight: '900' },
  expenseRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 7 },
  expenseIcon: { width: 41, height: 41, borderRadius: 13, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  expenseIconText: { color: colors.red, fontWeight: '900' },
  expenseCopy: { flex: 1, marginLeft: 12 },
  expenseName: { color: colors.text, fontSize: 14, fontWeight: '900' },
  expenseAmount: { color: colors.text, fontSize: 14, fontWeight: '900' },
  card: { backgroundColor: colors.surface, borderRadius: 20, padding: 17, borderWidth: 1, borderColor: colors.border, gap: 13 },
  formHint: { color: colors.dim, fontSize: 11 },
  input: { borderRadius: 13, borderWidth: 1, borderColor: colors.border, backgroundColor: '#0B0709', color: colors.text, paddingHorizontal: 14, paddingVertical: 13, fontSize: 14 },
  chips: { gap: 7 },
  chip: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: '#3D2026', backgroundColor: '#1A0D10' },
  chipActive: { backgroundColor: colors.maroonDeep, borderColor: '#742635' },
  chipText: { color: '#967A80', fontSize: 12 },
  chipTextActive: { color: '#FFC3CB', fontWeight: '900' },
  primaryButton: { flex: 1, minHeight: 48, borderRadius: 13, backgroundColor: colors.red, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 },
  primaryText: { color: colors.white, fontWeight: '900' },
  miniHero: { backgroundColor: colors.surface2, borderRadius: 20, borderWidth: 1, borderColor: colors.border, padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  miniTotal: { color: colors.text, fontSize: 31, fontWeight: '900', marginTop: 4 },
  badge: { width: 62, height: 62, borderRadius: 20, backgroundColor: colors.redSoft, borderWidth: 1, borderColor: '#67202C', alignItems: 'center', justifyContent: 'center' },
  badgeNum: { color: colors.red, fontSize: 18, fontWeight: '900' },
  reportRow: { gap: 8 },
  track: { height: 8, borderRadius: 5, overflow: 'hidden', backgroundColor: '#241318' },
  fill: { height: 8, borderRadius: 5, backgroundColor: colors.red },
  toggle: { width: 48, height: 28, borderRadius: 16, padding: 3, justifyContent: 'center', backgroundColor: '#3C2228' },
  toggleOn: { backgroundColor: colors.red },
  knob: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#FFF8F6' },
  knobOn: { alignSelf: 'flex-end' },
  nav: { flexDirection: 'row', paddingTop: 9, paddingBottom: 7, backgroundColor: '#0B0709', borderTopWidth: 1, borderTopColor: colors.border },
  navItem: { flex: 1, alignItems: 'center', gap: 3 },
  navLabel: { fontSize: 10, fontWeight: '900', color: '#7E686C' },
  active: { color: colors.red },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(2,3,7,0.82)', justifyContent: 'flex-end' },
  modalKeyboard: { width: '100%' },
  modal: { backgroundColor: '#16090C', padding: 22, borderTopLeftRadius: 27, borderTopRightRadius: 27, borderWidth: 1, borderColor: colors.border, gap: 13 },
  modalScrollContent: { flexGrow: 1, justifyContent: 'flex-end' },
  confirmModal: { backgroundColor: '#16090C', padding: 22, borderTopLeftRadius: 27, borderTopRightRadius: 27, borderWidth: 1, borderColor: colors.border, gap: 10 },
  confirmEmoji: { fontSize: 27 },
  confirmTitle: { color: colors.text, fontSize: 22, fontWeight: '900' },
  confirmCopy: { color: colors.muted, fontSize: 13, lineHeight: 20 },
  dangerButton: { flex: 1, minHeight: 48, borderRadius: 13, backgroundColor: colors.maroon, alignItems: 'center', justifyContent: 'center' },
  toast: { position: 'absolute', left: 18, right: 18, bottom: 76, minHeight: 50, paddingHorizontal: 15, borderRadius: 16, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.red, alignItems: 'center', justifyContent: 'center', elevation: 8, shadowColor: '#000000', shadowOpacity: 0.28, shadowRadius: 12, shadowOffset: { width: 0, height: 5 } },
  toastText: { color: '#1A090D', fontSize: 12.5, fontWeight: '900', textAlign: 'center' },
  modalHandle: { width: 42, height: 4, borderRadius: 2, backgroundColor: '#62333B', alignSelf: 'center', marginBottom: 2 },
  quickInput: { minHeight: 125, textAlignVertical: 'top' },
  modalActions: { flexDirection: 'row', gap: 10 },
  secondaryButton: { flex: 1, minHeight: 48, borderRadius: 13, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' },
  secondaryText: { color: '#FFB7C0', fontWeight: '900' },
})
