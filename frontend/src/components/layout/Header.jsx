import React from 'react'
import { Menu, Bell, Search, User } from 'lucide-react'
import { useWebSocket } from '../../contexts/WebSocketContext'

const Header = ({ onMenuClick }) => {
  const { connected, realTimeData } = useWebSocket()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="hidden md:flex items-center mr-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="البحث في النظام..."
                className="w-64 pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4 space-x-reverse">
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full ml-2 ${connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-600">
              {connected ? 'متصل' : 'غير متصل'}
            </span>
          </div>
          
          <div className="relative">
            <button className="p-2 text-gray-400 hover:text-gray-600 relative">
              <Bell className="w-5 h-5" />
              {realTimeData.alerts.length > 0 && (
                <span className="absolute -top-1 -left-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {realTimeData.alerts.length}
                </span>
              )}
            </button>
          </div>
          
          <div className="flex items-center">
            <button className="flex items-center p-2 text-gray-600 hover:text-gray-900">
              <User className="w-5 h-5 ml-2" />
              <span className="text-sm font-medium">المدير</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
