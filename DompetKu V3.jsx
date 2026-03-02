// DompetKu Ultimate Version (Audited & Patched)
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
  { kw:["indomaret","alfamart","lawson","minimarket","superindo","giant","hypermart","carrefour","transmart"], cat:"Belanja Harian" },
  { kw:["gofood","grabfood","shopeefood","kfc","mcdonalds","burger","pizza","starbucks","kopi","bakso","warteg","makan","resto","cafe","coffee","padang","nasi"], cat:"Makan & Minum" },
  { kw:["tokopedia","shopee","lazada","bukalapak","blibli","tiktok shop","zalora","uniqlo","zara"], cat:"Belanja Online" },
  { kw:["grab","gojek","ojek","maxim","busway","transjakarta","kereta","mrt","lrt","commuter","bensin","pertamina","shell","parkir","tol"], cat:"Transportasi" },
  { kw:["netflix","spotify","youtube","disney","vidio","game","bioskop","cinema","cgv","xxi","imax","platinum"], cat:"Hiburan" },
  { kw:["pln","listrik","pdam","internet","wifi","indihome","telkom","xl","telkomsel","pulsa","token"], cat:"Tagihan" },
  { kw:["apotek","klinik","dokter","rumah sakit","bpjs","obat","vitamin","halodoc"], cat:"Kesehatan" },
  { kw:["sekolah","kuliah","les","kursus","buku","gramedia"], cat:"Pendidikan" },
  { kw:["kost","kontrakan","sewa","kpr","cicilan"], cat:"Tempat Tinggal" },
  { kw:["salon","barber","potong","spa","facial","gym","fitness"], cat:"Perawatan" },
  { kw:["gaji","salary","thr","bonus","insentif"], cat:"Gaji" },
  { kw:["freelance","project","proyek","honor","fee","jasa"], cat:"Freelance" },
  { kw:["transfer","kiriman","hadiah","kado"], cat:"Hadiah" },
  { kw:["investasi","saham","reksa","deposito","dividen","bunga"], cat:"Investasi" },
];
const CATS_EXP = ["Makan & Minum","Belanja Harian","Belanja Online","Transportasi","Hiburan","Tagihan","Kesehatan","Pendidikan","Tempat Tinggal","Perawatan","Penyesuaian Saldo","Lainnya"];
const CATS_INC = ["Gaji","Freelance","Hadiah","Investasi","Penyesuaian Saldo","Lainnya"];
const CAT_ICON = (cat,sz=16,col="currentColor") => {
  const p={size:sz,strokeWidth:1.7,color:col};
  return ({
    "Makan & Minum":<Coffee {...p}/>,"Belanja Harian":<ShoppingCart {...p}/>,"Belanja Online":<ShoppingBag {...p}/>,
    "Transportasi":<Car {...p}/>,"Hiburan":<Monitor {...p}/>,"Tagihan":<Zap {...p}/>,
    "Kesehatan":<Heart {...p}/>,"Pendidikan":<BookOpen {...p}/>,"Tempat Tinggal":<Home {...p}/>,
    "Perawatan":<Scissors {...p}/>,"Gaji":<Briefcase {...p}/>,"Freelance":<Monitor {...p}/>,
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

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const fmt       = n => "Rp " + Math.abs(n).toLocaleString("id-ID");
const fmtShort  = n => n>=1e9?(n/1e9).toFixed(1)+"M":n>=1e6?(n/1e6).toFixed(1)+"Jt":n>=1e3?(n/1e3).toFixed(0)+"K":String(n);
const mask      = n => "Rp " + "•".repeat(Math.min(7,String(Math.round(n)).length));

// Timezone safe dates
const getLocalISOString = (d = new Date()) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0,10);
const todayStr  = () => getLocalISOString();
const nowTime   = () => new Date().toTimeString().slice(0,5);
const startOfWeek  = () => { const d=new Date(); d.setDate(d.getDate()-d.getDay()); return getLocalISOString(d); };
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
  try { const data=new TextEncoder().encode("dompetku_2025:"+pin); const buf=await crypto.subtle.digest("SHA-256",data); return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,"0")).join(""); } catch { return pin; }
};

const playTxnSound = type => {
  try { const ctx=new(window.AudioContext||window.webkitAudioContext)(); const osc=ctx.createOscillator(); const gain=ctx.createGain(); osc.connect(gain); gain.connect(ctx.destination); osc.type="sine"; if(type==="expense"){osc.frequency.setValueAtTime(523,ctx.currentTime);osc.frequency.exponentialRampToValueAtTime(262,ctx.currentTime+0.35);}else{osc.frequency.setValueAtTime(330,ctx.currentTime);osc.frequency.exponentialRampToValueAtTime(660,ctx.currentTime+0.35);} gain.gain.setValueAtTime(0.22,ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.4); osc.start(ctx.currentTime); osc.stop(ctx.currentTime+0.4); } catch {}
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

const ConfirmDialog = ({title,sub,onConfirm,onCancel,danger=true,confirmLabel="Ya, Lanjutkan"}) => (
  <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
    <div style={{background:"#fff",borderRadius:20,padding:"24px",maxWidth:340,width:"100%",textAlign:"center"}}>
      <div style={{color:danger?"#ef4444":"#f59e0b",display:"flex",justifyContent:"center",marginBottom:10}}><AlertTriangle size={44}/></div>
      <p style={{fontSize:16,fontWeight:800,color:"#111",margin:"0 0 8px"}}>{title}</p>
      <p style={{fontSize:13,color:"#6b7280",marginBottom:20}}>{sub}</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <button type="button" onClick={onCancel} style={{padding:"13px",background:"#f1f5f9",border:"none",borderRadius:14,fontSize:14,fontWeight:700,cursor:"pointer"}}>Batal</button>
        <button type="button" onClick={onConfirm} style={{padding:"13px",background:danger?"#ef4444":G,border:"none",borderRadius:14,color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer"}}>{confirmLabel}</button>
      </div>
    </div>
  </div>
);

// ─── DOMPETKU LOGO SVG ────────────────────────────────────────────────────────
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
  
  const handleDigit = d => {
    if (mode==="set") {
      if (step==="enter") { const n=input+d; setInput(n); if(n.length===4)setStep("confirm"); }
      else { const n=confirm+d; setConfirm(n); if(n.length===4){if(n===input){hashPin(n).then(h=>onSetPin(h));}else{setErr("PIN tidak cocok");setInput("");setConfirm("");setStep("enter");}} }
    } else {
      const n=input+d; setInput(n);
      if(n.length===4){ hashPin(n).then(h=>{if(h===savedHash){onUnlock();}else{setErr("PIN salah");setInput("");}}); }
    }
  };
  const del = () => { if(step==="confirm")setConfirm(c=>c.slice(0,-1)); else setInput(i=>i.slice(0,-1)); };
  const handleBio = () => { onUnlock(); };

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
            {d==="⌫" ? <Trash2 size={20} strokeWidth={2}/> : d==="BIO" ? <Fingerprint size={26} strokeWidth={1.8}/> : d}
          </button>
        ))}
      </div>
      {onCancel&&<button type="button" onClick={onCancel} style={{marginTop:24,background:"none",border:"none",color:"rgba(255,255,255,0.7)",fontSize:14,cursor:"pointer"}}>Batal</button>}
    </div>
  );
}

// ─── ONBOARDING ───────────────────────────────────────────────────────────────
function OnboardingScreen({ onDone }) {
  const [step,setStep]=useState(0); const [name,setName]=useState("");
  const slides=[
    {icon:"💰",title:"Catat Keuanganmu",desc:"Lacak setiap pemasukan dan pengeluaran dengan mudah dan cepat."},
    {icon:"📊",title:"Analisis Pengeluaran",desc:"Visualisasi lengkap kategori pengeluaranmu setiap bulan."},
    {icon:"🎯",title:"Capai Target Tabungan",desc:"Set budget bulanan dan pantau progress tabunganmu."},
  ];
  const last=step===slides.length;
  return (
    <div style={{fontFamily:"'Outfit',sans-serif",background:`linear-gradient(160deg,${G},${G2})`,minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:32,maxWidth:430,margin:"0 auto"}}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>
      {!last ? (
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:72,marginBottom:24}}>{slides[step].icon}</div>
          <p style={{color:"#fff",fontSize:22,fontWeight:800,margin:"0 0 12px"}}>{slides[step].title}</p>
          <p style={{color:"rgba(255,255,255,0.8)",fontSize:15,marginBottom:40,lineHeight:1.6}}>{slides[step].desc}</p>
          <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:32}}>
            {slides.map((_,i)=><div key={i} style={{width:i===step?24:8,height:8,borderRadius:4,background:i===step?"#fff":"rgba(255,255,255,0.4)",transition:"width .3s"}}/>)}
          </div>
          <BtnG onClick={()=>setStep(s=>s+1)} style={{background:"rgba(255,255,255,0.25)",boxShadow:"none"}}>Lanjut →</BtnG>
        </div>
      ) : (
        <div style={{width:"100%"}}>
          <DompetKuLogo size={52}/>
          <p style={{color:"#fff",fontSize:24,fontWeight:800,marginTop:16,marginBottom:8}}>Siapa namamu?</p>
          <p style={{color:"rgba(255,255,255,0.75)",fontSize:14,marginBottom:24}}>Kami akan menyapa kamu dengan nama ini</p>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nama kamu..." style={{width:"100%",background:"rgba(255,255,255,0.2)",border:"2px solid rgba(255,255,255,0.3)",borderRadius:16,padding:"16px",color:"#fff",fontSize:18,fontWeight:700,outline:"none",marginBottom:16,boxSizing:"border-box"}}/>
          <BtnG onClick={()=>name.trim()&&onDone(name.trim())} disabled={!name.trim()} style={{background:"rgba(255,255,255,0.25)",boxShadow:"none"}}>Mulai Sekarang →</BtnG>
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
        {[{label:"Ditabung",val:saving,col:"#8b5cf6"},{label:"Bisa Dibelanjakan",val:spendable,col:G},{label:"Budget Bulanan Ideal",val:spendable,col:G,bold:true},{label:"Limit Harian Ideal",val:sugDaily,col:"#f97316"}].map(r=>(
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
      <Inp label="4 DIGIT TERAKHIR (OPSIONAL)" mb={10}><input value={acc.last4||""} onChange={e=>s("last4",e.target.value.slice(0,4))} placeholder="xxxx" maxLength={4} style={{width:"100%",background:"transparent",border:"none",outline:"none",fontSize:14,color:"#111"}}/></Inp>

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
            {acc.iconImg?<img src={acc.iconImg} alt="" style={{width:26,height:26,borderRadius:7,objectFit:"cover"}}/>:<Wallet size={18} strokeWidth={1.7} color="#fff"/>}
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
function TxnDetailSheet({ txn, accounts, onClose, onEdit, onDelete }) {
  const acc      = accounts.find(a=>a.id===txn.accountId);
  const fields   = getTxnDetailFields(txn);
  const [details, setDetails] = useState(txn.details || {});
  const [editing, setEditing] = useState(false);
  const [showDel, setShowDel] = useState(false);
  const [attachSrcs, setAttachSrcs] = useState({});

  useEffect(()=>{
    let active = true;
    (txn.attachmentMeta||[]).forEach(a=>{ IDB.get(a.id).then(d=>{if(active&&d)setAttachSrcs(p=>({...p,[a.id]:d}));}).catch(()=>{}); });
    return () => { active = false; };
  },[txn]);
  const save = () => { onEdit({...txn, details}); setEditing(false); };
  const grad = acc ? getAccGrad(acc, accounts.indexOf(acc)) : `linear-gradient(135deg,${G},${G2})`;

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:210,display:"flex",alignItems:"flex-end",backdropFilter:"blur(4px)"}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:"#f8fafc",width:"100%",maxWidth:430,margin:"0 auto",borderRadius:"24px 24px 0 0",maxHeight:"92vh",overflowY:"auto",paddingBottom:32}}>
        <div style={{background:grad,borderRadius:"24px 24px 0 0",padding:"20px 18px 24px",position:"relative"}}>
          <button type="button" onClick={onClose} style={{position:"absolute",top:16,left:16,background:"rgba(255,255,255,0.2)",border:"none",borderRadius:9,width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff"}}><X size={16}/></button>
          
          <div style={{textAlign:"center",paddingTop:8}}>
            {/* FIX: Centered container to prevent overlap */}
            <div style={{display:"flex", justifyContent:"center", marginBottom: 10}}>
              <CatBub cat={txn.category} size={56}/>
            </div>
            <p style={{color:"#fff",fontSize:13,fontWeight:600,margin:"0 0 2px"}}>{txn.note||"Transaksi"}</p>
            <p style={{color:"#fff",fontSize:28,fontWeight:800,margin:"0 0 4px"}}>{txn.type==="income"?"+":"-"}{fmt(txn.amount)}</p>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              <span style={{background:"rgba(255,255,255,0.2)",color:"#fff",fontSize:11,fontWeight:600,padding:"4px 10px",borderRadius:99}}>{txn.category}</span>
              <span style={{background:"rgba(255,255,255,0.2)",color:"#fff",fontSize:11,fontWeight:600,padding:"4px 10px",borderRadius:99}}>{acc?.name||"?"}</span>
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
function TxnModal({ initial, accounts, onClose, onSave, soundEnabled, isPickingFile }) {
  const isEdit = !!initial;
  const [form, setForm] = useState(() => initial || { type:"expense", amountStr:"", category:"Makan & Minum", note:"", date:todayStr(), time:nowTime(), accountId:accounts[0]?.id, attachmentMeta:[] });
  const [detected, setDetected] = useState(null);
  const fileRef = useRef();
  const s = (k,v) => setForm(f=>({...f,[k]:v}));

  const handleNote = v => { s("note",v); const d=smartDetect(v); setDetected(d); if(d)setForm(f=>({...f,note:v,category:d.cat})); };
  const handleAmt  = e => { const raw=e.target.value.replace(/\D/g,""); s("amountStr",raw?parseInt(raw).toLocaleString("id-ID"):""); };
  
  const handleFile = async e => {
    isPickingFile.current=false;
    const files=Array.from(e.target.files); const newMeta=[];
    for (const f of files) {
      const id=`att_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const data=await new Promise(res=>{const r=new FileReader();r.onload=()=>res(r.result);r.readAsDataURL(f);});
      await IDB.put(id,data).catch(()=>{});
      newMeta.push({id,name:f.name,type:f.type});
    }
    setForm(f=>({...f,attachmentMeta:[...(f.attachmentMeta||[]),...newMeta]}));
  };
  const removeAttachment = async id => { await IDB.del(id).catch(()=>{}); setForm(f=>({...f,attachmentMeta:(f.attachmentMeta||[]).filter(a=>a.id!==id)})); };

  const submit = () => {
    const amount=parseNum(form.amountStr||"0"); if(!amount||!form.accountId)return;
    if(soundEnabled&&!isEdit)playTxnSound(form.type);
    onSave({...form,amount,amountStr:undefined,detected});
  };

  const cats=form.type==="expense"?CATS_EXP:CATS_INC;
  return (
    <BottomSheet onClose={onClose} title={isEdit?"Edit Transaksi":"Catat Transaksi"}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5,marginBottom:14,background:"#e5e7eb",borderRadius:14,padding:4}}>
        {["expense","income"].map(type=>(
          <button type="button" key={type} onClick={()=>setForm(f=>({...f,type,category:type==="expense"?"Makan & Minum":"Gaji"}))} style={{padding:"10px",border:"none",borderRadius:11,background:form.type===type?"#fff":"transparent",color:form.type===type?"#111":"#9ca3af",fontSize:13,fontWeight:700,cursor:"pointer",boxShadow:form.type===type?"0 1px 4px rgba(0,0,0,0.08)":"none"}}>{type==="expense"?"Pengeluaran":"Pemasukan"}</button>
        ))}
      </div>
      <Inp label="JUMLAH (RP)"><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:18,fontWeight:700,color:"#9ca3af"}}>Rp</span><input inputMode="numeric" placeholder="0" value={form.amountStr||""} onChange={handleAmt} style={{flex:1,background:"transparent",border:"none",outline:"none",fontSize:28,fontWeight:800,color:"#111"}}/></div></Inp>
      <Inp label="CATATAN / NAMA TOKO" mb={detected?6:10}><input placeholder="cth: Indomaret, GoFood..." value={form.note||""} onChange={e=>handleNote(e.target.value)} style={{width:"100%",background:"transparent",border:"none",outline:"none",fontSize:14,color:"#111"}}/></Inp>
      {detected&&<div style={{display:"flex",alignItems:"center",gap:7,padding:"8px 13px",background:GL,borderRadius:11,marginBottom:10,border:`1px solid ${GM}`}}><Check size={13} color={G}/><span style={{color:G,fontSize:12,fontWeight:600}}>Auto-detect: {detected.cat}</span></div>}
      <Inp label="KATEGORI">
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
          {cats.map(c=>(
            <button type="button" key={c} onClick={()=>s("category",c)} style={{padding:"8px 4px",background:form.category===c?GL:"#f8fafc",border:`1.5px solid ${form.category===c?G:"#f1f5f9"}`,borderRadius:10,color:form.category===c?G:"#9ca3af",fontSize:9,fontWeight:600,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3}}><span style={{color:form.category===c?G:CAT_COLORS[c]||"#9ca3af"}}>{CAT_ICON(c,17)}</span><span style={{textAlign:"center",lineHeight:1.2,color:form.category===c?G:"#6b7280",wordBreak:"break-word",hyphens:"auto"}}>{c==="Makan & Minum"?"Makan":c==="Belanja Harian"?"B.Harian":c==="Belanja Online"?"B.Online":c==="Tempat Tinggal"?"Tempat Tgl":c==="Penyesuaian Saldo"?"Penyesuaian":c.split(" ")[0]}</span></button>
          ))}
        </div>
      </Inp>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
        <Inp label="AKUN" mb={0}>{accounts.length===0?<p style={{margin:0,fontSize:12,color:"#ef4444"}}>Buat akun dulu!</p>:<select value={form.accountId} onChange={e=>s("accountId",parseInt(e.target.value))} style={{width:"100%",background:"transparent",border:"none",outline:"none",fontSize:13,fontWeight:600,color:"#111",WebkitAppearance:"none"}}>{accounts.map(a=><option key={a.id} value={a.id}>{a.name}</option>)}</select>}</Inp>
        <Inp label="TANGGAL" mb={0}><input type="date" value={form.date} onChange={e=>s("date",e.target.value)} style={{width:"100%",background:"transparent",border:"none",outline:"none",fontSize:12,fontWeight:600,color:"#111",colorScheme:"light"}}/></Inp>
      </div>
      <Inp label="JAM" mb={10}><input type="time" value={form.time||nowTime()} onChange={e=>s("time",e.target.value)} style={{background:"transparent",border:"none",outline:"none",fontSize:14,fontWeight:600,color:"#111",colorScheme:"light"}}/></Inp>
      <Inp label="LAMPIRAN (OPSIONAL)" mb={18}>
        <Row><p style={{margin:0,fontSize:12,color:"#9ca3af"}}>Foto struk, dll.</p><button type="button" onClick={()=>{isPickingFile.current=true;fileRef.current.click();}} style={{background:GL,border:"none",borderRadius:9,padding:"6px 12px",color:G,fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:5}}><Upload size={12}/> Tambah</button></Row>
        <input ref={fileRef} type="file" accept="image/*,.pdf" multiple style={{display:"none"}} onChange={handleFile}/>
        {(form.attachmentMeta||[]).length>0&&(
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:8}}>
            {form.attachmentMeta.map(a=>(<div key={a.id} style={{position:"relative",width:52,height:52}}><AttachPreview id={a.id} type={a.type}/><button type="button" onClick={()=>removeAttachment(a.id)} style={{position:"absolute",top:-5,right:-5,width:17,height:17,borderRadius:"50%",background:"#ef4444",border:"none",color:"#fff",fontSize:9,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button></div>))}
          </div>
        )}
      </Inp>
      <BtnG onClick={submit} disabled={accounts.length===0}>{isEdit?"Simpan Perubahan":"Simpan Transaksi"}</BtnG>
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
function ImportModal({ accounts, onClose, onImport, isPickingFile }) {
  const [st,setSt]=useState("idle"),[preview,setPreview]=useState([]),[err,setErr]=useState("");
  const ref=useRef();
  const parse=async e=>{
    isPickingFile.current=false;
    const file=e.target.files[0];if(!file)return;
    if(accounts.length===0){setErr("Silakan buat akun keuangan terlebih dahulu sebelum import.");setSt("error");return;}
    setSt("parsing");
    try{
      const buf=await file.arrayBuffer();const wb=XLSX.read(buf,{type:"array"});const ws=wb.Sheets[wb.SheetNames[0]];
      const rows=XLSX.utils.sheet_to_json(ws,{header:1,defval:""});
      if(rows.length<2){setErr("File kosong.");setSt("error");return;}
      const h=rows[0].map(x=>String(x).toLowerCase());
      const fc=(...ns)=>{for(const n of ns){const i=h.findIndex(x=>x.includes(n));if(i>=0)return i;}return -1;};
      const ai=fc("amount","jumlah","nominal");if(ai<0){setErr("Kolom Amount tidak ditemukan.");setSt("error");return;}
      const di=fc("date","tanggal"),ni=fc("note","catatan","memo"),ci=fc("category","kategori"),ti=fc("type","jenis");
      const parsed=[];
      for(let i=1;i<Math.min(rows.length,201);i++){
        const row=rows[i];if(!row||row.every(c=>c===""))continue;
        const amt=parseFloat(String(row[ai]).replace(/[^\d.-]/g,""));if(!amt||isNaN(amt))continue;
        const rt=ti>=0?String(row[ti]).toLowerCase():"";const isInc=rt.includes("income")||rt.includes("masuk")||rt.includes("pemasukan");
        let pd=todayStr();if(di>=0&&row[di]){try{const d=new Date(row[di]);if(!isNaN(d))pd=getLocalISOString(d);}catch{}}
        const rc=ci>=0?String(row[ci]):"";const cat=Object.keys(CAT_BG).find(k=>rc.toLowerCase().includes(k.toLowerCase()))||"Lainnya";
        parsed.push({id:Date.now()+i,type:isInc?"income":"expense",amount:Math.abs(amt),category:cat,note:ni>=0?String(row[ni]):"Import",date:pd,time:"",accountId:accounts[0].id,detected:null,attachmentMeta:[]});
      }
      if(!parsed.length){setErr("Tidak ada data valid.");setSt("error");return;}
      setPreview(parsed);setSt("preview");
    }catch(e2){setErr(e2.message);setSt("error");}
  };
  return(
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
  const txns   = [...transactions].filter(t=>t.accountId===account.id).sort(sortByDateDesc);
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
        <button type="button" onClick={onEditAccount} style={{position:"absolute",top:"calc(env(safe-area-inset-top,0px) + 14px)",right:16,background:"rgba(255,255,255,0.2)",border:"none",borderRadius:10,width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff"}}><Pencil size={15}/></button>
        <div style={{textAlign:"center",paddingTop:16}}>
          <div style={{width:54,height:54,borderRadius:16,background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 10px",color:"#fff"}}>
            {account.iconImg?<img src={account.iconImg} alt="" style={{width:38,height:38,borderRadius:10,objectFit:"cover"}}/>:(()=>{const T=ACC_TYPES.find(t=>t.type===account.type);return T?<T.Icon s={24}/>:null;})()}
          </div>
          <p style={{color:"rgba(255,255,255,0.8)",fontSize:12,margin:"0 0 4px"}}>{account.name}</p>
          <p style={{color:"#fff",fontSize:28,fontWeight:800,margin:"0 0 14px"}}>{fmt(account.balance)}</p>
          {account.last4&&<p style={{color:"rgba(255,255,255,0.6)",fontSize:11,letterSpacing:3,margin:"0 0 14px"}}>•••• {account.last4}</p>}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:4}}>
          {[{l:"Pemasukan",v:income},{l:"Pengeluaran",v:expense}].map(x=>(
            <div key={x.l} style={{background:"rgba(255,255,255,0.15)",borderRadius:12,padding:"10px 14px",textAlign:"center"}}><p style={{color:"rgba(255,255,255,0.7)",fontSize:10,fontWeight:600,margin:"0 0 3px"}}>{x.l}</p><p style={{color:"#fff",fontSize:13,fontWeight:800,margin:0}}>{fmtShort(x.v)}</p></div>
          ))}
        </div>
        {isLinkable&&(<button type="button" onClick={openApp} style={{width:"100%",marginTop:14,padding:"11px",background:"rgba(255,255,255,0.2)",border:"1.5px solid rgba(255,255,255,0.4)",borderRadius:13,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><ExternalLink size={15}/> Buka {deepLink?.label||"Aplikasi"}</button>)}
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
function HomeScreen({ accounts, transactions, monthlyBudget, setMonthlyBudget, savedPct, setSavedPct, userName, userAvatar, setTab, setTxnFilter, setSelectedAcc, hidden, setHidden, onTxnClick }) {
  const [showBudgetModal, setShowBudgetModal] = useState(false);

  const totalBalance = accounts.reduce((s,a)=>s+a.balance,0);
  const totalIncome  = transactions.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);
  const totalExpense = transactions.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);
  const budgetLeft   = monthlyBudget - totalExpense;
  const budgetPct    = Math.min(100,Math.round(totalExpense/Math.max(monthlyBudget,1)*100));
  const show         = v => hidden ? mask(v) : fmt(v);
  const recent       = [...transactions].sort(sortByDateDesc).slice(0,5);

  const dLeft = new Date(new Date().getFullYear(), new Date().getMonth()+1, 0).getDate() - new Date().getDate();
  const daysPassed = new Date().getDate();
  const avgDailyExp = daysPassed > 0 ? totalExpense / daysPassed : 0;
  const estEndBal = Math.max(0, totalBalance - (avgDailyExp * dLeft));
  const estZeroDays = avgDailyExp > 0 ? Math.floor(totalBalance / avgDailyExp) : "999+";

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
          <p style={{color:"rgba(255,255,255,0.75)",fontSize:12,margin:0}}>Total Balance</p>
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

      <div style={{display:"flex", gap:12, overflowX:"auto", paddingBottom:10, scrollbarWidth:"none", snapType:"x mandatory"}}>
        {/* Budget Card */}
        <div style={{minWidth:"85%", scrollSnapAlign:"start"}}>
          <Card style={{height:"100%", marginBottom:0}}>
            <Row style={{marginBottom:12}}>
              <p style={{margin:0,fontSize:14,fontWeight:800,color:"#111"}}>Monthly Budget</p>
              <button type="button" onClick={()=>setShowBudgetModal(true)} style={{background:"none",border:"none",color:G,fontSize:13,fontWeight:700,cursor:"pointer"}}>Edit</button>
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
                <p style={{margin:0,fontSize:11,fontWeight:600,color:budgetLeft<=0?"#ef4444":G}}>{budgetLeft<=0?"⚠️ Budget habis!":`${hidden?mask(Math.max(0,Math.floor(budgetLeft/Math.max(1,dLeft)))) : fmt(Math.max(0,Math.floor(budgetLeft/Math.max(1,dLeft))))} / hari`}</p>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Predictor Card */}
        <div style={{minWidth:"85%", scrollSnapAlign:"start"}}>
           <Card style={{height:"100%", marginBottom:0}}>
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

      <Row style={{marginBottom:10}}><p style={{margin:0,fontSize:14,fontWeight:800,color:"#111"}}>Akun Saya</p><button type="button" onClick={()=>setTab("accounts")} style={{background:"none",border:"none",color:G,fontSize:12,fontWeight:700,cursor:"pointer"}}>Lihat semua</button></Row>
      <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:6,scrollbarWidth:"none"}}>
        {accounts.length===0&&<div style={{background:"#fff",borderRadius:16,padding:"14px 20px",minWidth:160,color:"#9ca3af",fontSize:12}}>Belum ada akun</div>}
        {accounts.map((acc,i)=>{
          const T=ACC_TYPES.find(t=>t.type===acc.type);
          return (
            <button type="button" key={acc.id} onClick={()=>setSelectedAcc({acc,idx:i})} style={{background:getAccGrad(acc,i),borderRadius:16,padding:"14px",minWidth:155,flexShrink:0,border:"none",cursor:"pointer",textAlign:"left",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:-15,right:-15,width:50,height:50,borderRadius:"50%",background:"rgba(255,255,255,0.1)"}}/>
              <Row style={{marginBottom:10}}><p style={{margin:0,fontSize:11,color:"rgba(255,255,255,0.9)",fontWeight:600,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{acc.name}</p><div style={{color:"rgba(255,255,255,0.7)",flexShrink:0}}>{T&&<T.Icon s={15}/>}</div></Row>
              <p style={{color:"#fff",fontSize:16,fontWeight:800,margin:"0 0 5px"}}>{hidden?mask(acc.balance):fmtShort(acc.balance)}</p>
              <p style={{color:"rgba(255,255,255,0.6)",fontSize:10,margin:0,letterSpacing:2}}>{acc.last4?`•••• ${acc.last4}`:T?.label||""}</p>
            </button>
          );
        })}
      </div>

      <Row style={{margin:"14px 0 10px"}}><p style={{margin:0,fontSize:14,fontWeight:800,color:"#111"}}>Transaksi Terbaru</p><button type="button" onClick={()=>setTab("transactions")} style={{background:"none",border:"none",color:G,fontSize:12,fontWeight:700,cursor:"pointer"}}>Lihat semua</button></Row>
      <Card style={{padding:"4px 0"}}>
        {recent.length===0&&<p style={{color:"#9ca3af",textAlign:"center",padding:"20px",fontSize:13}}>Belum ada transaksi</p>}
        {recent.map((t,i)=>{
          const acc=accounts.find(a=>a.id===t.accountId);
          return (
            <button type="button" key={t.id} onClick={()=>onTxnClick(t)} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderBottom:i<recent.length-1?"1px solid #f8fafc":"none",background:"none",borderTop:"none",borderLeft:"none",borderRight:"none",width:"100%",cursor:"pointer",textAlign:"left"}}>
              <CatBub cat={t.category}/>
              <div style={{flex:1,minWidth:0}}><p style={{margin:0,fontSize:13,fontWeight:600,color:"#111",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.note||"Transaksi"}</p><p style={{margin:"2px 0 0",fontSize:11,color:"#9ca3af"}}>{t.date}{t.time?` · ${t.time}`:""}</p></div>
              <div style={{textAlign:"right",flexShrink:0}}><p style={{margin:0,fontSize:13,fontWeight:800,color:t.type==="income"?G:"#ef4444"}}>{t.type==="income"?"+":"-"}Rp {hidden?"•••••":t.amount.toLocaleString("id-ID")}</p><p style={{margin:"2px 0 0",fontSize:10,color:"#9ca3af"}}>{acc?.name||""}</p></div>
            </button>
          );
        })}
      </Card>
      {showBudgetModal&&<BudgetModal totalBalance={totalBalance} currentBudget={monthlyBudget} savedPct={savedPct} onApply={(v,pct)=>{setMonthlyBudget(v);setSavedPct(pct);setShowBudgetModal(false);}} onClose={()=>setShowBudgetModal(false)}/>}
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
  const [confirm,setConfirm]=useState(null);
  const searchRef=useRef();

  useEffect(()=>{ if(initialTypeFilter){setTypeF(initialTypeFilter);onFilterConsumed?.();} },[initialTypeFilter]);
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
         const accName = accounts.find(a=>a.id===t.accountId)?.name || "";
         return t.note?.toLowerCase().includes(q) || t.category?.toLowerCase().includes(q) || accName.toLowerCase().includes(q);
      });
    }
    return arr;
  },[transactions,typeF,dateF,from,to,search,accounts]);

  const totalInc=filtered.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);
  const totalExp=filtered.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);
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
      <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:8,marginBottom:10,scrollbarWidth:"none"}}>{[{id:"month",l:"Bulan Ini"},{id:"today",l:"Hari Ini"},{id:"week",l:"Minggu Ini"},{id:"custom",l:"Custom"}].map(f=><FP key={f.id} label={f.l} active={dateF===f.id} onClick={()=>setDateF(f.id)}/>)}</div>
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
          <p style={{fontSize:10,fontWeight:700,color:"#9ca3af",letterSpacing:1,margin:"0 0 8px 2px"}}>{labelDate(date)}</p>
          <Card style={{padding:"4px 0",marginBottom:12}}>
            {txns.map((t,i)=>{
              const acc=accounts.find(a=>a.id===t.accountId);
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
      {confirm&&<ConfirmDialog title="Hapus Transaksi?" sub={`"${confirm.note||"Transaksi"}" senilai ${fmt(confirm.amount)} akan dihapus.`} onConfirm={()=>{onDelete(confirm);setConfirm(null);}} onCancel={()=>setConfirm(null)}/>}
    </div>
  );
}

// ─── ACCOUNTS SCREEN ──────────────────────────────────────────────────────────
function AccountsScreen({ accounts, setAccounts, transactions, setTransactions, setSelectedAcc }) {
  const [editAcc,   setEditAcc]   = useState(null);
  const [showAdd,   setShowAdd]   = useState(false);
  const [delConfirm,setDelConfirm]= useState(null);
  const [animatingId, setAnimatingId] = useState(null);
  const total = accounts.reduce((s,a)=>s+a.balance,0);

  const moveUp = i => {
    if(i===0) return;
    setAnimatingId(accounts[i].id);
    const a=[...accounts]; [a[i-1],a[i]]=[a[i],a[i-1]]; setAccounts(a);
    setTimeout(()=>setAnimatingId(null),350);
  };
  const moveDown = i => {
    if(i===accounts.length-1) return;
    setAnimatingId(accounts[i].id);
    const a=[...accounts]; [a[i],a[i+1]]=[a[i+1],a[i]]; setAccounts(a);
    setTimeout(()=>setAnimatingId(null),350);
  };

  const handleSaveAcc = (updated, adjustment) => {
    setAccounts(p=>p.map(a=>a.id===updated.id ? {...a,...updated,balance:adjustment!=null?(a.balance+adjustment):a.balance} : a));
    if (adjustment!=null && adjustment!==0) {
      const adjTxn = { id:Date.now(), type:adjustment>0?"income":"expense", amount:Math.abs(adjustment), category:"Penyesuaian Saldo", note:`Penyesuaian saldo — ${updated.name}`, date:todayStr(), time:nowTime(), accountId:updated.id, detected:null, attachmentMeta:[] };
      setTransactions(p=>[adjTxn,...p]);
    }
    setEditAcc(null);
  };

  return (
    <div style={{padding:"0 16px 16px"}}>
      <div style={{background:`linear-gradient(145deg,${G},${G2})`,borderRadius:22,padding:"20px 22px",marginBottom:14}}>
        <p style={{color:"rgba(255,255,255,0.75)",fontSize:12,margin:"0 0 4px"}}>Total Semua Akun</p>
        <p style={{color:"#fff",fontSize:26,fontWeight:800,margin:0}}>{fmt(total)}</p>
      </div>
      <Row style={{marginBottom:10}}>
        <p style={{margin:0,fontSize:14,fontWeight:800,color:"#111"}}>Daftar Akun</p>
        <button type="button" onClick={()=>setShowAdd(true)} style={{background:GL,border:"none",borderRadius:10,padding:"7px 14px",color:G,fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:5}}><Plus size={14}/> Tambah</button>
      </Row>
      {accounts.length===0&&<Card style={{textAlign:"center",padding:"24px"}}><p style={{color:"#9ca3af",fontSize:13}}>Belum ada akun. Tambah sekarang!</p></Card>}
      
      <div style={{display:"flex", flexDirection:"column", gap:10}}>
        {accounts.map((acc,i)=>{
          const T=ACC_TYPES.find(t=>t.type===acc.type);
          const isAnim = animatingId===acc.id;
          return (
            <div key={acc.id} style={{transition:"transform .3s cubic-bezier(0.34,1.56,0.64,1), opacity .2s",transform:isAnim?"scale(1.02)":"scale(1)",opacity:isAnim?0.85:1,marginBottom:10}}>
              <Card style={{padding:0,overflow:"hidden",marginBottom:0}}>
                <button type="button" onClick={()=>setSelectedAcc({acc,idx:i})} style={{background:getAccGrad(acc,i),padding:"14px 16px",display:"flex",alignItems:"center",gap:12,width:"100%",border:"none",cursor:"pointer",outline:"none"}}>
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
                  <button type="button" onClick={()=>moveUp(i)} style={{flex:1,padding:"10px",background:"#fff",border:"none",borderRight:"1px solid #f1f5f9",color:"#9ca3af",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><ArrowUp size={14}/></button>
                  <button type="button" onClick={()=>moveDown(i)} style={{flex:1,padding:"10px",background:"#fff",border:"none",borderRight:"1px solid #f1f5f9",color:"#9ca3af",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><ArrowDown size={14}/></button>
                  <button type="button" onClick={()=>setEditAcc({acc,idx:i})} style={{flex:1,padding:"10px",background:"#fff",border:"none",borderRight:"1px solid #f1f5f9",color:G,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5,fontSize:12,fontWeight:600}}><Pencil size={13}/> Edit</button>
                  <button type="button" onClick={()=>setDelConfirm({acc,txnCount:transactions.filter(t=>t.accountId===acc.id).length})} style={{flex:1,padding:"10px",background:"#fff",border:"none",color:"#ef4444",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5,fontSize:12,fontWeight:600,borderRadius:"0 0 18px 0"}}><Trash2 size={13}/> Hapus</button>
                </div>
              </Card>
            </div>
          );
        })}
      </div>
      {editAcc&&<AccountModal initial={editAcc.acc} onClose={()=>setEditAcc(null)} isNew={false} onSave={handleSaveAcc}/>}
      {showAdd&&<AccountModal isNew onClose={()=>setShowAdd(false)} onSave={(a,_)=>{setAccounts(p=>[...p,{...a,id:Date.now(),balance:a.balance||0}]);setShowAdd(false);}}/>}
      {delConfirm&&<ConfirmDialog title="Hapus Akun?" sub={`Akun "${delConfirm.acc.name}" dan ${delConfirm.txnCount} transaksi terkait akan dihapus permanen.`} onConfirm={()=>{setAccounts(p=>p.filter(a=>a.id!==delConfirm.acc.id));setTransactions(p=>p.filter(t=>t.accountId!==delConfirm.acc.id));setDelConfirm(null);}} onCancel={()=>setDelConfirm(null)}/>}
    </div>
  );
}

// ─── CHARTS SCREEN ────────────────────────────────────────────────────────────
function ChartsScreen({ transactions }) {
  const totalInc=transactions.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);
  const totalExp=transactions.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);
  const pieData=useMemo(()=>{const m={};transactions.filter(t=>t.type==="expense").forEach(t=>{m[t.category]=(m[t.category]||0)+t.amount;});return Object.entries(m).sort((a,b)=>b[1]-a[1]).map(([name,value])=>({name,value,color:CAT_COLORS[name]||"#9ca3af",pct:totalExp>0?Math.round(value/totalExp*100):0}));},[transactions,totalExp]);
  const barData=useMemo(()=>{const w={"Mg 1":{income:0,expense:0},"Mg 2":{income:0,expense:0},"Mg 3":{income:0,expense:0},"Mg 4":{income:0,expense:0}};transactions.forEach(t=>{const d=new Date(t.date).getDate();const k=d<=7?"Mg 1":d<=14?"Mg 2":d<=21?"Mg 3":"Mg 4";w[k][t.type]+=t.amount;});return Object.entries(w).map(([name,v])=>({name,...v}));},[transactions]);
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
          <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center",pointerEvents:"none"}}>
            <p style={{margin:0,fontSize:10,color:"#9ca3af"}}>Total</p>
            <p style={{margin:0,fontSize:14,fontWeight:800,color:"#111"}}>{fmtShort(totalExp)}</p>
          </div>
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
function ProfileScreen({ userName, setUserName, userAvatar, setUserAvatar, transactions, accounts, pinEnabled, pinHash, setPinEnabled, setPinHash, bioEnabled, setBioEnabled, soundEnabled, setSoundEnabled, setTransactions, setAccounts, setShowImport }) {
  const [showSetPin,  setShowSetPin]  = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [editName,    setEditName]    = useState(false);
  const [nameInput,   setNameInput]   = useState(userName);
  const avatarRef = useRef();
  
  const handleAvatar = e => { const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>setUserAvatar(r.result);r.readAsDataURL(f); };
  const exportCSV = () => {
    const rows=[["Tanggal","Jam","Jenis","Jumlah","Kategori","Catatan","Akun"],...transactions.map(t=>[t.date,t.time||"",t.type==="income"?"Pemasukan":"Pengeluaran",t.amount,t.category,t.note,accounts.find(a=>a.id===t.accountId)?.name||""])];
    const csv=rows.map(r=>r.map(c=>JSON.stringify(String(c))).join(",")).join("\n");
    const a=document.createElement("a");a.href="data:text/csv;charset=utf-8,"+encodeURIComponent(csv);a.download="DompetKu_export.csv";a.click();
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
        <p style={{padding:"10px 16px 4px",margin:0,fontSize:10,fontWeight:700,color:"#9ca3af",letterSpacing:1}}>KEAMANAN</p>
        <SRow icon={<Lock size={15} strokeWidth={1.7}/>} title="Kunci PIN" sub={pinEnabled?"Aktif — app terkunci saat keluar background":"Nonaktif"} 
          right={<Tog on={pinEnabled} onToggle={()=>{ if(pinEnabled){setPinEnabled(false);setBioEnabled(false);}else{setShowSetPin(true);} }}/>}/>
        {pinEnabled&&<SRow icon={<Fingerprint size={15} strokeWidth={1.7}/>} title="Biometrik" sub="Gunakan sidik jari / wajah" right={<Tog on={bioEnabled} onToggle={()=>setBioEnabled(p=>!p)}/> }/>}
        {pinEnabled&&<SRow icon={<Shield size={15} strokeWidth={1.7}/>} title="Ganti PIN" right={<button type="button" onClick={()=>setShowSetPin(true)} style={{background:GL,border:"none",borderRadius:9,padding:"6px 12px",color:G,fontSize:12,fontWeight:600,cursor:"pointer"}}>Ubah</button>}/>}
      </Card>
      
      <Card style={{padding:"4px 0",marginBottom:12}}>
        <p style={{padding:"10px 16px 4px",margin:0,fontSize:10,fontWeight:700,color:"#9ca3af",letterSpacing:1}}>PREFERENSI</p>
        <SRow icon={soundEnabled?<Volume2 size={15}/>:<VolumeX size={15}/>} title="Efek Suara" sub="Suara saat mencatat transaksi" right={<Tog on={soundEnabled} onToggle={()=>setSoundEnabled(p=>!p)}/>}/>
      </Card>
      
      <Card style={{padding:"4px 0",marginBottom:12}}>
        <p style={{padding:"10px 16px 4px",margin:0,fontSize:10,fontWeight:700,color:"#9ca3af",letterSpacing:1}}>DATA</p>
        <SRow icon={<Upload size={15}/>} title="Import Data" sub="Excel dari Money Manager" right={<button type="button" onClick={()=>setShowImport(true)} style={{background:GL,border:"none",borderRadius:9,padding:"6px 12px",color:G,fontSize:12,fontWeight:600,cursor:"pointer"}}>Import</button>}/>
        <SRow icon={<Download size={15}/>} title="Export CSV" sub={`${transactions.length} transaksi`} right={<button type="button" onClick={exportCSV} style={{background:GL,border:"none",borderRadius:9,padding:"6px 12px",color:G,fontSize:12,fontWeight:600,cursor:"pointer"}}>Export</button>}/>
        <SRow icon={<Trash2 size={15}/>} bg="#fef2f2" title="Hapus Semua Data" danger right={<button type="button" onClick={()=>setShowConfirm(true)} style={{background:"#fef2f2",border:"none",borderRadius:9,padding:"6px 12px",color:"#ef4444",fontSize:12,fontWeight:600,cursor:"pointer"}}>Hapus</button>}/>
      </Card>
      
      <Card style={{padding:"4px 0"}}>
        <p style={{padding:"10px 16px 4px",margin:0,fontSize:10,fontWeight:700,color:"#9ca3af",letterSpacing:1}}>TENTANG</p>
        <SRow icon={<Star size={15}/>} title="DompetKu" sub="Versi 7.3 (Fully Audited)"/>
      </Card>
      
      {showSetPin&&<PinScreen mode="set" savedHash={pinHash} onSetPin={h=>{setPinHash(h);setPinEnabled(true);setShowSetPin(false);}} onCancel={()=>setShowSetPin(false)}/>}
      {showConfirm&&<ConfirmDialog title="Hapus Semua Data?" sub="Semua transaksi, akun, dan pengaturan akan dihapus. Tidak bisa dibatalkan." onConfirm={()=>{setTransactions([]);setAccounts([]);setShowConfirm(false);}} onCancel={()=>setShowConfirm(false)}/>}
    </div>
  );
}

// ─── FAN NAV (MERGED: Symmetric Grid + Staggered Arch Animations) ──────────────
const ARCH_ITEMS = [
  { id:"add",          dx:0,   dy:-75,  isAdd:true,  col:G,        label:"Catat",    delay:0   },
  { id:"transactions", dx:-85, dy:-75,  isAdd:false, col:"#3b82f6", label:"Transaksi",delay:45  },
  { id:"accounts",     dx:0,   dy:-155, isAdd:false, col:G,         label:"Akun",     delay:90  },
  { id:"charts",       dx:85,  dy:-75,  isAdd:false, col:"#8b5cf6", label:"Grafik",   delay:135 },
];

function FanNav({ tab, setTab, onAddTxn }) {
  const [open, setOpen] = useState(false);
  const navTo = id => { setTab(id); setOpen(false); };
  const handleArchItem = item => { if (item.isAdd) { onAddTxn(); setOpen(false); } else navTo(item.id); };

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
              background:"#fff",borderRadius:20,padding:"4px 10px", fontSize:10,fontWeight:700,color:"#111", border:"1.5px solid #e5e7eb",
              boxShadow:"0 3px 12px rgba(0,0,0,0.1)",whiteSpace:"nowrap",
              opacity: open ? 1 : 0, transform: open ? "translateY(0)" : "translateY(6px)",
              transition: open ? `opacity 0.2s ease ${item.delay + 80}ms, transform 0.2s ease ${item.delay + 80}ms` : "none",
            }}>{item.label}</div>
            <button type="button" onClick={()=>handleArchItem(item)} style={{
              width: item.isAdd ? 50 : 54, height: item.isAdd ? 50 : 54, borderRadius:"50%",
              background: item.isAdd ? `linear-gradient(145deg,${G},${G2})` : "#fff",
              border: item.isAdd ? "2.5px solid rgba(255,255,255,0.4)" : "2px solid #e5e7eb",
              boxShadow: item.isAdd ? `0 6px 20px ${item.col}55` : "0 4px 16px rgba(0,0,0,0.1)",
              cursor:"pointer", display:"flex",alignItems:"center",justifyContent:"center",
              color: item.isAdd ? "#fff" : G, outline:"none",
            }}>
              {item.isAdd ? <Plus size={24} strokeWidth={2.5}/>
                : item.id==="transactions" ? <List size={20} strokeWidth={1.8}/>
                : item.id==="accounts"     ? <CreditCard size={20} strokeWidth={1.8}/>
                : <BarChart2 size={20} strokeWidth={1.8}/>}
            </button>
          </div>
        );
      })}

      {/* Main Nav Container */}
      <div style={{
        position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)", width:"100%",maxWidth:430,
        background:"#fff",borderTop:"1px solid #f1f5f9",
        display:"grid",gridTemplateColumns:"1fr 80px 1fr",alignItems:"center",
        paddingBottom:"max(env(safe-area-inset-bottom,0px),12px)", paddingTop:8,
        zIndex:55, boxShadow:"0 -2px 16px rgba(0,0,0,0.06)"
      }}>
        {/* BERANDA */}
        <div style={{display:"flex",justifyContent:"center"}}>
          <button type="button" onClick={()=>{setTab("home");setOpen(false);}} style={{background:"none",border:"none",display:"flex",flexDirection:"column",alignItems:"center",gap:4,cursor:"pointer",padding:"4px 0"}}>
            <div style={{color:tab==="home"?G:"#9ca3af"}}><Home size={22} strokeWidth={2}/></div>
            <span style={{fontSize:10,fontWeight:tab==="home"?800:600,color:tab==="home"?G:"#9ca3af"}}>Beranda</span>
          </button>
        </div>
        {/* CENTER SPACER */}
        <div /> 
        {/* PROFIL */}
        <div style={{display:"flex",justifyContent:"center"}}>
          <button type="button" onClick={()=>{setTab("profile");setOpen(false);}} style={{background:"none",border:"none",display:"flex",flexDirection:"column",alignItems:"center",gap:4,cursor:"pointer",padding:"4px 0"}}>
            <div style={{color:tab==="profile"?G:"#9ca3af"}}><UserCircle size={22} strokeWidth={2}/></div>
            <span style={{fontSize:10,fontWeight:tab==="profile"?800:600,color:tab==="profile"?G:"#9ca3af"}}>Profil</span>
          </button>
        </div>
      </div>

      {/* Main FAB DompetKu */}
      <button type="button" onClick={()=>setOpen(p=>!p)} style={{
        position:"fixed", bottom:NAV_BOT, left:"50%", transform:`translateX(-50%)`,
        width:64,height:64,borderRadius:"50%",
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

  const [onboarded,    setOnboarded]    = useState(()=>lsGet("dk_onboarded",false));
  const [userName,     setUserName]     = useState(()=>lsGet("dk_name",""));
  const [userAvatar,   setUserAvatar]   = useState(()=>lsGet("dk_avatar",null));
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
  const [showImport,   setShowImport]   = useState(false);
  const [txnFilter,    setTxnFilter]    = useState(null);
  const [selectedAcc,  setSelectedAcc]  = useState(null);
  const [editTxn,      setEditTxn]      = useState(null);
  const [viewTxn,      setViewTxn]      = useState(null);
  const [searchOpen,   setSearchOpen]   = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  useEffect(()=>lsSet("dk_onboarded",onboarded),[onboarded]);
  useEffect(()=>lsSet("dk_name",userName),[userName]);
  useEffect(()=>lsSet("dk_avatar",userAvatar),[userAvatar]);
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

  // Improved History / Back Button Trapping
  useEffect(() => {
    window.history.pushState({dk: "home"}, "");
    const handlePopState = (e) => {
      window.history.pushState({dk: "home"}, ""); // Keep them trapped inside SPA
      if (locked) return;
      if (showExitConfirm) { setShowExitConfirm(false); return; }
      if (viewTxn) { setViewTxn(null); return; }
      if (editTxn) { setEditTxn(null); return; }
      if (showAdd) { setShowAdd(false); return; }
      if (showImport) { setShowImport(false); return; }
      if (selectedAcc) { setSelectedAcc(null); return; }
      if (tab !== "home") { setTab("home"); return; }
      setShowExitConfirm(true);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [locked, viewTxn, editTxn, showAdd, showImport, selectedAcc, tab, showExitConfirm]);

  const deleteTransaction = useCallback(txn=>{
    setTransactions(p=>p.filter(t=>t.id!==txn.id));
    setAccounts(p=>p.map(a=>a.id===txn.accountId?{...a,balance:a.balance+(txn.type==="income"?-txn.amount:txn.amount)}:a));
    (txn.attachmentMeta||[]).forEach(att=>IDB.del(att.id).catch(()=>{}));
  },[]);

  const addTransaction = useCallback(form=>{
    const newTxn={...form,id:Date.now(),detected:form.detected||null};
    setTransactions(p=>[newTxn,...p]);
    setAccounts(p=>p.map(a=>a.id===form.accountId?{...a,balance:a.balance+(form.type==="income"?form.amount:-form.amount)}:a));
    setShowAdd(false); setEditTxn(null);
  },[]);

  const updateTransaction = useCallback((original,updated)=>{
    setAccounts(p=>p.map(a=>{
      let bal=a.balance;
      if(a.id===original.accountId)bal+=original.type==="income"?-original.amount:original.amount;
      if(a.id===updated.accountId) bal+=updated.type==="income"?updated.amount:-updated.amount;
      return(a.id===original.accountId||a.id===updated.accountId)?{...a,balance:bal}:a;
    }));
    setTransactions(p=>p.map(t=>t.id===original.id?{...updated,id:original.id}:t));
    setEditTxn(null); setViewTxn(null);
  },[]);

  const importTxns = useCallback(txns=>{
    setTransactions(p => [...txns, ...p]);
    // Reconcile imported txns directly to accounts
    setAccounts(p => p.map(a => {
       const accDiff = txns.filter(t => t.accountId === a.id).reduce((sum, t) => sum + (t.type==="income"?t.amount:-t.amount), 0);
       return accDiff !== 0 ? { ...a, balance: a.balance + accDiff } : a;
    }));
    setShowImport(false);
  }, []);

  const titleMap={home:"Beranda",transactions:"Riwayat",accounts:"Akun",charts:"Analisis",profile:"Profil"};

  if(!onboarded)return<OnboardingScreen onDone={name=>{setUserName(name);setOnboarded(true);}}/>;
  if(locked&&pinEnabled)return<PinScreen mode="unlock" savedHash={pinHash} bioEnabled={bioEnabled} onUnlock={()=>setLocked(false)}/>;
  if(selectedAcc)return <AccountDetailScreen account={selectedAcc.acc} transactions={transactions} accIdx={selectedAcc.idx} onClose={()=>setSelectedAcc(null)} onEditAccount={()=>{setSelectedAcc(null);setTab("accounts");}}/>;

  return (
    <div style={{fontFamily:"'Outfit',sans-serif",background:BG,minHeight:"100vh",maxWidth:430,margin:"0 auto",paddingBottom:90}}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>
      <style>{`
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
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
          {/* Tanggal Atas Saja yang disisakan */}
          {tab==="transactions"&&<button type="button" onClick={()=>setSearchOpen(p=>!p)} style={{background:"#f1f5f9",border:"none",borderRadius:10,width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#374151"}}><Search size={15} strokeWidth={1.7}/></button>}
          {pinEnabled&&<button type="button" onClick={()=>setLocked(true)} style={{background:"#f1f5f9",border:"none",borderRadius:10,width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#374151"}}><Lock size={15} strokeWidth={1.7}/></button>}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{paddingTop:14}} className="screen" key={tab}>
        {tab==="home"&&<HomeScreen accounts={accounts} transactions={transactions} monthlyBudget={monthlyBudget} setMonthlyBudget={setMonthlyBudget} savedPct={savedPct} setSavedPct={setSavedPct} userName={userName} userAvatar={userAvatar} setTab={setTab} setTxnFilter={setTxnFilter} setSelectedAcc={setSelectedAcc} hidden={hidden} setHidden={setHidden} onTxnClick={t=>setViewTxn(t)}/>}
        {tab==="transactions"&&<TransactionsScreen transactions={transactions} accounts={accounts} onDelete={deleteTransaction} onEdit={t=>{setEditTxn(t);}} onTxnClick={t=>setViewTxn(t)} initialTypeFilter={txnFilter} onFilterConsumed={()=>setTxnFilter(null)} searchOpen={searchOpen} onSearchClose={()=>setSearchOpen(false)}/>}
        {tab==="accounts"&&<AccountsScreen accounts={accounts} setAccounts={setAccounts} transactions={transactions} setTransactions={setTransactions} setSelectedAcc={setSelectedAcc}/>}
        {tab==="charts"&&<ChartsScreen transactions={transactions}/>}
        {tab==="profile"&&<ProfileScreen userName={userName} setUserName={setUserName} userAvatar={userAvatar} setUserAvatar={setUserAvatar} transactions={transactions} accounts={accounts} pinEnabled={pinEnabled} pinHash={pinHash} setPinEnabled={setPinEnabled} setPinHash={h=>{setPinHash(h);setPinEnabled(true);}} bioEnabled={bioEnabled} setBioEnabled={setBioEnabled} soundEnabled={soundEnabled} setSoundEnabled={setSoundEnabled} setTransactions={setTransactions} setAccounts={setAccounts} setShowImport={setShowImport}/>}
      </div>

      {/* ULTIMATE FAN NAV */}
      <FanNav tab={tab} setTab={setTab} onAddTxn={()=>{ if(accounts.length===0){setTab("accounts");}else{setShowAdd(true);}}}/>

      {/* MODALS */}
      {showAdd&&accounts.length>0&&<TxnModal accounts={accounts} onClose={()=>setShowAdd(false)} onSave={addTransaction} soundEnabled={soundEnabled} isPickingFile={isPickingFile}/>}
      {editTxn&&<TxnModal initial={{...editTxn,amountStr:editTxn.amount.toLocaleString("id-ID")}} accounts={accounts} onClose={()=>setEditTxn(null)} onSave={updated=>updateTransaction(editTxn,updated)} soundEnabled={soundEnabled} isPickingFile={isPickingFile}/>}
      {showImport&&<ImportModal accounts={accounts} onClose={()=>setShowImport(false)} onImport={importTxns} isPickingFile={isPickingFile}/>}
      {viewTxn&&<TxnDetailSheet txn={viewTxn} accounts={accounts} onClose={()=>setViewTxn(null)} onEdit={t=>{ setViewTxn(null); setEditTxn(t); }} onDelete={t=>{ deleteTransaction(t); setViewTxn(null); }}/>}
      
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
