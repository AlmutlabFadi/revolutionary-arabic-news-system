import React from 'react'

const CategoryNavigation = ({ activeCategory, onCategoryChange }) => {
  const categories = [
    { id: 'all', label: 'جميع الأخبار', icon: '📰' },
    { id: 'breaking', label: 'أخبار عاجلة', icon: '🚨' },
    { id: 'syrian_affairs', label: 'الشأن السوري', icon: '🇸🇾' },
    { id: 'politics', label: 'سياسة', icon: '🏛️' },
    { id: 'economy', label: 'اقتصاد', icon: '💰' },
    { id: 'sports', label: 'رياضة', icon: '⚽' },
    { id: 'technology', label: 'تكنولوجيا', icon: '💻' },
    { id: 'health', label: 'صحة', icon: '🏥' },
    { id: 'culture', label: 'ثقافة', icon: '🎭' },
    { id: 'international', label: 'دولي', icon: '🌍' }
  ]

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex overflow-x-auto scrollbar-hide py-4 space-x-2 space-x-reverse">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`
                flex items-center px-4 py-2 rounded-full whitespace-nowrap transition-colors
                ${activeCategory === category.id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              <span className="ml-2">{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CategoryNavigation
