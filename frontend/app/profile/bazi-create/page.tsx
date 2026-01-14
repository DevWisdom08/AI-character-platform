'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { profileAPI } from '@/lib/api'
import { Calendar, Clock, MapPin } from 'lucide-react'
import Navbar from '@/components/Navbar'

export default function BaZiCreatePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    birth_year: 2000,
    birth_month: 1,
    birth_day: 1,
    birth_hour: 12,
    birth_minute: 0,
    gender: 'other',
    birth_location: '',
    use_true_solar_time: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await profileAPI.createBaZiProfile(formData)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.detail || '创建档案失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-700 p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">创建命理档案</h1>
              <p className="text-gray-400">
                输入您的出生信息，让AI深入了解您的独特个性
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Birth Date */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  出生日期 (公历)
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <input
                      type="number"
                      min="1900"
                      max="2100"
                      required
                      value={formData.birth_year}
                      onChange={(e) => setFormData({ ...formData, birth_year: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                      placeholder="年"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      min="1"
                      max="12"
                      required
                      value={formData.birth_month}
                      onChange={(e) => setFormData({ ...formData, birth_month: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                      placeholder="月"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      required
                      value={formData.birth_day}
                      onChange={(e) => setFormData({ ...formData, birth_day: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                      placeholder="日"
                    />
                  </div>
                </div>
              </div>

              {/* Birth Time */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  出生时间 (24小时制)
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="number"
                      min="0"
                      max="23"
                      required
                      value={formData.birth_hour}
                      onChange={(e) => setFormData({ ...formData, birth_hour: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                      placeholder="时"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      required
                      value={formData.birth_minute}
                      onChange={(e) => setFormData({ ...formData, birth_minute: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                      placeholder="分"
                    />
                  </div>
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  性别
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {['male', 'female', 'other'].map((gender) => (
                    <button
                      key={gender}
                      type="button"
                      onClick={() => setFormData({ ...formData, gender })}
                      className={`py-3 rounded-lg font-medium transition-all ${
                        formData.gender === gender
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-900/50 text-gray-400 border border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      {gender === 'male' ? '男' : gender === 'female' ? '女' : '其他'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Birth Location (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  出生地 (可选)
                </label>
                <input
                  type="text"
                  value={formData.birth_location}
                  onChange={(e) => setFormData({ ...formData, birth_location: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  placeholder="例如：北京"
                />
              </div>

              {/* True Solar Time */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="true-solar-time"
                  checked={formData.use_true_solar_time}
                  onChange={(e) => setFormData({ ...formData, use_true_solar_time: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-700 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="true-solar-time" className="ml-2 text-sm text-gray-400">
                  使用真太阳时（更精确）
                </label>
              </div>

              {/* Privacy Notice */}
              <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <p className="text-sm text-gray-400">
                  🔒 您的个人信息将被安全加密存储，仅用于为您提供个性化服务
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '创建中...' : '生成我的命理档案'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

