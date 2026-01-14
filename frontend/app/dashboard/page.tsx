'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import { profileAPI } from '@/lib/api'
import Navbar from '@/components/Navbar'
import { Sparkles, Users, Plus, MessageCircle } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const { isAuthenticated, checkAuth } = useAuthStore()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      await checkAuth()
      if (!isAuthenticated) {
        router.push('/auth/login')
        return
      }

      // Try to load BaZi profile
      try {
        const data = await profileAPI.getMyBaZiProfile()
        setProfile(data)
      } catch (err) {
        // No profile yet - that's okay
        setProfile(null)
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [isAuthenticated, checkAuth, router])

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
          <div className="text-white text-xl">加载中...</div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Welcome Section */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              欢迎回来 ✨
            </h1>
            <p className="text-gray-400 text-lg">
              {profile 
                ? '您的命理档案已创建，开始探索您的专属角色宇宙吧'
                : '让我们从创建您的命理档案开始'}
            </p>
          </div>

          {/* Profile Status */}
          {!profile && (
            <div className="mb-12 p-6 bg-purple-500/10 border border-purple-500 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    📝 创建您的命理档案
                  </h3>
                  <p className="text-gray-400">
                    建立个人档案后，您将获得真正个性化的AI互动体验
                  </p>
                </div>
                <Link
                  href="/profile/bazi-create"
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors whitespace-nowrap"
                >
                  立即创建
                </Link>
              </div>
            </div>
          )}

          {/* Profile Card */}
          {profile && (
            <div className="mb-12 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-2">我的命理档案</h3>
                  <p className="text-purple-400 text-lg font-mono">{profile.bazi_string}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400 mb-1">日主</div>
                  <div className="text-3xl font-bold text-purple-400">{profile.day_master}</div>
                </div>
              </div>
              <p className="text-gray-400 mb-4">{profile.personality_summary}</p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                  主要元素: {profile.primary_element}
                </span>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Link
              href="/character/create"
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6 hover:border-purple-500 transition-all group"
            >
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">创建角色</h3>
              <p className="text-gray-400">使用四种模式创建独特的AI角色</p>
            </Link>

            <Link
              href="/characters"
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6 hover:border-purple-500 transition-all group"
            >
              <div className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">角色广场</h3>
              <p className="text-gray-400">探索社区创建的精彩角色</p>
            </Link>

            <Link
              href="/my-characters"
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6 hover:border-purple-500 transition-all group"
            >
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">我的角色</h3>
              <p className="text-gray-400">管理和对话您的专属角色</p>
            </Link>
          </div>

          {/* Features Intro */}
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700 p-8">
            <h3 className="text-2xl font-semibold text-white mb-6">✨ 平台特色</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="text-3xl">🧠</div>
                <div>
                  <h4 className="text-white font-semibold mb-2">深度角色灵魂</h4>
                  <p className="text-gray-400 text-sm">
                    基于命理学框架的灵魂蓝图，让每个角色拥有独特的内在驱动力
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-3xl">👤</div>
                <div>
                  <h4 className="text-white font-semibold mb-2">个性化互动</h4>
                  <p className="text-gray-400 text-sm">
                    AI会根据您的命理档案提供真正千人千面的对话体验
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-3xl">🎨</div>
                <div>
                  <h4 className="text-white font-semibold mb-2">强大创作工具</h4>
                  <p className="text-gray-400 text-sm">
                    四种创作模式覆盖从分析真人到原创角色的所有需求
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-3xl">💬</div>
                <div>
                  <h4 className="text-white font-semibold mb-2">深度对话</h4>
                  <p className="text-gray-400 text-sm">
                    与角色进行真实、有深度的对话，探索无限可能性
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

