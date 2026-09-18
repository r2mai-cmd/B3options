const assets=[
{t:"PETR4",n:"Petrobras PN",s:"Petróleo & Gás",p:38.42,c:1.84,iv:31.6,hv:27.8,r:72,pc:81,oi:"1,84 mi"},
{t:"VALE3",n:"Vale ON",s:"Mineração",p:61.18,c:-0.72,iv:28.4,hv:29.7,r:46,pc:53,oi:"1,26 mi"},
{t:"ITUB4",n:"Itaú Unibanco PN",s:"Bancos",p:39.75,c:0.48,iv:22.9,hv:20.4,r:63,pc:70,oi:"980 mil"},
{t:"BBDC4",n:"Bradesco PN",s:"Bancos",p:14.62,c:-1.12,iv:26.7,hv:24.1,r:58,pc:64,oi:"720 mil"},
{t:"BBAS3",n:"Banco do Brasil ON",s:"Bancos",p:28.93,c:.91,iv:25.1,hv:22.7,r:67,pc:75,oi:"615 mil"},
{t:"WEGE3",n:"WEG ON",s:"Bens Industriais",p:48.31,c:1.27,iv:24.3,hv:25.6,r:38,pc:44,oi:"284 mil"},
{t:"ABEV3",n:"Ambev ON",s:"Bebidas",p:13.94,c:.15,iv:20.8,hv:18.9,r:51,pc:58,oi:"410 mil"},
{t:"B3SA3",n:"B3 ON",s:"Financeiro",p:13.18,c:-.38,iv:23.7,hv:21.2,r:55,pc:61,oi:"530 mil"}];
let selected="PETR4", favorites=["PETR4","ITUB4"];

const money=v=>v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
function renderCards(){
 const q=(document.querySelector("#search").value||"").toLowerCase();
 const sec=document.querySelector("#sector").value;
 const sort=document.querySelector("#sort").value;
 let a=assets.filter(x=>(!q||(x.t+" "+x.n).toLowerCase().includes(q))&&(sec==="Todos os setores"||x.s===sec));
 a.sort((x,y)=>sort==="iv"?y.iv-x.iv:sort==="change"?y.c-x.c:y.r-x.r);
 document.querySelector("#count").textContent=a.length+" ativos";
 document.querySelector("#cards").innerHTML=a.map(x=>`<article class="card" data-ticker="${x.t}"><div class="cardhead"><div><div class="ticker">${x.t}</div><span class="sub">${x.n}</span></div><button class="star" data-star="${x.t}">${favorites.includes(x.t)?"★":"☆"}</button></div><div class="priceline"><strong class="price">${money(x.p)}</strong><span class="${x.c>=0?"positive":"negative"}">${x.c>=0?"+":""}${x.c.toFixed(2)}%</span></div><div class="minis"><div><span>IV</span><b>${x.iv}%</b></div><div><span>HV</span><b>${x.hv}%</b></div><div><span>IV Rank</span><b>${x.r}</b></div><div><span>Percentil</span><b>${x.pc}%</b></div></div><div class="bar"><i style="width:${x.r}%"></i></div><div class="cardfoot"><span>OI ${x.oi}</span><span>${x.s}</span></div></article>`).join("");
 document.querySelectorAll(".card").forEach(c=>c.onclick=e=>{if(e.target.dataset.star)return;selected=c.dataset.ticker;renderDetails();show("details")});
 document.querySelectorAll("[data-star]").forEach(b=>b.onclick=e=>{e.stopPropagation();let t=b.dataset.star;favorites=favorites.includes(t)?favorites.filter(x=>x!==t):[...favorites,t];renderCards();renderWatch()});
}
function renderScanner(){
 document.querySelector("#scannerTable").innerHTML=assets.map((x,i)=>`<div class="row"><b>${i+1}</b><b>${x.t}</b><span>${x.n}</span><b>${x.iv}%</b><span>${x.hv}%</span><b>${x.r}</b><span>${x.pc}%</span><span class="${x.c>=0?"positive":"negative"}">${x.c>=0?"+":""}${x.c.toFixed(2)}%</span></div>`).join("");
}
function renderWatch(){
 const a=assets.filter(x=>favorites.includes(x.t));
 document.querySelector("#watch").innerHTML=a.map(x=>`<div class="watchitem"><div><b>${x.t}</b><small>${x.n}</small></div><div><small>Preço</small>${money(x.p)}</div><div><small>IV Rank</small>${x.r}</div><div class="${x.c>=0?"positive":"negative"}">${x.c>=0?"+":""}${x.c.toFixed(2)}%</div></div>`).join("");
}
function renderDetails(){
 const x=assets.find(a=>a.t===selected)||assets[0];
 document.querySelector("#detailTicker").textContent=x.t+" — "+x.n;
 document.querySelector("#detailStats").innerHTML=[["Preço",money(x.p)],["IV",x.iv+"%"],["HV",x.hv+"%"],["IV Rank",x.r],["Percentil",x.pc+"%"],["Skew","-4,8"]].map(s=>`<div class="stat"><span>${s[0]}</span><b>${s[1]}</b></div>`).join("");
 document.querySelector("#rankBig").textContent=x.r;
 document.querySelector("#rankBar").style.width=x.r+"%";
 let rows="";
 [0.9,.95,.98,1,1.02,1.05,1.1].forEach((m,i)=>{let strike=x.p*m;rows+=`<tr><td class="${i%2?"put":"call"}">${i%2?"PUT":"CALL"}</td><td>${strike.toFixed(2)}</td><td>${(x.p*.035).toFixed(2)}</td><td>${(x.p*.041).toFixed(2)}</td><td>${(x.p*.038).toFixed(2)}</td><td>${(18-i*1.4).toFixed(1)}k</td><td>${(125-i*8.5).toFixed(1)}k</td><td>${(x.iv+(i-3)*.7).toFixed(1)}%</td><td>${(0.72-i*.09).toFixed(2)}</td><td>0.018</td></tr>`});
 document.querySelector("#chain").innerHTML=rows;
}
function show(id){document.querySelectorAll(".view").forEach(v=>v.classList.toggle("active",v.id===id));document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b.dataset.tab===id));if(id==="details")renderDetails()}
document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>show(b.dataset.tab));
document.querySelectorAll("[data-tab]").forEach(b=>b.onclick=()=>show(b.dataset.tab));
document.querySelector("#search").oninput=renderCards;
document.querySelector("#sector").onchange=renderCards;
document.querySelector("#sort").onchange=renderCards;
renderCards();renderScanner();renderWatch();renderDetails();