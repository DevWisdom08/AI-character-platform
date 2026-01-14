import Link from 'next/link'
import { ArrowRight, Sparkles, Users, MessageCircle } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-6xl font-bold text-white mb-4">
              XWAN <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">AI</span>
            </h1>
            <p className="text-2xl text-purple-300 font-light">
              Discover your Ego, Define your Echo
            </p>
          </div>

          {/* Description */}
          <div className="mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <p className="text-lg text-gray-300 mb-6">
              基于命理学与AI融合的角色创造与对话平台
            </p>
            <p className="text-gray-400">
              通过独创的"灵魂锻造系统"，为你提供既能向内探索自我，又能向外创造连接的个性化对话宇宙
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center mb-16 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Link
              href="/auth/register"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all flex items-center gap-2"
            >
              开始创造
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/auth/login"
              className="px-8 py-4 bg-slate-800 text-white rounded-lg font-semibold hover:bg-slate-700 transition-all border border-slate-700"
            >
              登录
            </Link>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                深度角色创建
              </h3>
              <p className="text-gray-400">
                通过命理学赋予角色独特灵魂，四种创建模式满足所有需求
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 animate-fade-in" style={{ animationDelay: '0.8s' }}>
              <div className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                个性化档案
              </h3>
              <p className="text-gray-400">
                建立你的命理档案，让AI真正理解你的独特个性
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 animate-fade-in" style={{ animationDelay: '1s' }}>
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                深度对话体验
              </h3>
              <p className="text-gray-400">
                与角色进行真实、有深度的对话互动，探索无限可能
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

