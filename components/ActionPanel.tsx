import { Card, Button, Tag } from 'antd'
import {
  ExportOutlined,
  TableOutlined,
  ToolOutlined,
  CodeOutlined,
  PictureOutlined,
  CheckCircleOutlined
} from '@ant-design/icons'
import { CalcResult } from '../types'

interface Props {
  result: CalcResult | null
}

const actions = [
  { key: 'stream', label: '导出物料平衡表', color: '#52c41a', bg: '#f6ffed', icon: <ExportOutlined />, desc: 'Excel / CSV' },
  { key: 'equip', label: '生成设备数据表', color: '#1890ff', bg: '#e6f7ff', icon: <TableOutlined />, desc: '尺寸 + 操作参数' },
  { key: 'pid',   label: '生成PID参数表',  color: '#faad14', bg: '#fffbe6', icon: <ToolOutlined />,  desc: '管口 / 材质 / 压力等级' },
  { key: 'lisp',  label: 'LISP脚本生成',    color: '#722ed1', bg: '#f9f0ff', icon: <CodeOutlined />, desc: 'Aspen / PRO/II' },
  { key: 'dwg',   label: 'DWG候选图输出',   color: '#eb2f96', bg: '#fff0f6', icon: <PictureOutlined />, desc: 'AutoCAD .dwg' },
]

export default function ActionPanel({ result }: Props) {
  const hasResult = !!result

  return (
    <div>
      {/* 标题 */}
      <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: '#1a1a2e' }}>
        输出与操作
      </h3>

      {/* 操作按钮 */}
      {actions.map(a => (
        <Button
          key={a.key}
          block size="large"
          style={{
            marginBottom: 10,
            height: 50,
            borderRadius: 10,
            background: a.bg,
            borderColor: `${a.color}40`,
            color: a.color,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: 10,
            paddingLeft: 16
          }}
          icon={<span style={{ fontSize: 18 }}>{a.icon}</span>}
        >
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div>{a.label}</div>
            <div style={{ fontSize: 11, fontWeight: 400, opacity: 0.65, marginTop: -1 }}>{a.desc}</div>
          </div>
        </Button>
      ))}

      {/* 校验按钮 */}
      <Button
        block size="large"
        type="primary"
        style={{
          marginTop: 8,
          height: 46,
          borderRadius: 10,
          fontWeight: 700,
          fontSize: 14
        }}
        icon={<CheckCircleOutlined />}
      >
        Validate 校核
      </Button>

      {/* 项目信息卡片 */}
      <Card
        size="small"
        style={{ marginTop: 16, borderRadius: 10, background: '#fafafa' }}
        bodyStyle={{ padding: '12px 14px' }}
      >
        <div style={{ fontSize: 12, lineHeight: 2, color: '#666' }}>
          <div>项目：<strong style={{color:'#333'}}>CCS-2026-001</strong></div>
          <div>版本：v1.0</div>
          <div>状态：<Tag color={hasResult ? 'success' : 'default'} style={{ borderRadius: 12 }}>
            {hasResult ? '已校核' : '待校核'}
          </Tag></div>
          <div>最后计算：
            {hasResult ? new Date().toLocaleTimeString('zh-CN') : '—'}
          </div>
        </div>
      </Card>
    </div>
  )
}
