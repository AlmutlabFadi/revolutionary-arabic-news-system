import React, { useState, useEffect } from 'react'
import { 
  Settings, 
  Save, 
  RefreshCw, 
  Database, 
  Shield, 
  Globe, 
  Bell,
  Zap,
  Bot,
  Clock,
  Key,
  Server,
  Monitor
} from 'lucide-react'

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    automation: {
      scraping_interval: 5,
      auto_publish: true,
      ai_processing_enabled: true,
      max_articles_per_source: 10,
      processing_timeout: 60
    },
    ai: {
      openai_api_key: '',
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      max_tokens: 1000
    },
    database: {
      backup_enabled: true,
      backup_interval: 24,
      retention_days: 30
    },
    notifications: {
      email_enabled: false,
      webhook_enabled: false,
      webhook_url: '',
      alert_threshold: 5
    },
    security: {
      rate_limiting: true,
      api_key_required: false,
      cors_origins: 'http://localhost:3000,http://localhost:5173'
    },
    performance: {
      cache_enabled: true,
      cache_ttl: 300,
      max_concurrent_requests: 10
    }
  })

  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    try {
      setLoading(true)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }))
  }

  const SettingCard = ({ title, icon: Icon, children }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mr-3">{title}</h3>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  )

  const InputField = ({ label, type = "text", value, onChange, placeholder, description }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      {description && (
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      )}
    </div>
  )

  const CheckboxField = ({ label, checked, onChange, description }) => (
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
      </div>
      <div className="mr-3">
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
        {description && (
          <p className="text-xs text-gray-500">{description}</p>
        )}
      </div>
    </div>
  )

  const SelectField = ({ label, value, onChange, options, description }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {description && (
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إعدادات النظام</h1>
          <p className="text-gray-600 mt-1">إدارة وتكوين إعدادات النظام الإخباري المتقدم</p>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          <button 
            onClick={loadSettings}
            disabled={loading}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center disabled:bg-gray-400"
          >
            <RefreshCw className={`w-4 h-4 ml-2 ${loading ? 'animate-spin' : ''}`} />
            تحديث
          </button>
          <button 
            onClick={saveSettings}
            disabled={loading}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
              saved 
                ? 'bg-green-600 text-white' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            } disabled:bg-gray-400`}
          >
            <Save className="w-4 h-4 ml-2" />
            {saved ? 'تم الحفظ' : 'حفظ الإعدادات'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SettingCard title="إعدادات الأتمتة" icon={Zap}>
          <InputField
            label="فترة السحب (بالدقائق)"
            type="number"
            value={settings.automation.scraping_interval}
            onChange={(value) => updateSetting('automation', 'scraping_interval', parseInt(value))}
            description="المدة بين عمليات سحب الأخبار التلقائية"
          />
          
          <InputField
            label="الحد الأقصى للمقالات لكل مصدر"
            type="number"
            value={settings.automation.max_articles_per_source}
            onChange={(value) => updateSetting('automation', 'max_articles_per_source', parseInt(value))}
            description="عدد المقالات المسحوبة من كل مصدر في كل دورة"
          />

          <InputField
            label="مهلة المعالجة (بالثواني)"
            type="number"
            value={settings.automation.processing_timeout}
            onChange={(value) => updateSetting('automation', 'processing_timeout', parseInt(value))}
            description="الحد الأقصى لوقت معالجة المقال الواحد"
          />
          
          <CheckboxField
            label="النشر التلقائي"
            checked={settings.automation.auto_publish}
            onChange={(value) => updateSetting('automation', 'auto_publish', value)}
            description="نشر المقالات تلقائياً بعد المعالجة"
          />
          
          <CheckboxField
            label="معالجة الذكاء الاصطناعي"
            checked={settings.automation.ai_processing_enabled}
            onChange={(value) => updateSetting('automation', 'ai_processing_enabled', value)}
            description="تفعيل معالجة المقالات بالذكاء الاصطناعي"
          />
        </SettingCard>

        <SettingCard title="إعدادات الذكاء الاصطناعي" icon={Bot}>
          <InputField
            label="مفتاح OpenAI API"
            type="password"
            value={settings.ai.openai_api_key}
            onChange={(value) => updateSetting('ai', 'openai_api_key', value)}
            placeholder="sk-..."
            description="مفتاح API الخاص بـ OpenAI"
          />
          
          <SelectField
            label="نموذج الذكاء الاصطناعي"
            value={settings.ai.model}
            onChange={(value) => updateSetting('ai', 'model', value)}
            options={[
              { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
              { value: 'gpt-4', label: 'GPT-4' },
              { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' }
            ]}
            description="نموذج الذكاء الاصطناعي المستخدم"
          />
          
          <InputField
            label="درجة الحرارة"
            type="number"
            value={settings.ai.temperature}
            onChange={(value) => updateSetting('ai', 'temperature', parseFloat(value))}
            description="مستوى الإبداع في النصوص (0.0 - 1.0)"
          />
          
          <InputField
            label="الحد الأقصى للرموز"
            type="number"
            value={settings.ai.max_tokens}
            onChange={(value) => updateSetting('ai', 'max_tokens', parseInt(value))}
            description="الحد الأقصى لطول النص المولد"
          />
        </SettingCard>

        <SettingCard title="إعدادات قاعدة البيانات" icon={Database}>
          <CheckboxField
            label="تفعيل النسخ الاحتياطي"
            checked={settings.database.backup_enabled}
            onChange={(value) => updateSetting('database', 'backup_enabled', value)}
            description="إنشاء نسخ احتياطية تلقائية"
          />
          
          <InputField
            label="فترة النسخ الاحتياطي (بالساعات)"
            type="number"
            value={settings.database.backup_interval}
            onChange={(value) => updateSetting('database', 'backup_interval', parseInt(value))}
            description="المدة بين النسخ الاحتياطية"
          />
          
          <InputField
            label="مدة الاحتفاظ (بالأيام)"
            type="number"
            value={settings.database.retention_days}
            onChange={(value) => updateSetting('database', 'retention_days', parseInt(value))}
            description="مدة الاحتفاظ بالنسخ الاحتياطية"
          />
        </SettingCard>

        <SettingCard title="إعدادات التنبيهات" icon={Bell}>
          <CheckboxField
            label="تنبيهات البريد الإلكتروني"
            checked={settings.notifications.email_enabled}
            onChange={(value) => updateSetting('notifications', 'email_enabled', value)}
            description="إرسال تنبيهات عبر البريد الإلكتروني"
          />
          
          <CheckboxField
            label="تنبيهات Webhook"
            checked={settings.notifications.webhook_enabled}
            onChange={(value) => updateSetting('notifications', 'webhook_enabled', value)}
            description="إرسال تنبيهات عبر Webhook"
          />
          
          <InputField
            label="رابط Webhook"
            value={settings.notifications.webhook_url}
            onChange={(value) => updateSetting('notifications', 'webhook_url', value)}
            placeholder="https://example.com/webhook"
            description="رابط استقبال التنبيهات"
          />
          
          <InputField
            label="حد التنبيه"
            type="number"
            value={settings.notifications.alert_threshold}
            onChange={(value) => updateSetting('notifications', 'alert_threshold', parseInt(value))}
            description="عدد الأخطاء قبل إرسال تنبيه"
          />
        </SettingCard>

        <SettingCard title="إعدادات الأمان" icon={Shield}>
          <CheckboxField
            label="تحديد معدل الطلبات"
            checked={settings.security.rate_limiting}
            onChange={(value) => updateSetting('security', 'rate_limiting', value)}
            description="تحديد عدد الطلبات المسموحة"
          />
          
          <CheckboxField
            label="مطالبة بمفتاح API"
            checked={settings.security.api_key_required}
            onChange={(value) => updateSetting('security', 'api_key_required', value)}
            description="مطالبة بمفتاح API للوصول"
          />
          
          <InputField
            label="مصادر CORS المسموحة"
            value={settings.security.cors_origins}
            onChange={(value) => updateSetting('security', 'cors_origins', value)}
            description="المواقع المسموح لها بالوصول (مفصولة بفواصل)"
          />
        </SettingCard>

        <SettingCard title="إعدادات الأداء" icon={Monitor}>
          <CheckboxField
            label="تفعيل التخزين المؤقت"
            checked={settings.performance.cache_enabled}
            onChange={(value) => updateSetting('performance', 'cache_enabled', value)}
            description="تخزين البيانات مؤقتاً لتحسين الأداء"
          />
          
          <InputField
            label="مدة التخزين المؤقت (بالثواني)"
            type="number"
            value={settings.performance.cache_ttl}
            onChange={(value) => updateSetting('performance', 'cache_ttl', parseInt(value))}
            description="مدة الاحتفاظ بالبيانات في التخزين المؤقت"
          />
          
          <InputField
            label="الحد الأقصى للطلبات المتزامنة"
            type="number"
            value={settings.performance.max_concurrent_requests}
            onChange={(value) => updateSetting('performance', 'max_concurrent_requests', parseInt(value))}
            description="عدد الطلبات المعالجة في نفس الوقت"
          />
        </SettingCard>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <Clock className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="mr-3">
            <h3 className="text-sm font-medium text-yellow-800">
              ملاحظة مهمة
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                بعض الإعدادات تتطلب إعادة تشغيل النظام لتصبح فعالة. 
                تأكد من حفظ جميع التغييرات قبل إعادة التشغيل.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SystemSettings
