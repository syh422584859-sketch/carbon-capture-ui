import { CalcParams, CalcResult } from '../types'
import { computeMock } from './mockData'

// 后端开关：false=使用 mock 数据；true=调用真实 DWSIM 后端（需后端就绪并配置代理）
const USE_REAL_API = false
const API_BASE = '/api'

export async function runCalculation(params: CalcParams): Promise<CalcResult> {
  if (USE_REAL_API) {
    const res = await fetch(`${API_BASE}/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    })
    if (!res.ok) throw new Error('计算服务调用失败')
    return (await res.json()) as CalcResult
  }
  // 模拟网络延时，便于观察 loading 态
  await new Promise((r) => setTimeout(r, 600))
  return computeMock(params)
}
