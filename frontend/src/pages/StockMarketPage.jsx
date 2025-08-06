import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, BarChart3, Globe, RefreshCw } from 'lucide-react'

const StockMarketPage = () => {
  const [stockData, setStockData] = useState([])
  const [indices, setIndices] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMarket, setSelectedMarket] = useState('all')

  useEffect(() => {
    fetchStockData()
    const interval = setInterval(fetchStockData, 60000)
    return () => clearInterval(interval)
  }, [])

  const fetchStockData = async () => {
    try {
      const mockIndices = [
        { name: 'مؤشر دمشق للأوراق المالية', value: 1250, change: 2.3, market: 'syria' },
        { name: 'S&P 500', value: 4180, change: 0.8, market: 'us' },
        { name: 'NASDAQ', value: 12850, change: 1.2, market: 'us' },
        { name: 'FTSE 100', value: 7420, change: -0.3, market: 'uk' },
        { name: 'DAX', value: 15680, change: 0.5, market: 'germany' },
        { name: 'Nikkei 225', value: 28450, change: -0.7, market: 'japan' }
      ]

      const mockStocks = [
        { symbol: 'AAPL', name: 'Apple Inc.', price: 175.50, change: 1.8, volume: 45000000, market: 'us' },
        { symbol: 'MSFT', name: 'Microsoft Corp.', price: 285.20, change: 0.9, volume: 32000000, market: 'us' },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 2650.00, change: -0.5, volume: 28000000, market: 'us' },
        { symbol: 'TSLA', name: 'Tesla Inc.', price: 220.80, change: 3.2, volume: 55000000, market: 'us' },
        { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 420.15, change: 2.1, volume: 38000000, market: 'us' },
        { symbol: 'SYR-BANK', name: 'بنك سوريا الدولي الإسلامي', price: 125.50, change: 1.5, volume: 150000, market: 'syria' }
      ]

      setIndices(mockIndices)
      setStockData(mockStocks)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching stock data:', error)
      setLoading(false)
    }
  }

  const filteredStocks = selectedMarket === 'all' 
    ? stockData 
    : stockData.filter(stock => stock.market === selectedMarket)

  const formatNumber = (num) => {
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M'
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K'
    return num.toFixed(2)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الأسواق المالية</h1>
          <p className="text-gray-600 mt-1">أسعار الأسهم والمؤشرات العالمية</p>
        </div>
        <div className="flex items-center space-x-4 space-x-reverse">
          <select
            value={selectedMarket}
            onChange={(e) => setSelectedMarket(e.target.value)}
            className="input-field w-auto"
          >
            <option value="all">جميع الأسواق</option>
            <option value="syria">السوق السوري</option>
            <option value="us">السوق الأمريكي</option>
            <option value="uk">السوق البريطاني</option>
            <option value="germany">السوق الألماني</option>
            <option value="japan">السوق الياباني</option>
          </select>
          <button
            onClick={fetchStockData}
            className="btn-primary flex items-center"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ml-2 ${loading ? 'animate-spin' : ''}`} />
            تحديث
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {indices.map((index, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 text-sm">{index.name}</h3>
                <div className="flex items-center mt-1">
                  <span className="text-lg font-bold text-gray-900">{index.value.toLocaleString()}</span>
                  <div className={`flex items-center mr-2 ${index.change >= 0 ? 'text-primary-600' : 'text-red-600'}`}>
                    {index.change >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    <span className="text-xs font-medium">
                      {index.change >= 0 ? '+' : ''}{index.change}%
                    </span>
                  </div>
                </div>
              </div>
              <Globe className="w-5 h-5 text-gold-500" />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">الأسهم المتداولة</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الرمز</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الشركة</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">السعر</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">التغيير</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الحجم</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">السوق</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStocks.map((stock) => (
                <tr key={stock.symbol} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{stock.symbol}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{stock.name}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">${stock.price}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`flex items-center ${stock.change >= 0 ? 'text-primary-600' : 'text-red-600'}`}>
                      {stock.change >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                      <span className="text-sm font-medium">
                        {stock.change >= 0 ? '+' : ''}{stock.change}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-500">{formatNumber(stock.volume)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                      {stock.market === 'syria' ? 'سوريا' : 
                       stock.market === 'us' ? 'أمريكا' :
                       stock.market === 'uk' ? 'بريطانيا' :
                       stock.market === 'germany' ? 'ألمانيا' :
                       stock.market === 'japan' ? 'اليابان' : stock.market}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default StockMarketPage
