import { CalcParams, CalcResult, Stream, UnitResult } from '../types'

// 基于参数的轻量"假计算"：仅用于 UI 联调，数值近似合理但不代表真实物性。
// 后端（DWSIM）就绪后用真实结果替换即可，前端结构不变。
export function computeMock(p: CalcParams): CalcResult {
  const co2In = p.flue_gas_flow * p.co2_inlet // kmol/h
  // 脱除率随级数/再生温度轻微变化，限制在 85%~98%
  const stageFactor = Math.min(1, (p.absorber_stages + p.stripper_stages) / 40)
  const tempFactor = Math.min(1, (p.regen_temp - 373) / 40)
  const removal = Math.max(0.85, Math.min(0.98, 0.8 + 0.12 * stageFactor + 0.06 * tempFactor))
  const co2Out = co2In * (1 - removal)
  const co2Captured = co2In - co2Out

  // 净化气（近似 N2/O2/H2O 不变，CO2 大幅降低）
  const nonCo2 = p.flue_gas_flow - co2In
  const cleanGasFlow = nonCo2 + co2Out

  // 溶剂循环量（粗略正比于捕集量与负载）
  const circ = co2Captured / Math.max(0.05, 0.5 - p.lean_loading) * 6

  // 再沸器热负荷：约 4.0 GJ/t-CO2（t-CO2/h = co2Captured*44/1000）
  const tCO2perH = (co2Captured * 44) / 1000
  const reboilerDuty = tCO2perH * 4000 * 1000 / 3600 // kW （4.0 GJ/t -> kW）

  // 比能耗 GJ/t-CO2（随再生温度变化）
  const specificEnergy = 3.6 + (p.regen_temp - 393) * 0.03

  const streams: Stream[] = [
    {
      id: 'S1', name: '烟气进口',
      components: { CO2: co2In, N2: nonCo2 * 0.78, O2: nonCo2 * 0.12, H2O: nonCo2 * 0.1 },
      molar_flow: p.flue_gas_flow, mass_flow: p.flue_gas_flow * 38,
      temperature: 313, pressure: 1.05, phase: 'Vapor', enthalpy: 0, vapor_fraction: 1
    },
    {
      id: 'S2', name: '净化气',
      components: { CO2: co2Out, N2: nonCo2 * 0.78, O2: nonCo2 * 0.12, H2O: nonCo2 * 0.1 },
      molar_flow: cleanGasFlow, mass_flow: cleanGasFlow * 37,
      temperature: 308, pressure: 1.02, phase: 'Vapor', enthalpy: 0, vapor_fraction: 1
    },
    {
      id: 'S3', name: '富液',
      components: { MEA: circ * 0.3, H2O: circ * 0.6, CO2: co2Captured },
      molar_flow: circ + co2Captured, mass_flow: circ * 30 + co2Captured * 44,
      temperature: 323, pressure: 1.8, phase: 'Liquid', enthalpy: 0, vapor_fraction: 0
    },
    {
      id: 'S4', name: '贫液',
      components: { MEA: circ * 0.3, H2O: circ * 0.6, CO2: co2Captured * (1 - removal) },
      molar_flow: circ + co2Captured * (1 - removal), mass_flow: circ * 30,
      temperature: 333, pressure: 1.8, phase: 'Liquid', enthalpy: 0, vapor_fraction: 0
    },
    {
      id: 'S5', name: 'CO2 产品',
      components: { CO2: co2Captured * 0.98, H2O: co2Captured * 0.02 },
      molar_flow: co2Captured, mass_flow: co2Captured * 44,
      temperature: 313, pressure: 1.5, phase: 'Vapor', enthalpy: 0, vapor_fraction: 1
    }
  ]

  const units: UnitResult[] = [
    { id: 'U1', name: '吸收塔', type: 'Absorber', duty: null,
      spec: { stages: p.absorber_stages, solvent: p.amine_type }, status: 'Solved' },
    { id: 'U2', name: '再生塔', type: 'Stripper', duty: null,
      spec: { stages: p.stripper_stages, regen_temp: p.regen_temp }, status: 'Solved' },
    { id: 'U3', name: '再沸器', type: 'Reboiler', duty: Math.round(reboilerDuty),
      spec: { temp: p.regen_temp }, status: 'Solved' },
    { id: 'U4', name: '贫富液换热器', type: 'HX', duty: null, spec: {}, status: 'Solved' }
  ]

  return {
    case_id: 'CASE-' + Date.now().toString().slice(-6),
    streams,
    units,
    utilities: {
      steam: +(tCO2perH * 1.6).toFixed(2), // t/h 蒸汽（近似）
      power: Math.round(reboilerDuty * 0.05) // kW 电（泵/压缩机近似）
    },
    co2_removal: +(removal * 100).toFixed(1),
    specific_energy: +specificEnergy.toFixed(2),
    solved: true,
    message: '（mock 数据，仅用于界面联调）'
  }
}
