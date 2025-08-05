import React, { useState, useEffect } from 'react'
import { 
  Users, 
  UserPlus, 
  Edit, 
  Trash2, 
  Shield, 
  Key, 
  Settings,
  Eye,
  EyeOff,
  Save,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

const UserManagement = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      username: 'admin',
      email: 'admin@golan24.com',
      role: 'admin',
      status: 'active',
      created_at: '2024-01-15',
      last_login: '2024-08-05'
    },
    {
      id: 2,
      username: 'editor1',
      email: 'editor@golan24.com',
      role: 'editor',
      status: 'active',
      created_at: '2024-02-01',
      last_login: '2024-08-04'
    }
  ])

  const [roles] = useState([
    {
      id: 'admin',
      name: 'مدير النظام',
      description: 'صلاحيات كاملة لإدارة النظام',
      permissions: ['read', 'write', 'delete', 'manage_users', 'system_settings', 'analytics']
    },
    {
      id: 'editor',
      name: 'محرر',
      description: 'إدارة المحتوى والأخبار',
      permissions: ['read', 'write', 'manage_articles', 'virtual_studio']
    },
    {
      id: 'viewer',
      name: 'مشاهد',
      description: 'عرض المحتوى فقط',
      permissions: ['read']
    },
    {
      id: 'analyst',
      name: 'محلل',
      description: 'عرض التحليلات والإحصائيات',
      permissions: ['read', 'analytics', 'reports']
    }
  ])

  const [showUserModal, setShowUserModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'viewer',
    status: 'active'
  })

  const permissions = [
    { id: 'read', name: 'قراءة', description: 'عرض المحتوى' },
    { id: 'write', name: 'كتابة', description: 'إنشاء وتعديل المحتوى' },
    { id: 'delete', name: 'حذف', description: 'حذف المحتوى' },
    { id: 'manage_users', name: 'إدارة المستخدمين', description: 'إضافة وتعديل المستخدمين' },
    { id: 'manage_articles', name: 'إدارة المقالات', description: 'إدارة الأخبار والمقالات' },
    { id: 'virtual_studio', name: 'الاستوديو الافتراضي', description: 'استخدام الاستوديو الافتراضي' },
    { id: 'system_settings', name: 'إعدادات النظام', description: 'تعديل إعدادات النظام' },
    { id: 'analytics', name: 'التحليلات', description: 'عرض التحليلات والإحصائيات' },
    { id: 'reports', name: 'التقارير', description: 'إنشاء وعرض التقارير' }
  ]

  const handleAddUser = () => {
    setEditingUser(null)
    setFormData({
      username: '',
      email: '',
      password: '',
      role: 'viewer',
      status: 'active'
    })
    setShowUserModal(true)
  }

  const handleEditUser = (user) => {
    setEditingUser(user)
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
      role: user.role,
      status: user.status
    })
    setShowUserModal(true)
  }

  const handleSaveUser = () => {
    if (editingUser) {
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...formData, password: formData.password || user.password }
          : user
      ))
    } else {
      const newUser = {
        id: Date.now(),
        ...formData,
        created_at: new Date().toISOString().split('T')[0],
        last_login: null
      }
      setUsers([...users, newUser])
    }
    setShowUserModal(false)
  }

  const handleDeleteUser = (userId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      setUsers(users.filter(user => user.id !== userId))
    }
  }

  const getRoleInfo = (roleId) => {
    return roles.find(role => role.id === roleId) || {}
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const UserModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            {editingUser ? 'تعديل المستخدم' : 'إضافة مستخدم جديد'}
          </h3>
          <button 
            onClick={() => setShowUserModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              اسم المستخدم
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="أدخل اسم المستخدم"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="أدخل البريد الإلكتروني"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              كلمة المرور {editingUser && '(اتركها فارغة للاحتفاظ بالحالية)'}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10"
                placeholder="أدخل كلمة المرور"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الدور
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {roles.map(role => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {getRoleInfo(formData.role).description}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الحالة
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="active">نشط</option>
              <option value="inactive">غير نشط</option>
              <option value="pending">في الانتظار</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-3 space-x-reverse mt-6">
          <button
            onClick={() => setShowUserModal(false)}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            إلغاء
          </button>
          <button
            onClick={handleSaveUser}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Save className="w-4 h-4 ml-2" />
            حفظ
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة المستخدمين</h1>
          <p className="text-gray-600 mt-1">إدارة المستخدمين والأدوار والصلاحيات</p>
        </div>
        <button
          onClick={handleAddUser}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <UserPlus className="w-4 h-4 ml-2" />
          إضافة مستخدم
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold flex items-center">
                <Users className="w-5 h-5 ml-2 text-blue-600" />
                قائمة المستخدمين
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المستخدم
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الدور
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      آخر دخول
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.username}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {getRoleInfo(user.role).name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                          {user.status === 'active' ? 'نشط' : user.status === 'inactive' ? 'غير نشط' : 'في الانتظار'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.last_login || 'لم يسجل دخول'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2 space-x-reverse">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
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
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Shield className="w-5 h-5 ml-2 text-green-600" />
              الأدوار والصلاحيات
            </h3>
            <div className="space-y-4">
              {roles.map((role) => (
                <div key={role.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{role.name}</h4>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {role.permissions.length} صلاحية
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{role.description}</p>
                  <div className="space-y-1">
                    {role.permissions.map((permId) => {
                      const perm = permissions.find(p => p.id === permId)
                      return perm ? (
                        <div key={permId} className="flex items-center text-xs text-gray-500">
                          <CheckCircle className="w-3 h-3 text-green-500 ml-1" />
                          {perm.name}
                        </div>
                      ) : null
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Key className="w-5 h-5 ml-2 text-yellow-600" />
              إحصائيات سريعة
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">إجمالي المستخدمين</span>
                <span className="font-semibold">{users.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">المستخدمين النشطين</span>
                <span className="font-semibold text-green-600">
                  {users.filter(u => u.status === 'active').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">المديرين</span>
                <span className="font-semibold text-blue-600">
                  {users.filter(u => u.role === 'admin').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">المحررين</span>
                <span className="font-semibold text-purple-600">
                  {users.filter(u => u.role === 'editor').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showUserModal && <UserModal />}
    </div>
  )
}

export default UserManagement
