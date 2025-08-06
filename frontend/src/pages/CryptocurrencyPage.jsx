import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, DollarSign, BarChart3, RefreshCw } from 'lucide-react'

const CryptocurrencyPage = () => {
  const [cryptoData, setCryptoData] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    fetchCryptoData()
    const interval = setInterval(fetchCryptoData, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchCryptoData = async () => {
    try {
      const mockData = [
        {
          symbol: 'BTC',
          name: 'Bitcoin',
          price: 45000,
          change24h: 2.5,
          marketCap: 850000000000,
          volume: 25000000000,
          icon: '₿'
        },
        {
          symbol: 'ETH',
          name: 'Ethereum',
          price: 3200,
          change24h: -1.2,
          marketCap: 380000000000,
          volume: 15000000000,
          icon: 'Ξ'
        },
        {
          symbol: 'BNB',
          name: 'Binance Coin',
          price: 320,
          change24h: 3.8,
          marketCap: 50000000000,
          volume: 2000000000,
          icon: 'BNB'
        },
        {
          symbol: 'ADA',
          name: 'Cardano',
          price: 0.45,
          change24h: -0.8,
          marketCap: 15000000000,
          volume: 800000000,
          icon: 'ADA'
        },
        {
          symbol: 'SOL',
          name: 'Solana',
          price: 95,
          change24h: 5.2,
          marketCap: 40000000000,
          volume: 1500000000,
          icon: 'SOL'
        },
        {
          symbol: 'DOT',
          name: 'Polkadot',
          price: 6.8,
          change24h: 1.5,
          marketCap: 8000000000,
          volume: 400000000,
          icon: 'DOT'
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">العملات الرقمية</h1>
          <p className="text-gray-600 mt-1">أسعار العملات الرقمية والتحليلات المالية</p>
        </div>
        <div className="flex items-center space-x-4 space-x-reverse">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cryptoData.map((crypto) => (
          <div key={crypto.symbol} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gold-100 rounded-full flex items-center justify-center text-gold-600 font-bold text-lg mr-3">
                  {crypto.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{crypto.symbol}</h3>
                  <p className="text-sm text-gray-600">{crypto.name}</p>
                </div>
              </div>
              <BarChart3 className="w-6 h-6 text-primary-500" />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">
                  ${crypto.price.toLocaleString()}
                </span>
                <div className={`flex items-center ${crypto.change24h >= 0 ? 'text-primary-600' : 'text-red-600'}`}>
                  {crypto.change24h >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                  <span className="text-sm font-medium">
                    {crypto.change24h >= 0 ? '+' : ''}{crypto.change24h}%
                  </span>
                </div>
              </div>
              
              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">القيمة السوقية:</span>
                  <span className="font-medium">${formatNumber(crypto.marketCap)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">الحجم 24س:</span>
                  <span className="font-medium">${formatNumber(crypto.volume)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">أخبار العملات الرقمية</h2>
        <div className="space-y-4">
          <div className="border-b pb-4">
            <h3 className="font-medium text-gray-900 mb-2">البيتكوين يحقق مكاسب قوية وسط تفاؤل المستثمرين</h3>
            <p className="text-sm text-gray-600 mb-2">
              شهدت عملة البيتكوين ارتفاعاً ملحوظاً خلال الـ 24 ساعة الماضية، مدفوعة بتحسن المعنويات في السوق...
            </p>
            <span className="text-xs text-gray-500">منذ ساعتين</span>
          </div>
          <div className="border-b pb-4">
            <h3 className="font-medium text-gray-900 mb-2">الإيثيريوم تواجه ضغوطاً بيعية قصيرة المدى</h3>
            <p className="text-sm text-gray-600 mb-2">
              تراجعت عملة الإيثيريوم بنسبة طفيفة اليوم وسط عمليات جني أرباح من المستثمرين...
            </p>
            <span className="text-xs text-gray-500">منذ 4 ساعات</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CryptocurrencyPage
