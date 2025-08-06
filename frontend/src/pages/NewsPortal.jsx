import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import NewsAPI from '../services/api'
import CategoryNavigation from '../components/ui/CategoryNavigation'

const NewsPortal = () => {
  const location = useLocation()
  const [activeCategory, setActiveCategory] = useState('all')
  const [articles, setArticles] = useState([])
  const [breakingNews, setBreakingNews] = useState([])
  const [politicsNews, setPoliticsNews] = useState([])
  const [economyNews, setEconomyNews] = useState([])
  const [sportsNews, setSportsNews] = useState([])
  const [technologyNews, setTechnologyNews] = useState([])
  const [healthNews, setHealthNews] = useState([])
  const [cultureNews, setCultureNews] = useState([])
  const [internationalNews, setInternationalNews] = useState([])
  const [syrianNews, setSyrianNews] = useState([])
  const [trendingNews, setTrendingNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const path = location.pathname
    if (path.includes('/politics')) setActiveCategory('politics')
    else if (path.includes('/economy')) setActiveCategory('economy')
    else if (path.includes('/sports')) setActiveCategory('sports')
    else if (path.includes('/technology')) setActiveCategory('technology')
    else if (path.includes('/health')) setActiveCategory('health')
    else if (path.includes('/culture')) setActiveCategory('culture')
    else if (path.includes('/international')) setActiveCategory('international')
    else if (path.includes('/syrian-affairs')) setActiveCategory('syrian_affairs')
    else setActiveCategory('all')
    
    fetchAllData()
  }, [location.pathname])

  const fetchAllData = async () => {
    try {
      setLoading(true)
      
      const [
        articlesData, breakingData, politicsData, economyData, 
        sportsData, technologyData, healthData, cultureData,
        internationalData, syrianData, trendingData
      ] = await Promise.all([
        NewsAPI.getArticles({ per_page: 6 }),
        NewsAPI.getBreakingNews(),
        NewsAPI.getPoliticsNews({ per_page: 4 }),
        NewsAPI.getEconomyNews({ per_page: 4 }),
        NewsAPI.getSportsNews({ per_page: 4 }),
        NewsAPI.getTechnologyNews({ per_page: 4 }),
        NewsAPI.getHealthNews({ per_page: 4 }),
        NewsAPI.getCultureNews({ per_page: 4 }),
        NewsAPI.getInternationalNews({ per_page: 4 }),
        NewsAPI.getSyrianAffairs({ per_page: 4 }),
        NewsAPI.getTrendingNews()
      ])

      setArticles(articlesData.articles || [])
      setBreakingNews(breakingData || [])
      setPoliticsNews(politicsData.articles || [])
      setEconomyNews(economyData.articles || [])
      setSportsNews(sportsData.articles || [])
      setTechnologyNews(technologyData.articles || [])
      setHealthNews(healthData.articles || [])
      setCultureNews(cultureData.articles || [])
      setInternationalNews(internationalData.articles || [])
      setSyrianNews(syrianData.articles || [])
      setTrendingNews(trendingData || [])
      
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderNewsSection = (title, newsData, icon) => {
    if (!newsData || newsData.length === 0) return null
    
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="ml-3">{icon}</span>
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {newsData.map((article, index) => (
            <article key={index} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow news-card">
              {article.image_url && (
                <img 
                  src={article.image_url} 
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {article.summary}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{article.source}</span>
                  <span>{new Date(article.published_at).toLocaleDateString('ar-SA')}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    )
  }

  const getFilteredContent = () => {
    switch (activeCategory) {
      case 'breaking':
        return renderNewsSection('الأخبار العاجلة', breakingNews, '🚨')
      case 'syrian_affairs':
        return renderNewsSection('الشأن السوري', syrianNews, '🇸🇾')
      case 'politics':
        return renderNewsSection('الأخبار السياسية', politicsNews, '🏛️')
      case 'economy':
        return renderNewsSection('الأخبار الاقتصادية', economyNews, '💰')
      case 'sports':
        return renderNewsSection('الأخبار الرياضية', sportsNews, '⚽')
      case 'technology':
        return renderNewsSection('أخبار التكنولوجيا', technologyNews, '💻')
      case 'health':
        return renderNewsSection('الأخبار الصحية', healthNews, '🏥')
      case 'culture':
        return renderNewsSection('الأخبار الثقافية', cultureNews, '🎭')
      case 'international':
        return renderNewsSection('الأخبار الدولية', internationalNews, '🌍')
      default:
        return (
          <>
            {renderNewsSection('الأخبار الرئيسية', articles, '📰')}
            {renderNewsSection('الشأن السوري', syrianNews, '🇸🇾')}
            {renderNewsSection('الأخبار السياسية', politicsNews, '🏛️')}
            {renderNewsSection('الأخبار الاقتصادية', economyNews, '💰')}
            {renderNewsSection('الأخبار الرياضية', sportsNews, '⚽')}
            {renderNewsSection('أخبار التكنولوجيا', technologyNews, '💻')}
            {renderNewsSection('الأخبار الصحية', healthNews, '🏥')}
            {renderNewsSection('الأخبار الثقافية', cultureNews, '🎭')}
            {renderNewsSection('الأخبار الدولية', internationalNews, '🌍')}
          </>
        )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل الأخبار...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-red-600 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center">
            <span className="bg-white text-red-600 px-2 py-1 rounded text-sm font-bold ml-4">عاجل</span>
            <div className="flex-1 overflow-hidden">
              <div className="ticker-animation whitespace-nowrap">
                {breakingNews.map((news, index) => (
                  <span key={index} className="ml-8">
                    {news.title || 'أحدث الأخبار العاجلة من الشرق الأوسط والعالم'}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">جولان 24</h1>
              <p className="text-gray-600 mt-1">منصة إخبارية متقدمة مدعومة بالذكاء الاصطناعي</p>
            </div>
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString('ar-SA', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      </header>

      <CategoryNavigation 
        activeCategory={activeCategory} 
        onCategoryChange={setActiveCategory} 
      />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 news-grid">
          <div className="lg:col-span-3">
            {getFilteredContent()}
          </div>
          
          <div className="lg:col-span-1">
            <aside className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">الأخبار الرائجة</h3>
              <div className="space-y-4">
                {trendingNews.map((article, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <h4 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                      {article.title}
                    </h4>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{article.views} مشاهدة</span>
                      <span>{new Date(article.published_at).toLocaleDateString('ar-SA')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">جولان 24</h3>
            <p className="text-gray-400 text-sm">
              منصة إخبارية متقدمة مدعومة بالذكاء الاصطناعي
            </p>
            <p className="text-gray-500 text-xs mt-4">
              © 2024 جميع الحقوق محفوظة
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default NewsPortal
