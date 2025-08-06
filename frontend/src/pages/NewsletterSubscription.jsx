import React, { useState } from 'react'
import { Mail, Check, AlertCircle, Bell, Globe, Zap } from 'lucide-react'

const NewsletterSubscription = () => {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [selectedCategories, setSelectedCategories] = useState([])
  const [frequency, setFrequency] = useState('daily')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const categories = [
    { id: 'politics', name: 'السياسة', icon: Globe },
    { id: 'economy', name: 'الاقتصاد', icon: Zap },
    { id: 'sports', name: 'الرياضة', icon: Bell },
    { id: 'technology', name: 'التكنولوجيا', icon: Zap },
    { id: 'health', name: 'الصحة', icon: Bell },
    { id: 'culture', name: 'الثقافة', icon: Globe },
    { id: 'international', name: 'دولي', icon: Globe },
    { id: 'syrian_affairs', name: 'الشأن السوري', icon: Globe },
    { id: 'cryptocurrency', name: 'العملات الرقمية', icon: Zap },
    { id: 'stock_market', name: 'الأسواق المالية', icon: Zap }
  ]

  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setIsSubscribed(true)
    } catch (error) {
      console.error('Subscription error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubscribed) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">تم الاشتراك بنجاح!</h2>
          <p className="text-gray-600 mb-6">
            شكراً لك على الاشتراك في نشرة جولان 24 الإخبارية. ستصلك أحدث الأخبار على بريدك الإلكتروني.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">
              <strong>البريد الإلكتروني:</strong> {email}
            </p>
            <p className="text-sm text-green-800 mt-1">
              <strong>الفئات المختارة:</strong> {selectedCategories.length} فئة
            </p>
            <p className="text-sm text-green-800 mt-1">
              <strong>تكرار الإرسال:</strong> {frequency === 'daily' ? 'يومي' : frequency === 'weekly' ? 'أسبوعي' : 'فوري'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-primary-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">اشترك في النشرة الإخبارية</h1>
        <p className="text-lg text-gray-600">
          احصل على أحدث الأخبار والتحليلات من جولان 24 مباشرة في بريدك الإلكتروني
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الاسم الكامل
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              اختر الفئات التي تهمك
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map((category) => {
                const Icon = category.icon
                const isSelected = selectedCategories.includes(category.id)
                
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleCategoryToggle(category.id)}
                    className={`flex items-center p-3 rounded-lg border transition-colors ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 ml-2" />
                    <span className="text-sm font-medium">{category.name}</span>
                    {isSelected && <Check className="w-4 h-4 mr-auto text-primary-600" />}
                  </button>
                )
              })}
            </div>
            {selectedCategories.length === 0 && (
              <p className="text-sm text-red-600 mt-2 flex items-center">
                <AlertCircle className="w-4 h-4 ml-1" />
                يرجى اختيار فئة واحدة على الأقل
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تكرار الإرسال
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="instant">فوري - عند نشر أخبار مهمة</option>
              <option value="daily">يومي - ملخص يومي</option>
              <option value="weekly">أسبوعي - ملخص أسبوعي</option>
            </select>
          </div>

          <div className="bg-gold-50 border border-gold-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gold-800 mb-2">مميزات الاشتراك:</h3>
            <ul className="text-sm text-gold-700 space-y-1">
              <li>• أحدث الأخبار من مصادر موثوقة</li>
              <li>• تحليلات متخصصة من خبراء</li>
              <li>• تنبيهات فورية للأخبار العاجلة</li>
              <li>• محتوى حصري للمشتركين</li>
              <li>• إمكانية إلغاء الاشتراك في أي وقت</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={isLoading || selectedCategories.length === 0}
            className="w-full flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                جاري الاشتراك...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 ml-2" />
                اشترك الآن
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default NewsletterSubscription
