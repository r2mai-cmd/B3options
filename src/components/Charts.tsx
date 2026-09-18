import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, AreaChart, Area } from 'recharts'
import type { HistoryPoint } from '../types'
import { ChartCard } from './ChartCard'
import { strikeCurve, termStructure, skew } from '../data/mockData'

const tip = { contentStyle: { background:'#0d1b29', border:'1px solid #20344a', borderRadius:8, color:'#dce8f5' }, itemStyle:{ color:'#dce8f5' } }

export function IVHVChart({ data }: { data: HistoryPoint[] }) {
  return <ChartCard title="IV vs HV (252 dias)" right={<span className="legend"><i className="dot green"/> IV <i className="dot blue"/> HV 30D</span>}>
    <ResponsiveContainer width="100%" height={235}>
      <LineChart data={data.filter((_,i)=>i%5===0)}><CartesianGrid stroke="#173047" strokeDasharray="3 3"/><XAxis dataKey="date" stroke="#637a90" tick={{fontSize:10}}/><YAxis stroke="#637a90" tick={{fontSize:10}} unit="%"/><Tooltip {...tip}/><Line type="monotone" dataKey="iv" stroke="#38e58c" dot={false} strokeWidth={2}/><Line type="monotone" dataKey="hv" stroke="#4aa7ff" dot={false} strokeWidth={2}/></LineChart>
    </ResponsiveContainer>
  </ChartCard>
}

export function RankChart({ data }: { data: HistoryPoint[] }) {
  return <ChartCard title="IV Rank (1 ano)"><ResponsiveContainer width="100%" height={235}><AreaChart data={data.filter((_,i)=>i%5===0)}><CartesianGrid stroke="#173047" strokeDasharray="3 3"/><XAxis dataKey="date" stroke="#637a90" tick={{fontSize:10}}/><YAxis domain={[0,100]} stroke="#637a90" tick={{fontSize:10}}/><Tooltip {...tip}/><Area type="monotone" dataKey="rank" stroke="#ad72ff" fill="#ad72ff" fillOpacity={.16} strokeWidth={2}/></AreaChart></ResponsiveContainer></ChartCard>
}

export function DistributionChart({ data }: { data: HistoryPoint[] }) {
  const bins = Array.from({length:12}, (_,i)=>({range:`${10+i*4}%`, count:data.filter(x=>x.iv >= 10+i*4 && x.iv < 14+i*4).length}))
  return <ChartCard title="Distribuição de IV (1 ano)"><ResponsiveContainer width="100%" height={235}><BarChart data={bins}><CartesianGrid stroke="#173047" strokeDasharray="3 3"/><XAxis dataKey="range" stroke="#637a90" tick={{fontSize:9}}/><YAxis stroke="#637a90" tick={{fontSize:10}}/><Tooltip {...tip}/><Bar dataKey="count" fill="#4aa7ff" radius={[3,3,0,0]}/></BarChart></ResponsiveContainer></ChartCard>
}

export function StrikeChart() {
  return <ChartCard title="IV por Strike (16/10/2026)" right={<span className="legend"><i className="dot green"/> Call <i className="dot red"/> Put</span>}><ResponsiveContainer width="100%" height={250}><LineChart data={strikeCurve}><CartesianGrid stroke="#173047" strokeDasharray="3 3"/><XAxis dataKey="strike" stroke="#637a90"/><YAxis stroke="#637a90" unit="%" /><Tooltip {...tip}/><Line dataKey="call" stroke="#38e58c" dot={false} strokeWidth={2}/><Line dataKey="put" stroke="#ff5d78" dot={false} strokeWidth={2}/></LineChart></ResponsiveContainer></ChartCard>
}

export function TermChart() {
  return <ChartCard title="IV por Vencimento"><ResponsiveContainer width="100%" height={250}><LineChart data={termStructure}><CartesianGrid stroke="#173047" strokeDasharray="3 3"/><XAxis dataKey="dte" stroke="#637a90" label={{value:'Dias',position:'insideBottom',offset:-3,fill:'#637a90'}}/><YAxis stroke="#637a90" unit="%"/><Tooltip {...tip}/><Line dataKey="iv" stroke="#38e58c" dot={{r:3}} strokeWidth={2}/></LineChart></ResponsiveContainer></ChartCard>
}

export function SkewChart() {
  return <ChartCard title="Skew (25Δ)" right={<span className="legend"><i className="dot green"/> Call 25Δ <i className="dot red"/> Put 25Δ</span>}><ResponsiveContainer width="100%" height={250}><LineChart data={skew}><CartesianGrid stroke="#173047" strokeDasharray="3 3"/><XAxis dataKey="date" stroke="#637a90"/><YAxis stroke="#637a90" unit="%"/><Tooltip {...tip}/><Line dataKey="call" stroke="#38e58c" dot={false} strokeWidth={2}/><Line dataKey="put" stroke="#ff5d78" dot={false} strokeWidth={2}/></LineChart></ResponsiveContainer></ChartCard>
}
