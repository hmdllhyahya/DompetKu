// DompetKu Version 7.5 — Fixed Edition
import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import * as XLSX from "xlsx";
import {
  Home, UserCircle, Plus, X, Search, Lock, List, BarChart2,
  CreditCard, Wallet, Smartphone, Coins, ChevronLeft, ArrowUp, ArrowDown,
  Pencil, Trash2, Camera, Shield, Download, Upload, AlertTriangle,
  Check, Volume2, VolumeX, Coffee, ShoppingCart, ShoppingBag, Car, Zap,
  Heart, BookOpen, Scissors, Briefcase, Gift, TrendingUp, MoreHorizontal,
  Monitor, Eye, EyeOff, ArrowDownLeft, ArrowUpRight, Fingerprint,
  PiggyBank, Receipt, Star, Sliders,
  ExternalLink, MapPin, Film, Train, Bus, Calendar, Clock
} from "lucide-react";

// ─── THEME ───────────────────────────────────────────────────────────────────
const G = "#2DAB7F", G2 = "#1d8a63", GL = "#E8F7F1", GM = "#b6e4d0", BG = "#F0F3F7";


// ─── LANGUAGE SYSTEM ──────────────────────────────────────────
const LANG_CTX = { lang:"id" };
const setGlobalLang = (l) => { LANG_CTX.lang = l; };
const T = (id, en, id_) => LANG_CTX.lang === "en" ? en : (id_ || id);

const TRANSLATIONS = {
  // Nav
  "Beranda": "Home", "Profil": "Profile", "Riwayat": "History",
  "Akun": "Accounts", "Analisis": "Analytics",
  // Home
  "Total Balance": "Total Balance", "Income": "Income", "Expense": "Expense",
  "Akun Saya": "My Accounts", "Lihat semua": "See all",
  "Transaksi Terakhir": "Recent Transactions",
  "Monthly Budget": "Monthly Budget", "Edit": "Edit",
  "Prediksi Keuangan": "Financial Forecast",
  "SISA ASET (EST. BLN INI)": "PROJECTED END BALANCE",
  "ASET HABIS PERKIRAAN": "ASSETS DEPLETED",
  "Surplus / Aman": "Surplus / Safe",
  // Budget
  "Atur Budget Bulanan": "Set Monthly Budget",
  "Terpakai": "Used", "Limit": "Limit", "Budget habis!": "Budget exceeded!",
  "Terapkan Budget": "Apply Budget", "hari": "days",
  // Transactions
  "Catat Transaksi": "Add Transaction", "Edit Transaksi": "Edit Transaction",
  "Pengeluaran": "Expense", "Pemasukan": "Income", "Transfer": "Transfer",
  "Simpan Transaksi": "Save Transaction", "Simpan Perubahan": "Save Changes",
  "JUMLAH (RP)": "AMOUNT (RP)", "CATATAN / NAMA TOKO": "NOTE / MERCHANT",
  "KATEGORI": "CATEGORY", "AKUN": "ACCOUNT", "TANGGAL": "DATE", "JAM": "TIME",
  // Accounts
  "Daftar Akun": "Account List", "Tambah": "Add",
  "Total Semua Akun": "Total All Accounts",
  // Charts
  "Pengeluaran per Kategori": "Expense by Category",
  "Ringkasan Mingguan": "Weekly Summary",
  "Analisis Gaya Hidup": "Lifestyle Analysis",
  "Estimasi Gaji Ideal": "Ideal Salary Estimate",
  // Profile
  "Keamanan": "Security", "Preferensi": "Preferences", "Data": "Data",
  "Kunci PIN": "PIN Lock", "Biometrik": "Biometrics",
  "Efek Suara": "Sound Effects", "Import Data": "Import Data",
  "Export CSV": "Export CSV", "Hapus Semua Data": "Delete All Data",
  "Bahasa / Language": "Language / Bahasa",
  "Tentang": "About",
};

function useLang() {
  const [lang, setLangState] = useState(()=>lsGet("dk_lang","id"));
  const setLang = (l) => { setLangState(l); lsSet("dk_lang",l); LANG_CTX.lang = l; };
  useEffect(()=>{ LANG_CTX.lang = lang; },[lang]);
  const t = (key) => {
    if(lang === "id") return key;
    return TRANSLATIONS[key] || key;
  };
  return { lang, setLang, t };
}

// ─── BRAND MAP ────────────────────────────────────────────────────────────────
const BRAND_MAP = {
  bca:       "linear-gradient(135deg,#0053A0,#2196F3)",
  bri:       "linear-gradient(135deg,#003F88,#1976D2)",
  bni:       "linear-gradient(135deg,#FF6B00,#FFA040)",
  mandiri:   "linear-gradient(135deg,#003399,#FFD700)",
  bsi:       "linear-gradient(135deg,#005C35,#34C38F)",
  cimb:      "linear-gradient(135deg,#AB1519,#FF5722)",
  permata:   "linear-gradient(135deg,#005B9F,#29B6F6)",
  danamon:   "linear-gradient(135deg,#E00000,#FF6B6B)",
  panin:     "linear-gradient(135deg,#1B3FA0,#4FC3F7)",
  ocbc:      "linear-gradient(135deg,#C8102E,#FF8A65)",
  gopay:     "linear-gradient(135deg,#00AED6,#26C6DA)",
  ovo:       "linear-gradient(135deg,#4B2D8C,#9C6FE4)",
  dana:      "linear-gradient(135deg,#108BE8,#64B5F6)",
  shopeepay: "linear-gradient(135deg,#EE4D2D,#FF8A65)",
  linkaja:   "linear-gradient(135deg,#E40C22,#FF5252)",
  jago:      "linear-gradient(135deg,#00C774,#69F0AE)",
  jenius:    "linear-gradient(135deg,#1565C0,#42A5F5)",
  blu:       "linear-gradient(135deg,#006DFF,#64B5F6)",
  seabank:   "linear-gradient(135deg,#FF6B00,#FFA726)",
  paypal:    "linear-gradient(135deg,#003087,#009CDE)",
};

const DEFAULT_GRADS = [
  "linear-gradient(135deg,#374151,#6b7280)",
  "linear-gradient(135deg,#1d4ed8,#60a5fa)",
  "linear-gradient(135deg,#7c3aed,#c084fc)",
  "linear-gradient(135deg,#0e9f6e,#34d399)",
  "linear-gradient(135deg,#b45309,#f59e0b)",
  "linear-gradient(135deg,#0369a1,#38bdf8)",
];

const GRADIENT_PRESETS = [
  ["#2DAB7F","#1d8a63"],["#1d4ed8","#60a5fa"],["#7c3aed","#c084fc"],
  ["#ef4444","#f97316"],["#0ea5e9","#6366f1"],["#ec4899","#f97316"],
  ["#374151","#6b7280"],["#b45309","#f59e0b"],["#0f766e","#06b6d4"],
  ["#be185d","#f43f5e"],["#1e40af","#7c3aed"],["#065f46","#059669"],
];

const detectBrand = name => {
  if (!name) return null;
  const l = name.toLowerCase().replace(/\s/g,"");
  for (const [k,v] of Object.entries(BRAND_MAP)) if (l.includes(k)) return v;
  return null;
};
const getAccGrad = (acc, idx=0) => acc.customGrad || detectBrand(acc.name) || DEFAULT_GRADS[idx % DEFAULT_GRADS.length];

// ─── DEEP LINKS ──────────────────────────────────────────────────────────────
const DEEP_LINKS = {
  bca:       { scheme:"mybca://",                   pkg:"com.bca",                     label:"myBCA" },
  bri:       { scheme:"id.co.bri.brimo://",          pkg:"id.co.bri.brimo",             label:"BRImo" },
  bni:       { scheme:"bnimobile://",               pkg:"src.com.bni46",               label:"BNI Mobile" },
  mandiri:   { scheme:"livin://",                   pkg:"com.bankmandiri.mandiriSmartOnline", label:"Livin'" },
  bsi:       { scheme:"bsimobile://",               pkg:"com.bsm.online",              label:"BSI Mobile" },
  cimb:      { scheme:"ocbcnisp://",                pkg:"com.cimbniaga.mobile.prod",   label:"OCBC Mobile" },
  gopay:     { scheme:"gojek://gopay",              pkg:"com.gojek.app",               label:"Gojek/GoPay" },
  ovo:       { scheme:"ovo://",                     pkg:"ovo.id",                      label:"OVO" },
  dana:      { scheme:"dana://",                    pkg:"id.dana",                     label:"DANA" },
  shopeepay: { scheme:"shopee://",                  pkg:"com.shopee.id",               label:"Shopee" },
  linkaja:   { scheme:"linkaja://",                 pkg:"com.telkom.tiphone",          label:"LinkAja" },
  jago:      { scheme:"jago://",                    pkg:"com.jago.mobile",             label:"Bank Jago" },
  jenius:    { scheme:"jenius://",                  pkg:"com.btpnjenius.jeniusapp",    label:"Jenius" },
  blu:       { scheme:"bluapp://",                  pkg:"id.co.bca.blu",               label:"blu BCA" },
  seabank:   { scheme:"seamoney://",                pkg:"id.seabank.app",              label:"SeaBank" },
};
const getDeepLink = name => {
  if (!name) return null;
  const l = name.toLowerCase().replace(/\s/g,"");
  for (const [k,v] of Object.entries(DEEP_LINKS)) if (l.includes(k)) return v;
  return null;
};

// ─── CATEGORY CONFIG ──────────────────────────────────────────────────────────
const SMART_RULES = [
  { kw:["indomaret","alfamart","lawson","minimarket","superindo","giant","hypermart","carrefour","transmart","hero","lottemart","yogya","matahari","department"], cat:"Belanja Harian" },
  { kw:["gofood","grabfood","shopeefood","kfc","mcdonalds","burger","pizza","starbucks","kopi","bakso","warteg","makan","resto","cafe","coffee","padang","nasi","sushi","ramen","boba","geprek","ayam","mie","soto","pempek","martabak","bubur","dim sum","hotpot","bbq"], cat:"Makan & Minum" },
  { kw:["tokopedia","shopee","lazada","bukalapak","blibli","tiktok shop","zalora","uniqlo","zara","h&m","ikea","ace hardware","electronic city","erafone","ibox","apple store"], cat:"Belanja Online" },
  { kw:["grab","gojek","ojek","maxim","busway","transjakarta","kereta","mrt","lrt","commuter","bensin","pertamina","shell","vivo","bp","parkir","tol","damri","angkot","becak","bajaj","taksi","blue bird","express","mypertamina"], cat:"Transportasi" },
  { kw:["netflix","spotify","youtube","disney","vidio","game","bioskop","cinema","cgv","xxi","imax","platinum","ps4","ps5","playstation","nintendo","xbox","steam","valorant","mobile legend","mlbb","genshin","roblox","concert","konser","festival","event"], cat:"Hiburan" },
  { kw:["pln","listrik","pdam","air","internet","wifi","indihome","telkom","xl","telkomsel","axis","smartfren","pulsa","token","by.u","im3","tri"], cat:"Tagihan" },
  { kw:["apotek","klinik","dokter","rumah sakit","bpjs","obat","vitamin","halodoc","alodokter","kimia farma","guardian","century","suplemen","masker","antiseptik"], cat:"Kesehatan" },
  { kw:["sekolah","kuliah","les","kursus","buku","gramedia","ruangguru","zenius","coursera","udemy","skillshare","seminar","workshop"], cat:"Pendidikan" },
  { kw:["kost","kontrakan","sewa","kpr","cicilan","pdam","ipkl","ipl"], cat:"Tempat Tinggal" },
  { kw:["salon","barber","potong","spa","facial","gym","fitness","pilates","yoga","nail art","skincare","wardah","emina","scarlett","body lotion","parfum","deodorant"], cat:"Perawatan" },
  { kw:["gaji","salary","thr","bonus","insentif","rapel"], cat:"Gaji" },
  { kw:["freelance","project","proyek","honor","fee","jasa","invoice","payment"], cat:"Freelance" },
  { kw:["transfer","kiriman","hadiah","kado","angpau"], cat:"Hadiah" },
  { kw:["investasi","saham","reksa","deposito","dividen","bunga","bibit","ajaib","stockbit","indopremier","sbr","obligasi","emas","logam mulia","antam"], cat:"Investasi" },
  { kw:["mobil","motor","byd","tesla","xpander","avanza","fortuner","innova","hrv","crv","civic","pajero","veloz","rush","agya","brio","beat","vario","pcx","nmax","helm","ban","servis","bengkel"], cat:"Transportasi" },
  { kw:["laptop","komputer","pc","monitor","keyboard","mouse","headphone","earphone","speaker","tv","kulkas","mesin cuci","ac","dispenser","rice cooker","blender","hp","handphone","tablet","iphone","samsung","xiaomi","oppo","vivo","realme"], cat:"Belanja Online" },
];

// Suggest new category when nothing matches but note has specific product keywords
const SUGGEST_RULES = [
  { kw:["ps5","ps4","playstation","nintendo switch","xbox","steam deck"], sug:"Elektronik Hiburan" },
  { kw:["mobil","motor","byd","tesla","xpander"], sug:"Kendaraan" },
  { kw:["laptop","pc","komputer","monitor"], sug:"Elektronik Kerja" },
];

const suggestCategory = (note) => {
  if(!note) return null;
  const l = note.toLowerCase();
  for(const r of SUGGEST_RULES) if(r.kw.some(k=>l.includes(k))) return r.sug;
  return null;
};
const CATS_EXP = ["Makan & Minum","Belanja Harian","Belanja Online","Transportasi","Hiburan","Tagihan","Kesehatan","Pendidikan","Tempat Tinggal","Perawatan","Penyesuaian Saldo","Lainnya"];
const CATS_INC = ["Gaji","Freelance","Hadiah","Investasi","Penyesuaian Saldo","Lainnya"];
const CAT_ICON = (cat,sz=16,col="currentColor") => {
  const p={size:sz,strokeWidth:1.7,color:col};
  return ({
    "Makan & Minum":<Coffee {...p}/>,"Belanja Harian":<ShoppingCart {...p}/>,"Belanja Online":<ShoppingBag {...p}/>,
    "Transportasi":<Car {...p}/>,"Hiburan":<Monitor {...p}/>,"Tagihan":<Zap {...p}/>,
    "Kesehatan":<Heart {...p}/>,"Pendidikan":<BookOpen {...p}/>,"Tempat Tinggal":<Home {...p}/>,
    "Perawatan":<Scissors {...p}/>,"Gaji":<Briefcase {...p}/>,"Freelance":<PiggyBank {...p}/>,
    "Hadiah":<Gift {...p}/>,"Investasi":<TrendingUp {...p}/>,"Lainnya":<MoreHorizontal {...p}/>,
    "Penyesuaian Saldo":<Sliders {...p}/>,
  })[cat] || <MoreHorizontal {...p}/>;
};
const CAT_COLORS = {"Makan & Minum":"#ef4444","Belanja Harian":"#f97316","Belanja Online":"#ec4899","Transportasi":"#3b82f6","Hiburan":"#f59e0b","Tagihan":"#8b5cf6","Kesehatan":"#10b981","Pendidikan":"#06b6d4","Tempat Tinggal":"#6366f1","Perawatan":"#f472b6","Gaji":"#22c55e","Freelance":"#84cc16","Hadiah":"#a78bfa","Investasi":"#34d399","Lainnya":"#9ca3af","Penyesuaian Saldo":"#9ca3af"};
const CAT_BG = {"Makan & Minum":"#fee2e2","Belanja Harian":"#ffedd5","Belanja Online":"#fce7f3","Transportasi":"#dbeafe","Hiburan":"#fef3c7","Tagihan":"#ede9fe","Kesehatan":"#d1fae5","Pendidikan":"#cffafe","Tempat Tinggal":"#e0e7ff","Perawatan":"#fce7f3","Gaji":"#dcfce7","Freelance":"#ecfccb","Hadiah":"#ede9fe","Investasi":"#d1fae5","Lainnya":"#f3f4f6","Penyesuaian Saldo":"#f3f4f6"};

const ACC_TYPES = [
  { type:"cash",    label:"Dompet / Tunai", Icon:({s=18})=><Wallet size={s} strokeWidth={1.7}/> },
  { type:"debit",   label:"Rekening Debit", Icon:({s=18})=><CreditCard size={s} strokeWidth={1.7}/> },
  { type:"credit",  label:"Kartu Kredit",   Icon:({s=18})=><CreditCard size={s} strokeWidth={1.7}/> },
  { type:"ewallet", label:"E-Wallet",       Icon:({s=18})=><Smartphone size={s} strokeWidth={1.7}/> },
  { type:"emoney",  label:"E-Money",        Icon:({s=18})=><Coins size={s} strokeWidth={1.7}/> },
];
const EWALLETS = ["GoPay","OVO","DANA","ShopeePay","LinkAja","Blu","Jago","SeaBank","Jenius","Lainnya"];
const EMONEYS  = ["Flazz BCA","e-money Mandiri","Brizzi BRI","TapCash BNI","Lainnya"];
const BANKS    = ["BCA","BRI","BNI","Mandiri","BSI","CIMB Niaga","Permata","Danamon","Panin","OCBC","Lainnya"];

const smartDetect = note => {
  if (!note) return null;
  const l = note.toLowerCase();
  for (const r of SMART_RULES) if (r.kw.some(k=>l.includes(k))) return r;
  return null;
};

const getTxnDetailFields = (txn) => {
  const note = (txn.note||"").toLowerCase();
  const cat  = txn.category||"";
  if (cat==="Transportasi") {
    if (note.includes("transjakarta")||note.includes("busway")||note.includes("tj")) return [{key:"koridor",label:"Koridor",placeholder:"cth: Koridor 1 - Blok M-Kota",icon:<Bus size={14}/>}];
    if (note.includes("mrt")||note.includes("lrt")||note.includes("kereta")||note.includes("commuter")||note.includes("krl")) return [
        {key:"dari_stasiun",label:"Dari Stasiun",placeholder:"cth: Stasiun Sudirman",icon:<Train size={14}/>},
        {key:"ke_stasiun",  label:"Ke Stasiun",  placeholder:"cth: Stasiun Depok",   icon:<Train size={14}/>},
    ];
    if (note.includes("grab")||note.includes("gojek")||note.includes("ojek")) return [{key:"rute",label:"Rute Perjalanan",placeholder:"cth: Kuningan → Senayan",icon:<MapPin size={14}/>}];
    return [{key:"rute",label:"Rute / Keterangan",placeholder:"cth: Rumah → Kantor",icon:<MapPin size={14}/>}];
  }
  if (cat==="Hiburan") {
    if (note.includes("bioskop")||note.includes("cinema")||note.includes("cgv")||note.includes("xxi")||note.includes("imax")||note.includes("platinum")) return [
        {key:"bioskop", label:"Nama Bioskop", placeholder:"cth: CGV Grand Indonesia",icon:<Film size={14}/>},
        {key:"film",    label:"Judul Film",   placeholder:"cth: Interstellar",        icon:<Film size={14}/>},
    ];
    return [{key:"keterangan",label:"Keterangan",placeholder:"cth: Genre, platform, dll.",icon:<Monitor size={14}/>}];
  }
  if (cat==="Makan & Minum") {
    if (note.includes("gofood")||note.includes("grabfood")||note.includes("shopeefood")) return [
        {key:"restoran",label:"Nama Restoran",placeholder:"cth: Geprek Bensu",icon:<Coffee size={14}/>},
        {key:"menu",    label:"Menu Favorit", placeholder:"cth: Ayam geprek + es teh",icon:<Coffee size={14}/>},
    ];
    return [{key:"tempat",label:"Nama Tempat",placeholder:"cth: Warteg Pak Dhe",icon:<Coffee size={14}/>}];
  }
  if (cat==="Belanja Online") return [
      {key:"toko",   label:"Nama Toko / Seller",placeholder:"cth: Toko Elektronik123",icon:<ShoppingBag size={14}/>},
      {key:"item",   label:"Barang Dibeli",      placeholder:"cth: Charger USB-C 65W",  icon:<ShoppingBag size={14}/>},
  ];
  if (cat==="Kesehatan") return [{key:"klinik",label:"Nama Klinik / Apotek",placeholder:"cth: Klinik Sehat Jaya",icon:<Heart size={14}/>}];
  return [{key:"catatan_detail",label:"Catatan Tambahan",placeholder:"Tambahkan catatan...",icon:<Receipt size={14}/>}];
};

// ─── HELPERS & WEBAUTHN ──────────────────────────────────────────────────────
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

const getBioChallenge = () => {
  const c = new Uint8Array(32); window.crypto.getRandomValues(c); return c;
};
const enableBiometrics = async () => {
  if (!window.PublicKeyCredential) { alert("Browser/Perangkat tidak mendukung Biometrik."); return false; }
  try {
    const cred = await navigator.credentials.create({
      publicKey: {
        challenge: getBioChallenge(), rp: { name: "DompetKu App" },
        user: { id: getBioChallenge(), name: "user@dompetku", displayName: "Pengguna DompetKu" },
        pubKeyCredParams: [{ type: "public-key", alg: -7 }, { type: "public-key", alg: -257 }],
        authenticatorSelection: { authenticatorAttachment: "platform", userVerification: "required" },
        timeout: 60000,
      }
    });
    return !!cred;
  } catch (err) { alert("Gagal mengaktifkan biometrik: " + err.message); return false; }
};
const verifyBiometrics = async () => {
  if (!window.PublicKeyCredential) return false;
  try {
    const assertion = await navigator.credentials.get({
      publicKey: { challenge: getBioChallenge(), userVerification: "required", timeout: 60000 }
    });
    return !!assertion;
  } catch (err) { return false; }
};

const fmt       = n => "Rp " + Math.abs(n).toLocaleString("id-ID");
const fmtShort  = n => { const abs=Math.abs(n); if(abs>=1e9)return(n/1e9).toFixed(1).replace(/\.0$/,"")+"M"; if(abs>=1e6)return(n/1e6).toFixed(1).replace(/\.0$/,"")+"jt"; if(abs>=1e3)return(n/1e3).toFixed(1).replace(/\.0$/,"")+"rb"; return String(n); };
const mask      = _ => "Rp ••••";

const getLocalISOString = (d = new Date()) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0,10);
const todayStr  = () => getLocalISOString();
const nowTime   = () => new Date().toTimeString().slice(0,5);
const startOfWeek  = () => { 
  const d=new Date(); const day=d.getDay(); const diff=d.getDate()-day+(day===0?-6:1); d.setDate(diff); 
  return getLocalISOString(d); 
};
const startOfMonth = () => { const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-01`; };

const daysLeftMonth = () => { const d=new Date(); return new Date(d.getFullYear(),d.getMonth()+1,0).getDate() - d.getDate(); };
const greeting  = () => { const h=new Date().getHours(); return h<12?"Selamat Pagi":h<15?"Selamat Siang":h<18?"Selamat Sore":"Selamat Malam"; };
const fmtDate   = () => { const d=new Date(); return d.toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short",year:"2-digit"}); };
const labelDate = s => {
  const td=todayStr(), yd=new Date(); yd.setDate(yd.getDate()-1);
  if(s===td) return "HARI INI";
  if(s===getLocalISOString(yd)) return "KEMARIN";
  return new Date(s).toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"}).toUpperCase();
};
const fmtNum    = raw => { const n=parseInt((raw||"").replace(/\D/g,"")||"0"); return n?n.toLocaleString("id-ID"):""; };
const parseNum  = str => parseInt((str||"").replace(/\./g,"").replace(/,/g,"")||"0");
const sortByDateDesc = (a, b) => new Date(`${b.date}T${b.time||"00:00"}`).getTime() - new Date(`${a.date}T${a.time||"00:00"}`).getTime();

// localStorage
const lsGet = (k,def) => { try { const v=localStorage.getItem(k); return v!=null?JSON.parse(v):def; } catch { return def; } };
const lsSet = (k,v)   => { try { localStorage.setItem(k,JSON.stringify(v)); } catch {} };

// IndexedDB for attachment blobs
const IDB = {
  _db:null,
  open(){ if(this._db)return Promise.resolve(this._db); return new Promise((res,rej)=>{ const req=indexedDB.open("dompetku_v6",1); req.onupgradeneeded=e=>{const db=e.target.result;if(!db.objectStoreNames.contains("blobs"))db.createObjectStore("blobs");}; req.onsuccess=e=>{this._db=e.target.result;res(this._db);}; req.onerror=()=>rej(req.error); }); },
  async put(key,val){ const db=await this.open(); return new Promise((res,rej)=>{ const tx=db.transaction("blobs","readwrite"); tx.objectStore("blobs").put(val,key); tx.oncomplete=res; tx.onerror=()=>rej(tx.error); }); },
  async get(key){ const db=await this.open(); return new Promise((res,rej)=>{ const tx=db.transaction("blobs","readonly"); const req=tx.objectStore("blobs").get(key); req.onsuccess=()=>res(req.result); req.onerror=()=>rej(req.error); }); },
  async del(key){ const db=await this.open(); return new Promise((res,rej)=>{ const tx=db.transaction("blobs","readwrite"); tx.objectStore("blobs").delete(key); tx.oncomplete=res; tx.onerror=()=>rej(tx.error); }); },
};

const hashPin = async pin => {
  if (!crypto.subtle) throw new Error("Crypto API unavailable");
  const data = new TextEncoder().encode("dompetku_2025:" + pin);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,"0")).join("");
};

let _audioCtx = null;
const getAudioCtx = () => {
  try {
    if (!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return _audioCtx;
  } catch {
    return null;
  }
};

const playTxnSound = type => {
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;

    // 3 separate oscillators for 3 clean notes
    const notes = type === "expense"
      ? [{ f:523, t:0.00 }, { f:415, t:0.14 }, { f:330, t:0.28 }]   // descending — C5, Ab4, E4
      : type === "transfer"
      ? [{ f:440, t:0.00 }, { f:440, t:0.14 }, { f:440, t:0.28 }]   // flat — A4, A4, A4
      : [{ f:392, t:0.00 }, { f:523, t:0.14 }, { f:659, t:0.28 }];   // ascending — G4, C5, E5

    notes.forEach(({ f, t }) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(f, ctx.currentTime + t);
      gain.gain.setValueAtTime(0, ctx.currentTime + t);
      gain.gain.linearRampToValueAtTime(0.20, ctx.currentTime + t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.13);
      osc.start(ctx.currentTime + t);
      osc.stop(ctx.currentTime + t + 0.14);
    });
  } catch {}
};

// ─── SHARED UI ────────────────────────────────────────────────────────────────
const Card    = ({children,style={}}) => <div style={{background:"#fff",borderRadius:18,padding:"16px",boxShadow:"0 2px 12px rgba(0,0,0,0.05)",marginBottom:12,...style}}>{children}</div>;
const Row     = ({children,style={}}) => <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",...style}}>{children}</div>;
const BtnG    = ({onClick,children,style={},disabled=false}) => <button type="button" onClick={onClick} disabled={disabled} style={{width:"100%",padding:"15px",background:disabled?"#d1d5db":G,border:"none",borderRadius:16,color:"#fff",fontSize:15,fontWeight:700,cursor:disabled?"not-allowed":"pointer",boxShadow:disabled?"none":`0 6px 20px ${G}40`,...style}}>{children}</button>;
const Inp     = ({label,children,mb=10,style={}}) => <div style={{background:"#fff",borderRadius:14,padding:"12px 14px",marginBottom:mb,boxShadow:"0 1px 4px rgba(0,0,0,0.05)",...style}}>{label&&<p style={{margin:"0 0 4px",fontSize:10,color:"#9ca3af",fontWeight:700,letterSpacing:.6}}>{label}</p>}{children}</div>;
const Tog     = ({on,onToggle}) => <button type="button" onClick={onToggle} style={{width:44,height:24,borderRadius:99,background:on?G:"#d1d5db",cursor:"pointer",position:"relative",transition:"background .2s",flexShrink:0,border:"none",outline:"none"}}><div style={{position:"absolute",top:3,left:on?23:3,width:18,height:18,borderRadius:"50%",background:"#fff",boxShadow:"0 1px 4px rgba(0,0,0,0.2)",transition:"left .2s"}}/></button>;
const CatBub  = ({cat,size=44}) => <div style={{width:size,height:size,borderRadius:size*0.32,background:CAT_BG[cat]||"#f3f4f6",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:CAT_COLORS[cat]||"#9ca3af"}}>{CAT_ICON(cat,size*0.42)}</div>;
const SRow    = ({icon,bg=GL,title,sub,right,danger=false}) => <div style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",borderBottom:"1px solid #f8fafc"}}><div style={{width:38,height:38,borderRadius:12,background:bg,display:"flex",alignItems:"center",justifyContent:"center",color:danger?"#ef4444":G,flexShrink:0}}>{icon}</div><div style={{flex:1}}><p style={{margin:0,fontSize:13,fontWeight:600,color:danger?"#ef4444":"#111"}}>{title}</p>{sub&&<p style={{margin:"2px 0 0",fontSize:11,color:"#9ca3af"}}>{sub}</p>}</div>{right}</div>;

const BottomSheet = ({onClose,title,children}) => (
  <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",display:"flex",alignItems:"flex-end",zIndex:200,backdropFilter:"blur(4px)"}} onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div style={{background:"#f8fafc",width:"100%",maxWidth:430,margin:"0 auto",borderRadius:"24px 24px 0 0",padding:"20px 16px 36px",maxHeight:"93vh",overflowY:"auto"}}>
      <Row style={{marginBottom:16}}><h2 style={{margin:0,fontSize:17,fontWeight:800,color:"#111"}}>{title}</h2><button type="button" onClick={onClose} style={{background:"#e5e7eb",border:"none",borderRadius:9,width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#374151"}}><X size={14}/></button></Row>
      {children}
    </div>
  </div>
);

function TransferModal({ accounts, onClose, onTransfer }) {
  const [fromId, setFromId] = useState(accounts[0]?.id ? String(accounts[0].id) : "");
  const [toId, setToId]     = useState(accounts[1]?.id ? String(accounts[1].id) : "");
  const [amountStr, setAmountStr] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(todayStr());

  const handleSubmit = () => {
    const amount = parseNum(amountStr);
    if (!amount || !fromId || !toId || fromId === toId) return;
    onTransfer({ fromId, toId, amount, note, date });
  };

  return (
    <BottomSheet onClose={onClose} title="Transfer Antar Akun">
      {accounts.length < 2
        ? <Card><p style={{margin:0,fontSize:13,color:"#6b7280"}}>Minimal butuh 2 akun untuk transfer.</p></Card>
        : <>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
              {[{label:"DARI AKUN",val:fromId,set:setFromId},{label:"KE AKUN",val:toId,set:setToId}].map(({label,val,set})=>{
                const selAcc=accounts.find(a=>String(a.id)===String(val));
                const grad=selAcc?getAccGrad(selAcc,accounts.indexOf(selAcc)):"#e5e7eb";
                return(
                <div key={label} style={{borderRadius:14,overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,0.08)"}}>
                  <div style={{background:grad,padding:"8px 12px 4px"}}><p style={{margin:0,fontSize:9,fontWeight:800,color:"rgba(255,255,255,0.8)",letterSpacing:.5}}>{label}</p></div>
                  <select value={val} onChange={e=>set(e.target.value)} style={{width:"100%",background:"#f8fafc",border:"none",outline:"none",fontSize:13,fontWeight:600,color:"#111",padding:"8px 12px",WebkitAppearance:"none"}}>
                    {accounts.map(a=><option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                </div>
                );
              })}
            </div>
            <Inp label="JUMLAH (RP)">
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:18,fontWeight:700,color:"#9ca3af"}}>Rp</span>
                <input inputMode="numeric" placeholder="0" value={amountStr} onChange={e=>setAmountStr(fmtNum(e.target.value))} style={{flex:1,background:"transparent",border:"none",outline:"none",fontSize:22,fontWeight:800,color:"#111"}}/>
              </div>
            </Inp>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
              <Inp label="TANGGAL" mb={0}><input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{width:"100%",background:"transparent",border:"none",outline:"none",fontSize:13,fontWeight:600,color:"#111"}}/></Inp>
              <Inp label="CATATAN (OPSIONAL)" mb={0}><input value={note} onChange={e=>setNote(e.target.value)} placeholder="cth: Tabungan..." style={{width:"100%",background:"transparent",border:"none",outline:"none",fontSize:13,color:"#111"}}/></Inp>
            </div>
            <BtnG onClick={handleSubmit} disabled={!parseNum(amountStr)||!fromId||!toId||fromId===toId}>Transfer Sekarang</BtnG>
          </>
      }
    </BottomSheet>
  );
}

const ConfirmDialog = ({title,sub,onConfirm,onCancel,danger=true,confirmLabel="Ya, Lanjutkan"}) => (
  <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
    <div style={{background:"#fff",borderRadius:20,padding:"24px",maxWidth:340,width:"100%",textAlign:"center"}}>
      <div style={{color:danger?"#ef4444":"#f59e0b",display:"flex",justifyContent:"center",marginBottom:10}}><AlertTriangle size={44}/></div>
      <p style={{fontSize:16,fontWeight:800,color:"#111",margin:"0 0 8px"}}>{title}</p>
      <p style={{fontSize:13,color:"#6b7280",marginBottom:20}}>{sub}</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <button type="button" onClick={onCancel} style={{padding:"13px",background:"#f1f5f9",border:"1.5px solid #e5e7eb",borderRadius:14,fontSize:14,fontWeight:700,cursor:"pointer",color:"#374151"}}>Batal</button>
        <button type="button" onClick={onConfirm} style={{padding:"13px",background:danger?"#ef4444":G,border:"none",borderRadius:14,color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer"}}>{confirmLabel}</button>
      </div>
    </div>
  </div>
);

// ─── FONT INJECTION ──────────────────────────────────────────────────────────
function FontLoader() {
  useEffect(() => {
    // Fix viewport for Capacitor/WebView — ensures full-width rendering on all screen sizes
    let vp = document.querySelector("meta[name='viewport']");
    if (!vp) { vp = document.createElement("meta"); vp.name = "viewport"; document.head.appendChild(vp); }
    vp.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover";
    // Ensure body has no margin/whitespace
    document.documentElement.style.cssText = "width:100%;height:100%;margin:0;padding:0;overflow-x:hidden;";
    document.body.style.cssText = "width:100%;min-height:100%;margin:0;padding:0;overflow-x:hidden;";
    // Font
    if (document.getElementById("outfit-font")) return;
    const link = document.createElement("link");
    link.id = "outfit-font"; link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap";
    document.head.appendChild(link);
  }, []);
  return null;
}
function DompetKuLogo({ size=28, color="#fff" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect x="2" y="9" width="21" height="15" rx="3.5" stroke={color} strokeWidth="2"/>
      <path d="M15 14h8a2 2 0 010 4h-8" stroke={color} strokeWidth="1.9" fill="none"/>
      <circle cx="19.5" cy="16" r="1.4" fill={color}/>
      <path d="M24 21.5 C27 19.5 29.5 17 29 14" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M24.5 18 C27 16 29 13.5 28.5 11" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M24 14.5 C26 12.5 27 10 26 8.5" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}

// ─── PIN SCREEN ───────────────────────────────────────────────────────────────
function PinScreen({ mode="unlock", savedHash, bioEnabled, onUnlock, onSetPin, onCancel }) {
  const [input,   setInput]   = useState("");
  const [confirm, setConfirm] = useState("");
  const [step,    setStep]    = useState("enter");
  const [err,     setErr]     = useState("");
  
  const handleDigit = async d => {
    const n = (step==="confirm" ? confirm : input) + d;
    if (step==="confirm") setConfirm(n); else setInput(n);
    setErr("");
    
    if (n.length === 4) {
      if (mode==="set") {
        if (step==="enter") { setStep("confirm"); }
        else { 
          if(n===input){
            try { const h = await hashPin(n); onSetPin(h); } 
            catch { setErr("Sistem tidak didukung"); setInput(""); setConfirm(""); setStep("enter"); }
          } else { setErr("PIN tidak cocok"); setInput(""); setConfirm(""); setStep("enter"); }
        }
      } else {
        try {
          const h = await hashPin(n);
          if (h === savedHash) { onUnlock(); } else { setErr("PIN salah"); setInput(""); }
        } catch { setErr("Error Verifikasi"); setInput(""); }
      }
    }
  };
  
  const del = () => { if(step==="confirm")setConfirm(c=>c.slice(0,-1)); else setInput(i=>i.slice(0,-1)); };
  
  const handleBio = async () => { 
    const verified = await verifyBiometrics();
    if (verified) onUnlock(); else setErr("Biometrik gagal/dibatalkan.");
  };

  const cur = step==="confirm"?confirm:input;
  return (
    <div style={{position:"fixed",inset:0,background:`linear-gradient(160deg,${G},${G2})`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",zIndex:400,padding:24}}>
      <DompetKuLogo size={48}/>
      <p style={{color:"#fff",fontSize:20,fontWeight:800,marginTop:16,marginBottom:4}}>DompetKu</p>
      <p style={{color:"rgba(255,255,255,0.75)",fontSize:13,marginBottom:32}}>{mode==="set"?(step==="enter"?"Buat PIN 4 Digit":"Konfirmasi PIN"):"Masukkan PIN"}</p>
      <div style={{display:"flex",gap:14,marginBottom:12}}>{[0,1,2,3].map(i=><div key={i} style={{width:16,height:16,borderRadius:"50%",background:cur.length>i?"#fff":"rgba(255,255,255,0.3)",transition:"background .15s"}}/>)}</div>
      {err&&<p style={{color:"#fca5a5",fontSize:13,marginBottom:8}}>{err}</p>}
      
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,width:240,marginTop:16}}>
        {[1,2,3,4,5,6,7,8,9, (mode==="unlock" && bioEnabled ? "BIO" : ""), 0, "⌫"].map((d,i)=>(
          <button type="button" key={i} onClick={()=>d==="⌫"?del():d==="BIO"?handleBio():d!==""?handleDigit(String(d)):null} disabled={d===""}
            style={{height:64,borderRadius:16,background:d==="⌫"||d==="BIO"?"rgba(255,255,255,0.15)":d===""?"transparent":"rgba(255,255,255,0.2)",border:"none",color:"#fff",fontSize:d==="⌫"?18:22,fontWeight:700,cursor:d===""?"default":"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
            {d==="⌫" ? <ChevronLeft size={22} strokeWidth={2}/> : d==="BIO" ? <Fingerprint size={26} strokeWidth={1.8}/> : d}
          </button>
        ))}
      </div>
      {onCancel&&<button type="button" onClick={onCancel} style={{marginTop:24,background:"none",border:"none",color:"rgba(255,255,255,0.7)",fontSize:14,cursor:"pointer"}}>Batal</button>}
    </div>
  );
}

// ─── ONBOARDING ───────────────────────────────────────────────────────────────
const JOBS = ["Pelajar / Mahasiswa","Guru / Dosen","PNS / ASN","Karyawan Swasta","Wiraswasta / Pengusaha","Freelancer","Dokter / Tenaga Medis","Engineer / Programmer","Desainer / Kreator","Buruh / Pekerja Harian","Ibu Rumah Tangga","Pensiunan","Belum Bekerja","Lainnya"];
const EDUS = ["SD / Sederajat","SMP / Sederajat","SMA / SMK / Sederajat","Diploma (D1-D3)","Sarjana (S1)","Magister (S2)","Doktor (S3)","Tidak Ingin Menyebutkan"];

function OnboardingScreen({ onDone }) {
  const [step,setStep]=useState(0);
  const [name,setName]=useState("");
  const [age,setAge]=useState("");
  const [job,setJob]=useState("");
  const [edu,setEdu]=useState("");
  const touchStartX=useRef(0);
  const slides=[
    {icon:"💰",title:"Catat Keuanganmu",desc:"Lacak setiap pemasukan dan pengeluaran dengan mudah dan cepat."},
    {icon:"📊",title:"Analisis Pengeluaran",desc:"Visualisasi lengkap kategori pengeluaranmu setiap bulan."},
    {icon:"🎯",title:"Capai Target Tabungan",desc:"Set budget bulanan dan pantau progress tabunganmu."},
  ];
  // steps: 0,1,2 = slides; 3=nama; 4=umur; 5=pekerjaan; 6=pendidikan
  const TOTAL_PROFILE_STEPS = 4; // name, age, job, edu
  const inSlides = step < slides.length;
  const profileStep = step - slides.length; // 0..3

  const handleTouchStart = e => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = e => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50 && inSlides) {
      if (dx < 0 && step < slides.length - 1) setStep(s=>s+1);
      else if (dx > 0 && step > 0) setStep(s=>s-1);
    }
  };

  const canNext = () => {
    if(inSlides) return true;
    if(profileStep===0) return !!name.trim();
    if(profileStep===1) return !!age;
    if(profileStep===2) return !!job;
    if(profileStep===3) return !!edu;
    return true;
  };

  const handleNext = () => {
    if(!canNext()) return;
    const totalSteps = slides.length + TOTAL_PROFILE_STEPS;
    if(step < totalSteps - 1) { setStep(s=>s+1); return; }
    onDone({ name:name.trim(), age:parseInt(age)||0, job, edu });
  };

  const inputStyle = {width:"100%",background:"rgba(255,255,255,0.2)",border:"2px solid rgba(255,255,255,0.3)",borderRadius:16,padding:"16px",color:"#fff",fontSize:18,fontWeight:700,outline:"none",marginBottom:16,boxSizing:"border-box"};
  const selectStyle = {width:"100%",background:"rgba(255,255,255,0.15)",border:"2px solid rgba(255,255,255,0.3)",borderRadius:16,padding:"14px 16px",color:"#fff",fontSize:15,fontWeight:600,outline:"none",marginBottom:16,boxSizing:"border-box",WebkitAppearance:"none"};

  return (
    <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} style={{fontFamily:"'Outfit',sans-serif",background:`linear-gradient(160deg,${G},${G2})`,minHeight:"100vh",width:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:32}}>
      <FontLoader/>
      {inSlides ? (
        <div style={{textAlign:"center",width:"100%"}}>
          <div style={{fontSize:72,marginBottom:24}}>{slides[step].icon}</div>
          <p style={{color:"#fff",fontSize:22,fontWeight:800,margin:"0 0 12px"}}>{slides[step].title}</p>
          <p style={{color:"rgba(255,255,255,0.8)",fontSize:15,marginBottom:40,lineHeight:1.6}}>{slides[step].desc}</p>
          <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:32}}>
            {slides.map((_,i)=><div key={i} style={{width:i===step?24:8,height:8,borderRadius:4,background:i===step?"#fff":"rgba(255,255,255,0.4)",transition:"width .3s"}}/>)}
          </div>
          <p style={{color:"rgba(255,255,255,0.5)",fontSize:12,marginBottom:12}}>Swipe atau tekan Lanjut</p>
          <BtnG onClick={handleNext} style={{background:"rgba(255,255,255,0.25)",boxShadow:"none"}}>Lanjut →</BtnG>
        </div>
      ) : (
        <div style={{width:"100%"}}>
          <DompetKuLogo size={44}/>
          {/* Progress dots for profile steps */}
          <div style={{display:"flex",gap:8,marginTop:16,marginBottom:24}}>
            {Array.from({length:TOTAL_PROFILE_STEPS}).map((_,i)=><div key={i} style={{flex:i===profileStep?2:1,height:4,borderRadius:4,background:i<=profileStep?"#fff":"rgba(255,255,255,0.3)",transition:"all .3s"}}/>)}
          </div>

          {profileStep===0&&(<>
            <p style={{color:"#fff",fontSize:24,fontWeight:800,margin:"0 0 8px"}}>Siapa namamu?</p>
            <p style={{color:"rgba(255,255,255,0.75)",fontSize:14,marginBottom:20}}>Kami akan menyapamu dengan nama ini.</p>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nama kamu..." style={inputStyle}/>
          </>)}

          {profileStep===1&&(<>
            <p style={{color:"#fff",fontSize:24,fontWeight:800,margin:"0 0 8px"}}>Berapa umurmu?</p>
            <p style={{color:"rgba(255,255,255,0.75)",fontSize:14,marginBottom:20}}>Membantu kami menyesuaikan analisis keuangan.</p>
            <input type="number" min="10" max="100" value={age} onChange={e=>setAge(e.target.value)} placeholder="Contoh: 22" style={inputStyle}/>
          </>)}

          {profileStep===2&&(<>
            <p style={{color:"#fff",fontSize:24,fontWeight:800,margin:"0 0 8px"}}>Pekerjaanmu sekarang?</p>
            <p style={{color:"rgba(255,255,255,0.75)",fontSize:14,marginBottom:20}}>Untuk analisis gaya hidup yang akurat.</p>
            <select value={job} onChange={e=>setJob(e.target.value)} style={selectStyle}>
              <option value="" style={{color:"#999"}}>Pilih pekerjaan...</option>
              {JOBS.map(j=><option key={j} value={j} style={{color:"#111"}}>{j}</option>)}
            </select>
          </>)}

          {profileStep===3&&(<>
            <p style={{color:"#fff",fontSize:24,fontWeight:800,margin:"0 0 8px"}}>Pendidikan terakhirmu?</p>
            <p style={{color:"rgba(255,255,255,0.75)",fontSize:14,marginBottom:20}}>Digunakan untuk rekomendasi karir yang relevan.</p>
            <select value={edu} onChange={e=>setEdu(e.target.value)} style={selectStyle}>
              <option value="" style={{color:"#999"}}>Pilih pendidikan...</option>
              {EDUS.map(e=><option key={e} value={e} style={{color:"#111"}}>{e}</option>)}
            </select>
          </>)}

          <div style={{display:"flex",gap:10}}>
            {step>0&&<button type="button" onClick={()=>setStep(s=>s-1)} style={{flex:1,padding:"14px",background:"rgba(255,255,255,0.15)",border:"none",borderRadius:14,color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer"}}>← Kembali</button>}
            <BtnG onClick={handleNext} disabled={!canNext()} style={{flex:2,background:"rgba(255,255,255,0.25)",boxShadow:"none"}}>{profileStep===TOTAL_PROFILE_STEPS-1?"Mulai Sekarang →":"Lanjut →"}</BtnG>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SMART BUDGET MODAL ───────────────────────────────────────────────────────
function BudgetModal({ totalBalance, currentBudget, savedPct, onApply, onClose }) {
  const daysLeft  = daysLeftMonth();
  const [savePct,  setSavePct]  = useState(savedPct ?? 20);
  const [custom,   setCustom]   = useState("");
  const [useCustom,setUseCustom]= useState(false);
  const saving    = Math.round(totalBalance * savePct / 100);
  const spendable = Math.max(0, totalBalance - saving);
  const sugDaily  = daysLeft > 0 ? Math.floor(spendable / daysLeft) : 0;
  const finalBudget = useCustom ? Math.max(0, parseNum(custom)||0) : spendable;
  return (
    <BottomSheet onClose={onClose} title="Atur Budget Bulanan">
      <Card style={{background:`linear-gradient(135deg,${G},${G2})`,marginBottom:12}}>
        <p style={{color:"rgba(255,255,255,0.8)",fontSize:12,margin:"0 0 4px"}}>Total Saldo Saat Ini</p>
        <p style={{color:"#fff",fontSize:22,fontWeight:800,margin:"0 0 10px"}}>{fmt(totalBalance)}</p>
        <Row><span style={{color:"rgba(255,255,255,0.8)",fontSize:12}}>Sisa hari bulan ini</span><span style={{color:"#fff",fontWeight:700,fontSize:13}}>{daysLeft} hari</span></Row>
      </Card>
      <Card style={{marginBottom:12}}>
        <Row style={{marginBottom:10}}>
          <p style={{margin:0,fontSize:13,fontWeight:700,color:"#111"}}>Target Tabungan</p>
          <span style={{fontSize:16,fontWeight:800,color:G}}>{savePct}%</span>
        </Row>
        <input type="range" min={0} max={70} step={5} value={savePct} onChange={e=>setSavePct(Number(e.target.value))} style={{width:"100%",accentColor:G,cursor:"pointer"}}/>
        <Row style={{marginTop:8}}><span style={{fontSize:11,color:"#9ca3af"}}>0%</span><span style={{fontSize:11,color:"#9ca3af"}}>70%</span></Row>
      </Card>
      <Card style={{marginBottom:14}}>
        <p style={{margin:"0 0 10px",fontSize:12,fontWeight:700,color:"#9ca3af",letterSpacing:.5}}>ANALISIS REKOMENDASI</p>
        {[{label:"Ditabung",val:saving,col:G2},{label:"Bisa Dibelanjakan",val:spendable,col:G},{label:"Budget Final Dipakai",val:finalBudget,col:G,bold:true},{label:"Limit Harian Ideal",val:sugDaily,col:G2}].map(r=>(
          <Row key={r.label} style={{marginBottom:6}}><span style={{fontSize:12,color:"#6b7280"}}>{r.label}</span><span style={{fontSize:r.bold?14:12,fontWeight:r.bold?800:700,color:r.col}}>{fmt(r.val)}</span></Row>
        ))}
      </Card>
      <Inp label="ATAU MASUKKAN NOMINAL SENDIRI" mb={18}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <input type="checkbox" checked={useCustom} onChange={e=>setUseCustom(e.target.checked)} style={{accentColor:G,width:16,height:16}}/>
          <span style={{fontSize:12,color:"#6b7280",flex:1}}>Pakai nominal kustom</span>
        </div>
        {useCustom&&<div style={{marginTop:8,display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:14,color:"#9ca3af",fontWeight:600}}>Rp</span><input inputMode="numeric" value={custom} onChange={e=>setCustom(fmtNum(e.target.value))} placeholder="0" style={{flex:1,border:"none",outline:"none",fontSize:18,fontWeight:800,color:"#111",background:"transparent"}}/></div>}
      </Inp>
      <BtnG onClick={()=>onApply(finalBudget, savePct)} disabled={finalBudget<=0}>Terapkan Budget: {fmt(finalBudget)}</BtnG>
    </BottomSheet>
  );
}

// ─── ACCOUNT MODAL ────────────────────────────────────────────────────────────
function AccountModal({ initial, onClose, onSave, isNew }) {
  const [acc, setAcc]         = useState(initial || { type:"debit", name:"", last4:"", customGrad:"" });
  const [showCustom, setShowCustom] = useState(false);
  const [customName, setCustomName] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [col1, setCol1]       = useState("#2DAB7F");
  const [col2, setCol2]       = useState("#1d8a63");
  const [hexInput1, setHex1]  = useState("#2DAB7F");
  const [hexInput2, setHex2]  = useState("#1d8a63");
  const [adjBalance, setAdjBalance] = useState(initial?.balance ?? 0);
  const iconRef = useRef();
  const s = (k,v) => setAcc(a=>({...a,[k]:v}));

  const handleSelect = v => { if(v==="Lainnya"){setShowCustom(true);s("name","");}else{setShowCustom(false);s("name",v);} };
  const finalName    = showCustom ? customName : acc.name;
  const opts         = acc.type==="ewallet"?EWALLETS:acc.type==="emoney"?EMONEYS:acc.type==="cash"?null:BANKS;
  const detectedGrad = detectBrand(finalName);

  const applyGradient = () => { s("customGrad", `linear-gradient(135deg,${col1},${col2})`); setHex1(col1); setHex2(col2); };
  const applyPreset = ([c1,c2]) => { setCol1(c1); setCol2(c2); setHex1(c1); setHex2(c2); s("customGrad", `linear-gradient(135deg,${c1},${c2})`); };
  const hexChange = (h, setter, colSetter) => { setter(h); if (/^#[0-9a-fA-F]{6}$/.test(h)) colSetter(h); };

  const submit = () => {
    if (!finalName) return;
    const data = { ...acc, name: finalName };
    if (!data.customGrad && detectedGrad) data.customGrad = detectedGrad;
    const adjustment = (!isNew && adjBalance !== (initial?.balance ?? 0)) ? adjBalance - (initial?.balance ?? 0) : null;
    onSave(data, adjustment);
  };
  
  const handleIcon = e => { const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>s("iconImg",r.result);r.readAsDataURL(f); };
  const curGrad = acc.customGrad || detectedGrad || DEFAULT_GRADS[0];

  return (
    <BottomSheet onClose={onClose} title={isNew?"Tambah Akun":"Edit Akun"}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
        {ACC_TYPES.map(t=>(
          <button type="button" key={t.type} onClick={()=>{s("type",t.type);setShowCustom(false);s("name","");}}
            style={{padding:"10px 8px",background:acc.type===t.type?"#fff":"#f1f5f9",border:`1.5px solid ${acc.type===t.type?G:"#e5e7eb"}`,borderRadius:12,color:acc.type===t.type?G:"#6b7280",fontSize:11,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:7,boxShadow:acc.type===t.type?"0 2px 8px rgba(0,0,0,0.08)":"none"}}>
            <div style={{color:acc.type===t.type?G:"#9ca3af"}}><t.Icon s={17}/></div>{t.label}
          </button>
        ))}
      </div>
      <Inp label={acc.type==="ewallet"?"E-WALLET":acc.type==="emoney"?"E-MONEY":acc.type==="cash"?"NAMA":"BANK"} mb={showCustom?6:10}>
        {acc.type==="cash"
          ? <input value={acc.name} onChange={e=>s("name",e.target.value)} placeholder="cth: Dompet Harian" style={{width:"100%",background:"transparent",border:"none",outline:"none",fontSize:14,color:"#111"}}/>
          : <select value={showCustom?"Lainnya":acc.name} onChange={e=>handleSelect(e.target.value)} style={{width:"100%",background:"transparent",border:"none",outline:"none",fontSize:14,color:"#111",WebkitAppearance:"none"}}>
              <option value="">-- Pilih --</option>{opts?.map(o=><option key={o}>{o}</option>)}
            </select>}
      </Inp>
      {showCustom&&<Inp label="NAMA MANUAL" mb={10}><input value={customName} onChange={e=>setCustomName(e.target.value)} placeholder="cth: Bank Anda, GoPay Bisnis..." style={{width:"100%",background:"transparent",border:"none",outline:"none",fontSize:14,color:"#111"}}/></Inp>}
      <Inp label="4 DIGIT TERAKHIR (OPSIONAL)" mb={10}>
        <input value={acc.last4||""} onChange={e=>s("last4",e.target.value.replace(/\D/g,'').slice(0,4))} placeholder="xxxx" maxLength={4} style={{width:"100%",background:"transparent",border:"none",outline:"none",fontSize:14,color:"#111"}}/>
      </Inp>

      <Card style={{marginBottom:14,padding:"12px 14px"}}>
        <Row style={{marginBottom:10}}>
          <p style={{margin:0,fontSize:10,fontWeight:700,color:"#9ca3af",letterSpacing:.5}}>TAMPILAN KARTU</p>
          <button type="button" onClick={()=>setShowColorPicker(p=>!p)} style={{background:showColorPicker?GL:"#f1f5f9",border:"none",borderRadius:8,padding:"4px 10px",color:showColorPicker?G:"#6b7280",fontSize:11,fontWeight:600,cursor:"pointer"}}>{showColorPicker?"Tutup":"Kustomisasi"}</button>
        </Row>
        {detectedGrad&&<div style={{background:GL,borderRadius:9,padding:"6px 11px",marginBottom:8,display:"flex",alignItems:"center",gap:7}}><Check size={12} color={G}/><span style={{fontSize:11,color:G,fontWeight:600}}>Brand {finalName} terdeteksi</span></div>}
        
        {showColorPicker&&(
          <div>
            <p style={{margin:"0 0 6px",fontSize:10,color:"#9ca3af",fontWeight:700}}>PRESET GRADIEN</p>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
              {GRADIENT_PRESETS.map(([c1,c2],i)=>(
                <button type="button" key={i} onClick={()=>applyPreset([c1,c2])} style={{width:32,height:32,borderRadius:9,background:`linear-gradient(135deg,${c1},${c2})`,border:"none",cursor:"pointer",flexShrink:0,outline:acc.customGrad===`linear-gradient(135deg,${c1},${c2})`?"3px solid "+G:"none",boxShadow:"0 2px 6px rgba(0,0,0,0.15)"}}/>
              ))}
            </div>
            <p style={{margin:"0 0 6px",fontSize:10,color:"#9ca3af",fontWeight:700}}>COLOR PICKER KUSTOM</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
              {[{label:"Warna 1 (Kiri)",col:col1,setCol:setCol1,hex:hexInput1,setHex:setHex1},{label:"Warna 2 (Kanan)",col:col2,setCol:setCol2,hex:hexInput2,setHex:setHex2}].map(item=>(
                <div key={item.label}>
                  <p style={{margin:"0 0 4px",fontSize:10,color:"#6b7280"}}>{item.label}</p>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <input type="color" value={item.col} onChange={e=>{item.setCol(e.target.value);item.setHex(e.target.value);}} style={{width:36,height:36,borderRadius:9,border:"none",cursor:"pointer",padding:2,background:"none"}}/>
                    <input value={item.hex} onChange={e=>hexChange(e.target.value,item.setHex,item.setCol)} placeholder="#000000" maxLength={7} style={{flex:1,border:"1px solid #e5e7eb",borderRadius:8,padding:"6px 8px",fontSize:11,fontWeight:600,color:"#111",outline:"none",fontFamily:"monospace"}}/>
                  </div>
                </div>
              ))}
            </div>
            <button type="button" onClick={applyGradient} style={{width:"100%",padding:"9px",background:`linear-gradient(135deg,${col1},${col2})`,border:"none",borderRadius:11,color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",marginBottom:10}}>Terapkan Gradien Ini</button>
            <Row style={{marginBottom:6}}>
              <span style={{fontSize:11,color:"#6b7280"}}>Ikon kustom (gambar)</span>
              <button type="button" onClick={()=>iconRef.current.click()} style={{background:GL,border:"none",borderRadius:9,padding:"5px 10px",color:G,fontSize:11,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}><Upload size={12}/> Upload</button>
            </Row>
            <input ref={iconRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleIcon}/>
            {acc.customGrad&&<button type="button" onClick={()=>s("customGrad","")} style={{background:"none",border:"none",color:"#ef4444",fontSize:11,cursor:"pointer",fontWeight:600}}>✕ Reset ke default</button>}
          </div>
        )}
        <div style={{background:curGrad,borderRadius:12,padding:"14px",marginTop:8,display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:36,height:36,borderRadius:10,background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff"}}>
            {acc.iconImg ? <img src={acc.iconImg} alt="" style={{width:26,height:26,borderRadius:7,objectFit:"cover"}}/> : (() => { const T=ACC_TYPES.find(t=>t.type===acc.type); return T?<T.Icon s={20}/>:<Wallet size={20}/>; })()}
          </div>
          <div><p style={{color:"rgba(255,255,255,0.8)",fontSize:10,margin:"0 0 2px"}}>{finalName||"Nama Akun"}</p><p style={{color:"#fff",fontSize:14,fontWeight:800,margin:0}}>Rp 0</p></div>
        </div>
      </Card>

      {isNew&&<Inp label="SALDO AWAL (RP)" mb={14}><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:18,fontWeight:700,color:"#9ca3af"}}>Rp</span><input inputMode="numeric" placeholder="0" value={fmtNum(String(acc.balance||""))} onChange={e=>s("balance",parseNum(e.target.value))} style={{flex:1,background:"transparent",border:"none",outline:"none",fontSize:22,fontWeight:800,color:"#111"}}/></div></Inp>}
      {!isNew&&<Card style={{marginBottom:14,padding:"12px 14px",border:`1px dashed ${G}50`}}>
        <p style={{margin:"0 0 8px",fontSize:10,fontWeight:700,color:"#9ca3af",letterSpacing:.5}}>SESUAIKAN SALDO</p>
        <p style={{margin:"0 0 8px",fontSize:11,color:"#6b7280"}}>Saldo saat ini: <b style={{color:"#111"}}>{fmt(initial?.balance??0)}</b></p>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
          <span style={{fontSize:16,fontWeight:700,color:"#9ca3af"}}>Rp</span>
          <input inputMode="numeric" value={fmtNum(String(adjBalance))} onChange={e=>setAdjBalance(parseNum(e.target.value))} style={{flex:1,background:"transparent",border:"none",outline:"none",fontSize:20,fontWeight:800,color:"#111"}}/>
        </div>
        {adjBalance !== (initial?.balance??0)&&(
          <div style={{background:adjBalance>(initial?.balance??0)?GL:"#fef2f2",borderRadius:9,padding:"6px 10px",display:"flex",alignItems:"center",gap:6}}>
            {adjBalance>(initial?.balance??0)?<ArrowUp size={12} color={G}/>:<ArrowDown size={12} color="#ef4444"/>}
            <span style={{fontSize:11,fontWeight:700,color:adjBalance>(initial?.balance??0)?G:"#ef4444"}}>{adjBalance>(initial?.balance??0)?"+":""}{fmt(adjBalance-(initial?.balance??0))} — akan dicatat sbg Penyesuaian Saldo</span>
          </div>
        )}
      </Card>}
      <BtnG onClick={submit} disabled={!finalName}>{isNew?"Tambah Akun":"Simpan Perubahan"}</BtnG>
    </BottomSheet>
  );
}

// ─── TXN DETAIL SHEET ─────────────────────────────────────────────────────────
function TxnDetailSheet({ txn, accounts, onClose, onEdit, onDelete, onSaveDetails }) {
  const acc      = accounts.find(a=>String(a.id)===String(txn.accountId));
  const fromAcc  = accounts.find(a=>String(a.id)===String(txn.fromId || txn.accountId));
  const toAcc    = accounts.find(a=>String(a.id)===String(txn.toId));
  const fields   = getTxnDetailFields(txn);
  const [details, setDetails] = useState(txn.details || {});
  const [editing, setEditing] = useState(false);
  const [showDel, setShowDel] = useState(false);
  const [attachSrcs, setAttachSrcs] = useState({});

  useEffect(()=>{
    let active = true;
    (txn.attachmentMeta||[]).forEach(a=>{ 
      IDB.get(a.id).then(d=>{if(active&&d)setAttachSrcs(p=>({...p,[a.id]:d}))}).catch(()=>{}); 
    });
    return () => { active = false; };
  },[txn.id, txn.attachmentMeta]); 
  
  const save = () => { if(onSaveDetails) onSaveDetails(txn.id, details); setEditing(false); };
  const grad = acc ? getAccGrad(acc, accounts.indexOf(acc)) : `linear-gradient(135deg,${G},${G2})`;

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:210,display:"flex",alignItems:"flex-end",backdropFilter:"blur(4px)"}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:"#f8fafc",width:"100%",maxWidth:430,margin:"0 auto",borderRadius:"24px 24px 0 0",maxHeight:"92vh",overflowY:"auto",paddingBottom:32}}>
        <div style={{background:grad,borderRadius:"24px 24px 0 0",padding:"20px 18px 24px",position:"relative"}}>
          <button type="button" onClick={onClose} style={{position:"absolute",top:16,left:16,background:"rgba(255,255,255,0.2)",border:"none",borderRadius:9,width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff"}}><X size={16}/></button>
          
          <div style={{textAlign:"center",paddingTop:8}}>
            <div style={{display:"flex", justifyContent:"center", marginBottom: 10}}>
              <CatBub cat={txn.category} size={56}/>
            </div>
            <p style={{color:"#fff",fontSize:13,fontWeight:600,margin:"0 0 2px"}}>{txn.note||"Transaksi"}</p>
            <p style={{color:"#fff",fontSize:28,fontWeight:800,margin:"0 0 4px"}}>{txn.type==="income"?"+":"-"}{fmt(txn.amount)}</p>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,flexWrap:"wrap"}}>
              {txn.type==="transfer" ? (
                <><span style={{background:"rgba(255,255,255,0.2)",color:"#fff",fontSize:11,fontWeight:600,padding:"4px 10px",borderRadius:99}}>{fromAcc?.name||"?"}</span>
                <span style={{color:"rgba(255,255,255,0.8)",fontSize:14}}>→</span>
                <span style={{background:"rgba(255,255,255,0.2)",color:"#fff",fontSize:11,fontWeight:600,padding:"4px 10px",borderRadius:99}}>{toAcc?.name||"?"}</span></>
              ) : (
                <><span style={{background:"rgba(255,255,255,0.2)",color:"#fff",fontSize:11,fontWeight:600,padding:"4px 10px",borderRadius:99}}>{txn.category}</span>
                <span style={{background:"rgba(255,255,255,0.2)",color:"#fff",fontSize:11,fontWeight:600,padding:"4px 10px",borderRadius:99}}>{acc?.name||"Akun"}</span></>
              )}
            </div>
          </div>
        </div>
        <div style={{padding:"16px 16px 0"}}>
          <Card style={{padding:"12px 16px",marginBottom:10}}>
            <Row>
              <div style={{display:"flex",alignItems:"center",gap:8}}><Calendar size={14} color="#9ca3af"/><span style={{fontSize:12,color:"#6b7280"}}>{labelDate(txn.date)}</span></div>
              {txn.time&&<div style={{display:"flex",alignItems:"center",gap:6}}><Clock size={14} color="#9ca3af"/><span style={{fontSize:12,color:"#6b7280"}}>{txn.time}</span></div>}
            </Row>
          </Card>
          <Card style={{marginBottom:10}}>
            <Row style={{marginBottom:editing?10:0}}>
              <p style={{margin:0,fontSize:12,fontWeight:700,color:"#111"}}>Detail Tambahan</p>
              <button type="button" onClick={()=>editing?save():setEditing(true)} style={{background:editing?G:GL,border:"none",borderRadius:8,padding:"5px 12px",color:editing?"#fff":G,fontSize:11,fontWeight:700,cursor:"pointer"}}>{editing?"Simpan":"Edit"}</button>
            </Row>
            {fields.map(f=>(
              <div key={f.key} style={{marginBottom:8}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4,color:"#9ca3af"}}>{f.icon}<span style={{fontSize:10,fontWeight:700,letterSpacing:.5}}>{f.label.toUpperCase()}</span></div>
                {editing
                  ? <input value={details[f.key]||""} onChange={e=>setDetails(p=>({...p,[f.key]:e.target.value}))} placeholder={f.placeholder} style={{width:"100%",background:"#f8fafc",border:`1px solid ${G}40`,borderRadius:9,padding:"8px 10px",fontSize:13,color:"#111",outline:"none",boxSizing:"border-box"}}/>
                  : <p style={{margin:0,fontSize:13,color:details[f.key]?"#111":"#d1d5db",fontStyle:details[f.key]?"normal":"italic"}}>{details[f.key]||f.placeholder}</p>}
              </div>
            ))}
          </Card>
          {(txn.attachmentMeta||[]).length>0&&<Card style={{marginBottom:10}}>
            <p style={{margin:"0 0 8px",fontSize:12,fontWeight:700,color:"#111"}}>Lampiran</p>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {txn.attachmentMeta.map(a=>(
                <div key={a.id} style={{width:64,height:64,borderRadius:10,overflow:"hidden",background:"#f1f5f9",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {attachSrcs[a.id]&&a.type?.startsWith("image")?<img src={attachSrcs[a.id]} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<Receipt size={22} color="#9ca3af"/>}
                </div>
              ))}
            </div>
          </Card>}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:4}}>
            <button type="button" onClick={()=>onEdit(txn)} style={{padding:"13px",background:GL,border:"none",borderRadius:14,color:G,fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:7}}><Pencil size={15}/>Edit</button>
            <button type="button" onClick={()=>setShowDel(true)} style={{padding:"13px",background:"#fef2f2",border:"none",borderRadius:14,color:"#ef4444",fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:7}}><Trash2 size={15}/>Hapus</button>
          </div>
        </div>
      </div>
      {showDel&&<ConfirmDialog title="Hapus Transaksi?" sub={`"${txn.note||"Transaksi"}" senilai ${fmt(txn.amount)} akan dihapus.`} onConfirm={()=>{onDelete(txn);onClose();}} onCancel={()=>setShowDel(false)}/>}
    </div>
  );
}

// ─── ADD / EDIT TRANSACTION MODAL ─────────────────────────────────────────────
function TxnModal({ initial, accounts, onClose, onSave, soundEnabled, isPickingFile, openFilePicker }) {
  const isEdit = !!initial;
  const [form, setForm] = useState(() => ({
    type:"expense",
    amountStr:"",
    category:"Makan & Minum",
    note:"",
    date:todayStr(),
    time:nowTime(),
    accountId:String(accounts[0]?.id),
    attachmentMeta:[],
    details: {},
    ...(initial || {}),
  }));
  const [detected, setDetected] = useState(null);
  const fileRef = useRef();
  const s = (k,v) => setForm(f=>({...f,[k]:v}));

  const [sugCat, setSugCat] = useState(null);
  const aiTimerRef = useRef(null);
  const handleNote = v => { 
    s("note",v); 
    const d=smartDetect(v); 
    setDetected(d); 
    if(d){setForm(f=>({...f,note:v,category:d.cat}));setSugCat(null);}
    else{
      const sug=suggestCategory(v);
      setSugCat(sug&&!CATS_EXP.includes(sug)?sug:null);
      // AI fallback: if no match and text >= 3 chars, ask Claude
      if(!sug && v.trim().length>=3) {
        clearTimeout(aiTimerRef.current);
        aiTimerRef.current = setTimeout(async()=>{
          try {
            const res = await fetch("https://api.anthropic.com/v1/messages",{
              method:"POST", headers:{"Content-Type":"application/json"},
              body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:80,
                messages:[{role:"user",content:`Ini nama transaksi keuangan: "${v.trim()}". Termasuk kategori apa dari daftar ini? ${[...CATS_EXP,...CATS_INC].join(", ")}. Jawab HANYA nama kategori saja, tanpa penjelasan.`}]
              })
            });
            const data = await res.json();
            const aiCat = data.content?.[0]?.text?.trim();
            if(aiCat&&[...CATS_EXP,...CATS_INC].includes(aiCat)) setSugCat(aiCat);
          } catch(e) {}
        }, 800);
      }
    }
  };
  const handleAmt  = e => { const raw=e.target.value.replace(/\D/g,""); s("amountStr",raw?parseInt(raw).toLocaleString("id-ID"):""); };
  
  const handleFile = async e => {
    isPickingFile.current=false;
    const files=Array.from(e.target.files); const newMeta=[];
    for (const f of files) {
      const id=`att_${generateId()}`;
      const data=await new Promise(res=>{const r=new FileReader();r.onload=()=>res(r.result);r.readAsDataURL(f);});
      await IDB.put(id,data).catch(()=>{});
      newMeta.push({id,name:f.name,type:f.type});
    }
    setForm(f=>({...f,attachmentMeta:[...(f.attachmentMeta||[]),...newMeta]}));
  };
  
  const removeAttachment = async id => { 
    await IDB.del(id).catch(()=>{}); 
    setForm(f=>({...f,attachmentMeta:(f.attachmentMeta||[]).filter(a=>a.id!==id)})); 
  };

  const submit = () => {
    const amount=parseNum(form.amountStr||"0"); if(!amount||!form.accountId)return;
    if(soundEnabled&&!isEdit)playTxnSound(form.type);
    onSave({...form,amount,amountStr:undefined,detected});
  };

  const cats=form.type==="expense"?CATS_EXP:CATS_INC;
  const [txType, setTxType] = useState(()=>initial?.type==="transfer"?"transfer":(initial?.type||"expense"));
  const [trFromId, setTrFromId] = useState(()=>accounts[0]?.id?String(accounts[0].id):"");
  const [trToId,   setTrToId]   = useState(()=>accounts[1]?.id?String(accounts[1].id):"");
  const [trAmt,    setTrAmt]    = useState("");
  const [trNote,   setTrNote]   = useState("");

  const [trDate, setTrDate] = useState(todayStr());
  const submitTransfer = () => {
    const amount = parseNum(trAmt||"0");
    if(!amount||!trFromId||!trToId||trFromId===trToId)return;
    onSave({type:"transfer",fromId:trFromId,toId:trToId,amount,note:trNote,date:trDate});
  };

  return (
    <BottomSheet onClose={onClose} title={isEdit?"Edit Transaksi":"Catat Transaksi"}>
      <div style={{position:"relative",display:"grid",gridTemplateColumns:"1fr 1fr 1fr",marginBottom:14,background:"#e5e7eb",borderRadius:14,padding:4}}>
        <div style={{position:"absolute",top:4,left:4,width:"calc(33.33% - 5.33px)",height:"calc(100% - 8px)",background:"#fff",borderRadius:11,boxShadow:"0 1px 4px rgba(0,0,0,0.10)",transform:`translateX(calc(${txType==="expense"?0:txType==="income"?1:2} * (100% + 2.66px)))`,transition:"transform 0.28s cubic-bezier(0.34,1.56,0.64,1)",pointerEvents:"none",willChange:"transform"}}/>
        {[{v:"expense",l:"Pengeluaran"},{v:"income",l:"Pemasukan"},{v:"transfer",l:"Transfer"}].map(({v,l})=>(
          <button type="button" key={v} onClick={()=>{setTxType(v);setForm(f=>({...f,type:v,category:v==="expense"?"Makan & Minum":v==="income"?"Gaji":f.category}));}} style={{padding:"9px 4px",border:"none",borderRadius:11,background:"transparent",color:txType===v?"#111":"#9ca3af",fontSize:12,fontWeight:700,cursor:"pointer",position:"relative",zIndex:1,transition:"color 0.2s"}}>{l}</button>
        ))}
      </div>
      {txType==="transfer"&&(
        <div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
            {[{label:"DARI AKUN",val:trFromId,set:setTrFromId},{label:"KE AKUN",val:trToId,set:setTrToId}].map(({label,val,set})=>{
              const selAcc=accounts.find(a=>String(a.id)===String(val));
              const grad=selAcc?getAccGrad(selAcc,accounts.indexOf(selAcc)):"#e5e7eb";
              return(
              <div key={label} style={{borderRadius:14,overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,0.08)"}}>
                <div style={{background:grad,padding:"8px 12px 4px"}}><p style={{margin:0,fontSize:9,fontWeight:800,color:"rgba(255,255,255,0.8)",letterSpacing:.6}}>{label}</p><p style={{margin:"2px 0 0",fontSize:13,fontWeight:800,color:"#fff"}}>{selAcc?.name||"—"}</p></div>
                <select value={val} onChange={e=>set(e.target.value)} style={{width:"100%",background:"#f8fafc",border:"none",outline:"none",fontSize:12,fontWeight:600,color:"#374151",padding:"8px 12px",WebkitAppearance:"none",cursor:"pointer"}}>
                  {accounts.map(a=><option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              );
            })}
          </div>
          <Inp label="JUMLAH (RP)"><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:18,fontWeight:700,color:"#9ca3af"}}>Rp</span><input inputMode="numeric" placeholder="0" value={trAmt} onChange={e=>setTrAmt(fmtNum(e.target.value))} style={{flex:1,background:"transparent",border:"none",outline:"none",fontSize:28,fontWeight:800,color:"#111"}}/></div></Inp>
          <Inp label="CATATAN (OPSIONAL)" mb={10}><input value={trNote} onChange={e=>setTrNote(e.target.value)} placeholder="cth: Untuk tabungan..." style={{width:"100%",background:"transparent",border:"none",outline:"none",fontSize:14,color:"#111"}}/></Inp>
          <Inp label="TANGGAL" mb={18}><input type="date" value={trDate} onChange={e=>setTrDate(e.target.value)} style={{width:"100%",background:"transparent",border:"none",outline:"none",fontSize:14,fontWeight:600,color:"#111"}}/></Inp>
          <BtnG onClick={submitTransfer} disabled={!parseNum(trAmt)||trFromId===trToId}>Transfer Sekarang</BtnG>
        </div>
      )}
      {txType!=="transfer"&&(
      <div>
      <Inp label="JUMLAH (RP)"><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:18,fontWeight:700,color:"#9ca3af"}}>Rp</span><input inputMode="numeric" placeholder="0" value={form.amountStr||""} onChange={handleAmt} style={{flex:1,background:"transparent",border:"none",outline:"none",fontSize:28,fontWeight:800,color:"#111"}}/></div></Inp>
      <Inp label="CATATAN / NAMA TOKO" mb={detected?6:10}><input placeholder="cth: Indomaret, GoFood..." value={form.note||""} onChange={e=>handleNote(e.target.value)} style={{width:"100%",background:"transparent",border:"none",outline:"none",fontSize:14,color:"#111"}}/></Inp>
      {detected&&<div style={{display:"flex",alignItems:"center",gap:7,padding:"8px 13px",background:GL,borderRadius:11,marginBottom:10,border:`1px solid ${GM}`}}><Check size={13} color={G}/><span style={{color:G,fontSize:12,fontWeight:600}}>Auto-detect: {detected.cat}</span></div>}
      {!detected&&sugCat&&<div style={{display:"flex",alignItems:"center",gap:7,padding:"8px 13px",background:"#fff3cd",borderRadius:11,marginBottom:10,border:"1px solid #fde68a"}}><Star size={13} color="#f59e0b"/><span style={{color:"#92400e",fontSize:12,fontWeight:600}}>Saran kategori: <b>{sugCat}</b></span><button type="button" onClick={()=>{setSugCat(null);s("category","Lainnya");}} style={{marginLeft:"auto",background:"none",border:"none",fontSize:10,color:"#9ca3af",cursor:"pointer"}}>✕</button></div>}
      <Inp label="KATEGORI">
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
          {cats.map(c=>(
            <button type="button" key={c} onClick={()=>s("category",c)} style={{padding:"8px 4px",background:form.category===c?GL:"#f8fafc",border:`1.5px solid ${form.category===c?G:"#f1f5f9"}`,borderRadius:10,color:form.category===c?G:"#9ca3af",fontSize:9,fontWeight:600,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3}}><span style={{color:form.category===c?G:CAT_COLORS[c]||"#9ca3af"}}>{CAT_ICON(c,17)}</span><span style={{textAlign:"center",lineHeight:1.2,color:form.category===c?G:"#6b7280",wordBreak:"break-word",hyphens:"auto"}}>{c==="Makan & Minum"?"Makan":c==="Belanja Harian"?"B.Harian":c==="Belanja Online"?"B.Online":c==="Tempat Tinggal"?"Tempat Tgl":c==="Penyesuaian Saldo"?"Penyesuaian":c.split(" ")[0]}</span></button>
          ))}
        </div>
      </Inp>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
        <Inp label="AKUN" mb={0}>{accounts.length===0?<p style={{margin:0,fontSize:12,color:"#ef4444"}}>Buat akun dulu!</p>:<select value={form.accountId} onChange={e=>s("accountId",String(e.target.value))} style={{width:"100%",background:"transparent",border:"none",outline:"none",fontSize:13,fontWeight:600,color:"#111",WebkitAppearance:"none"}}>{accounts.map(a=><option key={a.id} value={a.id}>{a.name}</option>)}</select>}</Inp>
        <Inp label="TANGGAL" mb={0}><input type="date" value={form.date} onChange={e=>s("date",e.target.value)} style={{width:"100%",background:"transparent",border:"none",outline:"none",fontSize:12,fontWeight:600,color:"#111",colorScheme:"light"}}/></Inp>
      </div>
      <Inp label="JAM" mb={10}><input type="time" value={form.time||nowTime()} onChange={e=>s("time",e.target.value)} style={{background:"transparent",border:"none",outline:"none",fontSize:14,fontWeight:600,color:"#111",colorScheme:"light"}}/></Inp>
      <Inp label="LAMPIRAN (OPSIONAL)" mb={18}>
        <Row><p style={{margin:0,fontSize:12,color:"#9ca3af"}}>Foto struk, dll.</p><button type="button" onClick={()=>openFilePicker(fileRef.current)} style={{background:GL,border:"none",borderRadius:9,padding:"6px 12px",color:G,fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:5}}><Upload size={12}/> Tambah</button></Row>
        <input ref={fileRef} type="file" accept="image/*,.pdf" multiple style={{display:"none"}} onChange={handleFile}/>
        {(form.attachmentMeta||[]).length>0&&(
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:8}}>
            {form.attachmentMeta.map(a=>(<div key={a.id} style={{position:"relative",width:52,height:52}}><AttachPreview id={a.id} type={a.type}/><button type="button" onClick={()=>removeAttachment(a.id)} style={{position:"absolute",top:-5,right:-5,width:17,height:17,borderRadius:"50%",background:"#ef4444",border:"none",color:"#fff",fontSize:9,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button></div>))}
          </div>
        )}
      </Inp>
      <BtnG onClick={submit} disabled={accounts.length===0}>{isEdit?"Simpan Perubahan":"Simpan Transaksi"}</BtnG>
      </div>)}
    </BottomSheet>
  );
}

function AttachPreview({ id, type }) {
  const [src, setSrc] = useState(null);
  useEffect(()=>{
    let active = true;
    IDB.get(id).then(d=>{if(active&&d)setSrc(d)}).catch(()=>{});
    return () => { active = false; };
  },[id]);
  if(!src)return<div style={{width:52,height:52,borderRadius:9,background:"#f1f5f9",display:"flex",alignItems:"center",justifyContent:"center",color:"#9ca3af"}}><Receipt size={18}/></div>;
  if(type?.startsWith("image"))return<img src={src} alt="" style={{width:52,height:52,borderRadius:9,objectFit:"cover"}}/>;
  return<div style={{width:52,height:52,borderRadius:9,background:"#f1f5f9",display:"flex",alignItems:"center",justifyContent:"center",color:"#6b7280"}}><Receipt size={20}/></div>;
}

// ─── IMPORT MODAL ─────────────────────────────────────────────────────────────
function ImportModal({ accounts, onClose, onImport, isPickingFile, openFilePicker }) {
  const [ambiguous,setAmbiguous]=useState([]);
  const [st,setSt]=useState("idle"),[preview,setPreview]=useState([]),[err,setErr]=useState("");
  const ref=useRef();

  // ── Smart account matcher ─────────────────────────────────────────────────
  const ACC_ALIASES = {
    gopay:["gopay","go pay","go-pay"],bca:["bca","bank central asia"],
    bri:["bri","bank rakyat"],bni:["bni","bank negara"],mandiri:["mandiri","livin"],
    bsi:["bsi","bank syariah"],ovo:["ovo"],dana:["dana"],shopeepay:["shopeepay","shopee pay"],
    linkaja:["linkaja","link aja"],jago:["jago","bank jago"],jenius:["jenius"],
    blu:["blu","blu bca"],seabank:["seabank","sea bank"],
  };
  const matchAccount = (rawAcc) => {
    if (!rawAcc || !accounts.length) return accounts[0]?.id || "";
    const q = String(rawAcc).toLowerCase().replace(/[^a-z0-9 ]/g," ").trim();
    // 1. Direct/fuzzy name match against app accounts
    const direct = accounts.find(a => {
      const an = a.name.toLowerCase();
      return an.includes(q) || q.includes(an) || q.split(" ").some(w=>w.length>2&&an.includes(w));
    });
    if (direct) return String(direct.id);
    // 2. Brand alias match
    for (const [brand, aliases] of Object.entries(ACC_ALIASES)) {
      if (aliases.some(al=>q.includes(al))) {
        const found = accounts.find(a=>a.name.toLowerCase().includes(brand));
        if (found) return String(found.id);
      }
    }
    // 3. Type heuristic
    if (["cash","tunai","dompet","wallet"].some(w=>q.includes(w))) {
      const cash = accounts.find(a=>a.type==="cash");
      if (cash) return String(cash.id);
    }
    if (["ewallet","e-wallet","e wallet","digital"].some(w=>q.includes(w))) {
      const ew = accounts.find(a=>a.type==="ewallet");
      if (ew) return String(ew.id);
    }
    return String(accounts[0].id); // fallback
  };

  // ── Universal date parser ──────────────────────────────────────────────────
  const MONTHS_ID = ["januari","februari","maret","april","mei","juni","juli","agustus","september","oktober","november","desember"];
  const MONTHS_EN = ["january","february","march","april","may","june","july","august","september","october","november","december"];
  const MONTHS_SH = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];

  const parseImportDate = (raw) => {
    if (!raw && raw !== 0) return todayStr();
    // Excel serial number
    if (typeof raw === "number") {
      const excelEpoch = new Date(1899, 11, 30);
      const d = new Date(excelEpoch.getTime() + raw * 86400000);
      if (!isNaN(d)) return getLocalISOString(d);
    }
    const s = String(raw).trim();
    if (!s) return todayStr();
    // Already ISO yyyy-mm-dd
    if (/^\d{4}-\d{2}-\d{2}/.test(s)) { const d=new Date(s); if(!isNaN(d)) return getLocalISOString(d); }
    // dd/mm/yyyy or mm/dd/yyyy or dd-mm-yyyy or dd.mm.yyyy
    const slashMatch = s.match(/^(\d{1,2})[-\/\.](\d{1,2})[-\/\.](\d{2,4})$/);
    if (slashMatch) {
      let [,p1,p2,p3]=slashMatch;
      const yr = p3.length===2 ? "20"+p3 : p3;
      // heuristic: if p1>12 it must be day
      const day=parseInt(p1)>12?p1:p2, mon=parseInt(p1)>12?p2:p1;
      const d=new Date(`${yr}-${String(mon).padStart(2,"0")}-${String(day).padStart(2,"0")}`);
      if (!isNaN(d)) return getLocalISOString(d);
    }
    // "15 Januari 2023" / "January 15 2023" / "15 Jan 2023"
    const wordMatch = s.toLowerCase().match(/(\d{1,2})\s+([a-z]+)\.?\s+(\d{4})|([a-z]+)\.?\s+(\d{1,2})[,]?\s+(\d{4})/);
    if (wordMatch) {
      let day, monStr, yr;
      if (wordMatch[1]) { day=wordMatch[1]; monStr=wordMatch[2]; yr=wordMatch[3]; }
      else { monStr=wordMatch[4]; day=wordMatch[5]; yr=wordMatch[6]; }
      const monIdx = MONTHS_ID.findIndex(m=>monStr.startsWith(m.substring(0,3))) + 1
                  || MONTHS_EN.findIndex(m=>monStr.startsWith(m.substring(0,3))) + 1
                  || MONTHS_SH.findIndex(m=>m===monStr.substring(0,3)) + 1;
      if (monIdx > 0) {
        const d = new Date(`${yr}-${String(monIdx).padStart(2,"0")}-${String(day).padStart(2,"0")}`);
        if (!isNaN(d)) return getLocalISOString(d);
      }
    }
    // Last resort: native parse
    const d = new Date(s);
    return isNaN(d) ? todayStr() : getLocalISOString(d);
  };

  // ── Category mapper: maps foreign/English names to app categories ──────────
  const CAT_MAP_IMPORT = [
    { kw:["food","meal","restaurant","dining","coffee","drink","beverage","eat","makan","minum","restoran"], cat:"Makan & Minum" },
    { kw:["groceries","grocery","supermarket","minimarket","belanja harian","daily"], cat:"Belanja Harian" },
    { kw:["shopping","online","e-commerce","tokopedia","shopee","lazada","belanja online"], cat:"Belanja Online" },
    { kw:["transport","transportation","taxi","ride","grab","gojek","fuel","gas","petrol","commute","travel","train","bus"], cat:"Transportasi" },
    { kw:["entertainment","movie","cinema","game","streaming","netflix","spotify","hiburan"], cat:"Hiburan" },
    { kw:["bill","utility","electric","water","internet","phone","tagihan","listrik"], cat:"Tagihan" },
    { kw:["health","medical","doctor","clinic","pharmacy","medicine","hospital","kesehatan","obat"], cat:"Kesehatan" },
    { kw:["education","school","course","tuition","book","pendidikan","sekolah"], cat:"Pendidikan" },
    { kw:["rent","housing","mortgage","kost","sewa","kontrakan","tempat tinggal"], cat:"Tempat Tinggal" },
    { kw:["beauty","salon","spa","gym","fitness","personal care","perawatan"], cat:"Perawatan" },
    { kw:["salary","income","gaji","payroll","wage"], cat:"Gaji" },
    { kw:["freelance","project","invoice","fee","jasa"], cat:"Freelance" },
    { kw:["gift","transfer","bonus","reward","hadiah"], cat:"Hadiah" },
    { kw:["investment","invest","stock","mutual fund","saham","investasi"], cat:"Investasi" },
  ];

  const mapCategory = (rawCat, note) => {
    const haystack = ((rawCat||"")+" "+(note||"")).toLowerCase();
    for (const r of CAT_MAP_IMPORT) {
      if (r.kw.some(k => haystack.includes(k))) return r.cat;
    }
    // Fallback: SMART_RULES keyword match on note
    if (note) {
      const sr = smartDetect(note);
      if (sr) return sr.cat;
    }
    // Direct match with existing app categories
    const existing = [...Object.keys(CAT_BG)];
    const match = existing.find(c => (rawCat||"").toLowerCase().includes(c.toLowerCase()) || c.toLowerCase().includes((rawCat||"").toLowerCase()));
    return match || "Lainnya";
  };

  const parse = async e => {
    isPickingFile.current = false;
    const file = e.target.files[0]; if (!file) return;
    if (accounts.length === 0) { setErr("Silakan buat akun keuangan terlebih dahulu sebelum import."); setSt("error"); return; }
    if (file.size > 10 * 1024 * 1024) { setErr("Ukuran file maksimal 10MB."); setSt("error"); return; }
    setSt("parsing");
    try {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type:"array", cellDates:true, dateNF:"yyyy-mm-dd" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(ws, { header:1, defval:"", raw:false });
      if (rows.length < 2) { setErr("File kosong atau tidak ada data."); setSt("error"); return; }

      // Flexible header detection
      const h = rows[0].map(x => String(x).toLowerCase().trim());
      const fc = (...ns) => { for (const n of ns) { const idx = h.findIndex(x => x.includes(n)); if (idx >= 0) return idx; } return -1; };
      const ai = fc("amount","jumlah","nominal","value","debit","kredit","credit");
      if (ai < 0) { setErr("Kolom jumlah/amount tidak ditemukan."); setSt("error"); return; }
      const di = fc("date","tanggal","tgl","waktu","time","datetime");
      const ni = fc("note","catatan","memo","description","keterangan","desc","merchant","toko");
      const ci = fc("category","kategori","cat","type detail","jenis detail");
      const ti = fc("type","jenis","flow","in/out","debit/credit");
      const acci = fc("account","akun","rekening","wallet","dompet","sumber");
      const debitIdx = fc("debit");
      const creditIdx = fc("kredit","credit");

      const parsed = [];
      for (let r = 1; r < rows.length; r++) {
        const row = rows[r];
        if (!row || row.every(c => c === "" || c === null || c === undefined)) continue;

        // Amount detection: try main col, then debit/credit split
        let amt = 0, isInc = false;
        const rawAmt = String(row[ai] || "").replace(/[^\d.,-]/g, "").replace(",",".");
        amt = parseFloat(rawAmt) || 0;

        if (amt === 0 && debitIdx >= 0 && creditIdx >= 0) {
          const d2 = parseFloat(String(row[debitIdx]||"").replace(/[^\d.,-]/g,"")) || 0;
          const c2 = parseFloat(String(row[creditIdx]||"").replace(/[^\d.,-]/g,"")) || 0;
          if (c2 > 0) { amt = c2; isInc = true; }
          else if (d2 > 0) { amt = d2; isInc = false; }
        }
        if (!amt || isNaN(amt)) continue;

        // Type detection
        if (ti >= 0) {
          const rt = String(row[ti] || "").toLowerCase();
          isInc = rt.includes("income") || rt.includes("masuk") || rt.includes("pemasukan") || rt.includes("credit") || rt.includes("kredit") || rt.includes("in") || rt.includes("+");
        }

        const rawNote = ni >= 0 ? String(row[ni] || "") : "";
        const rawCat  = ci >= 0 ? String(row[ci] || "") : "";
        const rawDate = di >= 0 ? row[di] : "";
        const rawAcc  = acci >= 0 ? String(row[acci] || "") : "";

        parsed.push({
          id: generateId(),
          type: isInc ? "income" : "expense",
          amount: Math.abs(amt),
          category: mapCategory(rawCat, rawNote),
          note: rawNote || (isInc ? "Pemasukan Import" : "Pengeluaran Import"),
          date: parseImportDate(rawDate),
          time: "",
          accountId: matchAccount(rawAcc),
          detected: null,
          attachmentMeta: [],
        });
      }
      if (!parsed.length) { setErr("Tidak ada baris data yang valid."); setSt("error"); return; }
      setPreview(parsed); setSt("preview");
    } catch (e2) { setErr("Gagal membaca file: " + e2.message); setSt("error"); }
  };
  return(
    <BottomSheet onClose={onClose} title="Import Data">
      {st==="idle"&&<div>
        <div style={{background:GL,borderRadius:13,padding:"13px 15px",marginBottom:10,border:`1px solid ${GM}`}}>
          <p style={{margin:"0 0 5px",fontSize:13,fontWeight:700,color:G}}>Format yang Didukung</p>
          <p style={{margin:0,fontSize:12,color:"#374151",lineHeight:1.7}}>Semua file Excel dari aplikasi keuangan manapun — Money Manager, Wallet, Spendee, Toshl, Monefy, atau export bank langsung. Format: <b>.xlsx</b>, <b>.xls</b>, <b>.csv</b>, <b>.ods</b>.</p>
        </div>
        <div style={{background:"#fffbeb",borderRadius:11,padding:"10px 14px",marginBottom:14,border:"1px solid #fde68a"}}>
          <p style={{margin:0,fontSize:11,color:"#92400e",lineHeight:1.6}}>💡 <b>Akun otomatis terdeteksi</b> dari kolom akun/rekening di file. Pastikan file kamu punya kolom nama akun agar transaksi dikelompokkan dengan benar.</p>
        </div>
        <BtnG onClick={()=>openFilePicker(ref.current)}>Pilih File</BtnG>
        <input ref={ref} type="file" accept=".xlsx,.xls,.csv,.ods" style={{display:"none"}} onChange={parse}/>
      </div>}
      {st==="parsing"&&<div style={{textAlign:"center",padding:"40px 0"}}><div style={{fontSize:36,animation:"spin 1.5s linear infinite",display:"inline-block"}}>⚙️</div><p style={{color:G,marginTop:12}}>Membaca file...</p></div>}
      {st==="error"&&<div style={{textAlign:"center",padding:"20px 0"}}><div style={{color:"#ef4444",display:"flex",justifyContent:"center",marginBottom:12}}><AlertTriangle size={40}/></div><p style={{color:"#ef4444",fontWeight:600,marginBottom:20}}>{err}</p><BtnG onClick={()=>{setSt("idle");setErr("");}}>Coba Lagi</BtnG></div>}
      {st==="review"&&<div>
        <div style={{background:"#fffbeb",border:"1.5px solid #fde68a",borderRadius:14,padding:"12px 14px",marginBottom:12}}>
          <p style={{margin:"0 0 4px",fontSize:13,fontWeight:800,color:"#92400e"}}>⚠️ {ambiguous.length} Transaksi Butuh Konfirmasi</p>
          <p style={{margin:0,fontSize:11,color:"#92400e",lineHeight:1.5}}>Ditemukan transaksi dengan data tidak jelas (tanggal tidak valid, kategori belum terdeteksi, atau akun tidak ditemukan). Mau diulas dulu atau langsung import semua?</p>
        </div>
        <div style={{maxHeight:220,overflowY:"auto",marginBottom:12}}>
          {ambiguous.map((t,i)=>(
            <div key={t.id} style={{padding:"10px 12px",background:"#fff",borderRadius:12,marginBottom:6,border:"1.5px solid #fde68a"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
                <div style={{flex:1}}>
                  <p style={{margin:0,fontSize:12,fontWeight:700,color:"#111"}}>{t.note||"(kosong)"}</p>
                  <p style={{margin:"2px 0 0",fontSize:10,color:"#9ca3af"}}>{t.date} · {t.category} · {accounts.find(a=>String(a.id)===String(t.accountId))?.name||"Akun ?"}</p>
                </div>
                <p style={{margin:0,fontSize:12,fontWeight:800,color:t.type==="income"?G:"#ef4444"}}>{t.type==="income"?"+":"-"}{fmt(t.amount)}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <button type="button" onClick={()=>setSt("preview")}
            style={{padding:"13px",background:"#f1f5f9",border:"none",borderRadius:14,fontSize:14,fontWeight:700,cursor:"pointer",color:"#374151"}}>Langsung Import</button>
          <BtnG onClick={()=>{/* Let user edit ambiguous - for now just go to preview */setSt("preview");}}>Ulas Transaksi</BtnG>
        </div>
      </div>}
      {st==="preview"&&<div>
        {(()=>{
          const accCounts={};
          preview.forEach(t=>{const n=accounts.find(a=>String(a.id)===String(t.accountId))?.name||"?";accCounts[n]=(accCounts[n]||0)+1;});
          return(
          <div style={{background:GL,borderRadius:12,padding:"11px 14px",marginBottom:12,border:`1px solid ${GM}`}}>
            <p style={{margin:"0 0 4px",fontSize:13,fontWeight:700,color:G}}>✓ {preview.length} transaksi siap diimpor</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:4}}>{Object.entries(accCounts).map(([n,c])=><span key={n} style={{fontSize:10,fontWeight:700,background:"#fff",border:`1px solid ${GM}`,borderRadius:6,padding:"2px 7px",color:"#374151"}}>{n}: {c}</span>)}</div>
          </div>);
        })()}
        <Card style={{padding:"4px 0",marginBottom:12,maxHeight:200,overflowY:"auto"}}>{preview.slice(0,5).map((t,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderBottom:i<4?"1px solid #f8fafc":"none"}}><CatBub cat={t.category} size={36}/><div style={{flex:1,minWidth:0}}><p style={{margin:0,fontSize:12,fontWeight:600,color:"#111",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.note}</p><p style={{margin:0,fontSize:11,color:"#9ca3af"}}>{t.date} · {accounts.find(a=>String(a.id)===String(t.accountId))?.name||"?"}</p></div><span style={{fontSize:12,fontWeight:700,color:t.type==="income"?G:"#ef4444",flexShrink:0}}>{t.type==="income"?"+":"-"}{fmtShort(t.amount)}</span></div>)}{preview.length>5&&<p style={{textAlign:"center",color:"#9ca3af",fontSize:11,padding:"8px"}}>...+{preview.length-5} lainnya</p>}</Card>
        <BtnG onClick={()=>{onImport(preview);setSt("done");}}>Import {preview.length} Transaksi</BtnG>
      </div>}
      {st==="done"&&<div style={{textAlign:"center",padding:"30px 0"}}><div style={{color:G,display:"flex",justifyContent:"center",marginBottom:12}}><Check size={52}/></div><p style={{fontSize:16,fontWeight:800,color:"#111",margin:"0 0 6px"}}>Import Berhasil!</p><BtnG onClick={onClose} style={{marginTop:16}}>Selesai</BtnG></div>}
    </BottomSheet>
  );
}

// ─── ACCOUNT DETAIL SCREEN ────────────────────────────────────────────────────
function AccountDetailScreen({ account, transactions, accIdx, onClose, onEditAccount, onDirectEdit }) {
  const txns   = [...transactions].filter(t=>String(t.accountId)===String(account.id)).sort(sortByDateDesc);
  const income  = txns.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);
  const expense = txns.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);
  const grad    = getAccGrad(account,accIdx);
  const deepLink= getDeepLink(account.name);
  const isLinkable = account.type==="ewallet"||account.type==="debit"||account.type==="credit";

  const openApp = () => {
    if (!deepLink) return;
    window.location.href = deepLink.scheme;
    setTimeout(() => { if (!document.hidden) window.location.href=`https://play.google.com/store/apps/details?id=${deepLink.pkg}`; }, 2000);
  };

  return (
    <div style={{position:"fixed",inset:0,background:BG,zIndex:150,maxWidth:430,margin:"0 auto",overflowY:"auto",paddingBottom:30}}>
      <div style={{background:grad,padding:"calc(env(safe-area-inset-top,0px) + 14px) 16px 24px",position:"relative"}}>
        <button type="button" onClick={onClose} style={{position:"absolute",top:"calc(env(safe-area-inset-top,0px) + 14px)",left:16,background:"rgba(255,255,255,0.2)",border:"none",borderRadius:10,width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff"}}><ChevronLeft size={20}/></button>
        <button type="button" onClick={()=>onDirectEdit?onDirectEdit({acc:account,idx:accIdx}):onEditAccount?.()} style={{position:"absolute",top:"calc(env(safe-area-inset-top,0px) + 14px)",right:16,background:"rgba(255,255,255,0.2)",border:"none",borderRadius:10,width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff"}}><Pencil size={15}/></button>
        <div style={{textAlign:"center",paddingTop:16}}>
          <div style={{width:54,height:54,borderRadius:16,background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 10px",color:"#fff"}}>
            {account.iconImg?<img src={account.iconImg} alt="" style={{width:38,height:38,borderRadius:10,objectFit:"cover"}}/>:(()=>{const T=ACC_TYPES.find(t=>t.type===account.type);return T?<T.Icon s={24}/>:null;})()}
          </div>
          <p style={{color:"rgba(255,255,255,0.8)",fontSize:12,margin:"0 0 4px"}}>{account.name}</p>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:14}}>
            <p style={{color: account.balance < 0 ? "#fca5a5" : "#fff",fontSize:28,fontWeight:800,margin:0}}>
              {account.balance < 0 ? "-" : ""}{fmt(Math.abs(account.balance))}
            </p>
            {account.balance < 0 && (
              <div style={{background:"#fbbf24",borderRadius:8,padding:"3px 8px",display:"flex",alignItems:"center",gap:4}}>
                <AlertTriangle size={12} color="#78350f"/>
                <span style={{fontSize:10,fontWeight:800,color:"#78350f"}}>NEGATIF</span>
              </div>
            )}
          </div>
          {account.last4&&<p style={{color:"rgba(255,255,255,0.6)",fontSize:11,letterSpacing:3,margin:"0 0 14px"}}>•••• {account.last4}</p>}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:4}}>
          {[{l:"Pemasukan",v:income},{l:"Pengeluaran",v:expense}].map(x=>(
            <div key={x.l} style={{background:"rgba(255,255,255,0.15)",borderRadius:12,padding:"10px 14px",textAlign:"center"}}><p style={{color:"rgba(255,255,255,0.7)",fontSize:10,fontWeight:600,margin:"0 0 3px"}}>{x.l}</p><p style={{color:"#fff",fontSize:13,fontWeight:800,margin:0}}>{fmtShort(x.v)}</p></div>
          ))}
        </div>
        {isLinkable && deepLink && (<button type="button" onClick={openApp} style={{width:"100%",marginTop:14,padding:"11px",background:"rgba(255,255,255,0.2)",border:"1.5px solid rgba(255,255,255,0.4)",borderRadius:13,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><ExternalLink size={15}/> Buka {deepLink.label}</button>)}
      </div>
      <div style={{padding:"16px 16px 0"}}>
        <p style={{margin:"0 0 10px",fontSize:14,fontWeight:700,color:"#111"}}>Riwayat Transaksi</p>
        <Card style={{padding:"4px 0"}}>
          {txns.length===0&&<p style={{textAlign:"center",color:"#9ca3af",padding:"24px",fontSize:13}}>Belum ada transaksi</p>}
          {txns.map((t,i)=>(
            <div key={t.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderBottom:i<txns.length-1?"1px solid #f8fafc":"none"}}>
              <CatBub cat={t.category} size={40}/>
              <div style={{flex:1,minWidth:0}}><p style={{margin:0,fontSize:13,fontWeight:600,color:"#111",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.note||"Transaksi"}</p><p style={{margin:"2px 0 0",fontSize:11,color:"#9ca3af"}}>{t.date}{t.time?` · ${t.time}`:""}</p></div>
              <span style={{fontSize:13,fontWeight:800,color:t.type==="income"?G:"#ef4444",whiteSpace:"nowrap"}}>{t.type==="income"?"+":"-"}Rp {t.amount.toLocaleString("id-ID")}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ─── HOME SCREEN ──────────────────────────────────────────────────────────────
function HomeScreen({ accounts, transactions, monthlyBudget, setMonthlyBudget, savedPct, setSavedPct, userName, userAvatar, setTab, setTxnFilter, setSelectedAcc, hidden, setHidden, onTxnClick, registerLocalModal, unregisterLocalModal }) {
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const openBudget = () => { setShowBudgetModal(true); registerLocalModal?.(()=>setShowBudgetModal(false)); };
  const closeBudget = () => { setShowBudgetModal(false); unregisterLocalModal?.(); };

  const totalBalance = accounts.reduce((s,a)=>s+a.balance,0);
  const trackedThisMonth = useMemo(
    () => transactions.filter(t => t.category !== "Penyesuaian Saldo" && t.date >= startOfMonth()),
    [transactions]
  );
  const totalIncome  = trackedThisMonth.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);
  const totalExpense = trackedThisMonth.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);
  const budgetLeft   = monthlyBudget - totalExpense;
  const budgetPct    = Math.min(100,Math.round(totalExpense/Math.max(monthlyBudget,1)*100));
  const show         = v => hidden ? mask(v) : fmt(v);
  const recent       = [...transactions].sort(sortByDateDesc).slice(0,5);

  // FIX: Prediksi tidak berasumsi income 0. Gunakan income bulan lalu / bulan ini.
  const dLeft = daysLeftMonth();
  // daily budget tracker — declared after dLeft
  const todayExpense = useMemo(()=>transactions.filter(t=>t.type==="expense"&&t.date===todayStr()&&t.category!=="Penyesuaian Saldo").reduce((s,t)=>s+t.amount,0),[transactions]);
  const dailyLimit   = dLeft>0?Math.floor(budgetLeft/Math.max(1,dLeft)):0;
  const todayRemain  = dailyLimit - todayExpense;
  const daysPassed = Math.max(1, new Date().getDate());

  // Smart avg: abaikan transaksi satu kali besar (beli mobil, dll) — bukan pengeluaran harian
  const NON_RECURRING_CATS = useMemo(()=>["Investasi","Penyesuaian Saldo","Transfer"],[]);
  const thisMonthExpTxns = useMemo(()=>
    transactions.filter(t=>t.type==="expense"&&t.date>=startOfMonth()&&!NON_RECURRING_CATS.includes(t.category)),
  [transactions,NON_RECURRING_CATS]);
  const medianDailyVal = useMemo(()=>{
    if(!thisMonthExpTxns.length) return 0;
    const byDay={};
    thisMonthExpTxns.forEach(t=>{byDay[t.date]=(byDay[t.date]||0)+t.amount;});
    const vals=Object.values(byDay).sort((a,b)=>a-b);
    return vals[Math.floor(vals.length/2)]||0;
  },[thisMonthExpTxns]);
  const outlierCutoff = Math.max(medianDailyVal*10, 5000000); // 10x median harian atau 5jt
  const avgDailyExp = useMemo(()=>{
    const recurring = thisMonthExpTxns.filter(t=>t.amount<outlierCutoff);
    return recurring.reduce((s,t)=>s+t.amount,0) / daysPassed;
  },[thisMonthExpTxns,outlierCutoff,daysPassed]);
  const estMonthlyExp = avgDailyExp * new Date(new Date().getFullYear(), new Date().getMonth()+1, 0).getDate();

  const now = new Date();
  const lastMStart = getLocalISOString(new Date(now.getFullYear(), now.getMonth()-1, 1));
  const lastMEnd = getLocalISOString(new Date(now.getFullYear(), now.getMonth(), 0));
  const lastMIncome = transactions.filter(t=>t.type==="income" && t.date>=lastMStart && t.date<=lastMEnd).reduce((s,t)=>s+t.amount,0);
  
  const assumedIncome = lastMIncome > 0 ? lastMIncome : totalIncome;
  const expectedRemainingIncomeThisMonth = Math.max(0, assumedIncome - totalIncome);
  const estEndBal = totalBalance + expectedRemainingIncomeThisMonth - (avgDailyExp * Math.max(1, dLeft));

  const monthlyNet = assumedIncome - estMonthlyExp;
  let estZeroDaysStr = "";
  let brokeDateStr = "";

  if (monthlyNet >= 0 || totalBalance <= 0) {
    estZeroDaysStr = "Bertumbuh / Stabil";
    brokeDateStr = "Aman (Surplus)";
  } else {
    const monthsTillBroke = totalBalance / Math.abs(monthlyNet);
    const daysTillBroke = Math.round(monthsTillBroke * 30.44); // Rata-rata hari per bulan
    const brokeDate = new Date(Date.now() + daysTillBroke * 86400000);
    brokeDateStr = brokeDate.toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric"});
    estZeroDaysStr = `${daysTillBroke} hari lagi`;
  }

  return (
    <div style={{padding:"0 16px 16px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {userAvatar?<img src={userAvatar} alt="" style={{width:42,height:42,borderRadius:12,objectFit:"cover"}}/>:<div style={{width:42,height:42,borderRadius:12,background:`linear-gradient(135deg,${G},${G2})`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff"}}><UserCircle size={22}/></div>}
          <div><p style={{margin:0,fontSize:11,color:"#9ca3af"}}>{greeting()},</p><p style={{margin:0,fontSize:15,fontWeight:800,color:"#111"}}>{userName}</p></div>
        </div>
      </div>

      <div style={{background:`linear-gradient(145deg,${G},${G2})`,borderRadius:22,padding:"22px 20px",marginBottom:12,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-40,right:-40,width:140,height:140,borderRadius:"50%",background:"rgba(255,255,255,0.07)"}}/>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
          <p style={{color:"rgba(255,255,255,0.75)",fontSize:12,margin:0}}>{LANG_CTX.lang==="en"?"Total Balance":"Total Saldo"}</p>
          <button type="button" onClick={()=>setHidden(p=>!p)} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:6,width:24,height:24,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff",flexShrink:0}}>{hidden?<EyeOff size={12}/>:<Eye size={12}/>}</button>
        </div>
        <p style={{color:"#fff",fontSize:28,fontWeight:800,margin:"0 0 18px",letterSpacing:-0.5}}>{show(totalBalance)}</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[{l:"Income",v:totalIncome,I:ArrowDownLeft,fn:()=>{setTxnFilter("income");setTab("transactions");}},{l:"Expense",v:totalExpense,I:ArrowUpRight,fn:()=>{setTxnFilter("expense");setTab("transactions");}}].map(x=>(
            <button type="button" key={x.l} onClick={x.fn} style={{background:"rgba(255,255,255,0.15)",borderRadius:14,padding:"11px 13px",border:"none",cursor:"pointer",textAlign:"left"}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}><div style={{width:20,height:20,borderRadius:6,background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff"}}><x.I size={11}/></div><span style={{color:"rgba(255,255,255,0.8)",fontSize:11}}>{x.l}</span></div>
              <p style={{color:"#fff",fontSize:14,fontWeight:800,margin:0}}>{hidden?mask(x.v):fmtShort(x.v)}</p>
            </button>
          ))}
        </div>
      </div>

      <div style={{display:"flex", gap:10, overflowX:"auto", paddingBottom:10, paddingLeft:16, paddingRight:16, margin:"0 -16px", scrollSnapType:"x mandatory", WebkitOverflowScrolling:"touch", scrollbarWidth:"none", msOverflowStyle:"none"}}>
        <style>{`::-webkit-scrollbar{display:none}`}</style>
        {/* Budget Card */}
        <div style={{minWidth:"calc(100% - 32px)", scrollSnapAlign:"start", flexShrink:0}}>
          <Card style={{marginBottom:0, display:"flex", flexDirection:"column", padding:"16px 20px"}}>
            <Row style={{marginBottom:10}}>
              <p style={{margin:0,fontSize:14,fontWeight:800,color:"#111"}}>{LANG_CTX.lang==="en"?"Monthly Budget":"Anggaran Bulanan"}</p>
              <button type="button" onClick={openBudget} style={{background:"none",border:"none",color:G,fontSize:13,fontWeight:700,cursor:"pointer"}}>Edit</button>
            </Row>
            <div style={{display:"flex",alignItems:"flex-start",gap:14}}>
              <div style={{position:"relative",width:60,height:60,flexShrink:0}}>
                <svg width="60" height="60" style={{transform:"rotate(-90deg)"}}>
                  <circle cx="30" cy="30" r="22" fill="none" stroke="#f1f5f9" strokeWidth="7"/>
                  <circle cx="30" cy="30" r="22" fill="none" stroke={budgetPct>=90?"#ef4444":budgetPct>=70?"#f59e0b":G} strokeWidth="7" strokeDasharray={`${2*Math.PI*22*(budgetPct/100)} ${2*Math.PI*22}`} strokeLinecap="round"/>
                </svg>
                <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:11,fontWeight:800,color:"#111"}}>{budgetPct}%</span></div>
              </div>
              <div style={{flex:1}}>
                <Row style={{marginBottom:3}}><span style={{fontSize:11,color:"#9ca3af"}}>Terpakai</span><span style={{fontSize:11,fontWeight:700,color:"#111"}}>{show(totalExpense)}</span></Row>
                <Row style={{marginBottom:3}}><span style={{fontSize:11,color:"#9ca3af"}}>Limit</span><span style={{fontSize:11,fontWeight:700,color:"#111"}}>{show(monthlyBudget)}</span></Row>
                <Row style={{marginBottom:0}}><span style={{fontSize:11,color:"#9ca3af"}}>Limit/hari</span><span style={{fontSize:11,fontWeight:700,color:budgetLeft<=0?"#ef4444":G}}>{budgetLeft<=0?"Habis!":`${hidden?mask():fmt(Math.max(0,Math.floor(budgetLeft/Math.max(1,dLeft))))}`}</span></Row>
              </div>
            </div>
            {/* Sisa Hari Ini — bottom section, same height as predictor bottom area */}
            <div style={{marginTop:10,padding:"9px 12px",background:todayRemain<0?"#fef2f2":GL,borderRadius:12,border:`1px solid ${todayRemain<0?"#fecaca":GM}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <p style={{margin:0,fontSize:9,fontWeight:800,color:todayRemain<0?"#ef4444":G,letterSpacing:.5}}>SISA HARI INI</p>
                <p style={{margin:"2px 0 0",fontSize:15,fontWeight:900,color:todayRemain<0?"#ef4444":G}}>{hidden?mask():(todayRemain<0?"Lewat batas":fmt(todayRemain))}</p>
              </div>
              {!hidden&&<p style={{margin:0,fontSize:9,color:"#9ca3af",textAlign:"right"}}>Keluar hari ini<br/><b style={{color:"#374151",fontSize:11}}>{fmt(todayExpense)}</b></p>}
            </div>
          </Card>
        </div>
        
        {/* Predictor Card */}
        <div style={{minWidth:"calc(100vw - 32px)",maxWidth:430,width:"calc(100vw - 32px)",scrollSnapAlign:"start",scrollSnapStop:"always",flexShrink:0}}>
          <Card style={{marginBottom:0, background:`linear-gradient(145deg,#0a4f38,${G2})`, display:"flex", flexDirection:"column"}}>
            <Row style={{marginBottom:6}}>
              <p style={{margin:0,fontSize:14,fontWeight:800,color:"#fff"}}>Prediksi Keuangan</p>
              <TrendingUp size={16} color="#6ee7b7"/>
            </Row>
            <p style={{fontSize:10, color:"rgba(255,255,255,0.7)", margin:"0 0 8px", lineHeight:1.4}}>Tren pemasukan bln ini: <b style={{color:"#a7f3d0"}}>{fmtShort(assumedIncome)}</b></p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <div style={{background:"rgba(255,255,255,0.12)",borderRadius:12,padding:"9px 10px"}}>
                <p style={{color:"rgba(255,255,255,0.65)",fontSize:9,fontWeight:700,margin:"0 0 3px",letterSpacing:.5}}>SISA ASET (EST.)</p>
                {(()=>{
                  const danger = !hidden && estEndBal < avgDailyExp * 7;
                  const col = hidden?"#fff":estEndBal<0?"#fca5a5":danger?"#fcd34d":"#a7f3d0";
                  return <p style={{color:col,fontSize:15,fontWeight:800,margin:0}}>{hidden?mask():fmt(estEndBal)}</p>;
                })()}
              </div>
              <div style={{background:"rgba(255,255,255,0.12)",borderRadius:12,padding:"9px 10px"}}>
                <p style={{color:"rgba(255,255,255,0.65)",fontSize:9,fontWeight:700,margin:"0 0 3px",letterSpacing:.5}}>ASET HABIS</p>
                {monthlyNet>=0
                  ?<p style={{color:"#a7f3d0",fontSize:12,fontWeight:700,margin:0}}>Surplus / Aman</p>
                  :<><p style={{color:"#fca5a5",fontSize:12,fontWeight:800,margin:0}}>{brokeDateStr}</p><p style={{color:"rgba(255,255,255,0.6)",fontSize:9,margin:"2px 0 0"}}>{estZeroDaysStr}</p></>
                }
              </div>
            </div>
            {/* Bottom row matching Monthly Budget's bottom bar height */}
            <div style={{marginTop:10,padding:"9px 12px",background:"rgba(255,255,255,0.10)",borderRadius:12,border:"1px solid rgba(255,255,255,0.15)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <p style={{margin:0,fontSize:9,fontWeight:800,color:"rgba(255,255,255,0.6)",letterSpacing:.5}}>AVG HARIAN</p>
                <p style={{margin:"2px 0 0",fontSize:15,fontWeight:900,color:"#a7f3d0"}}>{hidden?mask():fmt(Math.round(avgDailyExp))}</p>
              </div>
              <div style={{textAlign:"right"}}>
                <p style={{margin:0,fontSize:9,color:"rgba(255,255,255,0.55)"}}>Sisa hari ini<br/><b style={{color:"#fff",fontSize:11}}>{dLeft} hari</b></p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Row style={{marginBottom:10}}><p style={{margin:0,fontSize:14,fontWeight:800,color:"#111"}}>Akun Saya</p><button type="button" onClick={()=>setTab("accounts")} style={{background:"none",border:"none",color:G,fontSize:12,fontWeight:700,cursor:"pointer"}}>Lihat semua</button></Row>
      <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:6,scrollbarWidth:"none"}}>
        {accounts.length===0&&<div style={{background:"#fff",borderRadius:16,padding:"14px 20px",minWidth:160,color:"#9ca3af",fontSize:12}}>Belum ada akun</div>}
        {accounts.map((acc,i)=>{
          const T=ACC_TYPES.find(t=>t.type===acc.type);
          return (
            <button type="button" key={acc.id} onClick={()=>setSelectedAcc({acc,idx:i})} style={{background:getAccGrad(acc,i),borderRadius:16,padding:"14px",minWidth:155,flexShrink:0,border:"none",cursor:"pointer",textAlign:"left",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:-15,right:-15,width:50,height:50,borderRadius:"50%",background:"rgba(255,255,255,0.1)"}}/>
              <Row style={{marginBottom:10}}>
                <p style={{margin:0,fontSize:11,color:"rgba(255,255,255,0.9)",fontWeight:600,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{acc.name}</p>
                <div style={{color:"rgba(255,255,255,0.7)",flexShrink:0,display:"flex",alignItems:"center",gap:4}}>
                  {acc.balance<0&&<AlertTriangle size={11} color="#fbbf24"/>}
                  {T&&<T.Icon s={15}/>}
                </div>
              </Row>
              <p style={{color:acc.balance<0?"#fca5a5":"#fff",fontSize:16,fontWeight:800,margin:"0 0 5px"}}>{hidden?mask():fmtShort(acc.balance)}</p>
              <p style={{color:"rgba(255,255,255,0.6)",fontSize:10,margin:0,letterSpacing:2}}>{acc.last4?`•••• ${acc.last4}`:T?.label||""}</p>
            </button>
          );
        })}
      </div>

      <Row style={{margin:"14px 0 10px"}}><p style={{margin:0,fontSize:14,fontWeight:800,color:"#111"}}>Transaksi Terbaru</p><button type="button" onClick={()=>setTab("transactions")} style={{background:"none",border:"none",color:G,fontSize:12,fontWeight:700,cursor:"pointer"}}>Lihat semua</button></Row>
      <Card style={{padding:"4px 0"}}>
        {recent.length===0&&<p style={{color:"#9ca3af",textAlign:"center",padding:"20px",fontSize:13}}>Belum ada transaksi</p>}
        {recent.map((t,i)=>{
          const acc=accounts.find(a=>String(a.id)===String(t.accountId));
          return (
            <button type="button" key={t.id} onClick={()=>onTxnClick(t)} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderBottom:i<recent.length-1?"1px solid #f8fafc":"none",background:"none",borderTop:"none",borderLeft:"none",borderRight:"none",width:"100%",cursor:"pointer",textAlign:"left"}}>
              <CatBub cat={t.category}/>
              <div style={{flex:1,minWidth:0}}><p style={{margin:0,fontSize:13,fontWeight:600,color:"#111",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.note||"Transaksi"}</p><p style={{margin:"2px 0 0",fontSize:11,color:"#9ca3af"}}>{t.date}{t.time?` · ${t.time}`:""}</p></div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <p style={{margin:0,fontSize:13,fontWeight:800,color:t.type==="income"?G:"#ef4444"}}>{t.type==="income"?"+":"-"} {hidden?mask(t.amount):"Rp "+t.amount.toLocaleString("id-ID")}</p>
                <p style={{margin:"2px 0 0",fontSize:10,color:"#9ca3af"}}>{acc?.name||""}</p>
              </div>
            </button>
          );
        })}
      </Card>
      {showBudgetModal&&<BudgetModal totalBalance={totalBalance} currentBudget={monthlyBudget} savedPct={savedPct} onApply={(v,pct)=>{setMonthlyBudget(v);setSavedPct(pct);closeBudget();}} onClose={closeBudget}/>}
    </div>
  );
}

// ─── TRANSACTIONS SCREEN ──────────────────────────────────────────────────────
function TransactionsScreen({ transactions, accounts, onDelete, onEdit, onTxnClick, initialTypeFilter, onFilterConsumed, searchOpen, onSearchClose }) {
  const [typeF, setTypeF] = useState(initialTypeFilter||"all");
  const [dateF, setDateF] = useState("month");
  const [from,  setFrom]  = useState("");
  const [to,    setTo]    = useState(todayStr());
  const [search,setSearch]= useState("");
  const searchRef=useRef();

  useEffect(()=>{ if(initialTypeFilter){setTypeF(initialTypeFilter);onFilterConsumed?.();} },[initialTypeFilter, onFilterConsumed]);
  useEffect(()=>{ if(searchOpen&&searchRef.current)searchRef.current.focus(); },[searchOpen]);

  const filtered=useMemo(()=>{
    let arr=[...transactions].sort(sortByDateDesc);
    if(typeF!=="all")arr=arr.filter(t=>t.type===typeF);
    if(dateF==="today")arr=arr.filter(t=>t.date===todayStr());
    else if(dateF==="week")arr=arr.filter(t=>t.date>=startOfWeek());
    else if(dateF==="month")arr=arr.filter(t=>t.date>=startOfMonth());
    else if(dateF==="custom"&&from)arr=arr.filter(t=>t.date>=from&&t.date<=to);
    
    if(search.trim()){
      const q=search.toLowerCase();
      arr=arr.filter(t=>{
         const accName = accounts.find(a=>String(a.id)===String(t.accountId))?.name || "";
         return t.note?.toLowerCase().includes(q) || t.category?.toLowerCase().includes(q) || accName.toLowerCase().includes(q);
      });
    }
    return arr;
  },[transactions,typeF,dateF,from,to,search,accounts]);

  const totalInc=filtered.filter(t=>t.type==="income" && t.category!=="Penyesuaian Saldo").reduce((s,t)=>s+t.amount,0);
  const totalExp=filtered.filter(t=>t.type==="expense" && t.category!=="Penyesuaian Saldo").reduce((s,t)=>s+t.amount,0);
  const net=totalInc-totalExp;
  const grouped=useMemo(()=>{ const m=new Map();filtered.forEach(t=>{if(!m.has(t.date))m.set(t.date,[]);m.get(t.date).push(t);}); return Array.from(m.entries()).sort((a,b)=>new Date(b[0])-new Date(a[0])); },[filtered]);

  const FP=({label,active,onClick,col=G})=><button type="button" onClick={onClick} style={{padding:"7px 14px",borderRadius:99,border:`1.5px solid ${active?col:"#e5e7eb"}`,background:active?col:"#fff",color:active?"#fff":"#6b7280",fontSize:12,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>{label}</button>;

  return (
    <div style={{padding:"0 16px 16px"}}>
      {(searchOpen||search)&&(
        <div style={{display:"flex",alignItems:"center",gap:8,background:"#fff",borderRadius:14,padding:"10px 14px",marginBottom:10,boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
          <Search size={16} color="#9ca3af"/><input ref={searchRef} value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari transaksi, kategori..." style={{flex:1,border:"none",outline:"none",fontSize:14,color:"#111",background:"transparent"}}/><button type="button" onClick={()=>{setSearch("");onSearchClose?.();}} style={{background:"none",border:"none",cursor:"pointer",color:"#9ca3af",display:"flex"}}><X size={16}/></button>
        </div>
      )}
      <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4,marginBottom:8,scrollbarWidth:"none"}}><FP label="Semua" active={typeF==="all"} onClick={()=>setTypeF("all")}/><FP label="Pengeluaran" active={typeF==="expense"} onClick={()=>setTypeF("expense")} col="#ef4444"/><FP label="Pemasukan" active={typeF==="income"} onClick={()=>setTypeF("income")} col={G}/></div>
      <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:8,marginBottom:10,scrollbarWidth:"none"}}>{[{id:"all",l:"Semua"},{id:"month",l:"Bulan Ini"},{id:"today",l:"Hari Ini"},{id:"week",l:"Minggu Ini"},{id:"custom",l:"Custom"}].map(f=><FP key={f.id} label={f.l} active={dateF===f.id} onClick={()=>setDateF(f.id)}/>)}</div>
      {dateF==="custom"&&<Card style={{marginBottom:10}}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}><div><p style={{margin:"0 0 4px",fontSize:10,color:"#9ca3af",fontWeight:700}}>DARI</p><input type="date" value={from} onChange={e=>setFrom(e.target.value)} style={{border:"none",outline:"none",fontSize:12,fontWeight:600,color:"#111",colorScheme:"light",background:"transparent",width:"100%"}}/></div><div><p style={{margin:"0 0 4px",fontSize:10,color:"#9ca3af",fontWeight:700}}>SAMPAI</p><input type="date" value={to} onChange={e=>setTo(e.target.value)} style={{border:"none",outline:"none",fontSize:12,fontWeight:600,color:"#111",colorScheme:"light",background:"transparent",width:"100%"}}/></div></div></Card>}
      <div style={{background:`linear-gradient(135deg,${G},${G2})`,borderRadius:18,padding:"16px 18px",marginBottom:14}}>
        <Row><span style={{color:"rgba(255,255,255,0.8)",fontSize:12}}>{filtered.length} transaksi</span></Row>
        <p style={{color:"#fff",fontSize:22,fontWeight:800,margin:"4px 0 12px"}}>{net>=0?"+":""}Rp {Math.abs(net).toLocaleString("id-ID")}</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div><p style={{color:"rgba(255,255,255,0.7)",fontSize:10,margin:"0 0 2px"}}>↓ Pemasukan</p><p style={{color:"#fff",fontSize:12,fontWeight:700,margin:0}}>Rp {totalInc.toLocaleString("id-ID")}</p></div>
          <div><p style={{color:"rgba(255,255,255,0.7)",fontSize:10,margin:"0 0 2px"}}>↑ Pengeluaran</p><p style={{color:"#fff",fontSize:12,fontWeight:700,margin:0}}>Rp {totalExp.toLocaleString("id-ID")}</p></div>
        </div>
      </div>
      {grouped.length===0&&<Card style={{textAlign:"center",padding:"32px"}}><p style={{color:"#9ca3af",fontSize:13}}>Tidak ada transaksi</p></Card>}
      {grouped.map(([date,txns])=>(
        <div key={date}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",margin:"0 0 6px 2px"}}>
            <p style={{fontSize:10,fontWeight:700,color:"#9ca3af",letterSpacing:1,margin:0}}>{labelDate(date)}</p>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              {(()=>{const inc=txns.filter(t=>t.type==="income"&&t.category!=="Penyesuaian Saldo").reduce((s,t)=>s+t.amount,0);const exp=txns.filter(t=>t.type==="expense"&&t.category!=="Penyesuaian Saldo").reduce((s,t)=>s+t.amount,0);return(<>
                {inc>0&&<span style={{fontSize:10,fontWeight:700,color:G,background:"#e8f7f1",borderRadius:6,padding:"2px 7px"}}>+{fmtShort(inc)}</span>}
                {exp>0&&<span style={{fontSize:10,fontWeight:700,color:"#ef4444",background:"#fee2e2",borderRadius:6,padding:"2px 7px"}}>-{fmtShort(exp)}</span>}
              </>);})()}
            </div>
          </div>
          <Card style={{padding:"4px 0",marginBottom:12}}>
            {txns.map((t,i)=>{
              const acc=accounts.find(a=>String(a.id)===String(t.accountId));
              return (
                <button type="button" key={t.id} onClick={()=>onTxnClick(t)}
                  style={{display:"flex",alignItems:"center",gap:10,padding:"11px 14px",borderBottom:i<txns.length-1?"1px solid #f8fafc":"none",background:"none",borderTop:"none",borderLeft:"none",borderRight:"none",width:"100%",cursor:"pointer",textAlign:"left"}}>
                  <CatBub cat={t.category} size={40}/>
                  <div style={{flex:1,minWidth:0}}>
                    <p style={{margin:0,fontSize:13,fontWeight:600,color:"#111",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.note||"Transaksi"}</p>
                    <div style={{display:"flex",alignItems:"center",gap:5,marginTop:2}}>
                      <span style={{background:"#f1f5f9",color:"#6b7280",fontSize:9,fontWeight:600,padding:"2px 6px",borderRadius:99}}>{acc?.name||"?"}</span>
                      {t.time&&<span style={{color:"#9ca3af",fontSize:9}}>{t.time}</span>}
                      {t.detected&&<span style={{background:GL,color:G,fontSize:9,fontWeight:700,padding:"2px 6px",borderRadius:99}}>auto</span>}
                    </div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}><p style={{margin:0,fontSize:13,fontWeight:800,color:t.type==="income"?G:"#ef4444"}}>{t.type==="income"?"+":"-"}Rp {t.amount.toLocaleString("id-ID")}</p></div>
                </button>
              );
            })}
          </Card>
        </div>
      ))}
    </div>
  );
}


// ─── CURRENCY CONVERTER MODAL ─────────────────────────────────────────────────
const CURRENCIES = [
  {code:"USD",name:"Dolar AS",symbol:"$",flag:"🇺🇸"},
  {code:"EUR",name:"Euro",symbol:"€",flag:"🇪🇺"},
  {code:"GBP",name:"Pound Sterling",symbol:"£",flag:"🇬🇧"},
  {code:"JPY",name:"Yen Jepang",symbol:"¥",flag:"🇯🇵"},
  {code:"SGD",name:"Dolar Singapura",symbol:"S$",flag:"🇸🇬"},
  {code:"MYR",name:"Ringgit Malaysia",symbol:"RM",flag:"🇲🇾"},
  {code:"AUD",name:"Dolar Australia",symbol:"A$",flag:"🇦🇺"},
  {code:"SAR",name:"Riyal Arab Saudi",symbol:"﷼",flag:"🇸🇦"},
  {code:"CNY",name:"Yuan Tiongkok",symbol:"¥",flag:"🇨🇳"},
  {code:"KRW",name:"Won Korea",symbol:"₩",flag:"🇰🇷"},
  {code:"INR",name:"Rupee India",symbol:"₹",flag:"🇮🇳"},
  {code:"PICK",name:"Pilih Negara",symbol:"?",flag:"🌏"},
];
const ALL_WORLD_CURRENCIES=[
  {code:"AED",name:"Dirham UAE",flag:"🇦🇪"},{code:"AFN",name:"Afghani",flag:"🇦🇫"},
  {code:"ALL",name:"Lek Albania",flag:"🇦🇱"},{code:"AMD",name:"Dram Armenia",flag:"🇦🇲"},
  {code:"ANG",name:"Guilder Antilles",flag:"🇨🇼"},{code:"AOA",name:"Kwanza Angola",flag:"🇦🇴"},
  {code:"ARS",name:"Peso Argentina",flag:"🇦🇷"},{code:"AUD",name:"Dolar Australia",flag:"🇦🇺"},
  {code:"AWG",name:"Florin Aruba",flag:"🇦🇼"},{code:"AZN",name:"Manat Azerbaijan",flag:"🇦🇿"},
  {code:"BAM",name:"Mark Bosnia",flag:"🇧🇦"},{code:"BBD",name:"Dolar Barbados",flag:"🇧🇧"},
  {code:"BDT",name:"Taka Bangladesh",flag:"🇧🇩"},{code:"BGN",name:"Lev Bulgaria",flag:"🇧🇬"},
  {code:"BHD",name:"Dinar Bahrain",flag:"🇧🇭"},{code:"BMD",name:"Dolar Bermuda",flag:"🇧🇲"},
  {code:"BND",name:"Dolar Brunei",flag:"🇧🇳"},{code:"BOB",name:"Boliviano Bolivia",flag:"🇧🇴"},
  {code:"BRL",name:"Real Brazil",flag:"🇧🇷"},{code:"BSD",name:"Dolar Bahamas",flag:"🇧🇸"},
  {code:"BTN",name:"Ngultrum Bhutan",flag:"🇧🇹"},{code:"BWP",name:"Pula Botswana",flag:"🇧🇼"},
  {code:"BYN",name:"Rubel Belarus",flag:"🇧🇾"},{code:"BZD",name:"Dolar Belize",flag:"🇧🇿"},
  {code:"CAD",name:"Dolar Kanada",flag:"🇨🇦"},{code:"CHF",name:"Franc Swiss",flag:"🇨🇭"},
  {code:"CLP",name:"Peso Chile",flag:"🇨🇱"},{code:"CNY",name:"Yuan Tiongkok",flag:"🇨🇳"},
  {code:"COP",name:"Peso Kolombia",flag:"🇨🇴"},{code:"CRC",name:"Colon Kosta Rika",flag:"🇨🇷"},
  {code:"CZK",name:"Koruna Ceko",flag:"🇨🇿"},{code:"DKK",name:"Krone Denmark",flag:"🇩🇰"},
  {code:"DOP",name:"Peso Dom. Rep.",flag:"🇩🇴"},{code:"DZD",name:"Dinar Aljazair",flag:"🇩🇿"},
  {code:"EGP",name:"Pound Mesir",flag:"🇪🇬"},{code:"EUR",name:"Euro",flag:"🇪🇺"},
  {code:"FJD",name:"Dolar Fiji",flag:"🇫🇯"},{code:"GBP",name:"Pound Sterling",flag:"🇬🇧"},
  {code:"GEL",name:"Lari Georgia",flag:"🇬🇪"},{code:"GHS",name:"Cedi Ghana",flag:"🇬🇭"},
  {code:"HKD",name:"Dolar Hong Kong",flag:"🇭🇰"},{code:"HRK",name:"Kuna Kroasia",flag:"🇭🇷"},
  {code:"HUF",name:"Forint Hungaria",flag:"🇭🇺"},{code:"IDR",name:"Rupiah",flag:"🇮🇩"},
  {code:"ILS",name:"Shekel Israel",flag:"🇮🇱"},{code:"INR",name:"Rupee India",flag:"🇮🇳"},
  {code:"IQD",name:"Dinar Irak",flag:"🇮🇶"},{code:"IRR",name:"Rial Iran",flag:"🇮🇷"},
  {code:"ISK",name:"Krona Islandia",flag:"🇮🇸"},{code:"JMD",name:"Dolar Jamaika",flag:"🇯🇲"},
  {code:"JOD",name:"Dinar Yordania",flag:"🇯🇴"},{code:"JPY",name:"Yen Jepang",flag:"🇯🇵"},
  {code:"KES",name:"Shilling Kenya",flag:"🇰🇪"},{code:"KHR",name:"Riel Kamboja",flag:"🇰🇭"},
  {code:"KRW",name:"Won Korea",flag:"🇰🇷"},{code:"KWD",name:"Dinar Kuwait",flag:"🇰🇼"},
  {code:"KZT",name:"Tenge Kazakhstan",flag:"🇰🇿"},{code:"LAK",name:"Kip Laos",flag:"🇱🇦"},
  {code:"LBP",name:"Pound Lebanon",flag:"🇱🇧"},{code:"LKR",name:"Rupee Sri Lanka",flag:"🇱🇰"},
  {code:"MAD",name:"Dirham Maroko",flag:"🇲🇦"},{code:"MDL",name:"Leu Moldova",flag:"🇲🇩"},
  {code:"MKD",name:"Denar Makedonia",flag:"🇲🇰"},{code:"MMK",name:"Kyat Myanmar",flag:"🇲🇲"},
  {code:"MNT",name:"Tugrik Mongolia",flag:"🇲🇳"},{code:"MOP",name:"Pataca Makao",flag:"🇲🇴"},
  {code:"MUR",name:"Rupee Mauritius",flag:"🇲🇺"},{code:"MVR",name:"Rufiyaa Maladewa",flag:"🇲🇻"},
  {code:"MXN",name:"Peso Meksiko",flag:"🇲🇽"},{code:"MYR",name:"Ringgit Malaysia",flag:"🇲🇾"},
  {code:"MZN",name:"Metical Mozambik",flag:"🇲🇿"},{code:"NAD",name:"Dolar Namibia",flag:"🇳🇦"},
  {code:"NGN",name:"Naira Nigeria",flag:"🇳🇬"},{code:"NOK",name:"Krone Norwegia",flag:"🇳🇴"},
  {code:"NPR",name:"Rupee Nepal",flag:"🇳🇵"},{code:"NZD",name:"Dolar Selandia Baru",flag:"🇳🇿"},
  {code:"OMR",name:"Rial Oman",flag:"🇴🇲"},{code:"PAB",name:"Balboa Panama",flag:"🇵🇦"},
  {code:"PEN",name:"Sol Peru",flag:"🇵🇪"},{code:"PHP",name:"Peso Filipina",flag:"🇵🇭"},
  {code:"PKR",name:"Rupee Pakistan",flag:"🇵🇰"},{code:"PLN",name:"Zloty Polandia",flag:"🇵🇱"},
  {code:"QAR",name:"Riyal Qatar",flag:"🇶🇦"},{code:"RON",name:"Leu Rumania",flag:"🇷🇴"},
  {code:"RSD",name:"Dinar Serbia",flag:"🇷🇸"},{code:"RUB",name:"Rubel Rusia",flag:"🇷🇺"},
  {code:"SAR",name:"Riyal Saudi",flag:"🇸🇦"},{code:"SDG",name:"Pound Sudan",flag:"🇸🇩"},
  {code:"SEK",name:"Krona Swedia",flag:"🇸🇪"},{code:"SGD",name:"Dolar Singapura",flag:"🇸🇬"},
  {code:"THB",name:"Baht Thailand",flag:"🇹🇭"},{code:"TRY",name:"Lira Turki",flag:"🇹🇷"},
  {code:"TTD",name:"Dolar Trinidad",flag:"🇹🇹"},{code:"TWD",name:"Dolar Taiwan",flag:"🇹🇼"},
  {code:"TZS",name:"Shilling Tanzania",flag:"🇹🇿"},{code:"UAH",name:"Hryvnia Ukraina",flag:"🇺🇦"},
  {code:"UGX",name:"Shilling Uganda",flag:"🇺🇬"},{code:"USD",name:"Dolar AS",flag:"🇺🇸"},
  {code:"UYU",name:"Peso Uruguay",flag:"🇺🇾"},{code:"UZS",name:"Som Uzbekistan",flag:"🇺🇿"},
  {code:"VND",name:"Dong Vietnam",flag:"🇻🇳"},{code:"XAF",name:"Franc CFA Afrika Tengah",flag:"🌍"},
  {code:"XOF",name:"Franc CFA Afrika Barat",flag:"🌍"},{code:"ZAR",name:"Rand Afrika Selatan",flag:"🇿🇦"},
  {code:"ZMW",name:"Kwacha Zambia",flag:"🇿🇲"},
];

function CurrencyModal({ totalBalance, onClose }) {
  const [selected, setSelected] = useState("USD");
  const [rates, setRates] = useState({});  // rates[code] = 1 code = X IDR
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [lastUpdate, setLastUpdate] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [pickSearch, setPickSearch] = useState("");
  const [customCur, setCustomCur] = useState(null); // {code,name,flag}

  const fetchRates = async () => {
    setLoading(true); setErr("");
    try {
      // Fetch USD-based rates, then convert to "1 XXX = Y IDR" by dividing IDR/XXX
      const res = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
      if(!res.ok) throw new Error("Gagal ambil kurs");
      const data = await res.json();
      const r = data.rates||{};
      const idrPerUsd = r.IDR||15600;
      // Convert: 1 XXX = (idrPerUsd / r[XXX]) IDR
      const converted = {};
      Object.keys(r).forEach(code=>{ if(r[code]) converted[code] = idrPerUsd / r[code]; });
      converted.IDR = 1;
      setRates(converted);
      setLastUpdate(new Date().toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit"}));
    } catch(e) {
      // Fallback: approximate "1 XXX = Y IDR"
      setRates({USD:15800,EUR:17200,GBP:20100,JPY:105,SGD:11900,MYR:3550,AUD:10400,SAR:4210,CNY:2180,KRW:11.8,INR:190});
      setErr("Menggunakan kurs estimasi (offline)");
    } finally { setLoading(false); }
  };

  useEffect(()=>{ fetchRates(); },[]);

  const activeCur = customCur || CURRENCIES.find(c=>c.code===selected) || CURRENCIES[0];
  const idrPerUnit = rates[activeCur.code] || 0;
  const fmtForeign = (val) => {
    if (!val) return "-";
    if (val >= 1e9) return (val/1e9).toFixed(2)+"M";
    if (val >= 1e6) return (val/1e6).toFixed(2)+"Jt";
    if (val >= 1e3) return (val/1e3).toFixed(1)+"K";
    if (val < 1) return val.toFixed(4);
    return val.toLocaleString("id-ID",{maximumFractionDigits:2});
  };
  const totalInForeign = idrPerUnit ? totalBalance / idrPerUnit : null;

  const pickerList = ALL_WORLD_CURRENCIES.filter(c=>
    !pickSearch || c.name.toLowerCase().includes(pickSearch.toLowerCase()) || c.code.toLowerCase().includes(pickSearch.toLowerCase())
  );

  return (
    <BottomSheet onClose={onClose} title="Konversi Kurs">
      <Card style={{background:`linear-gradient(135deg,${G},${G2})`,marginBottom:12}}>
        <p style={{color:"rgba(255,255,255,0.8)",fontSize:11,margin:"0 0 2px"}}>Total Saldo</p>
        <p style={{color:"#fff",fontSize:20,fontWeight:900,margin:0,lineHeight:1.2}}>
          {fmt(totalBalance)}
          {totalInForeign!=null && idrPerUnit && (
            <span style={{fontSize:13,fontWeight:600,opacity:0.85,marginLeft:6}}>
              / {activeCur.symbol||""}{fmtForeign(totalInForeign)} {activeCur.code}
            </span>
          )}
        </p>
      </Card>

      <p style={{margin:"0 0 10px",fontSize:11,fontWeight:700,color:"#9ca3af",letterSpacing:.6}}>PILIH MATA UANG</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:14}}>
        {CURRENCIES.map(cur=>(
          <button type="button" key={cur.code} onClick={()=>{
            if(cur.code==="PICK"){setShowPicker(true);return;}
            setSelected(cur.code); setCustomCur(null);
          }}
            style={{padding:"8px 4px",background:(customCur?activeCur.code===cur.code:selected===cur.code)?GL:"#f8fafc",
              border:`1.5px solid ${(customCur?activeCur.code===cur.code:selected===cur.code)?G:"#f1f5f9"}`,
              borderRadius:14,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center"}}>
            <div style={{fontSize:20,marginBottom:2}}>{cur.flag}</div>
            <p style={{margin:0,fontSize:cur.code==="PICK"?10:11,fontWeight:700,color:(customCur?activeCur.code===cur.code:selected===cur.code)?G:"#374151"}}>
              {cur.code==="PICK"?(customCur?customCur.code:"Pilih"):cur.code}
            </p>
          </button>
        ))}
      </div>

      {loading?(
        <div style={{textAlign:"center",padding:"20px 0"}}>
          <div style={{fontSize:24,animation:"spin 1s linear infinite",display:"inline-block"}}>⚙️</div>
          <p style={{color:G,fontSize:12,marginTop:8}}>Mengambil kurs real-time...</p>
        </div>
      ):(
        <Card style={{background:"#111827",marginBottom:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
            <div>
              <p style={{color:"rgba(255,255,255,0.65)",fontSize:10,margin:"0 0 4px"}}>{activeCur.flag} {activeCur.name}</p>
              <p style={{color:"#fff",fontSize:26,fontWeight:900,margin:0}}>
                {idrPerUnit ? "Rp "+Math.round(idrPerUnit).toLocaleString("id-ID") : "-"}
              </p>
              <p style={{color:"rgba(255,255,255,0.5)",fontSize:10,margin:"4px 0 0"}}>per 1 {activeCur.code}</p>
            </div>
            <button type="button" onClick={fetchRates} style={{background:"rgba(255,255,255,0.1)",border:"none",borderRadius:9,padding:"6px 10px",color:"#fff",fontSize:11,cursor:"pointer"}}>↻ Refresh</button>
          </div>
          {lastUpdate&&<p style={{color:"rgba(255,255,255,0.4)",fontSize:9,margin:"4px 0 0"}}>Update: {lastUpdate}</p>}
          {err&&<p style={{color:"#fca5a5",fontSize:10,marginTop:4}}>{err}</p>}
        </Card>
      )}

      {/* Country Picker Modal */}
      {showPicker&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:400,display:"flex",alignItems:"flex-end"}}>
          <div style={{background:"#fff",width:"100%",maxWidth:430,margin:"0 auto",borderRadius:"20px 20px 0 0",maxHeight:"80vh",display:"flex",flexDirection:"column"}}>
            <div style={{padding:"16px 16px 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <p style={{margin:0,fontSize:15,fontWeight:800,color:"#111"}}>Pilih Negara</p>
              <button type="button" onClick={()=>setShowPicker(false)} style={{background:"#f1f5f9",border:"none",borderRadius:99,width:32,height:32,cursor:"pointer",fontSize:16}}>✕</button>
            </div>
            <div style={{padding:"10px 16px"}}>
              <input value={pickSearch} onChange={e=>setPickSearch(e.target.value)} placeholder="Cari negara atau kode mata uang..."
                style={{width:"100%",background:"#f8fafc",border:"1.5px solid #e5e7eb",borderRadius:12,padding:"10px 12px",fontSize:13,outline:"none",boxSizing:"border-box"}}/>
            </div>
            <div style={{overflowY:"auto",flex:1}}>
              {pickerList.map(cur=>(
                <button type="button" key={cur.code} onClick={()=>{setCustomCur(cur);setShowPicker(false);setPickSearch("");}}
                  style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:"none",border:"none",
                    borderBottom:"1px solid #f8fafc",cursor:"pointer",textAlign:"left"}}>
                  <span style={{fontSize:22}}>{cur.flag}</span>
                  <div style={{flex:1}}>
                    <p style={{margin:0,fontSize:13,fontWeight:700,color:"#111"}}>{cur.name}</p>
                    <p style={{margin:0,fontSize:11,color:"#9ca3af"}}>{cur.code}</p>
                  </div>
                  {rates[cur.code]&&<p style={{margin:0,fontSize:12,fontWeight:700,color:G}}>Rp{Math.round(rates[cur.code]).toLocaleString("id-ID")}</p>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </BottomSheet>
  );
}

// ─── ACCOUNTS SCREEN ──────────────────────────────────────────────────────────
function AccountsScreen({ accounts, setAccounts, transactions, setTransactions, setSelectedAcc, registerLocalModal, unregisterLocalModal, onOpenTransfer }) {
  const [editAcc,   setEditAcc]   = useState(null);
  const [showAdd,   setShowAdd]   = useState(false);
  const [delConfirm,setDelConfirm]= useState(null);
  const [editMode, setEditMode] = useState(false);
  const [draggingId, setDraggingId] = useState(null);
  const [showCurrency, setShowCurrency] = useState(false);
  const holdTimerRef = useRef(null);
  const didLongPressRef = useRef(false);
  const openEditAcc  = (data) => { setEditAcc(data);  registerLocalModal?.(()=>setEditAcc(null)); };
  const closeEditAcc = () => { setEditAcc(null); unregisterLocalModal?.(); };
  const openAddAcc   = () => { setShowAdd(true);  registerLocalModal?.(()=>setShowAdd(false)); };
  const closeAddAcc  = () => { setShowAdd(false); unregisterLocalModal?.(); };
  const openDelConfirm  = (data) => { setDelConfirm(data);  registerLocalModal?.(()=>setDelConfirm(null)); };
  const closeDelConfirm = () => { setDelConfirm(null); unregisterLocalModal?.(); };
  const total = accounts.reduce((s,a)=>s+a.balance,0);

  const moveItem = useCallback((arr, from, to) => {
    if (from === to || from < 0 || to < 0 || from >= arr.length || to >= arr.length) return arr;
    const next = [...arr];
    const [it] = next.splice(from, 1);
    next.splice(to, 0, it);
    return next;
  }, []);

  const handleSaveAcc = (updated, adjustment) => {
    setAccounts(p=>p.map(a=>a.id===updated.id ? {...a,...updated,balance:adjustment!=null?(a.balance+adjustment):a.balance} : a));
    if (adjustment!=null && adjustment!==0) {
      const adjTxn = { id:generateId(), type:adjustment>0?"income":"expense", amount:Math.abs(adjustment), category:"Penyesuaian Saldo", note:`Penyesuaian saldo — ${updated.name}`, date:todayStr(), time:nowTime(), accountId:updated.id, detected:null, attachmentMeta:[] };
      setTransactions(p=>[adjTxn,...p]);
    }
    closeEditAcc();
  };
  
  const stopHoldTimer = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  };

  return (
    <div style={{padding:"0 16px 16px"}}>
      <div style={{background:`linear-gradient(145deg,${G},${G2})`,borderRadius:22,padding:"20px 22px",marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <p style={{color:"rgba(255,255,255,0.75)",fontSize:12,margin:"0 0 4px"}}>Total Semua Akun</p>
            <p style={{color:"#fff",fontSize:26,fontWeight:800,margin:0}}>{fmt(total)}</p>
          </div>
          <button type="button" onClick={()=>setShowCurrency(true)} style={{background:"rgba(255,255,255,0.2)",border:"1.5px solid rgba(255,255,255,0.35)",borderRadius:12,padding:"8px 12px",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
            <Coins size={15} strokeWidth={1.8}/> Kurs
          </button>
        </div>
      </div>
      <Row style={{marginBottom:10}}>
        <p style={{margin:0,fontSize:14,fontWeight:800,color:"#111"}}>Daftar Akun</p>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <button type="button" onClick={()=>setEditMode(p=>!p)} style={{background:"#f1f5f9",border:"none",borderRadius:10,padding:"7px 12px",color:"#374151",fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
            <Pencil size={14} strokeWidth={1.8}/> {editMode ? "Selesai" : "Edit"}
          </button>
          <button type="button" onClick={onOpenTransfer} disabled={accounts.length<2} style={{background:accounts.length<2?"#e5e7eb":GL,border:"none",borderRadius:10,padding:"7px 12px",color:accounts.length<2?"#9ca3af":G,fontSize:12,fontWeight:700,cursor:accounts.length<2?"not-allowed":"pointer",display:"flex",alignItems:"center",gap:6}}>
            <ArrowUpRight size={14} strokeWidth={1.8}/> Transfer
          </button>
          <button type="button" onClick={openAddAcc} style={{background:GL,border:"none",borderRadius:10,padding:"7px 12px",color:G,fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}><Plus size={14}/> Tambah</button>
        </div>
      </Row>
      {accounts.length===0&&<Card style={{textAlign:"center",padding:"24px"}}><p style={{color:"#9ca3af",fontSize:13}}>Belum ada akun. Tambah sekarang!</p></Card>}
      
      <style>{`
        @keyframes jiggle { 0%{transform:rotate(-1.5deg)} 100%{transform:rotate(1.5deg)} }
      `}</style>

      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10}}>
        {accounts.map((acc,i)=>{
          const T=ACC_TYPES.find(t=>t.type===acc.type);
          return (
            <div
              key={acc.id}
              data-acc-id={String(acc.id)}
              style={{
                borderRadius:18,
                overflow:"hidden",
                background:"#fff",
                border:"1px solid #eef2f7",
                boxShadow:"0 2px 12px rgba(0,0,0,0.05)",
                animation: editMode && draggingId!==String(acc.id) ? "jiggle 0.12s ease-in-out infinite alternate" : "none",
                transform: "scale(1)",
                opacity: draggingId===String(acc.id) ? 0.35 : 1,
                touchAction: editMode ? "none" : "manipulation",
              }}
              onPointerDown={(e)=>{
                if (editMode) {
                  setDraggingId(String(acc.id));
                  try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
                  // create floating ghost
                  const rect=e.currentTarget.getBoundingClientRect();
                  const ghost=document.createElement("div");
                  ghost.id="drag-ghost";
                  ghost.style.cssText=`position:fixed;pointer-events:none;z-index:999;width:${rect.width}px;height:${rect.height}px;left:${e.clientX}px;top:${e.clientY}px;transform:translate(-50%,-50%) scale(1.06) rotate(3deg);border-radius:18px;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,0.3);opacity:0.92;transition:transform 0.05s`;
                  ghost.innerHTML=e.currentTarget.outerHTML;
                  document.body.appendChild(ghost);
                  return;
                }
                didLongPressRef.current = false;
                stopHoldTimer();
                holdTimerRef.current = setTimeout(()=>{
                  didLongPressRef.current = true;
                  setEditMode(true);
                  setDraggingId(String(acc.id));
                }, 320);
              }}
              onPointerMove={(e)=>{
                if (!editMode || !draggingId) return;
                e.preventDefault();
                // smooth floating: update ghost position
                const ghost = document.getElementById("drag-ghost");
                if(ghost){ghost.style.left=e.clientX+"px";ghost.style.top=e.clientY+"px";}
                const el = document.elementFromPoint(e.clientX, e.clientY);
                const target = el?.closest?.("[data-acc-id]");
                const targetId = target?.getAttribute?.("data-acc-id");
                if (!targetId || targetId === draggingId) return;
                const from = accounts.findIndex(a=>String(a.id)===String(draggingId));
                const to   = accounts.findIndex(a=>String(a.id)===String(targetId));
                if (from === -1 || to === -1) return;
                setAccounts(prev => moveItem(prev, from, to));
              }}
              onPointerUp={()=>{
                stopHoldTimer();
                if (editMode) { setDraggingId(null); document.getElementById("drag-ghost")?.remove(); }
              }}
              onPointerCancel={()=>{
                stopHoldTimer();
                if (editMode) { setDraggingId(null); document.getElementById("drag-ghost")?.remove(); }
              }}
              onClick={()=>{
                stopHoldTimer();
                if (didLongPressRef.current) { didLongPressRef.current = false; return; }
                if (editMode) return;
                setSelectedAcc({acc, idx:i});
              }}
            >
              <div style={{background:getAccGrad(acc,i),padding:"14px 14px 12px",position:"relative"}}>
                <div style={{position:"absolute",top:-18,right:-18,width:60,height:60,borderRadius:"50%",background:"rgba(255,255,255,0.10)"}}/>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,minWidth:0}}>
                    <div style={{width:38,height:38,borderRadius:12,background:"rgba(255,255,255,0.22)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",flexShrink:0}}>
                      {acc.iconImg?<img src={acc.iconImg} alt="" style={{width:26,height:26,borderRadius:8,objectFit:"cover"}}/>:T&&<T.Icon s={20}/>}
                    </div>
                    <div style={{minWidth:0}}>
                      <p style={{margin:0,fontSize:13,fontWeight:800,color:"#fff",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{acc.name}</p>
                      <p style={{margin:"2px 0 0",fontSize:10,color:"rgba(255,255,255,0.75)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{acc.last4?`•••• ${acc.last4}`:T?.label}</p>
                    </div>
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:6,marginTop:10}}>
                  <p style={{margin:0,fontSize:16,fontWeight:900,color:acc.balance<0?"#fca5a5":"#fff",letterSpacing:-0.2}}>{fmtShort(acc.balance)}</p>
                  {acc.balance<0&&<div style={{background:"#fbbf24",borderRadius:6,padding:"2px 6px",display:"flex",alignItems:"center",gap:3}}><AlertTriangle size={10} color="#78350f"/><span style={{fontSize:9,fontWeight:800,color:"#78350f"}}>NEG</span></div>}
                </div>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:0,borderTop:"1px solid #f1f5f9"}}>
                <button type="button" onClick={(e)=>{e.stopPropagation();openEditAcc({acc,idx:i});}} style={{padding:"10px 0",background:"#fff",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6,color:G,fontWeight:700,fontSize:12,borderRight:"1px solid #f1f5f9"}}>
                  <Pencil size={13}/> Edit
                </button>
                <button type="button" onClick={(e)=>{e.stopPropagation();openDelConfirm({acc,txnCount:transactions.filter(t=>String(t.accountId)===String(acc.id)).length});}} style={{padding:"10px 0",background:"#fff",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6,color:"#ef4444",fontWeight:700,fontSize:12}}>
                  <Trash2 size={13}/> Hapus
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {editAcc&&<AccountModal initial={editAcc.acc} onClose={closeEditAcc} isNew={false} onSave={handleSaveAcc}/>}
      {showAdd&&<AccountModal isNew onClose={closeAddAcc} onSave={(a,_)=>{setAccounts(p=>[...p,{...a,id:generateId(),balance:a.balance||0}]);closeAddAcc();}}/>}
      {delConfirm&&<ConfirmDialog title="Hapus Akun?" sub={`Akun "${delConfirm.acc.name}" dan ${delConfirm.txnCount} transaksi terkait akan dihapus permanen.`} onConfirm={()=>{setAccounts(p=>p.filter(a=>a.id!==delConfirm.acc.id));setTransactions(p=>p.filter(t=>String(t.accountId)!==String(delConfirm.acc.id)));closeDelConfirm();}} onCancel={closeDelConfirm}/>}
      {showCurrency&&<CurrencyModal totalBalance={total} onClose={()=>setShowCurrency(false)}/>}
    </div>
  );
}


// ─── PIE CHART + CATEGORY LIST (interactive cross-highlight) ─────────────────
function PieCatCard({ pieData, totalExp }) {
  const [activeIdx, setActiveIdx] = useState(null);
  const activeName = activeIdx != null ? pieData[activeIdx]?.name : null;

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div style={{background:"#fff",border:"1px solid #f1f5f9",borderRadius:14,padding:"10px 12px",boxShadow:"0 6px 20px rgba(0,0,0,0.12)",display:"flex",alignItems:"center",gap:10,minWidth:140}}>
        <div style={{width:32,height:32,borderRadius:9,background:CAT_BG[d.name]||"#f3f4f6",display:"flex",alignItems:"center",justifyContent:"center",color:CAT_COLORS[d.name]||"#9ca3af",flexShrink:0}}>{CAT_ICON(d.name,15)}</div>
        <div>
          <p style={{margin:0,fontSize:11,fontWeight:700,color:"#111"}}>{d.name}</p>
          <p style={{margin:"2px 0 0",fontSize:13,fontWeight:800,color:CAT_COLORS[d.name]||"#9ca3af"}}>{fmt(d.value)}</p>
          <p style={{margin:0,fontSize:10,color:"#9ca3af"}}>{d.pct}%</p>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <p style={{margin:"0 0 10px",fontSize:14,fontWeight:800,color:"#111"}}>Pengeluaran per Kategori</p>
      <div style={{position:"relative",userSelect:"none",WebkitUserSelect:"none"}}>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart style={{outline:"none"}}>
            <Pie
              data={pieData} cx="50%" cy="50%" outerRadius={90} innerRadius={55} paddingAngle={2}
              dataKey="value" style={{outline:"none"}} stroke="none"
              activeIndex={activeIdx}
              activeShape={(props)=>{
                const {cx,cy,innerRadius,outerRadius,startAngle,endAngle,fill}=props;
                return(
                  <g>
                    <path d={`M${cx},${cy}m0,0`} fill="none"/>
                    <path d={require("recharts").default?.Sector?"":`M${cx},${cy}`} fill={fill} opacity={1}/>
                    <g>
                      <path style={{filter:"drop-shadow(0 4px 8px rgba(0,0,0,0.2))"}}/>
                    </g>
                  </g>
                );
              }}
              onMouseEnter={(_,idx)=>setActiveIdx(idx)}
              onMouseLeave={()=>setActiveIdx(null)}
              onClick={(_,idx)=>setActiveIdx(ai=>ai===idx?null:idx)}
            >
              {pieData.map((e,i)=>(
                <Cell key={i} fill={e.color} style={{outline:"none",cursor:"pointer"}}
                  opacity={activeIdx==null||activeIdx===i?1:0.35}
                  transform={activeIdx===i?"scale(1.06)":"scale(1)"}
                  style={{outline:"none",cursor:"pointer",transition:"opacity .2s, transform .2s",transformOrigin:"center"}}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip/>}/>
          </PieChart>
        </ResponsiveContainer>
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center",pointerEvents:"none"}}>
          {activeName?(
            <>
              <div style={{display:"flex",justifyContent:"center",marginBottom:3,color:CAT_COLORS[activeName]||"#9ca3af"}}>{CAT_ICON(activeName,14)}</div>
              <p style={{margin:0,fontSize:9,color:"#9ca3af",maxWidth:60,textAlign:"center",lineHeight:1.2}}>{activeName}</p>
            </>
          ):(
            <>
              <p style={{margin:0,fontSize:10,color:"#9ca3af"}}>Total</p>
              <p style={{margin:0,fontSize:14,fontWeight:800,color:"#111"}}>{fmtShort(totalExp)}</p>
            </>
          )}
        </div>
      </div>
      {/* External tooltip - shown ABOVE pie, not inside it */}
      {activeName!=null&&pieData[activeIdx]&&(
        <div style={{background:"#fff",border:`2px solid ${CAT_COLORS[activeName]||"#e5e7eb"}`,borderRadius:14,padding:"8px 14px",
          marginBottom:8,display:"flex",alignItems:"center",gap:10,boxShadow:"0 4px 16px rgba(0,0,0,0.10)"}}>
          <div style={{width:36,height:36,borderRadius:10,background:CAT_BG[activeName]||"#f3f4f6",display:"flex",alignItems:"center",justifyContent:"center",color:CAT_COLORS[activeName]||"#9ca3af"}}>
            {CAT_ICON(activeName,18)}
          </div>
          <div style={{flex:1}}>
            <p style={{margin:0,fontSize:12,fontWeight:800,color:"#111"}}>{activeName}</p>
            <p style={{margin:"1px 0 0",fontSize:10,color:"#9ca3af"}}>{pieData[activeIdx]?.pct}% dari total pengeluaran</p>
          </div>
          <p style={{margin:0,fontSize:14,fontWeight:900,color:CAT_COLORS[activeName]||G}}>{fmt(pieData[activeIdx]?.value||0)}</p>
        </div>
      )}
      <div style={{marginTop:8}}>
        {pieData.slice(0,6).map((p,i)=>{
          const isActive = activeName===p.name;
          const isDimmed = activeName&&!isActive;
          return (
            <div key={i} onClick={()=>setActiveIdx(ai=>pieData[ai]?.name===p.name?null:i)}
              style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:i<Math.min(pieData.length,6)-1?"1px solid #f8fafc":"none",cursor:"pointer",opacity:isDimmed?0.35:1,transition:"opacity .2s",borderRadius:10,background:isActive?CAT_BG[p.name]||"#f8fafc":"transparent",paddingLeft:isActive?8:0,paddingRight:isActive?8:0}}>
              <div style={{width:34,height:34,borderRadius:10,background:CAT_BG[p.name]||"#f3f4f6",display:"flex",alignItems:"center",justifyContent:"center",color:CAT_COLORS[p.name]||"#9ca3af",flexShrink:0,transform:isActive?"scale(1.1)":"scale(1)",transition:"transform .2s"}}>{CAT_ICON(p.name,15)}</div>
              <div style={{flex:1}}>
                <p style={{margin:0,fontSize:12,fontWeight:isActive?800:700,color:"#111"}}>{p.name}</p>
                <p style={{margin:"1px 0 0",fontSize:10,color:"#9ca3af"}}>{p.pct}%</p>
              </div>
              <p style={{margin:0,fontSize:12,fontWeight:isActive?800:700,color:isActive?CAT_COLORS[p.name]||G:"#111"}}>{fmtShort(p.value)}</p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ─── CHARTS SCREEN ────────────────────────────────────────────────────────────
function ChartsScreen({ transactions }) {
  const [typeF, setTypeF] = useState("all");   // all/income/expense/transfer
  const [dateF, setDateF] = useState("all");   // all/today/week/month/year/custom
  const [customFrom, setCustomFrom] = useState("");
  const [customTo,   setCustomTo]   = useState("");

  const applyDateFilter = useCallback((txns) => {
    const now = new Date(); const y=now.getFullYear(),m=now.getMonth(),d=now.getDate();
    if (dateF==="today")  return txns.filter(t=>t.date===todayStr());
    if (dateF==="week")   { const s=new Date(y,m,d-6); return txns.filter(t=>t.date>=getLocalISOString(s)); }
    if (dateF==="month")  return txns.filter(t=>t.date>=startOfMonth());
    if (dateF==="year")   { const s=getLocalISOString(new Date(y,0,1)); return txns.filter(t=>t.date>=s); }
    if (dateF==="custom"&&customFrom&&customTo) return txns.filter(t=>t.date>=customFrom&&t.date<=customTo);
    return txns;
  },[dateF,customFrom,customTo]);

  const trackedTxns = useMemo(
    () => {
      let base = transactions.filter(t => t.category !== "Penyesuaian Saldo");
      if (typeF!=="all") base = base.filter(t=>t.type===typeF);
      return applyDateFilter(base);
    },
    [transactions, typeF, dateF, customFrom, customTo, applyDateFilter]
  );
  const totalInc = trackedTxns.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);
  const totalExp = trackedTxns.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);
  const pieData = useMemo(()=>{
    const m={};
    trackedTxns.filter(t=>t.type==="expense").forEach(t=>{m[t.category]=(m[t.category]||0)+t.amount;});
    return Object.entries(m).sort((a,b)=>b[1]-a[1]).map(([name,value])=>({
      name,
      value,
      color:CAT_COLORS[name]||"#9ca3af",
      pct:totalExp>0?Math.round(value/totalExp*100):0
    }));
  },[trackedTxns,totalExp]);
  const barData=useMemo(()=>{const w={"Mg 1":{income:0,expense:0},"Mg 2":{income:0,expense:0},"Mg 3":{income:0,expense:0},"Mg 4":{income:0,expense:0}};const thisMonth=startOfMonth();transactions.filter(t=>t.date>=thisMonth).forEach(t=>{const d=new Date(t.date).getDate();const k=d<=7?"Mg 1":d<=14?"Mg 2":d<=21?"Mg 3":"Mg 4";w[k][t.type]+=t.amount;});return Object.entries(w).map(([name,v])=>({name,...v}));},[transactions]);
  const userJob = lsGet("dk_job","");
  const userAge = lsGet("dk_age",0);
  const userEdu = lsGet("dk_edu","");

  const salaryInsight = useMemo(() => {
    if (!trackedTxns.length) return null;
    const now = new Date();
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
    const start = getLocalISOString(d);
    const lastMonthExpenses = trackedTxns
      .filter(t => t.type === "expense" && t.date >= start)
      .reduce((s, t) => s + t.amount, 0);
    if (!lastMonthExpenses) return null;

    const livingCost = lastMonthExpenses;
    const idealSalary = Math.round(livingCost / 0.7);

    let jobLevel = "Entry level / Part-time";
    let freeJobs = "Barista, kasir ritel, customer service junior, admin entry.";
    if (idealSalary >= 3000000 && idealSalary < 6000000) {
      jobLevel = "Fresh graduate / Junior";
      freeJobs = "Admin kantor, customer service, junior designer, staf operasional.";
    } else if (idealSalary >= 6000000 && idealSalary < 10000000) {
      jobLevel = "Mid-level profesional";
      freeJobs = "Account executive, software developer, analis data, creative specialist.";
    } else if (idealSalary >= 10000000 && idealSalary < 20000000) {
      jobLevel = "Senior profesional";
      freeJobs = "Senior engineer, product designer, project manager, konsultan.";
    } else if (idealSalary >= 20000000) {
      jobLevel = "Lead / Manajer";
      freeJobs = "Engineering lead, product manager, direktur, konsultan spesialis.";
    }

    // Career path based on current job
    let careerPath = "";
    const job = userJob.toLowerCase();
    if(job.includes("pelajar")||job.includes("mahasiswa")) {
      careerPath = idealSalary < 5000000
        ? "Mulai part-time/freelance di bidang minatmu sambil kuliah. Bangun portofolio sejak dini."
        : "Selesaikan kuliah, aktif magang & freelance. Target kerja full-time di perusahaan mid–senior dalam 1–2 tahun.";
    } else if(job.includes("guru")||job.includes("dosen")) {
      careerPath = idealSalary < 8000000
        ? "Ambil sertifikasi guru/dosen untuk tunjangan lebih besar. Pertimbangkan bimbel atau kelas online."
        : "Naik ke level kepala sekolah, lektor, atau buka lembaga pendidikan sendiri.";
    } else if(job.includes("pns")||job.includes("asn")) {
      careerPath = "Kejar naik golongan/eselon. Manfaatkan tunjangan kinerja & sertifikasi jabatan fungsional.";
    } else if(job.includes("karyawan")||job.includes("swasta")) {
      careerPath = idealSalary < 10000000
        ? "Tingkatkan skill teknis & soft skill. Negosiasi kenaikan gaji tahunan atau pindah ke perusahaan lebih besar."
        : "Incaran posisi manajerial atau spesialis senior. Pertimbangkan MBA atau sertifikasi profesional.";
    } else if(job.includes("wiraswasta")||job.includes("pengusaha")) {
      careerPath = "Fokus scale bisnis: perluas pasar, rekrut tim, dan eksplorasi pendanaan investor jika perlu.";
    } else if(job.includes("freelancer")) {
      careerPath = idealSalary < 8000000
        ? "Naikkan rate per proyek, bangun personal brand, dan pertimbangkan niche khusus untuk bayaran premium."
        : "Ekspansi ke agensi kecil atau produk digital pasif income (template, kursus, SaaS).";
    } else if(job.includes("dokter")||job.includes("medis")) {
      careerPath = "Spesialisasi atau sub-spesialisasi sangat signifikan meningkatkan income. Pertimbangkan klinik mandiri.";
    } else if(job.includes("engineer")||job.includes("programmer")) {
      careerPath = idealSalary < 15000000
        ? "Dalami satu stack/domain (AI, cloud, fintech). Remote job internasional bisa 3–5x gaji lokal."
        : "Lead engineer, staff engineer, atau tech lead. Pertimbangkan startup equity atau freelance internasional.";
    } else {
      careerPath = `Dengan gaji ideal ${fmtShort(idealSalary)}/bln, cari peluang naik jabatan, sertifikasi, atau pindah ke industri dengan rata-rata gaji lebih tinggi.`;
    }

    return { livingCost, idealSalary, jobLevel, freeJobs, careerPath };
  }, [trackedTxns, userJob, userAge, userEdu]);

  const lifestyle = useMemo(() => {
    const now = new Date();
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
    const start = getLocalISOString(d);
    const last30 = trackedTxns.filter(t => t.type === "expense" && t.date >= start);
    const total = last30.reduce((s,t)=>s+t.amount,0);
    if (!total) return null;

    const byCat = {};
    for (const t of last30) byCat[t.category] = (byCat[t.category]||0) + t.amount;
    const top = Object.entries(byCat).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([cat,amt])=>({cat,amt,pct:Math.round(amt/total*100)}));
    const topCat = top[0]?.cat || "Lainnya";

    const share = (cats) => cats.reduce((s,c)=>s+(byCat[c]||0),0) / total;
    const impulsive = Math.round(share(["Belanja Online","Hiburan","Perawatan"]) * 100);
    const adulting  = Math.round(share(["Tagihan","Tempat Tinggal","Transportasi"]) * 100);
    const wellness  = Math.round(share(["Kesehatan","Pendidikan"]) * 100);

    let persona = { title:"The Minimalist", desc:"Kamu hemat dan terarah. Pengeluaranmu rapi dan fungsional.", icon:<Shield size={16} strokeWidth={1.8}/> };
    if (topCat === "Makan & Minum") persona = { title:"The Foodie", desc:"Kebahagiaanmu sering datang dari makan enak. Mantap, tapi tetap jaga limit.", icon:<Coffee size={16} strokeWidth={1.8}/> };
    else if (topCat === "Belanja Online") persona = { title:"The Online Hunter", desc:"Cepat, praktis, dan sering checkout. Kamu jago cari barang, tapi rawan impulsif.", icon:<ShoppingBag size={16} strokeWidth={1.8}/> };
    else if (topCat === "Transportasi") persona = { title:"The Road Runner", desc:"Mobilitas tinggi. Kamu punya ritme jalan-jalan yang konsisten.", icon:<Car size={16} strokeWidth={1.8}/> };
    else if (topCat === "Hiburan") persona = { title:"The Entertainer", desc:"Kamu tahu cara recharge. Pastikan hiburan tetap jadi hadiah, bukan kebiasaan mahal.", icon:<Monitor size={16} strokeWidth={1.8}/> };
    else if (topCat === "Tagihan") persona = { title:"The Adulting Pro", desc:"Tagihan aman, hidup stabil. Kamu serius dan bertanggung jawab.", icon:<Zap size={16} strokeWidth={1.8}/> };
    else if (topCat === "Kesehatan") persona = { title:"The Wellness Keeper", desc:"Kamu investasi ke kesehatan. Good choice.", icon:<Heart size={16} strokeWidth={1.8}/> };

    const funFacts = impulsive >= 45 ? [
      `🛒 ${impulsive}% pengeluaranmu impulsif! Otak sering salah bedain "butuh" vs "mau". Skip 1 checkout per hari bisa hemat Rp${fmtShort(Math.round((top[0]?.amt||150000)/30))} per hari.`,
      `💸 ${impulsive}% ke kategori impulsif — kalau dihemat 50%, dalam setahun bisa kumpul Rp${fmtShort(Math.round(total*0.5*12||0))}. Lumayan buat liburan!`,
      `🧠 Riset bilang 90% keputusan belanja online terjadi dalam 3 detik pertama. Coba tunggu 24 jam sebelum bayar, biasanya keinginan hilang sendiri!`,
    ] : adulting >= 45 ? [
      `🏠 ${adulting}% uangmu masuk pos wajib — kamu tipe "aman dulu". Orang kayak kamu biasanya lebih mudah dapat KPR atau pinjaman bank!`,
      `💡 Hemat 10% dari total tagihan rutin: Rp${fmtShort(Math.round(top[0]?.amt*0.1||0))}. Setahun kumpul Rp${fmtShort(Math.round(top[0]?.amt*0.1*12||0))}. Bisa buat DP motor!`,
      `📊 Pola keuangan stabil seperti kamu itu langka. 70% orang kesulitan konsisten catat keuangan lebih dari 1 bulan. Kamu sudah berhasil!`,
    ] : [
      `⚖️ Pola keuanganmu cukup seimbang! Top pengeluaran: ${top[0]?.cat||"Lainnya"} (${top[0]?.pct||0}%), ${top[1]?.cat||"-"} (${top[1]?.pct||0}%). Sudah tahu ke mana uang pergi!`,
      `🎯 Kamu sudah catat ${trackedTxns.length} transaksi. Orang yang rajin catat keuangan rata-rata bisa hemat 15-20% lebih banyak per bulan!`,
      `🌟 ${totalExp>0&&totalInc>0?(totalExp/totalInc<0.8?"Selamat! Pengeluaranmu di bawah 80% pemasukan — kamu sudah financial healthy! 🎉":"Target 80%: pengeluaranmu "+Math.round(totalExp/totalInc*100)+"% dari pemasukan. Tinggal sedikit lagi!"):"Catat lebih banyak data biar insight makin akurat. Makin banyak data, makin tajam analisisnya!"}`,
    ];
    const funFact = funFacts[Math.floor(Date.now()/86400000) % funFacts.length];

    const missions = impulsive >= 45 ? [
      {title:"🚫 No-Checkout 7 Hari",desc:"Boleh masukin ke wishlist, tapi jangan klik bayar. Kalau 7 hari nanti masih mau, baru boleh beli. Tujuan: buktiin ke diri sendiri bahwa kamu bisa kontrol impuls belanja.",badge:"Penguasa Keinginan 🏆"},
      {title:"📱 Detoks App Belanja",desc:"Hapus atau sembunyikan notifikasi dari 1 aplikasi belanja online selama 7 hari. Catat berapa kali tergoda tapi berhasil tahan. Ini latihan mental, bukan siksaan!",badge:"Digital Detox Hero 🦸"},
    ] : adulting >= 45 ? [
      {title:"💧 Buru Satu Kebocoran",desc:"Pilih 1 tagihan rutin (listrik, internet, dll) dan cari cara hemat minimal 10% bulan ini. Cabut colokan tidak terpakai, atau negosiasi ulang paket langgananmu.",badge:"Bill Buster 💪"},
      {title:"🪣 Sisihkan Hari Ini",desc:"Hari ini juga, pindahkan 5–10% dari uang masuk terakhir ke pos tabungan. Kalau bisa, atur transfer otomatis agar bulan depan sudah jalan sendiri.",badge:"Autopilot Saver 🤖"},
    ] : [
      {title:"🔬 Audit Pengeluaran Kecil",desc:"7 hari ke depan, catat SEMUA pengeluaran di bawah Rp20.000 — kopi, parkir, jajan, apapun. Di akhir minggu hitung totalnya. Hasilnya sering mengejutkan!",badge:"Micro-Tracker 🔍"},
      {title:"🎯 Challenge 50-30-20",desc:"Coba aturan 50-30-20 minggu ini: 50% kebutuhan pokok, 30% keinginan, 20% tabungan. Catat di DompetKu dan lihat di mana kamu over-budget.",badge:"Balance Master ⚖️"},
    ];
    const mission = missions[Math.floor(Date.now()/86400000/7) % missions.length];

    return { total, top, impulsive, adulting, wellness, persona, funFact, mission };
  }, [trackedTxns]);
  return (
    <div style={{padding:"0 16px 16px"}}>
      {/* Type Filter */}
      <div style={{display:"flex",gap:6,overflowX:"auto",scrollbarWidth:"none",marginBottom:8,paddingBottom:2}}>
        {[{id:"all",l:"Semua"},{id:"expense",l:"Pengeluaran"},{id:"income",l:"Pemasukan"},{id:"transfer",l:"Transfer"}].map(f=>(
          <button type="button" key={f.id} onClick={()=>setTypeF(f.id)}
            style={{padding:"6px 14px",borderRadius:99,border:"none",cursor:"pointer",whiteSpace:"nowrap",fontSize:12,fontWeight:700,flexShrink:0,
              background:typeF===f.id?G:"#f1f5f9",color:typeF===f.id?"#fff":"#6b7280",transition:"background .15s"}}>{f.l}
          </button>
        ))}
      </div>
      {/* Date Filter */}
      <div style={{display:"flex",gap:6,overflowX:"auto",scrollbarWidth:"none",marginBottom:12,paddingBottom:2}}>
        {[{id:"all",l:"Semua"},{id:"today",l:"Hari Ini"},{id:"week",l:"Minggu Ini"},{id:"month",l:"Bulan Ini"},{id:"year",l:"Tahun Ini"},{id:"custom",l:"Custom"}].map(f=>(
          <button type="button" key={f.id} onClick={()=>setDateF(f.id)}
            style={{padding:"6px 14px",borderRadius:99,border:"none",cursor:"pointer",whiteSpace:"nowrap",fontSize:12,fontWeight:700,flexShrink:0,
              background:dateF===f.id?"#3b82f6":"#f1f5f9",color:dateF===f.id?"#fff":"#6b7280",transition:"background .15s"}}>{f.l}
          </button>
        ))}
      </div>
      {dateF==="custom"&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
          <div><p style={{margin:"0 0 4px",fontSize:10,fontWeight:700,color:"#9ca3af"}}>DARI</p>
            <input type="date" value={customFrom} onChange={e=>setCustomFrom(e.target.value)}
              style={{width:"100%",background:"#f8fafc",border:"1.5px solid #e5e7eb",borderRadius:10,padding:"8px 10px",fontSize:13,outline:"none",boxSizing:"border-box"}}/>
          </div>
          <div><p style={{margin:"0 0 4px",fontSize:10,fontWeight:700,color:"#9ca3af"}}>SAMPAI</p>
            <input type="date" value={customTo} onChange={e=>setCustomTo(e.target.value)}
              style={{width:"100%",background:"#f8fafc",border:"1.5px solid #e5e7eb",borderRadius:10,padding:"8px 10px",fontSize:13,outline:"none",boxSizing:"border-box"}}/>
          </div>
        </div>
      )}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
        {[{l:"Pemasukan",v:totalInc,I:<TrendingUp size={17} strokeWidth={1.7}/>,bg:"#e8faf0",col:G},{l:"Pengeluaran",v:totalExp,I:<BarChart2 size={17} strokeWidth={1.7}/>,bg:"#fef2f2",col:"#ef4444"}].map(x=>(
          <Card key={x.l} style={{marginBottom:0}}>
            <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:8}}><div style={{width:30,height:30,borderRadius:9,background:x.bg,display:"flex",alignItems:"center",justifyContent:"center",color:x.col}}>{x.I}</div><span style={{fontSize:12,color:"#6b7280"}}>{x.l}</span></div>
            <p style={{margin:0,fontSize:16,fontWeight:800,color:"#111"}}>{fmtShort(x.v)}</p>
          </Card>
        ))}
      </div>
      <PieCatCard pieData={pieData} totalExp={totalExp}/>
      <Card>
        <p style={{margin:"0 0 12px",fontSize:14,fontWeight:800,color:"#111"}}>Ringkasan Mingguan</p>
        <div style={{WebkitUserSelect:"none",userSelect:"none"}}>
          <ResponsiveContainer width="100%" height={155}>
            <BarChart data={barData} barGap={3} style={{outline:"none"}}>
              <XAxis dataKey="name" tick={{fill:"#9ca3af",fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:"#9ca3af",fontSize:9}} axisLine={false} tickLine={false} width={30} tickFormatter={fmtShort}/>
              <Tooltip formatter={v=>[fmt(v),""]} contentStyle={{background:"#fff",border:"1px solid #f1f5f9",borderRadius:12,fontSize:12}} cursor={{fill:"rgba(0,0,0,0.03)"}}/>
              <Bar dataKey="income" fill={G} radius={[5,5,0,0]} name="Masuk" style={{outline:"none"}}/>
              <Bar dataKey="expense" fill="#fca5a5" radius={[5,5,0,0]} name="Keluar"/>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{display:"flex",gap:14,justifyContent:"center",marginTop:6}}>
          {[{col:G,l:"Pemasukan"},{col:"#fca5a5",l:"Pengeluaran"}].map(x=><div key={x.l} style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:10,height:10,borderRadius:3,background:x.col}}/><span style={{fontSize:11,color:"#6b7280"}}>{x.l}</span></div>)}
        </div>
      </Card>
      {lifestyle && (
        <Card>
          <Row style={{marginBottom:10}}>
            <p style={{margin:0,fontSize:14,fontWeight:800,color:"#111"}}>Analisis Gaya Hidup</p>
            <div style={{display:"flex",alignItems:"center",gap:6,background:GL,borderRadius:999,padding:"6px 10px",color:G}}>
              {lifestyle.persona.icon}
              <span style={{fontSize:11,fontWeight:800}}>{lifestyle.persona.title}</span>
            </div>
          </Row>
          <p style={{margin:"0 0 10px",fontSize:12,color:"#6b7280",lineHeight:1.5}}>{lifestyle.persona.desc}</p>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:10}}>
            {[{l:"Impulsif",v:lifestyle.impulsive,col:"#ef4444"},{l:"Adulting",v:lifestyle.adulting,col:G},{l:"Wellness",v:lifestyle.wellness,col:"#0ea5e9"}].map(x=>(
              <div key={x.l} style={{background:"#f8fafc",border:"1px solid #eef2f7",borderRadius:14,padding:"10px"}}>
                <p style={{margin:"0 0 6px",fontSize:10,fontWeight:800,color:"#6b7280"}}>{x.l.toUpperCase()}</p>
                <p style={{margin:0,fontSize:16,fontWeight:900,color:"#111"}}>{x.v}<span style={{fontSize:11,fontWeight:800,color:"#9ca3af"}}>%</span></p>
                <div style={{height:6,borderRadius:99,background:"#e5e7eb",marginTop:8,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${Math.min(100,Math.max(0,x.v))}%`,background:x.col,borderRadius:99}}/>
                </div>
              </div>
            ))}
          </div>

          <div style={{background:"#fff",border:"1px solid #eef2f7",borderRadius:16,padding:"10px 12px",marginBottom:10}}>
            <p style={{margin:"0 0 6px",fontSize:10,fontWeight:800,color:"#9ca3af",letterSpacing:.6}}>TOP 3 PENGELUARAN (30 HARI)</p>
            {lifestyle.top.map((t,idx)=>(
              <div key={t.cat} style={{display:"flex",alignItems:"center",gap:10,padding:idx<lifestyle.top.length-1?"8px 0":"6px 0",borderBottom:idx<lifestyle.top.length-1?"1px solid #f1f5f9":"none"}}>
                <div style={{width:34,height:34,borderRadius:10,background:CAT_BG[t.cat]||"#f3f4f6",display:"flex",alignItems:"center",justifyContent:"center",color:CAT_COLORS[t.cat]||"#9ca3af",flexShrink:0}}>
                  {CAT_ICON(t.cat,16)}
                </div>
                <div style={{flex:1}}>
                  <p style={{margin:0,fontSize:12,fontWeight:800,color:"#111"}}>{t.cat}</p>
                  <p style={{margin:"2px 0 0",fontSize:10,color:"#9ca3af"}}>{t.pct}%</p>
                </div>
                <p style={{margin:0,fontSize:12,fontWeight:800,color:"#111"}}>{fmtShort(t.amt)}</p>
              </div>
            ))}
          </div>

          <div style={{background:GL,borderRadius:16,padding:"12px 14px",marginBottom:8}}>
            <p style={{margin:0,fontSize:10,fontWeight:900,color:G,letterSpacing:.6}}>💡 FUN FACT HARI INI</p>
            <p style={{margin:"6px 0 0",fontSize:12,color:"#111",lineHeight:1.6}}>{lifestyle.funFact}</p>
          </div>
          <div style={{background:"#111827",borderRadius:16,padding:"12px 14px",color:"#fff"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <p style={{margin:0,fontSize:10,fontWeight:900,letterSpacing:.6,opacity:.85}}>🎯 MISI MINGGU INI</p>
              <span style={{background:"rgba(45,171,127,0.25)",color:"#86efac",fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:99}}>{lifestyle.mission.badge}</span>
            </div>
            <p style={{margin:"0 0 4px",fontSize:13,fontWeight:800,color:"#fff"}}>{lifestyle.mission.title}</p>
            <p style={{margin:0,fontSize:11,lineHeight:1.6,opacity:.85,color:"rgba(255,255,255,0.85)"}}>{lifestyle.mission.desc}</p>
          </div>
        </Card>
      )}

      {salaryInsight && (
        <Card>
          <Row style={{marginBottom:10}}>
            <p style={{margin:0,fontSize:14,fontWeight:800,color:"#111"}}>Estimasi Gaji Ideal</p>
            <div style={{display:"flex",alignItems:"center",gap:6,background:"#f8fafc",border:"1px solid #eef2f7",borderRadius:999,padding:"6px 10px",color:"#111"}}>
              <Briefcase size={16} strokeWidth={1.8}/>
              <span style={{fontSize:11,fontWeight:800}}>{salaryInsight.jobLevel}</span>
            </div>
          </Row>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
            <div style={{background:GL,borderRadius:14,padding:"10px 12px"}}>
              <p style={{margin:0,fontSize:10,fontWeight:800,color:G,letterSpacing:.6}}>BIAYA HIDUP (30 HARI)</p>
              <p style={{margin:"4px 0 0",fontSize:16,fontWeight:900,color:"#111"}}>{fmtShort(salaryInsight.livingCost)}</p>
            </div>
            <div style={{background:"#f8fafc",border:"1px solid #eef2f7",borderRadius:14,padding:"10px 12px"}}>
              <p style={{margin:0,fontSize:10,fontWeight:800,color:"#6b7280",letterSpacing:.6}}>GAJI IDEAL MIN.</p>
              <p style={{margin:"4px 0 0",fontSize:16,fontWeight:900,color:"#111"}}>{fmtShort(salaryInsight.idealSalary)}</p>
            </div>
          </div>
          {salaryInsight.careerPath&&(
            <div style={{background:GL,borderRadius:14,padding:"10px 12px",marginBottom:10,border:`1px solid ${GM}`}}>
              <p style={{margin:"0 0 4px",fontSize:10,fontWeight:800,color:G,letterSpacing:.6}}>JENJANG KARIR — {(lsGet("dk_job","")||"PEKERJAAN KAMU").toUpperCase()}</p>
              <p style={{margin:0,fontSize:12,color:"#374151",lineHeight:1.6}}>{salaryInsight.careerPath}</p>
            </div>
          )}
          <div style={{background:"#f8fafc",borderRadius:14,padding:"10px 12px"}}>
            <p style={{margin:"0 0 4px",fontSize:10,fontWeight:800,color:"#6b7280",letterSpacing:.6}}>REKOMENDASI KARIR BEBAS</p>
            <p style={{margin:0,fontSize:12,color:"#374151",lineHeight:1.6}}>{salaryInsight.freeJobs}</p>
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── PROFILE SCREEN ───────────────────────────────────────────────────────────

// ─── EASTER EGG MINIGAME ──────────────────────────────────────────────────────
const QUIZ = [
  {q:"12 × 8",a:96},{q:"144 ÷ 12",a:12},{q:"17 + 28",a:45},{q:"100 − 37",a:63},
  {q:"9 × 7",a:63},{q:"256 ÷ 8",a:32},{q:"45 + 56",a:101},{q:"200 − 87",a:113},
  {q:"13 × 11",a:143},{q:"81 ÷ 9",a:9}
];
function MiniGame({ onClose }) {
  const [qi, setQi] = useState(Math.floor(Math.random()*QUIZ.length));
  const [inp, setInp] = useState("");
  const [result, setResult] = useState(null); // null/correct/wrong
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const q = QUIZ[qi];

  const submit = () => {
    if (!inp) return;
    const correct = parseInt(inp)===q.a;
    setResult(correct?"correct":"wrong");
    if (correct) setScore(s=>s+1);
    setTimeout(()=>{
      if (round>=3) { setResult("done"); return; }
      setQi(Math.floor(Math.random()*QUIZ.length));
      setInp(""); setResult(null); setRound(r=>r+1);
    },1200);
  };

  useEffect(()=>{
    const handler=e=>{ if(e.key==="Escape"||e.key==="Back") onClose(); };
    window.addEventListener("keydown",handler);
    // Override back button
    const pop = ()=>onClose();
    window.history.pushState({game:true},"");
    window.addEventListener("popstate",pop);
    return ()=>{ window.removeEventListener("keydown",handler); window.removeEventListener("popstate",pop); };
  },[]);

  return (
    <div style={{position:"fixed",inset:0,background:`linear-gradient(160deg,${G},${G2})`,zIndex:500,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24}}>
      <button type="button" onClick={onClose} style={{position:"absolute",top:20,left:20,background:"rgba(255,255,255,0.2)",border:"none",borderRadius:99,width:40,height:40,color:"#fff",fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>←</button>

      {result==="done" ? (
        <div style={{textAlign:"center",color:"#fff"}}>
          <div style={{fontSize:64,marginBottom:16}}>{score===3?"🏆":score===2?"🥈":"🎉"}</div>
          <p style={{fontSize:28,fontWeight:900,margin:"0 0 8px"}}>{score===3?"SEMPURNA!":score===2?"Bagus!":"Lumayan!"}</p>
          <p style={{fontSize:16,opacity:.85,margin:"0 0 24px"}}>Skor: {score}/3</p>
          <p style={{fontSize:13,opacity:.7,margin:"0 0 32px"}}>
            {score===3?"Kamu jenius! Kalkulator manusia 🧮":"Terus latihan, otak makin kencang!"}
          </p>
          <button type="button" onClick={()=>{setRound(1);setScore(0);setResult(null);setInp("");setQi(Math.floor(Math.random()*QUIZ.length));}}
            style={{background:"rgba(255,255,255,0.2)",border:"2px solid rgba(255,255,255,0.4)",borderRadius:99,padding:"12px 32px",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",marginRight:12}}>Main Lagi</button>
          <button type="button" onClick={onClose}
            style={{background:"#fff",border:"none",borderRadius:99,padding:"12px 32px",color:G,fontSize:15,fontWeight:700,cursor:"pointer"}}>Selesai</button>
        </div>
      ) : (
        <>
          <div style={{display:"flex",gap:6,marginBottom:32}}>
            {[1,2,3].map(n=><div key={n} style={{width:12,height:12,borderRadius:99,background:n<=round?"rgba(255,255,255,0.9)":"rgba(255,255,255,0.3)"}}/>)}
          </div>
          <p style={{color:"rgba(255,255,255,0.7)",fontSize:13,margin:"0 0 8px",fontWeight:700}}>Soal {round} dari 3</p>
          <p style={{color:"#fff",fontSize:48,fontWeight:900,margin:"0 0 32px",textShadow:"0 2px 16px rgba(0,0,0,0.2)"}}>{q.q} = ?</p>

          {result&&(
            <div style={{fontSize:18,fontWeight:800,color:result==="correct"?"#a7f3d0":"#fca5a5",marginBottom:16,animation:"fadeUp .3s ease"}}>
              {result==="correct"?"✓ Benar! +1 poin":"✗ Salah! Jawaban: "+q.a}
            </div>
          )}

          <div style={{background:"rgba(255,255,255,0.15)",borderRadius:20,padding:"16px 24px",marginBottom:20,minWidth:180,textAlign:"center"}}>
            <p style={{color:"#fff",fontSize:36,fontWeight:900,margin:0,letterSpacing:4,minHeight:40}}>{inp||"_"}</p>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:10}}>
            {[1,2,3,4,5,6,7,8,9].map(n=>(
              <button key={n} type="button" onClick={()=>setInp(p=>p+n)}
                style={{width:64,height:64,borderRadius:"50%",background:"rgba(255,255,255,0.2)",border:"2px solid rgba(255,255,255,0.3)",color:"#fff",fontSize:22,fontWeight:700,cursor:"pointer"}}>
                {n}
              </button>
            ))}
            <button type="button" onClick={()=>setInp(p=>p.slice(0,-1))}
              style={{width:64,height:64,borderRadius:"50%",background:"rgba(255,255,255,0.15)",border:"2px solid rgba(255,255,255,0.2)",color:"#fff",fontSize:18,cursor:"pointer"}}>⌫</button>
            <button type="button" onClick={()=>setInp(p=>p+"0")}
              style={{width:64,height:64,borderRadius:"50%",background:"rgba(255,255,255,0.2)",border:"2px solid rgba(255,255,255,0.3)",color:"#fff",fontSize:22,fontWeight:700,cursor:"pointer"}}>0</button>
            <button type="button" onClick={submit}
              style={{width:64,height:64,borderRadius:"50%",background:"#fff",border:"none",color:G,fontSize:22,fontWeight:900,cursor:"pointer"}}>✓</button>
          </div>
        </>
      )}
    </div>
  );
}

function ProfileScreen({ userName, setUserName, userAvatar, setUserAvatar, transactions, accounts, pinEnabled, pinHash, setPinEnabled, setPinHash, bioEnabled, setBioEnabled, soundEnabled, setSoundEnabled, setTransactions, setAccounts, setShowImport, registerLocalModal, unregisterLocalModal }) {
  const { lang, setLang, t } = useLang();
  const [userAge, setUserAge] = useState(()=>lsGet("dk_age",0));
  const [userJob, setUserJob] = useState(()=>lsGet("dk_job",""));
  const [userEdu, setUserEdu] = useState(()=>lsGet("dk_edu",""));
  const [tapCount, setTapCount] = useState(0);
  const [showGame, setShowGame] = useState(false);
  const tapRef = useRef(0);
  const [editProfile, setEditProfile] = useState(false);
  const [showSetPin,  setShowSetPin]  = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const openSetPin  = () => { setShowSetPin(true);  registerLocalModal?.(()=>setShowSetPin(false)); };
  const closeSetPin = () => { setShowSetPin(false); unregisterLocalModal?.(); };
  const openConfirm  = () => { setShowConfirm(true);  registerLocalModal?.(()=>setShowConfirm(false)); };
  const closeConfirm = () => { setShowConfirm(false); unregisterLocalModal?.(); };
  const [editName,    setEditName]    = useState(false);
  const [nameInput,   setNameInput]   = useState(userName);
  const avatarRef = useRef();
  
  const handleAvatar = e => { const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>setUserAvatar(r.result);r.readAsDataURL(f); };
  const exportCSV = () => {
    const rows=[["Tanggal","Jam","Jenis","Jumlah","Kategori","Catatan","Akun"],...transactions.map(t=>[t.date,t.time||"",t.type==="income"?"Pemasukan":"Pengeluaran",t.amount,t.category,t.note,accounts.find(a=>String(a.id)===String(t.accountId))?.name||""])];
    const csv=rows.map(r=>r.map(c=>JSON.stringify(String(c))).join(",")).join("\n");
    const a=document.createElement("a");a.href="data:text/csv;charset=utf-8,"+encodeURIComponent(csv);a.download="DompetKu_export.csv";a.click();
  };

  const toggleBiometrics = async () => {
    if (bioEnabled) { setBioEnabled(false); } 
    else { const success = await enableBiometrics(); if (success) setBioEnabled(true); }
  };
  
  return (
    <div style={{padding:"0 16px 16px"}}>
      <Card style={{textAlign:"center",padding:"24px 16px"}}>
        <div style={{position:"relative",width:72,height:72,margin:"0 auto 12px"}}>
          {userAvatar?<img src={userAvatar} alt="" style={{width:72,height:72,borderRadius:22,objectFit:"cover"}}/>:<div style={{width:72,height:72,borderRadius:22,background:`linear-gradient(135deg,${G},${G2})`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff"}}><UserCircle size={36} strokeWidth={1.2}/></div>}
          <button type="button" onClick={()=>avatarRef.current.click()} style={{position:"absolute",bottom:-4,right:-4,width:26,height:26,borderRadius:8,background:G,border:"2px solid #fff",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff"}}><Camera size={12}/></button>
          <input ref={avatarRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleAvatar}/>
        </div>
        {editName?<div style={{display:"flex",gap:8,justifyContent:"center",alignItems:"center"}}><input value={nameInput} onChange={e=>setNameInput(e.target.value)} style={{border:`1.5px solid ${G}`,borderRadius:10,padding:"6px 12px",fontSize:14,fontWeight:700,outline:"none",textAlign:"center"}}/><button type="button" onClick={()=>{if(!nameInput.trim())return; setUserName(nameInput.trim());setEditName(false);}} style={{background:G,border:"none",borderRadius:9,width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff"}}><Check size={14}/></button></div>:<div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:8}}><p style={{margin:0,fontSize:16,fontWeight:800,color:"#111"}}>{userName}</p><button type="button" onClick={()=>setEditName(true)} style={{background:"none",border:"none",color:"#9ca3af",cursor:"pointer"}}><Pencil size={14}/></button></div>}
        <p style={{margin:"4px 0 0",fontSize:12,color:"#9ca3af"}}>{transactions.length} transaksi · {accounts.length} akun</p>
      </Card>
      
      <Card style={{padding:"4px 0",marginBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 16px 4px"}}>
          <p style={{margin:0,fontSize:10,fontWeight:700,color:"#9ca3af",letterSpacing:1}}>PROFIL SAYA</p>
          <button type="button" onClick={()=>setEditProfile(p=>!p)} style={{background:GL,border:"none",borderRadius:8,padding:"4px 10px",color:G,fontSize:11,fontWeight:700,cursor:"pointer"}}>{editProfile?"Simpan":"Edit"}</button>
        </div>
        {editProfile?(
          <div style={{padding:"8px 16px 14px",display:"flex",flexDirection:"column",gap:8}}>
            <div><p style={{margin:"0 0 3px",fontSize:10,color:"#9ca3af",fontWeight:700}}>UMUR</p><input type="number" min="10" max="100" value={userAge||""} onChange={e=>{const v=parseInt(e.target.value)||0;setUserAge(v);lsSet("dk_age",v);}} style={{border:"1px solid #e5e7eb",borderRadius:10,padding:"8px 12px",fontSize:14,fontWeight:600,color:"#111",width:"100%",outline:"none",boxSizing:"border-box"}}/></div>
            <div><p style={{margin:"0 0 3px",fontSize:10,color:"#9ca3af",fontWeight:700}}>PEKERJAAN</p><select value={userJob} onChange={e=>{setUserJob(e.target.value);lsSet("dk_job",e.target.value);}} style={{border:"1px solid #e5e7eb",borderRadius:10,padding:"8px 12px",fontSize:14,fontWeight:600,color:"#111",width:"100%",outline:"none",boxSizing:"border-box",WebkitAppearance:"none"}}><option value="">Pilih pekerjaan...</option>{JOBS.map(j=><option key={j} value={j}>{j}</option>)}</select></div>
            <div><p style={{margin:"0 0 3px",fontSize:10,color:"#9ca3af",fontWeight:700}}>PENDIDIKAN TERAKHIR</p><select value={userEdu} onChange={e=>{setUserEdu(e.target.value);lsSet("dk_edu",e.target.value);}} style={{border:"1px solid #e5e7eb",borderRadius:10,padding:"8px 12px",fontSize:14,fontWeight:600,color:"#111",width:"100%",outline:"none",boxSizing:"border-box",WebkitAppearance:"none"}}><option value="">Pilih pendidikan...</option>{EDUS.map(e=><option key={e} value={e}>{e}</option>)}</select></div>
          </div>
        ):(
          <div style={{padding:"8px 16px 14px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {[{l:"Umur",v:userAge?`${userAge} tahun`:"Belum diisi"},{l:"Pekerjaan",v:userJob||"Belum diisi"},{l:"Pendidikan",v:userEdu||"Belum diisi"}].map(x=>(
              <div key={x.l} style={{background:"#f8fafc",borderRadius:10,padding:"10px 12px"}}>
                <p style={{margin:"0 0 2px",fontSize:9,fontWeight:700,color:"#9ca3af",letterSpacing:.5}}>{x.l.toUpperCase()}</p>
                <p style={{margin:0,fontSize:12,fontWeight:600,color:x.v==="Belum diisi"?"#d1d5db":"#111"}}>{x.v}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
      <Card style={{padding:"4px 0",marginBottom:12}}>
        <p style={{padding:"10px 16px 4px",margin:0,fontSize:10,fontWeight:700,color:"#9ca3af",letterSpacing:1}}>{t("Keamanan").toUpperCase()}</p>
        <SRow icon={<Lock size={15} strokeWidth={1.7}/>} title="Kunci PIN" sub={pinEnabled?"Aktif — app terkunci saat keluar background":"Nonaktif"} 
          right={<Tog on={pinEnabled} onToggle={()=>{ if(pinEnabled){setPinEnabled(false);setBioEnabled(false);}else{openSetPin();} }}/>}/>
        {pinEnabled&&<SRow icon={<Fingerprint size={15} strokeWidth={1.7}/>} title="Biometrik" sub="Gunakan sidik jari / wajah" right={<Tog on={bioEnabled} onToggle={toggleBiometrics}/> }/>}
        {pinEnabled&&<SRow icon={<Shield size={15} strokeWidth={1.7}/>} title="Ganti PIN" right={<button type="button" onClick={openSetPin} style={{background:GL,border:"none",borderRadius:9,padding:"6px 12px",color:G,fontSize:12,fontWeight:600,cursor:"pointer"}}>Ubah</button>}/>}
      </Card>
      
      <Card style={{padding:"4px 0",marginBottom:12}}>
        <p style={{padding:"10px 16px 4px",margin:0,fontSize:10,fontWeight:700,color:"#9ca3af",letterSpacing:1}}>{t("Preferensi").toUpperCase()}</p>
        <SRow icon={soundEnabled?<Volume2 size={15}/>:<VolumeX size={15}/>} title="Efek Suara" sub="Suara saat mencatat transaksi" right={<Tog on={soundEnabled} onToggle={()=>setSoundEnabled(p=>!p)}/>}/>
        <SRow icon={<BookOpen size={15}/>} title={t("Bahasa / Language")} sub={lang==="id"?"🇮🇩 Indonesia":"🇺🇸 English"} right={<button type="button" onClick={()=>setLang(lang==="id"?"en":"id")} style={{background:GL,border:"none",borderRadius:9,padding:"6px 12px",color:G,fontSize:12,fontWeight:700,cursor:"pointer"}}>{lang==="id"?"Switch to EN":"Ganti ke ID"}</button>}/>
      </Card>
      
      <Card style={{padding:"4px 0",marginBottom:12}}>
        <p style={{padding:"10px 16px 4px",margin:0,fontSize:10,fontWeight:700,color:"#9ca3af",letterSpacing:1}}>{t("Data").toUpperCase()}</p>
        <SRow icon={<Upload size={15}/>} title="Import Data" sub="Excel dari Money Manager" right={<button type="button" onClick={()=>setShowImport(true)} style={{background:GL,border:"none",borderRadius:9,padding:"6px 12px",color:G,fontSize:12,fontWeight:600,cursor:"pointer"}}>Import</button>}/>
        <SRow icon={<Download size={15}/>} title="Export CSV" sub={`${transactions.length} transaksi`} right={<button type="button" onClick={exportCSV} style={{background:GL,border:"none",borderRadius:9,padding:"6px 12px",color:G,fontSize:12,fontWeight:600,cursor:"pointer"}}>Export</button>}/>
        <SRow icon={<Trash2 size={15}/>} bg="#fef2f2" title="Hapus Semua Data" danger right={<button type="button" onClick={openConfirm} style={{background:"#fef2f2",border:"none",borderRadius:9,padding:"6px 12px",color:"#ef4444",fontSize:12,fontWeight:600,cursor:"pointer"}}>Hapus</button>}/>
      </Card>
      
      <Card style={{padding:"4px 0"}}>
        <p style={{padding:"10px 16px 4px",margin:0,fontSize:10,fontWeight:700,color:"#9ca3af",letterSpacing:1}}>{t("Tentang").toUpperCase()}</p>
        <div onClick={()=>{ const n=tapRef.current+1; tapRef.current=n; setTapCount(n); if(n>=10){setShowGame(true);tapRef.current=0;setTapCount(0);} }}>
          <SRow icon={<Star size={15}/>} title="DompetKu" sub={`Versi 11.0 — Full Revision${tapCount>0&&tapCount<10?" ("+tapCount+"/10)":""}`}/>
        </div>
      </Card>
      
      {showSetPin&&<PinScreen mode="set" savedHash={pinHash} onSetPin={h=>{setPinHash(h);setPinEnabled(true);closeSetPin();}} onCancel={closeSetPin}/>}
      {showConfirm&&<ConfirmDialog title="Hapus Semua Data?" sub="Semua transaksi, akun, dan pengaturan akan dihapus. Tidak bisa dibatalkan." onConfirm={()=>{setTransactions([]);setAccounts([]);closeConfirm();}} onCancel={closeConfirm}/>}
      {showGame&&<MiniGame onClose={()=>setShowGame(false)}/>}
    </div>
  );
}


// ─── ACCOUNT MODAL OVERLAY (for direct edit from AccountDetailScreen) ─────────
function AccountModalOverlay({ initial, idx, accounts, transactions, setAccounts, setTransactions, onClose }) {
  const handleSaveAcc = (updated, adjustment) => {
    setAccounts(p=>p.map(a=>a.id===updated.id ? {...a,...updated,balance:adjustment!=null?(a.balance+adjustment):a.balance} : a));
    if (adjustment!=null && adjustment!==0) {
      const adjTxn = { id:generateId(), type:adjustment>0?"income":"expense", amount:Math.abs(adjustment), category:"Penyesuaian Saldo", note:`Penyesuaian saldo — ${updated.name}`, date:todayStr(), time:nowTime(), accountId:updated.id, detected:null, attachmentMeta:[] };
      setTransactions(p=>[adjTxn,...p]);
    }
    onClose();
  };
  return <AccountModal initial={initial} onClose={onClose} isNew={false} onSave={handleSaveAcc}/>;
}

// ─── FAN NAV (MERGED: Symmetric Grid + Staggered Arch Animations) ──────────────
const ARCH_ITEMS = [
  { id:"transactions", dx:-112, dy:-112, kind:"nav", col:"#3b82f6", label:"Transaksi", delay:35  },
  { id:"accounts",     dx:0,    dy:-180, kind:"nav", col:G,         label:"Akun",      delay:70  },
  { id:"quickAdd",     dx:0,    dy:-96,  kind:"add", col:G,         label:"Catat",     delay:0   },
  { id:"charts",       dx:112,  dy:-112, kind:"nav", col:"#8b5cf6", label:"Analisis",  delay:105 },
];

function FanNav({ tab, setTab, onOpenQuickAdd, darkMode }) {
  const [open, setOpen] = useState(false);
  const navTo = id => { setTab(id); setOpen(false); };
  const handleArchItem = item => {
    if (item.kind === "add") { onOpenQuickAdd?.(); setOpen(false); return; }
    navTo(item.id);
  };

  const NAV_BOT = "max(calc(env(safe-area-inset-bottom,0px) + 24px),30px)";

  return (
    <>
      <style>{`
        @keyframes fabPulse{0%{box-shadow:0 0 0 0 rgba(45,171,127,.5)}70%{box-shadow:0 0 0 12px rgba(45,171,127,0)}100%{box-shadow:0 0 0 0 rgba(45,171,127,0)}}
      `}</style>

      {/* Backdrop */}
      {open&&<div onClick={()=>setOpen(false)} style={{position:"fixed",inset:0,zIndex:53,background:"rgba(255,255,255,0.7)",backdropFilter:"blur(3px)",transition:"opacity .2s"}}/>}

      {/* Arch items (Animated with Staggered Delays & Labels) */}
      {ARCH_ITEMS.map(item=>{
        const closeDelay = (ARCH_ITEMS.length - 1 - ARCH_ITEMS.indexOf(item)) * 35;
        return (
          <div key={item.id} style={{
            position:"fixed", bottom:NAV_BOT, left:"50%",
            transform: open ? `translate(calc(-50% + ${item.dx}px), ${item.dy}px)` : "translate(-50%, 0px)",
            opacity: open ? 1 : 0,
            pointerEvents: open ? "auto" : "none",
            zIndex: 56,
            transition: open
              ? `transform 0.38s cubic-bezier(0.34,1.56,0.64,1) ${item.delay}ms, opacity 0.22s ease ${item.delay}ms`
              : `transform 0.25s cubic-bezier(0.4,0,0.6,1) ${closeDelay}ms, opacity 0.18s ease ${closeDelay}ms`,
            display:"flex",flexDirection:"column",alignItems:"center",gap:5,
          }}>
            <div style={{
              background:"#fff",borderRadius:20,padding:"4px 10px", fontSize:11,fontWeight:700,color:"#111", border:"1.5px solid #e5e7eb",
              boxShadow:"0 3px 12px rgba(0,0,0,0.1)",whiteSpace:"nowrap",
              opacity: open ? 1 : 0, transform: open ? "translateY(0)" : "translateY(6px)",
              transition: open ? `opacity 0.2s ease ${item.delay + 80}ms, transform 0.2s ease ${item.delay + 80}ms` : "none",
            }}>{item.label}</div>
            <button type="button" onClick={()=>handleArchItem(item)} style={{
              width: item.kind==="add" ? 58 : 56, height: item.kind==="add" ? 58 : 56, borderRadius:"50%",
              background: item.kind==="add" ? `linear-gradient(145deg,${G},${G2})` : "#fff",
              border: item.kind==="add" ? "2.5px solid rgba(255,255,255,0.4)" : "2px solid #e5e7eb",
              boxShadow: item.kind==="add" ? `0 10px 26px ${item.col}55` : "0 6px 18px rgba(0,0,0,0.10)",
              cursor:"pointer", display:"flex",alignItems:"center",justifyContent:"center",
              color: item.kind==="add" ? "#fff" : G, outline:"none",
            }}>
              {item.kind==="add" ? <Plus size={24} strokeWidth={2.6}/>
                : item.id==="transactions" ? <List size={22} strokeWidth={1.9}/>
                : item.id==="accounts"     ? <CreditCard size={22} strokeWidth={1.9}/>
                : <BarChart2 size={22} strokeWidth={1.9}/>}
            </button>
          </div>
        );
      })}

      {/* Main Nav Container */}
      <div style={{
        position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)", width:"100%",maxWidth:430,
        background:"#fff",borderTop:"1px solid #f1f5f9",
        display:"grid",gridTemplateColumns:"1fr 88px 1fr",alignItems:"center",
        paddingBottom:"max(env(safe-area-inset-bottom,0px),12px)", paddingTop:10,
        zIndex:55, boxShadow:"0 -2px 16px rgba(0,0,0,0.06)"
      }}>
        {/* Active tab indicator strip */}
        {!["home","profile"].includes(tab) && (
          <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${G},#3b82f6)`,borderRadius:"0 0 3px 3px",opacity:0.7}}/>
        )}
        {/* BERANDA */}
        <div style={{display:"flex",justifyContent:"center"}}>
          <button type="button" onClick={()=>{setTab("home");setOpen(false);}} style={{background:"none",border:"none",display:"flex",flexDirection:"column",alignItems:"center",gap:4,cursor:"pointer",padding:"4px 0"}}>
            <div style={{color:tab==="home"?G:"#9ca3af"}}><Home size={24} strokeWidth={2}/></div>
            <span style={{fontSize:11,fontWeight:tab==="home"?800:600,color:tab==="home"?G:"#9ca3af"}}>Beranda</span>
          </button>
        </div>
        {/* CENTER SPACER */}
        <div style={{display:"flex",justifyContent:"center",alignItems:"flex-start",paddingTop:2}}>
        </div>
        {/* PROFIL */}
        <div style={{display:"flex",justifyContent:"center"}}>
          <button type="button" onClick={()=>{setTab("profile");setOpen(false);}} style={{background:"none",border:"none",display:"flex",flexDirection:"column",alignItems:"center",gap:4,cursor:"pointer",padding:"4px 0"}}>
            <div style={{color:tab==="profile"?G:"#9ca3af"}}><UserCircle size={24} strokeWidth={2}/></div>
            <span style={{fontSize:11,fontWeight:tab==="profile"?800:600,color:tab==="profile"?G:"#9ca3af"}}>Profil</span>
          </button>
        </div>
      </div>

      {/* Main FAB DompetKu */}
      <button type="button" onClick={()=>setOpen(p=>!p)} style={{
        position:"fixed", bottom:NAV_BOT, left:"50%", transform:`translateX(-50%)`,
        width:70,height:70,borderRadius:"50%",
        background: open ? "linear-gradient(145deg,#374151,#1f2937)" : `linear-gradient(145deg,${G},${G2})`,
        border:"3.5px solid #fff",
        boxShadow: open ? "0 8px 28px rgba(0,0,0,0.3)" : `0 6px 24px ${G}60`,
        cursor:"pointer", display:"flex",alignItems:"center",justifyContent:"center",
        zIndex:57, color:"#fff", transition:"background 0.25s ease, box-shadow 0.25s ease", outline:"none",
        animation: !open ? "fabPulse 2.5s infinite" : "none",
      }}>
        <div style={{position:"absolute",opacity:open?0:1,transform:open?"scale(0.5) rotate(45deg)":"scale(1) rotate(0deg)",transition:"opacity .22s ease, transform .28s cubic-bezier(0.34,1.56,0.64,1)"}}>
          <DompetKuLogo size={32}/>
        </div>
        <div style={{position:"absolute",opacity:open?1:0,transform:open?"scale(1) rotate(0deg)":"scale(0.5) rotate(-45deg)",transition:"opacity .22s ease, transform .28s cubic-bezier(0.34,1.56,0.64,1)"}}>
          <X size={28} strokeWidth={2.5}/>
        </div>
      </button>
    </>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const isPickingFile = useRef(false);
  const openFilePicker = useCallback((refEl) => {
    isPickingFile.current = true;
    const resetOnFocus = () => {
      setTimeout(() => { isPickingFile.current = false; }, 400);
      window.removeEventListener("focus", resetOnFocus);
    };
    window.addEventListener("focus", resetOnFocus);
    refEl.click();
  }, []);

  const [onboarded,    setOnboarded]    = useState(()=>lsGet("dk_onboarded",false));
  const [userName,     setUserName]     = useState(()=>lsGet("dk_name",""));
  const [userAvatar,   setUserAvatarState] = useState(null);
  const setUserAvatar = useCallback(async (data) => {
    setUserAvatarState(data);
    if (data) { await IDB.put("dk_avatar_v1", data).catch(()=>{}); }
    else { await IDB.del("dk_avatar_v1").catch(()=>{}); }
  }, []);
  useEffect(() => {
    IDB.get("dk_avatar_v1").then(d => { if(d) setUserAvatarState(d); }).catch(()=>{});
  }, []);
  const [pinEnabled,   setPinEnabled]   = useState(()=>lsGet("dk_pin_on",false));
  const [pinHash,      setPinHash]      = useState(()=>lsGet("dk_pin_hash",""));
  const [bioEnabled,   setBioEnabled]   = useState(()=>lsGet("dk_bio_on",false));
  const [soundEnabled, setSoundEnabled] = useState(()=>lsGet("dk_sound",false));
  const [monthlyBudget,setMonthlyBudget]= useState(()=>lsGet("dk_budget",10000000));
  const [savedPct,     setSavedPct]     = useState(()=>lsGet("dk_save_pct",20));
  const [accounts,     setAccounts]     = useState(()=>lsGet("dk_accounts",[]));
  const [transactions, setTransactions] = useState(()=>lsGet("dk_txns",[]));
  const [hidden,       setHidden]       = useState(()=>lsGet("dk_hidden",false));
  const [locked,       setLocked]       = useState(()=>lsGet("dk_pin_on",false));

  const [tab,          setTab]          = useState("home");
  const [showAdd,      setShowAdd]      = useState(false);
  const [addPrefill,   setAddPrefill]   = useState(null); // { type:"income"|"expense" } | null
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [showImport,   setShowImport]   = useState(false);
  const [txnFilter,    setTxnFilter]    = useState(null);
  const [selectedAcc,  setSelectedAcc]  = useState(null);
  const [editTxn,      setEditTxn]      = useState(null);
  const [viewTxn,      setViewTxn]      = useState(null);
  const [searchOpen,   setSearchOpen]   = useState(false);
  const [editAccFromDetail, setEditAccFromDetail] = useState(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  useEffect(()=>lsSet("dk_onboarded",onboarded),[onboarded]);
  useEffect(()=>lsSet("dk_name",userName),[userName]);
  useEffect(()=>lsSet("dk_pin_on",pinEnabled),[pinEnabled]);
  useEffect(()=>lsSet("dk_pin_hash",pinHash),[pinHash]);
  useEffect(()=>lsSet("dk_bio_on",bioEnabled),[bioEnabled]);
  useEffect(()=>lsSet("dk_sound",soundEnabled),[soundEnabled]);
  useEffect(()=>lsSet("dk_budget",monthlyBudget),[monthlyBudget]);
  useEffect(()=>lsSet("dk_save_pct",savedPct),[savedPct]);
  useEffect(()=>lsSet("dk_accounts",accounts),[accounts]);
  useEffect(()=>lsSet("dk_txns",transactions),[transactions]);
  useEffect(()=>lsSet("dk_hidden",hidden),[hidden]);

  useEffect(()=>{
    const handle=()=>{ if(document.hidden&&pinEnabled&&!isPickingFile.current)setLocked(true); };
    document.addEventListener("visibilitychange",handle);
    return()=>document.removeEventListener("visibilitychange",handle);
  },[pinEnabled]);

  // Ref-based nav state — no dep array so ref is always current before any popstate fires
  const navStateRef = useRef({});
  useEffect(() => {
    navStateRef.current = { locked, viewTxn, editTxn, showAdd, showImport, selectedAcc, tab, showExitConfirm };
  });

  // Screens register a closer function when a local modal is open
  const closeLocalModalRef = useRef(null);
  const registerLocalModal = useCallback((closeFn) => { closeLocalModalRef.current = closeFn; }, []);
  const unregisterLocalModal = useCallback(() => { closeLocalModalRef.current = null; }, []);

  // Push ONE history entry on mount — never again
  useEffect(() => {
    window.history.pushState({ dk: "home" }, "");
  }, []);

  // Register handler ONCE — reads live state from refs
  useEffect(() => {
    const handlePopState = () => {
      window.history.pushState({ dk: "home" }, ""); // always re-trap
      const s = navStateRef.current;
      if (s.showExitConfirm) { setShowExitConfirm(false); return; }
      if (closeLocalModalRef.current) { closeLocalModalRef.current(); closeLocalModalRef.current = null; return; }
      if (s.viewTxn) { setViewTxn(null); return; }
      if (s.editTxn) { setEditTxn(null); return; }
      if (s.showAdd) { setShowAdd(false); return; }
      if (s.showImport) { setShowImport(false); return; }
      if (s.selectedAcc) { setSelectedAcc(null); return; }
      if (s.tab !== "home") { setTab("home"); return; }
      setShowExitConfirm(true);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []); // empty deps — registers once, reads state from refs

  const deleteTransaction = useCallback(txn=>{
    setTransactions(p=>p.filter(t=>t.id!==txn.id));
    if (txn.type==="transfer") {
      setAccounts(p=>p.map(a=>{
        if(String(a.id)===String(txn.fromId)) return {...a,balance:a.balance+txn.amount};
        if(String(a.id)===String(txn.toId))   return {...a,balance:a.balance-txn.amount};
        return a;
      }));
    } else {
      setAccounts(p=>p.map(a=>String(a.id)===String(txn.accountId) ? {...a,balance:a.balance+(txn.type==="income"?-txn.amount:txn.amount)} : a));
    }
    (txn.attachmentMeta||[]).forEach(att=>IDB.del(att.id).catch(()=>{}));
  },[]);

  const addTransaction = useCallback(form=>{
    if(form.type==="transfer"){
      handleTransferFunds({fromId:form.fromId,toId:form.toId,amount:form.amount,note:form.note});
      setShowAdd(false); setEditTxn(null); return;
    }
    const newTxn={...form,id:generateId(),detected:form.detected||null};
    setTransactions(p=>[newTxn,...p]);
    setAccounts(p=>p.map(a=>String(a.id)===String(form.accountId) ? {...a,balance:a.balance+(form.type==="income"?form.amount:-form.amount)} : a));
    setShowAdd(false); setEditTxn(null);
  },[]);

  const openAddTxn = useCallback((type) => {
    if (accounts.length === 0) { setTab("accounts"); return; }
    setAddPrefill(type ? { type } : null);
    setShowAdd(true);
  }, [accounts.length]);

  const handleTransferFunds = useCallback((params) => {
    const { fromId, toId, amount, note } = params;
    if (!amount || !fromId || !toId || String(fromId) === String(toId)) return;
    const fromAcc = accounts.find(a => String(a.id) === String(fromId));
    const toAcc   = accounts.find(a => String(a.id) === String(toId));
    if (!fromAcc || !toAcc) return;

    setAccounts(p => p.map(a => {
      if (String(a.id) === String(fromId)) return { ...a, balance: a.balance - amount };
      if (String(a.id) === String(toId))   return { ...a, balance: a.balance + amount };
      return a;
    }));

    const baseNote = note?.trim() ? ` — ${note.trim()}` : "";
    const date = params.date || todayStr();
    const time = nowTime();
    const transferId = generateId();
    const txn = { id: transferId, type:"transfer", amount, category:"Penyesuaian Saldo",
      note: `${fromAcc.name} → ${toAcc.name}${baseNote}`, date, time,
      fromId: String(fromAcc.id), toId: String(toAcc.id),
      accountId: String(fromAcc.id), detected:null, attachmentMeta:[] };
    setTransactions(p => [txn, ...p]);
    setShowTransfer(false);
  }, [accounts]);

  const updateTransaction = useCallback((original,updated)=>{    setAccounts(p=>p.map(a=>{
      let bal=a.balance;
      if(String(a.id)===String(original.accountId)) bal += original.type==="income"?-original.amount:original.amount;
      if(String(a.id)===String(updated.accountId))  bal += updated.type==="income"?updated.amount:-updated.amount;
      return (String(a.id)===String(original.accountId) || String(a.id)===String(updated.accountId)) ? {...a,balance:bal} : a;
    }));
    setTransactions(p=>p.map(t=>t.id===original.id?{...updated,id:original.id}:t));
    setEditTxn(null); setViewTxn(null);
  },[]);

  const updateTxnDetails = useCallback((txnId, details) => {
    setTransactions(p => p.map(t => t.id === txnId ? {...t, details} : t));
    setViewTxn(prev => prev && prev.id === txnId ? {...prev, details} : prev);
  }, []);

  const importTxns = useCallback(txns=>{
    setTransactions(p => [...txns, ...p]);
    setAccounts(p => p.map(a => {
       const accDiff = txns.filter(t => String(t.accountId) === String(a.id)).reduce((sum, t) => sum + (t.type==="income"?t.amount:-t.amount), 0);
       return accDiff !== 0 ? { ...a, balance: a.balance + accDiff } : a;
    }));
    setShowImport(false);
  }, []);

  const titleMap={home:"Beranda",transactions:"Transaksi",accounts:"Akun",charts:"Analisis",profile:"Profil"};

  if(!onboarded)return<OnboardingScreen onDone={data=>{const {name,age,job,edu}=typeof data==="string"?{name:data,age:0,job:"",edu:""}:data;setUserName(name);lsSet("dk_age",age);lsSet("dk_job",job);lsSet("dk_edu",edu);setOnboarded(true);}}/>;
  if(locked&&pinEnabled)return<PinScreen mode="unlock" savedHash={pinHash} bioEnabled={bioEnabled} onUnlock={()=>setLocked(false)}/>;
  if(selectedAcc)return <AccountDetailScreen account={selectedAcc.acc} transactions={transactions} accIdx={selectedAcc.idx} onClose={()=>setSelectedAcc(null)} onEditAccount={()=>{setSelectedAcc(null);setTab("accounts");}} onDirectEdit={({acc,idx})=>{setSelectedAcc(null);setTimeout(()=>setEditAccFromDetail({acc,idx}),80);}}/>;

  return (
    <div style={{fontFamily:"'Outfit',sans-serif",background:BG,minHeight:"100vh",maxWidth:430,margin:"0 auto",paddingBottom:90}}>
      <FontLoader/>
      <style>{`
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none;}
        html,body,#root{width:100%;min-height:100%;margin:0;padding:0;background:${BG};overflow-x:hidden;}
        input,textarea{-webkit-user-select:text;user-select:text;}
        input,select,button{font-family:'Outfit',sans-serif;}
        button:focus,input:focus,select:focus{outline:none;}
        ::-webkit-scrollbar{width:0;height:0;}
        @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        input[type=range]{height:6px;border-radius:99px;}
        input[type=color]{-webkit-appearance:none;appearance:none;border:none;background:none;}
        input[type=color]::-webkit-color-swatch-wrapper{padding:0;}
        input[type=color]::-webkit-color-swatch{border:none;border-radius:8px;}
        .screen{animation:fadeUp .2s ease}
      `}</style>

      {/* HEADER */}
      <div style={{background:"#fff",paddingTop:"calc(env(safe-area-inset-top,0px) + 10px)",paddingBottom:12,paddingLeft:20,paddingRight:20,display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid #f1f5f9",position:"sticky",top:0,zIndex:50,boxShadow:"0 1px 0 #f1f5f9"}}>
        <h1 style={{margin:0,fontSize:17,fontWeight:800,color:"#111"}}>{titleMap[tab]}</h1>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {tab!=="transactions"&&<span style={{fontSize:11,fontWeight:600,color:"#9ca3af",background:"#f8fafc",borderRadius:8,padding:"4px 8px"}}>{fmtDate()}</span>}
          {tab==="transactions"&&<button type="button" onClick={()=>setSearchOpen(p=>!p)} style={{background:"#f1f5f9",border:"none",borderRadius:10,width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#374151"}}><Search size={15} strokeWidth={1.7}/></button>}
          {pinEnabled&&<button type="button" onClick={()=>setLocked(true)} style={{background:"#f1f5f9",border:"none",borderRadius:10,width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#374151"}}><Lock size={15} strokeWidth={1.7}/></button>}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{paddingTop:14}} className="screen" key={tab}>
        {tab==="home"&&<HomeScreen accounts={accounts} transactions={transactions} monthlyBudget={monthlyBudget} setMonthlyBudget={setMonthlyBudget} savedPct={savedPct} setSavedPct={setSavedPct} userName={userName} userAvatar={userAvatar} setTab={setTab} setTxnFilter={setTxnFilter} setSelectedAcc={setSelectedAcc} hidden={hidden} setHidden={setHidden} onTxnClick={t=>setViewTxn(t)} registerLocalModal={registerLocalModal} unregisterLocalModal={unregisterLocalModal}/>}
        {tab==="transactions"&&<TransactionsScreen transactions={transactions} accounts={accounts} onDelete={deleteTransaction} onEdit={t=>{setEditTxn(t);}} onTxnClick={t=>setViewTxn(t)} initialTypeFilter={txnFilter} onFilterConsumed={()=>setTxnFilter(null)} searchOpen={searchOpen} onSearchClose={()=>setSearchOpen(false)}/>}
        {tab==="accounts"&&<AccountsScreen accounts={accounts} setAccounts={setAccounts} transactions={transactions} setTransactions={setTransactions} setSelectedAcc={setSelectedAcc} registerLocalModal={registerLocalModal} unregisterLocalModal={unregisterLocalModal} onOpenTransfer={()=>{ if(accounts.length<2){return;} setShowTransfer(true); }}/>}
        {tab==="charts"&&<ChartsScreen transactions={transactions}/>}
        {tab==="profile"&&<ProfileScreen userName={userName} setUserName={setUserName} userAvatar={userAvatar} setUserAvatar={setUserAvatar} transactions={transactions} accounts={accounts} pinEnabled={pinEnabled} pinHash={pinHash} setPinEnabled={setPinEnabled} setPinHash={h=>{setPinHash(h);setPinEnabled(true);}} bioEnabled={bioEnabled} setBioEnabled={setBioEnabled} soundEnabled={soundEnabled} setSoundEnabled={setSoundEnabled} setTransactions={setTransactions} setAccounts={setAccounts} setShowImport={setShowImport} registerLocalModal={registerLocalModal} unregisterLocalModal={unregisterLocalModal}/>}
      </div>

      {/* ULTIMATE FAN NAV */}
      <FanNav tab={tab} setTab={setTab} onOpenQuickAdd={()=>{if(accounts.length===0){setTab("accounts");return;}setAddPrefill(null);setShowAdd(true);}}/>

      {/* MODALS */}
      {showAdd&&accounts.length>0&&<TxnModal initial={addPrefill||undefined} accounts={accounts} onClose={()=>{setShowAdd(false);setAddPrefill(null);}} onSave={addTransaction} soundEnabled={soundEnabled} isPickingFile={isPickingFile} openFilePicker={openFilePicker}/>}
      {editTxn&&<TxnModal initial={{...editTxn,amountStr:editTxn.amount.toLocaleString("id-ID")}} accounts={accounts} onClose={()=>setEditTxn(null)} onSave={updated=>updateTransaction(editTxn,updated)} soundEnabled={soundEnabled} isPickingFile={isPickingFile} openFilePicker={openFilePicker}/>}
      {showImport&&<ImportModal accounts={accounts} onClose={()=>setShowImport(false)} onImport={importTxns} isPickingFile={isPickingFile} openFilePicker={openFilePicker}/>}
      {viewTxn&&<TxnDetailSheet txn={viewTxn} accounts={accounts} onClose={()=>setViewTxn(null)} onEdit={t=>{ setViewTxn(null); setEditTxn(t); }} onDelete={t=>{ deleteTransaction(t); setViewTxn(null); }} onSaveDetails={updateTxnDetails}/>}

      {editAccFromDetail&&<AccountModalOverlay initial={editAccFromDetail.acc} idx={editAccFromDetail.idx} accounts={accounts} transactions={transactions} setAccounts={setAccounts} setTransactions={setTransactions} onClose={()=>setEditAccFromDetail(null)}/>}
      {showTransfer&&(
        <TransferModal
          accounts={accounts}
          onClose={()=>setShowTransfer(false)}
          onTransfer={handleTransferFunds}
        />
      )}
      
      {/* Safe Exit Flow */}
      {showExitConfirm&&<ConfirmDialog title="Keluar dari DompetKu?" sub="Yakin ingin menutup aplikasi?" danger={false} confirmLabel="Keluar" 
        onConfirm={()=>{ 
          setShowExitConfirm(false); 
          if(window.Capacitor?.Plugins?.App) window.Capacitor.Plugins.App.exitApp(); 
          else if(window.close) { window.close(); alert("Silakan tutup tab/aplikasi ini."); }
        }} 
        onCancel={()=>setShowExitConfirm(false)}/>}
    </div>
  );
}
