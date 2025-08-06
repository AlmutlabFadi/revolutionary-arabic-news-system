import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, DollarSign, BarChart3, RefreshCw, Bitcoin, Coins, Activity, MessageSquare, Share2, Heart } from 'lucide-react'

const CryptocurrencyPage = () => {
  const [cryptoData, setCryptoData] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h')
  const [showComments, setShowComments] = useState({})

  useEffect(() => {
    fetchCryptoData()
    const interval = setInterval(fetchCryptoData, 30000)
    return () => clearInterval(interval)
  }, [selectedTimeframe])

  const fetchCryptoData = async () => {
    try {
      const mockData = [
        {
          id: 'bitcoin',
          symbol: 'BTC',
          name: 'Bitcoin',
          price: 45000,
          change24h: 2.5,
          changePercent24h: 2.5,
          marketCap: 850000000000,
          volume: 25000000000,
          rank: 1,
          icon: '₿',
          comments: 156,
          likes: 892
        },
        {
          id: 'ethereum',
          symbol: 'ETH',
          name: 'Ethereum',
          price: 3200,
          change24h: -1.2,
          changePercent24h: -1.2,
          marketCap: 380000000000,
          volume: 15000000000,
          rank: 2,
          icon: 'Ξ',
          comments: 98,
          likes: 654
        },
        {
          id: 'binancecoin',
          symbol: 'BNB',
          name: 'BNB',
          price: 320,
          change24h: 3.8,
          changePercent24h: 3.8,
          marketCap: 50000000000,
          volume: 2000000000,
          rank: 3,
          icon: '🔶',
          comments: 45,
          likes: 321
        },
        {
          id: 'cardano',
          symbol: 'ADA',
          name: 'Cardano',
          price: 0.45,
          change24h: -2.1,
          changePercent24h: -2.1,
          marketCap: 15000000000,
          volume: 800000000,
          rank: 4,
          icon: '🔷',
          comments: 67,
          likes: 234
        },
        {
          id: 'solana',
          symbol: 'SOL',
          name: 'Solana',
          price: 95,
          change24h: 5.2,
          changePercent24h: 5.2,
          marketCap: 40000000000,
          volume: 1500000000,
          rank: 5,
          icon: '🌞',
          comments: 89,
          likes: 567
        },
        {
          id: 'polkadot',
          symbol: 'DOT',
          name: 'Polkadot',
          price: 6.8,
          change24h: 1.8,
          changePercent24h: 1.8,
          marketCap: 8000000000,
          volume: 400000000,
          rank: 6,
          icon: '🔴',
          comments: 34,
          likes: 189
        }
      ]
      setCryptoData(mockData)
      setLastUpdate(new Date())
      setLoading(false)
    } catch (error) {
      console.error('Error fetching crypto data:', error)
      setLoading(false)
    }
  }

  const formatNumber = (num) => {
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B'
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M'
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K'
    return num.toFixed(2)
  }

  const formatPrice = (price) => {
    if (price < 1) return `$${price.toFixed(4)}`
    return `$${price.toLocaleString()}`
  }

  const formatMarketCap = (marketCap) => {
    if (marketCap >= 1000000000000) {
      return `$${(marketCap / 1000000000000).toFixed(1)}T`
    } else if (marketCap >= 1000000000) {
      return `$${(marketCap / 1000000000).toFixed(1)}B`
    } else if (marketCap >= 1000000) {
      return `$${(marketCap / 1000000).toFixed(1)}M`
    }
    return `$${marketCap.toLocaleString()}`
  }

  const toggleComments = (cryptoId) => {
    setShowComments(prev => ({
      ...prev,
      [cryptoId]: !prev[cryptoId]
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">العملات الرقمية</h1>
          <p className="text-gray-600 mt-1">أسعار العملات الرقمية والتحليلات المالية المباشرة</p>
        </div>
        <div className="flex items-center space-x-4 space-x-reverse">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="input-field w-auto"
          >
            <option value="1h">ساعة واحدة</option>
            <option value="24h">24 ساعة</option>
            <option value="7d">7 أيام</option>
            <option value="30d">30 يوم</option>
          </select>
          <span className="text-sm text-gray-500">
            آخر تحديث: {lastUpdate.toLocaleTimeString('ar-SA')}
          </span>
          <button
            onClick={fetchCryptoData}
            className="btn-primary flex items-center"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ml-2 ${loading ? 'animate-spin' : ''}`} />
            تحديث
          </button>
        </div>
      </div>

      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي القيمة السوقية</p>
              <p className="text-2xl font-bold text-primary-600">$1.8T</p>
            </div>
            <BarChart3 className="w-8 h-8 text-primary-600" />
          </div>
          <div className="flex items-center text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">+2.4%</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-600">حجم التداول 24س</p>
              <p className="text-2xl font-bold text-gold-600">$85B</p>
            </div>
            <Activity className="w-8 h-8 text-gold-600" />
          </div>
          <div className="flex items-center text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">+12.8%</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-600">هيمنة البيتكوين</p>
              <p className="text-2xl font-bold text-orange-600">47.2%</p>
            </div>
            <Bitcoin className="w-8 h-8 text-orange-600" />
          </div>
          <div className="flex items-center text-red-600">
            <TrendingDown className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">-0.8%</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-600">العملات النشطة</p>
              <p className="text-2xl font-bold text-purple-600">2,847</p>
            </div>
            <Coins className="w-8 h-8 text-purple-600" />
          </div>
          <div className="flex items-center text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span className="text-sm">+15</span>
          </div>
        </div>
      </div>

      {/* Cryptocurrency Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">أفضل العملات الرقمية</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الترتيب
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  العملة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  السعر
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  التغيير 24س
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  القيمة السوقية
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحجم 24س
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  التفاعل
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cryptoData.map((crypto) => (
                <React.Fragment key={crypto.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {crypto.rank}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-lg">
                            {crypto.icon}
                          </div>
                        </div>
                        <div className="mr-4">
                          <div className="text-sm font-medium text-gray-900">{crypto.name}</div>
                          <div className="text-sm text-gray-500">{crypto.symbol}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatPrice(crypto.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center ${crypto.changePercent24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {crypto.changePercent24h >= 0 ? 
                          <TrendingUp className="w-4 h-4 mr-1" /> : 
                          <TrendingDown className="w-4 h-4 mr-1" />
                        }
                        <span className="text-sm font-medium">
                          {crypto.changePercent24h >= 0 ? '+' : ''}{crypto.changePercent24h.toFixed(2)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatMarketCap(crypto.marketCap)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatMarketCap(crypto.volume)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <button 
                          onClick={() => toggleComments(crypto.id)}
                          className="flex items-center text-gray-500 hover:text-primary-600"
                        >
                          <MessageSquare className="w-4 h-4 mr-1" />
                          <span className="text-sm">{crypto.comments}</span>
                        </button>
                        <button className="flex items-center text-gray-500 hover:text-red-600">
                          <Heart className="w-4 h-4 mr-1" />
                          <span className="text-sm">{crypto.likes}</span>
                        </button>
                        <button className="flex items-center text-gray-500 hover:text-blue-600">
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {showComments[crypto.id] && (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 bg-gray-50">
                        <div className="space-y-3">
                          <div className="text-sm font-medium text-gray-900">التعليقات على {crypto.name}</div>
                          <div className="space-y-2">
                            <div className="bg-white p-3 rounded-lg">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-gray-900">أحمد محمد</span>
                                <span className="text-xs text-gray-500">منذ ساعتين</span>
                              </div>
                              <p className="text-sm text-gray-700">توقعات إيجابية لهذه العملة في الأسابيع القادمة</p>
                            </div>
                            <div className="bg-white p-3 rounded-lg">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-gray-900">سارة أحمد</span>
                                <span className="text-xs text-gray-500">منذ 4 ساعات</span>
                              </div>
                              <p className="text-sm text-gray-700">تحليل ممتاز، شكراً لكم على التغطية المستمرة</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <input
                              type="text"
                              placeholder="اكتب تعليقك..."
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                            <button className="btn-primary text-sm">إرسال</button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* News Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">أخبار العملات الرقمية</h2>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                البيتكوين يتجاوز 45,000 دولار وسط تفاؤل المستثمرين
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                شهدت عملة البيتكوين ارتفاعاً ملحوظاً خلال الـ 24 ساعة الماضية، مما يعكس تجدد الثقة في السوق وتوقعات إيجابية من المحللين حول مستقبل العملات الرقمية...
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-xs text-gray-500">
                  <span>منذ ساعتين</span>
                  <span className="mx-2">•</span>
                  <span>جولان 24</span>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <button className="flex items-center text-gray-500 hover:text-primary-600">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    <span className="text-sm">24</span>
                  </button>
                  <button className="flex items-center text-gray-500 hover:text-red-600">
                    <Heart className="w-4 h-4 mr-1" />
                    <span className="text-sm">156</span>
                  </button>
                  <button className="flex items-center text-gray-500 hover:text-blue-600">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                الإيثيريوم يستعد لتحديث جديد يعزز من كفاءة الشبكة
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                أعلن مطورو الإيثيريوم عن تحديث قادم من شأنه تحسين سرعة المعاملات وتقليل الرسوم، مما يعزز من قدرة الشبكة على المنافسة...
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-xs text-gray-500">
                  <span>منذ 4 ساعات</span>
                  <span className="mx-2">•</span>
                  <span>جولان 24</span>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <button className="flex items-center text-gray-500 hover:text-primary-600">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    <span className="text-sm">18</span>
                  </button>
                  <button className="flex items-center text-gray-500 hover:text-red-600">
                    <Heart className="w-4 h-4 mr-1" />
                    <span className="text-sm">89</span>
                  </button>
                  <button className="flex items-center text-gray-500 hover:text-blue-600">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                تحليل: العملات البديلة تشهد نمواً متسارعاً
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                تشهد العملات البديلة نمواً ملحوظاً مع تزايد الاهتمام المؤسسي والتطورات التقنية الجديدة في مجال البلوك تشين...
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-xs text-gray-500">
                  <span>منذ 6 ساعات</span>
                  <span className="mx-2">•</span>
                  <span>جولان 24</span>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <button className="flex items-center text-gray-500 hover:text-primary-600">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    <span className="text-sm">31</span>
                  </button>
                  <button className="flex items-center text-gray-500 hover:text-red-600">
                    <Heart className="w-4 h-4 mr-1" />
                    <span className="text-sm">203</span>
                  </button>
                  <button className="flex items-center text-gray-500 hover:text-blue-600">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CryptocurrencyPage
