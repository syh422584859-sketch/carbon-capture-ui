import { Form, InputNumber, Select, Button, Space, Divider } from 'antd'
import {
  PlayCircleOutlined,
  ThunderboltOutlined,
  ReloadOutlined,
  ExperimentOutlined,
  SettingOutlined
} from '@ant-design/icons'
import { CalcParams, CalcResult } from '../types'

const AMINES = [
  { value: 'MEA', label: 'MEA（单乙醇胺）' },
  { value: 'DEA', label: 'DEA（二乙醇胺）' },
  { value: 'MDEA', label: 'MDEA（N-甲基二乙醇胺）' }
]

const Section = ({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 7, margin: '16px 0 8px', paddingLeft: 8,
    borderLeft: '3px solid #1890ff', color: '#1a1a2e', fontWeight: 600, fontSize: 13 }}>
    {icon}{children}
  </div>
)

interface Props {
  loading: boolean
  onCalculate: (p: CalcParams) => void
  result: CalcResult | null
}

export default function ParamPanel({ loading, onCalculate, result }: Props) {
  const [form] = Form.useForm<CalcParams>()

  const fillExample = () => {
    const ex: CalcParams = {
      flue_gas_flow: 1500, co2_inlet: 0.14, amine_type: 'MEA', amine_conc: 30,
      absorber_stages: 14, stripper_stages: 9, regen_temp: 398, lean_loading: 0.22
    }
    form.setFieldsValue(ex)
    onCalculate(ex)
  }

  const resetForm = () => form.resetFields()

  return (
    <div>
      {/* 标题 */}
      <h3 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 700, color: '#1a1a2e' }}>
        工艺参数输入
      </h3>

      <Form
        form={form}
        layout="vertical"
        size="middle"
        initialValues={{
          flue_gas_flow: 1000,
          co2_inlet: 0.12,
          amine_type: 'MEA',
          amine_conc: 30,
          absorber_stages: 12,
          stripper_stages: 8,
          regen_temp: 393,
          lean_loading: 0.25
        }}
        onFinish={onCalculate}
      >
        <Section icon={<ExperimentOutlined />}>烟气条件</Section>
        <Form.Item label="烟气流量 (Nm³/h)" name="flue_gas_flow" rules={[{ required: true }]}>
          <InputNumber min={1} max={200000} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="CO₂浓度 (vol%)" name="co2_inlet" rules={[{ required: true }]}>
          <InputNumber min={0.01} max={50} step={0.5} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="烟气温度 (℃)" name="_flue_temp">
          <InputNumber min={20} max={300} style={{ width: '100%' }} placeholder="150" />
        </Form.Item>
        <Form.Item label="捕捉率目标 (%)" name="_target_removal">
          <InputNumber min={50} max={99.9} style={{ width: '100%' }} placeholder="90" />
        </Form.Item>

        <Section icon={<ExperimentOutlined />}>吸收剂</Section>
        <Form.Item label="吸收剂类型" name="amine_type" rules={[{ required: true }]}>
          <Select options={AMINES} />
        </Form.Item>
        <Form.Item label="胺质量浓度 (%wt)" name="amine_conc" rules={[{ required: true }]}>
          <InputNumber min={5} max={60} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="贫液浓度 (mol/L)" name="_lean_conc">
          <InputNumber min={1} max={10} step={0.5} style={{ width: '100%' }} placeholder="5.0" />
        </Form.Item>

        <Section icon={<SettingOutlined />}>设备参数</Section>
        <Form.Item label="吸收塔理论级数" name="absorber_stages" rules={[{ required: true }]}>
          <InputNumber min={1} max={40} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="再生塔理论级数" name="stripper_stages" rules={[{ required: true }]}>
          <InputNumber min={1} max={40} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="再生温度 (K)" name="regen_temp" rules={[{ required: true }]}>
          <InputNumber min={360} max={450} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="贫液负载 (mol/mol)" name="lean_loading" rules={[{ required: true }]}>
          <InputNumber min={0.05} max={0.5} step={0.01} style={{ width: '100%' }} />
        </Form.Item>

        {/* 按钮 */}
        <Button type="primary" htmlType="submit" loading={loading}
          block size="large" icon={<PlayCircleOutlined />}
          style={{ height: 44, marginTop: 6, borderRadius: 10, fontWeight: 700 }}>
          计算
        </Button>
        <div style={{ height: 8 }} />
        <Space style={{ width: '100%' }}>
          <Button block icon={<ThunderboltOutlined />} onClick={fillExample}>
            填入示例工况
          </Button>
          <Button block icon={<ReloadOutlined />} onClick={resetForm}>
            重置
          </Button>
        </Space>
      </Form>

      {/* 计算状态提示 */}
      {result && (
        <div style={{
          marginTop: 14, padding: '10px 14px', borderRadius: 8,
          background: '#f6ffed', border: '1px solid #b7eb8f',
          fontSize: 12, lineHeight: 1.7, color: '#389e0d'
        }}>
          ✓ 求解成功 · CO₂脱除率 {result.co2_removal}% · 比能耗 {result.specific_energy} GJ/t<br/>
          案例：{result.case_id || '—'}
        </div>
      )}
    </div>
  )
}
