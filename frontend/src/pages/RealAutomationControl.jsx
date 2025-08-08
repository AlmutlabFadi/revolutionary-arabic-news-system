import React, { useState, useEffect } from 'react'
import { 
  Play, 
  Pause, 
  Settings, 
  RefreshCw, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Activity,
  Zap,
  Bot,
  Database,
  TrendingUp,
  FileText,
  Timer,
  BarChart3
} from 'lucide-react'

const RealAutomationControl = () => {
  const [automationStatus, setAutomationStatus] = useState({
    is_running: false,
    articles_processed: 0,
    last_processing_time: 0,
    sources: [],
    timestamp: null
  })
  
  const [performance, setPerformance] = useState({
    articles_processed: 0,
    last_processing_time: 0,
    is_running: false,
    sources_count: 0,
    metrics: {
      processing_speed: 'N/A',
      articles_per_minute: 0,
      efficiency: 'عالية'
    }
  })
  
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    fetchRealStatus()
    const interval = setInterval(fetchRealStatus, 5000) // تحديث كل 5 ثوان
    return () => clearInterval(interval)
  }, [])

  const fetchRealStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/automation/status')
      if (response.ok) {
        const data = await response.json()
        setAutomationStatus(data)
        addLog('success', `✅ تم تحديث الحالة - معالجة ${data.articles_processed} مقالة`)
      } else {
        addLog('error', '❌ فشل في الاتصال بالخادم')
      }
    } catch (error) {
      addLog('error', `❌ خطأ في الشبكة: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const fetchPerformance = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/automation/performance')
      if (response.ok) {
        const data = await response.json()
        setPerformance(data)
      }
    } catch (error) {
      console.error('Error fetching performance:', error)
    }
  }

  const startAutomation = async () => {
    try {
      setProcessing(true)
      const response = await fetch('http://localhost:5000/api/automation/start', {
        method: 'POST'
      })
      
      if (response.ok) {
        const data = await response.json()
        addLog('success', '🚀 تم بدء الأتمتة بنجاح')
        fetchRealStatus()
      } else {
        addLog('error', '❌ فشل في بدء الأتمتة')
      }
    } catch (error) {
      addLog('error', `❌ خطأ: ${error.message}`)
    } finally {
      setProcessing(false)
    }
  }

  const stopAutomation = async () => {
    try {
      setProcessing(true)
      const response = await fetch('http://localhost:5000/api/automation/stop', {
        method: 'POST'
      })
      
      if (response.ok) {
        addLog('warning', '⏸️ تم إيقاف الأتمتة')
        fetchRealStatus()
      } else {
        addLog('error', '❌ فشل في إيقاف الأتمتة')
      }
    } catch (error) {
      addLog('error', `❌ خطأ: ${error.message}`)
    } finally {
      setProcessing(false)
    }
  }

  const manualProcess = async () => {
    try {
      setProcessing(true)
      addLog('info', '🔄 بدء المعالجة اليدوية...')
      
      const startTime = Date.now()
      const response = await fetch('http://localhost:5000/api/automation/manual-scrape', {
        method: 'POST'
      })
      
      if (response.ok) {
        const data = await response.json()
        const duration = ((Date.now() - startTime) / 1000).toFixed(2)
        
        if (data.success) {
          addLog('success', `🎉 تمت المعالجة بنجاح! ${data.data.articles_processed} مقالة في ${duration} ثانية`)
          fetchRealStatus()
          fetchPerformance()
        } else {
          addLog('error', `❌ فشل في المعالجة: ${data.error}`)
        }
      } else {
        addLog('error', '❌ فشل في المعالجة اليدوية')
      }
    } catch (error) {
      addLog('error', `❌ خطأ: ${error.message}`)
    } finally {
      setProcessing(false)
    }
  }

  const addLog = (level, message) => {
    const newLog = {
      id: Date.now(),
      timestamp: new Date().toLocaleString('ar-SA'),
      level,
      message
    }
    setLogs(prev => [newLog, ...prev.slice(0, 9)])
  }

  const getStatusColor = () => {
    if (loading) return 'text-gray-500'
    return automationStatus.is_running ? 'text-green-600' : 'text-red-600'
  }

  const getStatusIcon = () => {
    if (loading) return <RefreshCw className="w-5 h-5 animate-spin" />
    return automationStatus.is_running ? 
      <CheckCircle className="w-5 h-5 text-green-600" /> : 
      <XCircle className="w-5 h-5 text-red-600" />
  }

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              🤖 نظام الأتمتة الحقيقي
            </h1>
            <p className="text-gray-600 mt-1">
              التحكم في معالجة الأخبار تلقائياً - أقل من 60 ثانية
            </p>
          </div>
          
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className={`flex items-center space-x-2 space-x-reverse ${getStatusColor()}`}>
              {getStatusIcon()}
              <span className="font-medium">
                {loading ? 'جاري التحميل...' : 
                 automationStatus.is_running ? 'يعمل' : 'متوقف'}
              </span>
            </div>
            
            <button
              onClick={fetchRealStatus}
              disabled={loading}
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* الإحصائيات السريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm text-gray-600">المقالات المعالجة</p>
              <p className="text-2xl font-bold text-gray-900">
                {automationStatus.articles_processed || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <Timer className="w-6 h-6 text-green-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm text-gray-600">وقت المعالجة الأخير</p>
              <p className="text-2xl font-bold text-gray-900">
                {automationStatus.last_processing_time 
                  ? `${automationStatus.last_processing_time.toFixed(1)}ث`
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <Database className="w-6 h-6 text-purple-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm text-gray-600">المصادر النشطة</p>
              <p className="text-2xl font-bold text-gray-900">
                {automationStatus.sources?.length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <Activity className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm text-gray-600">الحالة</p>
              <p className={`text-xl font-bold ${getStatusColor()}`}>
                {automationStatus.is_running ? 'نشط' : 'متوقف'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* أزرار التحكم */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          🎮 التحكم في الأتمتة
        </h2>
        
        <div className="flex space-x-4 space-x-reverse">
          <button
            onClick={automationStatus.is_running ? stopAutomation : startAutomation}
            disabled={processing}
            className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 space-x-reverse ${
              automationStatus.is_running
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            } ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {processing ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : automationStatus.is_running ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
            <span>
              {processing ? 'جاري المعالجة...' :
               automationStatus.is_running ? 'إيقاف الأتمتة' : 'بدء الأتمتة'}
            </span>
          </button>

          <button
            onClick={manualProcess}
            disabled={processing}
            className={`px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2 space-x-reverse ${
              processing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {processing ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Zap className="w-5 h-5" />
            )}
            <span>معالجة فورية</span>
          </button>

          <button
            onClick={fetchPerformance}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2 space-x-reverse"
          >
            <BarChart3 className="w-5 h-5" />
            <span>تحديث الأداء</span>
          </button>
        </div>
      </div>

      {/* السجلات المباشرة */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          📋 السجلات المباشرة
        </h2>
        
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              لا توجد سجلات حتى الآن
            </p>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className={`p-3 rounded-lg border-l-4 ${
                  log.level === 'success' ? 'bg-green-50 border-green-400' :
                  log.level === 'error' ? 'bg-red-50 border-red-400' :
                  log.level === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                  'bg-blue-50 border-blue-400'
                }`}
              >
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-gray-900">
                    {log.message}
                  </p>
                  <p className="text-xs text-gray-500">
                    {log.timestamp}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* معلومات المصادر */}
      {automationStatus.sources && automationStatus.sources.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            📰 المصادر النشطة
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {automationStatus.sources.map((source, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-medium text-gray-900">{source.name}</h3>
                <p className="text-sm text-gray-600">{source.category}</p>
                <p className="text-xs text-gray-500">{source.country}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default RealAutomationControl
