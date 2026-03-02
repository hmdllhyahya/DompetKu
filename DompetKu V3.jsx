// DompetKu Ultimate Version 7.4 (Audited & Patched)
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

// ─── BRAND MAP (dual-color gradients with brand primary + accent) ─────────────
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
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

const fmt       = n => "Rp " + Math.abs(n).toLocaleString("id-ID");
const fmtShort  = n => n>=1e9?(n/1e9).toFixed(1)+"M":n>=1e6?(n/1e6).toFixed(1)+"Jt":n>=1e3?(n/1e3).toFixed(0)+"K":String(n);
const mask      = n => "Rp " + "•".repeat(Math.min(7,String(Math.round(n)).length));

// Timezone safe dates
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
    <div style={{background:"#fff",borderRadius:20,padding:"24px",maxWidth:340,width:"100%",textAlign:"ce