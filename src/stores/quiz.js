import { defineStore } from 'pinia'
import api from '@/services/api'
import router from '@/router'

export const useQuizStore = defineStore('quiz', {
  state: () => ({
    categories: [],
    currentCategory: null,
    questions: [],
    currentQuestionIndex: 0,
    answers: [],
    
    // Timer state (5 seconds per question)
    timeRemaining: 5.0,
    questionStartTime: 0,
    timerInterval: null,
    isTimerRunning: false,
    
    // Current question interaction
    selectedChoiceId: null,
    isQuestionAnswered: false,
    
    // Final result from backend
    quizResult: null,
    isSubmitting: false,
    isLoading: false,
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
      this.isLoading = true
      this.error = null
      try {
        const response = await api.getCategories()
        this.categories = response.data
      } catch (err) {
        console.error('Failed to fetch categories:', err)
        this.error = 'Kategoriler yüklenirken bir hata oluştu.'
      } finally {
        this.isLoading = false
      }
    },

    async startQuiz(categorySlug) {
      this.resetQuiz()
      this.isLoading = true
      this.error = null

      try {
        const response = await api.getCategoryQuestions(categorySlug)
        const data = response.data
        this.currentCategory = {
          name: data.category,
          slug: data.category_slug,
          icon: data.icon,
          colorTheme: data.color_theme,
        }
        this.questions = data.questions || []
        this.currentQuestionIndex = 0

        if (this.questions.length > 0) {
          router.push(`/quiz/${categorySlug}`)
        } else {
          this.error = 'Bu kategoriye ait soru bulunamadı.'
        }
      } catch (err) {
        console.error('Failed to start quiz:', err)
        this.error = 'Sorular yüklenirken hata oluştu. Lütfen tekrar deneyin.'
      } finally {
        this.isLoading = false
      }
    },

    startQuestionTimer() {
      this.stopQuestionTimer()
      this.timeRemaining = 5.0
      this.selectedChoiceId = null
      this.isQuestionAnswered = false
      this.questionStartTime = Date.now()
      this.isTimerRunning = true

      const stepMs = 50
      this.timerInterval = setInterval(() => {
        const elapsedSec = (Date.now() - this.questionStartTime) / 1000
        this.timeRemaining = Math.max(0, parseFloat((5.0 - elapsedSec).toFixed(2)))

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
        this.recordAnswer(null, 5.0)
        this.scheduleNextQuestion(600)
      }
    },

    selectAnswer(choiceId) {
      if (this.isQuestionAnswered) return // prevent double click

      const elapsedSec = Math.min(5.0, (Date.now() - this.questionStartTime) / 1000)
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
      router.push('/result')
    },

    async submitScore(playerName) {
      if (!this.currentCategory || !playerName.trim()) return

      this.isSubmitting = true
      this.error = null

      try {
        const payload = {
          category_slug: this.currentCategory.slug,
          player_name: playerName.trim(),
          answers: this.answers,
        }

        const response = await api.submitQuiz(payload)
        this.quizResult = response.data
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
      this.questions = []
      this.currentQuestionIndex = 0
      this.answers = []
      this.timeRemaining = 5.0
      this.selectedChoiceId = null
      this.isQuestionAnswered = false
      this.quizResult = null
      this.error = null
    },
  },
})
