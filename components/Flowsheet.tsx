import { Card } from 'antd'
import { ExperimentOutlined } from '@ant-design/icons'
import { CalcResult } from '../types'

// ════════════════════════════════════════════════
//  正经工程 PFD —— 标准化工流程图符号
//  塔 · 管壳换热器 · 釜式再沸器 · 压缩机 · 冷凝器
//  全正交走线，无交叉，中文标注
// ════════════════════════════════════════════════

const W = 740
const H = 420

/* ── SVG 渐变 & 滤镜 ── */
const Defs = () => (
  <defs>
    {/* 塔体 */}
    <linearGradient id="towerBody" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#f8fafc" /><stop offset="38%" stopColor="#ffffff" />
      <stop offset="70%" stopColor="#eef2f6" /><stop offset="100%" stopColor="#dde3ea" />
    </linearGradient>
    {/* 塔封头 */}
    <radialGradient id="towerCap" cx="50%" cy="45%" r="55%">
      <stop offset="0%" stopColor="#ffffff" /><stop offset="75%" stopColor="#e8ecf1" />
      <stop offset="100%" stopColor="#cfd7e0" />
    </radialGradient>
    {/* 换热器壳体 */}
    <linearGradient id="hxBody" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#eff6ff" /><stop offset="40%" stopColor="#f8fafc" />
      <stop offset="65%" stopColor="#e2e8f0" /><stop offset="100%" stopColor="#cbd5e1" />
    </linearGradient>
    {/* 再沸器（暖黄） */}
    <radialGradient id="kettleGrad" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stopColor="#fffbeb" /><stop offset="50%" stopColor="#fef9c3" />
      <stop offset="100%" stopColor="#fde68a" />
    </radialGradient>
    {/* 压缩机（淡蓝） */}
    <radialGradient id="compGrad" cx="40%" cy="35%" r="65%">
      <stop offset="0%" stopColor="#f0f9ff" /><stop offset="50%" stopColor="#e0f2fe" />
      <stop offset="100%" stopColor="#bae6fd" />
    </radialGradient>
    {/* 设备标签绿底 */}
    <linearGradient id="greenTag" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#22c55e" /><stop offset="100%" stopColor="#16a34a" />
    </linearGradient>
    {/* 阴影 */}
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="130%">
      <feDropShadow dx={2} dy={4} stdDeviation={4} floodColor="#94a3b8" floodOpacity={0.22} />
    </filter>
    {/* 流股箭头 —— 灰 */}
    <marker id="ah" markerWidth="11" markerHeight="11" refX={8.5} refY={3.3} orient="auto"
      markerUnits="strokeWidth">
      <path d="M0,0 L9,3.3 L0,6.6 Z" fill="#64748b" />
    </marker>
    {/* 流股箭头 —— 绿（胺液） */}
    <marker id="ahG" markerWidth="11" markerHeight="11" refX={8.5} refY={3.3} orient="auto"
      markerUnits="strokeWidth">
      <path d="M0,0 L9,3.3 L0,6.6 Z" fill="#16a34a" />
    </marker>
  </defs>
)

/* ── ① 立式吸收/再生塔 ── */
const Tower = ({ cx, topY, h, w, name }: {
  cx: number; topY: number; h: number; w: number; name: string
}) => {
  const r = w / 2
  const st = topY + 16   // 塔体顶部 Y
  const sb = topY + h - 16 // 塔体底部 Y
  const trays = 5
  return (
    <g filter="url(#shadow)">
      {/* 塔身矩形 */}
      <rect x={cx - r} y={st} width={w} height={sb - st}
        fill="url(#towerBody)" stroke="#9aa7b4" strokeWidth={1.3} rx={1} />
      {/* 上椭圆封头 */}
      <ellipse cx={cx} cy={st} rx={r} ry={15}
        fill="url(#towerCap)" stroke="#9aa7b4" strokeWidth={1.3} />
      {/* 下椭圆封头 */}
      <ellipse cx={cx} cy={sb} rx={r} ry={15}
        fill="url(#towerCap)" stroke="#9aa7b4" strokeWidth={1.3} />
      {/* 塔板虚线 */}
      {Array.from({ length: trays }).map((_, i) => (
        <line key={i}
          x1={cx - r + 7} y1={st + 24 + (sb - st - 44) * i / (trays - 1)}
          x2={cx + r - 7} y2={st + 24 + (sb - st - 44) * i / (trays - 1)}
          stroke="#aeb9c6" strokeWidth={0.85} strokeDasharray="3 3" opacity={0.6} />
      ))}
      {/* 支腿 */}
      <line x1={cx - r * 0.36} y1={sb + 13} x2={cx - r * 0.42} y2={sb + 28}
        stroke="#94a3b8" strokeWidth={2.2} strokeLinecap="round" />
      <line x1={cx + r * 0.36} y1={sb + 13} x2={cx + r * 0.42} y2={sb + 28}
        stroke="#94a3b8" strokeWidth={2.2} strokeLinecap="round" />
      {/* 名称标签 */}
      <rect x={cx - 32} y={topY + h + 12} width={64} height={22} rx={11} fill="url(#greenTag)" />
      <text x={cx} y={topY + h + 27} textAnchor="middle" fontSize={11.5}
        fontWeight={700} fill="#fff">{name}</text>
    </g>
  )
}

/* ── ② 管壳式换热器 ── */
const ShellTubeHX = ({ cx, cy, w, h, name }: {
  cx: number; cy: number; w: number; h: number; name: string
}) => {
  const hr = h / 2
  const headR = hr // 封头半径 = 半高
  return (
    <g filter="url(#shadow)">
      {/* 壳体（圆角矩形） */}
      <rect x={cx - w / 2} y={cy - hr} width={w} height={h} rx={hr}
        fill="url(#hxBody)" stroke="#9aa7b4" strokeWidth={1.3} />
      {/* 左管箱（圆形） */}
      <circle cx={cx - w / 2 + headR} cy={cy} r={headR}
        fill="#dbeafe" stroke="#9aa7b4" strokeWidth={1.3} />
      {/* 右管箱（圆形） */}
      <circle cx={cx + w / 2 - headR} cy={cy} r={headR}
        fill="#dbeafe" stroke="#9aa7b4" strokeWidth={1.3} />
      {/* 内部管束线 */}
      {Array.from({ length: 4 }).map((_, i) => (
        <line key={i}
          x1={cx - w / 2 + headR + 6} y1={cy - hr + 10 + (h - 20) * i / 3}
          x2={cx + w / 2 - headR - 6} y2={cy - hr + 10 + (h - 20) * i / 3}
          stroke="#94a3b8" strokeWidth={0.7} opacity={0.4} />
      ))}
      {/* 名称标签 */}
      <rect x={cx - 48} y={cy + hr + 14} width={96} height={22} rx={11} fill="url(#greenTag)" />
      <text x={cx} y={cy + hr + 29} textAnchor="middle" fontSize={11.5}
        fontWeight={700} fill="#fff">{name}</text>
    </g>
  )
}

/* ── ③ 釜式再沸器 ── */
const KettleReboiler = ({ cx, cy, r, name }: {
  cx: number; cy: number; r: number; name: string
}) => (
  <g filter="url(#shadow)">
    {/* 圆形釜体 */}
    <circle cx={cx} cy={cy} r={r}
      fill="url(#kettleGrad)" stroke="#ca8a04" strokeWidth={1.4} />
    {/* 液位线 */}
    <line x1={cx - r + 7} y1={cy + r * 0.30} x2={cx + r - 7} y2={cy + r * 0.30}
      stroke="#ca8a04" strokeWidth={1.1} opacity={0.5} />
    {/* 加热盘管（椭圆示意） */}
    <ellipse cx={cx} cy={cy + 5} rx={r * 0.52} ry={r * 0.32}
      fill="none" stroke="#ca8a04" strokeWidth={0.9} opacity={0.3} />
    {/* 名称标签 */}
    <rect x={cx - 28} y={cy + r + 10} width={56} height={22} rx={11} fill="url(#greenTag)" />
    <text x={cx} y={cy + r + 25} textAnchor="middle" fontSize={11.5}
      fontWeight={700} fill="#fff">{name}</text>
  </g>
)

/* ── ④ 离心压缩机 ── */
const Compressor = ({ cx, cy, r, name }: {
  cx: number; cy: number; r: number; name: string
}) => (
  <g filter="url(#shadow)">
    {/* 外壳圆 */}
    <circle cx={cx} cy={cy} r={r}
      fill="url(#compGrad)" stroke="#2563eb" strokeWidth={1.4} />
    {/* 叶轮（内切多边形） */}
    <polygon points={`${cx},${cy - r * 0.58} ${cx + r * 0.52},${cy - r * 0.18} ${cx + r * 0.52},${cy + r * 0.36} ${cx - r * 0.52},${cy + r * 0.36} ${cx - r * 0.52},${cy - r * 0.18}`}
      fill="none" stroke="#3b82f6" strokeWidth={1} opacity={0.5} />
    {/* 中心轴点 */}
    <circle cx={cy} cy={cy} r={r * 0.08} fill="#1d4ed8" opacity={0.4} />
    {/* 入口喇叭口 */}
    <path d={`M${cx - r}, ${cy - r * 0.18} Q${cx - r * 1.25}, ${cy} ${cx - r}, ${cy + r * 0.18}`}
      fill="none" stroke="#93c5fd" strokeWidth={1} opacity={0.5} />
    {/* 出口箭头方向 */}
    <line x1={cx + r * 0.56} y1={cy} x2={cx + r * 0.78} y2={cy}
      stroke="#3b82f6" strokeWidth={1.5} markerEnd="url(#ah)" />
    {/* 名称标签 */}
    <rect x={cx - 26} y={cy + r + 10} width={52} height={22} rx={11} fill="url(#greenTag)" />
    <text x={cx} y={cy + r + 25} textAnchor="middle" fontSize={11.5}
      fontWeight={700} fill="#fff">{name}</text>
  </g>
)

/* ── ⑤ 冷凝器/冷却器（小型管壳式）── */
const Condenser = ({ cx, cy, w, h, name }: {
  cx: number; cy: number; w: number; h: number; name: string
}) => {
  const hr = h / 2
  return (
    <g filter="url(#shadow)">
      <rect x={cx - w / 2} y={cy - hr} width={w} height={h} rx={hr}
        fill="url(#hxBody)" stroke="#9aa7b4" strokeWidth={1.2} />
      <circle cx={cx - w / 2 + hr} cy={cy} r={hr}
        fill="#e0f2fe" stroke="#9aa7b4" strokeWidth={1.2} />
      <circle cx={cx + w / 2 - hr} cy={cy} r={hr}
        fill="#e0f2fe" stroke="#9aa7b4" strokeWidth={1.2} />
      {/* 内部冷却水管 */}
      {Array.from({ length: 3 }).map((_, i) => (
        <line key={i}
          x1={cx - w / 2 + hr + 5} y1={cy - hr + 10 + (h - 20) * i / 2}
          x2={cx + w / 2 - hr - 5} y2={cy - hr + 10 + (h - 20) * i / 2}
          stroke="#38bdf8" strokeWidth={0.7} opacity={0.4} />
      ))}
      {/* 名称标签 */}
      <rect x={cx - 26} y={cy + hr + 12} width={52} height={22} rx={11} fill="url(#greenTag)" />
      <text x={cx} y={cy + hr + 27} textAnchor="middle" fontSize={11.5}
        fontWeight={700} fill="#fff">{name}</text>
    </g>
  )
}

/* ── 物流端点（入口/出口节点）── */
const StreamNode = ({ cx, cy, label }: { cx: number; cy: number; label: string }) => (
  <g>
    <rect x={cx - 40} y={cy - 13} width={80} height={26} rx={13}
      fill="#f8fafc" stroke="#94a3b8" strokeWidth={1.2} />
    <text x={cx} y={cy + 4.5} textAnchor="middle" fontSize={11.5}
      fontWeight={600} fill="#374151">{label}</text>
  </g>
)

/* ── 正交折线流股 ── */
const Flow = ({ points, label, color = '#64748b', dashed = false, labelAt }:
  {
    points: [number, number][]
    label?: string
    color?: string
    dashed?: boolean
    labelAt?: [number, number]
  }) => {
  /* 找最长段放标签 */
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
      <path d={d} fill="none" stroke={color} strokeWidth={1.75} strokeLinejoin="round"
        strokeDasharray={dashed ? '6 4' : undefined}
        markerEnd={color === '#16a34a' ? 'url(#ahG)' : 'url(#ah)'} />
      {label && (
        <text x={lx} y={ly - 7} textAnchor="middle" fontSize={10.5}
          fontWeight={600} fill={color === '#16a34a' ? '#16a34a' : '#475569'}>
          {label}
        </text>
      )}
    </g>
  )
}

/* ════════════════════════════════════════
 *  主组件：PFD 工艺流程图
 *
 *  布局（匹配 ui_ccs_designer.png 参考图）：
 *
 *     ┌────────┐    ┌────────┐    ┌────────┐
 *     │ 吸收塔 │ → │ 再生塔 │ → │ 压缩机 │
 *     └───┬────┘    └───┬────┘    └───┬────┘
 *         │             │              │
 *         ▼             ▼              ▼
 *    ┌────────┐   ┌────────┐     ┌────────┐
 *    │贫富液换│   │ 再沸器 │     │ 冷凝器 │
 *    │ 热器   │   │        │     │        │
 *    └────────┘   └────────┘     └────────┘
 *
 *  烟气从左侧进入吸收塔底部
 *  再沸器在再生塔右下角
 * ════════════════════════════════════════ */

interface Props { result: CalcResult | null }

export default function Flowsheet({ result }: Props) {

  // ═══ 设备坐标常量 ═══
  // 上排设备中心 X
  const AX = 170   // 吸收塔
  const SX = 380   // 再生塔
  const CX = 580   // 压缩机
  // 下排设备中心 X
  const HX = 150   // 贫富液换热器
  const RBX = 350  // 再沸器
  const CDX = 550  // 冷凝器
  // Y 坐标
  const TOP_Y = 46           // 上排塔顶
  const TOWER_H = 190        // 塔总高
  const BOTTOM_CY = 310      // 下排设备中心 Y
  const INLET_Y = 210        // 烟气入口高度

  return (
    <Card title={
      <span><ExperimentOutlined style={{ color: '#1890ff', marginRight: 6 }} />工艺流程（PFD）</span>
    } size="small" style={{ borderRadius: 10 }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%"
        style={{ background: '#fff', borderRadius: 8, border: '1px solid #eef2f5' }}>
        <Defs />

        {/* ═══════ 设备放置 ═══════ */}

        {/* — 入口/出口节点 — */}
        <StreamNode cx={36} cy={INLET_Y} label="烟气" />
        <StreamNode cx={AX} cy={20} label="净化气" />
        <StreamNode cx={CX + 72} cy={INLET_Y - 90} label="CO₂产品" />

        {/* — 上排：吸收塔 / 再生塔 / 压缩机 — */}
        <Tower cx={AX} topY={TOP_Y} h={TOWER_H} w={54} name="吸收塔" />
        <Tower cx={SX} topY={TOP_Y} h={TOWER_H} w={54} name="再生塔" />
        <Compressor cx={CX} cy={TOP_Y + TOWER_H * 0.45} r={28} name="压缩机" />

        {/* — 下排：贫富液换热器 / 再沸器 / 冷凝器 — */}
        <ShellTubeHX cx={HX} cy={BOTTOM_CY} w={130} h={44} name="贫富液换热器" />
        <KettleReboiler cx={RBX} cy={BOTTOM_CY + 20} r={24} name="再沸器" />
        <Condenser cx={CDX} cy={BOTTOM_CY} w={110} h={40} name="冷凝器" />

        {/* ═════ 物流连线（正交走线） ═══════ */}

        {/* ① 烟气 → 吸收塔底部 */}
        <Flow points={[
          [76, INLET_Y],
          [76, INLET_Y + 30],
          [AX, INLET_Y + 30]
        ]} label="烟气" labelAt={[AX - 38, INLET_Y + 23] as any} />

        {/* ② 净化气 ← 吸收塔顶部 */}
        <Flow points={[
          [AX, TOP_Y + 17],
          [AX, 20],
          [AX, 33]
        ]} label="净化气" labelAt={[AX + 38, 27] as any} />

        {/* ③ 富液：吸收塔底 → 贫富液换热器（左端） */}
        <Flow points={[
          [AX, TOP_Y + TOWER_H - 17],
          [AX, BOTTOM_CY],
          [HX + 65, BOTTOM_CY]
        ]} label="富液" color="#16a34a" labelAt={[AX + 30, BOTTOM_CY - 8] as any} />

        {/* ④ 富液出口 → 再生塔中部 */}
        <Flow points={[
          [HX + 130, BOTTOM_CY],
          [SX + 27, BOTTOM_CY],
          [SX + 27, TOP_Y + TOWER_H * 0.62]
        ]} color="#16a34a" />

        {/* ⑤ CO₂：再生塔顶 → 冷凝器 → 压缩机 */}
        <Flow points={[
          [SX, TOP_Y + 17],
          [CDX, TOP_Y + 17],
          [CDX, BOTTOM_CY - 20]
        ]} label="CO₂+水" labelAt={[SX + 50, TOP_Y + 10] as any} />

        {/* ⑥ 冷凝后 → 压缩机入口 */}
        <Flow points={[
          [CDX, BOTTOM_CY + 20],
          [CX, BOTTOM_CY + 20],
          [CX, TOP_Y + TOWER_H * 0.45 + 28]
        ]} label="纯CO₂" labelAt={[CX - 30, BOTTOM_CY + 13] as any} />

        {/* ⑦ 压缩机出口 → CO₂产品 */}
        <Flow points={[
          [CX + 28, TOP_Y + TOWER_H * 0.45],
          [CX + 68, TOP_Y + TOWER_H * 0.45],
          [CX + 72, INLET_Y - 117]
        ]} />

        {/* ⑧ 再沸器循环：再生塔底 → 再沸器 */}
        <Flow points={[
          [SX + 21, TOP_Y + TOWER_H - 17],
          [SX + 21, BOTTOM_CY + 20],
          [RBX - 24, BOTTOM_CY + 20]
        ]} />

        {/* ⑨ 再沸器返回 → 再生塔下部 */}
        <Flow points={[
          [RBX + 24, BOTTOM_CY + 20],
          [SX + 37, BOTTOM_CY + 20],
          [SX + 37, TOP_Y + TOWER_H - 17]
        ]} />

        {/* ⑩ 贫液回流（绿色虚线）：再生塔底/换热器 → 吸收塔顶 */}
        <Flow points={[
          [HX - 65, BOTTOM_CY],
          [AX + 54, BOTTOM_CY],       // 绕到右侧
          [AX + 54, TOP_Y + 80],
          [AX, TOP_Y + 80],
          [AX, TOP_Y + 17]
        ]} label="贫液" color="#16a34a" dashed labelAt={[AX + 66, TOP_Y + 73] as any} />

        {/* ═════ 关键指标条 ═════ */}
        {result ? (
          <g transform="translate(16, 370)">
            <rect x={0} y={0} width={708} height={38} rx={8}
              fill="#f0fdf4" stroke="#86efac" strokeWidth={1} />
            <text x={14} y={24} fontSize={11.5} fontWeight={600} fill="#166534">
              CO₂脱除率 {result.co2_removal}%　│　比能耗 {result.specific_energy} GJ/t
              　│　蒸汽 {result.utilities?.steam ?? '—'} t/h　│　电耗 {result.utilities?.power ?? '—'} kW
              　│　吸收塔径 ~3.2 m　│　再生塔径 ~2.1 m
            </text>
          </g>
        ) : (
          <g transform="translate(16, 370)">
            <rect x={0} y={0} width={708} height={38} rx={8}
              fill="#f9fafb" stroke="#e5e7eb" strokeWidth={1} />
            <text x={354} y={24} textAnchor="middle" fontSize={12} fill="#9ca3af">
              设定参数并点击「计算」后，此处显示关键指标
            </text>
          </g>
        )}
      </svg>
    </Card>
  )
}
