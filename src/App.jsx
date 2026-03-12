import { useState, useEffect, useMemo } from "react";

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

function Chip({player,draggable,onDragStart,onDragOver,onDrop,onClick,selected}){
  if(!player)return(<div onDragOver={onDragOver} onDrop={onDrop} onClick={onClick} style={{padding:"6px 12px",borderRadius:8,border:"2px dashed #D1D5DB",color:"#aaa",fontSize:12,minWidth:80,textAlign:"center",background:"#FAFAFA"}}>Empty</div>);
  return(<div draggable={draggable} onDragStart={onDragStart} onDragOver={onDragOver} onDrop={onDrop} onClick={onClick}
    style={{padding:"6px 12px",borderRadius:8,background:selected?"#FEF3C7":"#EEF2FF",border:`1.5px solid ${selected?GLD:"#A5B4FC"}`,cursor:draggable?"grab":"pointer",fontSize:13,fontWeight:600,color:DK,display:"inline-flex",alignItems:"center",gap:6,userSelect:"none",boxShadow:selected?`0 0 0 2px ${GLD}`:"none",transition:"all 0.15s"}}>
    <span>{player.name}</span><span style={{background:"#818CF8",color:"#fff",borderRadius:4,padding:"1px 6px",fontSize:10,fontWeight:700}}>{player.hcp}</span></div>);
}

export default function App(){
  const[tab,setTab]=useState("schedule");
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

  const setStatus=(wk,status)=>setSchedule(s=>s.map(e=>e.wk===wk?{...e,status}:e));

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

  const generate=()=>{const p=readyForPairing;if(pairFmt==="stroke")setPairings(autoStroke(p));else if(pairFmt==="match")setPairings(autoMatch(p));else setPairings(autoBestBall(p));setTab("pairings");};

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
        <div style={{display:"flex",gap:3,overflowX:"auto",WebkitOverflowScrolling:"touch",paddingBottom:2}}>
          {["schedule","signup","pairings","messages","payout"].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{padding:"5px 12px",borderRadius:16,border:"none",fontSize:11,fontWeight:700,whiteSpace:"nowrap",background:tab===t?GLD:"rgba(255,255,255,0.12)",color:tab===t?DK:"#fff",cursor:"pointer"}}>
              {t==="schedule"?"📅 Schedule":t==="signup"?"📋 Sign-Up":t==="pairings"?"🏌️ Pairings":t==="messages"?"💬 WhatsApp":"💰 Payout"}
            </button>
          ))}
        </div>
      </div>

      <div style={{maxWidth:800,margin:"0 auto",padding:"14px 12px"}}>

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
              <div style={{display:"flex",gap:4,marginBottom:8,flexWrap:"wrap"}}>
                {[{k:"all",l:`All (${players.length})`},{k:"signedup",l:`In (${signedUp.length})`},{k:"paid",l:`Paid (${paid.length})`},{k:"unpaid",l:`Due (${unpaid.length})`}].map(f=>(
                  <button key={f.k} onClick={()=>setFilterView(f.k)} style={{padding:"4px 10px",borderRadius:8,fontSize:11,fontWeight:600,cursor:"pointer",border:filterView===f.k?`2px solid ${P}`:"1.5px solid #E5E7EB",background:filterView===f.k?PL:"#fff",color:filterView===f.k?P:"#666"}}>{f.l}</button>
                ))}
              </div>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search..." style={{width:"100%",padding:"8px 12px",borderRadius:8,border:"1.5px solid #D1D5DB",fontSize:13,outline:"none",marginBottom:8,boxSizing:"border-box"}}/>
              <div style={{maxHeight:380,overflowY:"auto",border:"1px solid #E5E7EB",borderRadius:10,WebkitOverflowScrolling:"touch"}}>
                {filtered.map((p,i)=>(
                  <div key={p.id} style={{display:"flex",alignItems:"center",gap:5,padding:"7px 10px",background:p.paid?"#F0FDF4":p.signedUp?"#FFF7ED":(i%2===0?"#FAFBFF":"#fff"),borderBottom:"1px solid #F3F4F6"}}>
                    <button onClick={()=>selEvent.status!=="locked"&&toggle(p.id,"signedUp")} style={{width:24,height:24,borderRadius:6,flexShrink:0,border:`2px solid ${p.signedUp?BLU:"#D1D5DB"}`,background:p.signedUp?BLU:"#fff",cursor:selEvent.status==="locked"?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:"#fff",padding:0,opacity:selEvent.status==="locked"?0.6:1}}>{p.signedUp?"✓":""}</button>
                    <span style={{flex:1,fontSize:13,fontWeight:p.signedUp?600:400,color:p.signedUp?DK:"#999",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.name}{p.name==="Lukeman Cole"&&<span style={{fontSize:9,color:GLD,marginLeft:4}}>🏆</span>}</span>
                    {p.signedUp&&<div style={{display:"flex",gap:2,flexShrink:0}}>
                      <input value={p.hcp!==null?p.hcp:""} onChange={e=>setHcp(p.id,e.target.value.replace(/[^\d]/g,""))} placeholder="HC" inputMode="numeric" style={{width:32,padding:"3px 4px",borderRadius:5,textAlign:"center",border:`1.5px solid ${p.hcp!==null?"#A5B4FC":"#E5E7EB"}`,background:p.hcp!==null?"#EEF2FF":"#FAFAFA",fontSize:12,fontWeight:700,outline:"none",color:p.hcp!==null?P:"#ccc"}}/>
                      {["Zelle","PP","Cash$","Cash"].map(m=>(
                        <button key={m} onClick={()=>setPayMethod(p.id,m)} style={{padding:"2px 5px",borderRadius:5,fontSize:9,fontWeight:700,cursor:"pointer",border:p.payMethod===m?`1.5px solid ${GRN}`:"1px solid #E5E7EB",background:p.payMethod===m?"#D1FAE5":"#FAFAFA",color:p.payMethod===m?GRN:"#aaa"}}>{m}</button>
                      ))}
                    </div>}
                    <span style={{fontSize:9,fontWeight:700,padding:"2px 6px",borderRadius:6,flexShrink:0,background:p.paid?"#D1FAE5":p.signedUp?"#FEF3C7":"#F3F4F6",color:p.paid?GRN:p.signedUp?"#92400E":"#ddd"}}>{p.paid?"PAID":p.signedUp?"DUE":"—"}</span>
                  </div>
                ))}
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

        <div style={{textAlign:"center",padding:"16px 0 8px",fontSize:10,color:"#ccc"}}>© 2026 1418 Golf Society · Built with ⛳ for the 1418 Community</div>
      </div>
    </div>
  );
}
