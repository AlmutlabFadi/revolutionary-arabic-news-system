import React, { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  Users, 
  Eye, 
  FileText,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts'
import NewsAPI from '../services/api'

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState({
    overview: {
      totalViews: 0,
      totalArticles: 0,
      totalUsers: 0,
      avgEngagement: 0
    },
    chartData: [],
    categoryData: [],
    sourceData: [],
    topArticles: []
  })
  
  const [timeRange, setTimeRange] = useState('7days')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const data = await NewsAPI.getAnalytics(timeRange)
      setAnalytics(data)
    } catch (error) {
      console.error('Error fetching analytics:', error)
      setAnalytics({
        overview: {
          totalViews: 125847,
          totalArticles: 1456,
          totalUsers: 8934,
          avgEngagement: 78,
          viewsChange: 12.5,
          articlesChange: 8.3,
          usersChange: 15.7,
          engagementChange: 5.2
        },
        chartData: [
          { date: '2024-08-01', views: 12500, articles: 45 },
          { date: '2024-08-02', views: 13200, articles: 52 },
          { date: '2024-08-03', views: 11800, articles: 38 },
          { date: '2024-08-04', views: 14500, articles: 61 },
          { date: '2024-08-05', views: 15200, articles: 58 },
          { date: '2024-08-06', views: 16800, articles: 67 },
          { date: '2024-08-07', views: 18200, articles: 72 }
        ],
        categoryData: [
          { name: 'سياسة', value: 35, color: '#3B82F6' },
          { name: 'اقتصاد', value: 25, color: '#10B981' },
          { name: 'رياضة', value: 20, color: '#F59E0B' },
          { name: 'تكنولوجيا', value: 12, color: '#8B5CF6' },
          { name: 'أخرى', value: 8, color: '#EF4444' }
        ],
        sourceData: [
          { name: 'BBC Arabic', articles: 245, views: 45000 },
          { name: 'الجزيرة', articles: 198, views: 38000 },
          { name: 'العربية', articles: 167, views: 32000 },
          { name: 'وكالة سانا', articles: 134, views: 25000 },
          { name: 'Reuters', articles: 89, views: 18000 }
        ],
        topArticles: [
          { id: 1, title: 'تطورات الوضع السياسي في المنطقة', category: 'سياسة', views: 8500, engagement: 4.2 },
          { id: 2, title: 'نمو الاقتصاد العربي في الربع الثاني', category: 'اقتصاد', views: 7200, engagement: 3.8 },
          { id: 3, title: 'بطولة كأس العالم للأندية', category: 'رياضة', views: 6800, engagement: 4.5 },
          { id: 4, title: 'ثورة الذكاء الاصطناعي في التعليم', category: 'تكنولوجيا', views: 5900, engagement: 3.9 },
          { id: 5, title: 'اكتشافات طبية جديدة في علاج السرطان', category: 'صحة', views: 5400, engagement: 4.1 }
        ]
      })
    } finally {
      setLoading(false)
    }
  }

  const MetricCard = ({ title, value, change, icon: Icon, color }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value.toLocaleString()}</p>
          {change !== undefined && (
            <p className={`text-sm mt-2 flex items-center ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp className="w-4 h-4 ml-1" />
              {change >= 0 ? '+' : ''}{change}% من الفترة السابقة
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  )

  const timeRangeOptions = [
    { value: '24hours', label: '24 ساعة' },
    { value: '7days', label: '7 أيام' },
    { value: '30days', label: '30 يوم' },
    { value: '90days', label: '90 يوم' }
  ]

  const handleExportReport = () => {
    const reportData = {
      timeRange,
      generatedAt: new Date().toISOString(),
      overview: analytics.overview,
      chartData: analytics.chartData,
      categoryData: analytics.categoryData,
      sourceData: analytics.sourceData,
      topArticles: analytics.topArticles
    }
    
    const dataStr = JSON.stringify(reportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `golan24-analytics-report-${timeRange}-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    alert('تم تصدير التقرير بنجاح!')
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
          <h1 className="text-2xl font-bold text-gray-900">التحليلات والإحصائيات</h1>
          <p className="text-gray-600 mt-1">تحليل شامل لأداء المنصة الإخبارية</p>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {timeRangeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button 
            onClick={handleExportReport}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Download className="w-4 h-4 ml-2" />
            تصدير التقرير
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="إجمالي المشاهدات"
          value={analytics.overview.totalViews}
          change={analytics.overview.viewsChange}
          icon={Eye}
          color="bg-blue-600"
        />
        <MetricCard
          title="إجمالي المقالات"
          value={analytics.overview.totalArticles}
          change={analytics.overview.articlesChange}
          icon={FileText}
          color="bg-green-600"
        />
        <MetricCard
          title="إجمالي المستخدمين"
          value={analytics.overview.totalUsers}
          change={analytics.overview.usersChange}
          icon={Users}
          color="bg-purple-600"
        />
        <MetricCard
          title="متوسط التفاعل"
          value={analytics.overview.avgEngagement}
          change={analytics.overview.engagementChange}
          icon={Activity}
          color="bg-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">المشاهدات اليومية</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analytics.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="views" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">المقالات المنشورة</h3>
            <FileText className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="articles" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">توزيع الفئات</h3>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={analytics.categoryData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {analytics.categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">أداء المصادر</h3>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {analytics.sourceData.map((source, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{source.name}</h4>
                  <p className="text-sm text-gray-600">{source.articles} مقال</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{source.views.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">مشاهدة</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">أكثر المقالات مشاهدة</h3>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-right py-3 px-4 font-medium text-gray-900">المقال</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">الفئة</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">المشاهدات</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">التفاعل</th>
                </tr>
              </thead>
              <tbody>
                {analytics.topArticles.map((article, index) => (
                  <tr key={article.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full ml-3">
                          #{index + 1}
                        </span>
                        <h4 className="font-medium text-gray-900 line-clamp-2">
                          {article.title}
                        </h4>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {article.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">
                      {article.views.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 ml-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${Math.min(article.engagement * 20, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{article.engagement}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsPage
