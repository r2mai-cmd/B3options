const $=s=>document.querySelector(s);
const brl=v=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(v||0);
const pct=v=>(v*100).toFixed(1)+'%';
const today=new Date();
const iso=d=>new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,10);
$('#baseDate').value=iso(today);
const defaultExp=new Date(today); defaultExp.setDate(defaultExp.getDate()+60);
$('#expiryDefault').value=iso(defaultExp);

let legs=[
 {side:'BUY',qty:1000,type:'CALL',expiry:$('#expiryDefault').value,strike:38.5,premium:1.55,iv:.30},
 {side:'SELL',qty:1000,type:'CALL',expiry:$('#expiryDefault').value,strike:41,premium:.65,iv:.32},
 {side:'SELL',qty:1000,type:'PUT',expiry:$('#expiryDefault').value,strike:36,premium:.72,iv:.31}
];

function normDate(v){return new Date(v+'T12:00:00')}
function ttm(exp, days=0){
 const b=normDate($('#baseDate').value), e=normDate(exp);
 return Math.max(.0001,(e-b)/86400000-days)/365;
}
function N(x){return .5*(1+erf(x/Math.SQRT2))}
function erf(x){const s=x<0?-1:1,a=Math.abs(x),t=1/(1+.3275911*a),p=1.061405429-1.453152027*t+1.421413741*t*t-0.284496736*t*t*t+0.254829592*t*t*t*t;return s*(1-p*Math.exp(-a*a))}
function pdf(x){return Math.exp(-x*x/2)/Math.sqrt(2*Math.PI)}
function bsGreeks(S,K,T,sigma,type){
 if(T<=0||sigma<=0)return {price:Math.max(type==='CALL'?S-K:K-S,0),delta:type==='CALL'?(S>K?1:0):(S<K?-1:0),gamma:0,theta:0,vega:0};
 const r=.105;
 const d1=(Math.log(S/K)+(r+sigma*sigma/2)*T)/(sigma*Math.sqrt(T)),d2=d1-sigma*Math.sqrt(T);
 const disc=Math.exp(-r*T);
 if(type==='CALL') return {price:S*N(d1)-K*disc*N(d2),delta:N(d1),gamma:pdf(d1)/(S*sigma*Math.sqrt(T)),theta:(-S*pdf(d1)*sigma/(2*Math.sqrt(T))-r*K*disc*N(d2))/365,vega:S*pdf(d1)*Math.sqrt(T)/100};
 return {price:K*disc*N(-d2)-S*N(-d1),delta:N(d1)-1,gamma:pdf(d1)/(S*sigma*Math.sqrt(T)),theta:(-S*pdf(d1)*sigma/(2*Math.sqrt(T))+r*K*disc*N(-d2))/365,vega:S*pdf(d1)*Math.sqrt(T)/100};
}
function payoffAt(S, days=0){
 return legs.reduce((sum,l)=>{
   const intrinsic=Math.max(l.type==='CALL'?S-l.strike:l.strike-S,0);
   const p=(intrinsic-l.premium)*(l.side==='BUY'?1:-1)*l.qty;
   return sum+p;
 },0);
}
function renderRows(){
 const body=$('#legsBody');body.innerHTML='';
 legs.forEach((l,i)=>{
  const g=bsGreeks(+$('#spot').value,l.strike,ttm(l.expiry),l.iv,l.type);
  const tr=document.createElement('tr');
  tr.innerHTML=`
   <td><button class="remove" data-i="${i}">×</button></td>
   <td><select data-i="${i}" data-k="side"><option ${l.side==='BUY'?'selected':''}>BUY</option><option ${l.side==='SELL'?'selected':''}>SELL</option></select></td>
   <td><input data-i="${i}" data-k="qty" type="number" value="${l.qty}"></td>
   <td><select data-i="${i}" data-k="type"><option ${l.type==='CALL'?'selected':''}>CALL</option><option ${l.type==='PUT'?'selected':''}>PUT</option></select></td>
   <td><input data-i="${i}" data-k="expiry" type="date" value="${l.expiry}"></td>
   <td><input data-i="${i}" data-k="strike" type="number" step=".01" value="${l.strike}"></td>
   <td><input data-i="${i}" data-k="premium" type="number" step=".01" value="${l.premium}"></td>
   <td>${brl(l.qty*l.premium*(l.side==='BUY'? -1:1))}</td>
   <td>${pct(l.iv)}</td>
   <td>${(g.delta*(l.side==='BUY'?1:-1)).toFixed(4)}</td>
   <td>${(g.gamma*(l.side==='BUY'?1:-1)).toFixed(5)}</td>
   <td>${(g.theta*l.qty*(l.side==='BUY'?1:-1)).toFixed(2)}</td>
   <td>${(g.vega*l.qty*(l.side==='BUY'?1:-1)).toFixed(2)}</td>`;
  body.appendChild(tr);
 });
 document.querySelectorAll('[data-k]').forEach(el=>el.addEventListener('change',e=>{
   const i=+e.target.dataset.i,k=e.target.dataset.k; let v=e.target.value;
   if(['qty','strike','premium'].includes(k))v=+v;
   if(k==='iv')v=+v;
   legs[i][k]=v; update();
 }));
 document.querySelectorAll('.remove').forEach(b=>b.onclick=()=>{legs.splice(+b.dataset.i,1);update()});
 const net=legs.reduce((s,l)=>s+l.qty*l.premium*(l.side==='BUY'?-1:1),0);
 $('#totalPremium').textContent=brl(net); $('#sumPremium').textContent=brl(net);
}
function draw(){
 const c=$('#payoffChart'),ctx=c.getContext('2d'),dpr=devicePixelRatio||1,rect=c.getBoundingClientRect();
 c.width=rect.width*dpr;c.height=rect.height*dpr;ctx.scale(dpr,dpr);
 const W=rect.width,H=rect.height,pad={l:58,r:20,t:20,b:42};
 ctx.clearRect(0,0,W,H);
 const S=+$('#spot').value||1; const xs=[];for(let i=0;i<=120;i++)xs.push(S*.55+i*(S*.9/120));
 const ys=xs.map(x=>payoffAt(x)); const min=Math.min(...ys,0),max=Math.max(...ys,0),yr=max-min||1;
 const X=x=>pad.l+(x-xs[0])/(xs.at(-1)-xs[0])*(W-pad.l-pad.r);
 const Y=y=>pad.t+(max-y)/yr*(H-pad.t-pad.b);
 ctx.strokeStyle='#263646';ctx.lineWidth=1;ctx.font='12px system-ui';ctx.fillStyle='#7f96ad';
 for(let i=0;i<=5;i++){const y=pad.t+i*(H-pad.t-pad.b)/5,v=max-i*yr/5;ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(W-pad.r,y);ctx.stroke();ctx.fillText(brl(v),5,y+4)}
 const z=Y(0);ctx.strokeStyle='#63788d';ctx.beginPath();ctx.moveTo(pad.l,z);ctx.lineTo(W-pad.r,z);ctx.stroke();
 ctx.strokeStyle='#74baff';ctx.lineWidth=3;ctx.beginPath();ys.forEach((v,i)=>{const x=X(xs[i]),y=Y(v);i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.stroke();
 const sx=X(S);ctx.strokeStyle='#b99b42';ctx.setLineDash([5,5]);ctx.beginPath();ctx.moveTo(sx,pad.t);ctx.lineTo(sx,H-pad.b);ctx.stroke();ctx.setLineDash([]);
 ctx.fillStyle='#9bb0c4';ctx.fillText('Preço do ativo',W/2-38,H-10);
}
function updateSummary(){
 const S=+$('#spot').value||0, vals=Array.from({length:201},(_,i)=>S*.4+i*(S*1.2/200)).map(x=>payoffAt(x));
 const mx=Math.max(...vals),mn=Math.min(...vals);
 const bes=[];let prev=payoffAt(S*.4),px=S*.4;for(let i=1;i<=400;i++){const x=S*.4+i*(S*1.2/400),y=payoffAt(x);if(y===0||y*prev<0)bes.push(x);prev=y;px=x}
 $('#sumSpot').textContent=brl(S);$('#sumPnL').textContent=brl(payoffAt(S));
 $('#sumPnL').className=payoffAt(S)>=0?'positive':'negative';$('#sumMax').textContent=mx>1e8?'Ilimitado':brl(mx);$('#sumMin').textContent=mn<-1e8?'Ilimitado':brl(mn);$('#sumBE').textContent=bes.length?bes.map(brl).join(' · '):'—';
}
function scenarios(){
 const grid=$('#scenarioGrid');grid.innerHTML='';const S=+$('#spot').value||0;
 [0,7,14,30].forEach(d=>{const vals=[.8,.9,1,1.1,1.2].map(m=>payoffAt(S*m,d));const mid=payoffAt(S,d);const el=document.createElement('div');el.className='scenario';el.innerHTML=`<div class="s-title">${d===0?'Vencimento':d+' dias'}</div><b class="${mid>=0?'positive':'negative'}">${brl(mid)}</b><small style="color:#748ca3">Resultado no preço atual</small>`;grid.appendChild(el)});
}
function update(){renderRows();draw();updateSummary();scenarios();$('#strategyStatus').textContent=`${legs.length} perna${legs.length===1?'':'s'} configurada${legs.length===1?'':'s'}`;}
function add(type='CALL',side='BUY'){
 const e=$('#expiryDefault').value,S=+$('#spot').value||38.42;
 legs.push({side,qty:1000,type,expiry:e,strike:+S.toFixed(2),premium:.8,iv:.30});update();
}
$('#addCall').onclick=()=>add('CALL','BUY');$('#addPut').onclick=()=>add('PUT','BUY');$('#addLong').onclick=()=>add('CALL','BUY');$('#addShort').onclick=()=>add('CALL','SELL');
$('#spot').oninput=update;$('#baseDate').onchange=update;$('#expiryDefault').onchange=update;
$('#resetBtn').onclick=()=>{legs=[];add('CALL','BUY')};
window.addEventListener('resize',draw);update();
