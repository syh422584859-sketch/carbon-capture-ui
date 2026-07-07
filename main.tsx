import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider, App as AntdApp } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import App from './App'
import './index.css'

// 统一主题：青绿主色 + 大圆角 + 中文字体
const themeConfig = {
  token: {
    colorPrimary: '#0ea5a4',
    borderRadius: 10,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", Roboto, "Helvetica Neue", Arial, sans-serif',
    colorBgLayout: '#f5f7fa'
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider theme={themeConfig} locale={zhCN}>
      <AntdApp>
        <App />
      </AntdApp>
    </ConfigProvider>
  </React.StrictMode>
)
