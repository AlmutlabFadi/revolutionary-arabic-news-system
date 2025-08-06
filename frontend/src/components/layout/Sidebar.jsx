import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Globe, 
  Zap, 
  BarChart3, 
  Database, 
  FileText, 
  Video, 
  Settings,
  Users,
  X,
  ChevronDown,
  ChevronRight
} from 'lucide-react'

const Sidebar = ({ isOpen, onClose, currentView, onViewChange }) => {
  const location = useLocation()
  const [expandedMenus, setExpandedMenus] = useState({ 'news-portal': true })

  const toggleSubmenu = (menuId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }))
  }

  const isSubmenuActive = (submenu) => {
    return submenu.some(item => location.pathname === item.path)
  }

  const menuItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard, path: '/' },
    { 
      id: 'news-portal', 
      label: 'البوابة الإخبارية', 
      icon: Globe, 
      path: '/news-portal',
      submenu: [
        { id: 'news-all', label: 'جميع الأخبار', path: '/news-portal' },
        { id: 'news-politics', label: 'سياسة', path: '/news/politics' },
        { id: 'news-economy', label: 'اقتصاد', path: '/news/economy' },
        { id: 'news-sports', label: 'رياضة', path: '/news/sports' },
        { id: 'news-technology', label: 'تكنولوجيا', path: '/news/technology' },
        { id: 'news-health', label: 'صحة', path: '/news/health' },
        { id: 'news-culture', label: 'ثقافة', path: '/news/culture' },
        { id: 'news-international', label: 'دولي', path: '/news/international' },
        { id: 'news-syrian', label: 'الشأن السوري', path: '/news/syrian-affairs' },
        { id: 'news-crypto', label: 'العملات الرقمية', path: '/news/cryptocurrency' },
        { id: 'news-stocks', label: 'الأسواق المالية', path: '/news/stock-market' }
      ]
    },
    { id: 'automation', label: 'التحكم في الأتمتة', icon: Zap, path: '/automation' },
    { id: 'analytics', label: 'التحليلات', icon: BarChart3, path: '/analytics' },
    { id: 'sources', label: 'إدارة المصادر', icon: Database, path: '/sources' },
    { id: 'articles', label: 'إدارة الأخبار', icon: FileText, path: '/articles' },
    { id: 'virtual-studio', label: 'الاستوديو الافتراضي', icon: Video, path: '/virtual-studio' },
    { id: 'users', label: 'إدارة المستخدمين', icon: Users, path: '/users' },
    { id: 'public-opinion', label: 'إدارة الرأي العام', icon: Users, path: '/public-opinion', adminOnly: true },
    { id: 'advertising', label: 'إدارة الإعلانات', icon: FileText, path: '/advertising' },
    { id: 'sponsors', label: 'إدارة الرعاة', icon: Users, path: '/sponsors' },
    { id: 'contact', label: 'التواصل معنا', icon: MessageSquare, path: '/contact' },
    { id: 'settings', label: 'إعدادات النظام', icon: Settings, path: '/settings' }
  ]

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <div className={`
        fixed lg:static inset-y-0 right-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex flex-col items-center w-full">
            <h2 className="text-xl font-bold text-gray-900 mb-2">جولان 24</h2>
            <p className="text-xs text-gray-600 text-center">منصة إخبارية ذكية</p>
          </div>
          <button 
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 absolute top-4 left-4"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="mt-6">
          <div className="px-3">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              const hasSubmenu = item.submenu && item.submenu.length > 0
              const isExpanded = expandedMenus[item.id]
              const submenuActive = hasSubmenu && isSubmenuActive(item.submenu)
              
              return (
                <div key={item.id} className="mb-1">
                  {hasSubmenu ? (
                    <button
                      onClick={() => toggleSubmenu(item.id)}
                      className={`
                        w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors
                        ${isActive || submenuActive
                          ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }
                      `}
                    >
                      <div className="flex items-center">
                        <Icon className="w-5 h-5 ml-3" />
                        {item.label}
                      </div>
                      {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </button>
                  ) : (
                    <Link
                      to={item.path}
                      onClick={() => {
                        onViewChange(item.id)
                        onClose()
                      }}
                      className={`
                        flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                        ${isActive 
                          ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5 ml-3" />
                      {item.label}
                    </Link>
                  )}
                  
                  {hasSubmenu && isExpanded && (
                    <div className="mt-1 mr-6 space-y-1">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.id}
                          to={subItem.path}
                          onClick={() => {
                            onViewChange(subItem.id)
                            onClose()
                          }}
                          className={`
                            block px-3 py-2 text-sm rounded-lg transition-colors
                            ${location.pathname === subItem.path
                              ? 'bg-blue-50 text-blue-600 font-medium border-l-2 border-blue-600'
                              : 'text-gray-600 hover:bg-gray-50'
                            }
                          `}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            جولان 24 v1.0
            <br />
            مدعوم بالذكاء الاصطناعي
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
