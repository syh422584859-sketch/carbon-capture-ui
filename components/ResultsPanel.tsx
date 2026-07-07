import { Card, Tabs, Table, Tag, Row, Col, Empty } from 'antd'
import {
  EnvironmentOutlined,
  ThunderboltOutlined,
  DashboardOutlined,
  BulbOutlined,
  CheckCircleTwoTone,
  CloseCircleTwoTone
} from '@ant-design/icons'
import { CalcResult, Stream } from '../types'

interface Props {
  result: CalcResult | null
}

const KpiCard = ({
  icon,
  title,
  value,
  suffix,
  color
}: {
  icon: React.ReactNode
  title: string
  value: number
  suffix: string
  color: string
}) => (
  <Card size="small" style={{ height: '100%', borderTop: `3px solid ${color}` }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div className="kpi-icon-box" style={{ background: `${color}1a`, color }}>
        {icon}
      </div>
      <div>
        <div className="kpi-label">{title}</div>
        <div>
          <span className="kpi-value" style={{ color }}>
            {value}
          </span>
          <span className="kpi-suffix">{suffix}</span>
        </div>
      </div>
    </div>
  </Card>
)

const streamColumns = [
  { title: '编号', dataIndex: 'id', key: 'id', width: 60 },
  { title: '名称', dataIndex: 'name', key: 'name' },
  {
    title: '相态', dataIndex: 'phase', key: 'phase', width: 80,
    render: (v: string) => <Tag color={v === 'Vapor' ? 'blue' : 'green'}>{v}</Tag>
  },
  { title: '摩尔流 (kmol/h)', dataIndex: 'molar_flow', key: 'molar_flow' },
  { title: '质量流 (kg/h)', dataIndex: 'mass_flow', key: 'mass_flow' },
  { title: '温度 (K)', dataIndex: 'temperature', key: 'temperature' },
  { title: '压力 (bar)', dataIndex: 'pressure', key: 'pressure' },
  {
    title: '主要组分', key: 'components',
    render: (_: any, r: Stream) =>
      Object.entries(r.components)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([k, v]) => `${k}:${(v as number).toFixed(1)}`)
        .join('  ')
  }
]

const unitColumns = [
  { title: '编号', dataIndex: 'id', key: 'id' },
  { title: '名称', dataIndex: 'name', key: 'name' },
  { title: '类型', dataIndex: 'type', key: 'type' },
  {
    title: '热负荷 (kW)', dataIndex: 'duty', key: 'duty',
    render: (v: number | null) => v ?? '—'
  },
  {
    title: '状态', dataIndex: 'status', key: 'status',
    render: (v: string) => <Tag color="cyan">{v}</Tag>
  }
]

export default function ResultsPanel({ result }: Props) {
  if (!result) {
    return (
      <Card title="计算结果" size="small">
        <Empty description="设定参数后点击「计算」" />
      </Card>
    )
  }

  const kpi = (
    <Row gutter={[12, 12]}>
      <Col xs={12} md={6}>
        <KpiCard icon={<EnvironmentOutlined />} title="CO₂ 脱除率" value={result.co2_removal} suffix="%" color="#16a34a" />
      </Col>
      <Col xs={12} md={6}>
        <KpiCard icon={<ThunderboltOutlined />} title="比能耗" value={result.specific_energy} suffix="GJ/t" color="#f59e0b" />
      </Col>
      <Col xs={12} md={6}>
        <KpiCard icon={<DashboardOutlined />} title="蒸汽耗" value={result.utilities.steam} suffix="t/h" color="#0ea5e9" />
      </Col>
      <Col xs={12} md={6}>
        <KpiCard icon={<BulbOutlined />} title="电耗" value={result.utilities.power} suffix="kW" color="#8b5cf6" />
      </Col>
    </Row>
  )

  const items = [
    {
      key: 'kpi', label: '关键指标', children: (
        <>
          {kpi}
          <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
            {result.solved ? (
              <CheckCircleTwoTone twoToneColor="#16a34a" />
            ) : (
              <CloseCircleTwoTone twoToneColor="#ef4444" />
            )}
            <span style={{ fontWeight: 600, color: result.solved ? '#16a34a' : '#ef4444' }}>
              {result.solved ? '求解成功' : '求解失败'}
            </span>
            {result.message && (
              <span style={{ color: '#9ca3af', fontSize: 13 }}>{result.message}</span>
            )}
            <span style={{ marginLeft: 'auto', color: '#9ca3af', fontSize: 12 }}>
              案例编号：{result.case_id}
            </span>
          </div>
        </>
      )
    },
    {
      key: 'streams', label: `流股表 (${result.streams.length})`,
      children: (
        <Table
          rowKey="id" size="small" columns={streamColumns}
          dataSource={result.streams} pagination={false}
          scroll={{ x: 'max-content' }}
        />
      )
    },
    {
      key: 'units', label: `单元 (${result.units.length})`,
      children: (
        <Table
          rowKey="id" size="small" pagination={false}
          dataSource={result.units} columns={unitColumns}
          scroll={{ x: 'max-content' }}
        />
      )
    }
  ]

  return (
    <Card title="计算结果" size="small" style={{ borderTop: '3px solid #0d9488' }}>
      <Tabs items={items} />
    </Card>
  )
}
