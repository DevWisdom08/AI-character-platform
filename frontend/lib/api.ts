import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

// Create axios instance
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth API
export const authAPI = {
  register: async (data: { email: string; password: string; username: string }) => {
    const response = await api.post('/auth/register', data)
    return response.data
  },
  
  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/auth/login', data)
    return response.data
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout')
    return response.data
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },
}

// Profile API
export const profileAPI = {
  createBaZiProfile: async (data: any) => {
    const response = await api.post('/profile/bazi', data)
    return response.data
  },
  
  getMyBaZiProfile: async () => {
    const response = await api.get('/profile/bazi/me')
    return response.data
  },
  
  deleteMyBaZiProfile: async () => {
    const response = await api.delete('/profile/bazi/me')
    return response.data
  },
}

// Character API
export const characterAPI = {
  createCharacter: async (data: any) => {
    const response = await api.post('/character/create', data)
    return response.data
  },
  
  getMyCharacters: async (page = 1, pageSize = 20) => {
    const response = await api.get('/character/my-characters', {
      params: { page, page_size: pageSize }
    })
    return response.data
  },
  
  getPublicCharacters: async (page = 1, pageSize = 20) => {
    const response = await api.get('/character/public', {
      params: { page, page_size: pageSize }
    })
    return response.data
  },
  
  getCharacter: async (id: string) => {
    const response = await api.get(`/character/${id}`)
    return response.data
  },
  
  deleteCharacter: async (id: string) => {
    const response = await api.delete(`/character/${id}`)
    return response.data
  },
}

// Chat API
export const chatAPI = {
  sendMessage: async (data: { character_id: string; message: string }) => {
    const response = await api.post('/chat/send', data)
    return response.data
  },
  
  getConversation: async (characterId: string) => {
    const response = await api.get(`/chat/conversation/${characterId}`)
    return response.data
  },
  
  getMyConversations: async () => {
    const response = await api.get('/chat/my-conversations')
    return response.data
  },
}

