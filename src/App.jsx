import { useState, useEffect, useMemo, useRef } from "react";

const DEFAULT_ADMIN_PIN    = "LCOLE";   // Lukeman's master PIN — change via Admin panel
const DEFAULT_ORG_PIN      = "2653";    // Default organizer PIN — admin can change anytime
const LS_ADMIN   = "1418_admin_pin";
const LS_ORG     = "1418_org_pin";
const LS_VERSION = "1418_pin_version";
const PIN_VERSION = "2";  // bump this to force-reset stored PINs to new defaults
// Reset stored PINs when version changes
if(localStorage.getItem(LS_VERSION) !== PIN_VERSION){
  localStorage.removeItem(LS_ADMIN);
  localStorage.removeItem(LS_ORG);
  localStorage.setItem(LS_VERSION, PIN_VERSION);
}
const getAdminPin = () => localStorage.getItem(LS_ADMIN) || DEFAULT_ADMIN_PIN;
const getOrgPin   = () => localStorage.getItem(LS_ORG)   || DEFAULT_ORG_PIN;

const P="#6B2D8B",PL="#F3E8FF",DK="#1A1A2E",GLD="#D4A843",GRN="#16A34A",OR="#EA580C",RED="#DC2626",BLU="#2563EB",WA="#25D366";
let _id=300;const uid=()=>++_id;

const ROSTER=[
  "Godwin Gabriel","Chinedu Akwukwaegbu","Christian Ogbebor","Kolawole Atandeyi","Tolu Ayoola",
  "Fela Olawale","Temzie Ayoola","Chris Eledu","Temitope Ayoola","Joshua Brookins",
  "Tiku Arrey","Anthony Onerhime","Elive Menyoli","Doks Odunsi","David Crigger",
  "Abimbola Bukoye","Bona Ngu","Emeka Attoh","Nick Nedu","Olu Jolaoso",
  "Chris Ogunro","Thomas Adache","Chima Nwaukwa","Oyewole Faleye","Dave Ayo Adewole",
  "Siva Sennimalai","AJ Oben","Shola Adekeye","Olawale Olagunju","Kunle Ajayi",
  "Joe Osei","Funsho Oke","Patrick Malone","Chris Okezie","Ngu Morcho",
  "Paul Ivonye","Anthony Suberu","Lukeman Cole","Taoridi Bello","Wole Olugbenle",
  "Victor Fagbola","Joe Fonlon","Ojong Mondoa","Adedotun Falade","Michael Anukwuem",
  "Dapo Akande","Emeka Uzoukwu","Ernest Nwapa","Bade Lawal","Uchenna Nwokafor",
  "Thomas Kagiri","Mohamed Adjarho Oyibo"
].map(n=>({id:uid(),name:n,hcp:null,signedUp:false,paid:false,payMethod:""}));

const COURSES=[
  {name:"Wildcat Golf Club",sub:"Highlands & Lakes",addr:"12000 Almeda Rd, Houston",tees:["Black","Blue","White","Gold","Red"]},
  {name:"Memorial Park Golf Course",sub:"PGA Tour Stop",addr:"1001 E Memorial Loop Dr, Houston",tees:["Black","Blue","White","Gold","Red"]},
  {name:"Hermann Park Golf Course",sub:"18-Hole Public",addr:"2155 N MacGregor Way, Houston",tees:["Blue","White","Gold","Red"]},
  {name:"Clear Creek Golf Club",sub:"New Greens 2025",addr:"3902 Fellows Rd, Houston",tees:["Black","Blue","White","Gold","Red"]},
  {name:"Golf Club of Houston",sub:"Championship & Members",addr:"5860 Wilson Rd, Humble",tees:["Black","Blue","White","Gold","Red"]},
  {name:"BlackHorse Golf Club",sub:"North & South",addr:"12205 Fry Rd, Cypress",tees:["Black","Blue","White","Gold","Red"]},
  {name:"Cypresswood Golf Club",sub:"Traditions & Cypress",addr:"21602 Cypresswood Dr, Spring",tees:["Black","Blue","White","Gold","Red"]},
  {name:"Gus Wortham Park Golf Course",sub:"Houston Hidden Gem",addr:"7000 Capitol St, Houston",tees:["Blue","White","Gold","Red"]},
  {name:"Tour 18 Golf Course",sub:"Replica Famous Holes",addr:"3102 FM 1960 E, Humble",tees:["Black","Blue","White","Gold","Red"]},
  {name:"Houston National Golf Club",sub:"36 Holes",addr:"16500 Houston National Blvd",tees:["Black","Blue","White","Gold","Red"]},
  {name:"Windrose Golf Club",sub:"Spring",addr:"6235 Pinelakes Blvd, Spring",tees:["Black","Blue","White","Gold"]},
  {name:"The Club at Falcon Point",sub:"Katy",addr:"24503 Falcon Point Dr, Katy",tees:["Blue","White","Gold","Red"]},
  {name:"The Golf Club at Longwood",sub:"Cypress",addr:"13300 Longwood Trace, Cypress",tees:["Blue","White","Gold","Red"]},
  {name:"Weston Lakes Country Club",sub:"Fulshear",addr:"5646 Weston Dr, Fulshear",tees:["Black","Blue","White","Gold","Red"]},
  {name:"Willow Creek Golf Club",sub:"Spring / Woodlands",addr:"24525 Northcrest Dr, Spring",tees:["Blue","White","Gold","Red"]},
];

const SCHEDULE=[
  {wk:1,date:"Sat Feb 28",name:"Season Opener: Ryder Cup",organizer:"Lukeman / Siva",format:"Match Play",pts:"Team",major:false,status:"completed"},
  {wk:2,date:"Sat Mar 14",name:"The Players Championship",organizer:"Wale Olagunju",format:"Stroke Play",pts:"2000",major:true,status:"open"},
  {wk:3,date:"Sat Mar 28",name:"Regular League Game",organizer:"Chris Ogunro",format:"Stroke Play",pts:"500",major:false,status:"open"},
  {wk:4,date:"Sat Apr 11",name:"The Masters",organizer:"Dapo 'SL' Akande",format:"Stroke Play",pts:"2000",major:true,status:"open"},
  {wk:5,date:"Sat Apr 25",name:"Regular League Game",organizer:"Bona Ngu",format:"Stroke Play",pts:"500",major:false,status:"open"},
  {wk:6,date:"Sat May 9",name:"Regular League Game",organizer:"David Crigger",format:"Stroke Play",pts:"500",major:false,status:"open"},
  {wk:7,date:"Sat May 16",name:"PGA Championship",organizer:"Dapo 'SL' Akande",format:"Stroke Play",pts:"2000",major:true,status:"open"},
  {wk:8,date:"Sat May 30",name:"Regular League Game",organizer:"'American Mike' Anukwuem",format:"Stroke Play",pts:"500",major:false,status:"open"},
  {wk:9,date:"Sat Jun 13",name:"Regular League Game",organizer:"Joshua Brookins",format:"Stroke Play",pts:"500",major:false,status:"open"},
  {wk:10,date:"Sat Jun 20",name:"U.S. Open",organizer:"Tiku Arrey",format:"Stroke Play",pts:"2000",major:true,status:"open"},
  {wk:11,date:"Sat Jun 27",name:"Regular League Game",organizer:"Elive Menyoli",format:"Stroke Play",pts:"500",major:false,status:"open"},
  {wk:12,date:"Sat Jul 11",name:"Regular League Game",organizer:"Dave Adewole",format:"Stroke Play",pts:"500",major:false,status:"open"},
  {wk:13,date:"Sat Jul 18",name:"The Open Championship",organizer:"Chris Eledu",format:"Stroke Play",pts:"2000",major:true,status:"open"},
  {wk:14,date:"Sat Jul 25",name:"Regular League Game",organizer:"Ordinary Wole",format:"Stroke Play",pts:"500",major:false,status:"open"},
  {wk:15,date:"Sat Aug 29",name:"NAGG Dallas vs 1418 Rematch",organizer:"Christian / Chinedu",format:"Stroke Play",pts:"Team",major:false,status:"open"},
  {wk:16,date:"Sat Sep 12",name:"Regular League Game",organizer:"Ngu Morcho",format:"Stroke Play",pts:"500",major:false,status:"open"},
  {wk:17,date:"Sat Sep 26",name:"Regular League Game",organizer:"Godwin Gabriel",format:"Stroke Play",pts:"500",major:false,status:"open"},
  {wk:18,date:"Sat Oct 10",name:"Regular League Game",organizer:"Fela Olawale",format:"Stroke Play",pts:"500",major:false,status:"open"},
  {wk:19,date:"Sat Oct 24",name:"Playoff - Match Day 1",organizer:"Patrick Malone",format:"Stroke Play",pts:"2000",major:false,status:"open"},
  {wk:20,date:"Sat Nov 7",name:"Tour Championship Finale",organizer:"Olu Jolaoso",format:"Stroke Play",pts:"2000",major:false,status:"open"},
];

// ── Pairing Algos ──
function autoStroke(p){const s=[...p].sort((a,b)=>a.hcp-b.hcp);const n=Math.ceil(s.length/4);const g=Array.from({length:n},()=>[]);let fwd=true,gi=0;for(const x of s){g[gi].push(x);if(fwd){if(gi>=n-1)fwd=false;else gi++;}else{if(gi<=0)fwd=true;else gi--;}}return g.filter(x=>x.length>0);}
function autoMatch(p){const s=[...p].sort((a,b)=>a.hcp-b.hcp);const pr=[];for(let i=0;i<s.length-1;i+=2)pr.push([s[i],s[i+1]]);if(s.length%2)pr.push([s[s.length-1],null]);return pr;}
function autoBestBall(p){const s=[...p].sort((a,b)=>a.hcp-b.hcp);const t=[];let lo=0,hi=s.length-1;while(lo<hi){t.push([s[lo],s[hi]]);lo++;hi--;}if(lo===hi)t.push([s[lo],null]);const w=t.map(x=>({t:x,avg:x[1]?(x[0].hcp+x[1].hcp)/2:x[0].hcp}));w.sort((a,b)=>a.avg-b.avg);const m=[];for(let i=0;i<w.length-1;i+=2)m.push([w[i].t,w[i+1].t]);if(w.length%2)m.push([w[w.length-1].t,[null,null]]);return m;}

function getNextThursday4PM(){const now=new Date();const d=new Date(now);const day=d.getDay();const diff=((4-day)+7)%7||7;d.setDate(d.getDate()+diff);d.setHours(16,0,0,0);if(now>d)d.setDate(d.getDate()+7);return d;}
function fmtCD(ms){if(ms<=0)return"CLOSED";const h=Math.floor(ms/3600000);const m=Math.floor((ms%3600000)/60000);if(h>=24)return`${Math.floor(h/24)}d ${h%24}h`;return`${h}h ${m}m`;}

const STATUS_COLORS={open:{bg:"#D1FAE5",border:GRN,color:GRN,label:"🟢 Open"},locked:{bg:"#FEF3C7",border:"#F59E0B",color:"#92400E",label:"🔒 Locked"},completed:{bg:"#F3F4F6",border:"#9CA3AF",color:"#6B7280",label:"✅ Completed"}};

// ── Que Chatbot Knowledge Base ──
const QUE_KB=[
  {k:["hello","hi","hey","sup","what's up","wassup"],r:"Hey! ⛳ I'm Que, the 1418 Golf Society assistant. Ask me anything about the app, tournaments, rules, payments, or the 2026 season!"},
  {k:["sign up","signup","register","join","how do i","in"],r:"To sign up for an event:\n1️⃣ Go to the 📋 Sign-Up tab\n2️⃣ Find your name and tap the checkbox ✓\n3️⃣ Enter your handicap (HC box)\n4️⃣ Pay your kitty and tap your payment method (Zelle/PP/Cash$)\n\nDeadline is every Thursday at 4:00 PM CST. Late sign-ups = no 1418 Cup points! ⏰"},
  {k:["pay","payment","zelle","paypal","cashapp","cash app","kitty","how much","fee","cost"],r:"💰 Kitty is $20 per game (set by organizer).\n\nPayment methods:\n💳 Zelle: 7138342023\n💳 PayPal: @ChristianOgbebor\n💳 CashApp: $Cogbebor\n\nPay AND confirm sign-up before Thursday 4PM to lock in your spot."},
  {k:["payout","prize","win","winning","money","split","gross","net"],r:"🏆 Payout split is fixed: *30 / 40 / 30*\n\n🥇 Lowest Gross: 30%\n🥈 1st Lowest Net: 40%\n🥉 2nd Lowest Net: 30%\n\nExample with 20 players at $20 kitty = $400 pool:\n🥇 $120 · 🥈 $160 · 🥉 $120\n\nOrganizer pays out after scores are confirmed on The Grint."},
  {k:["deadline","when","thursday","close","cutoff"],r:"⏰ Sign-up deadline is every *Thursday at 4:00 PM CST* before the Saturday event.\n\nAfter the deadline the organizer locks the event and generates pairings. Late entries won't earn 1418 Cup points."},
  {k:["pairing","group","pair","tee time","who am i with","format"],r:"🏌️ Pairings are generated by the organizer after sign-up closes.\n\n3 formats available:\n• *Stroke Play* — groups of 4, balanced by handicap\n• *Match Play* — 1v1 matchups by handicap\n• *Best Ball* — 2v2 teams, mixed handicap\n\nOrganizers can drag/tap to swap players after generation."},
  {k:["handicap","hcp","index","strokes","how many"],r:"Your handicap (HC) is entered during sign-up. It's used to:\n• Balance pairings fairly\n• Calculate Net scores for payout\n\nIf you don't know yours, check The Grint app or ask your playing partners. Enter it honestly — this is 1418! 😄"},
  {k:["major","majors","big","championship","points","2000"],r:"🏆 2026 has *5 Majors* worth 2000 points each:\n1. The Players Championship — Mar 14\n2. The Masters — Apr 11\n3. PGA Championship — May 16\n4. U.S. Open — Jun 20\n5. The Open Championship — Jul 18\n\nRegular games = 500 points. Majors are the ones that make legends! 🔥"},
  {k:["schedule","season","when is","next game","upcoming","calendar","date"],r:"📅 The 2026 season has *20 events*:\n• 5 Majors (2000 pts)\n• 12 Regular games (500 pts)\n• 2 Team events (Ryder Cup + NAGG Dallas Rematch)\n• Playoffs (Oct 24) + Tour Championship Finale (Nov 7)\n\nCheck the 📅 Schedule tab to see all dates and organizers!"},
  {k:["ryder","team","nagg","dallas"],r:"🤝 There are 2 team events in 2026:\n1. *Season Opener: Ryder Cup* — Feb 28 (✅ Completed)\n2. *NAGG Dallas vs 1418 Rematch* — Aug 29\n\nTeam events use Match Play format and award team points (no individual kitty split)."},
  {k:["cup","money list","leaderboard","points","standings","rank","who's winning"],r:"🏆 *2025 Champions (reigning):\n• 1418 Cup: Lukeman Cole 👑 (back-to-back!)\n• Double Major: Dapo 'SL' Akande (Masters + PGA)\n• Money List: #1 Lukeman · #2 Chris Eledu · #3 Dafe Sejebor\n\n2026 standings update after each event. Regular = 500pts, Majors = 2000pts."},
  {k:["organizer","who is","running","manage","host","admin","pin","access"],r:"Each event has a designated organizer — check the 📅 Schedule tab to see who's running each game.\n\nOrganizer functions (pairings, status changes) require the *Organizer PIN* — get this from the admin (Lukeman) before your event.\n\nAdmin can update the PIN anytime via the ⚙️ button in the nav bar."},
  {k:["course","venue","where","location","play","field"],r:"⛳ 15 Houston-area courses are pre-loaded:\nWildcat, Memorial Park, Hermann Park, Clear Creek, Golf Club of Houston, BlackHorse, Cypresswood, Gus Wortham, Tour 18, Houston National, Windrose, Falcon Point, Longwood, Weston Lakes, Willow Creek.\n\nOrganizers pick the course + tee colour during sign-up setup."},
  {k:["whatsapp","message","send","copy","notify","announce","blast"],r:"💬 The WhatsApp tab has 5 ready-to-copy messages:\n1. 📢 Sign-Up Announcement\n2. 📊 Status Update (who's paid)\n3. ⚠️ Payment Reminder\n4. 🏌️ Pairings (once generated)\n5. 🏆 Payout Summary\n\nJust tap *📋 Copy* and paste straight into the 1418 WhatsApp group!"},
  {k:["how to use","help","guide","tutorial","tour","train","walkthrough","start","new","confused"],r:"🎓 Want a guided tour? Tap the *🎓 Tour* button at the bottom of the screen!\n\nOr ask me about any specific feature:\n• Sign-up process\n• Generating pairings\n• Payment tracking\n• WhatsApp messages\n• Payout calculator\n• Organizer access"},
  {k:["guest","visitor","non-member","add","new player","extra"],r:"You can add guests during sign-up! Scroll to the bottom of the player list in the 📋 Sign-Up tab → enter their name + handicap → tap *+ Guest*.\n\nGuests are listed for that event but don't earn 1418 Cup points."},
  {k:["locked","completed","status","open","close","finish"],r:"Events have 3 statuses (organizer only):\n🟢 *Open* — sign-ups active, members registering\n🔒 *Locked* — sign-ups closed, game day\n✅ *Completed* — event done\n\nChange status using the buttons on each event row in the 📅 Schedule tab."},
  {k:["rule","usga","stroke","net","gross","handicap allowance"],r:"1418 follows *USGA Rules of Golf* with standard stroke play scoring.\n\n• Net score = Gross score − Handicap\n• Payout based on Lowest Gross + Lowest/2nd Net\n• All scores confirmed via *The Grint* app\n• Disputes → contact the event organizer"},
  {k:["contact","committee","reach","email","phone","paul","christian","lukeman"],r:"📞 1418 Committee:\n• *Lukeman Cole* — Admin / President\n• *Paul Ivonye* — Committee Member\n• *Christian Ogbebor* — Treasurer\n\nPayment queries → Christian (Zelle: 7138342023)\nApp issues → Lukeman"},
];

// ── Que AI Proxy (set this once deployed) ──
const QUE_PROXY_URL = "https://1418-que-proxy-production.up.railway.app/chat";

function queReply(input){
  const q=input.toLowerCase().trim();
  if(!q) return null;
  for(const item of QUE_KB){
    if(item.k.some(kw=>q.includes(kw))) return item.r;
  }
  return `Hmm, I don't have a specific answer for that yet! 🤔\n\nTry asking about:\n• Sign-up & payment\n• Pairings & formats\n• Payout split\n• The 2026 schedule\n• Organizer access\n\nOr contact Lukeman directly for anything else! ⛳`;
}

async function queAI(messages){
  try{
    const res=await fetch(QUE_PROXY_URL,{
      method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({messages}),signal:AbortSignal.timeout(8000)
    });
    if(!res.ok) throw new Error("proxy error");
    const d=await res.json();
    return d.reply||null;
  }catch{return null;}
}

const TOUR_STEPS=[
  {tab:"schedule",emoji:"👋",title:"Welcome to 1418 Tournament Manager!",body:"This app helps you manage the entire 2026 golf season — from sign-ups to pairings to payouts. Let's take a quick tour of each section. Tap Next to continue.",highlight:null},
  {tab:"schedule",emoji:"📅",title:"Schedule Tab",body:"Here's your full 20-event 2026 season. Tap any event row to select it and start managing sign-ups. Use the 🟢 🔒 ✅ buttons to change event status (Open → Locked → Completed). Organizer PIN required for status changes.",highlight:"schedule"},
  {tab:"signup",emoji:"📋",title:"Sign-Up Tab",body:"After selecting an event, manage registrations here. Pick your course, tee colour, and kitty amount. Check players in, record their handicap, and mark their payment method (Zelle/PayPal/CashApp). The deadline countdown is live — Thursday 4PM CST.",highlight:"signup"},
  {tab:"signup",emoji:"➕",title:"Adding Guests",body:"Non-members can be added as guests. Scroll to the bottom of the player list, type the guest's name and handicap, then tap + Guest. They'll appear in pairings but won't earn 1418 Cup points.",highlight:"signup"},
  {tab:"pairings",emoji:"🏌️",title:"Pairings Tab",body:"Once players are signed up and paid, organizers can generate pairings here. Choose your format — Stroke Play (groups of 4), Match Play (1v1), or Best Ball (2v2) — then tap Generate. On mobile, tap two players to swap them.",highlight:"pairings"},
  {tab:"messages",emoji:"💬",title:"WhatsApp Tab",body:"Five pre-formatted messages ready to copy-paste into your WhatsApp group: Sign-Up Announcement, Status Update, Payment Reminder, Pairings, and Payout Summary. All auto-populated with your event details.",highlight:"messages"},
  {tab:"payout",emoji:"💰",title:"Payout Tab",body:"The 30/40/30 split is automatically calculated based on how many players paid. 🥇 Lowest Gross (30%) · 🥈 1st Lowest Net (40%) · 🥉 2nd Lowest Net (30%). Copy the payout message for WhatsApp when ready.",highlight:"payout"},
  {tab:"schedule",emoji:"🔒",title:"Organizer PIN",body:"Sensitive actions — generating pairings and changing event status — require the Organizer PIN. Contact the admin (Lukeman) to get your PIN before each event. Admins can update the PIN anytime via the ⚙️ button.",highlight:null},
  {tab:"schedule",emoji:"🎉",title:"You're all set!",body:"That's the full tour! You now know everything you need to manage a 1418 tournament like a pro. ⛳\n\nRemember: sign-ups close Thursday 4PM · Pay via Zelle/PayPal/CashApp · Payout is 30/40/30\n\nLet's play some golf! 🏌️🔥",highlight:null},
];

function Chip({player,draggable,onDragStart,onDragOver,onDrop,onClick,selected}){
  if(!player)return(<div onDragOver={onDragOver} onDrop={onDrop} onClick={onClick} style={{padding:"6px 12px",borderRadius:8,border:"2px dashed #D1D5DB",color:"#aaa",fontSize:12,minWidth:80,textAlign:"center",background:"#FAFAFA"}}>Empty</div>);
  return(<div draggable={draggable} onDragStart={onDragStart} onDragOver={onDragOver} onDrop={onDrop} onClick={onClick}
    style={{padding:"6px 12px",borderRadius:8,background:selected?"#FEF3C7":"#EEF2FF",border:`1.5px solid ${selected?GLD:"#A5B4FC"}`,cursor:draggable?"grab":"pointer",fontSize:13,fontWeight:600,color:DK,display:"inline-flex",alignItems:"center",gap:6,userSelect:"none",boxShadow:selected?`0 0 0 2px ${GLD}`:"none",transition:"all 0.15s"}}>
    <span>{player.name}</span><span style={{background:"#818CF8",color:"#fff",borderRadius:4,padding:"1px 6px",fontSize:10,fontWeight:700}}>{player.hcp}</span></div>);
}

export default function App(){
  const[tab,setTab]=useState("home");

  // ── Auth state ──
  const[isOrganizer,setIsOrganizer]=useState(false);
  const[isAdmin,setIsAdmin]=useState(false);

  // ── PIN modal ──
  const[showPinModal,setShowPinModal]=useState(false);
  const[pinMode,setPinMode]=useState("organizer"); // "organizer" | "admin"
  const[pinInput,setPinInput]=useState("");
  const[pinError,setPinError]=useState(false);
  const[pinPendingAction,setPinPendingAction]=useState(null);
  const pinRef=useRef(null);

  // ── Admin panel ──
  const[showAdminPanel,setShowAdminPanel]=useState(false);
  const[newOrgPin,setNewOrgPin]=useState("");
  const[newAdminPin,setNewAdminPin]=useState("");
  const[confirmAdminPin,setConfirmAdminPin]=useState("");
  const[adminSaved,setAdminSaved]=useState(null); // "org"|"admin"

  // ── My Identity ──
  const[myName,setMyName]=useState(()=>localStorage.getItem("1418_myname")||null);
  const[nameSearch,setNameSearch]=useState("");
  const[toast,setToast]=useState(null);

  // ── Chatbot ──
  const[showChat,setShowChat]=useState(false);
  const[chatMsgs,setChatMsgs]=useState([{from:"que",text:"Hey! ⛳ I'm *Que*, your 1418 assistant. Ask me anything about the app, tournaments, payments, rules, or the 2026 season!"}]);
  const[chatInput,setChatInput]=useState("");
  const chatBottomRef=useRef(null);
  const chatInputRef=useRef(null);

  // ── Tour ──
  const[tourActive,setTourActive]=useState(false);
  const[tourStep,setTourStep]=useState(0);
  const[players,setPlayers]=useState(ROSTER);
  const[schedule,setSchedule]=useState(SCHEDULE);
  const[selIdx,setSelIdx]=useState(null);
  const[search,setSearch]=useState("");
  const[filterView,setFilterView]=useState("all");
  const[ev,setEv]=useState({course:"",courseTee:"White",kittyAmt:"20",customCourse:""});
  const[courseSearch,setCourseSearch]=useState("");
  const[showCourseList,setShowCourseList]=useState(false);
  const[pairFmt,setPairFmt]=useState("stroke");
  const[pairings,setPairings]=useState([]);
  const[drag,setDrag]=useState(null);
  const[touchSel,setTouchSel]=useState(null);
  const[copied,setCopied]=useState(null);
  const[addName,setAddName]=useState("");
  const[addHcp,setAddHcp]=useState("");
  const[now,setNow]=useState(Date.now());

  useEffect(()=>{const t=setInterval(()=>setNow(Date.now()),60000);return()=>clearInterval(t);},[]);
  useEffect(()=>{chatBottomRef.current?.scrollIntoView({behavior:"smooth"});},[chatMsgs,showChat]);
  useEffect(()=>{if(showChat)setTimeout(()=>chatInputRef.current?.focus(),200);},[showChat]);

  // Tour: auto-switch tab when step changes
  useEffect(()=>{if(tourActive&&TOUR_STEPS[tourStep])setTab(TOUR_STEPS[tourStep].tab);},[tourActive,tourStep]);

  const sendChat=async()=>{
    const txt=chatInput.trim();if(!txt)return;
    const newMsgs=[...chatMsgs,{from:"user",text:txt}];
    setChatMsgs(newMsgs);
    setChatInput("");
    // Show typing indicator
    setChatMsgs(m=>[...m,{from:"que",text:"⛳ …",typing:true}]);
    // Try AI proxy first, fall back to keyword KB
    const aiReply=await queAI(newMsgs.filter(m=>!m.typing));
    const reply=aiReply||queReply(txt)||"I'm not sure about that one — try asking Lukeman directly! ⛳";
    setChatMsgs(m=>[...m.filter(x=>!x.typing),{from:"que",text:reply}]);
  };
  const startTour=()=>{setShowChat(false);setTourStep(0);setTourActive(true);};
  const endTour=()=>setTourActive(false);

  const selEvent=selIdx!==null?schedule[selIdx]:null;
  const deadline=getNextThursday4PM();const msLeft=deadline.getTime()-now;
  const deadlinePassed=msLeft<=0;const isUrgent=msLeft>0&&msLeft<86400000;

  const signedUp=players.filter(p=>p.signedUp);
  const paid=players.filter(p=>p.paid);
  const unpaid=signedUp.filter(p=>!p.paid);
  const readyForPairing=players.filter(p=>p.signedUp&&p.paid&&p.hcp!==null);
  const kittyAmt=parseInt(ev.kittyAmt||"0");
  const totalKitty=paid.length*kittyAmt;
  // Fixed split: 30% Lowest Gross / 40% 1st Net / 30% 2nd Net
  const payGross=Math.round(totalKitty*0.30);
  const pay1stNet=Math.round(totalKitty*0.40);
  const pay2ndNet=totalKitty-payGross-pay1stNet;

  const setStatus=(wk,status)=>requireOrganizer(()=>setSchedule(s=>s.map(e=>e.wk===wk?{...e,status}:e)));

  const pickEvent=(idx)=>{
    setSelIdx(idx);const e=schedule[idx];
    setPairFmt(e.format==="Match Play"?"match":"stroke");
    setTab("signup");
  };

  const selectCourse=(c)=>{setEv(p=>({...p,course:c.name,customCourse:""}));setCourseSearch("");setShowCourseList(false);};
  const selectedCourseObj=COURSES.find(c=>c.name===ev.course);
  const availableTees=selectedCourseObj?.tees||["Black","Blue","White","Gold","Red"];

  const toggle=(id,field)=>{setPlayers(r=>r.map(p=>{if(p.id!==id)return p;if(field==="signedUp"&&p.signedUp)return{...p,signedUp:false,paid:false,payMethod:""};if(field==="paid")return{...p,paid:!p.paid};return{...p,[field]:!p[field]};}));};
  const setPayMethod=(id,m)=>setPlayers(r=>r.map(p=>p.id===id?{...p,payMethod:m,paid:true}:p));
  const setHcp=(id,v)=>{const n=v===""?null:parseInt(v);setPlayers(r=>r.map(p=>p.id===id?{...p,hcp:isNaN(n)?null:n}:p));};
  const addGuest=()=>{if(!addName.trim())return;setPlayers(r=>[...r,{id:uid(),name:addName.trim(),hcp:addHcp?parseInt(addHcp):null,signedUp:true,paid:false,payMethod:""}]);setAddName("");setAddHcp("");};

  const generatePairings=()=>{const p=readyForPairing;if(pairFmt==="stroke")setPairings(autoStroke(p));else if(pairFmt==="match")setPairings(autoMatch(p));else setPairings(autoBestBall(p));setTab("pairings");};
  const generate=()=>requireOrganizer(generatePairings);

  const findAndSwap=(ti,ts,dp)=>{setPairings(prev=>{
    if(pairFmt==="stroke"){const n=prev.map(g=>[...g]);for(let gi=0;gi<n.length;gi++)for(let si=0;si<n[gi].length;si++)if(n[gi][si]?.id===dp.id){const t=n[ti][ts];n[gi][si]=t;n[ti][ts]=dp;return n;}return n;}
    else if(pairFmt==="match"){const n=prev.map(p=>[...p]);for(let pi=0;pi<n.length;pi++)for(let si=0;si<n[pi].length;si++)if(n[pi][si]?.id===dp.id){const t=n[ti][ts];n[pi][si]=t;n[ti][ts]=dp;return n;}return n;}
    else{const n=prev.map(m=>[m[0].map(x=>x),m[1].map(x=>x)]);const tT=Math.floor(ts/10),sT=ts%10;for(let mi=0;mi<n.length;mi++)for(let ti2=0;ti2<2;ti2++)for(let si=0;si<n[mi][ti2].length;si++)if(n[mi][ti2][si]?.id===dp.id){const t=n[ti][tT][sT];n[mi][ti2][si]=t;n[ti][tT][sT]=dp;return n;}return n;}
  });};

  const handleTS=(idx,slot,player)=>{if(!touchSel)setTouchSel({idx,slot,player});else{if(touchSel.player.id!==player?.id)findAndSwap(idx,slot,touchSel.player);setTouchSel(null);}};

  const cpClip=(text,key)=>{if(navigator.clipboard?.writeText){navigator.clipboard.writeText(text).then(()=>{setCopied(key);setTimeout(()=>setCopied(null),2500);});}else{const ta=document.createElement("textarea");ta.value=text;ta.style.cssText="position:fixed;left:-9999px";document.body.appendChild(ta);ta.select();try{document.execCommand("copy");setCopied(key);setTimeout(()=>setCopied(null),2500);}catch(e){}document.body.removeChild(ta);}};

  const filtered=useMemo(()=>{let list=players;if(search)list=list.filter(p=>p.name.toLowerCase().includes(search.toLowerCase()));if(filterView==="signedup")list=list.filter(p=>p.signedUp);if(filterView==="paid")list=list.filter(p=>p.paid);if(filterView==="unpaid")list=list.filter(p=>p.signedUp&&!p.paid);return list;},[players,search,filterView]);

  const courseName=ev.course||ev.customCourse||"[Course]";
  const eName=selEvent?(selEvent.name+(selEvent.major?" (Major)":"")):"[Event]";
  const eDate=selEvent?.date||"[Date]";
  const eOrg=selEvent?.organizer||"[Organizer]";

  // ── WhatsApp Messages ──
  const waSignup=()=>[`⛳ *1418 GOLF SOCIETY — ${eName}*`,`📅 ${eDate} | ⛳ ${courseName}`,`🎯 Organizer: ${eOrg}`,`🏌️ Tees: ${ev.courseTee}`,``,`📝 *SIGN-UP IS OPEN!*`,`💰 Kitty: $${ev.kittyAmt}`,``,`To confirm your spot:`,`1️⃣ Reply 'IN' to this message`,`2️⃣ Send $${ev.kittyAmt} via:`,`   💳 Zelle: 7138342023`,`   💳 PayPal: @ChristianOgbebor`,`   💳 CashApp: $Cogbebor`,``,`⏰ *Deadline: Thursday 4:00 PM CST*`,`Late sign-ups = no 1418 Cup points!`,``,`Let's go! 🔥`].join("\n");

  const waStatus=()=>{const L=[`📊 *${eName} — Sign-Up Status*`,`📅 ${eDate} | ⛳ ${courseName} (${ev.courseTee} tees)`,`🎯 ${eOrg}`,``,`✅ *Confirmed & Paid (${paid.length}):*`];paid.forEach((p,i)=>L.push(`${i+1}. ${p.name}`));if(unpaid.length){L.push("");L.push(`⚠️ *Payment Pending (${unpaid.length}):*`);unpaid.forEach((p,i)=>L.push(`${i+1}. ${p.name}`));}L.push("");L.push(`💰 Pool: $${totalKitty} (${paid.length} × $${ev.kittyAmt})`);L.push(!deadlinePassed?`⏰ ${fmtCD(msLeft)} left`:"🔒 CLOSED");return L.join("\n");};

  const waReminder=()=>{if(!unpaid.length)return"Everyone is paid up! 🎉";return[`⚠️ *PAYMENT REMINDER — ${eName}*`,`📅 ${eDate}`,``,`Still need to pay:`,``,...unpaid.map((p,i)=>`${i+1}. ${p.name}`),``,`💰 $${ev.kittyAmt} via:`,`   💳 Zelle: 7138342023 | PayPal: @ChristianOgbebor | CashApp: $Cogbebor`,``,!deadlinePassed?`⏰ *${fmtCD(msLeft)} left!*`:"🔒 *Deadline passed!*",``,`No payment = no points! 🏌️`].join("\n");};

  const waPairings=()=>{const L=[];
    if(pairFmt==="stroke"){L.push(`🏌️ *1418 GOLF SOCIETY — ${eName}*`,`📅 ${eDate} | ⛳ ${courseName} (${ev.courseTee} tees)`,`🎯 Organizer: ${eOrg}`,"");pairings.forEach((g,i)=>L.push(`⛳ *Group ${i+1}:* ${g.filter(Boolean).map(p=>`${p.name} (${p.hcp})`).join(", ")}`));}
    else if(pairFmt==="match"){L.push(`⚔️ *1418 MATCH PLAY — ${eName}*`,`📅 ${eDate} | ⛳ ${courseName}`,"");pairings.forEach(([a,b],i)=>{if(a&&b)L.push(`Match ${i+1}: ${a.name} (${a.hcp}) vs ${b.name} (${b.hcp}) — ${Math.abs(a.hcp-b.hcp)} strokes`);else if(a)L.push(`Match ${i+1}: ${a.name} (${a.hcp}) — BYE`);});L.push("","🏆 Win = 3 pts | Tie = 1 pt");}
    else{L.push(`🤝 *1418 BEST BALL — ${eName}*`,`📅 ${eDate} | ⛳ ${courseName}`,"");pairings.forEach(([tA,tB],i)=>{const nA=tA.filter(Boolean).map(p=>p.name).join(" & ");const nB=tB.filter(Boolean).map(p=>p.name).join(" & ");const aA=tA.filter(Boolean).length===2?((tA[0].hcp+tA[1].hcp)/2).toFixed(1):tA[0]?.hcp||"?";const aB=tB.filter(Boolean).length===2?((tB[0].hcp+tB[1].hcp)/2).toFixed(1):tB[0]?.hcp||"?";L.push(`Match ${i+1}: ${nA} (Avg ${aA}) vs ${nB} (Avg ${aB})`);});}
    L.push("",`💰 Kitty: $${ev.kittyAmt} | Pay by Thursday 4PM CST`,"Good luck everyone! ⛳🔥");return L.join("\n");};

  const waPayout=()=>[`🏆 *${eName} — Payout Summary*`,`📅 ${eDate} | ⛳ ${courseName}`,``,`👥 ${paid.length} players | 💰 Pool: $${totalKitty}`,`📊 Split: 30 / 40 / 30`,``,`🥇 Lowest Gross: $${payGross}`,`🥈 1st Lowest Net: $${pay1stNet}`,`🥉 2nd Lowest Net: $${pay2ndNet}`,``,`Organizer: pay winners after scores confirmed on Grint.`,``,`Great round everyone! ⛳🔥`].join("\n");

  // ── Auth helpers ──
  const requireOrganizer=(action)=>{
    if(isOrganizer||isAdmin){action();return;}
    setPinMode("organizer");
    setPinPendingAction(()=>action);
    setPinInput("");setPinError(false);
    setShowPinModal(true);
    setTimeout(()=>pinRef.current?.focus(),100);
  };
  const requireAdmin=(action)=>{
    if(isAdmin){action();return;}
    setPinMode("admin");
    setPinPendingAction(()=>action);
    setPinInput("");setPinError(false);
    setShowPinModal(true);
    setTimeout(()=>pinRef.current?.focus(),100);
  };
  const submitPin=()=>{
    const correct = pinMode==="admin" ? getAdminPin() : getOrgPin();
    if(pinInput===correct){
      if(pinMode==="admin"){setIsAdmin(true);setIsOrganizer(true);}
      else setIsOrganizer(true);
      setShowPinModal(false);
      if(pinPendingAction)pinPendingAction();
      setPinPendingAction(null);
    }else{setPinError(true);setPinInput("");}
  };
  const lockAll=()=>{setIsOrganizer(false);setIsAdmin(false);setShowAdminPanel(false);};

  // ── Toast ──
  const showToast=(msg)=>{setToast(msg);setTimeout(()=>setToast(null),2400);};

  // ── My Name ──
  const saveName=(n)=>{localStorage.setItem("1418_myname",n);setMyName(n);};
  const clearName=()=>{localStorage.removeItem("1418_myname");setMyName(null);setNameSearch("");};
  const filteredNames=ROSTER.filter(r=>!nameSearch||r.toLowerCase().includes(nameSearch.toLowerCase())).slice(0,8);

  // ── Count me in from home ──
  const countMeIn=()=>{
    if(!myName)return;
    const found=players.find(p=>p.name.toLowerCase()===myName.toLowerCase());
    if(!found)return;
    if(!found.signedUp){
      setPlayers(r=>r.map(p=>p.name.toLowerCase()===myName.toLowerCase()?{...p,signedUp:true}:p));
      showToast("You are IN! 🎉 Don't forget to pay!");
    }else{showToast("You are already signed up! ✅");}
    setTab("signup");
  };

  const box={background:"#fff",borderRadius:16,padding:18,marginBottom:14,boxShadow:"0 1px 4px rgba(0,0,0,0.06)",border:"1px solid #E5E7EB"};
  const btn=(bg,c="#fff")=>({padding:"11px 22px",borderRadius:10,border:"none",background:bg,color:c,fontWeight:700,fontSize:14,cursor:"pointer"});
  const smBtn=(bg,c="#fff")=>({padding:"6px 14px",borderRadius:8,border:"none",background:bg,color:c,fontWeight:700,fontSize:12,cursor:"pointer"});
  const copyBtn=(text,key,label)=><button onClick={()=>cpClip(text,key)} style={{...smBtn(copied===key?GRN:WA),transition:"all 0.2s"}}>{copied===key?"✓ Copied!":label||"📋 Copy"}</button>;

  const filteredCourses=courseSearch?COURSES.filter(c=>c.name.toLowerCase().includes(courseSearch.toLowerCase())):COURSES;

  return(
    <div style={{minHeight:"100vh",background:"#F8F7FF",fontFamily:"'Segoe UI',system-ui,sans-serif"}}>
      <div style={{background:`linear-gradient(135deg,${DK},${P})`,padding:"14px 16px",color:"#fff",position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 12px rgba(0,0,0,0.2)"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
          <div style={{flex:1}}><div style={{fontSize:20,fontWeight:800}}>⛳ 1418 Tournament Manager</div><div style={{fontSize:10,opacity:0.7}}>Integrity · Camaraderie · 14 Clubs · 18 Holes</div></div>
          {selEvent&&<div style={{textAlign:"right",fontSize:10,opacity:0.8,maxWidth:180}}>
            <div style={{fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{selEvent.name}</div>
            <div>{selEvent.date} · {selEvent.organizer}</div>
            <span style={{...STATUS_COLORS[selEvent.status],fontSize:9,padding:"1px 6px",borderRadius:6,display:"inline-block",marginTop:2,background:STATUS_COLORS[selEvent.status].bg}}>{STATUS_COLORS[selEvent.status].label}</span>
          </div>}
        </div>
        {isOrganizer&&<div style={{marginTop:6,background:"rgba(22,163,74,0.2)",borderRadius:8,padding:"4px 10px",fontSize:12,fontWeight:700,color:"#86EFAC",display:"inline-flex",alignItems:"center",gap:6}}>🔓 Organizer Mode Active <button onClick={lockAll} style={{background:"none",border:"none",color:"#86EFAC",cursor:"pointer",fontSize:11,fontWeight:700,padding:0}}>· Lock</button></div>}
      </div>

      <div style={{maxWidth:800,margin:"0 auto",padding:"14px 12px",paddingBottom:90}}>

        {/* ═══ HOME ═══ */}
        {tab==="home"&&(()=>{
          const nextEvent=schedule.find(e=>e.status!=="completed");
          const nextIdx=schedule.findIndex(e=>e.status!=="completed");
          const mePlayer=myName?players.find(p=>p.name.toLowerCase()===myName.toLowerCase()):null;
          const amIn=mePlayer?.signedUp;
          const amPaid=mePlayer?.paid;
          const daysTo=nextEvent?Math.max(0,Math.ceil((new Date(nextEvent.date.replace("Sat ","")+" 2026").getTime()-Date.now())/(1000*60*60*24))):0;
          return(<>
            {/* My Name setup */}
            {!myName?(
              <div style={{...box,border:`2px solid ${P}`,padding:20}}>
                <div style={{fontSize:22,fontWeight:800,color:DK,marginBottom:4}}>👋 Welcome to 1418!</div>
                <div style={{fontSize:15,color:"#555",marginBottom:16}}>First, let us know who you are so we can personalise your experience.</div>
                <input value={nameSearch} onChange={e=>setNameSearch(e.target.value)} placeholder="🔍 Type your name..." autoFocus
                  style={{width:"100%",padding:"14px 16px",fontSize:16,borderRadius:12,border:"2px solid #D1D5DB",outline:"none",boxSizing:"border-box",marginBottom:10}}/>
                <div style={{maxHeight:220,overflowY:"auto",border:"1px solid #E5E7EB",borderRadius:12}}>
                  {filteredNames.map(n=>(
                    <button key={n} onClick={()=>saveName(n)} style={{display:"block",width:"100%",padding:"14px 16px",border:"none",borderBottom:"1px solid #F3F4F6",background:"#fff",cursor:"pointer",textAlign:"left",fontSize:16,fontWeight:600,color:DK}}>
                      {n}
                    </button>
                  ))}
                  {nameSearch&&!ROSTER.find(r=>r.toLowerCase()===nameSearch.toLowerCase())&&(
                    <button onClick={()=>saveName(nameSearch)} style={{display:"block",width:"100%",padding:"14px 16px",border:"none",background:PL,cursor:"pointer",textAlign:"left",fontSize:15,fontWeight:700,color:P}}>
                      + I'm "{nameSearch}" (guest)
                    </button>
                  )}
                </div>
              </div>
            ):(
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,padding:"10px 14px",background:"#fff",borderRadius:14,boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
                <div style={{fontSize:16,fontWeight:700,color:DK}}>👋 Hey, {myName.split(" ")[0]}!</div>
                <button onClick={clearName} style={{background:"none",border:"none",fontSize:12,color:"#aaa",cursor:"pointer"}}>Not you?</button>
              </div>
            )}

            {/* Next Event Hero */}
            {nextEvent&&(
              <div style={{background:`linear-gradient(135deg,${DK},${P})`,borderRadius:20,padding:20,marginBottom:14,color:"#fff",boxShadow:`0 8px 32px ${P}44`}}>
                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:12}}>
                  <div>
                    <div style={{fontSize:11,fontWeight:700,opacity:0.7,letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>Next Event</div>
                    <div style={{fontSize:22,fontWeight:800,lineHeight:1.2}}>{nextEvent.major?"🏆 ":""}{nextEvent.name}</div>
                    <div style={{fontSize:14,opacity:0.85,marginTop:6}}>📅 {nextEvent.date}</div>
                    <div style={{fontSize:13,opacity:0.7,marginTop:2}}>👤 {nextEvent.organizer}</div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0,marginLeft:8}}>
                    <div style={{background:nextEvent.major?"#D4A843":"rgba(255,255,255,0.15)",color:nextEvent.major?DK:"#fff",padding:"4px 12px",borderRadius:20,fontSize:12,fontWeight:800,marginBottom:8}}>{nextEvent.major?"🏆 MAJOR":"⛳ "+nextEvent.pts+" pts"}</div>
                    <div style={{fontSize:28,fontWeight:800,color:GLD}}>{daysTo}d</div>
                    <div style={{fontSize:10,opacity:0.6}}>to go</div>
                  </div>
                </div>
                {myName&&(amIn?(
                  <div>
                    <div style={{background:"rgba(22,163,74,0.25)",border:"1.5px solid rgba(22,163,74,0.5)",borderRadius:14,padding:"12px 16px",marginBottom:8,display:"flex",alignItems:"center",gap:10}}>
                      <span style={{fontSize:24}}>✅</span>
                      <div>
                        <div style={{fontSize:15,fontWeight:800}}>You're IN!</div>
                        <div style={{fontSize:12,opacity:0.8}}>{amPaid?"✅ Paid & confirmed":"⚠️ Don't forget to pay!"}</div>
                      </div>
                    </div>
                    <button onClick={()=>{if(nextIdx>=0)pickEvent(nextIdx);}} style={{width:"100%",padding:"14px",borderRadius:14,border:"none",background:"rgba(255,255,255,0.15)",color:"#fff",fontWeight:700,fontSize:15,cursor:"pointer"}}>
                      View Sign-Up Details →
                    </button>
                  </div>
                ):(
                  <button onClick={()=>{if(nextIdx>=0){pickEvent(nextIdx);}countMeIn();}} style={{width:"100%",padding:"16px",borderRadius:14,border:"none",background:GLD,color:DK,fontWeight:800,fontSize:18,cursor:"pointer",boxShadow:`0 4px 20px rgba(0,0,0,0.3)`,animation:"pulse 2s infinite"}}>
                    COUNT ME IN ✅
                  </button>
                ))}
                {!myName&&<button onClick={()=>{}} style={{width:"100%",padding:"16px",borderRadius:14,border:"2px dashed rgba(255,255,255,0.4)",background:"transparent",color:"rgba(255,255,255,0.7)",fontWeight:700,fontSize:15,cursor:"pointer"}} onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}>👆 Set your name above to sign up</button>}
              </div>
            )}

            {/* Stats row */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
              {[["✅","Signed Up",signedUp.length],["💰","Paid",paid.length],["⏰","Days Left",daysTo]].map(([emoji,label,val])=>(
                <div key={label} style={{background:"#fff",borderRadius:14,padding:"14px 10px",textAlign:"center",boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
                  <div style={{fontSize:22}}>{emoji}</div>
                  <div style={{fontSize:26,fontWeight:800,color:P,lineHeight:1.1}}>{val}</div>
                  <div style={{fontSize:11,color:"#888",fontWeight:600,marginTop:2}}>{label}</div>
                </div>
              ))}
            </div>

            {/* Upcoming events scroll */}
            <div style={{...box,padding:"14px 16px"}}>
              <div style={{fontSize:14,fontWeight:700,color:"#444",marginBottom:10}}>📅 Upcoming Events</div>
              <div style={{display:"flex",gap:8,overflowX:"auto",WebkitOverflowScrolling:"touch",paddingBottom:4}}>
                {schedule.filter(e=>e.status!=="completed").slice(0,8).map(e=>(
                  <button key={e.wk} onClick={()=>{const idx=schedule.findIndex(x=>x.wk===e.wk);if(idx>=0)pickEvent(idx);}} style={{flexShrink:0,background:e.major?`linear-gradient(135deg,${GLD},#B8860B)`:PL,color:e.major?DK:P,padding:"10px 14px",borderRadius:12,border:"none",cursor:"pointer",textAlign:"left",minWidth:140}}>
                    <div style={{fontSize:11,fontWeight:700,opacity:0.7}}>Wk {e.wk} · {e.date.replace("Sat ","")}</div>
                    <div style={{fontSize:13,fontWeight:700,marginTop:2,lineHeight:1.2}}>{e.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Organizer/Admin links */}
            <div style={{textAlign:"center",padding:"8px 0",marginTop:4}}>
              <button onClick={()=>requireOrganizer(()=>{})} style={{background:"none",border:"none",fontSize:12,color:"#bbb",cursor:"pointer",marginRight:12}}>🔒 Organizer Login</button>
              <button onClick={()=>requireAdmin(()=>setShowAdminPanel(true))} style={{background:"none",border:"none",fontSize:12,color:"#bbb",cursor:"pointer"}}>⚙️ Admin</button>
            </div>
          </>);
        })()}

        {/* ═══ SCHEDULE ═══ */}
        {tab==="schedule"&&(
          <div style={box}>
            <h2 style={{color:P,margin:"0 0 4px",fontSize:19}}>2026 Season Schedule</h2>
            <p style={{color:"#888",margin:"0 0 12px",fontSize:13}}>Tap an event to manage it. Change status with the buttons on the right.</p>
            <div style={{maxHeight:520,overflowY:"auto",border:"1px solid #E5E7EB",borderRadius:12,WebkitOverflowScrolling:"touch"}}>
              {schedule.map((e,idx)=>{const sc=STATUS_COLORS[e.status];return(
                <div key={e.wk} style={{display:"flex",alignItems:"center",gap:6,padding:"10px 12px",borderBottom:"1px solid #F3F4F6",background:selIdx===idx?PL:"transparent",transition:"background 0.15s"}}>
                  <button onClick={()=>pickEvent(idx)} style={{flex:1,display:"flex",alignItems:"center",gap:6,border:"none",background:"transparent",cursor:"pointer",textAlign:"left",padding:0}}>
                    <span style={{fontSize:11,color:"#aaa",minWidth:28,fontWeight:700}}>W{e.wk}</span>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:13,fontWeight:e.major?700:500,color:DK,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.major?"🏆 ":""}{e.name}</div>
                      <div style={{fontSize:11,color:"#888"}}>👤 {e.organizer} · {e.date}</div>
                    </div>
                  </button>
                  <div style={{display:"flex",gap:2,flexShrink:0}}>
                    {["open","locked","completed"].map(s=>(
                      <button key={s} onClick={()=>setStatus(e.wk,s)} title={s} style={{
                        width:24,height:24,borderRadius:6,border:`1.5px solid ${e.status===s?STATUS_COLORS[s].border:"#E5E7EB"}`,
                        background:e.status===s?STATUS_COLORS[s].bg:"#fff",cursor:"pointer",fontSize:11,padding:0,
                        display:"flex",alignItems:"center",justifyContent:"center",
                      }}>{s==="open"?"🟢":s==="locked"?"🔒":"✅"}</button>
                    ))}
                  </div>
                  <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:8,
                    background:e.major?"#FEF3C7":e.pts==="Team"?"#DBEAFE":"#F3F4F6",
                    color:e.major?"#92400E":e.pts==="Team"?BLU:"#666",flexShrink:0,
                  }}>{e.pts==="Team"?"Team":e.pts}</span>
                </div>
              );})}
            </div>
          </div>
        )}

        {/* ═══ SIGN-UP ═══ */}
        {tab==="signup"&&(<>
          {!selEvent?<div style={{...box,textAlign:"center",padding:40}}><div style={{fontSize:36}}>📅</div><div style={{fontSize:14,color:"#888",marginTop:8}}>Pick an event from the Schedule tab</div><button onClick={()=>setTab("schedule")} style={{...btn(P),marginTop:12}}>Go to Schedule</button></div>
          :selEvent.status==="completed"?<div style={{...box,textAlign:"center",padding:40}}><div style={{fontSize:36}}>✅</div><div style={{fontSize:16,fontWeight:700,color:"#666",marginTop:8}}>{selEvent.name}</div><div style={{fontSize:13,color:"#888",marginTop:4}}>This tournament is completed.</div><button onClick={()=>setTab("payout")} style={{...btn(P),marginTop:12}}>View Payout →</button></div>
          :(<>
            {/* Event header */}
            <div style={{background:`linear-gradient(135deg,${PL},#E0E7FF)`,borderRadius:14,padding:16,marginBottom:12,border:`1.5px solid #C4B5FD`}}>
              <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
                <div>
                  <div style={{fontSize:17,fontWeight:800,color:P}}>{selEvent.major?"🏆 ":""}{selEvent.name}</div>
                  <div style={{fontSize:13,color:"#666",marginTop:2}}>📅 {selEvent.date} · 👤 {selEvent.organizer}</div>
                </div>
                <span style={{...STATUS_COLORS[selEvent.status],fontSize:12,fontWeight:700,padding:"4px 12px",borderRadius:8,background:STATUS_COLORS[selEvent.status].bg,border:`1.5px solid ${STATUS_COLORS[selEvent.status].border}`,alignSelf:"flex-start"}}>{STATUS_COLORS[selEvent.status].label}</span>
              </div>

              {/* Course picker */}
              <div style={{marginTop:12}}>
                <label style={{fontSize:11,fontWeight:700,color:"#666"}}>⛳ Course</label>
                <div style={{position:"relative"}}>
                  <input value={ev.course||ev.customCourse} onChange={e=>{setEv(p=>({...p,course:"",customCourse:e.target.value}));setCourseSearch(e.target.value);setShowCourseList(true);}}
                    onFocus={()=>setShowCourseList(true)} placeholder="Search Houston courses or type custom..."
                    style={{width:"100%",padding:"8px 12px",borderRadius:8,border:"1.5px solid #D1D5DB",fontSize:13,outline:"none",boxSizing:"border-box",marginTop:4}}/>
                  {showCourseList&&(
                    <div style={{position:"absolute",top:"100%",left:0,right:0,background:"#fff",border:"1.5px solid #D1D5DB",borderRadius:10,maxHeight:200,overflowY:"auto",zIndex:50,boxShadow:"0 4px 12px rgba(0,0,0,0.1)"}}>
                      {filteredCourses.map(c=>(
                        <button key={c.name} onClick={()=>selectCourse(c)} style={{display:"block",width:"100%",padding:"8px 12px",border:"none",borderBottom:"1px solid #F3F4F6",background:ev.course===c.name?PL:"#fff",cursor:"pointer",textAlign:"left"}}>
                          <div style={{fontSize:13,fontWeight:600,color:DK}}>{c.name}</div>
                          <div style={{fontSize:11,color:"#888"}}>{c.sub} · {c.addr}</div>
                        </button>
                      ))}
                      <button onClick={()=>setShowCourseList(false)} style={{width:"100%",padding:"8px",border:"none",background:"#F3F4F6",cursor:"pointer",fontSize:12,fontWeight:600,color:"#666"}}>Close</button>
                    </div>
                  )}
                </div>
              </div>

              {/* Tee + Kitty */}
              <div style={{display:"flex",gap:8,marginTop:10,flexWrap:"wrap",alignItems:"center"}}>
                <div>
                  <label style={{fontSize:11,fontWeight:700,color:"#666"}}>Tees</label>
                  <div style={{display:"flex",gap:3,marginTop:3}}>
                    {availableTees.map(t=>(
                      <button key={t} onClick={()=>setEv(p=>({...p,courseTee:t}))} style={{
                        padding:"4px 10px",borderRadius:6,fontSize:11,fontWeight:700,cursor:"pointer",
                        border:ev.courseTee===t?`2px solid ${P}`:"1.5px solid #D1D5DB",
                        background:ev.courseTee===t?PL:t==="Black"?"#1F2937":t==="Blue"?"#DBEAFE":t==="White"?"#fff":t==="Gold"?"#FEF3C7":"#FEE2E2",
                        color:ev.courseTee===t?P:t==="Black"?"#fff":DK,
                      }}>{t}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{fontSize:11,fontWeight:700,color:"#666"}}>Kitty $</label>
                  <input value={ev.kittyAmt} onChange={e=>setEv(p=>({...p,kittyAmt:e.target.value.replace(/\D/g,"")}))}
                    inputMode="numeric" style={{display:"block",width:50,padding:"5px 8px",borderRadius:6,border:"1.5px solid #D1D5DB",fontSize:13,fontWeight:700,textAlign:"center",outline:"none",marginTop:3}}/>
                </div>
                <div style={{marginLeft:"auto",textAlign:"right"}}>
                  <div style={{fontSize:10,color:"#888"}}>Payout Split</div>
                  <div style={{fontSize:12,fontWeight:700,color:P}}>30 / 40 / 30</div>
                  <div style={{fontSize:9,color:"#aaa"}}>Gross / 1st Net / 2nd Net</div>
                </div>
              </div>
            </div>

            {/* Deadline */}
            {selEvent.status==="open"&&<div style={{background:deadlinePassed?"#FEE2E2":isUrgent?"#FEF3C7":"#ECFDF5",border:`1.5px solid ${deadlinePassed?RED:isUrgent?"#F59E0B":GRN}`,borderRadius:12,padding:"10px 16px",marginBottom:12,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div><div style={{fontSize:12,fontWeight:700,color:deadlinePassed?RED:isUrgent?"#92400E":"#166534"}}>{deadlinePassed?"🔒 CLOSED":isUrgent?"⚠️ DEADLINE SOON":"⏰ Registration Open"}</div><div style={{fontSize:11,color:"#666"}}>Thursday 4:00 PM CST</div></div>
              <div style={{fontSize:20,fontWeight:800,color:deadlinePassed?RED:isUrgent?"#92400E":GRN}}>{fmtCD(msLeft)}</div>
            </div>}

            {selEvent.status==="locked"&&<div style={{background:"#FEF3C7",border:"1.5px solid #F59E0B",borderRadius:12,padding:"10px 16px",marginBottom:12,textAlign:"center",fontWeight:700,fontSize:14,color:"#92400E"}}>🔒 Sign-ups are locked — game day!</div>}

            {/* Stats */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:12}}>
              {[{l:"Signed Up",v:signedUp.length,c:BLU,bg:"#DBEAFE"},{l:"Paid ✅",v:paid.length,c:GRN,bg:"#D1FAE5"},{l:"Unpaid ⚠️",v:unpaid.length,c:unpaid.length?RED:"#999",bg:unpaid.length?"#FEE2E2":"#F3F4F6"},{l:"💰 Kitty",v:`$${totalKitty}`,c:"#78350F",bg:"#FEF3C7"}].map(c=>(
                <div key={c.l} style={{background:c.bg,borderRadius:10,padding:"10px 8px",textAlign:"center"}}><div style={{fontSize:20,fontWeight:800,color:c.c}}>{c.v}</div><div style={{fontSize:10,fontWeight:600,color:c.c,opacity:0.8}}>{c.l}</div></div>
              ))}
            </div>

            {/* Player list */}
            <div style={box}>
              {/* Search */}
              <div style={{display:"flex",gap:8,marginBottom:10}}>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Find your name..." style={{flex:1,padding:"12px 16px",borderRadius:12,border:"2px solid #D1D5DB",fontSize:16,outline:"none",height:48,boxSizing:"border-box"}}/>
                {myName&&<button onClick={()=>setSearch(myName.split(" ")[0])} style={{padding:"0 14px",borderRadius:12,border:"none",background:P,color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer",height:48,flexShrink:0}}>👤 Me</button>}
              </div>
              {/* Filter pills */}
              <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
                {[{k:"all",l:`All (${players.length})`},{k:"signedup",l:`✅ In (${signedUp.length})`},{k:"paid",l:`💰 Paid (${paid.length})`},{k:"unpaid",l:`⚠️ Unpaid (${unpaid.length})`}].map(f=>(
                  <button key={f.k} onClick={()=>setFilterView(f.k)} style={{padding:"8px 14px",borderRadius:10,fontSize:13,fontWeight:600,cursor:"pointer",border:filterView===f.k?`2px solid ${P}`:"1.5px solid #E5E7EB",background:filterView===f.k?PL:"#fff",color:filterView===f.k?P:"#666"}}>{f.l}</button>
                ))}
              </div>
              <div style={{maxHeight:420,overflowY:"auto",border:"1px solid #E5E7EB",borderRadius:12,WebkitOverflowScrolling:"touch"}}>
                {filtered.map((p,i)=>{
                  const isMe=myName&&p.name.toLowerCase()===myName.toLowerCase();
                  return(
                  <div key={p.id} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 12px",minHeight:56,background:p.paid?"#F0FDF4":p.signedUp?"#FFF7ED":isMe?"#F5F0FF":(i%2===0?"#FAFBFF":"#fff"),borderBottom:"1px solid #F3F4F6",border:isMe?`2px solid ${P}56`:"none",borderRadius:isMe?10:0}}>
                    <button onClick={()=>selEvent.status!=="locked"&&toggle(p.id,"signedUp")} style={{width:36,height:36,borderRadius:10,flexShrink:0,border:`2px solid ${p.signedUp?GRN:"#D1D5DB"}`,background:p.signedUp?GRN:"#fff",cursor:selEvent.status==="locked"?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color:"#fff",padding:0,opacity:selEvent.status==="locked"?0.6:1,transition:"all 0.15s"}}>{p.signedUp?"✓":""}</button>
                    <span style={{flex:1,fontSize:16,fontWeight:p.signedUp?700:400,color:p.signedUp?DK:"#999",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.name}{isMe&&<span style={{fontSize:10,color:P,marginLeft:6,fontWeight:700}}>YOU</span>}{p.name==="Lukeman Cole"&&<span style={{fontSize:10,color:GLD,marginLeft:4}}>🏆</span>}</span>
                    {p.signedUp&&<div style={{display:"flex",gap:4,flexShrink:0,alignItems:"center"}}>
                      <input value={p.hcp!==null?p.hcp:""} onChange={e=>setHcp(p.id,e.target.value.replace(/[^\d]/g,""))} placeholder="HC" inputMode="numeric" style={{width:40,padding:"6px 4px",borderRadius:8,textAlign:"center",border:`1.5px solid ${p.hcp!==null?"#A5B4FC":"#E5E7EB"}`,background:p.hcp!==null?"#EEF2FF":"#FAFAFA",fontSize:14,fontWeight:700,outline:"none",color:p.hcp!==null?P:"#ccc",height:36}}/>
                      {["Zelle","PP","Cash$"].map(m=>(
                        <button key={m} onClick={()=>{setPayMethod(p.id,m);showToast(`${p.name.split(" ")[0]} marked as paid via ${m} ✅`);}} style={{padding:"6px 8px",borderRadius:8,fontSize:11,fontWeight:700,cursor:"pointer",border:p.payMethod===m?`2px solid ${GRN}`:"1px solid #E5E7EB",background:p.payMethod===m?"#D1FAE5":"#FAFAFA",color:p.payMethod===m?GRN:"#999",height:36}}>{m}</button>
                      ))}
                    </div>}
                    <span style={{fontSize:11,fontWeight:700,padding:"4px 8px",borderRadius:8,flexShrink:0,background:p.paid?"#D1FAE5":p.signedUp?"#FEF3C7":"#F3F4F6",color:p.paid?GRN:p.signedUp?"#92400E":"#ddd"}}>{p.paid?"PAID":p.signedUp?"DUE":"—"}</span>
                  </div>
                );})}
                {!filtered.length&&<div style={{padding:32,textAlign:"center",color:"#aaa",fontSize:14}}>No players match — try a different search 🔍</div>}
              </div>
              {selEvent.status==="open"&&<div style={{marginTop:10,display:"flex",gap:5,flexWrap:"wrap"}}>
                <input value={addName} onChange={e=>setAddName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addGuest()} placeholder="Guest name" style={{flex:2,minWidth:100,padding:"7px 10px",borderRadius:8,border:"1.5px solid #D1D5DB",fontSize:12,outline:"none"}}/>
                <input value={addHcp} onChange={e=>setAddHcp(e.target.value.replace(/\D/g,""))} placeholder="HC" inputMode="numeric" style={{width:40,padding:"7px",borderRadius:8,textAlign:"center",border:"1.5px solid #D1D5DB",fontSize:12,outline:"none"}}/>
                <button onClick={addGuest} style={{...smBtn(OR)}}>+ Guest</button>
              </div>}
            </div>
            {readyForPairing.length>=2&&<button onClick={()=>{generate();}} style={{...btn(P),width:"100%",marginBottom:14,boxShadow:"0 4px 12px rgba(107,45,139,0.3)"}}>Generate Pairings ({readyForPairing.length} ready) →</button>}
          </>)}
        </>)}

        {/* ═══ PAIRINGS ═══ */}
        {tab==="pairings"&&(<>
          {readyForPairing.length<2?<div style={{...box,textAlign:"center",padding:40}}><div style={{fontSize:36}}>🏌️</div><div style={{fontSize:14,color:"#888",marginTop:8}}>Need 2+ paid players with handicaps</div><button onClick={()=>setTab("signup")} style={{...btn(P),marginTop:12}}>Go to Sign-Up</button></div>
          :(<>
            <div style={{...box,padding:14}}>
              <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                <span style={{fontSize:13,fontWeight:700,color:"#666"}}>Format:</span>
                {[{k:"stroke",l:"🏌️ Stroke"},{k:"match",l:"⚔️ Match"},{k:"bestball",l:"🤝 Best Ball"}].map(f=>(
                  <button key={f.k} onClick={()=>setPairFmt(f.k)} style={{padding:"6px 14px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",border:pairFmt===f.k?`2px solid ${P}`:"1.5px solid #E5E7EB",background:pairFmt===f.k?PL:"#fff",color:pairFmt===f.k?P:"#666"}}>{f.l}</button>
                ))}
                <button onClick={generate} style={{...smBtn(P),marginLeft:"auto"}}>⚡ Generate</button>
              </div>
            </div>
            {pairings.length>0&&(<>
              <div style={{background:GLD+"22",border:`1.5px solid ${GLD}`,borderRadius:10,padding:"8px 14px",marginBottom:12,fontSize:12,color:"#92400E"}}>
                📱 <strong>Tap two players</strong> to swap · <strong>Drag & drop</strong> on desktop
                {touchSel&&<span style={{background:P,color:"#fff",padding:"2px 8px",borderRadius:6,marginLeft:6}}>Swapping: {touchSel.player.name}</span>}
              </div>
              <div style={box}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <h3 style={{color:P,margin:0,fontSize:16}}>{pairFmt==="stroke"?"Stroke Play Groups":pairFmt==="match"?"Match Play":"Best Ball"}</h3>
                  <div style={{display:"flex",gap:4}}>{touchSel&&<button onClick={()=>setTouchSel(null)} style={{...smBtn("#fff","#999"),border:"1px solid #E5E7EB"}}>Cancel</button>}<button onClick={generate} style={{...smBtn(OR)}}>🔄 Shuffle</button></div>
                </div>
                {pairFmt==="stroke"&&pairings.map((g,gi)=>(
                  <div key={gi} style={{marginBottom:6,padding:10,background:gi%2===0?"#FAFBFF":"#F7FFF7",borderRadius:10,border:"1px solid #E5E7EB"}}>
                    <div style={{fontSize:11,fontWeight:700,color:"#888",marginBottom:5}}>Group {gi+1}</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:5}}>{g.map((p,si)=><Chip key={p?.id||si} player={p} draggable selected={touchSel?.player?.id===p?.id} onDragStart={()=>setDrag({player:p})} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();if(drag)findAndSwap(gi,si,drag.player);setDrag(null);}} onClick={()=>p&&handleTS(gi,si,p)}/>)}</div>
                  </div>
                ))}
                {pairFmt==="match"&&pairings.map((pair,pi)=>(
                  <div key={pi} style={{marginBottom:5,padding:10,background:pi%2===0?"#FAFBFF":"#FFF7ED",borderRadius:10,border:"1px solid #E5E7EB",display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                    <span style={{fontSize:11,fontWeight:700,color:"#999",minWidth:50}}>Match {pi+1}</span>
                    <Chip player={pair[0]} draggable selected={touchSel?.player?.id===pair[0]?.id} onDragStart={()=>setDrag({player:pair[0]})} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();if(drag)findAndSwap(pi,0,drag.player);setDrag(null);}} onClick={()=>pair[0]&&handleTS(pi,0,pair[0])}/>
                    <span style={{fontWeight:800,color:OR}}>vs</span>
                    <Chip player={pair[1]} draggable={!!pair[1]} selected={touchSel?.player?.id===pair[1]?.id} onDragStart={()=>pair[1]&&setDrag({player:pair[1]})} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();if(drag)findAndSwap(pi,1,drag.player);setDrag(null);}} onClick={()=>pair[1]&&handleTS(pi,1,pair[1])}/>
                    {pair[0]&&pair[1]&&<span style={{fontSize:10,color:"#aaa",marginLeft:"auto"}}>{Math.abs(pair[0].hcp-pair[1].hcp)} strokes</span>}
                  </div>
                ))}
                {pairFmt==="bestball"&&pairings.map((match,mi)=>{const[tA,tB]=match;return(
                  <div key={mi} style={{marginBottom:6,padding:12,background:mi%2===0?"#FAFBFF":"#FFF7ED",borderRadius:10,border:"1px solid #E5E7EB"}}>
                    <div style={{fontSize:11,fontWeight:700,color:"#999",marginBottom:6}}>Match {mi+1}</div>
                    <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                      <div style={{display:"flex",gap:4,padding:"3px 6px",background:"#EEF2FF",borderRadius:8}}>{tA.map((p,si)=><Chip key={p?.id||`a${si}`} player={p} draggable={!!p} selected={touchSel?.player?.id===p?.id} onDragStart={()=>p&&setDrag({player:p})} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();if(drag)findAndSwap(mi,si,drag.player);setDrag(null);}} onClick={()=>p&&handleTS(mi,si,p)}/>)}</div>
                      <span style={{fontWeight:800,color:OR}}>vs</span>
                      <div style={{display:"flex",gap:4,padding:"3px 6px",background:"#ECFDF5",borderRadius:8}}>{tB.map((p,si)=><Chip key={p?.id||`b${si}`} player={p} draggable={!!p} selected={touchSel?.player?.id===p?.id} onDragStart={()=>p&&setDrag({player:p})} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();if(drag)findAndSwap(mi,10+si,drag.player);setDrag(null);}} onClick={()=>p&&handleTS(mi,10+si,p)}/>)}</div>
                    </div>
                  </div>
                );})}
              </div>
              <div style={{background:"#F0FFF0",border:`2px solid ${WA}`,borderRadius:14,padding:14,marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><span style={{fontWeight:700,fontSize:13,color:"#166534"}}>📱 Pairing Message</span>{copyBtn(waPairings(),"pair","📋 Copy for WhatsApp")}</div>
                <pre style={{background:"#fff",padding:12,borderRadius:10,fontSize:12,fontFamily:"monospace",whiteSpace:"pre-wrap",wordBreak:"break-word",margin:0,lineHeight:1.5,maxHeight:220,overflowY:"auto",border:"1px solid #BBF7D0"}}>{waPairings()}</pre>
              </div>
            </>)}
          </>)}
        </>)}

        {/* ═══ MESSAGES ═══ */}
        {tab==="messages"&&(
          <div style={box}>
            <h2 style={{color:P,margin:"0 0 12px",fontSize:19}}>📱 WhatsApp Messages</h2>
            {[{key:"signup",title:"📢 Sign-Up Announcement",text:waSignup(),bg:"#F0FFF0",b:"#BBF7D0"},
              {key:"status",title:"📊 Status Update",text:waStatus(),bg:"#EFF6FF",b:"#BFDBFE"},
              {key:"remind",title:"⚠️ Payment Reminder",text:waReminder(),bg:"#FEF3C7",b:"#FDE68A"},
              ...(pairings.length?[{key:"pair",title:"🏌️ Pairings",text:waPairings(),bg:"#F0FFF0",b:"#BBF7D0"}]:[]),
              {key:"payout",title:"🏆 Payout Summary",text:waPayout(),bg:"#FDF4FF",b:"#E9D5FF"},
            ].map(m=>(
              <div key={m.key} style={{marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><span style={{fontWeight:700,fontSize:13,color:DK}}>{m.title}</span>{copyBtn(m.text,m.key)}</div>
                <pre style={{background:m.bg,padding:12,borderRadius:10,fontSize:11,fontFamily:"monospace",whiteSpace:"pre-wrap",wordBreak:"break-word",lineHeight:1.5,maxHeight:180,overflowY:"auto",border:`1px solid ${m.b}`,margin:0}}>{m.text}</pre>
              </div>
            ))}
          </div>
        )}

        {/* ═══ PAYOUT ═══ */}
        {tab==="payout"&&(
          <div style={box}>
            <h2 style={{color:P,margin:"0 0 12px",fontSize:19}}>💰 Payout Calculator</h2>
            <div style={{background:"#F3F4F6",borderRadius:10,padding:"8px 14px",marginBottom:14,fontSize:12,color:"#666",fontWeight:600}}>Fixed Split: 30% Lowest Gross · 40% 1st Lowest Net · 30% 2nd Lowest Net</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:14}}>
              <div style={{background:"#FEF3C7",borderRadius:12,padding:14,textAlign:"center"}}><div style={{fontSize:10,fontWeight:600,color:"#92400E"}}>Pool</div><div style={{fontSize:26,fontWeight:800,color:"#78350F"}}>${totalKitty}</div><div style={{fontSize:10,color:"#92400E"}}>{paid.length} × ${ev.kittyAmt}</div></div>
              <div style={{background:"#D1FAE5",borderRadius:12,padding:14,textAlign:"center"}}><div style={{fontSize:10,fontWeight:600,color:"#166534"}}>Split</div><div style={{fontSize:20,fontWeight:800,color:GRN}}>30/40/30</div></div>
              <div style={{background:"#DBEAFE",borderRadius:12,padding:14,textAlign:"center"}}><div style={{fontSize:10,fontWeight:600,color:"#1E40AF"}}>Players</div><div style={{fontSize:26,fontWeight:800,color:BLU}}>{paid.length}</div></div>
            </div>
            <div style={{display:"flex",gap:8,marginBottom:14}}>
              {[{l:"🥇 Lowest Gross",a:payGross,bg:"linear-gradient(135deg,#FEF3C7,#FDE68A)",b:"#F59E0B",c:"#78350F"},
                {l:"🥈 1st Lowest Net",a:pay1stNet,bg:"linear-gradient(135deg,#D1FAE5,#A7F3D0)",b:GRN,c:"#166534"},
                {l:"🥉 2nd Lowest Net",a:pay2ndNet,bg:"linear-gradient(135deg,#FED7AA,#FDBA74)",b:"#F97316",c:"#7C2D12"}
              ].map(x=>(
                <div key={x.l} style={{flex:1,background:x.bg,border:`2px solid ${x.b}`,borderRadius:14,padding:14,textAlign:"center"}}>
                  <div style={{fontSize:11,fontWeight:700,color:x.c}}>{x.l}</div><div style={{fontSize:24,fontWeight:800,color:x.c,marginTop:4}}>${x.a}</div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",justifyContent:"flex-end"}}>{copyBtn(waPayout(),"payoutMsg","📋 Copy for WhatsApp")}</div>
          </div>
        )}

        <div style={{textAlign:"center",padding:"16px 0 4px",fontSize:10,color:"#ccc"}}>
          © 2026 1418 Golf Society · Built with ⛳
          <br/><button onClick={startTour} style={{marginTop:4,background:"none",border:"none",color:"#A78BFA",fontSize:11,fontWeight:700,cursor:"pointer",textDecoration:"underline"}}>🎓 Take the Tour</button>
        </div>
      </div>

      {/* ── BOTTOM NAV BAR ── */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,height:64,background:"#fff",borderTop:"1px solid #E5E7EB",boxShadow:"0 -2px 16px rgba(0,0,0,0.08)",zIndex:490,display:"flex",alignItems:"stretch",maxWidth:800,margin:"0 auto"}}>
        {[
          {id:"home",   emoji:"🏠", label:"HOME"},
          {id:"schedule",emoji:"📅",label:"SEASON"},
          {id:"signup", emoji:"📋", label:"SIGN UP"},
          {id:"pairings",emoji:"🏌️",label:"PAIRINGS"},
          {id:"payout", emoji:"💰", label:"PAYOUT"},
        ].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,border:"none",background:"transparent",cursor:"pointer",
              color:tab===t.id?P:"#9CA3AF",padding:"4px 0",transition:"color 0.15s",position:"relative"}}>
            {tab===t.id&&<div style={{position:"absolute",top:0,left:"20%",right:"20%",height:3,background:P,borderRadius:"0 0 4px 4px"}}/>}
            <span style={{fontSize:22,lineHeight:1}}>{t.emoji}</span>
            <span style={{fontSize:9,fontWeight:800,letterSpacing:0.5}}>{t.label}</span>
          </button>
        ))}
      </div>

      {/* ── TOAST ── */}
      {toast&&(
        <div style={{position:"fixed",bottom:80,left:"50%",transform:"translateX(-50%)",background:"#1A1A2E",color:"#fff",padding:"13px 24px",borderRadius:28,fontSize:15,fontWeight:700,zIndex:800,whiteSpace:"nowrap",boxShadow:"0 4px 24px rgba(0,0,0,0.25)",pointerEvents:"none"}}>
          {toast}
        </div>
      )}

      {/* ── Floating Chat Button ── */}
      {!showChat&&(
        <button onClick={()=>setShowChat(true)} style={{position:"fixed",bottom:20,right:20,width:56,height:56,borderRadius:"50%",background:`linear-gradient(135deg,${P},#4F46E5)`,border:"none",boxShadow:"0 4px 20px rgba(107,45,139,0.5)",cursor:"pointer",fontSize:24,zIndex:990,display:"flex",alignItems:"center",justifyContent:"center",transition:"transform 0.2s"}}
          onMouseEnter={e=>e.currentTarget.style.transform="scale(1.1)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
          ⛳
        </button>
      )}

      {/* ── Chat Panel ── */}
      {showChat&&(
        <div style={{position:"fixed",bottom:0,right:0,left:0,maxWidth:480,margin:"0 auto",height:"75vh",background:"#fff",borderRadius:"20px 20px 0 0",boxShadow:"0 -4px 30px rgba(0,0,0,0.2)",zIndex:990,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          {/* Chat header */}
          <div style={{background:`linear-gradient(135deg,${DK},${P})`,padding:"14px 18px",display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
            <div style={{width:36,height:36,borderRadius:"50%",background:GLD,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>⛳</div>
            <div style={{flex:1}}>
              <div style={{color:"#fff",fontWeight:800,fontSize:14}}>Que — 1418 Assistant</div>
              <div style={{color:"rgba(255,255,255,0.6)",fontSize:10}}>Ask me anything about the app or the society</div>
            </div>
            <button onClick={startTour} style={{background:"rgba(255,255,255,0.15)",border:"none",borderRadius:8,color:"#fff",fontSize:10,fontWeight:700,padding:"5px 10px",cursor:"pointer"}}>🎓 Tour</button>
            <button onClick={()=>setShowChat(false)} style={{background:"none",border:"none",color:"rgba(255,255,255,0.7)",fontSize:20,cursor:"pointer",padding:"0 4px",lineHeight:1}}>✕</button>
          </div>

          {/* Quick prompts */}
          <div style={{display:"flex",gap:6,padding:"8px 12px",overflowX:"auto",flexShrink:0,background:"#FAFAFA",borderBottom:"1px solid #F3F4F6",WebkitOverflowScrolling:"touch"}}>
            {["How do I sign up?","Payment methods","Payout split","2026 Majors","How are pairings made?","What's the deadline?"].map(q=>(
              <button key={q} onClick={()=>{setChatInput(q);setTimeout(()=>{const txt=q.trim();setChatMsgs(m=>[...m,{from:"user",text:txt}]);setChatInput("");setTimeout(()=>setChatMsgs(m=>[...m,{from:"que",text:queReply(txt)}]),400);},50);}}
                style={{padding:"4px 10px",borderRadius:12,border:`1px solid ${P}44`,background:PL,color:P,fontSize:10,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>{q}</button>
            ))}
          </div>

          {/* Messages */}
          <div style={{flex:1,overflowY:"auto",padding:"12px",display:"flex",flexDirection:"column",gap:10,WebkitOverflowScrolling:"touch"}}>
            {chatMsgs.map((m,i)=>(
              <div key={i} style={{display:"flex",justifyContent:m.from==="user"?"flex-end":"flex-start",alignItems:"flex-end",gap:6}}>
                {m.from==="que"&&<div style={{width:28,height:28,borderRadius:"50%",background:GLD,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0}}>⛳</div>}
                <div style={{maxWidth:"80%",padding:"10px 14px",borderRadius:m.from==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px",
                  background:m.from==="user"?P:"#F3F4F6",color:m.from==="user"?"#fff":DK,
                  fontSize:13,lineHeight:1.5,whiteSpace:"pre-line",fontWeight:400,
                  boxShadow:m.from==="user"?`0 2px 8px ${P}44`:"none"}}>
                  {m.text.split(/\*([^*]+)\*/g).map((part,j)=>j%2===1?<strong key={j}>{part}</strong>:part)}
                </div>
              </div>
            ))}
            <div ref={chatBottomRef}/>
          </div>

          {/* Input */}
          <div style={{padding:"10px 12px",borderTop:"1px solid #F3F4F6",display:"flex",gap:8,flexShrink:0,background:"#fff"}}>
            <input ref={chatInputRef} value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendChat()}
              placeholder="Ask Que anything…"
              style={{flex:1,padding:"10px 14px",borderRadius:22,border:"1.5px solid #E5E7EB",fontSize:13,outline:"none",background:"#FAFAFA"}}/>
            <button onClick={sendChat} style={{width:40,height:40,borderRadius:"50%",background:P,border:"none",color:"#fff",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>➤</button>
          </div>
        </div>
      )}

      {/* ── Tour Overlay ── */}
      {tourActive&&TOUR_STEPS[tourStep]&&(()=>{const s=TOUR_STEPS[tourStep];return(
        <div style={{position:"fixed",inset:0,zIndex:995,pointerEvents:"none"}}>
          {/* Dimmed backdrop */}
          <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.6)",pointerEvents:"all"}} onClick={endTour}/>
          {/* Step card */}
          <div style={{position:"absolute",bottom:0,left:0,right:0,maxWidth:520,margin:"0 auto",background:"#fff",borderRadius:"20px 20px 0 0",padding:24,pointerEvents:"all",boxShadow:"0 -8px 40px rgba(0,0,0,0.3)"}}>
            {/* Progress dots */}
            <div style={{display:"flex",gap:4,marginBottom:16,justifyContent:"center"}}>
              {TOUR_STEPS.map((_,i)=>(
                <div key={i} style={{width:i===tourStep?20:6,height:6,borderRadius:3,background:i===tourStep?P:"#E5E7EB",transition:"all 0.3s"}}/>
              ))}
            </div>
            <div style={{textAlign:"center",marginBottom:16}}>
              <div style={{fontSize:40,marginBottom:8}}>{s.emoji}</div>
              <div style={{fontSize:18,fontWeight:800,color:DK,marginBottom:6}}>{s.title}</div>
              <div style={{fontSize:13,color:"#555",lineHeight:1.6,whiteSpace:"pre-line"}}>{s.body}</div>
            </div>
            <div style={{display:"flex",gap:8,marginTop:16}}>
              <button onClick={endTour} style={{flex:1,padding:"11px",borderRadius:10,border:"1.5px solid #E5E7EB",background:"#F9FAFB",color:"#888",fontWeight:700,fontSize:13,cursor:"pointer"}}>Skip Tour</button>
              {tourStep>0&&<button onClick={()=>setTourStep(s=>s-1)} style={{flex:1,padding:"11px",borderRadius:10,border:`1.5px solid ${P}`,background:"#fff",color:P,fontWeight:700,fontSize:13,cursor:"pointer"}}>← Back</button>}
              <button onClick={()=>tourStep<TOUR_STEPS.length-1?setTourStep(s=>s+1):endTour()}
                style={{flex:2,padding:"11px",borderRadius:10,border:"none",background:P,color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer",boxShadow:`0 4px 12px ${P}44`}}>
                {tourStep===TOUR_STEPS.length-1?"🎉 Let's Go!":"Next →"}
              </button>
            </div>
            <div style={{textAlign:"center",marginTop:8,fontSize:11,color:"#aaa"}}>{tourStep+1} of {TOUR_STEPS.length}</div>
          </div>
        </div>
      );})()}

      {/* ── PIN Modal ── */}
      {showPinModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>setShowPinModal(false)}>
          <div style={{background:"#fff",borderRadius:20,padding:28,width:"100%",maxWidth:320,boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}} onClick={e=>e.stopPropagation()}>
            <div style={{textAlign:"center",marginBottom:20}}>
              <div style={{fontSize:40,marginBottom:8}}>{pinMode==="admin"?"⚙️":"🔒"}</div>
              <div style={{fontSize:18,fontWeight:800,color:DK}}>{pinMode==="admin"?"Admin Access":"Organizer Access"}</div>
              <div style={{fontSize:13,color:"#888",marginTop:4}}>{pinMode==="admin"?"Admin PIN required":"Enter the PIN issued by the admin"}</div>
            </div>
            <input ref={pinRef} type="password" inputMode="numeric" maxLength={8} value={pinInput}
              onChange={e=>{setPinInput(e.target.value);setPinError(false);}}
              onKeyDown={e=>e.key==="Enter"&&submitPin()} placeholder="• • • •"
              style={{width:"100%",padding:"14px",fontSize:24,textAlign:"center",letterSpacing:8,borderRadius:12,
                border:`2px solid ${pinError?RED:"#D1D5DB"}`,outline:"none",boxSizing:"border-box",
                background:pinError?"#FEF2F2":"#FAFAFA",color:DK,marginBottom:8,transition:"border 0.2s"}}/>
            {pinError&&<div style={{color:RED,fontSize:12,textAlign:"center",marginBottom:8,fontWeight:600}}>❌ Incorrect PIN — try again</div>}
            <div style={{display:"flex",gap:8,marginTop:4}}>
              <button onClick={()=>setShowPinModal(false)} style={{flex:1,padding:"12px",borderRadius:10,border:"1.5px solid #E5E7EB",background:"#F9FAFB",color:"#666",fontWeight:700,fontSize:14,cursor:"pointer"}}>Cancel</button>
              <button onClick={submitPin} style={{flex:2,padding:"12px",borderRadius:10,border:"none",background:pinMode==="admin"?GLD:P,color:pinMode==="admin"?DK:"#fff",fontWeight:700,fontSize:14,cursor:"pointer",boxShadow:`0 4px 12px ${P}44`}}>Unlock</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Admin Panel ── */}
      {showAdminPanel&&isAdmin&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:998,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>setShowAdminPanel(false)}>
          <div style={{background:"#fff",borderRadius:20,padding:24,width:"100%",maxWidth:360,boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}} onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
              <div><div style={{fontSize:18,fontWeight:800,color:DK}}>⚙️ Admin Settings</div><div style={{fontSize:12,color:"#888"}}>Manage PINs for organizers</div></div>
              <button onClick={()=>setShowAdminPanel(false)} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#aaa"}}>✕</button>
            </div>

            {/* Current Organizer PIN display */}
            <div style={{background:"#F0FFF4",border:"1.5px solid #86EFAC",borderRadius:12,padding:14,marginBottom:16}}>
              <div style={{fontSize:11,fontWeight:700,color:"#166534",marginBottom:4}}>🔑 CURRENT ORGANIZER PIN</div>
              <div style={{fontSize:28,fontWeight:800,color:GRN,letterSpacing:6}}>{getOrgPin()}</div>
              <div style={{fontSize:11,color:"#888",marginTop:4}}>Share this with this week's organizer</div>
            </div>

            {/* Change Organizer PIN */}
            <div style={{marginBottom:16}}>
              <label style={{fontSize:12,fontWeight:700,color:"#444",display:"block",marginBottom:6}}>🔄 Set New Organizer PIN</label>
              <div style={{display:"flex",gap:8}}>
                <input value={newOrgPin} onChange={e=>setNewOrgPin(e.target.value)} placeholder="New organizer PIN"
                  maxLength={8} type="text"
                  style={{flex:1,padding:"10px 12px",borderRadius:10,border:"1.5px solid #D1D5DB",fontSize:14,outline:"none"}}/>
                <button onClick={()=>{if(newOrgPin.trim().length>=3){localStorage.setItem(LS_ORG,newOrgPin.trim());setNewOrgPin("");setAdminSaved("org");setTimeout(()=>setAdminSaved(null),2500);}}}
                  style={{padding:"10px 16px",borderRadius:10,border:"none",background:adminSaved==="org"?GRN:P,color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer",transition:"background 0.2s"}}>
                  {adminSaved==="org"?"✓ Saved!":"Save"}
                </button>
              </div>
              <div style={{fontSize:11,color:"#aaa",marginTop:4}}>Min 3 characters. Change this after each event.</div>
            </div>

            {/* Change Admin PIN */}
            <div style={{borderTop:"1px solid #F3F4F6",paddingTop:16}}>
              <label style={{fontSize:12,fontWeight:700,color:"#444",display:"block",marginBottom:6}}>🛡️ Change Your Admin PIN</label>
              <input value={newAdminPin} onChange={e=>setNewAdminPin(e.target.value)} placeholder="New admin PIN"
                maxLength={8} type="password"
                style={{width:"100%",padding:"10px 12px",borderRadius:10,border:"1.5px solid #D1D5DB",fontSize:14,outline:"none",boxSizing:"border-box",marginBottom:8}}/>
              <input value={confirmAdminPin} onChange={e=>setConfirmAdminPin(e.target.value)} placeholder="Confirm new admin PIN"
                maxLength={8} type="password"
                style={{width:"100%",padding:"10px 12px",borderRadius:10,border:`1.5px solid ${newAdminPin&&confirmAdminPin&&newAdminPin!==confirmAdminPin?RED:"#D1D5DB"}`,fontSize:14,outline:"none",boxSizing:"border-box",marginBottom:8}}/>
              {newAdminPin&&confirmAdminPin&&newAdminPin!==confirmAdminPin&&<div style={{color:RED,fontSize:11,marginBottom:6}}>PINs don't match</div>}
              <button onClick={()=>{if(newAdminPin.trim().length>=3&&newAdminPin===confirmAdminPin){localStorage.setItem(LS_ADMIN,newAdminPin.trim());setNewAdminPin("");setConfirmAdminPin("");setAdminSaved("admin");setTimeout(()=>setAdminSaved(null),2500);}}}
                style={{width:"100%",padding:"11px",borderRadius:10,border:"none",background:adminSaved==="admin"?GRN:"#374151",color:"#fff",fontWeight:700,fontSize:14,cursor:"pointer",transition:"background 0.2s"}}>
                {adminSaved==="admin"?"✓ Admin PIN Updated!":"Update Admin PIN"}
              </button>
            </div>

            <button onClick={()=>{setShowAdminPanel(false);lockAll();}}
              style={{width:"100%",marginTop:12,padding:"10px",borderRadius:10,border:"1.5px solid #FCA5A5",background:"#FEF2F2",color:RED,fontWeight:700,fontSize:13,cursor:"pointer"}}>
              🔒 Lock & Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
