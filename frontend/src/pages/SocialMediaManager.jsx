import React, { useState, useEffect } from 'react'
import { Facebook, MessageCircle, Youtube, Instagram, Send, Settings, CheckCircle, AlertCircle, Plus } from 'lucide-react'

const SocialMediaManager = () => {
  const [socialAccounts, setSocialAccounts] = useState([])
  const [autoPublish, setAutoPublish] = useState({
    facebook: true,
    telegram: true,
    whatsapp: true,
    youtube: false,
    tiktok: true,
    instagram: true
  })
  const [publishHistory, setPublishHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddPlatformModal, setShowAddPlatformModal] = useState(false)
  const [newPlatform, setNewPlatform] = useState({
    name: '',
    type: '',
    icon: '',
    url: '',
    customHashtags: ''
  })

  useEffect(() => {
    fetchSocialAccounts()
    fetchPublishHistory()
  }, [])

  const fetchSocialAccounts = async () => {
    try {
      const mockAccounts = [
        {
          platform: 'facebook',
          name: 'جولان 24 - Facebook',
          connected: true,
          followers: 125000,
          lastPost: '2024-01-15T10:30:00Z',
          status: 'active'
        },
        {
          platform: 'telegram',
          name: 'قناة جولان 24',
          connected: true,
          followers: 85000,
          lastPost: '2024-01-15T11:00:00Z',
          status: 'active'
        },
        {
          platform: 'whatsapp',
          name: 'جولان 24 - واتساب',
          connected: true,
          followers: 45000,
          lastPost: '2024-01-15T09:45:00Z',
          status: 'active'
        },
        {
          platform: 'youtube',
          name: 'Golan 24 News',
          connected: false,
          followers: 0,
          lastPost: null,
          status: 'disconnected'
        },
        {
          platform: 'tiktok',
          name: '@golan24news',
          connected: true,
          followers: 67000,
          lastPost: '2024-01-15T08:20:00Z',
          status: 'active'
        },
        {
          platform: 'instagram',
          name: '@golan24official',
          connected: true,
          followers: 95000,
          lastPost: '2024-01-15T12:15:00Z',
          status: 'active'
        }
      ]
      
      setSocialAccounts(mockAccounts)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching social accounts:', error)
      setLoading(false)
    }
  }

  const fetchPublishHistory = async () => {
    try {
      const mockHistory = [
        {
          id: 1,
          title: 'عاجل: تطورات جديدة في الأوضاع السياسية',
          publishedAt: '2024-01-15T12:30:00Z',
          platforms: ['facebook', 'telegram', 'whatsapp', 'instagram'],
          status: 'success',
          engagement: { likes: 1250, shares: 340, comments: 89 }
        },
        {
          id: 2,
          title: 'تحليل: الأسواق المالية اليوم',
          publishedAt: '2024-01-15T11:45:00Z',
          platforms: ['facebook', 'telegram', 'tiktok'],
          status: 'success',
          engagement: { likes: 890, shares: 156, comments: 45 }
        }
      ]
      
      setPublishHistory(mockHistory)
    } catch (error) {
      console.error('Error fetching publish history:', error)
    }
  }

  const toggleAutoPublish = (platform) => {
    setAutoPublish(prev => ({
      ...prev,
      [platform]: !prev[platform]
    }))
  }

  const connectPlatform = async (platform) => {
    try {
      console.log(`Connecting to ${platform}...`)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSocialAccounts(prev => 
        prev.map(account => 
          account.platform === platform 
            ? { ...account, connected: true, status: 'active' }
            : account
        )
      )
    } catch (error) {
      console.error(`Error connecting to ${platform}:`, error)
    }
  }

  const publishToAll = async () => {
    try {
      console.log('Publishing to all connected platforms...')
      
      const response = await fetch('/api/social/publish-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platforms: Object.keys(autoPublish).filter(key => autoPublish[key]),
          content: 'آخر الأخبار من جولان 24'
        })
      })
      
      if (response.ok) {
        console.log('Published successfully to all platforms')
        fetchPublishHistory()
      }
    } catch (error) {
      console.error('Error publishing to platforms:', error)
    }
  }

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'facebook': return <Facebook className="w-5 h-5" />
      case 'telegram': return <Send className="w-5 h-5" />
      case 'whatsapp': return <MessageCircle className="w-5 h-5" />
      case 'youtube': return <Youtube className="w-5 h-5" />
      case 'instagram': return <Instagram className="w-5 h-5" />
      case 'tiktok': return <div className="w-5 h-5 bg-black rounded-full"></div>
      default: return <Settings className="w-5 h-5" />
    }
  }

  const getPlatformColor = (platform) => {
    switch (platform) {
      case 'facebook': return 'bg-blue-600'
      case 'telegram': return 'bg-blue-500'
      case 'whatsapp': return 'bg-green-600'
      case 'youtube': return 'bg-red-600'
      case 'instagram': return 'bg-pink-600'
      case 'tiktok': return 'bg-black'
      default: return 'bg-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة وسائل التواصل الاجتماعي</h1>
          <p className="text-gray-600 mt-1">إدارة ونشر المحتوى عبر جميع المنصات الاجتماعية</p>
        </div>
        <div className="flex space-x-3 space-x-reverse">
          <button
            onClick={() => setShowAddPlatformModal(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            إضافة منصة جديدة
          </button>
          <button
            onClick={publishToAll}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Send className="w-4 h-4 mr-2" />
            نشر على جميع المنصات
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {socialAccounts.map((account) => (
          <div key={account.platform} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg text-white mr-3 ${getPlatformColor(account.platform)}`}>
                  {getPlatformIcon(account.platform)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{account.name}</h3>
                  <p className="text-sm text-gray-600">
                    {account.followers.toLocaleString()} متابع
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                {account.connected ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">النشر التلقائي:</span>
                <button
                  onClick={() => toggleAutoPublish(account.platform)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    autoPublish[account.platform] ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      autoPublish[account.platform] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="text-xs text-gray-500">
                آخر نشر: {account.lastPost ? new Date(account.lastPost).toLocaleString('ar') : 'لم يتم النشر بعد'}
              </div>

              {!account.connected && (
                <button
                  onClick={() => connectPlatform(account.platform)}
                  className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  ربط الحساب
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">سجل النشر الأخير</h3>
        
        <div className="space-y-4">
          {publishHistory.map((post) => (
            <div key={post.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{post.title}</h4>
                <span className="text-sm text-gray-500">
                  {new Date(post.publishedAt).toLocaleString('ar')}
                </span>
              </div>
              
              <div className="flex items-center space-x-2 mb-2">
                {post.platforms.map((platform) => (
                  <div key={platform} className={`p-1 rounded text-white ${getPlatformColor(platform)}`}>
                    {getPlatformIcon(platform)}
                  </div>
                ))}
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>👍 {post.engagement.likes}</span>
                <span>🔄 {post.engagement.shares}</span>
                <span>💬 {post.engagement.comments}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add New Platform Modal */}
      {showAddPlatformModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">إضافة منصة جديدة</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">اسم المنصة</label>
                <input
                  type="text"
                  value={newPlatform.name}
                  onChange={(e) => setNewPlatform({...newPlatform, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="مثال: لينكد إن"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">نوع المنصة</label>
                <select
                  value={newPlatform.type}
                  onChange={(e) => setNewPlatform({...newPlatform, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">اختر نوع المنصة</option>
                  <option value="social">شبكة اجتماعية</option>
                  <option value="messaging">تطبيق مراسلة</option>
                  <option value="video">منصة فيديو</option>
                  <option value="professional">شبكة مهنية</option>
                  <option value="blog">مدونة</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">رابط المنصة</label>
                <input
                  type="url"
                  value={newPlatform.url}
                  onChange={(e) => setNewPlatform({...newPlatform, url: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/golan24"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الهاشتاغات المخصصة</label>
                <input
                  type="text"
                  value={newPlatform.customHashtags}
                  onChange={(e) => setNewPlatform({...newPlatform, customHashtags: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="#جولان24 #أخبار"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 space-x-reverse mt-6">
              <button
                onClick={() => {
                  setShowAddPlatformModal(false)
                  setNewPlatform({ name: '', type: '', icon: '', url: '', customHashtags: '' })
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  const platform = {
                    id: Date.now(),
                    ...newPlatform,
                    followers: 0,
                    connected: false,
                    lastPost: null,
                    status: 'disconnected'
                  }
                  
                  setSocialAccounts(prev => [...prev, platform])
                  setShowAddPlatformModal(false)
                  setNewPlatform({ name: '', type: '', icon: '', url: '', customHashtags: '' })
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                إضافة المنصة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SocialMediaManager
