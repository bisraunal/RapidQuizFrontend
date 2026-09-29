<script setup>
import { HelpCircle } from 'lucide-vue-next'

const props = defineProps({
  question: {
    type: Object,
    required: true,
  },
  questionNumber: {
    type: Number,
    required: true,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  selectedChoiceId: {
    type: String,
    default: null,
  },
  isAnswered: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['select-choice'])

const letters = ['A', 'B', 'C', 'D']
</script>

<template>
  <div class="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
    <!-- Background subtle gradient glow -->
    <div class="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

    <!-- Question Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs font-bold text-cyan-400">
        <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
        <span>Soru {{ questionNumber }} / {{ totalQuestions }}</span>
      </div>
      <span class="text-xs font-semibold text-slate-400">
        +{{ question.points || 10 }} Puan
      </span>
    </div>

    <!-- Question Text -->
    <h2 class="text-xl sm:text-2xl font-bold text-slate-100 leading-snug mb-6 min-h-[4rem] flex items-center">
      {{ question.text }}
    </h2>

    <!-- Optional Code / Formula Snippet -->
    <div
      v-if="question.code_snippet"
      class="mb-6 p-4 rounded-xl bg-slate-900/90 border border-slate-700/60 font-mono text-sm text-cyan-300 overflow-x-auto"
    >
      <pre><code>{{ question.code_snippet }}</code></pre>
    </div>

    <!-- Choices Grid (2x2 or 1 column on mobile) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
      <button
        v-for="(choice, index) in question.choices"
        :key="choice.id"
        @click="$emit('select-choice', choice.id)"
        :disabled="isAnswered"
        class="group relative flex items-center p-4 rounded-2xl border text-left transition-all duration-200 focus:outline-none"
        :class="[
          selectedChoiceId === choice.id
            ? 'bg-gradient-to-r from-cyan-600/30 to-indigo-600/30 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.35)] scale-[1.02] text-white font-bold'
            : isAnswered
            ? 'bg-slate-900/40 border-slate-800 text-slate-400 opacity-60 cursor-not-allowed'
            : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 hover:border-cyan-500/50 text-slate-200 hover:text-white hover:-translate-y-0.5'
        ]"
      >
        <!-- Letter Badge -->
        <span
          class="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold mr-3.5 shrink-0 transition-colors"
          :class="[
            selectedChoiceId === choice.id
              ? 'bg-cyan-400 text-slate-950 shadow-md'
              : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700 group-hover:text-cyan-400'
          ]"
        >
          {{ letters[index] }}
        </span>

        <!-- Choice Text -->
        <span class="text-sm sm:text-base leading-snug flex-1">
          {{ choice.text }}
        </span>
      </button>
    </div>
  </div>
</template>
