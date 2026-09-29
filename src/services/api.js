import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

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
