<script setup>
import { useRouter, useRoute } from 'vue-router'
import { Zap, Trophy, Home } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
</script>

<template>
  <header class="sticky top-0 z-50 glass-card border-b border-slate-800/80">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
      <!-- Logo -->
      <router-link to="/" class="flex items-center gap-2.5 group">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-300">
          <Zap class="w-5 h-5 text-slate-950 fill-slate-950" />
        </div>
        <div>
          <span class="text-xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
            RAPID QUIZ
          </span>
          <span class="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-cyan-950/60 text-cyan-400 border border-cyan-800/50">
            5s Refleks
          </span>
        </div>
      </router-link>

      <!-- Navigation Actions -->
      <nav class="flex items-center gap-2">
        <router-link
          to="/"
          class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200"
          :class="route.path === '/' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'"
        >
          <Home class="w-4 h-4" />
          <span class="hidden sm:inline">Kategoriler</span>
        </router-link>

        <router-link
          to="/leaderboard"
          class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200"
          :class="route.path === '/leaderboard' ? 'bg-slate-800 text-amber-400' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'"
        >
          <Trophy class="w-4 h-4 text-amber-400" />
          <span>Lider Tablosu</span>
        </router-link>
      </nav>
    </div>
  </header>
</template>
