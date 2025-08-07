import React, { useState, useEffect } from 'react'
import { Users, TrendingUp, MessageSquare, AlertTriangle, Target, BarChart3, Settings } from 'lucide-react'

const PublicOpinionControl = () => {
  const [campaigns, setCampaigns] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newCampaign, setNewCampaign] = useState({
    title: '',
    target_audience: '',
    message: '',
    channels: [],
    duration: 7
  })

  useEffect(() => {
    checkAdminPermissions()
    fetchCampaigns()
  }, [])

  const checkAdminPermissions = () => {
    const userRole = localStorage.getItem('userRole') || 'admin'
    const isAdminUser = userRole === 'admin' || userRole === 'manager' || userRole === 'super_admin'
    setIsAdmin(isAdminUser)
    
    if (!localStorage.getItem('userRole')) {
      localStorage.setItem('userRole', 'admin')
    }
  }

  const fetchCampaigns = () => {
    const mockCampaigns = [
      {
        id: 1,
        title: 'تعزيز الثقة في الاقتصاد المحلي',
        target_audience: 'الشباب والمهنيين',
        status: 'active',
        reach: 25000,
        engagement: 78,
        created_at: '2024-08-01'
      },
      {
        id: 2,
        title: 'دعم المبادرات التكنولوجية',
        target_audience: 'قطاع التكنولوجيا',
        status: 'paused',
        reach: 15000,
        engagement: 65,
        created_at: '2024-07-28'
      }
    ]
    setCampaigns(mockCampaigns)
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">غير مصرح</h2>
          <p className="text-gray-600">هذا القسم متاح للمديرين فقط</p>
        </div>
      </div>
    )
  }

  const handleCreateCampaign = () => {
    const campaign = {
      id: Date.now(),
      ...newCampaign,
      status: 'active',
      reach: 0,
      engagement: 0,
      created_at: new Date().toISOString().split('T')[0]
    }
    setCampaigns([...campaigns, campaign])
    setNewCampaign({ title: '', target_audience: '', message: '', channels: [], duration: 7 })
    setShowCreateModal(false)
  }

  return (
    <div className="space-y-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
          <h3 className="text-sm font-medium text-red-800">تحذير - قسم حساس</h3>
        </div>
        <p className="text-sm text-red-700 mt-1">
          هذا القسم مخصص لإدارة توجيه الرأي العام. يجب استخدامه بمسؤولية عالية وأخلاقية.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة الرأي العام</h1>
          <p className="text-gray-600 mt-1">توجيه وإدارة الرأي العام للأقسام المختلفة</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center"
        >
          <Target className="w-4 h-4 ml-2" />
          حملة جديدة
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">الحملات النشطة</h3>
            <Users className="w-6 h-6 text-primary-600" />
          </div>
          <div className="text-3xl font-bold text-primary-600 mb-2">
            {campaigns.filter(c => c.status === 'active').length}
          </div>
          <p className="text-sm text-gray-600">حملات توجيه نشطة</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">إجمالي الوصول</h3>
            <TrendingUp className="w-6 h-6 text-gold-600" />
          </div>
          <div className="text-3xl font-bold text-gold-600 mb-2">
            {campaigns.reduce((sum, c) => sum + c.reach, 0).toLocaleString()}
          </div>
          <p className="text-sm text-gray-600">شخص تم الوصول إليه</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">معدل التفاعل</h3>
            <MessageSquare className="w-6 h-6 text-accent-red" />
          </div>
          <div className="text-3xl font-bold text-accent-red mb-2">
            {campaigns.length > 0 ? Math.round(campaigns.reduce((sum, c) => sum + c.engagement, 0) / campaigns.length) : 0}%
          </div>
          <p className="text-sm text-gray-600">متوسط التفاعل</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">معدل النجاح</h3>
            <BarChart3 className="w-6 h-6 text-gray-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">85%</div>
          <p className="text-sm text-gray-600">نسبة نجاح الحملات</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">الحملات الحالية</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">العنوان</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الجمهور المستهدف</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الحالة</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الوصول</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">التفاعل</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {campaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{campaign.title}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{campaign.target_audience}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      campaign.status === 'active' ? 'bg-primary-100 text-primary-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {campaign.status === 'active' ? 'نشطة' : 'متوقفة'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{campaign.reach.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{campaign.engagement}%</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-primary-600 hover:text-primary-900 text-sm">
                      <Settings className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">إنشاء حملة جديدة</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">عنوان الحملة</label>
                <input
                  type="text"
                  value={newCampaign.title}
                  onChange={(e) => setNewCampaign({...newCampaign, title: e.target.value})}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الجمهور المستهدف</label>
                <input
                  type="text"
                  value={newCampaign.target_audience}
                  onChange={(e) => setNewCampaign({...newCampaign, target_audience: e.target.value})}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الرسالة الأساسية</label>
                <textarea
                  value={newCampaign.message}
                  onChange={(e) => setNewCampaign({...newCampaign, message: e.target.value})}
                  rows={3}
                  className="input-field"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 space-x-reverse mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                إلغاء
              </button>
              <button
                onClick={handleCreateCampaign}
                className="btn-primary"
              >
                إنشاء الحملة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PublicOpinionControl
