<script setup>
import { ref, onMounted } from 'vue'
import { useQuizStore } from '@/stores/quiz'
import CategoryCard from '@/components/CategoryCard.vue'
import { Zap, Clock, Trophy, Sparkles, AlertCircle, Wand2, Loader2 } from 'lucide-vue-next'

const quizStore = useQuizStore()
const aiTopic = ref('')
const isGeneratingAi = ref(false)
const aiError = ref(null)

const quickTopics = [
  'Coğrafya',
  'Kuantum Fiziği',
  'Yüzüklerin Efendisi',
  'Cyberpunk 2077',
  'Yunan Mitolojisi',
  'Formula 1',
  'Edebiyat',
]

onMounted(() => {
  quizStore.fetchCategories()
})

const handleCategorySelect = (slug) => {
  quizStore.startQuiz(slug)
}

const handleGenerateAiQuiz = async (customTopic = null) => {
  const topicToUse = (typeof customTopic === 'string' ? customTopic : aiTopic.value).trim()
  if (!topicToUse) return

  isGeneratingAi.value = true
  aiError.value = null
  try {
    await quizStore.startAiQuiz(topicToUse)
  } catch (err) {
    aiError.value = err.message || quizStore.error || 'Quiz üretilirken bir sorun oluştu.'
  } finally {
    isGeneratingAi.value = false
  }
}
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
    <!-- Hero Banner -->
    <div class="relative text-center mb-12 sm:mb-16">
      <!-- Glow background -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-96 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border-cyan-500/30 text-cyan-300 text-xs sm:text-sm font-semibold mb-6 animate-pulse">
        <Sparkles class="w-4 h-4 text-cyan-400" />
        <span>Hızlı Düşün, Anlık Cevapla!</span>
      </div>

      <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-4">
        10 Saniyede Bil,<br />
        <span class="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
          Zirveye Yerleş!
        </span>
      </h1>

      <p class="text-slate-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-8">
        Her soru için tam 10 saniye süren var. Doğru cevabı ne kadar hızlı verirsen o kadar yüksek bonus puan kazanırsın!
      </p>

      <!-- Feature pills -->
      <div class="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-300">
        <div class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800">
          <Clock class="w-4 h-4 text-cyan-400" />
          <span>Soru Başına 10s Kısıtı</span>
        </div>
        <div class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800">
          <Zap class="w-4 h-4 text-amber-400" />
          <span>Hız Bonusu Puanı</span>
        </div>
        <div class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800">
          <Trophy class="w-4 h-4 text-purple-400" />
          <span>Canlı Top 10 Skorbord</span>
        </div>
      </div>
    </div>

    <!-- AI Custom Quiz Generator Card -->
    <div class="mb-14 relative group">
      <div class="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 rounded-3xl blur opacity-35 group-hover:opacity-70 transition duration-500"></div>
      <div class="relative glass-card p-6 sm:p-8 rounded-3xl border border-purple-500/30 bg-slate-900/90 shadow-2xl">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="max-w-xl">
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-700/50 text-purple-300 text-xs font-bold mb-2.5">
              <Sparkles class="w-3.5 h-3.5 text-purple-400" />
              <span>GEMINI AI QUIZ</span>
            </div>
            <h3 class="text-xl sm:text-2xl font-black text-white tracking-tight mb-1.5">
              İstediğin Konuda Quiz Başlat
            </h3>
            <p class="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Konunu yaz; yapay zeka 5 soruluk 10s refleks testini anında hazırlasın.
            </p>
          </div>

          <div class="w-full md:w-auto flex-1 max-w-md">
            <form @submit.prevent="handleGenerateAiQuiz()" class="flex flex-col sm:flex-row gap-2.5">
              <input
                v-model="aiTopic"
                type="text"
                placeholder="örn. Kuantum Fiziği, Cyberpunk..."
                class="flex-1 px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 transition-all"
                :disabled="isGeneratingAi"
              />
              <button
                type="submit"
                :disabled="isGeneratingAi || !aiTopic.trim()"
                class="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-purple-500/25 hover:from-purple-400 hover:to-indigo-500 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <Loader2 v-if="isGeneratingAi" class="w-4 h-4 animate-spin" />
                <Wand2 v-else class="w-4 h-4 text-purple-200" />
                <span>{{ isGeneratingAi ? 'Üretiliyor...' : 'Quiz Oluştur' }}</span>
              </button>
            </form>

            <!-- Quick Suggestions -->
            <div class="flex flex-wrap items-center gap-1.5 mt-3 text-[11px] text-slate-400">
              <span class="text-slate-500 font-semibold">Örnekler:</span>
              <button
                v-for="qt in quickTopics"
                :key="qt"
                @click="handleGenerateAiQuiz(qt)"
                :disabled="isGeneratingAi"
                type="button"
                class="px-2.5 py-0.5 rounded-md bg-slate-800/80 hover:bg-purple-900/40 hover:text-purple-300 border border-slate-700/60 hover:border-purple-600/50 transition-all cursor-pointer text-slate-300"
              >
                {{ qt }}
              </button>
            </div>
          </div>
        </div>

        <div v-if="aiError" class="mt-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
          {{ aiError }}
        </div>
      </div>
    </div>

    <!-- Error Alert -->
    <div
      v-if="quizStore.error"
      class="mb-8 p-4 rounded-2xl bg-rose-950/50 border border-rose-800/80 text-rose-300 text-sm flex items-center gap-3"
    >
      <AlertCircle class="w-5 h-5 shrink-0 text-rose-400" />
      <span>{{ quizStore.error }}</span>
    </div>

    <!-- Category Section Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-extrabold text-white tracking-tight">Kategoriler</h2>
        <p class="text-xs sm:text-sm text-slate-400 mt-0.5">Yarışmak istediğin kategoriyi seçerek hemen başla</p>
      </div>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="quizStore.isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <div
        v-for="i in 5"
        :key="i"
        class="glass-card p-6 rounded-2xl border border-slate-800 animate-pulse h-56 flex flex-col justify-between"
      >
        <div class="w-12 h-12 bg-slate-800 rounded-xl"></div>
        <div class="space-y-2">
          <div class="w-3/4 h-5 bg-slate-800 rounded"></div>
          <div class="w-1/2 h-3 bg-slate-800 rounded"></div>
        </div>
        <div class="w-full h-8 bg-slate-800/50 rounded-lg"></div>
      </div>
    </div>

    <!-- Category Cards Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <CategoryCard
        v-for="category in quizStore.categories"
        :key="category.id"
        :category="category"
        @select="handleCategorySelect"
      />
    </div>
  </div>
</template>
