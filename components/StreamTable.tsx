import { Table, Tag, Card } from 'antd'
import { TableOutlined } from '@ant-design/icons'
import { CalcResult, Stream } from '../types'

interface Props {
  result: CalcResult | null
}

const columns = [
  { title: 'Stream', dataIndex: 'id', key: 'id', width: 72 },
  { title: '名称', dataIndex: 'name', key: 'name' },
  {
    title: '流量', key: 'flow',
    render: (_: any, r: Stream) => (
      <span>{r.molar_flow ? r.molar_flow.toFixed(0) : '—'} <span style={{ color:'#aaa', fontSize:11 }}>kmol/h</span></span>
    )
  },
  {
    title: '温度', dataIndex: 'temperature', key: 'temp',
    render: (v: number | undefined) => v ? `${v} K` : '—'
  },
  {
    title: 'CO₂%', key: 'co2',
    render: (_: any, r: Stream) => {
      const co2 = r.components?.CO2
      return co2 != null ? `${(co2 * 100).toFixed(1)}` : '—'
    }
  }
]

export default function StreamTable({ result }: Props) {
  const data = result?.streams ?? []

  return (
    <Card
      size="small"
      title={<span><TableOutlined style={{ color: '#722ed1', marginRight: 6 }} />物料平衡表（Stream Table）</span>}
      style={{ borderRadius: 10 }}
    >
      {data.length > 0 ? (
        <Table
          rowKey="id" size="small"
          columns={columns}
          dataSource={data}
          pagination={false}
          scroll={{ x: 'max-content' }}
        />
      ) : (
        <div style={{ textAlign: 'center', color: '#bfbfbf', padding: '24px 0' }}>
          计算后显示流股数据
        </div>
      )}
    </Card>
  )
}
