<script setup>
import { Trophy, Medal, Clock, CheckCircle2, Award } from 'lucide-vue-next'

const props = defineProps({
  scores: {
    type: Array,
    required: true,
    default: () => [],
  },
  highlightPlayerName: {
    type: String,
    default: null,
  },
})

const getRankBadge = (rank) => {
  if (rank === 1) return { bg: 'bg-amber-400/20 text-amber-300 border-amber-500/40', icon: '🥇', label: '1.' }
  if (rank === 2) return { bg: 'bg-slate-300/20 text-slate-200 border-slate-400/40', icon: '🥈', label: '2.' }
  if (rank === 3) return { bg: 'bg-amber-700/20 text-amber-500 border-amber-600/40', icon: '🥉', label: '3.' }
  return { bg: 'bg-slate-800 text-slate-400 border-slate-700', icon: null, label: `${rank}.` }
}
</script>

<template>
  <div class="w-full">
    <!-- Empty State -->
    <div v-if="!scores || scores.length === 0" class="text-center py-12 glass-card rounded-2xl border border-slate-800">
      <Trophy class="w-12 h-12 text-slate-600 mx-auto mb-3" />
      <h4 class="text-base font-bold text-slate-300">Henüz skor kaydı bulunmuyor</h4>
      <p class="text-xs text-slate-500 mt-1">İlk quizi tamamla ve zirveye yerleş!</p>
    </div>

    <!-- Leaderboard Table -->
    <div v-else class="space-y-2.5">
      <div
        v-for="(item, index) in scores"
        :key="item.id || index"
        class="glass-card p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between"
        :class="[
          item.player_name === highlightPlayerName
            ? 'border-cyan-400 bg-cyan-950/40 shadow-[0_0_25px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400'
            : index < 3
            ? 'border-slate-700/80 bg-slate-900/80'
            : 'border-slate-800/60 bg-slate-900/40'
        ]"
      >
        <!-- Left: Rank & Player Info -->
        <div class="flex items-center gap-3.5 min-w-0">
          <!-- Rank Badge -->
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm border shrink-0"
            :class="getRankBadge(index + 1).bg"
          >
            <span v-if="getRankBadge(index + 1).icon" class="text-lg">
              {{ getRankBadge(index + 1).icon }}
            </span>
            <span v-else>
              {{ index + 1 }}
            </span>
          </div>

          <!-- Name & Category -->
          <div class="truncate">
            <div class="flex items-center gap-2">
              <span class="font-bold text-slate-100 text-sm sm:text-base truncate">
                {{ item.player_name }}
              </span>
              <span
                v-if="item.player_name === highlightPlayerName"
                class="px-2 py-0.5 rounded-full bg-cyan-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shrink-0"
              >
                Sen
              </span>
            </div>
            <div class="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
              <span v-if="item.category_name" class="text-slate-400 font-medium">
                {{ item.category_name }}
              </span>
              <span class="flex items-center gap-1">
                <CheckCircle2 class="w-3.5 h-3.5 text-emerald-400" />
                {{ item.correct_count }} / 20 D
              </span>
              <span class="flex items-center gap-1">
                <Clock class="w-3.5 h-3.5 text-sky-400" />
                {{ item.total_time_taken }}s
              </span>
            </div>
          </div>
        </div>

        <!-- Right: Total Score -->
        <div class="text-right shrink-0 pl-3">
          <div class="text-lg sm:text-xl font-black bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
            {{ item.total_score }}
          </div>
          <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Puan
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
