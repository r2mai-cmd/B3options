const sectors=["Petróleo & Gás","Bancos","Mineração","Varejo","Financeiro","Bens Industriais","Construção","Tecnologia","Saúde","Siderurgia","Bebidas","Transporte","Educação","Turismo"];
const base=[
["PETR4","Petrobras PN",38.42,31.6,27.8,72,81,"Petróleo & Gás",1.84,1840],
["VALE3","Vale ON",61.18,28.4,29.7,46,53,"Mineração",-0.72,1260],
["BOVA11","ETF Ibovespa",142.10,24.8,25.2,64,71,"Índices",1.12,980],
["BBAS3","Banco do Brasil ON",28.93,25.1,22.7,67,75,"Bancos",0.91,615],
["ITUB4","Itaú Unibanco PN",39.75,22.9,20.4,63,70,"Bancos",0.48,980],
["BBDC4","Bradesco PN",14.62,26.7,24.1,58,64,"Bancos",-1.12,720],
["B3SA3","B3 ON",13.18,23.7,21.2,55,61,"Financeiro",-0.38,530],
["ABEV3","Ambev ON",13.94,20.8,18.9,51,58,"Bebidas",0.15,410],
["WEGE3","WEG ON",48.31,24.3,25.6,38,44,"Bens Industriais",1.27,284],
["AMER3","Americanas ON",0.91,63.1,52.4,93,96,"Varejo",-1.08,16],
["AZUL4","Azul PN",5.87,58.4,49.1,88,92,"Transporte",-1.93,355],
["CASH3","Méliuz ON",8.15,51.4,43.7,91,94,"Financeiro",2.08,74],
["AERI3","Aeris ON",7.21,49.5,41.2,84,90,"Bens Industriais",-1.06,27],
["CVCB3","CVC Brasil ON",2.61,48.1,41.3,82,88,"Turismo",0.77,142],
["COGN3","Cogna ON",2.04,46.7,39.8,86,90,"Educação",-0.49,62],
["HAPV3","Hapvida ON",3.89,45.6,39.2,81,87,"Saúde",-1.15,167],
["TEND3","Construtora Tenda ON",18.09,44.1,36.7,80,87,"Construção",1.27,42],
["MRVE3","MRV ON",7.35,43.2,37.4,79,85,"Construção",-0.81,133],
["MGLU3","Magazine Luiza ON",10.72,41.2,36.4,78,83,"Varejo",-2.18,512],
["CSNA3","CSN ON",11.83,37.1,31.4,76,82,"Siderurgia",-1.42,205],
["BRAV3","Brava Energia ON",21.77,42.6,35.9,83,89,"Petróleo & Gás",1.38,96],
["LWSA3","Locaweb ON",4.72,41.7,35.2,76,84,"Tecnologia",1.08,34],
["MGLU3","Magazine Luiza ON",10.72,41.2,36.4,78,83,"Varejo",-2.18,512],
["IRBR3","IRB ON",48.15,39.2,33.4,74,80,"Financeiro",0.88,52],
["PETZ3","Petz ON",4.18,35.4,31.1,69,75,"Varejo",0.42,31],
["CSAN3","Cosan ON",9.43,34.2,29.9,68,73,"Petróleo & Gás",-0.63,118],
["MELI3","Mercado Livre",18.50,33.6,28.9,65,71,"Varejo",1.62,91],
["RAIZ4","Raízen PN",2.41,36.7,30.2,71,78,"Petróleo & Gás",-0.77,104],
["RENT3","Localiza ON",48.76,26.9,24.5,57,65,"Transporte",0.61,188],
["PRIO3","Prio ON",43.92,30.8,26.7,73,79,"Petróleo & Gás",1.11,146]
];

const extraTickers=["ALOS3","ALPA4","ALUP11","ARZZ3","ASAI3","AURE3","AZZA3","B3SA3","BBSE3","BPAC3","BRAP3","BRBI11","BRFS3","BRKM5","CMIG4","CPLE6","CRFB3","CYRE3","DXCO3","EGIE3","ELET3","ENEV3","EQTL3","EZTC3","FLRY3","GGBR4","GOAU4","GRND3","GUAR3","HYPE3","INTB3","JBSS3","JHSF3","KLBN11","LREN3","LIGT3","LOGG3","LREN3","MDIA3","MOVI3","MULT3","NEOE3","NTCO3","ODPV3","PCAR3","POMO4","QUAL3","RADL3","RAIL3","SANB11","SBSP3","SLCE3","SMTO3","SUZB3","TAEE11","TIMS3","TOTS3","TRPL4","UGPA3","USIM5","VIVT3","VULC3","YDUQ3","VAMO3","VBBR3","SIMH3","STBP3","TTEN3","CAML3","CURY3","DIRR3","EMBR3","PSSA3","CXSE3","RECV3","KEPL3","ODPV3","SAPR11","AZEV3","EVEN3","RAPT4","MYPK3","JSLG3"];

function hash(i){return (i*9301+49297)%233280/233280}
const assets=[...base];
for(let i=0;i<extraTickers.length;i++){
  const t=extraTickers[i], s=sectors[i%sectors.length], p=2+hash(i+4)*65, iv=19+hash(i+7)*31, hv=iv*(.82+hash(i+2)*.16), rank=Math.round(28+hash(i+8)*66), pct=Math.min(99,Math.round(rank*.93+hash(i)*8)), ch=-2.3+hash(i+12)*4.7, oi=Math.round(18+hash(i+3)*480);
  assets.push([t,t+" ON",p,iv,hv,rank,pct,s,ch,oi]);
}

const state={search:"",sector:"",sort:"ivrank",favorites:new Set()};
const $=s=>document.querySelector(s);
const fmt=(n,d=1)=>n.toLocaleString("pt-BR",{minimumFractionDigits:d,maximumFractionDigits:d});
const money=n=>"R$ "+fmt(n,2);

function render(){
  let list=assets.filter(a=>(!state.search||a[0].toLowerCase().includes(state.search)||a[1].toLowerCase().includes(state.search))&&(!state.sector||a[7]===state.sector));
  list.sort((a,b)=>{
    if(state.sort==="ticker")return a[0].localeCompare(b[0]);
    if(state.sort==="iv")return b[3]-a[3];
    if(state.sort==="price")return b[2]-a[2];
    if(state.sort==="oi")return b[9]-a[9];
    return b[5]-a[5];
  });
  $("#resultCount").textContent=`${list.length} ativos encontrados`;
  $("#cards").innerHTML=list.map((a,i)=>card(a)).join("");
  document.querySelectorAll(".card").forEach(el=>el.addEventListener("click",()=>openModal(el.dataset.ticker)));
  document.querySelectorAll(".star").forEach(el=>el.addEventListener("click",e=>{e.stopPropagation();const t=el.dataset.ticker;state.favorites.has(t)?state.favorites.delete(t):state.favorites.add(t);render()}));
}
function card(a){
  const [t,name,p,iv,hv,rank,pct,sector,ch,oi]=a;
  const fav=state.favorites.has(t)?"★":"☆";
  return `<article class="card" data-ticker="${t}">
    <div class="card-top"><div><div class="ticker">${t}</div><div class="company">${name}</div></div><button class="star" data-ticker="${t}">${fav}</button></div>
    <div class="price-row"><span class="price">${money(p)}</span><span class="change ${ch>=0?"up":"down"}">${ch>=0?"+":""}${fmt(ch,2)}%</span></div>
    <div class="stats">
      <div class="stat"><span>IV</span><strong>${fmt(iv,1)}%</strong></div>
      <div class="stat"><span>HV</span><strong>${fmt(hv,1)}%</strong></div>
      <div class="stat"><span>IV Rank</span><strong>${rank}</strong></div>
      <div class="stat"><span>Percentil</span><strong>${pct}%</strong></div>
    </div>
    <div class="bar"><i style="width:${pct}%"></i></div>
    <div class="bottom"><span>OI ${oi>=1000?fmt(oi/1000,2)+" mi":oi+" mil"}</span><span>${sector}</span></div>
  </article>`;
}

sectors.forEach(s=>$("#sector").insertAdjacentHTML("beforeend",`<option>${s}</option>`));
$("#search").addEventListener("input",e=>{state.search=e.target.value.trim().toLowerCase();render()});
$("#sector").addEventListener("change",e=>{state.sector=e.target.value;render()});
$("#sort").addEventListener("change",e=>{state.sort=e.target.value;render()});
$("#clear").addEventListener("click",()=>{state.search="";state.sector="";state.sort="ivrank";$("#search").value="";$("#sector").value="";$("#sort").value="ivrank";render()});

function getAsset(t){return assets.find(a=>a[0]===t)||assets[0]}
function openModal(t){
  const a=getAsset(t);$("#modalTitle").textContent=a[0];$("#modalSubtitle").textContent=a[1];
  $("#modal").classList.remove("hidden");
  setDetail("series",a);
}
document.querySelectorAll("[data-close]").forEach(e=>e.addEventListener("click",()=>$("#modal").classList.add("hidden")));
document.addEventListener("keydown",e=>{if(e.key==="Escape")$("#modal").classList.add("hidden")});
document.querySelectorAll(".detail-tab").forEach(b=>b.addEventListener("click",()=>setDetail(b.dataset.detail,getAsset($("#modalTitle").textContent))));

function chainRows(a){
  const spot=a[2],iv=a[3]/100, strikes=[.75,.85,.95,1,1.05,1.15,1.25].map(x=>Math.round(spot*x*2)/2);
  return strikes.map((k,i)=>{
    const cp=Math.max(0,spot-k)+Math.max(1.2,spot*.025)*(1+iv)*(1+i*.03);
    const pp=Math.max(0,k-spot)+Math.max(1.1,spot*.022)*(1+iv);
    return `<tr><td><button class="link-btn" onclick="simFromStrike(${k},'CALL')">${a[0]}${String.fromCharCode(65+i)}${(k.toFixed(2)).replace(".","")}</button></td><td class="call">${money(cp)}</td><td>${fmt(iv*100,1)}%</td><td>${fmt(35+ i*4,1)}</td><td>${fmt(62-i*3,0)}</td><td>${fmt(0.92-i*.12,3)}</td><td>${fmt(.04-i*.005,3)}</td><td>${fmt(-.03,3)}</td><td>${fmt(.12-i*.01,3)}</td></tr>
    <tr><td><button class="link-btn" onclick="simFromStrike(${k},'PUT')">${a[0]}${String.fromCharCode(65+i)}P${(k.toFixed(2)).replace(".","")}</button></td><td class="put">${money(pp)}</td><td>${fmt((iv*1.03)*100,1)}%</td><td>${fmt(36+i*3,1)}</td><td>${fmt(60-i*2,0)}</td><td>${fmt(-.08+i*.12,3)}</td><td>${fmt(.04-i*.004,3)}</td><td>${fmt(-.03,3)}</td><td>${fmt(.11-i*.008,3)}</td></tr>`;
  }).join("");
}

function setDetail(type,a){
  document.querySelectorAll(".detail-tab").forEach(b=>b.classList.toggle("active",b.dataset.detail===type));
  const c=$("#detailContent");
  if(type==="series"){
    c.innerHTML=`<div class="detail">
      <div class="detail-grid">
        <div class="detail-box"><h3>Resumo do ativo</h3><div class="kv">
          <div><span>Preço</span><strong>${money(a[2])}</strong></div><div><span>IV</span><strong>${fmt(a[3],1)}%</strong></div><div><span>HV</span><strong>${fmt(a[4],1)}%</strong></div><div><span>IV Rank</span><strong>${a[5]}</strong></div>
        </div></div>
        <div class="detail-box"><h3>Parâmetros</h3><div class="kv">
          <div><span>Percentil</span><strong>${a[6]}%</strong></div><div><span>Setor</span><strong>${a[7]}</strong></div><div><span>OI</span><strong>${a[9]} mil</strong></div><div><span>Variação</span><strong class="${a[8]>=0?"up":"down"}">${a[8]>=0?"+":""}${fmt(a[8],2)}%</strong></div>
        </div></div>
      </div>
      <div class="table-wrap"><table class="chain"><thead><tr><th>Série</th><th>Último</th><th>IV</th><th>IV Rank</th><th>Percentil</th><th>Delta</th><th>Gamma</th><th>Theta</th><th>Vega</th></tr></thead><tbody>${chainRows(a)}</tbody></table></div>
    </div>`;
  } else if(type==="overview"){
    c.innerHTML=`<div class="detail"><div class="detail-grid">
      <div class="detail-box"><h3>Indicadores</h3><div class="kv">
      <div><span>Spot</span><strong>${money(a[2])}</strong></div><div><span>IV</span><strong>${fmt(a[3],1)}%</strong></div><div><span>HV</span><strong>${fmt(a[4],1)}%</strong></div><div><span>IV Rank</span><strong>${a[5]}</strong></div></div></div>
      <div class="detail-box"><h3>Liquidez</h3><div class="kv"><div><span>Open Interest</span><strong>${a[9]} mil</strong></div><div><span>Percentil</span><strong>${a[6]}%</strong></div><div><span>Setor</span><strong>${a[7]}</strong></div><div><span>Spread</span><strong>2,1%</strong></div></div></div>
      </div><div class="notice" style="margin-top:14px">Painel demonstrativo. Os números desta versão são dados de exemplo para a interface; conecte uma fonte de mercado para cotações e séries em tempo real.</div></div>`;
  } else if(type==="flow"){
    c.innerHTML=`<div class="detail"><div class="detail-grid">
      <div class="detail-box"><h3>Fluxo CALL</h3><div class="kv"><div><span>Volume</span><strong>R$ 18,4 mi</strong></div><div><span>Agressão</span><strong class="up">+62%</strong></div><div><span>OI novo</span><strong>+4,8 mil</strong></div><div><span>IV</span><strong>${fmt(a[3],1)}%</strong></div></div></div>
      <div class="detail-box"><h3>Fluxo PUT</h3><div class="kv"><div><span>Volume</span><strong>R$ 12,1 mi</strong></div><div><span>Agressão</span><strong class="down">-38%</strong></div><div><span>OI novo</span><strong>+2,1 mil</strong></div><div><span>IV</span><strong>${fmt(a[3]*1.04,1)}%</strong></div></div></div>
      </div></div>`;
  } else {
    c.innerHTML=simulatorHTML(a);
    initSimulator(a);
  }
}

function simulatorHTML(a){
  return `<div class="detail">
    <div class="sim-controls">
      <div class="field"><label>Ativo</label><input id="sAsset" value="${a[0]}" readonly></div>
      <div class="field"><label>Spot</label><input id="sSpot" type="number" step=".01" value="${a[2]}"></div>
      <div class="field"><label>Strike</label><input id="sStrike" type="number" step=".01" value="${(a[2]*1.05).toFixed(2)}"></div>
      <div class="field"><label>Volatilidade (%)</label><input id="sVol" type="number" step=".1" value="${a[3]}"></div>
      <div class="field"><label>Dias até vencimento</label><input id="sDays" type="number" value="60"></div>
    </div>
    <div class="sim-controls">
      <div class="field"><label>Taxa livre de risco (%)</label><input id="sRate" type="number" step=".01" value="10.5"></div>
      <div class="field"><label>Dividend yield (%)</label><input id="sDiv" type="number" step=".01" value="5"></div>
      <div class="field"><label>Tipo</label><select id="sType"><option>CALL</option><option>PUT</option></select></div>
      <div class="field"><label>Quantidade</label><input id="sQty" type="number" value="100"></div>
      <div class="field"><label>Prêmio pago</label><input id="sPremium" type="number" step=".01" value=""></div>
    </div>
    <div class="sim-actions"><button class="primary" id="calcBtn">Calcular B&S</button><button class="secondary" id="addLeg">Adicionar perna</button><button class="secondary" id="clearLegs">Limpar pernas</button></div>
    <div id="bsResult"></div>
    <div class="payoff"><canvas id="payoffCanvas" width="1100" height="300"></canvas></div>
    <div class="table-wrap leg-table"><table class="chain"><thead><tr><th>Tipo</th><th>Qtd</th><th>Strike</th><th>Prêmio</th><th>Vencimento</th><th>Resultado no vencimento</th></tr></thead><tbody id="legs"></tbody></table></div>
  </div>`;
}

let simLegs=[];
function normPdf(x){return Math.exp(-.5*x*x)/Math.sqrt(2*Math.PI)}
function normCdf(x){return .5*(1+erfApprox(x/Math.sqrt(2)))}
function erfApprox(x){const sign=x<0?-1:1;x=Math.abs(x);const a1=.254829592,a2=-.284496736,a3=1.421413741,a4=-1.453152027,a5=1.061405429,p=.3275911;const t=1/(1+p*x);return sign*(1-((((a5*t+a4)*t+a3)*t+a2)*t+a1)*t*Math.exp(-x*x))}
function bs(spot,strike,vol,rate,div,t,type){
  if(t<=0){const v=type==="CALL"?Math.max(0,spot-strike):Math.max(0,strike-spot);return {price:v,delta:type==="CALL"?(spot>strike?1:0):(spot<strike?-1:0),gamma:0,theta:0,vega:0}}
  const sq=Math.sqrt(t),d1=(Math.log(spot/strike)+(rate-div+vol*vol/2)*t)/(vol*sq),d2=d1-vol*sq;
  const N=normCdf;
  const discQ=Math.exp(-div*t),discR=Math.exp(-rate*t);
  let price,delta;
  if(type==="CALL"){price=spot*discQ*N(d1)-strike*discR*N(d2);delta=discQ*N(d1)}
  else{price=strike*discR*N(-d2)-spot*discQ*N(-d1);delta=-discQ*N(-d1)}
  const gamma=discQ*normPdf(d1)/(spot*vol*sq);
  const vega=spot*discQ*normPdf(d1)*sq/100;
  const theta=(type==="CALL"?(-spot*discQ*normPdf(d1)*vol/(2*sq)-rate*strike*discR*N(d2)+div*spot*discQ*N(d1)):(-spot*discQ*normPdf(d1)*vol/(2*sq)+rate*strike*discR*N(-d2)-div*spot*discQ*N(-d1)))/365;
  return {price,delta,gamma,theta,vega};
}
function initSimulator(a){
  simLegs=[{type:"CALL",qty:100,strike:+(a[2]*1.05).toFixed(2),premium:0}];
  $("#calcBtn").onclick=()=>calculate(a);
  $("#addLeg").onclick=()=>{simLegs.push({type:$("#sType").value,qty:+$("#sQty").value,strike:+$("#sStrike").value,premium:+$("#sPremium").value||0});calculate(a)}
  $("#clearLegs").onclick=()=>{simLegs=[];calculate(a)}
  $("#sType").onchange=()=>{};
  calculate(a);
}
function calculate(a){
  const spot=+$("#sSpot").value, strike=+$("#sStrike").value, vol=+$("#sVol").value/100, rate=+$("#sRate").value/100, div=+$("#sDiv").value/100, days=+$("#sDays").value;
  const type=$("#sType").value, t=days/365;
  const r=bs(spot,strike,vol,rate,div,t,type);
  if(!$("#sPremium").value)$("#sPremium").value=r.price.toFixed(2);
  $("#bsResult").innerHTML=`<div class="detail-box" style="margin-bottom:14px"><h3>Black-Scholes</h3><div class="kv">
    <div><span>Prêmio teórico</span><strong>${money(r.price)}</strong></div><div><span>Delta</span><strong>${r.delta.toFixed(4)}</strong></div><div><span>Gamma</span><strong>${r.gamma.toFixed(4)}</strong></div><div><span>Theta / dia</span><strong>${r.theta.toFixed(4)}</strong></div>
    </div></div>`;
  drawPayoff(spot,strike,type,+$("#sPremium").value||r.price,+$("#sQty").value);
  renderLegs(spot,days);
}
function renderLegs(spot,days){
  $("#legs").innerHTML=simLegs.length?simLegs.map(l=>`<tr><td>${l.type}</td><td>${l.qty}</td><td>${money(l.strike)}</td><td>${money(l.premium)}</td><td>${days} dias</td><td>${money(payoffAt(spot,l))}</td></tr>`).join(""):`<tr><td colspan="6">Nenhuma perna adicionada.</td></tr>`;
}
function payoffAt(s,l){const intrinsic=l.type==="CALL"?Math.max(0,s-l.strike):Math.max(0,l.strike-s);return (intrinsic-l.premium)*l.qty}
function drawPayoff(spot,strike,type,premium,qty){
  const cv=$("#payoffCanvas"),ctx=cv.getContext("2d"),w=cv.width,h=cv.height;
  ctx.clearRect(0,0,w,h);ctx.fillStyle="#0d141c";ctx.fillRect(0,0,w,h);
  const lo=Math.max(.01,spot*.65),hi=spot*1.35;
  const vals=[];for(let i=0;i<=120;i++){const s=lo+(hi-lo)*i/120;let v=simLegs.length?simLegs.reduce((sum,l)=>sum+payoffAt(s,l),0):payoffAt(s,{type,qty,strike,premium});vals.push([s,v])}
  const min=Math.min(...vals.map(x=>x[1]),0),max=Math.max(...vals.map(x=>x[1]),0),pad=28;
  const X=s=>pad+(s-lo)/(hi-lo)*(w-pad*2),Y=v=>h-pad-(v-min)/(max-min||1)*(h-pad*2);
  ctx.strokeStyle="#293746";ctx.lineWidth=1;
  for(let i=0;i<5;i++){const y=pad+i*(h-2*pad)/4;ctx.beginPath();ctx.moveTo(pad,y);ctx.lineTo(w-pad,y);ctx.stroke()}
  ctx.strokeStyle="#687b8d";ctx.beginPath();ctx.moveTo(pad,Y(0));ctx.lineTo(w-pad,Y(0));ctx.stroke();
  ctx.strokeStyle="#79b9ff";ctx.lineWidth=3;ctx.beginPath();vals.forEach((p,i)=>i?ctx.lineTo(X(p[0]),Y(p[1])):ctx.moveTo(X(p[0]),Y(p[1])));ctx.stroke();
  ctx.fillStyle="#8da3b9";ctx.font="11px system-ui";ctx.fillText("Preço do ativo",w/2-35,h-6);ctx.fillText("Resultado",5,18);
}
function simFromStrike(k,type){
  setDetail("simulator",getAsset($("#modalTitle").textContent));
  setTimeout(()=>{$("#sStrike").value=k;$("#sType").value=type;$("#sPremium").value="";$("#calcBtn").click()},0);
}

render();
