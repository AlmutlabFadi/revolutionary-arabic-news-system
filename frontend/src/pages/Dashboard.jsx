import React, { useState, useEffect } from 'react'
import { 
  FileText, 
  TrendingUp, 
  Users, 
  Globe,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Zap,
  Bot,
  Eye
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import NewsAPI from '../services/api'
import { useWebSocket } from '../contexts/WebSocketContext'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalArticles: 0,
    todayArticles: 0,
    totalViews: 0,
    activeSources: 0
  })
  
  const [recentActivity, setRecentActivity] = useState([])
  const [chartData, setChartData] = useState([])
  const [automationStatus, setAutomationStatus] = useState({})
  const [loading, setLoading] = useState(true)
  
  const { connected, realTimeData } = useWebSocket()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  useEffect(() => {
    if (realTimeData.stats) {
      setStats(prev => ({ ...prev, ...realTimeData.stats }))
    }
    if (realTimeData.activities.length > 0) {
      setRecentActivity(realTimeData.activities)
    }
  }, [realTimeData])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      const [statsData, automationData] = await Promise.all([
        NewsAPI.getStats(),
        NewsAPI.getAutomationStatus()
      ])

      setStats({
        totalArticles: statsData.total_articles || 1247,
        todayArticles: statsData.today_articles || 23,
        totalViews: statsData.total_views || 45678,
        activeSources: statsData.active_sources || 8
      })

      setAutomationStatus(automationData)

      setRecentActivity([
        {
          id: 1,
          type: 'article',
          title: 'تم نشر خبر جديد: تطورات في المفاوضات السورية',
          time: 'منذ 5 دقائق',
          status: 'success'
        },
        {
          id: 2,
          type: 'automation',
          title: 'تم سحب 3 أخبار جديدة من وكالة سانا',
          time: 'منذ 10 دقائق',
          status: 'info'
        },
        {
          id: 3,
          type: 'ai',
          title: 'تم تحليل وتصنيف 5 أخبار بالذكاء الاصطناعي',
          time: 'منذ 15 دقيقة',
          status: 'success'
        },
        {
          id: 4,
          type: 'error',
          title: 'فشل في الاتصال بمصدر الجزيرة',
          time: 'منذ 20 دقيقة',
          status: 'error'
        }
      ])

      setChartData([
        { name: 'السبت', articles: 12, views: 2400, engagement: 4.1 },
        { name: 'الأحد', articles: 19, views: 1398, engagement: 4.3 },
        { name: 'الاثنين', articles: 15, views: 9800, engagement: 3.9 },
        { name: 'الثلاثاء', articles: 27, views: 3908, engagement: 4.5 },
        { name: 'الأربعاء', articles: 18, views: 4800, engagement: 4.2 },
        { name: 'الخميس', articles: 23, views: 3800, engagement: 4.4 },
        { name: 'الجمعة', articles: 21, views: 4300, engagement: 4.6 }
      ])
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ title, value, icon: Icon, color, change, loading }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          {loading ? (
            <div className="h-8 bg-gray-200 rounded animate-pulse mt-2"></div>
          ) : (
            <p className="text-2xl font-bold text-gray-900 mt-2">{value.toLocaleString()}</p>
          )}
          {change && (
            <p className={`text-sm mt-2 flex items-center ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp className="w-4 h-4 ml-1" />
              {change > 0 ? '+' : ''}{change}% من الأمس
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  )

  const getActivityIcon = (type) => {
    switch (type) {
      case 'article': return FileText
      case 'automation': return Zap
      case 'ai': return Bot
      case 'error': return AlertTriangle
      default: return CheckCircle
    }
  }

  const getActivityColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50'
      case 'error': return 'text-red-600 bg-red-50'
      case 'warning': return 'text-yellow-600 bg-yellow-50'
      default: return 'text-blue-600 bg-blue-50'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم الرئيسية</h1>
          <p className="text-gray-600 mt-1">نظرة عامة شاملة على أداء النظام الإخباري المتقدم</p>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full ml-2 ${connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-600">
              {connected ? 'البيانات المباشرة نشطة' : 'البيانات المباشرة معطلة'}
            </span>
          </div>
          <button 
            onClick={fetchDashboardData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            تحديث البيانات
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="إجمالي الأخبار"
          value={stats.totalArticles}
          icon={FileText}
          color="bg-blue-600"
          change={12}
          loading={loading}
        />
        <StatCard
          title="أخبار اليوم"
          value={stats.todayArticles}
          icon={Clock}
          color="bg-green-600"
          change={8}
          loading={loading}
        />
        <StatCard
          title="إجمالي المشاهدات"
          value={stats.totalViews}
          icon={Eye}
          color="bg-purple-600"
          change={-3}
          loading={loading}
        />
        <StatCard
          title="المصادر النشطة"
          value={stats.activeSources}
          icon={Globe}
          color="bg-orange-600"
          change={0}
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">الأخبار المنشورة (آخر 7 أيام)</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="articles" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">المشاهدات اليومية</h3>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="views" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">النشاط المباشر</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const Icon = getActivityIcon(activity.type)
                const colorClass = getActivityColor(activity.status)
                
                return (
                  <div key={activity.id} className="flex items-start space-x-4 space-x-reverse">
                    <div className={`p-2 rounded-full ${colorClass}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">حالة الأتمتة</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Activity className="w-5 h-5 text-gray-600 ml-3" />
                  <span className="font-medium">حالة النظام</span>
                </div>
                <div className={`flex items-center ${automationStatus.is_running ? 'text-green-600' : 'text-red-600'}`}>
                  <div className={`w-2 h-2 rounded-full ml-2 ${automationStatus.is_running ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                  {automationStatus.is_running ? 'نشط' : 'متوقف'}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-gray-600 ml-3" />
                  <span className="font-medium">فترة السحب</span>
                </div>
                <span className="text-gray-900">{automationStatus.scraping_interval || 5} دقائق</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Bot className="w-5 h-5 text-gray-600 ml-3" />
                  <span className="font-medium">الذكاء الاصطناعي</span>
                </div>
                <span className={automationStatus.ai_processing_enabled ? 'text-green-600' : 'text-red-600'}>
                  {automationStatus.ai_processing_enabled ? 'مفعل' : 'معطل'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">سحب أخبار فوري</h3>
          <p className="text-blue-100 mb-4">ابدأ عملية سحب الأخبار من جميع المصادر</p>
          <button className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
            بدء السحب
          </button>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">تحليل بالذكاء الاصطناعي</h3>
          <p className="text-green-100 mb-4">تحليل وتصنيف الأخبار المعلقة</p>
          <button className="bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors">
            بدء التحليل
          </button>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">تقرير شامل</h3>
          <p className="text-purple-100 mb-4">إنشاء تقرير مفصل عن أداء النظام</p>
          <button className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors">
            إنشاء التقرير
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
