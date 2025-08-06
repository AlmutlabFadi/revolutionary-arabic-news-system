import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'
import Dashboard from './pages/Dashboard'
import NewsPortal from './pages/NewsPortal'
import AutomationControl from './pages/AutomationControl'
import AnalyticsPage from './pages/AnalyticsPage'
import SourcesManager from './pages/SourcesManager'
import ArticlesManager from './pages/ArticlesManager'
import VirtualStudio from './pages/VirtualStudio'
import SystemSettings from './pages/SystemSettings'
import UserManagement from './pages/UserManagement'
import CryptocurrencyPage from './pages/CryptocurrencyPage'
import StockMarketPage from './pages/StockMarketPage'
import PublicOpinionControl from './pages/PublicOpinionControl'
import AdvertisingManager from './pages/AdvertisingManager'
import SponsorsManager from './pages/SponsorsManager'
import ContactUs from './pages/ContactUs'
import SocialMediaManager from './pages/SocialMediaManager'
import NewsletterSubscription from './pages/NewsletterSubscription'
import { WebSocketProvider } from './contexts/WebSocketContext'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentView, setCurrentView] = useState('dashboard')

  return (
    <WebSocketProvider>
      <BrowserRouter basename="/revolutionary-arabic-news-system">
        <div className="min-h-screen bg-gray-50 flex">
          <Sidebar 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)}
            currentView={currentView}
            onViewChange={setCurrentView}
          />
          
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header onMenuClick={() => setSidebarOpen(true)} />
            
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/news-portal" element={<NewsPortal />} />
                <Route path="/news/politics" element={<NewsPortal />} />
                <Route path="/news/economy" element={<NewsPortal />} />
                <Route path="/news/sports" element={<NewsPortal />} />
                <Route path="/news/technology" element={<NewsPortal />} />
                <Route path="/news/health" element={<NewsPortal />} />
                <Route path="/news/culture" element={<NewsPortal />} />
                <Route path="/news/international" element={<NewsPortal />} />
                <Route path="/news/syrian-affairs" element={<NewsPortal />} />
                <Route path="/news/cryptocurrency" element={<CryptocurrencyPage />} />
                <Route path="/news/stock-market" element={<StockMarketPage />} />
                <Route path="/automation" element={<AutomationControl />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/sources" element={<SourcesManager />} />
                <Route path="/articles" element={<ArticlesManager />} />
                <Route path="/virtual-studio" element={<VirtualStudio />} />
                <Route path="/users" element={<UserManagement />} />
                <Route path="/public-opinion" element={<PublicOpinionControl />} />
                <Route path="/advertising" element={<AdvertisingManager />} />
                <Route path="/sponsors" element={<SponsorsManager />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/social-media" element={<SocialMediaManager />} />
                <Route path="/newsletter" element={<NewsletterSubscription />} />
                <Route path="/settings" element={<SystemSettings />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </WebSocketProvider>
  )
}

export default App
