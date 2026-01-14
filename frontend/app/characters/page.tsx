'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { characterAPI } from '@/lib/api'
import Navbar from '@/components/Navbar'
import { Users, MessageCircle, Heart } from 'lucide-react'

interface Character {
  id: string
  character_name: string
  description: string
  greeting_message: string
  tags: string[]
  interaction_count: number
  favorite_count: number
  bazi_profile: {
    bazi_string: string
    day_master: string
    personality_summary: string
  }
}

export default function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    loadCharacters()
  }, [page])

  const loadCharacters = async () => {
    setLoading(true)
    try {
      const data = await characterAPI.getPublicCharacters(page, 12)
      setCharacters(data.characters)
      setTotal(data.total)
    } catch (err) {
      console.error('Failed to load characters:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-4 flex items-center gap-3">
              <Users className="w-10 h-10" />
              角色广场
            </h1>
            <p className="text-gray-400 text-lg">
              探索社区创造的精彩角色，开启你的对话之旅
            </p>
          </div>

          {/* Characters Grid */}
          {loading ? (
            <div className="text-center text-white py-20">
              <div className="text-xl">加载中...</div>
            </div>
          ) : characters.length === 0 ? (
            <div className="text-center text-gray-400 py-20">
              <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <div className="text-xl">暂无公开角色</div>
              <p className="mt-2">成为第一个创建并分享角色的人吧！</p>
              <Link
                href="/character/create"
                className="inline-block mt-6 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                创建角色
              </Link>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {characters.map((character) => (
                  <Link
                    key={character.id}
                    href={`/character/${character.id}`}
                    className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6 hover:border-purple-500 transition-all group"
                  >
                    {/* Character Avatar */}
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-4 text-3xl font-bold text-white mx-auto group-hover:scale-110 transition-transform">
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
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2 text-center">
                      {character.greeting_message || character.description}
                    </p>

                    {/* Tags */}
                    {character.tags && character.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 justify-center mb-4">
                        {character.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-slate-700 text-gray-300 rounded text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex justify-center gap-6 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{character.interaction_count}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>{character.favorite_count}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {total > 12 && (
                <div className="mt-12 flex justify-center gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    上一页
                  </button>
                  <span className="px-4 py-2 text-white">
                    第 {page} 页
                  </span>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page * 12 >= total}
                    className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    下一页
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}

