<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import LeaderboardTable from '@/components/LeaderboardTable.vue'
import { Trophy, Globe, Zap, ArrowLeft, RotateCw } from 'lucide-vue-next'

const router = useRouter()

const categories = ref([])
const activeCategorySlug = ref('global')
const leaderboardScores = ref([])
const isLoading = ref(false)
const error = ref(null)

onMounted(async () => {
  await fetchCategories()
  await fetchLeaderboard('global')
})

const fetchCategories = async () => {
  try {
    const res = await api.getCategories()
    categories.value = res.data
  } catch (err) {
    console.error('Failed to fetch categories:', err)
  }
}

const fetchLeaderboard = async (slug) => {
  activeCategorySlug.value = slug
  isLoading.value = true
  error.value = null
  try {
    const res = slug === 'global' ? await api.getGlobalLeaderboard() : await api.getLeaderboard(slug)
    leaderboardScores.value = res.data.leaderboard || []
  } catch (err) {
    console.error('Failed to load leaderboard:', err)
    error.value = 'Lider tablosu yüklenirken bir hata oluştu.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
    <!-- Header -->
    <div class="text-center mb-8">
      <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-400/15 border border-amber-400/30 text-amber-400 mb-3 shadow-lg shadow-amber-500/10">
        <Trophy class="w-7 h-7" />
      </div>
      <h1 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
        Lider Tablosu (Top 10)
      </h1>
      <p class="text-slate-400 text-xs sm:text-sm mt-1">
        En hızlı düşünen ve en yüksek puanı toplayan yarışmacılar
      </p>
    </div>

    <!-- Category Tabs Filter -->
    <div class="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
      <!-- Global Tab -->
      <button
        @click="fetchLeaderboard('global')"
        class="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border"
        :class="[
          activeCategorySlug === 'global'
            ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md shadow-amber-400/20'
            : 'glass-card text-slate-300 border-slate-800 hover:bg-slate-800'
        ]"
      >
        <Globe class="w-4 h-4" />
        <span>Genel Sıralama</span>
      </button>

      <!-- Category Tabs -->
      <button
        v-for="cat in categories"
        :key="cat.id"
        @click="fetchLeaderboard(cat.slug)"
        class="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border"
        :class="[
          activeCategorySlug === cat.slug
            ? 'bg-cyan-400 text-slate-950 border-cyan-400 shadow-md shadow-cyan-400/20'
            : 'glass-card text-slate-300 border-slate-800 hover:bg-slate-800'
        ]"
      >
        {{ cat.name }}
      </button>
    </div>

    <!-- Loading / Table Content -->
    <div v-if="isLoading" class="glass-card p-12 rounded-3xl border border-slate-800 text-center">
      <RotateCw class="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-3" />
      <p class="text-sm font-semibold text-slate-300">Skorlar getiriliyor...</p>
    </div>

    <div v-else>
      <LeaderboardTable :scores="leaderboardScores" />
    </div>

    <!-- Quick Play Action -->
    <div class="text-center mt-10">
      <router-link
        to="/"
        class="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 transition-all"
      >
        <Zap class="w-4 h-4" />
        <span>Hemen Bir Kategori Seç ve Yarış</span>
      </router-link>
    </div>
  </div>
</template>
