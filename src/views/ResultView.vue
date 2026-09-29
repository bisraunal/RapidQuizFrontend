<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuizStore } from '@/stores/quiz'
import confetti from 'canvas-confetti'
import LeaderboardTable from '@/components/LeaderboardTable.vue'
import AnswerReview from '@/components/AnswerReview.vue'
import sound from '@/services/sound'
import {
  Trophy,
  Zap,
  CheckCircle2,
  XCircle,
  MinusCircle,
  Clock,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ListOrdered,
  BookOpen,
} from 'lucide-vue-next'

const router = useRouter()
const quizStore = useQuizStore()

const playerName = ref(quizStore.savedPlayerName || '')
const isSubmitted = ref(false)
const inputError = ref('')
const activeTab = ref('leaderboard') // 'leaderboard' or 'review'

onMounted(() => {
  // If no answers exist, redirect to home
  if (quizStore.answers.length === 0) {
    router.push('/')
    return
  }

  // Trigger celebration confetti & chime
  sound.playCelebration()
  triggerConfetti()
})

const triggerConfetti = () => {
  const duration = 2.5 * 1000
  const animationEnd = Date.now() + duration

  const frame = () => {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: ['#06b6d4', '#3b82f6', '#a855f7', '#10b981', '#f59e0b'],
    })
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: ['#06b6d4', '#3b82f6', '#a855f7', '#10b981', '#f59e0b'],
    })

    if (Date.now() < animationEnd) {
      requestAnimationFrame(frame)
    }
  }
  frame()
}

const handleSaveScore = async () => {
  if (!playerName.value.trim()) {
    inputError.value = 'Lütfen skorborda yazılacak bir takma ad girin.'
    return
  }
  if (playerName.value.trim().length < 2) {
    inputError.value = 'Takma ad en az 2 karakter olmalıdır.'
    return
  }

  inputError.value = ''
  try {
    await quizStore.submitScore(playerName.value.trim())
    isSubmitted.value = true
    triggerConfetti()
  } catch (err) {
    // handled in store
  }
}

const handlePlayAgain = () => {
  sound.playClick()
  if (quizStore.currentCategory?.slug) {
    quizStore.startQuiz(quizStore.currentCategory.slug)
  } else {
    router.push('/')
  }
}

const handleChooseCategory = () => {
  sound.playClick()
  quizStore.resetQuiz()
  router.push('/')
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
    <!-- Header Greeting -->
    <div class="text-center mb-8 sm:mb-10">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 shadow-xl shadow-amber-500/20 mb-4 animate-bounce">
        <Trophy class="w-8 h-8" />
      </div>

      <h1 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
        Tebrikler! Quiz Tamamlandı
      </h1>
      <p class="text-slate-400 text-sm sm:text-base mt-2">
        <span class="font-bold text-cyan-400">{{ quizStore.currentCategory?.name }}</span> kategorisinde 20 soruyu tamamladın.
      </p>
    </div>

    <!-- Stats Summary Cards Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-8">
      <!-- Total Questions -->
      <div class="glass-card p-4 sm:p-5 rounded-2xl border border-slate-800 text-center">
        <div class="w-8 h-8 mx-auto mb-2 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
          <Zap class="w-4 h-4" />
        </div>
        <div class="text-xl sm:text-2xl font-black text-slate-100">
          {{ quizStore.answers.length }}
        </div>
        <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Cevaplanan</span>
      </div>

      <!-- Time Taken -->
      <div class="glass-card p-4 sm:p-5 rounded-2xl border border-slate-800 text-center">
        <div class="w-8 h-8 mx-auto mb-2 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
          <Clock class="w-4 h-4" />
        </div>
        <div class="text-xl sm:text-2xl font-black text-slate-100">
          {{ quizStore.answers.reduce((acc, cur) => acc + (cur.time_taken || 0), 0).toFixed(1) }}s
        </div>
        <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Toplam Süre</span>
      </div>

      <!-- Empty / Timeout -->
      <div class="glass-card p-4 sm:p-5 rounded-2xl border border-slate-800 text-center">
        <div class="w-8 h-8 mx-auto mb-2 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
          <MinusCircle class="w-4 h-4" />
        </div>
        <div class="text-xl sm:text-2xl font-black text-slate-100">
          {{ quizStore.answers.filter(a => a.selected_choice_id === null).length }}
        </div>
        <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Süresi Dolan</span>
      </div>

      <!-- Speed Bonus Indicator -->
      <div class="glass-card p-4 sm:p-5 rounded-2xl border border-slate-800 text-center">
        <div class="w-8 h-8 mx-auto mb-2 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
          <Sparkles class="w-4 h-4" />
        </div>
        <div class="text-xl sm:text-2xl font-black text-slate-100">
          +Hız Bonusu
        </div>
        <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Ekstra Puan</span>
      </div>
    </div>

    <!-- 1. State: Name Input Form (Before Submit) -->
    <div
      v-if="!isSubmitted"
      class="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden mb-8"
    >
      <div class="max-w-md mx-auto text-center">
        <h3 class="text-xl font-bold text-slate-100 mb-1">
          Skorunu Kaydet & Lider Tablosuna Gir!
        </h3>
        <p class="text-xs text-slate-400 mb-6">
          Adını veya takma adını girerek puanını skorborda yazdır ve doğru/yanlış cevaplarını incele.
        </p>

        <form @submit.prevent="handleSaveScore" class="space-y-4">
          <div>
            <input
              v-model="playerName"
              type="text"
              maxlength="20"
              placeholder="Örn: EfsaneYazilimci"
              class="w-full px-5 py-3.5 rounded-2xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-center text-lg font-bold focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all"
              :disabled="quizStore.isSubmitting"
            />
            <p v-if="inputError" class="text-xs text-rose-400 font-semibold mt-2">
              {{ inputError }}
            </p>
          </div>

          <button
            type="submit"
            :disabled="quizStore.isSubmitting"
            class="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-base shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span v-if="quizStore.isSubmitting">Hesaplanıyor & Kaydediliyor...</span>
            <span v-else class="flex items-center gap-2">
              Skorunu Gönder & Sonuçları Gör
              <ArrowRight class="w-5 h-5" />
            </span>
          </button>
        </form>
      </div>
    </div>

    <!-- 2. State: Results, Leaderboard & Answer Review (After Submit) -->
    <div v-else class="space-y-8 mb-8">
      <!-- Player Result Highlight Banner -->
      <div class="glass-card p-6 sm:p-8 rounded-3xl border border-cyan-500/40 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 shadow-2xl text-center relative overflow-hidden">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-300 text-xs font-bold mb-3 border border-cyan-400/30">
          <span>🏆 Derecen: {{ quizStore.quizResult?.rank }}. Sıra</span>
        </div>

        <div class="text-4xl sm:text-6xl font-black bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent mb-2">
          {{ quizStore.quizResult?.total_score }} PUAN
        </div>

        <div class="flex items-center justify-center gap-4 text-xs sm:text-sm font-semibold text-slate-300">
          <span class="flex items-center gap-1.5 text-emerald-400 font-bold">
            <CheckCircle2 class="w-4 h-4" />
            {{ quizStore.quizResult?.correct_count }} Doğru
          </span>
          <span>•</span>
          <span class="flex items-center gap-1.5 text-rose-400 font-bold">
            <XCircle class="w-4 h-4" />
            {{ quizStore.quizResult?.wrong_count }} Yanlış
          </span>
          <span>•</span>
          <span class="flex items-center gap-1.5 text-sky-400 font-bold">
            <Clock class="w-4 h-4" />
            {{ quizStore.quizResult?.total_time_taken }}s
          </span>
        </div>
      </div>

      <!-- Navigation Tabs (Leaderboard vs Answer Review) -->
      <div class="flex items-center justify-center gap-3 border-b border-slate-800 pb-4">
        <button
          @click="activeTab = 'leaderboard'"
          class="px-5 py-2.5 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 border"
          :class="[
            activeTab === 'leaderboard'
              ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-lg shadow-amber-400/20'
              : 'glass-card text-slate-300 border-slate-800 hover:bg-slate-800'
          ]"
        >
          <ListOrdered class="w-4 h-4" />
          <span>Lider Tablosu (Top 10)</span>
        </button>

        <button
          @click="activeTab = 'review'"
          class="px-5 py-2.5 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 border"
          :class="[
            activeTab === 'review'
              ? 'bg-cyan-400 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-400/20'
              : 'glass-card text-slate-300 border-slate-800 hover:bg-slate-800'
          ]"
        >
          <BookOpen class="w-4 h-4" />
          <span>Cevapları İncele & Doğruları Gör</span>
        </button>
      </div>

      <!-- Tab 1: Top 10 Leaderboard -->
      <div v-if="activeTab === 'leaderboard'">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <ListOrdered class="w-5 h-5 text-cyan-400" />
            <h3 class="text-xl font-bold text-white">
              {{ quizStore.currentCategory?.name }} — Top 10 Lider Tablosu
            </h3>
          </div>
        </div>

        <LeaderboardTable
          :scores="quizStore.quizResult?.top_10 || []"
          :highlight-player-name="quizStore.quizResult?.player_name"
        />
      </div>

      <!-- Tab 2: Educational Answer Review -->
      <div v-if="activeTab === 'review'">
        <AnswerReview
          :breakdown="quizStore.quizResult?.results_breakdown || []"
        />
      </div>
    </div>

    <!-- Action Buttons Footer -->
    <div class="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
      <button
        @click="handlePlayAgain"
        class="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-cyan-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <RotateCcw class="w-4 h-4" />
        <span>Yeniden Oyna</span>
      </button>

      <button
        @click="handleChooseCategory"
        class="w-full sm:w-auto px-6 py-3.5 rounded-2xl glass-card border-slate-700 text-slate-200 font-bold text-sm hover:bg-slate-800 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <span>Farklı Kategori Seç</span>
      </button>
    </div>
  </div>
</template>
