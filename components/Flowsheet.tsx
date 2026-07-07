import { Card } from 'antd'
import { ExperimentOutlined } from '@ant-design/icons'
import { CalcResult } from '../types'

// 正经 PFD —— 标准工程流程图符号
//   塔：椭圆封头 + 塔板立式容器
//   换热器：管壳式（壳体 + 两端管箱）
//   再沸器：釜式（带液位线）
// 走线：正交（横平竖直），不交叉；全中文

const W = 740
const H = 440

const Defs = () => (
  <defs>
    <linearGradient id="towerBody" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#f8fafc" /><stop offset="38%" stopColor="#ffffff" />
      <stop offset="70%" stopColor="#eef2f6" /><stop offset="100%" stopColor="#dde3ea" />
    </linearGradient>
    <radialGradient id="towerCap" cx="50%" cy="45%" r="55%">
      <stop offset="0%" stopColor="#ffffff" /><stop offset="75%" stopColor="#e8ecf1" />
      <stop offset="100%" stopColor="#cfd7e0" />
    </radialGradient>
    <linearGradient id="tankBody" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#eef2f6" /><stop offset="40%" stopColor="#f7f9fb" />
      <stop offset="65%" stopColor="#e4e9ef" /><stop offset="100%" stopColor="#d0d8e2" />
    </linearGradient>
    <linearGradient id="kettleGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#fefce8" /><stop offset="50%" stopColor="#fef9c3" />
      <stop offset="100%" stopColor="#fde68a" />
    </linearGradient>
    <linearGradient id="greenTag" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#22c55e" /><stop offset="100%" stopColor="#16a34a" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="130%">
      <feDropShadow dx={2} dy={4} stdDeviation={4} floodColor="#94a3b8" floodOpacity={0.22} />
    </filter>
    <marker id="ah" markerWidth="11" markerHeight="11" refX={8.5} refY={3.3} orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L9,3.3 L0,6.6 Z" fill="#64748b" />
    </marker>
    <marker id="ahG" markerWidth="11" markerHeight="11" refX={8.5} refY={3.3} orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L9,3.3 L0,6.6 Z" fill="#16a34a" />
    </marker>
  </defs>
)

// 立式塔（吸收塔 / 再生塔）
const Tower = ({ cx, topY, h, w, name }: { cx: number; topY: number; h: number; w: number; name: string }) => {
  const r = w / 2, st = topY + 16, sb = topY + h - 16
  const trays = 5
  return (
    <g filter="url(#shadow)">
      <rect x={cx - r} y={st} width={w} height={sb - st} fill="url(#towerBody)" stroke="#9aa7b4" strokeWidth={1.3} />
      <ellipse cx={cx} cy={st} rx={r} ry={15} fill="url(#towerCap)" stroke="#9aa7b4" strokeWidth={1.3} />
      <ellipse cx={cx} cy={sb} rx={r} ry={15} fill="url(#towerCap)" stroke="#9aa7b4" strokeWidth={1.3} />
      {Array.from({ length: trays }).map((_, i) =>
        <line key={i} x1={cx - r + 6} y1={st + 24 + (sb - st - 44) * i / (trays - 1)}
          x2={cx + r - 6} y2={st + 24 + (sb - st - 44) * i / (trays - 1)}
          stroke="#aeb9c6" strokeWidth={0.9} opacity={0.6} strokeDasharray="3 3" />
      )}
      <line x1={cx - r * 0.38} y1={sb + 14} x2={cx - r * 0.42} y2={sb + 30} stroke="#94a3b8" strokeWidth={2.2} strokeLinecap="round" />
      <line x1={cx + r * 0.38} y1={sb + 14} x2={cx + r * 0.42} y2={sb + 30} stroke="#94a3b8" strokeWidth={2.2} strokeLinecap="round" />
      <rect x={cx - 34} y={topY + h + 12} width={68} height={22} rx={11} fill="url(#greenTag)" />
      <text x={cx} y={topY + h + 27} textAnchor="middle" fontSize={11.5} fontWeight={700} fill="#fff">{name}</text>
    </g>
  )
}

// 管壳式换热器
const ShellTubeHX = ({ cx, cy, w, h, name }: { cx: number; cy: number; w: number; h: number; name: string }) => {
  const r = h / 2
  return (
    <g filter="url(#shadow)">
      <rect x={cx - w / 2} y={cy - r} width={w} height={h} rx={r} fill="url(#tankBody)" stroke="#9aa7b4" strokeWidth={1.3} />
      <circle cx={cx - w / 2 + r} cy={cy} r={r} fill="#e8ecf1" stroke="#9aa7b4" strokeWidth={1.3} />
      <circle cx={cx + w / 2 - r} cy={cy} r={r} fill="#e8ecf1" stroke="#9aa7b4" strokeWidth={1.3} />
      {Array.from({ length: 4 }).map((_, i) =>
        <line key={i} x1={cx - w / 2 + r + 5} y1={cy - r + 9 + (h - 18) * i / 3}
          x2={cx + w / 2 - r - 5} y2={cy - r + 9 + (h - 18) * i / 3}
          stroke="#94a3b8" strokeWidth={0.7} opacity={0.45} />
      )}
      <rect x={cx - 48} y={cy + r + 12} width={96} height={22} rx={11} fill="url(#greenTag)" />
      <text x={cx} y={cy + r + 27} textAnchor="middle" fontSize={11.5} fontWeight={700} fill="#fff">{name}</text>
    </g>
  )
}

// 釜式再沸器
const KettleReboiler = ({ cx, cy, r, name }: { cx: number; cy: number; r: number; name: string }) => (
  <g filter="url(#shadow)">
    <circle cx={cx} cy={cy} r={r} fill="url(#kettleGrad)" stroke="#ca8a04" strokeWidth={1.4} />
    <line x1={cx - r + 7} y1={cy + r * 0.30} x2={cx + r - 7} y2={cy + r * 0.30}
      stroke="#ca8a04" strokeWidth={1.1} opacity={0.5} />
    <ellipse cx={cx} cy={cy + 5} rx={r * 0.55} ry={r * 0.34} fill="none" stroke="#ca8a04" strokeWidth={1} opacity={0.3} />
    <rect x={cx - 32} y={cy + r + 10} width={64} height={22} rx={11} fill="url(#greenTag)" />
    <text x={cx} y={cy + r + 25} textAnchor="middle" fontSize={11.5} fontWeight={700} fill="#fff">{name}</text>
  </g>
)

// 物流端点
const StreamNode = ({ cx, cy, label }: { cx: number; cy: number; label: string }) => (
  <g>
    <rect x={cx - 44} y={cy - 14} width={88} height={28} rx={14}
      fill="#f8fafc" stroke="#94a3b8" strokeWidth={1.3} />
    <text x={cx} y={cy + 4.5} textAnchor="middle" fontSize={12} fontWeight={600} fill="#374151">{label}</text>
  </g>
)

// 正交折线流股
const Flow = ({ points, label, color = '#64748b', dashed = false, labelAt }:
  { points: [number, number][]; label?: string; color?: string; dashed?: boolean; labelAt?: [number, number] }) => {
  let mi = 1, ml = 0
  for (let i = 1; i < points.length; i++) {
    const L = Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1])
    if (L > ml) { ml = L; mi = i }
  }
  const lx = labelAt ? labelAt[0] : (points[mi][0] + points[mi - 1][0]) / 2
  const ly = labelAt ? labelAt[1] : (points[mi][1] + points[mi - 1][1]) / 2
  const d = points.map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join(' ')
  return (
    <g>
      <path d={d} fill="none" stroke={color} strokeWidth={1.8} strokeLinejoin="round"
        strokeDasharray={dashed ? '6 4' : undefined}
        markerEnd={color === '#16a34a' ? 'url(#ahG)' : 'url(#ah)'} />
      {label && <text x={lx} y={ly - 7} textAnchor="middle" fontSize={11} fontWeight={600}
        fill={color === '#16a34a' ? '#16a34a' : '#475569'}>{label}</text>}
    </g>
  )
}

interface Props { result: CalcResult | null }

export default function Flowsheet({ result }: Props) {
  return (
    <Card title={<span><ExperimentOutlined style={{ color: '#1890ff', marginRight: 6 }} />工艺流程（PFD）</span>}
      size="small" style={{ borderRadius: 10 }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%"
        style={{ background: '#fff', borderRadius: 8, border: '1px solid #eef2f5' }}>
        <Defs />

        {/* 设备 */}
        <StreamNode cx={40} cy={250} label="烟气" />
        <Tower cx={190} topY={55} h={210} w={54} name="吸收塔" />
        <ShellTubeHX cx={410} cy={315} w={140} h={46} name="贫富液换热器" />
        <Tower cx={590} topY={55} h={210} w={54} name="再生塔" />
        <KettleReboiler cx={670} cy={350} r={24} name="再沸器" />
        <StreamNode cx={350} cy={28} label="净化气" />
        <StreamNode cx={700} cy={28} label="CO₂" />

        {/* 物流（正交走线）*/}
        {/* 烟气 → 吸收塔底 */}
        <Flow points={[[76, 250], [76, 282], [190, 282]]} label="烟气" labelAt={[133, 274] as any} />
        {/* 净化气 ← 吸收塔顶 */}
        <Flow points={[[190, 71], [350, 71], [350, 46]]} label="净化气" labelAt={[270, 63] as any} />
        {/* 富液：吸收塔底 → 换热器 */}
        <Flow points={[[190, 270], [190, 317], [340, 317]]} label="富液" color="#16a34a" labelAt={[265, 310] as any} />
        {/* 富液 → 再生塔 */}
        <Flow points={[[480, 317], [590, 317], [590, 270]]} color="#16a34a" />
        {/* CO₂ ← 再生塔顶 */}
        <Flow points={[[590, 71], [700, 71], [700, 46]]} label="CO₂" labelAt={[645, 63] as any} />
        {/* 再沸器循环 */}
        <Flow points={[[605, 270], [605, 328], [646, 328], [646, 350]]} />
        <Flow points={[[694, 350], [694, 328], [659, 328], [659, 270]]} />
        {/* 贫液回流（虚线绿）：再生塔底 → 换热器 → 吸收塔顶 */}
        <Flow points={[
          [590, 254], [480, 254], [340, 254], [255, 254], [255, 130], [190, 130], [190, 71]
        ]} label="贫液" color="#16a34a" dashed labelAt={[480, 246] as any} />

        {/* 关键指标条 */}
        {result ? (
          <g transform="translate(16, 392)">
            <rect x={0} y={0} width={708} height={40} rx={8} fill="#f0fdf4" stroke="#86efac" strokeWidth={1} />
            <text x={14} y={25} fontSize={12} fontWeight={600} fill="#166534">
              CO₂脱除率 {result.co2_removal}%　|　比能耗 {result.specific_energy} GJ/t
              　|　蒸汽 {result.utilities?.steam} t/h　|　电耗 {result.utilities?.power} kW
              　|　吸收塔径 ~3.2 m　|　再生塔径 ~2.1 m
            </text>
          </g>
        ) : (
          <g transform="translate(16, 392)">
            <rect x={0} y={0} width={708} height={40} rx={8} fill="#f9fafb" stroke="#e5e7eb" strokeWidth={1} />
            <text x={354} y={25} textAnchor="middle" fontSize={12.5} fill="#9ca3af">
              设定参数并点击「计算」后，此处显示关键指标
            </text>
          </g>
        )}
      </svg>
    </Card>
  )
}
