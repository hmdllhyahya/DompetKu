// DompetKu v6.1 – Full rebuild with enhancements
import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import * as XLSX from "xlsx";
import {
  Home, UserCircle, Plus, X, Search, Lock, List, BarChart2,
  CreditCard, Wallet, Smartphone, Coins, ChevronLeft, ArrowUp, ArrowDown,
  Pencil, Trash2, Camera, Shield, Download, Upload, AlertTriangle,
  Check, Volume2, VolumeX, Coffee, ShoppingCart, ShoppingBag, Car, Zap,
  Heart, BookOpen, Scissors, Briefcase, Gift, TrendingUp, MoreHorizontal,
  Monitor, Eye, EyeOff, ArrowDownLeft, ArrowUpRight,
  PiggyBank, Receipt, Star, Sliders, ExternalLink
} from "lucide-react";

// ─── THEME ───────────────────────────────────────────────────────────────────
const G = "#2DAB7F", G2 = "#1d8a63", GL = "#E8F7F1", GM = "#b6e4d0", BG = "#F0F3F7";
const SWATCH = ["#2DAB7F","#1d4ed8","#7c3aed","#ef4444","#f97316","#0ea5e9","#ec4899","#374151"];

// ─── BRAND MAP ────────────────────────────────────────────────────────────────
const BRAND_MAP = {
  bca:       "linear-gradient(135deg,#0053A0,#0070CC)",
  bri:       "linear-gradient(135deg,#003F88,#1565C0)",
  bni:       "linear-gradient(135deg,#FF6B00,#FF8F00)",
  mandiri:   "linear-gradient(135deg,#002F87,#1946B4)",
  bsi:       "linear-gradient(135deg,#005C35,#008A4B)",
  cimb:      "linear-gradient(135deg,#AB1519,#D32F2F)",
  permata:   "linear-gradient(135deg,#00529B,#0070C9)",
  danamon:   "linear-gradient(135deg,#E00000,#FF1744)",
  gopay:     "linear-gradient(135deg,#00AED6,#00BCD4)",
  ovo:       "linear-gradient(135deg,#4B2D8C,#6A3DB5)",
  dana:      "linear-gradient(135deg,#108BE8,#1E96FC)",
  shopeepay: "linear-gradient(135deg,#EE4D2D,#FF5722)",
  linkaja:   "linear-gradient(135deg,#E40C22,#F44336)",
  jago:      "linear-gradient(135deg,#00C774,#00E676)",
  jenius:    "linear-gradient(135deg,#1565C0,#1976D2)",
  blu:       "linear-gradient(135deg,#006DFF,#42A5F5)",
  seabank:   "linear-gradient(135deg,#FF6B00,#FFA040)",
};
const DEFAULT_GRADS = [
  "linear-gradient(135deg,#374151,#6b7280)",
  "linear-gradient(135deg,#1d4ed8,#60a5fa)",
  "linear-gradient(135deg,#7c3aed,#c084fc)",
  "linear-gradient(135deg,#0e9f6e,#34d399)",
  "linear-gradient(135deg,#b45309,#f59e0b)",
  "linear-gradient(135deg,#0369a1,#38bdf8)",
];
const detectBrand = name => {
  if (!name) return null;
  const l = name.toLowerCase().replace(/\s/g, "");
  for (const [k, v] of Object.entries(BRAND_MAP)) if (l.includes(k)) return v;
  return null;
};
const getAccGrad = (acc, idx = 0) =>
  acc.customGrad || detectBrand(acc.name) || DEFAULT_GRADS[idx % DEFAULT_GRADS.length];

// App Deep Links
const getAppLink = name => {
  if (!name) return null;
  const n = name.toLowerCase();
  if (n.includes('bca')) return 'bca://';
  if (n.includes('mandiri')) return 'byond://'; // New Mandiri Byond
  if (n.includes('bri')) return 'brimo://';
  if (n.includes('bni')) return 'bni://';
  if (n.includes('go') || n.includes('gopay')) return 'gojek://';
  if (n.includes('ovo')) return 'ovo://';
  if (n.includes('dana')) return 'dana://';
  if (n.includes('shopee')) return 'shopeeid://';
  if (n.includes('jago')) return 'jago://';
  if (n.includes('jenius')) return 'jenius://';
  return null;
};

// ─── CATEGORY CONFIG ──────────────────────────────────────────────────────────
const SMART_RULES = [
  { kw: ["indomaret","alfamart","lawson","minimarket","superindo","giant","hypermart","carrefour","transmart"], cat: "Belanja Harian" },
  { kw: ["gofood","grabfood","shopeefood","kfc","mcdonalds","burger","pizza","starbucks","kopi","bakso","warteg","makan","resto","cafe","coffee","padang","nasi"], cat: "Makan & Minum" },
  { kw: ["tokopedia","shopee","lazada","bukalapak","blibli","tiktok shop","zalora","uniqlo","zara"], cat: "Belanja Online" },
  { kw: ["grab","gojek","ojek","maxim","busway","transjakarta","kereta","mrt","lrt","bensin","pertamina","shell","parkir","tol"], cat: "Transportasi" },
  { kw: ["netflix","spotify","youtube","disney","vidio","game","bioskop","cinema","cgv","xxi"], cat: "Hiburan" },
  { kw: ["pln","listrik","pdam","internet","wifi","indihome","telkom","xl","telkomsel","pulsa","token"], cat: "Tagihan" },
  { kw: ["apotek","klinik","dokter","rumah sakit","bpjs","obat","vitamin","halodoc"], cat: "Kesehatan" },
  { kw: ["sekolah","kuliah","les","kursus","buku","gramedia"], cat: "Pendidikan" },
  { kw: ["kost","kontrakan","sewa","kpr","cicilan"], cat: "Tempat Tinggal" },
  { kw: ["salon","barber","potong","spa","facial","gym","fitness"], cat: "Perawatan" },
  { kw: ["gaji","salary","thr","bonus","insentif"], cat: "Gaji" },
  { kw: ["freelance","project","proyek","honor","fee","jasa"], cat: "Freelance" },
  { kw: ["transfer","kiriman","hadiah","kado"], cat: "Hadiah" },
  { kw: ["investasi","saham","reksa","deposito","dividen","bunga"], cat: "Investasi" },
  { kw: ["penyesuaian","saldo","koreksi"], cat: "Penyesuaian Saldo" }
];
const CATS_EXP = ["Makan & Minum","Belanja Harian","Belanja Online","Transportasi","Hiburan","Tagihan","Kesehatan","Pendidikan","Tempat Tinggal","Perawatan","Lainnya"];
const CATS_INC = ["Gaji","Freelance","Hadiah","Investasi","Lainnya","Penyesuaian Saldo"];
const CAT_ICON = (cat, sz = 16, col = "currentColor") => {
  const p = { size: sz, strokeWidth: 1.7, color: col };
  return ({ "Makan & Minum":<Coffee {...p}/>, "Belanja Harian":<ShoppingCart {...p}/>, "Belanja Online":<ShoppingBag {...p}/>,
    "Transportasi":<Car {...p}/>, "Hiburan":<Monitor {...p}/>, "Tagihan":<Zap {...p}/>,
    "Kesehatan":<Heart {...p}/>, "Pendidikan":<BookOpen {...p}/>, "Tempat Tinggal":<Home {...p}/>,
    "Perawatan":<Scissors {...p}/>, "Gaji":<Briefcase {...p}/>, "Freelance":<Monitor {...p}/>,
    "Hadiah":<Gift {...p}/>, "Investasi":<TrendingUp {...p}/>, "Lainnya":<MoreHorizontal {...p}/>,
    "Penyesuaian Saldo":<Sliders {...p}/> })[cat] || <MoreHorizontal {...p}/>;
};
const CAT_COLORS = { "Makan & Minum":"#ef4444","Belanja Harian":"#f97316","Belanja Online":"#ec4899","Transportasi":"#3b82f6","Hiburan":"#f59e0b","Tagihan":"#8b5cf6","Kesehatan":"#10b981","Pendidikan":"#06b6d4","Tempat Tinggal":"#6366f1","Perawatan":"#f472b6","Gaji":"#22c55e","Freelance":"#84cc16","Hadiah":"#a78bfa","Investasi":"#34d399","Lainnya":"#9ca3af","Penyesuaian Saldo":"#9ca3af" };
const CAT_BG    = { "Makan & Minum":"#fee2e2","Belanja Harian":"#ffedd5","Belanja Online":"#fce7f3","Transportasi":"#dbeafe","Hiburan":"#fef3c7","Tagihan":"#ede9fe","Kesehatan":"#d1fae5","Pendidikan":"#cffafe","Tempat Tinggal":"#e0e7ff","Perawatan":"#fce7f3","Gaji":"#dcfce7","Freelance":"#ecfccb","Hadiah":"#ede9fe","Investasi":"#d1fae5","Lainnya":"#f3f4f6","Penyesuaian Saldo":"#e5e7eb" };

const ACC_TYPES = [
  { type:"cash",    label:"Dompet / Tunai", Icon: ({s=18})=><Wallet size={s} strokeWidth={1.7}/> },
  { type:"debit",   label:"Rekening Debit", Icon: ({s=18})=><CreditCard size={s} strokeWidth={1.7}/> },
  { type:"credit",  label:"Kartu Kredit",   Icon: ({s=18})=><CreditCard size={s} strokeWidth={1.7}/> },
  { type:"ewallet", label:"E-Wallet",       Icon: ({s=18})=><Smartphone size={s} strokeWidth={1.7}/> },
  { type:"emoney",  label:"E-Money",        Icon: ({s=18})=><Coins size={s} strokeWidth={1.7}/> },
];
const EWALLETS = ["GoPay","OVO","DANA","ShopeePay","LinkAja","Blu","Jago","SeaBank","Lainnya"];
const EMONEYS  = ["Flazz BCA","e-money Mandiri","Brizzi BRI","TapCash BNI","Lainnya"];
const BANKS    = ["BCA","BRI","BNI","Mandiri","BSI","CIMB Niaga","Permata","Danamon","Lainnya"];

const smartDetect = note => {
  if (!note) return null;
  const l = note.toLowerCase();
  for (const r of SMART_RULES) if (r.kw.some(k => l.includes(k))) return r;
  return null;
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const fmt      = n => "Rp " + Math.abs(n).toLocaleString("id-ID");
const fmtShort = n => n>=1e9?(n/1e9).toFixed(1)+"M":n>=1e6?(n/1e6).toFixed(1)+"Jt":n>=1e3?(n/1e3).toFixed(0)+"K":String(n);
const mask     = n => "Rp " + "•".repeat(Math.min(7, String(Math.round(n)).length));
const todayStr = () => new Date().toISOString().slice(0,10);
const startOfWeek  = () => { const d=new Date(); d.setDate(d.getDate()-d.getDay()); return d.toISOString().slice(0,10); };
const startOfMonth = () => { const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-01`; };
const daysLeftMonth = () => { const d=new Date(); return new Date(d.getFullYear(),d.getMonth()+1,0).getDate()-d.getDate()+1; };
const greeting = () => { const h=new Date().getHours(); return h<12?"Selamat Pagi":h<15?"Selamat Siang":h<18?"Selamat Sore":"Selamat Malam"; };
const labelDate = s => {
  const td = todayStr(), yd = new Date(); yd.setDate(yd.getDate()-1);
  if (s===td) return "HARI INI";
  if (s===yd.toISOString().slice(0,10)) return "KEMARIN";
  return new Date(s).toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"}).toUpperCase();
};
const fmtNum  = raw => { const n = parseInt((raw||"").replace(/\D/g,"")||"0"); return n ? n.toLocaleString("id-ID") : ""; };
const parseNum = str => parseInt((str||"").replace(/\./g,"").replace(/,/g,"") || "0");

const getCurrentDateTopStr = () => {
  return new Date().toLocaleDateString("en-GB", { weekday: 'short', day: '2-digit', month: 'short', year: '2-digit' });
};

// localStorage
const lsGet = (k,def) => { try { const v=localStorage.getItem(k); return v!=null?JSON.parse(v):def; } catch { return def; } };
const lsSet = (k,v) => { try { localStorage.setItem(k,JSON.stringify(v)); } catch {} };

// IndexedDB
const IDB = {
  _db: null,
  open() {
    if (this._db) return Promise.resolve(this._db);
    return new Promise((res,rej) => {
      const req = indexedDB.open("dompetku_v6", 1);
      req.onupgradeneeded = e => { if (!e.target.result.objectStoreNames.contains("blobs")) e.target.result.createObjectStore("blobs"); };
      req.onsuccess = e => { this._db = e.target.result; res(this._db); };
      req.onerror = () => rej(req.error);
    });
  },
  async put(key, val) { const db = await this.open(); return new Promise((res,rej) => { const tx = db.transaction("blobs","readwrite"); tx.objectStore("blobs").put(val,key); tx.oncomplete = res; tx.onerror = () => rej(tx.error); }); },
  async get(key) { const db = await this.open(); return new Promise((res,rej) => { const tx = db.transaction("blobs","readonly"); const req = tx.objectStore("blobs").get(key); req.onsuccess = () => res(req.result); req.onerror = () => rej(req.error); }); },
  async del(key) { const db = await this.open(); return new Promise((res,rej) => { const tx = db.transaction("blobs","readwrite"); tx.objectStore("blobs").delete(key); tx.oncomplete = res; tx.onerror = () => rej(tx.error); }); },
};

const hashPin = async pin => {
  try {
    const data = new TextEncoder().encode("dompetku_2025:" + pin);
    const buf  = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,"0")).join("");
  } catch { return pin; }
};

const playTxnSound = type => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination); osc.type = "sine";
    if (type === "expense") { osc.frequency.setValueAtTime(523, ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(262, ctx.currentTime + 0.35); } 
    else { osc.frequency.setValueAtTime(330, ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.35); }
    gain.gain.setValueAtTime(0.22, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.4);
  } catch {}
};

// ─── DOMPETKU LOGO SVG ────────────────────────────────────────────────────────
const DompetKuLogo = ({ size = 28, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect x="2" y="9" width="21" height="15" rx="3.5" stroke={color} strokeWidth="2"/>
    <path d="M15 14h8a2 2 0 010 4h-8" stroke={color} strokeWidth="1.9" fill="none"/>
    <circle cx="19.5" cy="16" r="1.4" fill={color}/>
    <path d="M24 21.5 C27 19.5 29.5 17 29 14" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M24.5 18 C27 16 29 13.5 28.5 11" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M24 14.5 C26 12.5 27 10 26 8.5" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

// ─── SHARED UI ────────────────────────────────────────────────────────────────
const Card    = ({children,style={},onClick}) => <div onClick={onClick} style={{background:"#fff",borderRadius:18,padding:"16px",boxShadow:"0 2px 12px rgba(0,0,0,0.05)",marginBottom:12,...style}}>{children}</div>;
const Row     = ({children,style={}}) => <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",...style}}>{children}</div>;
const BtnG    = ({onClick,children,style={},disabled=false}) => <button onClick={onClick} disabled={disabled} style={{width:"100%",padding:"15px",background:disabled?"#d1d5db":G,border:"none",borderRadius:16,color:"#fff",fontSize:15,fontWeight:700,cursor:disabled?"not-allowed":"pointer",boxShadow:disabled?"none":`0 6px 20px ${G}40`,...style}}>{children}</button>;
const Inp     = ({label,children,mb=10,style={}}) => <div style={{background:"#fff",borderRadius:14,padding:"12px 14px",marginBottom:mb,boxShadow:"0 1px 4px rgba(0,0,0,0.05)",...style}}>{label&&<p style={{margin:"0 0 4px",fontSize:10,color:"#9ca3af",fontWeight:700,letterSpacing:.6}}>{label}</p>}{children}</div>;
const Tog     = ({on,onToggle}) => <div onClick={onToggle} style={{width:44,height:24,borderRadius:99,background:on?G:"#d1d5db",cursor:"pointer",position:"relative",transition:"background .2s",flexShrink:0}}><div style={{position:"absolute",top:3,left:on?23:3,width:18,height:18,borderRadius:"50%",background:"#fff",boxShadow:"0 1px 4px rgba(0,0,0,0.2)",transition:"left .2s"}}/></div>;
const CatBub  = ({cat,size=44}) => <div style={{width:size,height:size,borderRadius:size*0.32,background:CAT_BG[cat]||"#f3f4f6",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:CAT_COLORS[cat]||"#9ca3af"}}>{CAT_ICON(cat,size*0.42)}</div>;
const SRow    = ({icon,bg=GL,title,sub,right,danger=false}) => <div style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",borderBottom:"1px solid #f8fafc"}}><div style={{width:38,height:38,borderRadius:12,background:bg,display:"flex",alignItems:"center",justifyContent:"center",color:danger?"#ef4444":G,flexShrink:0}}>{icon}</div><div style={{flex:1}}><p style={{margin:0,fontSize:13,fontWeight:600,color:danger?"#ef4444":"#111"}}>{title}</p>{sub&&<p style={{margin:"2px 0 0",fontSize:11,color:"#9ca3af"}}>{sub}</p>}</div>{right}</div>;

const BottomSheet = ({onClose,title,children}) => (
  <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",display:"flex",alignItems:"flex-end",zIndex:200,backdropFilter:"blur(4px)"}} onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div style={{background:"#f8fafc",width:"100%",maxWidth:430,margin:"0 auto",borderRadius:"24px 24px 0 0",padding:"20px 16px 36px",maxHeight:"93vh",overflowY:"auto"}}>
      <Row style={{marginBottom:16}}><h2 style={{margin:0,fontSize:17,fontWeight:800,color:"#111"}}>{title}</h2><button onClick={onClose} style={{background:"#e5e7eb",border:"none",borderRadius:9,width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#374151"}}><X size={14}/></button></Row>
      {children}
    </div>
  </div>
);

const ConfirmDialog = ({title,sub,onConfirm,onCancel,danger=true}) => (
  <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
    <div style={{background:"#fff",borderRadius:20,padding:"24px",maxWidth:340,width:"100%",textAlign:"center"}}>
      <div style={{color:danger?"#ef4444":"#f59e0b",display:"flex",justifyContent:"center",marginBottom:10}}><AlertTriangle size={44}/></div>
      <p style={{fontSize:16,fontWeight:800,color:"#111",margin:"0 0 8px"}}>{title}</p>
      <p style={{fontSize:13,color:"#6b7280",marginBottom:20}}>{sub}</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <button onClick={onCancel} style={{padding:"13px",background:"#f1f5f9",border:"none",borderRadius:14,fontSize:14,fontWeight:700,cursor:"pointer"}}>Batal</button>
        <button onClick={onConfirm} style={{padding:"13px",background:danger?"#ef4444":G,border:"none",borderRadius:14,color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer"}}>Ya, Lanjutkan</button>
      </div>
    </div>
  </div>
);

// ─── PIN SCREEN ───────────────────────────────────────────────────────────────
function PinScreen({ mode="unlock", savedHash, onUnlock, onSetPin, onCancel }) {
  const [input, setInput]     = useState("");
  const [confirm, setConfirm] = useState("");
  const [step, setStep]       = useState(1);
  const [err, setErr]         = useState("");
  const [busy, setBusy]       = useState(false);

  const press = async d => {
    if (busy || input.length >= 6) return;
    const next = input + d; setInput(next); setErr("");
    if (mode === "unlock" && next.length === 4) {
      setBusy(true); const h = await hashPin(next); setBusy(false);
      if (h === savedHash) { setInput(""); onUnlock(); }
      else { setErr("PIN salah. Coba lagi."); setTimeout(() => setInput(""), 400); }
    }
    if (mode === "set" && next.length === 4) {
      if (step === 1) { setConfirm(next); setInput(""); setStep(2); }
      else if (next === confirm) { setBusy(true); const h = await hashPin(next); setBusy(false); onSetPin(h); }
      else { setErr("PIN tidak cocok."); setStep(1); setInput(""); setConfirm(""); }
    }
  };

  return (
    <div style={{position:"fixed",inset:0,background:"#fff",zIndex:999,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",maxWidth:430,margin:"0 auto"}}>
      <div style={{width:64,height:64,borderRadius:20,background:`linear-gradient(135deg,${G},${G2})`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16}}><DompetKuLogo size={32}/></div>
      <p style={{fontSize:19,fontWeight:800,color:"#111",margin:"0 0 4px"}}>DompetKu</p>
      <p style={{fontSize:13,color:"#9ca3af",margin:"0 0 24px",textAlign:"center",padding:"0 24px"}}>{mode==="set" ? (step===1?"Buat PIN baru (4 digit)":"Konfirmasi PIN kamu") : "Masukkan PIN untuk membuka"}</p>
      <div style={{display:"flex",gap:14,marginBottom:8}}>{[0,1,2,3].map(i => <div key={i} style={{width:14,height:14,borderRadius:"50%",background:input.length>i?G:"#e5e7eb",transition:"background .15s"}}/>)}</div>
      {err && <p style={{color:"#ef4444",fontSize:12,margin:"4px 0 0"}}>{err}</p>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,72px)",gap:10,marginTop:20}}>
        {[1,2,3,4,5,6,7,8,9,"","0","del"].map(d => (
          <button key={d} onClick={()=>d==="del"?setInput(p=>p.slice(0,-1)):d!==""&&press(String(d))}
            style={{height:68,borderRadius:18,background:d===""?"transparent":d==="del"?"#f1f5f9":"#f8fafc",border:"none",fontSize:22,fontWeight:700,color:"#111",cursor:d===""?"default":"pointer",boxShadow:d===""||d==="del"?"none":"0 1px 4px rgba(0,0,0,0.07)",display:"flex",alignItems:"center",justifyContent:"center"}}>
            {d==="del"?<Trash2 size={17} strokeWidth={1.7} color="#6b7280"/>:d}
          </button>
        ))}
      </div>
      {onCancel && <button onClick={onCancel} style={{marginTop:20,background:"none",border:"none",color:"#9ca3af",fontSize:13,cursor:"pointer"}}>Batal</button>}
    </div>
  );
}

// ─── ONBOARDING ───────────────────────────────────────────────────────────────
function OnboardingScreen({ onDone }) {
  const [slide, setSlide] = useState(0);
  const [name, setName]   = useState("");
  const SLIDES = [
    { title:"Selamat Datang\ndi DompetKu", sub:"Catat, kelola, dan analisis\nkeuangan pribadi kamu dengan mudah.", icon:<PiggyBank size={76} strokeWidth={1.2} color={G}/> },
    { title:"Lacak Setiap\nRupiah",        sub:"Kategorisasi otomatis, lampirkan struk,\ndan lihat grafik keuanganmu.", icon:<BarChart2 size={76} strokeWidth={1.2} color={G}/> },
    { title:"Privat &\nAman",              sub:"Data tersimpan hanya di perangkatmu.\nDilindungi PIN agar tidak ada yang mengintip.", icon:<Shield size={76} strokeWidth={1.2} color={G}/> },
  ];
  const last = slide === SLIDES.length - 1;
  const next = () => { if (last) { if (!name.trim()) return; onDone(name.trim()); } else setSlide(s => s+1); };
  return (
    <div style={{position:"fixed",inset:0,background:"#fff",zIndex:999,maxWidth:430,margin:"0 auto",display:"flex",flexDirection:"column",padding:"60px 28px 40px"}}>
      {!last && <button onClick={()=>setSlide(SLIDES.length-1)} style={{alignSelf:"flex-end",background:"none",border:"none",color:"#9ca3af",fontSize:13,fontWeight:600,cursor:"pointer",marginBottom:8}}>Lewati →</button>}
      {last && <div style={{height:29,marginBottom:8}}/>}
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center"}}>
        <div style={{width:140,height:140,borderRadius:40,background:GL,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:32}}>{SLIDES[slide].icon}</div>
        <h1 style={{fontSize:26,fontWeight:900,color:"#111",margin:"0 0 12px",lineHeight:1.25,whiteSpace:"pre-line"}}>{SLIDES[slide].title}</h1>
        <p style={{fontSize:15,color:"#6b7280",lineHeight:1.7,margin:0,whiteSpace:"pre-line"}}>{SLIDES[slide].sub}</p>
        {last && (
          <div style={{width:"100%",marginTop:24}}>
            <p style={{fontSize:14,fontWeight:700,color:"#111",marginBottom:10}}>Siapa namamu?</p>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Masukkan nama kamu..." style={{width:"100%",border:`2px solid ${G}`,borderRadius:14,padding:"13px 16px",fontSize:15,fontWeight:600,outline:"none",color:"#111",textAlign:"center",boxSizing:"border-box"}} autoFocus/>
          </div>
        )}
      </div>
      <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:24}}>
        {SLIDES.map((_,i)=><div key={i} style={{width:i===slide?24:8,height:8,borderRadius:99,background:i===slide?G:"#e5e7eb",transition:"all .3s"}}/>)}
      </div>
      <BtnG onClick={next} disabled={last&&!name.trim()}>{last?"Mulai Sekarang →":"Lanjut"}</BtnG>
    </div>
  );
}

// ─── SMART BUDGET MODAL ───────────────────────────────────────────────────────
function BudgetModal({ totalBalance, currentBudget, targetTabungan, setTargetTabungan, onApply, onClose }) {
  const daysLeft   = daysLeftMonth();
  const [savePct, setSavePct]     = useState(targetTabungan || 20);
  const [custom, setCustom]       = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const saving      = Math.round(totalBalance * savePct / 100);
  const spendable   = Math.max(0, totalBalance - saving);
  const sugBudget   = spendable;
  const sugDaily    = daysLeft > 0 ? Math.floor(spendable / daysLeft) : 0;
  const finalBudget = useCustom ? (parseNum(custom)||0) : sugBudget;
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
        <Row style={{marginTop:8}}>
          <span style={{fontSize:11,color:"#9ca3af"}}>0%</span><span style={{fontSize:11,color:"#9ca3af"}}>70%</span>
        </Row>
      </Card>
      <Card style={{marginBottom:14}}>
        <p style={{margin:"0 0 10px",fontSize:12,fontWeight:700,color:"#9ca3af",letterSpacing:.5}}>ANALISIS REKOMENDASI</p>
        {[{ label:"Ditabung", val:saving, col:"#8b5cf6" },{ label:"Bisa Dibelanjakan", val:spendable, col:G },{ label:"Budget Bulanan Ideal", val:sugBudget, col:G, bold:true },{ label:"Limit Harian Ideal", val:sugDaily, col:"#f97316" }].map(r => (
          <Row key={r.label} style={{paddingVertical:4,marginBottom:6}}><span style={{fontSize:12,color:"#6b7280"}}>{r.label}</span><span style={{fontSize:r.bold?14:12,fontWeight:r.bold?800:700,color:r.col}}>{fmt(r.val)}</span></Row>
        ))}
      </Card>
      <Inp label="ATAU MASUKKAN NOMINAL SENDIRI" mb={18}>
        <div style={{display:"flex",alignItems:"center",gap:8}}><input type="checkbox" checked={useCustom} onChange={e=>setUseCustom(e.target.checked)} style={{accentColor:G,width:16,height:16}}/><span style={{fontSize:12,color:"#6b7280",flex:1}}>Pakai nominal kustom</span></div>
        {useCustom && (<div style={{marginTop:8,display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:14,color:"#9ca3af",fontWeight:600}}>Rp</span><input inputMode="numeric" value={custom} onChange={e=>setCustom(fmtNum(e.target.value))} placeholder="0" style={{flex:1,border:"none",outline:"none",fontSize:18,fontWeight:800,color:"#111",background:"transparent"}}/></div>)}
      </Inp>
      <BtnG onClick={()=>{ setTargetTabungan(savePct); onApply(finalBudget); }} disabled={finalBudget<=0}>Terapkan Budget: {fmt(finalBudget)}</BtnG>
    </BottomSheet>
  );
}

// ─── ACCOUNT MODAL ────────────────────────────────────────────────────────────
function AccountModal({ initial, onClose, onSave, isNew }) {
  const [acc, setAcc]         = useState(initial || { type:"debit", name:"", last4:"", customGrad:"", balance: 0 });
  const [showCustom, setShowCustom] = useState(false);
  const [customName, setCustomName] = useState("");
  const [c1, setC1] = useState(initial?.customGrad ? initial.customGrad.split(",")[1].trim() : "#2DAB7F");
  const [c2, setC2] = useState(initial?.customGrad ? initial.customGrad.split(",")[2].replace(")","").trim() : "#1d8a63");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const iconRef = useRef();
  
  const s = (k,v) => setAcc(a=>({...a,[k]:v}));
  const handleSelect = v => { if(v==="Lainnya"){setShowCustom(true);s("name","");}else{setShowCustom(false);s("name",v);} };
  const finalName    = showCustom ? customName : acc.name;
  const opts         = acc.type==="ewallet"?EWALLETS:acc.type==="emoney"?EMONEYS:acc.type==="cash"?null:BANKS;
  const detectedGrad = detectBrand(finalName);

  const applyCustomColor = () => { s("customGrad", `linear-gradient(135deg, ${c1}, ${c2})`); };

  const submit = () => {
    if (!finalName || (!isNew && !initial)) return;
    const data = { ...acc, name: finalName };
    if (!data.customGrad && detectedGrad) data.customGrad = detectedGrad;
    const diff = data.balance - (initial?.balance || 0);
    onSave(data, isNew ? 0 : diff);
  };

  const handleIcon = e => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader(); r.onload = () => s("iconImg", r.result); r.readAsDataURL(f);
  };

  return (
    <BottomSheet onClose={onClose} title={isNew?"Tambah Akun":"Edit Akun"}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
        {ACC_TYPES.map(t => (
          <button key={t.type} onClick={()=>{s("type",t.type);setShowCustom(false);s("name","");}}
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
      {showCustom && <Inp label="NAMA MANUAL" mb={10}><input value={customName} onChange={e=>setCustomName(e.target.value)} placeholder="cth: Bank Anda, GoPay Bisnis..." style={{width:"100%",background:"transparent",border:"none",outline:"none",fontSize:14,color:"#111"}}/></Inp>}
      <Inp label="4 DIGIT TERAKHIR (OPSIONAL)" mb={10}>
        <input value={acc.last4||""} onChange={e=>s("last4",e.target.value.slice(0,4))} placeholder="xxxx" maxLength={4} style={{width:"100%",background:"transparent",border:"none",outline:"none",fontSize:14,color:"#111"}}/>
      </Inp>
      <Card style={{marginBottom:14,padding:"12px 14px"}}>
        <p style={{margin:"0 0 10px",fontSize:10,fontWeight:700,color:"#9ca3af",letterSpacing:.5}}>TAMPILAN KARTU</p>
        {detectedGrad && <div style={{background:GL,borderRadius:9,padding:"7px 11px",marginBottom:8,display:"flex",alignItems:"center",gap:7}}><Check size={13} color={G}/><span style={{fontSize:11,color:G,fontWeight:600}}>Brand {finalName} terdeteksi</span></div>}
        <Row style={{marginBottom:8}}>
          <span style={{fontSize:12,color:"#6b7280"}}>Warna kustom & Ikon</span>
          <button onClick={()=>setShowColorPicker(p=>!p)} style={{background:"none",border:"none",color:G,fontSize:12,fontWeight:600,cursor:"pointer"}}>{showColorPicker?"Tutup":"Edit"}</button>
        </Row>
        {showColorPicker && (
          <div style={{background:"#f8fafc", padding:10, borderRadius:12, marginBottom:10}}>
            <p style={{fontSize:11, color:"#6b7280", margin:"0 0 6px"}}>Warna Gradien (2 warna)</p>
            <div style={{display:"flex", gap:8, marginBottom:12}}>
              <input type="color" value={c1} onChange={e=>{setC1(e.target.value); applyCustomColor();}} style={{width:36,height:36,border:"none",padding:0,borderRadius:8,cursor:"pointer"}} />
              <input type="color" value={c2} onChange={e=>{setC2(e.target.value); applyCustomColor();}} style={{width:36,height:36,border:"none",padding:0,borderRadius:8,cursor:"pointer"}} />
            </div>
            <Row>
              <span style={{fontSize:11,color:"#6b7280"}}>Ikon Gambar</span>
              <button onClick={()=>iconRef.current.click()} style={{background:GL,border:"none",borderRadius:9,padding:"5px 10px",color:G,fontSize:11,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}><Upload size={12}/> Upload</button>
            </Row>
            <input ref={iconRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleIcon}/>
          </div>
        )}
        <div style={{background:acc.customGrad||detectedGrad||DEFAULT_GRADS[0],borderRadius:12,padding:"12px",marginTop:8}}>
          <p style={{color:"rgba(255,255,255,0.8)",fontSize:11,margin:"0 0 3px"}}>{finalName||"Nama Akun"}</p>
          <p style={{color:"#fff",fontSize:14,fontWeight:800,margin:0}}>{fmt(acc.balance || 0)}</p>
        </div>
      </Card>
      <Inp label={isNew ? "SALDO AWAL (RP)" : "SALDO SAAT INI (RP)"} mb={14}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:18,fontWeight:700,color:"#9ca3af"}}>Rp</span>
          <input inputMode="numeric" placeholder="0" value={fmtNum(String(acc.balance||""))} onChange={e=>s("balance",parseNum(e.target.value))} style={{flex:1,background:"transparent",border:"none",outline:"none",fontSize:22,fontWeight:800,color:"#111"}}/>
        </div>
      </Inp>
      {!isNew && <p style={{fontSize:11, color:"#9ca3af", margin:"-6px 0 14px 4px", lineHeight:1.4}}>Jika saldo diubah, selisih otomatis tercatat sebagai <b>Penyesuaian Saldo</b>.</p>}
      <BtnG onClick={submit} disabled={!finalName}>{isNew?"Tambah Akun":"Simpan Perubahan"}</BtnG>
    </BottomSheet>
  );
}

// ─── ADD / EDIT TRANSACTION MODAL ─────────────────────────────────────────────
function TxnModal({ initial, accounts, onClose, onSave, soundEnabled, isPickingFile }) {
  const isEdit = !!initial;
  const [form, setForm] = useState(() => initial || {
    type:"expense", amountStr:"", category:"Makan & Minum", note:"", date:todayStr(), 
    time: new Date().toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'}),
    accountId:accounts[0]?.id, attachmentMeta:[], meta: {}
  });
  const [detected, setDetected] = useState(null);
  const fileRef = useRef();
  
  const s = (k,v) => setForm(f=>({...f,[k]:v}));
  const handleNote = v => { s("note",v); const d=smartDetect(v); setDetected(d); if(d)setForm(f=>({...f,note:v,category:d.cat})); };
  const handleAmt  = e => { const raw=e.target.value.replace(/\D/g,""); s("amountStr",raw?parseInt(raw).toLocaleString("id-ID"):""); };
  const handleFile = async e => {
    isPickingFile.current = false;
    const files = Array.from(e.target.files); const newMeta = [];
    for (const f of files) {
      const id = `att_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const data = await new Promise(res => { const r=new FileReader(); r.onload=()=>res(r.result); r.readAsDataURL(f); });
      await IDB.put(id, data).catch(()=>{});
      newMeta.push({ id, name: f.name, type: f.type });
    }
    setForm(f=>({...f, attachmentMeta:[...(f.attachmentMeta||[]),...newMeta]}));
  };
  const removeAttachment = async (id) => { await IDB.del(id).catch(()=>{}); setForm(f=>({...f,attachmentMeta:(f.attachmentMeta||[]).filter(a=>a.id!==id)})); };
  const submit = () => {
    const amount = parseNum(form.amountStr || "0");
    if (!amount || !form.accountId) return;
    if (soundEnabled && !isEdit) playTxnSound(form.type);
    onSave({ ...form, amount, amountStr: undefined, detected });
  };

  const cats = form.type === "expense" ? CATS_EXP : CATS_INC;
  const noteL = (form.note || "").toLowerCase();
  const isTransjakarta = noteL.includes("transjakarta") || noteL.includes("busway");
  const isMRT = noteL.includes("mrt");
  const isBioskop = noteL.includes("bioskop") || noteL.includes("cgv") || noteL.includes("xxi");

  return (
    <BottomSheet onClose={onClose} title={isEdit?"Edit Transaksi":"Catat Transaksi"}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5,marginBottom:14,background:"#e5e7eb",borderRadius:14,padding:4}}>
        {["expense","income"].map(type => (
          <button key={type} onClick={()=>setForm(f=>({...f,type,category:type==="expense"?"Makan & Minum":"Gaji"}))} style={{padding:"10px",border:"none",borderRadius:11,background:form.type===type?"#fff":"transparent",color:form.type===type?"#111":"#9ca3af",fontSize:13,fontWeight:700,cursor:"pointer",boxShadow:form.type===type?"0 1px 4px rgba(0,0,0,0.08)":"none"}}>{type==="expense"?"Pengeluaran":"Pemasukan"}</button>
        ))}
      </div>
      <Inp label="JUMLAH (RP)">
        <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:18,fontWeight:700,color:"#9ca3af"}}>Rp</span><input inputMode="numeric" placeholder="0" value={form.amountStr||""} onChange={handleAmt} style={{flex:1,background:"transparent",border:"none",outline:"none",fontSize:28,fontWeight:800,color:"#111"}}/></div>
      </Inp>
      <Inp label="CATATAN / NAMA TOKO" mb={detected?6:10}><input placeholder="cth: Indomaret, GoFood..." value={form.note||""} onChange={e=>handleNote(e.target.value)} style={{width:"100%",background:"transparent",border:"none",outline:"none",fontSize:14,color:"#111"}}/></Inp>
      {detected && <div style={{display:"flex",alignItems:"center",gap:7,padding:"8px 13px",background:GL,borderRadius:11,marginBottom:10,border:`1px solid ${GM}`}}><Check size={13} color={G}/><span style={{color:G,fontSize:12,fontWeight:600}}>Auto-detect: {detected.cat}</span></div>}
      
      {/* Contextual Extra Fields */}
      {(isTransjakarta || isMRT || isBioskop) && (
        <div style={{background:"#f8fafc", padding:12, borderRadius:12, marginBottom:10, border:"1px dashed #cbd5e1"}}>
          <p style={{fontSize:10, fontWeight:700, color:"#64748b", margin:"0 0 8px"}}>DETAIL TAMBAHAN</p>
          {isTransjakarta && <input placeholder="Koridor (cth: 1 Blok M - Kota)" value={form.meta?.koridor||""} onChange={e=>s("meta", {...form.meta, koridor:e.target.value})} style={{width:"100%", padding:8, borderRadius:8, border:"1px solid #e2e8f0", fontSize:13}}/>}
          {isMRT && <div style={{display:"flex", gap:8}}>
             <input placeholder="Stasiun Asal" value={form.meta?.mrtAsal||""} onChange={e=>s("meta", {...form.meta, mrtAsal:e.target.value})} style={{flex:1, padding:8, borderRadius:8, border:"1px solid #e2e8f0", fontSize:13}}/>
             <input placeholder="Stasiun Tujuan" value={form.meta?.mrtTujuan||""} onChange={e=>s("meta", {...form.meta, mrtTujuan:e.target.value})} style={{flex:1, padding:8, borderRadius:8, border:"1px solid #e2e8f0", fontSize:13}}/>
          </div>}
          {isBioskop && <div style={{display:"flex", gap:8, flexDirection:"column"}}>
             <input placeholder="Judul Film" value={form.meta?.film||""} onChange={e=>s("meta", {...form.meta, film:e.target.value})} style={{width:"100%", padding:8, borderRadius:8, border:"1px solid #e2e8f0", fontSize:13}}/>
             <input placeholder="Bioskop (cth: CGV PVJ)" value={form.meta?.bioskop||""} onChange={e=>s("meta", {...form.meta, bioskop:e.target.value})} style={{width:"100%", padding:8, borderRadius:8, border:"1px solid #e2e8f0", fontSize:13}}/>
          </div>}
        </div>
      )}

      <Inp label="KATEGORI">
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
          {cats.map(c => (
            <button key={c} onClick={()=>s("category",c)} style={{padding:"8px 4px",background:form.category===c?GL:"#f8fafc",border:`1.5px solid ${form.category===c?G:"#f1f5f9"}`,borderRadius:10,color:form.category===c?G:"#9ca3af",fontSize:9,fontWeight:600,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3}}><span style={{color:form.category===c?G:CAT_COLORS[c]||"#9ca3af"}}>{CAT_ICON(c,17)}</span><span style={{textAlign:"center",lineHeight:1.2,color:form.category===c?G:"#6b7280",wordBreak:"break-word",hyphens:"auto"}}>{c==="Makan & Minum"?"Makan":c==="Belanja Harian"?"B.Harian":c==="Belanja Online"?"B.Online":c==="Tempat Tinggal"?"Tempat Tgl":c==="Penyesuaian Saldo"?"Penyesuaian":c.split(" ")[0]}</span></button>
          ))}
        </div>
      </Inp>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
        <Inp label="AKUN" mb={0}>{accounts.length === 0 ? <p style={{margin:0,fontSize:12,color:"#ef4444"}}>Buat akun dulu!</p> : <select value={form.accountId} onChange={e=>s("accountId",parseInt(e.target.value))} style={{width:"100%",background:"transparent",border:"none",outline:"none",fontSize:13,fontWeight:600,color:"#111",WebkitAppearance:"none"}}>{accounts.map(a=><option key={a.id} value={a.id}>{a.name}</option>)}</select>}</Inp>
        <Inp label="WAKTU & TANGGAL" mb={0}>
          <div style={{display:"flex", gap:4}}>
            <input type="time" value={form.time} onChange={e=>s("time",e.target.value)} style={{width:"45%",background:"transparent",border:"none",outline:"none",fontSize:12,fontWeight:600,color:"#111"}}/>
            <input type="date" value={form.date} onChange={e=>s("date",e.target.value)} style={{width:"55%",background:"transparent",border:"none",outline:"none",fontSize:12,fontWeight:600,color:"#111"}}/>
          </div>
        </Inp>
      </div>
      <Inp label="LAMPIRAN (OPSIONAL)" mb={18}>
        <Row><p style={{margin:0,fontSize:12,color:"#9ca3af"}}>Foto struk, invoice, dll.</p><button onClick={()=>{isPickingFile.current=true;fileRef.current.click();}} style={{background:GL,border:"none",borderRadius:9,padding:"6px 12px",color:G,fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:5}}><Upload size={12}/> Tambah</button></Row>
        <input ref={fileRef} type="file" accept="image/*,.pdf" multiple style={{display:"none"}} onChange={handleFile}/>
        {(form.attachmentMeta||[]).length > 0 && (
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:8}}>
            {form.attachmentMeta.map(a => (<div key={a.id} style={{position:"relative",width:52,height:52}}><AttachPreview id={a.id} type={a.type}/><button onClick={()=>removeAttachment(a.id)} style={{position:"absolute",top:-5,right:-5,width:17,height:17,borderRadius:"50%",background:"#ef4444",border:"none",color:"#fff",fontSize:9,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button></div>))}
          </div>
        )}
      </Inp>
      <BtnG onClick={submit} disabled={accounts.length===0}>{isEdit?"Simpan Perubahan":"Simpan Transaksi"}</BtnG>
    </BottomSheet>
  );
}

function AttachPreview({ id, type }) {
  const [src, setSrc] = useState(null);
  useEffect(() => { IDB.get(id).then(d => d && setSrc(d)).catch(()=>{}); }, [id]);
  if (!src) return <div style={{width:52,height:52,borderRadius:9,background:"#f1f5f9",display:"flex",alignItems:"center",justifyContent:"center",color:"#9ca3af"}}><Receipt size={18}/></div>;
  if (type?.startsWith("image")) return <img src={src} alt="" style={{width:52,height:52,borderRadius:9,objectFit:"cover"}}/>;
  return <div style={{width:52,height:52,borderRadius:9,background:"#f1f5f9",display:"flex",alignItems:"center",justifyContent:"center",color:"#6b7280"}}><Receipt size={20}/></div>;
}

// ─── TRANSACTION DETAIL MODAL ──────────────────────────────────────────────────
function TxnDetailModal({ txn, accounts, onClose, onEdit, onDelete }) {
  const acc = accounts.find(a => a.id === txn.accountId);
  return (
    <BottomSheet onClose={onClose} title="Detail Transaksi">
       <div style={{textAlign:"center", marginBottom:20}}>
          <CatBub cat={txn.category} size={64}/>
          <p style={{fontSize:24, fontWeight:800, color:txn.type==="income"?G:"#ef4444", margin:"12px 0 4px"}}>{txn.type==="income"?"+":"-"} {fmt(txn.amount)}</p>
          <p style={{fontSize:14, fontWeight:600, color:"#111", margin:0}}>{txn.note || "Transaksi"}</p>
          <p style={{fontSize:12, color:"#9ca3af", margin:"4px 0 0"}}>{txn.date} • {txn.time||"00:00"}</p>
       </div>
       <Card style={{padding:"8px 16px"}}>
          <Row style={{borderBottom:"1px solid #f8fafc", padding:"8px 0"}}><span style={{fontSize:12, color:"#6b7280"}}>Kategori</span><span style={{fontSize:13, fontWeight:600}}>{txn.category}</span></Row>
          <Row style={{borderBottom:"1px solid #f8fafc", padding:"8px 0"}}><span style={{fontSize:12, color:"#6b7280"}}>Akun</span><span style={{fontSize:13, fontWeight:600}}>{acc?.name || "Dihapus"}</span></Row>
          {txn.meta?.koridor && <Row style={{borderBottom:"1px solid #f8fafc", padding:"8px 0"}}><span style={{fontSize:12, color:"#6b7280"}}>Koridor</span><span style={{fontSize:13, fontWeight:600}}>{txn.meta.koridor}</span></Row>}
          {txn.meta?.mrtAsal && <Row style={{borderBottom:"1px solid #f8fafc", padding:"8px 0"}}><span style={{fontSize:12, color:"#6b7280"}}>Rute MRT</span><span style={{fontSize:13, fontWeight:600}}>{txn.meta.mrtAsal} ➔ {txn.meta.mrtTujuan}</span></Row>}
          {txn.meta?.film && <Row style={{borderBottom:"1px solid #f8fafc", padding:"8px 0"}}><span style={{fontSize:12, color:"#6b7280"}}>Film</span><span style={{fontSize:13, fontWeight:600}}>{txn.meta.film}</span></Row>}
          {txn.meta?.bioskop && <Row style={{padding:"8px 0"}}><span style={{fontSize:12, color:"#6b7280"}}>Lokasi Bioskop</span><span style={{fontSize:13, fontWeight:600}}>{txn.meta.bioskop}</span></Row>}
       </Card>
       {(txn.attachmentMeta||[]).length > 0 && (
         <div style={{marginBottom:14}}>
           <p style={{fontSize:12, fontWeight:700, color:"#9ca3af", marginBottom:8}}>LAMPIRAN</p>
           <div style={{display:"flex", gap:8}}>{txn.attachmentMeta.map(a => <AttachPreview key={a.id} id={a.id} type={a.type} />)}</div>
         </div>
       )}
       <div style={{display:"flex", gap:10, marginTop:16}}>
         <button onClick={()=>{onClose(); onEdit(txn);}} style={{flex:1, padding:"12px", borderRadius:12, border:"none", background:GL, color:G, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", gap:6, cursor:"pointer"}}><Pencil size={14}/> Edit</button>
         <button onClick={()=>{onClose(); onDelete(txn);}} style={{flex:1, padding:"12px", borderRadius:12, border:"none", background:"#fee2e2", color:"#ef4444", fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", gap:6, cursor:"pointer"}}><Trash2 size={14}/> Hapus</button>
       </div>
    </BottomSheet>
  );
}

// ─── IMPORT MODAL ─────────────────────────────────────────────────────────────
function ImportModal({ accounts, onClose, onImport, isPickingFile }) {
  const [st, setSt] = useState("idle"), [preview, setPreview] = useState([]), [err, setErr] = useState("");
  const ref = useRef();
  const parse = async e => {
    isPickingFile.current = false; const file = e.target.files[0]; if (!file) return; setSt("parsing");
    try {
      const buf = await file.arrayBuffer(); const wb = XLSX.read(buf,{type:"array"}); const ws = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(ws,{header:1,defval:""}); if (rows.length < 2) { setErr("File kosong."); setSt("error"); return; }
      const h = rows[0].map(x=>String(x).toLowerCase()); const fc = (...ns) => { for(const n of ns){const i=h.findIndex(x=>x.includes(n));if(i>=0)return i;} return -1; };
      const ai = fc("amount","jumlah","nominal"); if (ai < 0) { setErr("Kolom Amount tidak ditemukan."); setSt("error"); return; }
      const di=fc("date","tanggal"), ni=fc("note","catatan","memo"), ci=fc("category","kategori"), ti=fc("type","jenis");
      const parsed = [];
      for (let i=1; i<Math.min(rows.length,201); i++) {
        const row = rows[i]; if (!row||row.every(c=>c==="")) continue;
        const amt = parseFloat(String(row[ai]).replace(/[^\d.-]/g,"")); if (!amt||isNaN(amt)) continue;
        const rt = ti>=0?String(row[ti]).toLowerCase():""; const isInc = rt.includes("income")||rt.includes("masuk")||rt.includes("pemasukan");
        let pd = todayStr(); if (di>=0&&row[di]){try{const d=new Date(row[di]);if(!isNaN(d))pd=d.toISOString().slice(0,10);}catch{}}
        const rc = ci>=0?String(row[ci]):""; const cat = Object.keys(CAT_BG).find(k=>rc.toLowerCase().includes(k.toLowerCase()))||"Lainnya";
        parsed.push({id:Date.now()+i,type:isInc?"income":"expense",amount:Math.abs(amt),category:cat,note:ni>=0?String(row[ni]):"Import",date:pd,time:"12:00",accountId:accounts[0]?.id,detected:null,attachmentMeta:[]});
      }
      if (!parsed.length){setErr("Tidak ada data valid.");setSt("error");return;}
      setPreview(parsed); setSt("preview");
    } catch(e2){setErr(e2.message);setSt("error");}
  };
  return (
    <BottomSheet onClose={onClose} title="Import Data">
      {st==="idle"&&<div><div style={{background:GL,borderRadius:13,padding:"13px 15px",marginBottom:14,border:`1px solid ${GM}`}}><p style={{margin:"0 0 5px",fontSize:13,fontWeight:700,color:G}}>Format yang Didukung</p><p style={{margin:0,fontSize:12,color:"#374151",lineHeight:1.6}}>Money Manager → Settings → Backup → Export Excel (.xlsx)</p></div><BtnG onClick={()=>{isPickingFile.current=true;ref.current.click();}}>Pilih File Excel</BtnG><input ref={ref} type="file" accept=".xlsx,.xls,.csv" style={{display:"none"}} onChange={parse}/></div>}
      {st==="parsing"&&<div style={{textAlign:"center",padding:"40px 0"}}><div style={{fontSize:36,animation:"spin 1.5s linear infinite",display:"inline-block"}}>⚙️</div><p style={{color:G,marginTop:12}}>Membaca file...</p></div>}
      {st==="error"&&<div style={{textAlign:"center",padding:"20px 0"}}><div style={{color:"#ef4444",display:"flex",justifyContent:"center",marginBottom:12}}><AlertTriangle size={40}/></div><p style={{color:"#ef4444",fontWeight:600,marginBottom:20}}>{err}</p><BtnG onClick={()=>{setSt("idle");setErr("");}}>Coba Lagi</BtnG></div>}
      {st==="preview"&&<div><div style={{background:GL,borderRadius:12,padding:"11px 14px",marginBottom:12,border:`1px solid ${GM}`}}><p style={{margin:0,fontSize:13,fontWeight:700,color:G}}>✓ {preview.length} transaksi ditemukan</p></div><Card style={{padding:"4px 0",marginBottom:12,maxHeight:200,overflowY:"auto"}}>{preview.slice(0,5).map((t,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderBottom:i<4?"1px solid #f8fafc":"none"}}><CatBub cat={t.category} size={36}/><div style={{flex:1,minWidth:0}}><p style={{margin:0,fontSize:12,fontWeight:600,color:"#111",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.note}</p><p style={{margin:0,fontSize:11,color:"#9ca3af"}}>{t.date}</p></div><span style={{fontSize:12,fontWeight:700,color:t.type==="income"?G:"#ef4444",flexShrink:0}}>{t.type==="income"?"+":"-"}{fmtShort(t.amount)}</span></div>)}{preview.length>5&&<p style={{textAlign:"center",color:"#9ca3af",fontSize:11,padding:"8px"}}>...+{preview.length-5} lainnya</p>}</Card><BtnG onClick={()=>{onImport(preview);setSt("done");}}>Import {preview.length} Transaksi</BtnG></div>}
      {st==="done"&&<div style={{textAlign:"center",padding:"30px 0"}}><div style={{color:G,display:"flex",justifyContent:"center",marginBottom:12}}><Check size={52}/></div><p style={{fontSize:16,fontWeight:800,color:"#111",margin:"0 0 6px"}}>Import Berhasil!</p><BtnG onClick={onClose} style={{marginTop:16}}>Selesai</BtnG></div>}
    </BottomSheet>
  );
}

// ─── ACCOUNT DETAIL SCREEN ────────────────────────────────────────────────────
function AccountDetailScreen({ account, transactions, accIdx, onClose, onEditAccount }) {
  const txns   = [...transactions].filter(t=>t.accountId===account.id).sort((a,b)=>new Date(b.date)-new Date(a.date));
  const income  = txns.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);
  const expense = txns.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);
  const grad    = getAccGrad(account, accIdx);
  const appLink = getAppLink(account.name);
  return (
    <div style={{position:"fixed",inset:0,background:BG,zIndex:150,maxWidth:430,margin:"0 auto",overflowY:"auto",paddingBottom:30}}>
      <div style={{background:grad,padding:"calc(env(safe-area-inset-top,0px) + 14px) 16px 24px",position:"relative"}}>
        <button onClick={onClose} style={{position:"absolute",top:"calc(env(safe-area-inset-top,0px) + 14px)",left:16,background:"rgba(255,255,255,0.2)",border:"none",borderRadius:10,width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff"}}><ChevronLeft size={20}/></button>
        <button onClick={onEditAccount} style={{position:"absolute",top:"calc(env(safe-area-inset-top,0px) + 14px)",right:16,background:"rgba(255,255,255,0.2)",border:"none",borderRadius:10,width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff"}}><Pencil size={15}/></button>
        <div style={{textAlign:"center",paddingTop:16}}>
          <div style={{width:54,height:54,borderRadius:16,background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 10px",color:"#fff"}}>
            {account.iconImg ? <img src={account.iconImg} alt="" style={{width:38,height:38,borderRadius:10,objectFit:"cover"}}/> : (() => { const T=ACC_TYPES.find(t=>t.type===account.type); return T?<T.Icon s={24}/>:null; })()}
          </div>
          <p style={{color:"rgba(255,255,255,0.8)",fontSize:12,margin:"0 0 4px"}}>{account.name}</p>
          <p style={{color:"#fff",fontSize:28,fontWeight:800,margin:"0 0 14px"}}>{fmt(account.balance)}</p>
          {appLink && <a href={appLink} style={{display:"inline-flex",alignItems:"center",gap:5,background:"rgba(255,255,255,0.2)",padding:"6px 12px",borderRadius:99,color:"#fff",fontSize:11,fontWeight:700,textDecoration:"none"}}><ExternalLink size={12}/> Buka App</a>}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:16}}>
          {[{l:"Pemasukan",v:income},{l:"Pengeluaran",v:expense}].map(x=>(
            <div key={x.l} style={{background:"rgba(255,255,255,0.15)",borderRadius:12,padding:"10px 14px",textAlign:"center"}}>
              <p style={{color:"rgba(255,255,255,0.7)",fontSize:10,fontWeight:600,margin:"0 0 3px"}}>{x.l}</p>
              <p style={{color:"#fff",fontSize:13,fontWeight:800,margin:0}}>{fmtShort(x.v)}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{padding:"16px 16px 0"}}>
        <p style={{margin:"0 0 10px",fontSize:14,fontWeight:700,color:"#111"}}>Riwayat Transaksi</p>
        <Card style={{padding:"4px 0"}}>
          {txns.length===0&&<p style={{textAlign:"center",color:"#9ca3af",padding:"24px",fontSize:13}}>Belum ada transaksi</p>}
          {txns.map((t,i)=>(
            <div key={t.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderBottom:i<txns.length-1?"1px solid #f8fafc":"none"}}>
              <CatBub cat={t.category} size={40}/>
              <div style={{flex:1,minWidth:0}}>
                <p style={{margin:0,fontSize:13,fontWeight:600,color:"#111",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.note||"Transaksi"}</p>
                <p style={{margin:"2px 0 0",fontSize:11,color:"#9ca3af"}}>{t.date}</p>
              </div>
              <span style={{fontSize:13,fontWeight:800,color:t.type==="income"?G:"#ef4444",whiteSpace:"nowrap"}}>{t.type==="income"?"+":"-"}Rp {t.amount.toLocaleString("id-ID")}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ─── HOME SCREEN ──────────────────────────────────────────────────────────────
function HomeScreen({ accounts, transactions, monthlyBudget, setMonthlyBudget, targetTabungan, setTargetTabungan, userName, userAvatar, setTab, setTxnFilter, setSelectedAcc, hidden, setHidden, onViewTxn }) {
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const totalBalance = accounts.reduce((s,a)=>s+a.balance,0);
  const totalIncome  = transactions.filter(t=>t.type==="income" && t.date >= startOfMonth()).reduce((s,t)=>s+t.amount,0);
  const totalExpense = transactions.filter(t=>t.type==="expense" && t.date >= startOfMonth()).reduce((s,t)=>s+t.amount,0);
  const budgetLeft   = monthlyBudget - totalExpense;
  const budgetPct    = Math.min(100,Math.round(totalExpense/Math.max(monthlyBudget,1)*100));
  const dLeft        = daysLeftMonth();
  const show = v => hidden ? mask(v) : fmt(v);
  const recent = [...transactions].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,4);

  // Predictor logic
  const daysPassed = new Date().getDate();
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth()+1, 0).getDate();
  const avgDailyExp = daysPassed > 0 ? totalExpense / daysPassed : 0;
  const estEndBal = Math.max(0, totalBalance - (avgDailyExp * dLeft));
  const estZeroDays = avgDailyExp > 0 ? Math.floor(totalBalance / avgDailyExp) : "999+";

  return (
    <div style={{padding:"0 16px 16px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {userAvatar ? <img src={userAvatar} alt="" style={{width:42,height:42,borderRadius:12,objectFit:"cover"}}/> : <div style={{width:42,height:42,borderRadius:12,background:`linear-gradient(135deg,${G},${G2})`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff"}}><UserCircle size={22}/></div>}
          <div><p style={{margin:0,fontSize:11,color:"#9ca3af"}}>{greeting()},</p><p style={{margin:0,fontSize:15,fontWeight:800,color:"#111"}}>{userName}</p></div>
        </div>
        <div style={{background:"#fff", borderRadius:12, padding:"8px 12px", boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
          <span style={{fontSize:11, fontWeight:700, color:"#64748b"}}>{getCurrentDateTopStr()}</span>
        </div>
      </div>

      <div style={{background:`linear-gradient(145deg,${G},${G2})`,borderRadius:22,padding:"22px 20px",marginBottom:12,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-40,right:-40,width:140,height:140,borderRadius:"50%",background:"rgba(255,255,255,0.07)"}}/>
        <div style={{display:"flex", alignItems:"center", gap:8, marginBottom:6}}>
          <p style={{color:"rgba(255,255,255,0.75)",fontSize:12,margin:0}}>Total Balance</p>
          <button onClick={()=>setHidden(p=>!p)} style={{background:"none",border:"none",color:"#fff",cursor:"pointer",display:"flex",padding:0,opacity:0.8}}>{hidden?<EyeOff size={14}/>:<Eye size={14}/>}</button>
        </div>
        <p style={{color:"#fff",fontSize:28,fontWeight:800,margin:"0 0 18px",letterSpacing:-0.5}}>{show(totalBalance)}</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[{l:"Income",v:totalIncome,I:ArrowDownLeft,fn:()=>{setTxnFilter("income");setTab("transactions");}},{l:"Expense",v:totalExpense,I:ArrowUpRight,fn:()=>{setTxnFilter("expense");setTab("transactions");}}].map(x=>(
            <button key={x.l} onClick={x.fn} style={{background:"rgba(255,255,255,0.15)",borderRadius:14,padding:"11px 13px",border:"none",cursor:"pointer",textAlign:"left"}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}><div style={{width:20,height:20,borderRadius:6,background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff"}}><x.I size={11}/></div><span style={{color:"rgba(255,255,255,0.8)",fontSize:11}}>{x.l}</span></div>
              <p style={{color:"#fff",fontSize:14,fontWeight:800,margin:0}}>{hidden?mask(x.v):fmtShort(x.v)}</p>
            </button>
          ))}
        </div>
      </div>

      <div style={{display:"flex", gap:12, overflowX:"auto", paddingBottom:10, scrollbarWidth:"none", snapType:"x mandatory"}}>
        {/* Budget Card */}
        <div style={{minWidth:"85%", scrollSnapAlign:"start"}}>
          <Card style={{height:"100%"}}>
            <Row style={{marginBottom:12}}>
              <p style={{margin:0,fontSize:14,fontWeight:800,color:"#111"}}>Monthly Budget</p>
              <button onClick={()=>setShowBudgetModal(true)} style={{background:"none",border:"none",color:G,fontSize:13,fontWeight:700,cursor:"pointer"}}>Edit</button>
            </Row>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <div style={{position:"relative",width:64,height:64,flexShrink:0}}>
                <svg width="64" height="64" style={{transform:"rotate(-90deg)"}}>
                  <circle cx="32" cy="32" r="24" fill="none" stroke="#f1f5f9" strokeWidth="8"/>
                  <circle cx="32" cy="32" r="24" fill="none" stroke={budgetPct>=90?"#ef4444":budgetPct>=70?"#f59e0b":G} strokeWidth="8" strokeDasharray={`${2*Math.PI*24*(budgetPct/100)} ${2*Math.PI*24}`} strokeLinecap="round"/>
                </svg>
                <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:11,fontWeight:800,color:"#111"}}>{budgetPct}%</span></div>
              </div>
              <div style={{flex:1}}>
                <Row style={{marginBottom:4}}><span style={{fontSize:12,color:"#9ca3af"}}>Terpakai</span><span style={{fontSize:12,fontWeight:700,color:"#111"}}>{show(totalExpense)}</span></Row>
                <Row style={{marginBottom:8}}><span style={{fontSize:12,color:"#9ca3af"}}>Limit</span><span style={{fontSize:12,fontWeight:700,color:"#111"}}>{show(monthlyBudget)}</span></Row>
                <p style={{margin:0,fontSize:11,fontWeight:600,color:budgetLeft<=0?"#ef4444":G}}>{budgetLeft<=0?"⚠️ Budget habis!":`${hidden?mask(Math.max(0,Math.floor(budgetLeft/dLeft))):fmt(Math.max(0,Math.floor(budgetLeft/dLeft)))} / hari`}</p>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Predictor Card */}
        <div style={{minWidth:"85%", scrollSnapAlign:"start"}}>
           <Card style={{height:"100%"}}>
             <Row style={{marginBottom:10}}>
                <p style={{margin:0,fontSize:14,fontWeight:800,color:"#111"}}>Budget Predictor</p>
                <TrendingUp size={16} color={G}/>
             </Row>
             <p style={{fontSize:11, color:"#6b7280", margin:"0 0 8px", lineHeight:1.4}}>Berdasarkan pengeluaran harian {fmtShort(avgDailyExp)}, di akhir bulan saldo sisa:</p>
             <p style={{fontSize:20, fontWeight:800, color:estEndBal>0?G:"#ef4444", margin:"0 0 10px"}}>{show(estEndBal)}</p>
             <p style={{fontSize:11, color:"#9ca3af", margin:0}}>Asumsi 0 income, uang akan habis dalam <b style={{color:"#111"}}>{estZeroDays} hari</b>.</p>
           </Card>
        </div>
      </div>

      <Row style={{marginBottom:10}}><p style={{margin:0,fontSize:14,fontWeight:800,color:"#111"}}>Akun Saya</p><button onClick={()=>setTab("accounts")} style={{background:"none",border:"none",color:G,fontSize:12,fontWeight:700,cursor:"pointer"}}>Lihat semua</button></Row>
      <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:6,scrollbarWidth:"none"}}>
        {accounts.length===0 && <div style={{background:"#fff",borderRadius:16,padding:"14px 20px",minWidth:160,color:"#9ca3af",fontSize:12}}>Belum ada akun</div>}
        {accounts.map((acc,i)=>{
          const T=ACC_TYPES.find(t=>t.type===acc.type);
          return (
            <button key={acc.id} onClick={()=>setSelectedAcc({acc,idx:i})} style={{background:getAccGrad(acc,i),borderRadius:16,padding:"14px",minWidth:155,flexShrink:0,border:"none",cursor:"pointer",textAlign:"left",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:-15,right:-15,width:50,height:50,borderRadius:"50%",background:"rgba(255,255,255,0.1)"}}/>
              <Row style={{marginBottom:10}}>
                <p style={{margin:0,fontSize:11,color:"rgba(255,255,255,0.9)",fontWeight:600,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{acc.name}</p>
                <div style={{color:"rgba(255,255,255,0.7)",flexShrink:0}}>{T&&<T.Icon s={15}/>}</div>
              </Row>
              <p style={{color:"#fff",fontSize:16,fontWeight:800,margin:"0 0 5px"}}>{hidden?mask(acc.balance):fmtShort(acc.balance)}</p>
              <p style={{color:"rgba(255,255,255,0.6)",fontSize:10,margin:0,letterSpacing:2}}>{acc.last4?`•••• ${acc.last4}`:T?.label||""}</p>
            </button>
          );
        })}
      </div>

      <Row style={{margin:"14px 0 10px"}}><p style={{margin:0,fontSize:14,fontWeight:800,color:"#111"}}>Transaksi Terbaru</p><button onClick={()=>setTab("transactions")} style={{background:"none",border:"none",color:G,fontSize:12,fontWeight:700,cursor:"pointer"}}>Lihat semua</button></Row>
      <Card style={{padding:"4px 0"}}>
        {recent.length===0&&<p style={{color:"#9ca3af",textAlign:"center",padding:"20px",fontSize:13}}>Belum ada transaksi</p>}
        {recent.map((t,i)=>{
          const acc=accounts.find(a=>a.id===t.accountId);
          return (
            <div key={t.id} onClick={()=>onViewTxn(t)} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderBottom:i<recent.length-1?"1px solid #f8fafc":"none", cursor:"pointer"}}>
              <CatBub cat={t.category}/>
              <div style={{flex:1,minWidth:0}}>
                <p style={{margin:0,fontSize:13,fontWeight:600,color:"#111",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.note||"Transaksi"}</p>
                <p style={{margin:"2px 0 0",fontSize:11,color:"#9ca3af"}}>{t.date}</p>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <p style={{margin:0,fontSize:13,fontWeight:800,color:t.type==="income"?G:"#ef4444"}}>{t.type==="income"?"+":"-"}Rp {hidden?"•••••":t.amount.toLocaleString("id-ID")}</p>
                <p style={{margin:"2px 0 0",fontSize:10,color:"#9ca3af"}}>{acc?.name||""}</p>
              </div>
            </div>
          );
        })}
      </Card>
      {showBudgetModal && <BudgetModal totalBalance={totalBalance} currentBudget={monthlyBudget} targetTabungan={targetTabungan} setTargetTabungan={setTargetTabungan} onApply={v=>{setMonthlyBudget(v);setShowBudgetModal(false);}} onClose={()=>setShowBudgetModal(false)}/>}
    </div>
  );
}

// ─── TRANSACTIONS SCREEN ──────────────────────────────────────────────────────
function TransactionsScreen({ transactions, accounts, onViewTxn, initialTypeFilter, onFilterConsumed, searchOpen, onSearchClose }) {
  const [typeF,   setTypeF]   = useState(initialTypeFilter||"all");
  const [dateF,   setDateF]   = useState("month");
  const [from,    setFrom]    = useState("");
  const [to,      setTo]      = useState(todayStr());
  const [search,  setSearch]  = useState("");
  const searchRef = useRef();

  useEffect(()=>{ if(initialTypeFilter){setTypeF(initialTypeFilter);onFilterConsumed&&onFilterConsumed();} },[initialTypeFilter]);
  useEffect(()=>{ if(searchOpen && searchRef.current) searchRef.current.focus(); },[searchOpen]);

  const filtered = useMemo(()=>{
    let arr = [...transactions].sort((a,b)=>new Date(b.date)-new Date(a.date));
    if (typeF!=="all") arr=arr.filter(t=>t.type===typeF);
    if (dateF==="today") arr=arr.filter(t=>t.date===todayStr());
    else if (dateF==="week") arr=arr.filter(t=>t.date>=startOfWeek());
    else if (dateF==="month") arr=arr.filter(t=>t.date>=startOfMonth());
    else if (dateF==="custom"&&from) arr=arr.filter(t=>t.date>=from&&t.date<=to);
    if (search.trim()) { const q=search.toLowerCase(); arr=arr.filter(t=>t.note?.toLowerCase().includes(q)||t.category?.toLowerCase().includes(q)||accounts.find(a=>a.id===t.accountId)?.name.toLowerCase().includes(q)); }
    return arr;
  },[transactions,typeF,dateF,from,to,search]);

  const totalInc = filtered.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);
  const totalExp = filtered.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);
  const net = totalInc - totalExp;
  const grouped = useMemo(()=>{
    const m=new Map(); filtered.forEach(t=>{if(!m.has(t.date))m.set(t.date,[]);m.get(t.date).push(t);});
    return Array.from(m.entries()).sort((a,b)=>new Date(b[0])-new Date(a[0]));
  },[filtered]);

  const FP = ({label,active,onClick,col=G}) => <button onClick={onClick} style={{padding:"7px 14px",borderRadius:99,border:`1.5px solid ${active?col:"#e5e7eb"}`,background:active?col:"#fff",color:active?"#fff":"#6b7280",fontSize:12,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>{label}</button>;

  return (
    <div style={{padding:"0 16px 16px"}}>
      {(searchOpen||search) && (
        <div style={{display:"flex",alignItems:"center",gap:8,background:"#fff",borderRadius:14,padding:"10px 14px",marginBottom:10,boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
          <Search size={16} color="#9ca3af"/>
          <input ref={searchRef} value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari transaksi..." style={{flex:1,border:"none",outline:"none",fontSize:14,color:"#111",background:"transparent"}}/>
          <button onClick={()=>{setSearch("");onSearchClose&&onSearchClose();}} style={{background:"none",border:"none",cursor:"pointer",color:"#9ca3af",display:"flex"}}><X size={16}/></button>
        </div>
      )}
      <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4,marginBottom:8,scrollbarWidth:"none"}}>
        <FP label="Semua" active={typeF==="all"} onClick={()=>setTypeF("all")}/>
        <FP label="Pengeluaran" active={typeF==="expense"} onClick={()=>setTypeF("expense")} col="#ef4444"/>
        <FP label="Pemasukan" active={typeF==="income"} onClick={()=>setTypeF("income")} col={G}/>
      </div>
      <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:8,marginBottom:10,scrollbarWidth:"none"}}>
        {[{id:"month",l:"Bulan Ini"},{id:"today",l:"Hari Ini"},{id:"week",l:"Minggu Ini"},{id:"custom",l:"Custom"}].map(f=><FP key={f.id} label={f.l} active={dateF===f.id} onClick={()=>setDateF(f.id)}/>)}
      </div>
      {dateF==="custom"&&<Card style={{marginBottom:10}}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}><div><p style={{margin:"0 0 4px",fontSize:10,color:"#9ca3af",fontWeight:700}}>DARI</p><input type="date" value={from} onChange={e=>setFrom(e.target.value)} style={{border:"none",outline:"none",fontSize:12,fontWeight:600,color:"#111",background:"transparent",width:"100%"}}/></div><div><p style={{margin:"0 0 4px",fontSize:10,color:"#9ca3af",fontWeight:700}}>SAMPAI</p><input type="date" value={to} onChange={e=>setTo(e.target.value)} style={{border:"none",outline:"none",fontSize:12,fontWeight:600,color:"#111",background:"transparent",width:"100%"}}/></div></div></Card>}

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
          <p style={{fontSize:10,fontWeight:700,color:"#9ca3af",letterSpacing:1,margin:"0 0 8px 2px"}}>{labelDate(date)}</p>
          <Card style={{padding:"4px 0",marginBottom:12}}>
            {txns.map((t,i)=>{
              const acc=accounts.find(a=>a.id===t.accountId);
              return (
                <div key={t.id} onClick={()=>onViewTxn(t)} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 14px",borderBottom:i<txns.length-1?"1px solid #f8fafc":"none", cursor:"pointer"}}>
                  <CatBub cat={t.category} size={40}/>
                  <div style={{flex:1,minWidth:0}}>
                    <p style={{margin:0,fontSize:13,fontWeight:600,color:"#111",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.note||"Transaksi"}</p>
                    <div style={{display:"flex",alignItems:"center",gap:5,marginTop:2}}>
                      <span style={{background:"#f1f5f9",color:"#6b7280",fontSize:9,fontWeight:600,padding:"2px 6px",borderRadius:99}}>{acc?.name||"?"}</span>
                      {t.detected&&<span style={{background:GL,color:G,fontSize:9,fontWeight:700,padding:"2px 6px",borderRadius:99}}>auto</span>}
                      {(t.attachmentMeta||[]).length>0&&<Receipt size={10} color="#9ca3af"/>}
                    </div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <p style={{margin:0,fontSize:13,fontWeight:800,color:t.type==="income"?G:"#ef4444"}}>{t.type==="income"?"+":"-"}Rp {t.amount.toLocaleString("id-ID")}</p>
                    <p style={{margin:"2px 0 0",fontSize:10,color:"#9ca3af"}}>{t.time||"12:00"}</p>
                  </div>
                </div>
              );
            })}
          </Card>
        </div>
      ))}
    </div>
  );
}

// ─── ACCOUNTS SCREEN ──────────────────────────────────────────────────────────
function AccountsScreen({ accounts, setAccounts, transactions, setSelectedAcc }) {
  const [editAcc, setEditAcc] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [delConfirm, setDelConfirm] = useState(null);
  const total = accounts.reduce((s,a)=>s+a.balance,0);

  // Smooth reorder via View Transitions
  const reorder = (arr) => {
    if (document.startViewTransition) document.startViewTransition(() => setAccounts(arr));
    else setAccounts(arr);
  };
  const moveUp   = i => { if(i===0)return; const a=[...accounts]; [a[i-1],a[i]]=[a[i],a[i-1]]; reorder(a); };
  const moveDown = i => { if(i===accounts.length-1)return; const a=[...accounts]; [a[i],a[i+1]]=[a[i+1],a[i]]; reorder(a); };

  return (
    <div style={{padding:"0 16px 16px"}}>
      <div style={{background:`linear-gradient(145deg,${G},${G2})`,borderRadius:22,padding:"20px 22px",marginBottom:14}}>
        <p style={{color:"rgba(255,255,255,0.75)",fontSize:12,margin:"0 0 4px"}}>Total Semua Akun</p>
        <p style={{color:"#fff",fontSize:26,fontWeight:800,margin:0}}>{fmt(total)}</p>
      </div>
      <Row style={{marginBottom:10}}>
        <p style={{margin:0,fontSize:14,fontWeight:800,color:"#111"}}>Daftar Akun</p>
        <button onClick={()=>setShowAdd(true)} style={{background:GL,border:"none",borderRadius:10,padding:"7px 14px",color:G,fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:5}}><Plus size={14}/> Tambah</button>
      </Row>
      {accounts.length===0&&<Card style={{textAlign:"center",padding:"24px"}}><p style={{color:"#9ca3af",fontSize:13}}>Belum ada akun. Tambah sekarang!</p></Card>}
      <div style={{display:"flex", flexDirection:"column", gap:10}}>
        {accounts.map((acc,i)=>{
          const T=ACC_TYPES.find(t=>t.type===acc.type);
          return (
            <div key={acc.id} style={{background:"#fff",borderRadius:18,boxShadow:"0 2px 12px rgba(0,0,0,0.05)",overflow:"hidden", viewTransitionName:`acc-${acc.id}`}}>
              <button onClick={()=>setSelectedAcc({acc,idx:i})} style={{background:getAccGrad(acc,i),padding:"14px 16px",display:"flex",alignItems:"center",gap:12,width:"100%",border:"none",cursor:"pointer",outline:"none"}}>
                <div style={{width:40,height:40,borderRadius:12,background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",flexShrink:0}}>
                  {acc.iconImg?<img src={acc.iconImg} alt="" style={{width:28,height:28,borderRadius:8,objectFit:"cover"}}/>:T&&<T.Icon s={20}/>}
                </div>
                <div style={{flex:1,textAlign:"left"}}>
                  <p style={{margin:0,fontSize:14,fontWeight:700,color:"#fff"}}>{acc.name}</p>
                  <p style={{margin:"2px 0 0",fontSize:11,color:"rgba(255,255,255,0.7)"}}>{acc.last4?`•••• ${acc.last4}`:T?.label}</p>
                </div>
                <p style={{margin:0,fontSize:15,fontWeight:800,color:"#fff"}}>{fmtShort(acc.balance)}</p>
              </button>
              <div style={{display:"flex",borderTop:"1px solid #f1f5f9"}}>
                <button onClick={()=>moveUp(i)} style={{flex:1,padding:"10px",background:"#fff",border:"none",borderRight:"1px solid #f1f5f9",color:"#9ca3af",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><ArrowUp size={14}/></button>
                <button onClick={()=>moveDown(i)} style={{flex:1,padding:"10px",background:"#fff",border:"none",borderRight:"1px solid #f1f5f9",color:"#9ca3af",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><ArrowDown size={14}/></button>
                <button onClick={()=>setEditAcc({acc,idx:i})} style={{flex:1,padding:"10px",background:"#fff",border:"none",borderRight:"1px solid #f1f5f9",color:G,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5,fontSize:12,fontWeight:600}}><Pencil size={13}/> Edit</button>
                <button onClick={()=>setDelConfirm({acc,txnCount:transactions.filter(t=>t.accountId===acc.id).length})} style={{flex:1,padding:"10px",background:"#fff",border:"none",color:"#ef4444",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5,fontSize:12,fontWeight:600}}><Trash2 size={13}/> Hapus</button>
              </div>
            </div>
          );
        })}
      </div>
      {editAcc&&<AccountModal initial={editAcc.acc} onClose={()=>setEditAcc(null)} isNew={false} onSave={(u, diff)=>{
         setAccounts(p=>p.map(a=>a.id===u.id?{...a,...u}:a)); setEditAcc(null);
         if (diff !== 0) {
            // Trigger auto-txn untuk penyesuaian saldo
         }
      }}/>}
      {showAdd&&<AccountModal isNew onClose={()=>setShowAdd(false)} onSave={(a, diff)=>{setAccounts(p=>[...p,{...a,id:Date.now(),balance:a.balance||0}]);setShowAdd(false);}}/>}
      {delConfirm&&<ConfirmDialog title="Hapus Akun?" sub={`Akun "${delConfirm.acc.name}" dan ${delConfirm.txnCount} transaksi terkait akan dihapus permanen.`} onConfirm={()=>{setAccounts(p=>p.filter(a=>a.id!==delConfirm.acc.id));setDelConfirm(null);}} onCancel={()=>setDelConfirm(null)}/>}
    </div>
  );
}

// ─── CHARTS SCREEN ────────────────────────────────────────────────────────────
function ChartsScreen({ transactions }) {
  const totalInc = transactions.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);
  const totalExp = transactions.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);
  const pieData  = useMemo(()=>{const m={};transactions.filter(t=>t.type==="expense").forEach(t=>{m[t.category]=(m[t.category]||0)+t.amount;});return Object.entries(m).sort((a,b)=>b[1]-a[1]).map(([name,value])=>({name,value,color:CAT_COLORS[name]||"#9ca3af",pct:Math.round(value/totalExp*100)}));},[transactions,totalExp]);
  const barData  = useMemo(()=>{const w={"Mg 1":{income:0,expense:0},"Mg 2":{income:0,expense:0},"Mg 3":{income:0,expense:0},"Mg 4":{income:0,expense:0}};transactions.forEach(t=>{const d=new Date(t.date).getDate();const k=d<=7?"Mg 1":d<=14?"Mg 2":d<=21?"Mg 3":"Mg 4";w[k][t.type]+=t.amount;});return Object.entries(w).map(([name,v])=>({name,...v}));},[transactions]);
  return (
    <div style={{padding:"0 16px 16px"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
        {[{l:"Pemasukan",v:totalInc,I:<TrendingUp size={17} strokeWidth={1.7}/>,bg:"#e8faf0",col:G},{l:"Pengeluaran",v:totalExp,I:<BarChart2 size={17} strokeWidth={1.7}/>,bg:"#fef2f2",col:"#ef4444"}].map(x=>(
          <Card key={x.l} style={{marginBottom:0}}>
            <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:8}}><div style={{width:30,height:30,borderRadius:9,background:x.bg,display:"flex",alignItems:"center",justifyContent:"center",color:x.col}}>{x.I}</div><span style={{fontSize:12,color:"#6b7280"}}>{x.l}</span></div>
            <p style={{margin:0,fontSize:16,fontWeight:800,color:"#111"}}>{fmtShort(x.v)}</p>
          </Card>
        ))}
      </div>
      <Card>
        <p style={{margin:"0 0 10px",fontSize:14,fontWeight:800,color:"#111"}}>Pengeluaran per Kategori</p>
        <div style={{position:"relative",userSelect:"none",WebkitUserSelect:"none"}}>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart style={{outline:"none"}} onClick={()=>{}}>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={90} innerRadius={55} paddingAngle={2} dataKey="value" style={{outline:"none"}} stroke="none">{pieData.map((e,i)=><Cell key={i} fill={e.color} style={{outline:"none"}} stroke="none"/>)}</Pie>
              <Tooltip contentStyle={{background:"#fff",border:"1px solid #f1f5f9",borderRadius:12,fontSize:12,boxShadow:"0 4px 16px rgba(0,0,0,0.08)"}} formatter={v=>[fmt(v),""]}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center",pointerEvents:"none"}}><p style={{margin:0,fontSize:10,color:"#9ca3af"}}>Total</p><p style={{margin:0,fontSize:14,fontWeight:800,color:"#111"}}>{fmtShort(totalExp)}</p></div>
        </div>
        <div style={{marginTop:8}}>
          {pieData.slice(0,6).map((p,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:i<Math.min(pieData.length,6)-1?"1px solid #f8fafc":"none"}}>
              <div style={{width:34,height:34,borderRadius:10,background:CAT_BG[p.name]||"#f3f4f6",display:"flex",alignItems:"center",justifyContent:"center",color:CAT_COLORS[p.name]||"#9ca3af",flexShrink:0}}>{CAT_ICON(p.name,15)}</div>
              <div style={{flex:1}}><p style={{margin:0,fontSize:12,fontWeight:700,color:"#111"}}>{p.name}</p><p style={{margin:"1px 0 0",fontSize:10,color:"#9ca3af"}}>{p.pct}%</p></div>
              <p style={{margin:0,fontSize:12,fontWeight:700,color:"#111"}}>{fmtShort(p.value)}</p>
            </div>
          ))}
        </div>
      </Card>
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
    </div>
  );
}

// ─── PROFILE SCREEN ───────────────────────────────────────────────────────────
function ProfileScreen({ userName, setUserName, userAvatar, setUserAvatar, transactions, accounts, monthlyBudget, setMonthlyBudget, pinEnabled, pinHash, setPinEnabled, setPinHash, soundEnabled, setSoundEnabled, setTransactions, setAccounts, setShowImport }) {
  const [showSetPin, setShowSetPin]   = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [editName, setEditName]       = useState(false);
  const [nameInput, setNameInput]     = useState(userName);
  const avatarRef = useRef();
  const handleAvatar = e => { const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>setUserAvatar(r.result);r.readAsDataURL(f); };
  const exportCSV = () => {
    const rows=[["Tanggal","Waktu","Jenis","Jumlah","Kategori","Catatan","Akun"],...transactions.map(t=>[t.date,t.time||"12:00",t.type==="income"?"Pemasukan":"Pengeluaran",t.amount,t.category,t.note,accounts.find(a=>a.id===t.accountId)?.name||""])];
    const csv=rows.map(r=>r.map(c=>JSON.stringify(String(c))).join(",")).join("\n");
    const a=document.createElement("a");a.href="data:text/csv;charset=utf-8,"+encodeURIComponent(csv);a.download="DompetKu_export.csv";a.click();
  };
  return (
    <div style={{padding:"0 16px 16px"}}>
      <Card style={{textAlign:"center",padding:"24px 16px"}}>
        <div style={{position:"relative",width:72,height:72,margin:"0 auto 12px"}}>
          {userAvatar?<img src={userAvatar} alt="" style={{width:72,height:72,borderRadius:22,objectFit:"cover"}}/>:<div style={{width:72,height:72,borderRadius:22,background:`linear-gradient(135deg,${G},${G2})`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff"}}><UserCircle size={36} strokeWidth={1.2}/></div>}
          <button onClick={()=>avatarRef.current.click()} style={{position:"absolute",bottom:-4,right:-4,width:26,height:26,borderRadius:8,background:G,border:"2px solid #fff",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff"}}><Camera size={12}/></button>
          <input ref={avatarRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleAvatar}/>
        </div>
        {editName?<div style={{display:"flex",gap:8,justifyContent:"center",alignItems:"center"}}><input value={nameInput} onChange={e=>setNameInput(e.target.value)} style={{border:`1.5px solid ${G}`,borderRadius:10,padding:"6px 12px",fontSize:14,fontWeight:700,outline:"none",textAlign:"center"}}/><button onClick={()=>{setUserName(nameInput);setEditName(false);}} style={{background:G,border:"none",borderRadius:9,width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff"}}><Check size={14}/></button></div>:<div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:8}}><p style={{margin:0,fontSize:16,fontWeight:800,color:"#111"}}>{userName}</p><button onClick={()=>setEditName(true)} style={{background:"none",border:"none",color:"#9ca3af",cursor:"pointer"}}><Pencil size={14}/></button></div>}
        <p style={{margin:"4px 0 0",fontSize:12,color:"#9ca3af"}}>{transactions.length} transaksi · {accounts.length} akun</p>
      </Card>
      <Card style={{padding:"4px 0",marginBottom:12}}>
        <p style={{padding:"10px 16px 4px",margin:0,fontSize:10,fontWeight:700,color:"#9ca3af",letterSpacing:1}}>KEAMANAN</p>
        <SRow icon={<Lock size={15} strokeWidth={1.7}/>} title="Kunci PIN" sub={pinEnabled?"Aktif — app terkunci saat keluar background":"Nonaktif"} right={<Tog on={pinEnabled} onToggle={()=>pinEnabled?setPinEnabled(false):setShowSetPin(true)}/>}/>
        {pinEnabled&&<SRow icon={<Shield size={15} strokeWidth={1.7}/>} title="Ganti PIN" right={<button onClick={()=>setShowSetPin(true)} style={{background:GL,border:"none",borderRadius:9,padding:"6px 12px",color:G,fontSize:12,fontWeight:600,cursor:"pointer"}}>Ubah</button>}/>}
      </Card>
      <Card style={{padding:"4px 0",marginBottom:12}}>
        <p style={{padding:"10px 16px 4px",margin:0,fontSize:10,fontWeight:700,color:"#9ca3af",letterSpacing:1}}>PREFERENSI</p>
        <SRow icon={soundEnabled?<Volume2 size={15}/>:<VolumeX size={15}/>} title="Efek Suara" sub="Suara saat mencatat transaksi" right={<Tog on={soundEnabled} onToggle={()=>setSoundEnabled(p=>!p)}/>}/>
      </Card>
      <Card style={{padding:"4px 0",marginBottom:12}}>
        <p style={{padding:"10px 16px 4px",margin:0,fontSize:10,fontWeight:700,color:"#9ca3af",letterSpacing:1}}>DATA</p>
        <SRow icon={<Upload size={15}/>} title="Import Data" sub="Excel dari Money Manager" right={<button onClick={()=>setShowImport(true)} style={{background:GL,border:"none",borderRadius:9,padding:"6px 12px",color:G,fontSize:12,fontWeight:600,cursor:"pointer"}}>Import</button>}/>
        <SRow icon={<Download size={15}/>} title="Export CSV" sub={`${transactions.length} transaksi`} right={<button onClick={exportCSV} style={{background:GL,border:"none",borderRadius:9,padding:"6px 12px",color:G,fontSize:12,fontWeight:600,cursor:"pointer"}}>Export</button>}/>
        <SRow icon={<Trash2 size={15}/>} bg="#fef2f2" title="Hapus Semua Data" danger right={<button onClick={()=>setShowConfirm(true)} style={{background:"#fef2f2",border:"none",borderRadius:9,padding:"6px 12px",color:"#ef4444",fontSize:12,fontWeight:600,cursor:"pointer"}}>Hapus</button>}/>
      </Card>
      <Card style={{padding:"4px 0"}}>
        <p style={{padding:"10px 16px 4px",margin:0,fontSize:10,fontWeight:700,color:"#9ca3af",letterSpacing:1}}>TENTANG</p>
        <SRow icon={<Star size={15}/>} title="DompetKu" sub="Versi 6.1 — Personal Finance Tracker"/>
      </Card>
      {showSetPin&&<PinScreen mode="set" savedHash={pinHash} onSetPin={h=>{setPinHash(h);setPinEnabled(true);setShowSetPin(false);}} onCancel={()=>setShowSetPin(false)}/>}
      {showConfirm&&<ConfirmDialog title="Hapus Semua Data?" sub="Semua transaksi, akun, dan pengaturan akan dihapus. Tidak bisa dibatalkan." onConfirm={()=>{setTransactions([]);setAccounts([]);setShowConfirm(false);}} onCancel={()=>setShowConfirm(false)}/>}
    </div>
  );
}

// ─── FAN NAV ──────────────────────────────────────────────────────────────────
const FAN_ITEMS = [
  { id:"transactions", label:"Transaksi", Ic:<List size={22} strokeWidth={1.7}/>,     dx:-80, dy:-65 },
  { id:"accounts",     label:"Akun",      Ic:<CreditCard size={22} strokeWidth={1.7}/>,dx:0,   dy:-120 },
  { id:"charts",       label:"Grafik",    Ic:<BarChart2 size={22} strokeWidth={1.7}/>, dx:80,  dy:-65 },
];
function FanNav({ tab, setTab, onAddTxn }) {
  const [open, setOpen] = useState(false);
  const navTo = id => { setTab(id); setOpen(false); };
  
  return (
    <>
      {open && <div style={{position:"fixed",inset:0,zIndex:49,background:"rgba(255,255,255,0.7)",backdropFilter:"blur(2px)"}} onClick={()=>setOpen(false)}/>}
      
      <style>{`
        .fan-item { position:absolute; left:50%; top:50%; width:56px; height:56px; border-radius:50%; background:#fff; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow:0 4px 16px rgba(0,0,0,0.1); transition:all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); opacity:0; transform:translate(-50%, -50%) scale(0); pointer-events:none; z-index:51; border:2px solid #e5e7eb; cursor:pointer;}
        .fan-item.open { opacity:1; pointer-events:auto; }
        .fan-item.active { background:${G}; border-color:${G}; color:#fff; }
        .fan-item.active span { color:#fff!important; }
      `}</style>

      {/* Main Nav Container */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:"#fff",borderTop:"1px solid #f1f5f9",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 40px calc(env(safe-area-inset-bottom,0px) + 8px)",zIndex:50,boxShadow:"0 -2px 16px rgba(0,0,0,0.04)"}}>
        
        {/* BERANDA */}
        <button onClick={()=>{setTab("home");setOpen(false);}} style={{background:"none",border:"none",display:"flex",flexDirection:"column",alignItems:"center",gap:4,cursor:"pointer",padding:"4px 0"}}>
          <div style={{color:tab==="home"?G:"#9ca3af"}}><Home size={22} strokeWidth={2}/></div>
          <span style={{fontSize:10,fontWeight:tab==="home"?800:600,color:tab==="home"?G:"#9ca3af"}}>Beranda</span>
        </button>

        {/* CENTER WRAPPER */}
        <div style={{position:"relative", width:64, height:64, display:"flex", justifyContent:"center"}}>
           {/* Arc Items */}
           {FAN_ITEMS.map((item)=>(
              <button key={item.id} onClick={()=>navTo(item.id)} className={`fan-item ${open?'open':''} ${tab===item.id?'active':''}`} style={{transform:open?`translate(calc(-50% + ${item.dx}px), calc(-50% + ${item.dy}px)) scale(1)`:`translate(-50%, -50%) scale(0)`, color:G}}>
                 {item.Ic}
                 <span style={{fontSize:8,fontWeight:700,color:G,lineHeight:1.2,marginTop:2}}>{item.label}</span>
              </button>
           ))}
           {/* Add Txn Center Top (+) */}
           <button onClick={()=>{onAddTxn(); setOpen(false);}} className={`fan-item ${open?'open':''}`} style={{transform:open?`translate(-50%, calc(-50% - 65px)) scale(1)`:`translate(-50%, -50%) scale(0)`, background:G, border:"none", color:"#fff", boxShadow:`0 6px 16px ${G}55`}}>
              <Plus size={26} strokeWidth={2.5}/>
              <span style={{fontSize:8,fontWeight:800,color:"#fff"}}>Catat</span>
           </button>

           {/* Main Center Trigger */}
           <button onClick={()=>setOpen(!open)} style={{position:"absolute",left:"50%",transform:"translateX(-50%) translateY(-20px)",width:64,height:64,borderRadius:"50%",background:`linear-gradient(145deg,${G},${G2})`,border:"4px solid #fff",boxShadow:`0 6px 20px ${G}50`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",zIndex:52,transition:"transform 0.3s"}}>
              <div style={{transform:open?"rotate(45deg)":"rotate(0deg)", transition:"transform 0.3s", display:"flex"}}>
                 <DompetKuLogo size={32}/>
              </div>
           </button>
        </div>

        {/* PROFIL */}
        <button onClick={()=>{setTab("profile");setOpen(false);}} style={{background:"none",border:"none",display:"flex",flexDirection:"column",alignItems:"center",gap:4,cursor:"pointer",padding:"4px 0"}}>
          <div style={{color:tab==="profile"?G:"#9ca3af"}}><UserCircle size={22} strokeWidth={2}/></div>
          <span style={{fontSize:10,fontWeight:tab==="profile"?800:600,color:tab==="profile"?G:"#9ca3af"}}>Profil</span>
        </button>

      </div>
    </>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const isPickingFile = useRef(false);

  // Persisted state
  const [onboarded,  setOnboarded]  = useState(()=>lsGet("dk_onboarded",false));
  const [userName,   setUserName]   = useState(()=>lsGet("dk_name",""));
  const [userAvatar, setUserAvatar] = useState(()=>lsGet("dk_avatar",null));
  const [pinEnabled, setPinEnabled] = useState(()=>lsGet("dk_pin_on",false));
  const [pinHash,    setPinHash]    = useState(()=>lsGet("dk_pin_hash",""));
  const [soundEnabled,setSoundEnabled]=useState(()=>lsGet("dk_sound",false));
  const [monthlyBudget,setMonthlyBudget]=useState(()=>lsGet("dk_budget",10000000));
  const [targetTabungan,setTargetTabungan]=useState(()=>lsGet("dk_target_tabungan", 20)); // Persisted target
  const [accounts,   setAccounts]   = useState(()=>lsGet("dk_accounts",[]));
  const [transactions,setTransactions]=useState(()=>lsGet("dk_txns",[]));
  const [hidden,     setHidden]     = useState(()=>lsGet("dk_hidden",false));

  const [locked,     setLocked]     = useState(()=>lsGet("dk_pin_on",false));
  const [tab,        setTab]        = useState("home");
  const [showAdd,    setShowAdd]    = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [txnFilter,  setTxnFilter]  = useState(null);
  const [selectedAcc,setSelectedAcc]= useState(null);
  const [viewTxn,    setViewTxn]    = useState(null); // Full Detail view for Txn
  const [editTxn,    setEditTxn]    = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);

  // Persist
  useEffect(()=>lsSet("dk_onboarded",onboarded),[onboarded]);
  useEffect(()=>lsSet("dk_name",userName),[userName]);
  useEffect(()=>lsSet("dk_avatar",userAvatar),[userAvatar]);
  useEffect(()=>lsSet("dk_pin_on",pinEnabled),[pinEnabled]);
  useEffect(()=>lsSet("dk_pin_hash",pinHash),[pinHash]);
  useEffect(()=>lsSet("dk_sound",soundEnabled),[soundEnabled]);
  useEffect(()=>lsSet("dk_budget",monthlyBudget),[monthlyBudget]);
  useEffect(()=>lsSet("dk_target_tabungan",targetTabungan),[targetTabungan]);
  useEffect(()=>lsSet("dk_accounts",accounts),[accounts]);
  useEffect(()=>lsSet("dk_txns",transactions),[transactions]);
  useEffect(()=>lsSet("dk_hidden",hidden),[hidden]);

  useEffect(()=>{
    const handle = () => { if (document.hidden && pinEnabled && !isPickingFile.current) setLocked(true); };
    document.addEventListener("visibilitychange", handle);
    return () => document.removeEventListener("visibilitychange", handle);
  }, [pinEnabled]);

  // Back button routing correction
  useEffect(() => {
    window.history.pushState({p:"home"},"");
    const handlePopState = (e) => {
      if (locked) return;
      if (viewTxn) { setViewTxn(null); window.history.pushState({p:"home"},""); return; }
      if (selectedAcc) { setSelectedAcc(null); window.history.pushState({p:"home"},""); return; }
      if (tab !== "home") { setTab("home"); window.history.pushState({p:"home"},""); return; }
      
      const confirmed = window.confirm("Keluar dari DompetKu?");
      if (confirmed) { window.history.back(); } 
      else { window.history.pushState({p:"home"},""); }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [tab, selectedAcc, viewTxn, locked]);

  const deleteTransaction = useCallback(txn => {
    setTransactions(p => p.filter(t => t.id !== txn.id));
    setAccounts(p => p.map(a => a.id === txn.accountId ? { ...a, balance: a.balance + (txn.type === "income" ? -txn.amount : txn.amount) } : a));
    (txn.attachmentMeta||[]).forEach(att => IDB.del(att.id).catch(()=>{}));
    setViewTxn(null);
  }, []);

  const addTransaction = useCallback(form => {
    const newTxn = { ...form, id: Date.now(), detected: form.detected || null };
    setTransactions(p => [newTxn, ...p]);
    setAccounts(p => p.map(a => a.id === form.accountId ? { ...a, balance: a.balance + (form.type === "income" ? form.amount : -form.amount) } : a));
    setShowAdd(false); setEditTxn(null);
  }, []);

  const updateTransaction = useCallback((original, updated) => {
    setAccounts(p => p.map(a => {
      let bal = a.balance;
      if (a.id === original.accountId) bal += original.type === "income" ? -original.amount : original.amount;
      if (a.id === updated.accountId) bal += updated.type === "income" ? updated.amount : -updated.amount;
      return a.id === original.accountId || a.id === updated.accountId ? { ...a, balance: bal } : a;
    }));
    setTransactions(p => p.map(t => t.id === original.id ? { ...updated, id: original.id } : t));
    setEditTxn(null);
  }, []);

  // Handler for Account Balance adjustment 
  const handleAccountSave = useCallback((accData, balDiff) => {
    if (balDiff !== 0) {
      const adjTxn = {
        id: Date.now(), accountId: accData.id,
        type: balDiff > 0 ? "income" : "expense",
        amount: Math.abs(balDiff),
        category: "Penyesuaian Saldo", note: "Penyesuaian manual",
        date: todayStr(), time: new Date().toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'}),
      };
      setTransactions(p => [adjTxn, ...p]);
    }
  }, []);

  const importTxns = txns => setTransactions(p => [...txns, ...p]);
  const titleMap = { home:"Beranda", transactions:"Riwayat", accounts:"Akun", charts:"Analisis", profile:"Profil" };

  if (!onboarded) return <OnboardingScreen onDone={name=>{setUserName(name);setOnboarded(true);}}/>;
  if (locked && pinEnabled) return <PinScreen mode="unlock" savedHash={pinHash} onUnlock={()=>setLocked(false)}/>;
  if (selectedAcc) return <AccountDetailScreen account={selectedAcc.acc} transactions={transactions} accIdx={selectedAcc.idx} onClose={()=>setSelectedAcc(null)} onEditAccount={()=>{setSelectedAcc(null); setTab("accounts");}}/>;

  return (
    <div style={{fontFamily:"'Outfit',sans-serif",background:BG,minHeight:"100vh",maxWidth:430,margin:"0 auto",paddingBottom:82}}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>
      <style>{`
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
        input,select,button{font-family:'Outfit',sans-serif;}
        button:focus,input:focus,select:focus{outline:none;}
        ::-webkit-scrollbar{width:0;height:0;}
        @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        .screen{animation:fadeUp .2s ease}
        input[type=range]{height:6px;border-radius:99px;}
      `}</style>

      {/* HEADER */}
      <div style={{background:"#fff",paddingTop:"calc(env(safe-area-inset-top,0px) + 10px)",paddingBottom:12,paddingLeft:20,paddingRight:20,display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid #f1f5f9",position:"sticky",top:0,zIndex:50}}>
        <h1 style={{margin:0,fontSize:17,fontWeight:800,color:"#111"}}>{titleMap[tab]}</h1>
        <div style={{display:"flex",gap:8}}>
          {tab==="transactions"&&<button onClick={()=>setSearchOpen(p=>!p)} style={{background:"#f1f5f9",border:"none",borderRadius:10,width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#374151"}}><Search size={15} strokeWidth={1.7}/></button>}
          {pinEnabled&&<button onClick={()=>setLocked(true)} style={{background:"#f1f5f9",border:"none",borderRadius:10,width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#374151"}}><Lock size={15} strokeWidth={1.7}/></button>}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{paddingTop:14}} className="screen" key={tab}>
        {tab==="home"         && <HomeScreen accounts={accounts} transactions={transactions} monthlyBudget={monthlyBudget} setMonthlyBudget={setMonthlyBudget} targetTabungan={targetTabungan} setTargetTabungan={setTargetTabungan} userName={userName} userAvatar={userAvatar} setTab={setTab} setTxnFilter={setTxnFilter} setSelectedAcc={setSelectedAcc} hidden={hidden} setHidden={setHidden} onViewTxn={setViewTxn}/>}
        {tab==="transactions" && <TransactionsScreen transactions={transactions} accounts={accounts} onViewTxn={setViewTxn} initialTypeFilter={txnFilter} onFilterConsumed={()=>setTxnFilter(null)} searchOpen={searchOpen} onSearchClose={()=>setSearchOpen(false)}/>}
        {tab==="accounts"     && <AccountsScreen accounts={accounts} setAccounts={setAccounts} transactions={transactions} setSelectedAcc={setSelectedAcc}/>}
        {tab==="charts"       && <ChartsScreen transactions={transactions}/>}
        {tab==="profile"      && <ProfileScreen userName={userName} setUserName={setUserName} userAvatar={userAvatar} setUserAvatar={setUserAvatar} transactions={transactions} accounts={accounts} pinEnabled={pinEnabled} pinHash={pinHash} setPinEnabled={setPinEnabled} setPinHash={h=>{setPinHash(h);setPinEnabled(true);}} soundEnabled={soundEnabled} setSoundEnabled={setSoundEnabled} setTransactions={setTransactions} setAccounts={setAccounts} setShowImport={setShowImport}/>}
      </div>

      {/* BOTTOM FAB NAV */}
      <FanNav tab={tab} setTab={setTab} onAddTxn={()=>setShowAdd(true)} />

      {/* MODALS */}
      {showAdd && accounts.length === 0 && <ConfirmDialog title="Belum ada akun!" sub='Tambahkan akun keuangan dulu sebelum mencatat transaksi.' onConfirm={()=>{setShowAdd(false);setTab("accounts");}} onCancel={()=>setShowAdd(false)} danger={false}/>}
      {showAdd && accounts.length > 0 && <TxnModal accounts={accounts} onClose={()=>setShowAdd(false)} onSave={addTransaction} soundEnabled={soundEnabled} isPickingFile={isPickingFile}/>}
      {editTxn && <TxnModal initial={{...editTxn, amountStr:editTxn.amount.toLocaleString("id-ID")}} accounts={accounts} onClose={()=>setEditTxn(null)} onSave={updated=>updateTransaction(editTxn,updated)} soundEnabled={soundEnabled} isPickingFile={isPickingFile} />}
      {viewTxn && <TxnDetailModal txn={viewTxn} accounts={accounts} onClose={()=>setViewTxn(null)} onEdit={setEditTxn} onDelete={deleteTransaction}/>}
      {showImport && <ImportModal accounts={accounts} onClose={()=>setShowImport(false)} onImport={importTxns} isPickingFile={isPickingFile}/>}
    </div>
  );
}
