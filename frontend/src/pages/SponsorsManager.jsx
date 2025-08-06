import React, { useState, useEffect } from 'react'
import { Users, Star, Globe, Mail, Phone, Plus, Edit, Trash2, Eye } from 'lucide-react'

const SponsorsManager = () => {
  const [sponsors, setSponsors] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingSponsor, setEditingSponsor] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    logo_url: '',
    website_url: '',
    contact_email: '',
    contact_phone: '',
    sponsorship_level: 'bronze',
    is_active: true
  })

  useEffect(() => {
    fetchSponsors()
  }, [])

  const fetchSponsors = async () => {
    try {
      const mockSponsors = [
        {
          id: 1,
          name: 'بنك سوريا الدولي',
          logo_url: '/images/sponsors/bank-syria.png',
          website_url: 'https://www.banksyria.com',
          contact_email: 'marketing@banksyria.com',
          contact_phone: '+963 11 123 4567',
          sponsorship_level: 'gold',
          is_active: true,
          created_at: '2024-01-15'
        },
        {
          id: 2,
          name: 'شركة الاتصالات السورية',
          logo_url: '/images/sponsors/syriatel.png',
          website_url: 'https://www.syriatel.sy',
          contact_email: 'info@syriatel.sy',
          contact_phone: '+963 11 987 6543',
          sponsorship_level: 'platinum',
          is_active: true,
          created_at: '2024-02-01'
        }
      ]
      setSponsors(mockSponsors)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching sponsors:', error)
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingSponsor) {
      setSponsors(sponsors.map(sponsor => 
        sponsor.id === editingSponsor.id 
          ? { ...sponsor, ...formData }
          : sponsor
      ))
      setEditingSponsor(null)
    } else {
      const newSponsor = {
        id: Date.now(),
        ...formData,
        created_at: new Date().toISOString().split('T')[0]
      }
      setSponsors([...sponsors, newSponsor])
    }
    
    setFormData({
      name: '',
      logo_url: '',
      website_url: '',
      contact_email: '',
      contact_phone: '',
      sponsorship_level: 'bronze',
      is_active: true
    })
    setShowAddForm(false)
  }

  const getSponsorshipLevelColor = (level) => {
    switch (level) {
      case 'platinum': return 'bg-gray-100 text-gray-800'
      case 'gold': return 'bg-gold-100 text-gold-800'
      case 'silver': return 'bg-gray-50 text-gray-700'
      case 'bronze': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة الرعاة</h1>
          <p className="text-gray-600 mt-1">إدارة الرعاة والشراكات التجارية</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          إضافة راعي جديد
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي الرعاة</p>
              <p className="text-2xl font-bold text-gray-900">{sponsors.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">رعاة نشطون</p>
              <p className="text-2xl font-bold text-green-600">
                {sponsors.filter(s => s.is_active).length}
              </p>
            </div>
            <Star className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">رعاة ذهبيون</p>
              <p className="text-2xl font-bold text-gold-600">
                {sponsors.filter(s => s.sponsorship_level === 'gold').length}
              </p>
            </div>
            <Star className="w-8 h-8 text-gold-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">رعاة بلاتينيون</p>
              <p className="text-2xl font-bold text-purple-600">
                {sponsors.filter(s => s.sponsorship_level === 'platinum').length}
              </p>
            </div>
            <Star className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Sponsors List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">قائمة الرعاة</h2>
        </div>
        
        <div className="p-6">
          {sponsors.map((sponsor) => (
            <div key={sponsor.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg mb-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-12 w-12">
                  <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary-600" />
                  </div>
                </div>
                <div className="mr-4">
                  <div className="text-lg font-medium text-gray-900">
                    {sponsor.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {sponsor.sponsorship_level === 'platinum' && 'بلاتيني'}
                    {sponsor.sponsorship_level === 'gold' && 'ذهبي'}
                    {sponsor.sponsorship_level === 'silver' && 'فضي'}
                    {sponsor.sponsorship_level === 'bronze' && 'برونزي'}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                  sponsor.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {sponsor.is_active ? 'نشط' : 'غير نشط'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SponsorsManager
