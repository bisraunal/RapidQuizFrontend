import { defineStore } from 'pinia'
import api from '@/services/api'
import sound from '@/services/sound'
import router from '@/router'

export const DEFAULT_CATEGORIES = [
  {
    id: 'cat-yazilim',
    name: 'Yazılım',
    slug: 'yazilim',
    icon: 'Code2',
    color_theme: 'cyan',
    music_url: 'https://assets.mixkit.co/music/preview/mixkit-cyber-city-110.mp3',
    music_title: 'Cyber City - Synthwave Code Beat',
    question_count: 20,
  },
  {
    id: 'cat-yapay-zeka',
    name: 'Yapay Zeka',
    slug: 'yapay-zeka',
    icon: 'Bot',
    color_theme: 'purple',
    music_url: 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3',
    music_title: 'Neural Network - Futuristic Tech Beats',
    question_count: 20,
  },
  {
    id: 'cat-teknoloji',
    name: 'Teknoloji',
    slug: 'teknoloji',
    icon: 'Cpu',
    color_theme: 'cyan',
    music_url: 'https://assets.mixkit.co/music/preview/mixkit-electronic-technology-gaming-beat-296.mp3',
    music_title: 'Silicon Pulse - Retro Tech Arp',
    question_count: 20,
  },
  {
    id: 'cat-ulkeler',
    name: 'Ülkeler',
    slug: 'ulkeler',
    icon: 'Globe',
    color_theme: 'amber',
    music_url: 'https://assets.mixkit.co/music/preview/mixkit-world-odyssey-120.mp3',
    music_title: 'World Odyssey - Global Acoustic Journey',
    question_count: 20,
  },
  {
    id: 'cat-fizik',
    name: 'Fizik',
    slug: 'fizik',
    icon: 'Atom',
    color_theme: 'blue',
    music_url: 'https://assets.mixkit.co/music/preview/mixkit-cosmic-horizon-95.mp3',
    music_title: 'Cosmic Horizon - Deep Space Ambient',
    question_count: 20,
  },
  {
    id: 'cat-futbol',
    name: 'Futbol',
    slug: 'futbol',
    icon: 'Trophy',
    color_theme: 'emerald',
    music_url: 'https://assets.mixkit.co/music/preview/mixkit-stadium-champions-140.mp3',
    music_title: 'Stadium Champions - Energetic Rock Beat',
    question_count: 20,
  },
  {
    id: 'cat-ascilik',
    name: 'Aşçılık',
    slug: 'ascilik',
    icon: 'ChefHat',
    color_theme: 'orange',
    music_url: 'https://assets.mixkit.co/music/preview/mixkit-bistro-gourmet-105.mp3',
    music_title: 'Bistro Gourmet - Cozy Kitchen Bossa Nova',
    question_count: 20,
  },
  {
    id: 'cat-sinema',
    name: 'Sinema',
    slug: 'sinema',
    icon: 'Clapperboard',
    color_theme: 'purple',
    music_url: 'https://assets.mixkit.co/music/preview/mixkit-cinematic-mystery-suspense-hum-2852.mp3',
    music_title: 'Cinematic Drama - Film Score',
    question_count: 20,
  },
  {
    id: 'cat-tarih',
    name: 'Tarih',
    slug: 'tarih',
    icon: 'Landmark',
    color_theme: 'amber',
    music_url: 'https://assets.mixkit.co/music/preview/mixkit-ancient-whispers-432.mp3',
    music_title: 'Ancient Empires - Historic Battle',
    question_count: 20,
  },
]

function getInitialCategories() {
  try {
    const cached = localStorage.getItem('rapidquiz_categories')
    if (cached) {
      const parsed = JSON.parse(cached)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch (e) {
    // ignore json error
  }
  return DEFAULT_CATEGORIES
}

export const useQuizStore = defineStore('quiz', {
  state: () => ({
    categories: getInitialCategories(),
    currentCategory: null,
    questions: [],
    currentQuestionIndex: 0,
    answers: [],
    
    // Timer state (10 seconds per question)
    timeRemaining: 10.0,
    questionStartTime: 0,
    timerInterval: null,
    isTimerRunning: false,
    
    // Current question interaction
    selectedChoiceId: null,
    isQuestionAnswered: false,
    
    // Saved Player Nickname in localStorage
    savedPlayerName: localStorage.getItem('rapidquiz_player_name') || '',

    // Final result from backend
    quizResult: null,
    isSubmitting: false,
    isLoading: false,
    isWakingUp: false,
    error: null,
  }),

  getters: {
    totalQuestions: (state) => state.questions.length,
    currentQuestion: (state) => state.questions[state.currentQuestionIndex] || null,
    progressPercentage: (state) => {
      if (!state.questions.length) return 0
      return Math.round(((state.currentQuestionIndex + 1) / state.questions.length) * 100)
    },
    isLastQuestion: (state) => {
      return state.currentQuestionIndex >= state.questions.length - 1
    },
  },

  actions: {
    async fetchCategories() {
      if (!this.categories || this.categories.length === 0) {
        this.isLoading = true
      }
      this.error = null

      const wakeUpTimer = setTimeout(() => {
        this.isWakingUp = true
      }, 2500)

      try {
        const response = await api.getCategories()
        if (Array.isArray(response.data) && response.data.length > 0) {
          this.categories = response.data
          try {
            localStorage.setItem('rapidquiz_categories', JSON.stringify(response.data))
          } catch (e) {
            // ignore localStorage quota
          }
        }
      } catch (err) {
        console.warn('API Kategorileri getirirken uyarı:', err)
        if (!this.categories || this.categories.length === 0) {
          this.categories = DEFAULT_CATEGORIES
          this.error = 'Sunucuya bağlanılamadı, varsayılan kategoriler yüklendi.'
        }
      } finally {
        clearTimeout(wakeUpTimer)
        this.isWakingUp = false
        this.isLoading = false
      }
    },

    async startQuiz(categorySlug) {
      this.resetQuiz()
      this.isLoading = true
      this.error = null
      sound.playClick()

      try {
        const response = await api.getCategoryQuestions(categorySlug)
        const data = response.data
        this.currentCategory = {
          name: data.category,
          slug: data.category_slug,
          icon: data.icon,
          colorTheme: data.color_theme,
          musicUrl: data.music_url,
          musicTitle: data.music_title,
        }
        this.questions = data.questions || []
        this.currentQuestionIndex = 0

        // Start procedural Web Audio background music for the category
        sound.playCategoryBgm(categorySlug)

        if (this.questions.length > 0) {
          router.push(`/quiz/${categorySlug}`)
        } else {
          this.error = 'Bu kategoriye ait soru bulunamadı.'
        }
      } catch (err) {
        console.error('Failed to start quiz:', err)
        this.error = 'Sorular yüklenirken hata oluştu. Backend sunucusunun çalıştığından emin olun.'
      } finally {
        this.isLoading = false
      }
    },

    async startAiQuiz(topic) {
      this.resetQuiz()
      this.isLoading = true
      this.error = null
      sound.playClick()

      try {
        const response = await api.generateAiQuiz(topic)
        const data = response.data
        this.currentCategory = {
          name: data.category,
          slug: data.category_slug,
          icon: data.icon,
          colorTheme: data.color_theme,
          musicUrl: data.music_url,
          musicTitle: data.music_title,
        }
        this.questions = data.questions || []
        this.currentQuestionIndex = 0

        sound.playCategoryBgm(data.category_slug)

        if (this.questions.length > 0) {
          router.push(`/quiz/${data.category_slug}`)
        } else {
          this.error = 'Yapay zeka soru üretemedi, lütfen tekrar deneyin.'
        }
      } catch (err) {
        console.error('Failed to start AI quiz:', err)
        const msg = err.response?.data?.error || 'AI Quiz oluşturulurken hata oluştu. Lütfen tekrar deneyin.'
        this.error = msg
        throw new Error(msg)
      } finally {
        this.isLoading = false
      }
    },

    startQuestionTimer() {
      this.stopQuestionTimer()
      this.timeRemaining = 10.0
      this.selectedChoiceId = null
      this.isQuestionAnswered = false
      this.questionStartTime = Date.now()
      this.isTimerRunning = true

      let lastTickSecond = 10

      const stepMs = 50
      this.timerInterval = setInterval(() => {
        const elapsedSec = (Date.now() - this.questionStartTime) / 1000
        this.timeRemaining = Math.max(0, parseFloat((10.0 - elapsedSec).toFixed(2)))

        // Sound tick on last 3 seconds
        const currentSecFloor = Math.ceil(this.timeRemaining)
        if (currentSecFloor <= 3 && currentSecFloor < lastTickSecond && currentSecFloor > 0) {
          lastTickSecond = currentSecFloor
          sound.playTick()
        }

        if (this.timeRemaining <= 0) {
          this.handleTimeUp()
        }
      }, stepMs)
    },

    stopQuestionTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval)
        this.timerInterval = null
      }
      this.isTimerRunning = false
    },

    handleTimeUp() {
      this.stopQuestionTimer()
      if (!this.isQuestionAnswered) {
        sound.playTimeUp()
        this.recordAnswer(null, 10.0)
        this.scheduleNextQuestion(600)
      }
    },

    selectAnswer(choiceId) {
      if (this.isQuestionAnswered) return // prevent double click

      sound.playClick()
      const elapsedSec = Math.min(10.0, (Date.now() - this.questionStartTime) / 1000)
      this.stopQuestionTimer()
      this.selectedChoiceId = choiceId
      this.isQuestionAnswered = true

      this.recordAnswer(choiceId, parseFloat(elapsedSec.toFixed(2)))
      this.scheduleNextQuestion(500)
    },

    recordAnswer(choiceId, timeTaken) {
      const q = this.currentQuestion
      if (!q) return

      this.answers.push({
        question_id: q.id,
        selected_choice_id: choiceId,
        time_taken: timeTaken,
      })
    },

    scheduleNextQuestion(delayMs = 500) {
      setTimeout(() => {
        if (this.isLastQuestion) {
          this.finishQuiz()
        } else {
          this.currentQuestionIndex++
          this.startQuestionTimer()
        }
      }, delayMs)
    },

    finishQuiz() {
      this.stopQuestionTimer()
      sound.stopBgm()
      router.push('/result')
    },

    async submitScore(playerName) {
      if (!this.currentCategory || !playerName.trim()) return

      const cleanName = playerName.trim()
      this.savedPlayerName = cleanName
      localStorage.setItem('rapidquiz_player_name', cleanName)

      this.isSubmitting = true
      this.error = null

      try {
        const payload = {
          category_slug: this.currentCategory.slug,
          player_name: cleanName,
          answers: this.answers,
        }

        const response = await api.submitQuiz(payload)
        this.quizResult = response.data
        sound.playCelebration()
        return response.data
      } catch (err) {
        console.error('Failed to submit score:', err)
        this.error = 'Skor kaydedilirken bir hata oluştu.'
        throw err
      } finally {
        this.isSubmitting = false
      }
    },

    resetQuiz() {
      this.stopQuestionTimer()
      sound.stopBgm()
      this.questions = []
      this.currentQuestionIndex = 0
      this.answers = []
      this.timeRemaining = 10.0
      this.selectedChoiceId = null
      this.isQuestionAnswered = false
      this.quizResult = null
      this.error = null
    },
  },
})
