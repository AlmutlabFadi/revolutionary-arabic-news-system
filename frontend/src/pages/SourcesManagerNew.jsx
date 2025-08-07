import React, { useState, useEffect } from 'react'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Globe, 
  CheckCircle, 
  XCircle,
  Search,
  Filter,
  Rss,
  Clock,
  BarChart3,
  TestTube,
  FileText,
  Eye,
  Settings,
  Upload,
  Download,
  Play,
  Pause,
  RefreshCw,
  AlertCircle,
  BookOpen,
  Image,
  Video,
  Link
} from 'lucide-react'

const SourcesManager = () => {
  const [sources, setSources] = useState([])
  const [filteredSources, setFilteredSources] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('all')
  const [selectedLanguage, setSelectedLanguage] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingSource, setEditingSource] = useState(null)
  const [showAddArticleModal, setShowAddArticleModal] = useState(false)
  const [selectedSource, setSelectedSource] = useState(null)
  const [showAllCasesModal, setShowAllCasesModal] = useState(false)
  const [showArticleModal, setShowArticleModal] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [articles, setArticles] = useState([])
  const [activeTab, setActiveTab] = useState('sources')
  const [scrapingSettings, setScrapingSettings] = useState({
    enableFullContent: true,
    enableImages: true,
    enableVideos: true,
    maxImageSize: 5,
    maxVideoSize: 50,
    scrapingInterval: 300
  })
  const [customCategory, setCustomCategory] = useState('')
  const [showCustomCategory, setShowCustomCategory] = useState(false)

  const countries = [
    { value: 'all', label: 'جميع البلدان' },
    { value: 'سوريا', label: 'سوريا' },
    { value: 'قطر', label: 'قطر' },
    { value: 'السعودية', label: 'السعودية' },
    { value: 'الإمارات', label: 'الإمارات' },
    { value: 'الكويت', label: 'الكويت' },
    { value: 'البحرين', label: 'البحرين' },
    { value: 'عمان', label: 'عمان' },
    { value: 'الأردن', label: 'الأردن' },
    { value: 'لبنان', label: 'لبنان' },
    { value: 'العراق', label: 'العراق' },
    { value: 'مصر', label: 'مصر' },
    { value: 'بريطانيا', label: 'بريطانيا' }
  ]

  const categories = [
    { value: 'all', label: 'جميع الفئات' },
    { value: 'سياسة', label: 'سياسة' },
    { value: 'اقتصاد', label: 'اقتصاد' },
    { value: 'رياضة', label: 'رياضة' },
    { value: 'تكنولوجيا', label: 'تكنولوجيا' },
    { value: 'صحة', label: 'صحة' },
    { value: 'ثقافة', label: 'ثقافة' },
    { value: 'دولي', label: 'دولي' },
    { value: 'الشأن السوري', label: 'الشأن السوري' },
    { value: 'عاجل', label: 'عاجل' },
    { value: 'محلي', label: 'محلي' },
    { value: 'عالمي', label: 'عالمي' },
    { value: 'علوم', label: 'علوم' },
    { value: 'فن', label: 'فن' },
    { value: 'عملات رقمية', label: 'عملات رقمية' },
    { value: 'أسواق مالية', label: 'أسواق مالية' },
    { value: 'بورصة', label: 'بورصة' },
    { value: 'أخرى', label: 'أخرى' }
  ]

  const languages = [
    { value: 'all', label: 'جميع اللغات' },
    { value: 'ar', label: 'العربية' },
    { value: 'en', label: 'الإنجليزية' },
    { value: 'fr', label: 'الفرنسية' },
    { value: 'de', label: 'الألمانية' },
    { value: 'tr', label: 'التركية' }
  ]

  useEffect(() => {
    fetchSources()
    fetchArticles()
  }, [])

  useEffect(() => {
    filterSources()
  }, [sources, searchTerm, selectedCountry, selectedLanguage])

  const fetchSources = async () => {
    try {
      const mockSources = [
        {
          id: 1,
          name: 'وكالة سانا',
          url: 'https://sana.sy',
          country: 'سوريا',
          language: 'ar',
          category: 'سياسة',
          isActive: true,
          lastScrape: new Date().toISOString(),
          articlesCount: 1250,
          successRate: 98.5,
          status: 'متصل',
          permissions: {
            canRead: true,
            canEdit: true,
            canDelete: true,
            canScrape: true
          }
        },
        {
          id: 2,
          name: 'الوطن أونلاين',
          url: 'https://alwatan.sy',
          country: 'سوريا',
          language: 'ar',
          category: 'عام',
          isActive: true,
          lastScrape: new Date().toISOString(),
          articlesCount: 890,
          successRate: 95.2,
          status: 'متصل',
          permissions: {
            canRead: true,
            canEdit: true,
            canDelete: false,
            canScrape: true
          }
        },
        {
          id: 3,
          name: 'تشرين',
          url: 'https://tishreen.news.sy',
          country: 'سوريا',
          language: 'ar',
          category: 'محلي',
          isActive: false,
          lastScrape: new Date(Date.now() - 3600000).toISOString(),
          articlesCount: 567,
          successRate: 87.3,
          status: 'غير متصل',
          permissions: {
            canRead: true,
            canEdit: false,
            canDelete: false,
            canScrape: false
          }
        },
        {
          id: 4,
          name: 'الجزيرة',
          url: 'https://aljazeera.net',
          country: 'قطر',
          language: 'ar',
          category: 'دولي',
          isActive: true,
          lastScrape: new Date().toISOString(),
          articlesCount: 2340,
          successRate: 99.1,
          status: 'متصل',
          permissions: {
            canRead: true,
            canEdit: true,
            canDelete: true,
            canScrape: true
          }
        },
        {
          id: 5,
          name: 'العربية',
          url: 'https://alarabiya.net',
          country: 'السعودية',
          language: 'ar',
          category: 'عام',
          isActive: true,
          lastScrape: new Date().toISOString(),
          articlesCount: 1890,
          successRate: 96.8,
          status: 'متصل',
          permissions: {
            canRead: true,
            canEdit: true,
            canDelete: true,
            canScrape: true
          }
        },
        {
          id: 6,
          name: 'BBC Arabic',
          url: 'https://bbc.com/arabic',
          country: 'بريطانيا',
          language: 'ar',
          category: 'دولي',
          isActive: true,
          lastScrape: new Date().toISOString(),
          articlesCount: 1456,
          successRate: 97.5,
          status: 'متصل',
          permissions: {
            canRead: true,
            canEdit: true,
            canDelete: false,
            canScrape: true
          }
        }
      ]
      setSources(mockSources)
    } catch (error) {
      console.error('Error fetching sources:', error)
    }
  }

  const fetchArticles = async () => {
    try {
      const mockArticles = [
        {
          id: 1,
          title: 'تطورات جديدة في المفاوضات السورية',
          content: 'محتوى المقال الكامل مع النص والصور والفيديوهات...',
          category: 'سياسة',
          source: 'وكالة سانا',
          status: 'منشور',
          publishedAt: new Date().toISOString(),
          hasImages: true,
          hasVideos: false,
          imageCount: 3,
          videoCount: 0,
          permissions: {
            canRead: true,
            canEdit: true,
            canDelete: true
          }
        },
        {
          id: 2,
          title: 'ارتفاع أسعار العملات الرقمية',
          content: 'تحليل شامل لحركة العملات الرقمية مع الرسوم البيانية...',
          category: 'عملات رقمية',
          source: 'الجزيرة',
          status: 'قيد المراجعة',
          publishedAt: new Date(Date.now() - 1800000).toISOString(),
          hasImages: true,
          hasVideos: true,
          imageCount: 5,
          videoCount: 2,
          permissions: {
            canRead: true,
            canEdit: true,
            canDelete: false
          }
        },
        {
          id: 3,
          title: 'تقرير عن الأسواق المالية العالمية',
          content: 'تحليل مفصل للأسواق المالية مع البيانات والإحصائيات...',
          category: 'أسواق مالية',
          source: 'العربية',
          status: 'مسودة',
          publishedAt: new Date(Date.now() - 3600000).toISOString(),
          hasImages: true,
          hasVideos: false,
          imageCount: 2,
          videoCount: 0,
          permissions: {
            canRead: true,
            canEdit: false,
            canDelete: false
          }
        }
      ]
      setArticles(mockArticles)
    } catch (error) {
      console.error('Error fetching articles:', error)
    }
  }

  const filterSources = () => {
    let filtered = sources.filter(source => {
      const matchesSearch = source.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           source.url.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCountry = selectedCountry === 'all' || source.country === selectedCountry
      const matchesLanguage = selectedLanguage === 'all' || source.language === selectedLanguage
      return matchesSearch && matchesCountry && matchesLanguage
    })
    setFilteredSources(filtered)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('ar-EG')
  }

  const getLanguageText = (lang) => {
    const langMap = {
      'ar': 'العربية',
      'en': 'الإنجليزية',
      'fr': 'الفرنسية',
      'de': 'الألمانية',
      'tr': 'التركية'
    }
    return langMap[lang] || lang
  }

  const handleToggleActive = (sourceId) => {
    setSources(prev => prev.map(source => 
      source.id === sourceId ? { ...source, isActive: !source.isActive } : source
    ))
  }

  const handleEdit = (source) => {
    setEditingSource(source)
    setShowAddModal(true)
  }

  const handleDelete = (sourceId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المصدر؟')) {
      setSources(prev => prev.filter(source => source.id !== sourceId))
    }
  }

  const handleTestConnection = (sourceId) => {
    console.log('Testing connection for source:', sourceId)
  }

  const handleAddArticle = (source) => {
    setSelectedSource(source)
    setShowAddArticleModal(true)
  }

  const handleViewAllCases = () => {
    setShowAllCasesModal(true)
  }

  const handleOpenArticle = (article) => {
    setSelectedArticle(article)
    setShowArticleModal(true)
  }

  const handleEditArticle = (articleId) => {
    console.log('Editing article:', articleId)
  }

  const handleDeleteArticle = (articleId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المقال؟')) {
      setArticles(prev => prev.filter(article => article.id !== articleId))
    }
  }

  const handleManualScrape = (sourceId) => {
    console.log('Manual scraping for source:', sourceId)
  }

  const handleScrapingSettingsUpdate = (newSettings) => {
    setScrapingSettings(newSettings)
    console.log('Updated scraping settings:', newSettings)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة المصادر</h1>
          <p className="text-gray-600 mt-1">إدارة مصادر الأخبار والمواقع الإخبارية مع إمكانيات متقدمة</p>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          <button 
            onClick={handleViewAllCases}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <FileText className="w-4 h-4 ml-2" />
            جميع الحالات
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 ml-2" />
            إضافة مصدر جديد
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 space-x-reverse px-6">
            <button
              onClick={() => setActiveTab('sources')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'sources'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              المصادر ({sources.length})
            </button>
            <button
              onClick={() => setActiveTab('articles')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'articles'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              المقالات ({articles.length})
            </button>
            <button
              onClick={() => setActiveTab('scraping')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'scraping'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              إعدادات السحب
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'sources' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="البحث في المصادر..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {countries.map(country => (
                    <option key={country.value} value={country.value}>{country.label}</option>
                  ))}
                </select>

                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {languages.map(language => (
                    <option key={language.value} value={language.value}>{language.label}</option>
                  ))}
                </select>

                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center">
                  <Filter className="w-4 h-4 ml-2" />
                  تصفية متقدمة
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المصدر</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">البلد</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">اللغة</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المقالات</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">معدل النجاح</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">آخر سحب</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredSources.map((source) => (
                      <tr key={source.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Globe className="w-5 h-5 text-gray-400 ml-3" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{source.name}</div>
                              <div className="text-sm text-gray-500">{source.url}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{source.country}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getLanguageText(source.language)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {source.isActive ? (
                              <CheckCircle className="w-5 h-5 text-green-500 ml-2" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-500 ml-2" />
                            )}
                            <span className={`text-sm ${source.isActive ? 'text-green-600' : 'text-red-600'}`}>
                              {source.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{source.articlesCount}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 ml-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full" 
                                style={{ width: `${source.successRate}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-900">{source.successRate}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(source.lastScrape)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <button
                              onClick={() => handleToggleActive(source.id)}
                              className={`p-2 rounded-lg ${source.isActive ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-600 hover:bg-green-200'}`}
                              title={source.isActive ? 'إيقاف' : 'تفعيل'}
                            >
                              {source.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => handleTestConnection(source.id)}
                              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                              title="اختبار الاتصال"
                            >
                              <TestTube className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleManualScrape(source.id)}
                              className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200"
                              title="سحب يدوي"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleAddArticle(source)}
                              className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                              title="إضافة مقال"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            {source.permissions.canEdit && (
                              <button
                                onClick={() => handleEdit(source)}
                                className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200"
                                title="تحرير"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            )}
                            {source.permissions.canDelete && (
                              <button
                                onClick={() => handleDelete(source.id)}
                                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                                title="حذف"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'articles' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">إدارة المقالات</h3>
                <button
                  onClick={() => setShowAddArticleModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة مقال جديد
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <div key={article.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="text-lg font-medium text-gray-900 line-clamp-2">{article.title}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        article.status === 'منشور' ? 'bg-green-100 text-green-800' :
                        article.status === 'قيد المراجعة' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {article.status}
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Rss className="w-4 h-4 ml-2" />
                        {article.source}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 ml-2" />
                        {formatDate(article.publishedAt)}
                      </div>
                      <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-600">
                        {article.hasImages && (
                          <div className="flex items-center">
                            <Image className="w-4 h-4 ml-1" />
                            {article.imageCount}
                          </div>
                        )}
                        {article.hasVideos && (
                          <div className="flex items-center">
                            <Video className="w-4 h-4 ml-1" />
                            {article.videoCount}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 space-x-reverse">
                      {article.permissions.canRead && (
                        <button
                          onClick={() => handleOpenArticle(article)}
                          className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                        >
                          <Eye className="w-4 h-4 ml-2" />
                          عرض
                        </button>
                      )}
                      {article.permissions.canEdit && (
                        <button
                          onClick={() => handleEditArticle(article.id)}
                          className="flex-1 bg-yellow-600 text-white px-3 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center"
                        >
                          <Edit className="w-4 h-4 ml-2" />
                          تحرير
                        </button>
                      )}
                      {article.permissions.canDelete && (
                        <button
                          onClick={() => handleDeleteArticle(article.id)}
                          className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                        >
                          <Trash2 className="w-4 h-4 ml-2" />
                          حذف
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'scraping' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">إعدادات السحب المتقدمة</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-md font-medium text-gray-900 mb-4">إعدادات المحتوى</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">سحب المحتوى الكامل</label>
                      <input
                        type="checkbox"
                        checked={scrapingSettings.enableFullContent}
                        onChange={(e) => setScrapingSettings(prev => ({...prev, enableFullContent: e.target.checked}))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">سحب الصور</label>
                      <input
                        type="checkbox"
                        checked={scrapingSettings.enableImages}
                        onChange={(e) => setScrapingSettings(prev => ({...prev, enableImages: e.target.checked}))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">سحب الفيديوهات</label>
                      <input
                        type="checkbox"
                        checked={scrapingSettings.enableVideos}
                        onChange={(e) => setScrapingSettings(prev => ({...prev, enableVideos: e.target.checked}))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-md font-medium text-gray-900 mb-4">حدود الملفات</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الحد الأقصى لحجم الصور (MB)
                      </label>
                      <input
                        type="number"
                        value={scrapingSettings.maxImageSize}
                        onChange={(e) => setScrapingSettings(prev => ({...prev, maxImageSize: parseInt(e.target.value)}))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الحد الأقصى لحجم الفيديوهات (MB)
                      </label>
                      <input
                        type="number"
                        value={scrapingSettings.maxVideoSize}
                        onChange={(e) => setScrapingSettings(prev => ({...prev, maxVideoSize: parseInt(e.target.value)}))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        فترة السحب (ثانية)
                      </label>
                      <input
                        type="number"
                        value={scrapingSettings.scrapingInterval}
                        onChange={(e) => setScrapingSettings(prev => ({...prev, scrapingInterval: parseInt(e.target.value)}))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => handleScrapingSettingsUpdate(scrapingSettings)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  حفظ الإعدادات
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Source Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingSource ? 'تحرير المصدر' : 'إضافة مصدر جديد'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">اسم المصدر</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="أدخل اسم المصدر"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">رابط المصدر</label>
                <input
                  type="url"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">البلد</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  {countries.filter(c => c.value !== 'all').map(country => (
                    <option key={country.value} value={country.value}>{country.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">اللغة</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  {languages.filter(l => l.value !== 'all').map(language => (
                    <option key={language.value} value={language.value}>{language.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الفئة</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={(e) => {
                    if (e.target.value === 'أخرى') {
                      setShowCustomCategory(true)
                    } else {
                      setShowCustomCategory(false)
                    }
                  }}
                >
                  {categories.filter(c => c.value !== 'all').map(category => (
                    <option key={category.value} value={category.value}>{category.label}</option>
                  ))}
                </select>
                {showCustomCategory && (
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-2"
                    placeholder="أدخل الفئة المخصصة"
                  />
                )}
              </div>
            </div>
            <div className="flex justify-end space-x-3 space-x-reverse mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setEditingSource(null)
                  setShowCustomCategory(false)
                  setCustomCategory('')
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
              >
                إلغاء
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700">
                {editingSource ? 'تحديث' : 'إضافة'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Article Modal */}
      {showAddArticleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">إضافة مقال جديد</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">عنوان المقال</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="أدخل عنوان المقال"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">محتوى المقال</label>
                <textarea
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="أدخل محتوى المقال الكامل مع النص والوصف للصور والفيديوهات"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الفئة</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    {categories.filter(c => c.value !== 'all').map(category => (
                      <option key={category.value} value={category.value}>{category.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الحالة</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="مسودة">مسودة</option>
                    <option value="قيد المراجعة">قيد المراجعة</option>
                    <option value="منشور">منشور</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">رفع الصور</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">رفع الفيديوهات</label>
                <input
                  type="file"
                  multiple
                  accept="video/*"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 space-x-reverse mt-6">
              <button
                onClick={() => setShowAddArticleModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
              >
                إلغاء
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700">
                إضافة المقال
              </button>
            </div>
          </div>
        </div>
      )}

      {/* All Cases Modal */}
      {showAllCasesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">جميع الحالات والمقالات</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <FileText className="w-8 h-8 text-blue-600 ml-3" />
                  <div>
                    <p className="text-sm font-medium text-blue-600">إجمالي المقالات</p>
                    <p className="text-2xl font-bold text-blue-900">{articles.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="w-8 h-8 text-green-600 ml-3" />
                  <div>
                    <p className="text-sm font-medium text-green-600">منشور</p>
                    <p className="text-2xl font-bold text-green-900">
                      {articles.filter(a => a.status === 'منشور').length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Clock className="w-8 h-8 text-yellow-600 ml-3" />
                  <div>
                    <p className="text-sm font-medium text-yellow-600">قيد المراجعة</p>
                    <p className="text-2xl font-bold text-yellow-900">
                      {articles.filter(a => a.status === 'قيد المراجعة').length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Edit className="w-8 h-8 text-gray-600 ml-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">مسودة</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {articles.filter(a => a.status === 'مسودة').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">العنوان</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الفئة</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المصدر</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الوسائط</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {articles.map((article) => (
                    <tr key={article.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 line-clamp-2">{article.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{article.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{article.source}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          article.status === 'منشور' ? 'bg-green-100 text-green-800' :
                          article.status === 'قيد المراجعة' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {article.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          {article.hasImages && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Image className="w-4 h-4 ml-1" />
                              {article.imageCount}
                            </div>
                          )}
                          {article.hasVideos && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Video className="w-4 h-4 ml-1" />
                              {article.videoCount}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          {article.permissions.canRead && (
                            <button
                              onClick={() => handleOpenArticle(article)}
                              className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                              title="عرض"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          {article.permissions.canEdit && (
                            <button
                              onClick={() => handleEditArticle(article.id)}
                              className="p-1 bg-yellow-100 text-yellow-600 rounded hover:bg-yellow-200"
                              title="تحرير"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                          {article.permissions.canDelete && (
                            <button
                              onClick={() => handleDeleteArticle(article.id)}
                              className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowAllCasesModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Article View Modal */}
      {showArticleModal && selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">{selectedArticle.title}</h3>
              <button
                onClick={() => {
                  setShowArticleModal(false)
                  setSelectedArticle(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center text-sm text-gray-600">
                <Rss className="w-4 h-4 ml-2" />
                {selectedArticle.source}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 ml-2" />
                {formatDate(selectedArticle.publishedAt)}
              </div>
              <div className="flex items-center">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  selectedArticle.status === 'منشور' ? 'bg-green-100 text-green-800' :
                  selectedArticle.status === 'قيد المراجعة' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {selectedArticle.status}
                </span>
              </div>
            </div>

            <div className="prose max-w-none mb-6">
              <p className="text-gray-700 leading-relaxed">{selectedArticle.content}</p>
            </div>

            {(selectedArticle.hasImages || selectedArticle.hasVideos) && (
              <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-900 mb-3">الوسائط المرفقة</h4>
                <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-600">
                  {selectedArticle.hasImages && (
                    <div className="flex items-center">
                      <Image className="w-5 h-5 ml-2" />
                      {selectedArticle.imageCount} صورة
                    </div>
                  )}
                  {selectedArticle.hasVideos && (
                    <div className="flex items-center">
                      <Video className="w-5 h-5 ml-2" />
                      {selectedArticle.videoCount} فيديو
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 space-x-reverse">
              {selectedArticle.permissions.canEdit && (
                <button
                  onClick={() => {
                    handleEditArticle(selectedArticle.id)
                    setShowArticleModal(false)
                    setSelectedArticle(null)
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700"
                >
                  تحرير المقال
                </button>
              )}
              {selectedArticle.permissions.canDelete && (
                <button
                  onClick={() => {
                    handleDeleteArticle(selectedArticle.id)
                    setShowArticleModal(false)
                    setSelectedArticle(null)
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700"
                >
                  حذف المقال
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SourcesManager
