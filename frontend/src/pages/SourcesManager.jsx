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
  TestTube
} from 'lucide-react'

const SourcesManager = () => {
  const [sources, setSources] = useState([])
  const [filteredSources, setFilteredSources] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('all')
  const [selectedLanguage, setSelectedLanguage] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingSource, setEditingSource] = useState(null)

  const countries = [
    { value: 'all', label: 'جميع البلدان' },
    { value: 'سوريا', label: 'سوريا' },
    { value: 'قطر', label: 'قطر' },
    { value: 'السعودية', label: 'السعودية' },
    { value: 'الإمارات', label: 'الإمارات' },
    { value: 'مصر', label: 'مصر' },
    { value: 'لبنان', label: 'لبنان' },
    { value: 'الأردن', label: 'الأردن' },
    { value: 'بريطانيا', label: 'بريطانيا' },
    { value: 'أمريكا', label: 'أمريكا' }
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
          rss_url: 'https://sana.sy/rss',
          country: 'سوريا',
          language: 'ar',
          is_active: true,
          last_scraped: '2024-01-15T10:30:00Z',
          articles_count: 1247,
          success_rate: 98.5,
          avg_response_time: 1.2
        },
        {
          id: 2,
          name: 'الجزيرة',
          url: 'https://aljazeera.net',
          rss_url: 'https://aljazeera.net/rss',
          country: 'قطر',
          language: 'ar',
          is_active: true,
          last_scraped: '2024-01-15T10:25:00Z',
          articles_count: 892,
          success_rate: 95.2,
          avg_response_time: 2.1
        },
        {
          id: 3,
          name: 'العربية',
          url: 'https://alarabiya.net',
          rss_url: 'https://alarabiya.net/rss',
          country: 'السعودية',
          language: 'ar',
          is_active: true,
          last_scraped: '2024-01-15T10:20:00Z',
          articles_count: 756,
          success_rate: 97.1,
          avg_response_time: 1.8
        },
        {
          id: 4,
          name: 'BBC Arabic',
          url: 'https://bbc.com/arabic',
          rss_url: 'https://feeds.bbci.co.uk/arabic/rss.xml',
          country: 'بريطانيا',
          language: 'ar',
          is_active: true,
          last_scraped: '2024-01-15T10:15:00Z',
          articles_count: 634,
          success_rate: 99.1,
          avg_response_time: 0.9
        },
        {
          id: 5,
          name: 'Reuters',
          url: 'https://reuters.com',
          rss_url: 'https://feeds.reuters.com/reuters/topNews',
          country: 'أمريكا',
          language: 'en',
          is_active: false,
          last_scraped: '2024-01-14T15:30:00Z',
          articles_count: 423,
          success_rate: 89.3,
          avg_response_time: 3.2
        },
        {
          id: 6,
          name: 'الوطن أونلاين',
          url: 'https://alwatan.sy',
          rss_url: 'https://alwatan.sy/rss',
          country: 'سوريا',
          language: 'ar',
          is_active: true,
          last_scraped: '2024-01-15T10:10:00Z',
          articles_count: 567,
          success_rate: 96.8,
          avg_response_time: 1.5
        }
      ]
      
      setSources(mockSources)
    } catch (error) {
      console.error('Error fetching sources:', error)
    }
  }

  const filterSources = () => {
    let filtered = sources

    if (searchTerm) {
      filtered = filtered.filter(source =>
        source.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        source.url.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCountry !== 'all') {
      filtered = filtered.filter(source => source.country === selectedCountry)
    }

    if (selectedLanguage !== 'all') {
      filtered = filtered.filter(source => source.language === selectedLanguage)
    }

    setFilteredSources(filtered)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'لم يتم السحب'
    const date = new Date(dateString)
    return date.toLocaleString('ar-SA')
  }

  const getLanguageText = (lang) => {
    const langMap = {
      ar: 'العربية',
      en: 'الإنجليزية',
      fr: 'الفرنسية',
      de: 'الألمانية',
      tr: 'التركية'
    }
    return langMap[lang] || lang
  }

  const handleToggleActive = (sourceId) => {
    setSources(prev => prev.map(source => 
      source.id === sourceId 
        ? { ...source, is_active: !source.is_active }
        : source
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

  const handleTestConnection = async (sourceId) => {
    console.log('Testing connection for source:', sourceId)
    alert('تم اختبار الاتصال بنجاح!')
  }

  const SourceModal = () => {
    const [formData, setFormData] = useState({
      name: '',
      url: '',
      rss_url: '',
      country: 'سوريا',
      language: 'ar',
      is_active: true
    })

    useEffect(() => {
      if (editingSource) {
        setFormData(editingSource)
      } else {
        setFormData({
          name: '',
          url: '',
          rss_url: '',
          country: 'سوريا',
          language: 'ar',
          is_active: true
        })
      }
    }, [editingSource])

    const handleSubmit = (e) => {
      e.preventDefault()
      
      if (editingSource) {
        setSources(prev => prev.map(source => 
          source.id === editingSource.id 
            ? { ...source, ...formData }
            : source
        ))
      } else {
        const newSource = {
          ...formData,
          id: Date.now(),
          last_scraped: null,
          articles_count: 0,
          success_rate: 0,
          avg_response_time: 0
        }
        setSources(prev => [...prev, newSource])
      }
      
      setShowAddModal(false)
      setEditingSource(null)
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingSource ? 'تحرير المصدر' : 'إضافة مصدر جديد'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                اسم المصدر
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                رابط الموقع
              </label>
              <input
                type="url"
                required
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                رابط RSS
              </label>
              <input
                type="url"
                value={formData.rss_url}
                onChange={(e) => setFormData(prev => ({ ...prev, rss_url: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  البلد
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {countries.slice(1).map(country => (
                    <option key={country.value} value={country.value}>
                      {country.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  اللغة
                </label>
                <select
                  value={formData.language}
                  onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {languages.slice(1).map(language => (
                    <option key={language.value} value={language.value}>
                      {language.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_active" className="mr-2 block text-sm text-gray-900">
                مصدر نشط
              </label>
            </div>

            <div className="flex justify-end space-x-3 space-x-reverse pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false)
                  setEditingSource(null)
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700"
              >
                {editingSource ? 'تحديث' : 'إضافة'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة المصادر</h1>
          <p className="text-gray-600 mt-1">إدارة مصادر الأخبار والمواقع الإخبارية</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 ml-2" />
          إضافة مصدر جديد
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
              <option key={country.value} value={country.value}>
                {country.label}
              </option>
            ))}
          </select>

          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {languages.map(language => (
              <option key={language.value} value={language.value}>
                {language.label}
              </option>
            ))}
          </select>

          <div className="flex items-center text-sm text-gray-600">
            <Filter className="w-4 h-4 ml-2" />
            {filteredSources.length} مصدر
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSources.map((source) => (
          <div key={source.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Globe className="w-5 h-5 text-blue-600" />
                </div>
                <div className="mr-3">
                  <h3 className="text-lg font-semibold text-gray-900">{source.name}</h3>
                  <p className="text-sm text-gray-500">{source.country}</p>
                </div>
              </div>
              <div className="flex items-center">
                {source.is_active ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{source.articles_count}</p>
                <p className="text-xs text-gray-500">مقال</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{source.success_rate}%</p>
                <p className="text-xs text-gray-500">نجاح</p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">اللغة:</span>
                <span className="font-medium">{getLanguageText(source.language)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">زمن الاستجابة:</span>
                <span className="font-medium">{source.avg_response_time}ث</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">آخر سحب:</span>
                <span className="font-medium text-xs">{formatDate(source.last_scraped)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2 space-x-reverse">
                <button
                  onClick={() => handleTestConnection(source.id)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="اختبار الاتصال"
                >
                  <TestTube className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEdit(source)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="تحرير"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(source.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="حذف"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() => handleToggleActive(source.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  source.is_active
                    ? 'bg-red-100 text-red-800 hover:bg-red-200'
                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                }`}
              >
                {source.is_active ? 'إيقاف' : 'تفعيل'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && <SourceModal />}
    </div>
  )
}

export default SourcesManager
