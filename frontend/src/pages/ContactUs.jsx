import React, { useState } from 'react'
import { Mail, Phone, MapPin, MessageSquare, Briefcase, AlertCircle, Send, Facebook, Youtube } from 'lucide-react'

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: 'general',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const contactCategories = [
    { id: 'general', name: 'استفسار عام', icon: MessageSquare, color: 'text-primary-600' },
    { id: 'advertising', name: 'طلب إعلان', icon: Briefcase, color: 'text-gold-600' },
    { id: 'partnership', name: 'شراكة إعلامية', icon: Briefcase, color: 'text-accent-red' },
    { id: 'technical', name: 'مشكلة تقنية', icon: AlertCircle, color: 'text-red-600' },
    { id: 'editorial', name: 'المحتوى التحريري', icon: MessageSquare, color: 'text-gray-600' },
    { id: 'complaint', name: 'شكوى أو اقتراح', icon: AlertCircle, color: 'text-yellow-600' }
  ]

  const socialLinks = [
    { name: 'فيسبوك', icon: Facebook, url: 'https://facebook.com/golan24', color: 'text-blue-600' },
    { name: 'تلجرام', icon: MessageSquare, url: 'https://t.me/golan24', color: 'text-blue-500' },
    { name: 'واتساب', icon: Phone, url: 'https://wa.me/963123456789', color: 'text-primary-600' },
    { name: 'يوتيوب', icon: Youtube, url: 'https://youtube.com/golan24', color: 'text-accent-red' }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setSubmitted(true)
    setIsSubmitting(false)
    setFormData({ name: '', email: '', phone: '', subject: '', category: 'general', message: '' })
  }

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-primary-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">تم إرسال رسالتك بنجاح</h2>
          <p className="text-gray-600 mb-6">سنتواصل معك في أقرب وقت ممكن</p>
          <button
            onClick={() => setSubmitted(false)}
            className="btn-primary"
          >
            إرسال رسالة أخرى
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">تواصل معنا</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          نحن هنا للاستماع إليك. تواصل معنا لأي استفسار أو اقتراح أو طلب إعلان
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {contactCategories.map(category => {
          const IconComponent = category.icon
          return (
            <div key={category.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center hover:shadow-md transition-shadow">
              <IconComponent className={`w-8 h-8 mx-auto mb-2 ${category.color}`} />
              <h3 className="text-sm font-medium text-gray-900">{category.name}</h3>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">أرسل رسالة</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الاسم الكامل *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    البريد الإلكتروني *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="input-field"
                    placeholder="+963 XX XXX XXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نوع الاستفسار *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="input-field"
                    required
                  >
                    {contactCategories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الموضوع *
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="input-field"
                  placeholder="اكتب موضوع رسالتك"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الرسالة *
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows={6}
                  className="input-field"
                  placeholder="اكتب رسالتك هنا..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                    جاري الإرسال...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 ml-2" />
                    إرسال الرسالة
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">معلومات التواصل</h3>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-primary-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">البريد الإلكتروني</p>
                  <p className="text-sm text-gray-600">info@golan24.com</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-primary-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">الهاتف</p>
                  <p className="text-sm text-gray-600">+963 11 123 4567</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-primary-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">العنوان</p>
                  <p className="text-sm text-gray-600">دمشق، الجمهورية العربية السورية</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">تابعنا على</h3>
            
            <div className="grid grid-cols-2 gap-3">
              {socialLinks.map((social) => {
                const IconComponent = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <IconComponent className={`w-5 h-5 mr-2 ${social.color}`} />
                    <span className="text-sm font-medium text-gray-700">{social.name}</span>
                  </a>
                )
              })}
            </div>
          </div>

          <div className="bg-gold-50 border border-gold-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gold-800 mb-2">طلبات الإعلان</h3>
            <p className="text-sm text-gold-700 mb-4">
              للاستفسار عن الإعلانات والرعايات، يرجى اختيار "طلب إعلان" من نوع الاستفسار أو التواصل مباشرة على:
            </p>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gold-800">ads@golan24.com</p>
              <p className="text-sm font-medium text-gold-800">+963 11 123 4568</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactUs
