import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'

vi.mock('../contexts/WebSocketContext', () => ({
  useWebSocket: () => ({
    connected: true,
    realTimeData: {
      stats: {},
      activities: [],
      alerts: []
    }
  })
}))

vi.mock('../services/api', () => ({
  default: {
    getStats: vi.fn().mockResolvedValue({
      total_articles: 1247,
      today_articles: 23,
      total_views: 45678,
      active_sources: 8
    }),
    getAutomationStatus: vi.fn().mockResolvedValue({
      is_running: true,
      scraping_interval: 5,
      ai_processing_enabled: true
    })
  }
}))

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Dashboard', () => {
  it('renders dashboard title', async () => {
    renderWithRouter(<Dashboard />)
    expect(screen.getByText('لوحة التحكم الرئيسية')).toBeInTheDocument()
  })

  it('displays stats cards', async () => {
    renderWithRouter(<Dashboard />)
    expect(screen.getByText('إجمالي الأخبار')).toBeInTheDocument()
    expect(screen.getByText('أخبار اليوم')).toBeInTheDocument()
    expect(screen.getByText('إجمالي المشاهدات')).toBeInTheDocument()
    expect(screen.getByText('المصادر النشطة')).toBeInTheDocument()
  })

  it('shows real-time connection status', async () => {
    renderWithRouter(<Dashboard />)
    expect(screen.getByText('البيانات المباشرة نشطة')).toBeInTheDocument()
  })
})
