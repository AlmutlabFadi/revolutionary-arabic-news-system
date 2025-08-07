import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye, BarChart3, Calendar, DollarSign, Clock, Settings, Upload, Play, Pause, SkipForward } from 'lucide-react'

const AdvertisingManager = () => {
  const [ads, setAds] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingAd, setEditingAd] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image_url: '',
    link_url: '',
    position: 'sidebar',
    start_date: '',
    end_date: '',
    is_active: true,
    ad_type: 'image',
    frequency: 'daily',
    times_per_day: 3,
    duration_seconds: 30,
    show_between_bulletins: false,
    video_url: '',
    image_width: 728,
    image_height: 90,
    allow_skip: true,
    skip_after_seconds: 5,
    target_hours: [],
    advertiser_name: '',
    advertiser_contact: '',
    budget_daily: 0,
    budget_total: 0
  })

  useEffect(() => {
    fetchAds()
  }, [])

  const fetchAds = () => {
    const mockAds = [
      {
        id: 1,
        title: 'إعلان شركة التكنولوجيا',
        description: 'إعلان لشركة تكنولوجيا رائدة',
        advertiserName: 'شركة التكنولوجيا المتقدمة',
        advertiserContact: 'contact@techcompany.com',
        adType: 'banner',
        imageUrl: '/images/ads/tech-company.jpg',
        clickUrl: 'https://techcompany.com',
        imageWidth: 728,
        imageHeight: 90,
        frequency: 'daily',
        timesPerDay: 3,
        durationSeconds: 30,
        showBetweenBulletins: true,
        targetAudience: 'المهتمون بالتكنولوجيا',
        targetTimeSlots: ['09:00', '14:00', '20:00'],
        start_date: '2024-01-01',
        end_date: '2024-02-01',
        specificHours: [9, 14, 20],
        dailyBudget: 100,
        totalBudget: 3000,
        impressions: 15420,
        clicks: 234,
        conversions: 12,
        priority: 5,
        status: 'active',
        click_count: 234,
        impression_count: 15420
      },
      {
        id: 2,
        title: 'إعلان مطعم الشام',
        description: 'إعلان لمطعم شامي أصيل',
        advertiserName: 'مطعم الشام الأصيل',
        advertiserContact: 'info@shamrestaurant.com',
        adType: 'video',
        videoUrl: '/videos/ads/restaurant.mp4',
        clickUrl: 'https://shamrestaurant.com',
        videoDuration: 45,
        minVideoDuration: 5,
        maxVideoDuration: 60,
        allowSkip: true,
        skipAfterSeconds: 5,
        frequency: 'hourly',
        timesPerDay: 12,
        durationSeconds: 45,
        showBetweenBulletins: false,
        targetAudience: 'محبو الطعام الشامي',
        targetTimeSlots: ['12:00', '18:00', '21:00'],
        start_date: '2024-01-15',
        end_date: '2024-03-15',
        specificHours: [12, 18, 21],
        dailyBudget: 75,
        totalBudget: 4500,
        impressions: 8930,
        clicks: 156,
        conversions: 23,
        totalDurationWatched: 3420,
        skipRate: 15.2,
        priority: 8,
        status: 'active',
        click_count: 156,
        impression_count: 8930
      },
      {
        id: 3,
        title: 'إعلان متحرك - بنك الاستثمار',
        description: 'إعلان متحرك لبنك الاستثمار',
        advertiserName: 'بنك الاستثمار الوطني',
        advertiserContact: 'marketing@investbank.com',
        adType: 'animated',
        imageUrl: '/images/ads/bank-animated.gif',
        clickUrl: 'https://investbank.com',
        imageWidth: 300,
        imageHeight: 250,
        frequency: 'custom',
        timesPerDay: 3,
        durationSeconds: 20,
        showBetweenBulletins: true,
        targetAudience: 'المستثمرون والمهتمون بالمال',
        targetTimeSlots: ['10:00', '15:00', '19:00'],
        start_date: '2024-02-01',
        end_date: '2024-04-01',
        specificHours: [10, 15, 19],
        dailyBudget: 150,
        totalBudget: 9000,
        impressions: 25680,
        clicks: 412,
        conversions: 34,
        priority: 9,
        status: 'active',
        click_count: 412,
        impression_count: 25680
      }
    ]
    setAds(mockAds)
  }

  const handleSave = async () => {
    try {
      const formDataToSend = new FormData()
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          formDataToSend.append(key, formData[key])
        }
      })
      
      const response = await fetch('/api/advertising', {
        method: editingAd ? 'PUT' : 'POST',
        body: formDataToSend
      })
      
      if (response.ok) {
        const newAd = await response.json()
        if (editingAd) {
          setAds(ads.map(ad => ad.id === editingAd.id ? newAd : ad))
        } else {
          setAds([newAd, ...ads])
        }
        setShowModal(false)
        alert('تم حفظ الإعلان بنجاح!')
      } else {
        throw new Error('فشل في حفظ الإعلان')
      }
    } catch (error) {
      console.error('Error saving ad:', error)
      if (editingAd) {
        setAds(ads.map(ad => ad.id === editingAd.id ? { ...ad, ...formData } : ad))
      } else {
        const newAd = {
          id: Date.now(),
          ...formData,
          click_count: 0,
          impression_count: 0
        }
        setAds([...ads, newAd])
      }
      setShowModal(false)
      alert('تم حفظ الإعلان بنجاح!')
    }
    
    setEditingAd(null)
    setFormData({
      title: '',
      content: '',
      image_url: '',
      link_url: '',
      position: 'sidebar',
      start_date: '',
      end_date: '',
      is_active: true,
      ad_type: 'image',
      frequency: 'daily',
      times_per_day: 3,
      duration_seconds: 30,
      show_between_bulletins: false,
      video_url: '',
      image_width: 728,
      image_height: 90,
      allow_skip: true,
      skip_after_seconds: 5,
      target_hours: [],
      advertiser_name: '',
      advertiser_contact: '',
      budget_daily: 0,
      budget_total: 0
    })
  }

  const handleEdit = (ad) => {
    setEditingAd(ad)
    setFormData(ad)
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الإعلان؟')) {
      setAds(ads.filter(ad => ad.id !== id))
    }
  }

  const getPositionLabel = (position) => {
    const positions = {
      header: 'الرأس',
      sidebar: 'الشريط الجانبي',
      article_top: 'أعلى المقال',
      article_bottom: 'أسفل المقال',
      popup: 'نافذة منبثقة'
    }
    return positions[position] || position
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة الإعلانات</h1>
          <p className="text-gray-600 mt-1">إدارة الإعلانات والحملات الترويجية</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="w-4 h-4 ml-2" />
          إضافة إعلان
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">إجمالي الإعلانات</h3>
            <BarChart3 className="w-6 h-6 text-primary-600" />
          </div>
          <div className="text-3xl font-bold text-primary-600 mb-2">{ads.length}</div>
          <p className="text-sm text-gray-600">إعلان مسجل</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">الإعلانات النشطة</h3>
            <Eye className="w-6 h-6 text-gold-600" />
          </div>
          <div className="text-3xl font-bold text-gold-600 mb-2">
            {ads.filter(ad => ad.is_active).length}
          </div>
          <p className="text-sm text-gray-600">إعلان نشط</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">إجمالي النقرات</h3>
            <DollarSign className="w-6 h-6 text-accent-red" />
          </div>
          <div className="text-3xl font-bold text-accent-red mb-2">
            {ads.reduce((sum, ad) => sum + ad.click_count, 0).toLocaleString()}
          </div>
          <p className="text-sm text-gray-600">نقرة</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">إجمالي المشاهدات</h3>
            <Calendar className="w-6 h-6 text-gray-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {ads.reduce((sum, ad) => sum + ad.impression_count, 0).toLocaleString()}
          </div>
          <p className="text-sm text-gray-600">مشاهدة</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">قائمة الإعلانات</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">العنوان</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الموقع</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">تاريخ البداية</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">تاريخ النهاية</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">النقرات</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المشاهدات</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الحالة</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ads.map((ad) => (
                <tr key={ad.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{ad.title}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{getPositionLabel(ad.position)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{ad.start_date}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{ad.end_date}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{ad.click_count.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{ad.impression_count.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      ad.is_active ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {ad.is_active ? 'نشط' : 'غير نشط'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2 space-x-reverse">
                      <button
                        onClick={() => handleEdit(ad)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(ad.id)}
                        className="text-red-600 hover:text-red-900"
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
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {editingAd ? 'تعديل الإعلان' : 'إضافة إعلان جديد'}
            </h3>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">عنوان الإعلان</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">اسم المعلن</label>
                <input
                  type="text"
                  value={formData.advertiser_name}
                  onChange={(e) => setFormData({...formData, advertiser_name: e.target.value})}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">تواصل المعلن</label>
                <input
                  type="text"
                  value={formData.advertiser_contact}
                  onChange={(e) => setFormData({...formData, advertiser_contact: e.target.value})}
                  className="input-field"
                  placeholder="البريد الإلكتروني أو رقم الهاتف"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">نوع الإعلان</label>
                <select
                  value={formData.ad_type}
                  onChange={(e) => setFormData({...formData, ad_type: e.target.value})}
                  className="input-field"
                >
                  <option value="image">صورة</option>
                  <option value="video">فيديو</option>
                  <option value="banner">بانر متحرك</option>
                  <option value="popup">نافذة منبثقة</option>
                </select>
              </div>

              {formData.ad_type === 'image' && (
                <div className="space-y-3 p-3 bg-blue-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">رابط الصورة</label>
                    <input
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">العرض (بكسل)</label>
                      <input
                        type="number"
                        value={formData.image_width}
                        onChange={(e) => setFormData({...formData, image_width: parseInt(e.target.value)})}
                        className="input-field"
                        min="50"
                        max="1920"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">الارتفاع (بكسل)</label>
                      <input
                        type="number"
                        value={formData.image_height}
                        onChange={(e) => setFormData({...formData, image_height: parseInt(e.target.value)})}
                        className="input-field"
                        min="50"
                        max="1080"
                      />
                    </div>
                  </div>
                </div>
              )}

              {formData.ad_type === 'video' && (
                <div className="space-y-3 p-3 bg-red-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">رابط الفيديو</label>
                    <input
                      type="url"
                      value={formData.video_url}
                      onChange={(e) => setFormData({...formData, video_url: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">مدة الفيديو (ثانية)</label>
                      <input
                        type="number"
                        value={formData.duration_seconds}
                        onChange={(e) => setFormData({...formData, duration_seconds: parseInt(e.target.value)})}
                        className="input-field"
                        min="5"
                        max="300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">السماح بالتخطي بعد (ثانية)</label>
                      <input
                        type="number"
                        value={formData.skip_after_seconds}
                        onChange={(e) => setFormData({...formData, skip_after_seconds: parseInt(e.target.value)})}
                        className="input-field"
                        min="3"
                        max="30"
                      />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="allow_skip"
                      checked={formData.allow_skip}
                      onChange={(e) => setFormData({...formData, allow_skip: e.target.checked})}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="allow_skip" className="mr-2 text-sm text-gray-700">السماح بتخطي الإعلان</label>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">رابط المعلن</label>
                <input
                  type="url"
                  value={formData.link_url}
                  onChange={(e) => setFormData({...formData, link_url: e.target.value})}
                  className="input-field"
                  placeholder="الرابط الذي سيتم الانتقال إليه عند النقر"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">موقع الإعلان</label>
                <select
                  value={formData.position}
                  onChange={(e) => setFormData({...formData, position: e.target.value})}
                  className="input-field"
                >
                  <option value="header">الرأس</option>
                  <option value="sidebar">الشريط الجانبي</option>
                  <option value="article_top">أعلى المقال</option>
                  <option value="article_bottom">أسفل المقال</option>
                  <option value="popup">نافذة منبثقة</option>
                  <option value="between_bulletins">بين النشرات</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">تكرار الإعلان</label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                  className="input-field"
                >
                  <option value="hourly">كل ساعة</option>
                  <option value="daily">يومياً</option>
                  <option value="custom">مخصص</option>
                </select>
              </div>

              {formData.frequency === 'daily' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">عدد مرات الظهور يومياً</label>
                  <input
                    type="number"
                    value={formData.times_per_day}
                    onChange={(e) => setFormData({...formData, times_per_day: parseInt(e.target.value)})}
                    className="input-field"
                    min="1"
                    max="24"
                  />
                </div>
              )}

              {formData.frequency === 'custom' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الساعات المحددة (اختر عدة ساعات)</label>
                  <div className="grid grid-cols-6 gap-2 mt-2">
                    {Array.from({length: 24}, (_, i) => (
                      <label key={i} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.target_hours.includes(i)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({...formData, target_hours: [...formData.target_hours, i]})
                            } else {
                              setFormData({...formData, target_hours: formData.target_hours.filter(h => h !== i)})
                            }
                          }}
                          className="h-3 w-3 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="mr-1 text-xs">{i}:00</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="show_between_bulletins"
                  checked={formData.show_between_bulletins}
                  onChange={(e) => setFormData({...formData, show_between_bulletins: e.target.checked})}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="show_between_bulletins" className="mr-2 text-sm text-gray-700">عرض بين النشرات الإخبارية</label>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ البداية</label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ النهاية</label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الميزانية اليومية ($)</label>
                  <input
                    type="number"
                    value={formData.budget_daily}
                    onChange={(e) => setFormData({...formData, budget_daily: parseFloat(e.target.value)})}
                    className="input-field"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">إجمالي الميزانية ($)</label>
                  <input
                    type="number"
                    value={formData.budget_total}
                    onChange={(e) => setFormData({...formData, budget_total: parseFloat(e.target.value)})}
                    className="input-field"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="is_active" className="mr-2 text-sm text-gray-700">إعلان نشط</label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 space-x-reverse mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                إلغاء
              </button>
              <button
                onClick={handleSave}
                className="btn-primary"
              >
                حفظ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdvertisingManager
