// 前后端共享数据契约（与后端 Pydantic 模型一一对应）
// 后端就绪后，前端类型即为其返回 JSON 的结构，无需改动。

/** 流股（物料/能量载体） */
export interface Stream {
  id: string
  name: string
  components: Record<string, number> // 组分 -> 摩尔流 (kmol/h)
  molar_flow: number // 总摩尔流 kmol/h
  mass_flow: number // 总质量流 kg/h
  temperature: number // K
  pressure: number // bar
  phase: string // Vapor / Liquid / Mixed
  enthalpy: number // kJ/kmol
  vapor_fraction: number | null
}

/** 单元操作结果 */
export interface UnitResult {
  id: string
  name: string
  type: string // Absorber / Stripper / Reboiler / HX / Pump
  duty: number | null // 热负荷 kW
  spec: Record<string, number | string>
  status: string // Solved / Error
}

/** 一次计算的完整结果 */
export interface CalcResult {
  case_id: string
  streams: Stream[]
  units: UnitResult[]
  utilities: Record<string, number> // 公用工程消耗（蒸汽 t/h、电 kW 等）
  co2_removal: number // 脱除率 %
  specific_energy: number // 比能耗 GJ/t-CO2
  solved: boolean
  message: string | null
}

/** UI 提交的工艺参数（即后端计算的输入） */
export interface CalcParams {
  flue_gas_flow: number // 烟气量 kmol/h
  co2_inlet: number // 入口 CO2 摩尔分数 0~1
  amine_type: string // MEA / DEA / MDEA
  amine_conc: number // 胺质量浓度 %
  absorber_stages: number // 吸收塔理论级数
  stripper_stages: number // 再生塔理论级数
  regen_temp: number // 再生温度 K
  lean_loading: number // 贫液负载 mol CO2/mol amine
}
