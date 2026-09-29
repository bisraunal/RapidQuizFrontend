<script setup>
import { onMounted } from 'vue'
import { useQuizStore } from '@/stores/quiz'
import CategoryCard from '@/components/CategoryCard.vue'
import { Zap, Clock, Trophy, Sparkles, AlertCircle } from 'lucide-vue-next'

const quizStore = useQuizStore()

onMounted(() => {
  quizStore.fetchCategories()
})

const handleCategorySelect = (slug) => {
  quizStore.startQuiz(slug)
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
        5 Saniyede Bil,<br />
        <span class="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
          Zirveye Yerleş!
        </span>
      </h1>

      <p class="text-slate-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-8">
        Her soru için tam 5 saniye süren var. Doğru cevabı ne kadar hızlı verirsen o kadar yüksek bonus puan kazanırsın!
      </p>

      <!-- Feature pills -->
      <div class="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-300">
        <div class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800">
          <Clock class="w-4 h-4 text-cyan-400" />
          <span>Soru Başına 5s Kısıtı</span>
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
