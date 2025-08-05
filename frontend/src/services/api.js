import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

class NewsAPI {
  static async getArticles(params = {}) {
    try {
      const response = await api.get('/news/articles', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching articles:', error)
      throw error
    }
  }

  static async getArticle(id) {
    try {
      const response = await api.get(`/news/articles/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching article:', error)
      throw error
    }
  }

  static async getBreakingNews() {
    try {
      const response = await api.get('/news/articles/breaking')
      return response.data
    } catch (error) {
      console.error('Error fetching breaking news:', error)
      return []
    }
  }

  static async getTrendingNews() {
    try {
      const response = await api.get('/news/articles/trending')
      return response.data
    } catch (error) {
      console.error('Error fetching trending news:', error)
      return []
    }
  }

  static async getSyrianAffairs(params = {}) {
    try {
      const response = await api.get('/news/articles/syrian-affairs', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching Syrian affairs:', error)
      return { articles: [] }
    }
  }

  static async getSources() {
    try {
      const response = await api.get('/news/sources')
      return response.data
    } catch (error) {
      console.error('Error fetching sources:', error)
      return []
    }
  }

  static async getStats() {
    try {
      const response = await api.get('/news/stats')
      return response.data
    } catch (error) {
      console.error('Error fetching stats:', error)
      return {}
    }
  }

  static async getAutomationStatus() {
    try {
      const response = await api.get('/automation/status')
      return response.data
    } catch (error) {
      console.error('Error fetching automation status:', error)
      return {}
    }
  }

  static async toggleAutomation() {
    try {
      const response = await api.post('/automation/toggle')
      return response.data
    } catch (error) {
      console.error('Error toggling automation:', error)
      throw error
    }
  }

  static async updateAutomationSettings(settings) {
    try {
      const response = await api.put('/automation/settings', settings)
      return response.data
    } catch (error) {
      console.error('Error updating automation settings:', error)
      throw error
    }
  }

  static async manualScrape(sourceKey = null) {
    try {
      const response = await api.post('/automation/manual-scrape', { source_key: sourceKey })
      return response.data
    } catch (error) {
      console.error('Error during manual scrape:', error)
      throw error
    }
  }

  static async getAnalytics(timeRange = '7days') {
    try {
      const response = await api.get('/analytics', { params: { time_range: timeRange } })
      return response.data
    } catch (error) {
      console.error('Error fetching analytics:', error)
      return {}
    }
  }

  static async generateBulletin(params) {
    try {
      const response = await api.post('/presenter/generate-bulletin', params)
      return response.data
    } catch (error) {
      console.error('Error generating bulletin:', error)
      throw error
    }
  }

  static async getBulletinHistory() {
    try {
      const response = await api.get('/presenter/bulletins')
      return response.data
    } catch (error) {
      console.error('Error fetching bulletin history:', error)
      return []
    }
  }

  static async addComment(articleId, commentData) {
    try {
      const response = await api.post(`/news/articles/${articleId}/comments`, commentData)
      return response.data
    } catch (error) {
      console.error('Error adding comment:', error)
      throw error
    }
  }

  static async getComments(articleId) {
    try {
      const response = await api.get(`/news/articles/${articleId}/comments`)
      return response.data
    } catch (error) {
      console.error('Error fetching comments:', error)
      return []
    }
  }
}

export default NewsAPI
