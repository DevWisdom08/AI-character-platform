'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { characterAPI } from '@/lib/api'
import Navbar from '@/components/Navbar'
import { Calendar, Clock, User, FileText, Tags, Globe, Lock, Eye } from 'lucide-react'

const CREATION_MODES = [
  { value: 'real_person', label: '分析真实人物', description: '基于真实人物数据创建' },
  { value: 'original', label: '原创角色', description: '从零开始创造全新角色' },
]

const VISIBILITY_OPTIONS = [
  { value: 'private', label: '私有', icon: Lock, description: '仅自己可见，解锁深度对话' },
  { value: 'public', label: '公开', icon: Globe, description: '所有人可见，基础互动' },
  { value: 'synced', label: '同步', icon: Eye, description: '公开展示，保留深度对话' },
]

export default function CharacterCreatePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    character_name: '',
    creation_mode: 'original',
    description: '',
    birth_year: 2000,
    birth_month: 1,
    birth_day: 1,
    birth_hour: 12,
    birth_minute: 0,
    gender: 'other',
    greeting_message: '',
    tags: '',
    visibility_status: 'private',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const payload = {
        ...formData,
        personality_traits: [],
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      }

      const character = await characterAPI.createCharacter(payload)
      router.push(`/character/${character.id}`)
    } catch (err: any) {
      setError(err.response?.data?.detail || '创建角色失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-700 p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">创建角色</h1>
              <p className="text-gray-400">
                为您的角色赋予独特的灵魂和命理特质
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
              {/* Character Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  角色名称 *
                </label>
                <input
                  type="text"
                  required
                  value={formData.character_name}
                  onChange={(e) => setFormData({ ...formData, character_name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  placeholder="给角色起个名字"
                />
              </div>

              {/* Creation Mode */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  创建模式 *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {CREATION_MODES.map((mode) => (
                    <button
                      key={mode.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, creation_mode: mode.value })}
                      className={`p-4 rounded-lg border text-left transition-all ${
                        formData.creation_mode === mode.value
                          ? 'bg-purple-600 border-purple-500 text-white'
                          : 'bg-slate-900/50 border-slate-700 text-gray-300 hover:border-slate-600'
                      }`}
                    >
                      <div className="font-semibold mb-1">{mode.label}</div>
                      <div className="text-xs opacity-80">{mode.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  角色描述
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  placeholder="描述角色的背景故事、性格特点..."
                />
              </div>

              {/* Birth Date */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  出生日期 (公历) *
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <input
                    type="number"
                    min="1900"
                    max="2100"
                    required
                    value={formData.birth_year}
                    onChange={(e) => setFormData({ ...formData, birth_year: parseInt(e.target.value) })}
                    className="px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    placeholder="年"
                  />
                  <input
                    type="number"
                    min="1"
                    max="12"
                    required
                    value={formData.birth_month}
                    onChange={(e) => setFormData({ ...formData, birth_month: parseInt(e.target.value) })}
                    className="px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    placeholder="月"
                  />
                  <input
                    type="number"
                    min="1"
                    max="31"
                    required
                    value={formData.birth_day}
                    onChange={(e) => setFormData({ ...formData, birth_day: parseInt(e.target.value) })}
                    className="px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    placeholder="日"
                  />
                </div>
              </div>

              {/* Birth Time */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  出生时间 (24小时制)
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={formData.birth_hour}
                    onChange={(e) => setFormData({ ...formData, birth_hour: parseInt(e.target.value) })}
                    className="px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    placeholder="时"
                  />
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={formData.birth_minute}
                    onChange={(e) => setFormData({ ...formData, birth_minute: parseInt(e.target.value) })}
                    className="px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    placeholder="分"
                  />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  性别 *
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

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <Tags className="w-4 h-4" />
                  标签 (用逗号分隔)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  placeholder="例如: 温柔, 智慧, 守护者"
                />
              </div>

              {/* Visibility */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  可见性设置 *
                </label>
                <div className="space-y-3">
                  {VISIBILITY_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, visibility_status: option.value })}
                      className={`w-full p-4 rounded-lg border text-left transition-all flex items-start gap-3 ${
                        formData.visibility_status === option.value
                          ? 'bg-purple-600 border-purple-500 text-white'
                          : 'bg-slate-900/50 border-slate-700 text-gray-300 hover:border-slate-600'
                      }`}
                    >
                      <option.icon className="w-5 h-5 mt-0.5" />
                      <div>
                        <div className="font-semibold mb-1">{option.label}</div>
                        <div className="text-xs opacity-80">{option.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '创建中...' : '创建角色'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

