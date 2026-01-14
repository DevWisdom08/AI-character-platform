'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import { characterAPI } from '@/lib/api'
import Navbar from '@/components/Navbar'
import { Users, Plus, MessageCircle, Trash2, Eye, EyeOff, Globe } from 'lucide-react'

interface Character {
  id: string
  character_name: string
  description: string
  creation_mode: string
  visibility_status: string
  interaction_count: number
  bazi_profile: {
    bazi_string: string
    day_master: string
  }
}

export default function MyCharactersPage() {
  const router = useRouter()
  const { isAuthenticated, checkAuth } = useAuthStore()
  const [characters, setCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      await checkAuth()
      if (!isAuthenticated) {
        router.push('/auth/login')
        return
      }
      loadCharacters()
    }
    init()
  }, [isAuthenticated, checkAuth, router])

  const loadCharacters = async () => {
    setLoading(true)
    try {
      const data = await characterAPI.getMyCharacters()
      setCharacters(data.characters)
    } catch (err) {
      console.error('Failed to load characters:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`确定要删除角色"${name}"吗？此操作不可恢复。`)) {
      return
    }

    try {
      await characterAPI.deleteCharacter(id)
      setCharacters(characters.filter(c => c.id !== id))
    } catch (err) {
      alert('删除失败，请重试')
    }
  }

  const getVisibilityIcon = (status: string) => {
    switch (status) {
      case 'private':
        return <EyeOff className="w-4 h-4" />
      case 'public':
        return <Globe className="w-4 h-4" />
      case 'synced':
        return <Eye className="w-4 h-4" />
      default:
        return null
    }
  }

  const getVisibilityText = (status: string) => {
    switch (status) {
      case 'private':
        return '私有'
      case 'public':
        return '公开'
      case 'synced':
        return '同步'
      default:
        return status
    }
  }

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
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-4 flex items-center gap-3">
                <Users className="w-10 h-10" />
                我的角色
              </h1>
              <p className="text-gray-400 text-lg">
                管理和对话您创建的所有角色
              </p>
            </div>
            <Link
              href="/character/create"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              创建新角色
            </Link>
          </div>

          {/* Characters List */}
          {characters.length === 0 ? (
            <div className="text-center text-gray-400 py-20">
              <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <div className="text-xl mb-2">您还没有创建任何角色</div>
              <p className="mb-6">现在就开始创建您的第一个角色吧！</p>
              <Link
                href="/character/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                创建角色
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {characters.map((character) => (
                <div
                  key={character.id}
                  className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6"
                >
                  {/* Character Avatar */}
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-4 text-3xl font-bold text-white mx-auto">
                    {character.character_name.charAt(0)}
                  </div>

                  {/* Character Name */}
                  <h3 className="text-xl font-semibold text-white text-center mb-2">
                    {character.character_name}
                  </h3>

                  {/* BaZi Info */}
                  <div className="text-center mb-3">
                    <span className="text-purple-400 font-mono text-sm">
                      {character.bazi_profile.bazi_string}
                    </span>
                  </div>

                  {/* Description */}
                  {character.description && (
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2 text-center">
                      {character.description}
                    </p>
                  )}

                  {/* Meta Info */}
                  <div className="flex justify-center gap-4 mb-4 text-sm">
                    <span className="flex items-center gap-1 text-gray-400">
                      {getVisibilityIcon(character.visibility_status)}
                      {getVisibilityText(character.visibility_status)}
                    </span>
                    <span className="flex items-center gap-1 text-gray-400">
                      <MessageCircle className="w-4 h-4" />
                      {character.interaction_count}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/chat/${character.id}`}
                      className="flex-1 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-center text-sm font-medium"
                    >
                      对话
                    </Link>
                    <Link
                      href={`/character/${character.id}`}
                      className="flex-1 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors text-center text-sm font-medium"
                    >
                      查看
                    </Link>
                    <button
                      onClick={() => handleDelete(character.id, character.character_name)}
                      className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

