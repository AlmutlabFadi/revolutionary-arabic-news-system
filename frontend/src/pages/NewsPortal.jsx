import React, { useState, useEffect } from 'react'
import NewsAPI from '../services/api'

const NewsPortal = () => {
  const [articles, setArticles] = useState([])
  const [breakingNews, setBreakingNews] = useState([])
  const [syrianNews, setSyrianNews] = useState([])
  const [trendingNews, setTrendingNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        const [articlesData, breakingData, syrianData, trendingData] = await Promise.all([
          NewsAPI.getArticles({ per_page: 6 }),
          NewsAPI.getBreakingNews(),
          NewsAPI.getSyrianAffairs({ per_page: 4 }),
          NewsAPI.getTrendingNews()
        ])

        setArticles(articlesData.articles || [])
        setBreakingNews(breakingData || [])
        setSyrianNews(syrianData.articles || [])
        setTrendingNews(trendingData || [])
        
      } catch (error) {
        console.error('Error fetching data:', error)
        setArticles([])
        setBreakingNews([])
        setSyrianNews([])
        setTrendingNews([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

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
              <h1 className="text-3xl font-bold text-gray-900">أخبار الشام</h1>
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

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">الأخبار الرئيسية</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles.map((article, index) => (
                  <article key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
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

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">الشأن السوري</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {syrianNews.map((article, index) => (
                  <article key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
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
          </div>
          
          <div className="lg:col-span-1">
            <aside className="bg-white rounded-lg shadow-sm p-6">
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
            <h3 className="text-xl font-bold mb-2">أخبار الشام</h3>
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
