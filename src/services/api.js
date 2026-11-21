import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? 'https://rapid-quiz-backend.onrender.com/api/v1' : 'http://127.0.0.1:8000/api/v1')

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 45000,
})

// Otomatik yeniden deneme: Render uyku modundan (cold-start) uyanırken veya ağ kopmalarında
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config
    if (!config) return Promise.reject(error)

    config.__retryCount = config.__retryCount || 0
    const maxRetries = 2

    const isNetworkOrTimeout = error.code === 'ECONNABORTED' || !error.response
    const isServerError = error.response && [502, 503, 504].includes(error.response.status)

    if ((isNetworkOrTimeout || isServerError) && config.__retryCount < maxRetries) {
      config.__retryCount += 1
      const delay = config.__retryCount * 2500
      console.warn(`[API] Bağlantı yeniden deneniyor (${config.__retryCount}/${maxRetries}) - ${config.url}`)
      await new Promise((resolve) => setTimeout(resolve, delay))
      return apiClient(config)
    }

    return Promise.reject(error)
  }
)

export default {
  // Categories
  getCategories() {
    return apiClient.get('/categories/')
  },

  // Category questions
  getCategoryQuestions(slug) {
    return apiClient.get(`/categories/${slug}/questions/`)
  },

  // Submit Quiz
  submitQuiz(payload) {
    return apiClient.post('/quiz/submit/', payload)
  },

  // AI Dynamic Quiz Generation
  generateAiQuiz(topic) {
    return apiClient.post('/quiz/generate-ai/', { topic })
  },

  // Leaderboard
  getLeaderboard(category = null) {
    const params = {}
    if (category && category !== 'global') {
      params.category = category
    }
    return apiClient.get('/leaderboard/', { params })
  },

  getGlobalLeaderboard() {
    return apiClient.get('/leaderboard/global/')
  },
}
