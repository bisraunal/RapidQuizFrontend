<script setup>
import { ref, computed } from 'vue'
import {
  CheckCircle2,
  XCircle,
  Clock,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Filter,
} from 'lucide-vue-next'

const props = defineProps({
  breakdown: {
    type: Array,
    required: true,
    default: () => [],
  },
})

const activeFilter = ref('all') // 'all', 'correct', 'incorrect'

const filteredList = computed(() => {
  if (activeFilter.value === 'correct') {
    return props.breakdown.filter((item) => item.is_correct)
  }
  if (activeFilter.value === 'incorrect') {
    return props.breakdown.filter((item) => !item.is_correct)
  }
  return props.breakdown
})

const correctCount = computed(() => props.breakdown.filter((i) => i.is_correct).length)
const incorrectCount = computed(() => props.breakdown.filter((i) => !i.is_correct).length)
</script>

<template>
  <div class="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
      <div class="flex items-center gap-2.5">
        <div class="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
          <BookOpen class="w-5 h-5" />
        </div>
        <div>
          <h3 class="text-xl font-bold text-white tracking-tight">
            Cevap İncelemesi & Doğru Cevaplar
          </h3>
          <p class="text-xs text-slate-400 mt-0.5">
            Tüm soruları, verdiğin cevapları ve doğru şıkları incele
          </p>
        </div>
      </div>

      <!-- Filter Tabs -->
      <div class="flex items-center gap-2">
        <button
          @click="activeFilter = 'all'"
          class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all border"
          :class="[
            activeFilter === 'all'
              ? 'bg-slate-700 text-white border-slate-600 shadow-md'
              : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
          ]"
        >
          Tümü ({{ breakdown.length }})
        </button>
        <button
          @click="activeFilter = 'correct'"
          class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1"
          :class="[
            activeFilter === 'correct'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-md'
              : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-emerald-400'
          ]"
        >
          <CheckCircle2 class="w-3.5 h-3.5 text-emerald-400" />
          Doğru ({{ correctCount }})
        </button>
        <button
          @click="activeFilter = 'incorrect'"
          class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1"
          :class="[
            activeFilter === 'incorrect'
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-md'
              : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-rose-400'
          ]"
        >
          <XCircle class="w-3.5 h-3.5 text-rose-400" />
          Yanlış/Boş ({{ incorrectCount }})
        </button>
      </div>
    </div>

    <!-- Questions Review List -->
    <div class="mt-6 space-y-4">
      <div
        v-for="(item, index) in filteredList"
        :key="item.question_id || index"
        class="p-4 sm:p-5 rounded-2xl border transition-all duration-200"
        :class="[
          item.is_correct
            ? 'bg-emerald-950/20 border-emerald-900/40'
            : item.selected_choice_id === null
            ? 'bg-amber-950/20 border-amber-900/40'
            : 'bg-rose-950/20 border-rose-900/40'
        ]"
      >
        <!-- Top Row: Question Title & Result Badge -->
        <div class="flex items-start justify-between gap-3 mb-3">
          <div class="flex items-start gap-2.5">
            <span class="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 shrink-0">
              #{{ index + 1 }}
            </span>
            <h4 class="text-sm sm:text-base font-bold text-slate-100 leading-snug">
              {{ item.question_text }}
            </h4>
          </div>

          <!-- Status Badge -->
          <div class="shrink-0">
            <span
              v-if="item.is_correct"
              class="inline-flex items-center gap-1 text-xs font-black px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
            >
              <CheckCircle2 class="w-3.5 h-3.5" />
              +{{ item.earned_points }} Puan
            </span>
            <span
              v-else-if="item.selected_choice_id === null"
              class="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30"
            >
              <Clock class="w-3.5 h-3.5" />
              Süre Bitti
            </span>
            <span
              v-else
              class="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30"
            >
              <XCircle class="w-3.5 h-3.5" />
              0 Puan
            </span>
          </div>
        </div>

        <!-- Code Snippet if present -->
        <div
          v-if="item.code_snippet"
          class="mb-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto"
        >
          <pre><code>{{ item.code_snippet }}</code></pre>
        </div>

        <!-- Choices Breakdown -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2">
          <!-- User's Answer -->
          <div
            class="p-3 rounded-xl border flex items-center justify-between"
            :class="[
              item.is_correct
                ? 'bg-emerald-950/40 border-emerald-700/50 text-emerald-200'
                : item.selected_choice_id === null
                ? 'bg-amber-950/40 border-amber-700/50 text-amber-200'
                : 'bg-rose-950/40 border-rose-700/50 text-rose-200'
            ]"
          >
            <div>
              <span class="font-bold text-[10px] uppercase tracking-wider block opacity-70 mb-0.5">
                Senin Cevabın:
              </span>
              <span class="font-semibold text-xs sm:text-sm">
                {{ item.selected_choice_text || '⏱️ Boş Bırakıldı (Süre Doldu)' }}
              </span>
            </div>
            <span class="text-xs opacity-75 font-mono">
              {{ item.time_taken }}s
            </span>
          </div>

          <!-- Correct Answer -->
          <div class="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/50 text-emerald-100 flex items-center justify-between">
            <div>
              <span class="font-bold text-[10px] uppercase tracking-wider text-emerald-400 block mb-0.5">
                Doğru Cevap:
              </span>
              <span class="font-bold text-xs sm:text-sm text-emerald-300">
                ✓ {{ item.correct_choice_text }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
