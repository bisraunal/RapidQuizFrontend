<script setup>
import { onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuizStore } from '@/stores/quiz'
import sound from '@/services/sound'
import TimerBar from '@/components/TimerBar.vue'
import QuestionCard from '@/components/QuestionCard.vue'
import { X, HelpCircle, Zap, Music } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const quizStore = useQuizStore()

onMounted(() => {
  // If user enters directly without questions loaded in store
  if (quizStore.questions.length === 0) {
    if (route.params.slug) {
      quizStore.startQuiz(route.params.slug).then(() => {
        if (quizStore.questions.length > 0) {
          quizStore.startQuestionTimer()
        }
      })
    } else {
      router.push('/')
    }
  } else {
    quizStore.startQuestionTimer()
  }

  window.addEventListener('keydown', handleKeyPress)
})

onBeforeUnmount(() => {
  quizStore.stopQuestionTimer()
  sound.stopBgm()
  window.removeEventListener('keydown', handleKeyPress)
})

const handleKeyPress = (e) => {
  if (quizStore.isQuestionAnswered || !quizStore.currentQuestion) return

  const key = e.key.toUpperCase()
  const choices = quizStore.currentQuestion.choices || []

  if (['1', 'A'].includes(key) && choices[0]) quizStore.selectAnswer(choices[0].id)
  if (['2', 'B'].includes(key) && choices[1]) quizStore.selectAnswer(choices[1].id)
  if (['3', 'C'].includes(key) && choices[2]) quizStore.selectAnswer(choices[2].id)
  if (['4', 'D'].includes(key) && choices[3]) quizStore.selectAnswer(choices[3].id)
}

const handleExitQuiz = () => {
  if (confirm('Quizden çıkmak istediğinize emin misiniz? İlerlemeniz kaydedilmeyecektir.')) {
    quizStore.resetQuiz()
    router.push('/')
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
    <!-- Top Quiz Navigation -->
    <div class="flex items-center justify-between mb-6">
      <!-- Category Badge -->
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30 font-bold">
          <Zap class="w-4 h-4" />
        </div>
        <div>
          <span class="text-xs uppercase font-bold tracking-wider text-slate-400 block">Kategori</span>
          <span class="text-sm font-extrabold text-slate-100">{{ quizStore.currentCategory?.name || 'Quiz' }}</span>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <!-- Playing BGM Indicator -->
        <div
          v-if="quizStore.currentCategory?.musicTitle"
          class="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] text-cyan-400/90 shadow-sm"
          title="Çalan Arka Plan Müziği"
        >
          <Music class="w-3 h-3 text-cyan-400 animate-pulse" />
          <span class="max-w-[180px] truncate font-medium">{{ quizStore.currentCategory.musicTitle }}</span>
        </div>

        <!-- Exit Button -->
        <button
          @click="handleExitQuiz"
          class="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 transition-colors border border-slate-800"
          title="Quizden Çık"
        >
          <X class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Timer Bar (5s Count Down) -->
    <div class="mb-6">
      <TimerBar
        :time-remaining="quizStore.timeRemaining"
        :max-time="5.0"
      />
    </div>

    <!-- Overall Progress Line -->
    <div class="w-full bg-slate-900 rounded-full h-1.5 mb-8 overflow-hidden">
      <div
        class="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full rounded-full transition-all duration-300"
        :style="{ width: `${quizStore.progressPercentage}%` }"
      ></div>
    </div>

    <!-- Current Question Card -->
    <div v-if="quizStore.currentQuestion" class="transition-all duration-300">
      <QuestionCard
        :question="quizStore.currentQuestion"
        :question-number="quizStore.currentQuestionIndex + 1"
        :total-questions="quizStore.totalQuestions"
        :selected-choice-id="quizStore.selectedChoiceId"
        :is-answered="quizStore.isQuestionAnswered"
        @select-choice="quizStore.selectAnswer"
      />
    </div>

    <!-- Keyboard Shortcuts Hint (Desktop) -->
    <div class="mt-6 text-center text-xs text-slate-400 hidden sm:block">
      <span>💡 Klavye Kısayolu: Şıkları seçmek için <b>A, B, C, D</b> veya <b>1, 2, 3, 4</b> tuşlarına basabilirsiniz.</span>
    </div>
  </div>
</template>
