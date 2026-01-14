'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { characterAPI } from '@/lib/api'
import Navbar from '@/components/Navbar'
import { MessageCircle, Heart, Share2, Calendar, User as UserIcon } from 'lucide-react'

export default function CharacterDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [character, setCharacter] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      loadCharacter(params.id as string)
    }
  }, [params.id])

  const loadCharacter = async (id: string) => {
    setLoading(true)
    try {
      const data = await characterAPI.getCharacter(id)
      setCharacter(data)
    } catch (err) {
      console.error('Failed to load character:', err)
      alert('角色不存在或已被删除')
      router.push('/characters')
    } finally {
      setLoading(false)
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

  if (!character) {
    return null
  }

  const bazi = character.bazi_profile

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Character Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-700 overflow-hidden">
            {/* Hero Section */}
            <div className="relative p-8 bg-gradient-to-br from-purple-600/20 to-pink-600/20">
              {/* Avatar */}
              <div className="w-32 h-32 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-5xl font-bold text-white mx-auto mb-6">
                {character.character_name.charAt(0)}
              </div>

              {/* Name & Greeting */}
              <h1 className="text-4xl font-bold text-white text-center mb-3">
                {character.character_name}
              </h1>
              {character.greeting_message && (
                <p className="text-lg text-gray-300 text-center italic mb-4">
                  "{character.greeting_message}"
                </p>
              )}

              {/* BaZi String */}
              <div className="text-center mb-4">
                <span className="text-2xl font-mono text-purple-400">
                  {bazi.bazi_string}
                </span>
              </div>

              {/* Stats */}
              <div className="flex justify-center gap-8 text-sm">
                <div className="flex items-center gap-2 text-gray-300">
                  <MessageCircle className="w-5 h-5" />
                  <span>{character.interaction_count} 次互动</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Heart className="w-5 h-5" />
                  <span>{character.favorite_count} 次收藏</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 border-b border-slate-700 flex gap-4">
              <Link
                href={`/chat/${character.id}`}
                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all text-center flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                与TA对话
              </Link>
              <button className="px-4 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors">
                <Heart className="w-5 h-5" />
              </button>
              <button className="px-4 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Character Info */}
            <div className="p-8 space-y-6">
              {/* Description */}
              {character.description && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">角色描述</h3>
                  <p className="text-gray-400 leading-relaxed">{character.description}</p>
                </div>
              )}

              {/* Personality Summary */}
              {bazi.personality_summary && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">性格特质</h3>
                  <p className="text-gray-400 leading-relaxed">{bazi.personality_summary}</p>
                </div>
              )}

              {/* BaZi Details */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">命理详情</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                    <div className="text-sm text-gray-400 mb-1">日主</div>
                    <div className="text-2xl font-bold text-purple-400">{bazi.day_master}</div>
                  </div>
                  <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                    <div className="text-sm text-gray-400 mb-1">主要元素</div>
                    <div className="text-2xl font-bold text-pink-400">{bazi.primary_element}</div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {character.tags && character.tags.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">标签</h3>
                  <div className="flex flex-wrap gap-2">
                    {character.tags.map((tag: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Creator Info */}
              <div className="pt-6 border-t border-slate-700 flex items-center justify-between text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4" />
                  <span>创作者ID: {character.creator_id.slice(0, 8)}...</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>创建于: {new Date(character.created_at).toLocaleDateString('zh-CN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

