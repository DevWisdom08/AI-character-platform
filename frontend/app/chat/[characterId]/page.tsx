'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { characterAPI, chatAPI } from '@/lib/api'
import Navbar from '@/components/Navbar'
import { Send, ArrowLeft } from 'lucide-react'

interface Message {
  id: string
  message: string
  response: string
  created_at: string
}

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated, checkAuth } = useAuthStore()
  
  const [character, setCharacter] = useState<any>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const init = async () => {
      await checkAuth()
      if (!isAuthenticated) {
        router.push('/auth/login')
        return
      }

      if (params.characterId) {
        await loadCharacter(params.characterId as string)
        await loadConversation(params.characterId as string)
      }
      setLoading(false)
    }

    init()
  }, [params.characterId, isAuthenticated, checkAuth, router])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadCharacter = async (id: string) => {
    try {
      const data = await characterAPI.getCharacter(id)
      setCharacter(data)
    } catch (err) {
      alert('无法加载角色信息')
      router.push('/characters')
    }
  }

  const loadConversation = async (characterId: string) => {
    try {
      const data = await chatAPI.getConversation(characterId)
      setMessages(data.messages || [])
    } catch (err) {
      console.error('Failed to load conversation:', err)
    }
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() || sending) return

    const userMessage = inputMessage.trim()
    setInputMessage('')
    setSending(true)

    try {
      const response = await chatAPI.sendMessage({
        character_id: params.characterId as string,
        message: userMessage,
      })

      setMessages([...messages, response])
    } catch (err: any) {
      alert(err.response?.data?.detail || '发送失败，请重试')
      setInputMessage(userMessage) // Restore message on error
    } finally {
      setSending(false)
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
        {/* Chat Header */}
        <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 px-6 py-4">
          <div className="container mx-auto max-w-4xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-lg font-bold text-white">
                {character?.character_name?.charAt(0)}
              </div>
              <div>
                <h2 className="text-white font-semibold">{character?.character_name}</h2>
                <p className="text-sm text-gray-400 font-mono">{character?.bazi_profile?.bazi_string}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="container mx-auto max-w-4xl space-y-6">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 py-20">
                <div className="text-6xl mb-4">💬</div>
                <p className="text-lg">开始与 {character?.character_name} 对话吧！</p>
                {character?.greeting_message && (
                  <p className="mt-4 text-purple-400 italic">"{character.greeting_message}"</p>
                )}
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="space-y-4">
                  {/* User Message */}
                  <div className="flex justify-end">
                    <div className="max-w-[70%] bg-purple-600 text-white rounded-2xl rounded-tr-sm px-4 py-3">
                      <p>{msg.message}</p>
                    </div>
                  </div>

                  {/* Character Response */}
                  <div className="flex justify-start">
                    <div className="max-w-[70%] bg-slate-800 text-white rounded-2xl rounded-tl-sm px-4 py-3 border border-slate-700">
                      <p>{msg.response}</p>
                    </div>
                  </div>
                </div>
              ))
            )}

            {sending && (
              <div className="flex justify-start">
                <div className="max-w-[70%] bg-slate-800 text-gray-400 rounded-2xl rounded-tl-sm px-4 py-3 border border-slate-700">
                  <p>正在思考...</p>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-slate-800/50 backdrop-blur-sm border-t border-slate-700 px-4 py-4">
          <div className="container mx-auto max-w-4xl">
            <form onSubmit={handleSend} className="flex gap-4">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={sending}
                placeholder="输入消息..."
                className="flex-1 px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || sending}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                发送
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

