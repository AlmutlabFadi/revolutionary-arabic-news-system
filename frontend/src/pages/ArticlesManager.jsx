import React, { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Plus,
  Calendar,
  Tag,
  User,
  Globe,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react'

const ArticlesManager = () => {
  const [articles, setArticles] = useState([])
  const [filteredArticles, setFilteredArticles] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [articlesPerPage] = useState(10)

  const categories = [
    { value: 'all', label: 'جميع الفئات' },
    { value: 'politics', label: 'سياسة' },
    { value: 'economy', label: 'اقتصاد' },
    { value: 'syrian_affairs', label: 'الشأن السوري' },
    { value: 'sports', label: 'رياضة' },
    { value: 'technology', label: 'تكنولوجيا' },
    { value: 'health', label: 'صحة' },
    { value: 'culture', label: 'ثقافة' }
  ]

  const statuses = [
    { value: 'all', label: 'جميع الحالات' },
    { value: 'published', label: 'منشور' },
    { value: 'draft', label: 'مسودة' },
    { value: 'breaking', label: 'عاجل' },
    { value: 'archived', label: 'مؤرشف' }
  ]

  useEffect(() => {
    fetchArticles()
  }, [])

  useEffect(() => {
    filterArticles()
  }, [articles, searchTerm, selectedCategory, selectedStatus])

  const fetchArticles = async () => {
    try {
      const mockArticles = [
        {
          id: 1,
          title: 'تطورات جديدة في المفاوضات السورية تبشر بحلول سلمية شاملة',
          summary: 'مصادر دبلوماسية تؤكد تقدماً في المفاوضات السورية',
          category: 'syrian_affairs',
          status: 'published',
          author: 'محرر الشؤون السياسية',
          source: 'وكالة سانا',
          published_at: '2024-01-15T10:30:00Z',
          views: 1250,
          ai_processed: true
        },
        {
          id: 2,
          title: 'ارتفاع مؤشرات البورصة السورية بنسبة 5% خلال الأسبوع الماضي',
          summary: 'تحسن في الثقة الاستثمارية يدفع الأسواق للارتفاع',
          category: 'economy',
          status: 'published',
          author: 'محرر الاقتصاد',
          source: 'تشرين',
          published_at: '2024-01-15T09:15:00Z',
          views: 890,
          ai_processed: true
        },
        {
          id: 3,
          title: 'إعادة افتتاح مطار حلب الدولي بعد أعمال التطوير والتحديث',
          summary: 'خطوة مهمة نحو إعادة الإعمار وتطوير البنية التحتية',
          category: 'syrian_affairs',
          status: 'breaking',
          author: 'مراسل حلب',
          source: 'الوطن أونلاين',
          published_at: '2024-01-15T08:45:00Z',
          views: 2100,
          ai_processed: true
        },
        {
          id: 4,
          title: 'اكتشاف علاج جديد لمرض السكري في جامعة دمشق',
          summary: 'فريق بحثي سوري يحقق إنجازاً طبياً مهماً',
          category: 'health',
          status: 'draft',
          author: 'محرر العلوم',
          source: 'جامعة دمشق',
          published_at: null,
          views: 0,
          ai_processed: false
        },
        {
          id: 5,
          title: 'منتخب سوريا يتأهل لنهائيات كأس آسيا',
          summary: 'إنجاز رياضي تاريخي للكرة السورية',
          category: 'sports',
          status: 'published',
          author: 'محرر الرياضة',
          source: 'الثورة',
          published_at: '2024-01-14T20:30:00Z',
          views: 3200,
          ai_processed: true
        }
      ]
      
      setArticles(mockArticles)
    } catch (error) {
      console.error('Error fetching articles:', error)
    }
  }

  const filterArticles = () => {
    let filtered = articles

    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory)
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(article => article.status === selectedStatus)
    }

    setFilteredArticles(filtered)
    setCurrentPage(1)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'published': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'breaking': return <AlertTriangle className="w-4 h-4 text-red-600" />
      case 'draft': return <Clock className="w-4 h-4 text-yellow-600" />
      default: return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusText = (status) => {
    const statusMap = {
      published: 'منشور',
      breaking: 'عاجل',
      draft: 'مسودة',
      archived: 'مؤرشف'
    }
    return statusMap[status] || status
  }

  const getCategoryText = (category) => {
    const categoryMap = {
      politics: 'سياسة',
      economy: 'اقتصاد',
      syrian_affairs: 'الشأن السوري',
      sports: 'رياضة',
      technology: 'تكنولوجيا',
      health: 'صحة',
      culture: 'ثقافة'
    }
    return categoryMap[category] || category
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'غير منشور'
    const date = new Date(dateString)
    return date.toLocaleString('ar-SA')
  }

  const indexOfLastArticle = currentPage * articlesPerPage
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle)
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage)

  const handleEdit = (articleId) => {
    console.log('Edit article:', articleId)
  }

  const handleDelete = (articleId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المقال؟')) {
      setArticles(prev => prev.filter(article => article.id !== articleId))
    }
  }

  const handleView = (articleId) => {
    console.log('View article:', articleId)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة الأخبار</h1>
          <p className="text-gray-600 mt-1">إدارة وتحرير المقالات والأخبار</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
          <Plus className="w-4 h-4 ml-2" />
          إضافة مقال جديد
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="البحث في المقالات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {statuses.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>

          <div className="flex items-center text-sm text-gray-600">
            <Filter className="w-4 h-4 ml-2" />
            {filteredArticles.length} مقال
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المقال
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الفئة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المصدر
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المشاهدات
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  تاريخ النشر
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentArticles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-start">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                          {article.summary}
                        </p>
                        <div className="flex items-center mt-2 space-x-4 space-x-reverse">
                          <span className="text-xs text-gray-400 flex items-center">
                            <User className="w-3 h-3 ml-1" />
                            {article.author}
                          </span>
                          {article.ai_processed && (
                            <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded">
                              معالج بالذكاء الاصطناعي
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <Tag className="w-3 h-3 ml-1" />
                      {getCategoryText(article.category)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(article.status)}
                      <span className="mr-2 text-sm text-gray-900">
                        {getStatusText(article.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 ml-2" />
                      {article.source}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 ml-2" />
                      {article.views.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 ml-2" />
                      {formatDate(article.published_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <button
                        onClick={() => handleView(article.id)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        title="عرض"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(article.id)}
                        className="text-green-600 hover:text-green-900 p-1 rounded"
                        title="تحرير"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  السابق
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="mr-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  التالي
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    عرض{' '}
                    <span className="font-medium">{indexOfFirstArticle + 1}</span>
                    {' '}إلى{' '}
                    <span className="font-medium">
                      {Math.min(indexOfLastArticle, filteredArticles.length)}
                    </span>
                    {' '}من{' '}
                    <span className="font-medium">{filteredArticles.length}</span>
                    {' '}نتيجة
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      السابق
                    </button>
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === index + 1
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      التالي
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ArticlesManager
