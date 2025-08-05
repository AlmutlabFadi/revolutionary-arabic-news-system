import React, { useState, useEffect } from 'react'
import { 
  Play, 
  Pause, 
  Square, 
  Video, 
  Mic, 
  Users, 
  Settings, 
  Download, 
  Upload,
  Zap,
  Clock,
  Globe
} from 'lucide-react'
import NewsAPI from '../services/api'

const VirtualStudio = () => {
  const [currentBulletin, setCurrentBulletin] = useState(null)
  const [bulletinHistory, setBulletinHistory] = useState([])
  const [presenters, setPresenters] = useState({})
  const [currentPresenter, setCurrentPresenter] = useState(null)
  const [selectedLanguage, setSelectedLanguage] = useState('ar')
  const [isLive, setIsLive] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchPresenters()
    fetchBulletinHistory()
  }, [])

  const fetchPresenters = async () => {
    try {
      const data = await NewsAPI.getPresenters()
      setPresenters(data)
      
      const defaultPresenter = Object.values(data).find(p => p.language === selectedLanguage)
      if (defaultPresenter) {
        setCurrentPresenter(defaultPresenter)
      }
    } catch (error) {
      console.error('Error fetching presenters:', error)
    }
  }

  const fetchBulletinHistory = async () => {
    try {
      const data = await NewsAPI.getBulletinHistory()
      setBulletinHistory(data)
    } catch (error) {
      console.error('Error fetching bulletin history:', error)
    }
  }

  const generateBulletin = async () => {
    try {
      setIsLoading(true)
      const bulletinData = await NewsAPI.generateBulletin({
        language: selectedLanguage,
        bulletin_type: 'regular'
      })
      
      setCurrentBulletin(bulletinData)
      fetchBulletinHistory()
    } catch (error) {
      console.error('Error generating bulletin:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const startLiveBroadcast = () => {
    setIsLive(true)
    console.log('Starting live broadcast...')
  }

  const stopLiveBroadcast = () => {
    setIsLive(false)
    console.log('Stopping live broadcast...')
  }

  const startRecording = () => {
    setIsRecording(true)
    console.log('Starting recording...')
  }

  const stopRecording = () => {
    setIsRecording(false)
    console.log('Stopping recording...')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الاستوديو الافتراضي</h1>
          <p className="text-gray-600 mt-1">إنتاج ونشر النشرات الإخبارية بالذكاء الاصطناعي</p>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center">
            <Settings className="w-4 h-4 ml-2" />
            إعدادات الاستوديو
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-black rounded-lg overflow-hidden aspect-video relative">
            {currentPresenter ? (
              <div className="relative w-full h-full bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-32 h-32 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-16 h-16" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{currentPresenter.name}</h3>
                  <p className="text-blue-200">{currentPresenter.specialty}</p>
                </div>
                
                {isLive && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full ml-2 animate-pulse"></div>
                    مباشر
                  </div>
                )}
                
                {isRecording && (
                  <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full ml-2 animate-pulse"></div>
                    تسجيل
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <Video className="w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">جولان 24</h3>
                  <p>الاستوديو الافتراضي</p>
                </div>
              </div>
            )}
            
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <button
                    onClick={isLive ? stopLiveBroadcast : startLiveBroadcast}
                    disabled={!currentBulletin}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                      isLive
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed'
                    }`}
                  >
                    {isLive ? (
                      <>
                        <Square className="w-4 h-4 ml-2" />
                        إيقاف البث
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 ml-2" />
                        بدء البث المباشر
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={!currentBulletin}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                      isRecording
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed'
                    }`}
                  >
                    {isRecording ? (
                      <>
                        <Square className="w-4 h-4 ml-2" />
                        إيقاف التسجيل
                      </>
                    ) : (
                      <>
                        <Video className="w-4 h-4 ml-2" />
                        بدء التسجيل
                      </>
                    )}
                  </button>
                </div>
                
                <div className="flex items-center space-x-2 space-x-reverse">
                  <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                    <Mic className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-red-600 text-white py-2 px-4 rounded-lg mt-4">
            <div className="flex items-center">
              <span className="bg-white text-red-600 px-2 py-1 rounded text-sm font-bold ml-4">عاجل</span>
              <div className="flex-1 overflow-hidden">
                <div className="ticker-animation whitespace-nowrap">
                  <span>أحدث الأخبار من الشرق الأوسط والعالم • تابعونا على مدار الساعة • نشرات إخبارية كل ساعة • </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">التحكم في الإنتاج</h3>
            
            <div className="space-y-4">
              <button 
                onClick={generateBulletin}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                    جاري التوليد...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 ml-2" />
                    توليد نشرة جديدة
                  </>
                )}
              </button>
              
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <Upload className="w-4 h-4 ml-2" />
                  رفع محتوى
                </button>
                <button className="flex items-center justify-center px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  <Download className="w-4 h-4 ml-2" />
                  تصدير
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">إعدادات النشرة</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">اللغة:</label>
                <select 
                  value={selectedLanguage} 
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="ar">العربية</option>
                  <option value="en">English</option>
                  <option value="de">Deutsch</option>
                  <option value="tr">Türkçe</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نوع النشرة:</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="regular">نشرة عادية</option>
                  <option value="breaking">نشرة عاجلة</option>
                  <option value="summary">ملخص يومي</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">المذيعون المتاحون</h3>
            
            <div className="space-y-3">
              {Object.entries(presenters).map(([key, presenter]) => (
                <div 
                  key={key} 
                  className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                    currentPresenter?.name === presenter.name 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setCurrentPresenter(presenter)}
                >
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center ml-3">
                    <Users className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{presenter.name}</h4>
                    <p className="text-sm text-gray-600">{presenter.specialty}</p>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mt-1">
                      <Globe className="w-3 h-3 ml-1" />
                      {presenter.language}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {currentBulletin && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">معاينة النشرة الحالية</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">
                {currentBulletin.script?.script_parts?.filter(part => part.type === 'news_item').length || 0}
              </p>
              <p className="text-sm text-gray-600">عدد الأخبار</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">
                {currentBulletin.script?.total_duration || 0}
              </p>
              <p className="text-sm text-gray-600">المدة (دقيقة)</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">
                {currentBulletin.script?.language || 'غير محدد'}
              </p>
              <p className="text-sm text-gray-600">اللغة</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">محتوى النشرة:</h4>
            {currentBulletin.script?.script_parts?.map((part, index) => (
              <div key={index} className={`p-4 rounded-lg border-l-4 ${
                part.type === 'opening' ? 'border-green-500 bg-green-50' :
                part.type === 'news_item' ? 'border-blue-500 bg-blue-50' :
                'border-gray-500 bg-gray-50'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    {part.type === 'opening' ? 'افتتاحية' : 
                     part.type === 'news_item' ? 'خبر' : 'خاتمة'}
                  </span>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 ml-1" />
                    {part.duration_estimate}د
                  </div>
                </div>
                <p className="text-gray-900">{part.text}</p>
                {part.presenter && (
                  <p className="text-sm text-gray-600 mt-2">
                    المذيع: {part.presenter.name}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {bulletinHistory.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">تاريخ النشرات</h3>
          
          <div className="space-y-3">
            {bulletinHistory.map((bulletin) => (
              <div key={bulletin.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">
                    نشرة {bulletin.language === 'ar' ? 'عربية' : 'إنجليزية'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {bulletin.articles_count} أخبار • {bulletin.duration} دقيقة
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {new Date(bulletin.generated_at).toLocaleString('ar-SA')}
                  </p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    مكتمل
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default VirtualStudio
