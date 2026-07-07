import { useState } from 'react'
import { Tabs, App as AntdApp, Tag, Row, Col } from 'antd'
import {
  EnvironmentOutlined,
  CalculatorOutlined,
  SettingOutlined,
  FileImageOutlined,
  FileTextOutlined,
  ExportOutlined,
  TableOutlined,
  ToolOutlined,
  CodeOutlined,
  PictureOutlined,
  CheckCircleOutlined
} from '@ant-design/icons'
import ParamPanel from './components/ParamPanel'
import Flowsheet from './components/Flowsheet'
import StreamTable from './components/StreamTable'
import ActionPanel from './components/ActionPanel'
import { runCalculation } from './api/client'
import { CalcParams, CalcResult } from './types'

const tabItems = [
  { key: 'calc', label: '工艺计算', icon: <CalculatorOutlined /> },
  { key: 'equip', label: '设备管理', icon: <SettingOutlined /> },
  { key: 'draw',  label: '图纸生成', icon: <FileImageOutlined /> },
  { key: 'report', label: '报告导出', icon: <FileTextOutlined /> }
]

export default function App() {
  const { message } = AntdApp.useApp()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CalcResult | null>(null)

  const handleCalculate = async (params: CalcParams) => {
    setLoading(true)
    try {
      const res = await runCalculation(params)
      setResult(res)
    } catch (e: any) {
      message.error(e?.message || '计算失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f0f2f5',
      display: 'flex',
      flexDirection: 'column',
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", Roboto, sans-serif'
    }}>
      {/* 顶部导航栏 */}
      <div style={{
        background: '#fff', borderBottom: '1px solid #e8e8e8',
        padding: '0 24px', display: 'flex', alignItems: 'center',
        gap: 16, height: 56, flexShrink: 0
      }}>
        <span style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e' }}>CCS Designer</span>
        <Tabs items={tabItems} defaultActiveKey="calc" size="small" />
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Tag color="#52c41a" style={{ borderRadius: 14, padding: '2px 12px' }} icon={<CheckCircleOutlined />}>在线</Tag>
          <span style={{ color: '#8c8c8c', fontSize: 12 }}>项目: CCS-2026-001</span>
          <span style={{ color: '#bfbfbf', fontSize: 12 }}>v1.0</span>
        </div>
      </div>

      {/* 三栏主内容区 */}
      <Row gutter={0} style={{ flex: 1, overflow: 'hidden' }}>
        {/* 左栏：参数输入 */}
        <Col span={7} style={{ background: '#fff', borderRight: '1px solid #e8e8e8', overflowY: 'auto', padding: '16px 16px 24px' }}>
          <ParamPanel loading={loading} onCalculate={handleCalculate} result={result} />
        </Col>

        {/* 中栏：流程图 + 流股表 */}
        <Col span={11} style={{ overflowY: 'auto', padding: '16px', background: '#fafafa' }}>
          <Flowsheet result={result} />
          <div style={{ height: 16 }} />
          <StreamTable result={result} />
        </Col>

        {/* 右栏：操作按钮 */}
        <Col span={6} style={{ background: '#fff', borderLeft: '1px solid #e8e8e8', overflowY: 'auto', padding: '16px' }}>
          <ActionPanel result={result} />
        </Col>
      </Row>
    </div>
  )
}
