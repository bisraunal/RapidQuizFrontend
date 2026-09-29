<script setup>
import { computed } from 'vue'
import { Clock } from 'lucide-vue-next'

const props = defineProps({
  timeRemaining: {
    type: Number,
    required: true,
    default: 5.0,
  },
  maxTime: {
    type: Number,
    default: 5.0,
  },
})

const percentage = computed(() => {
  return Math.max(0, Math.min(100, (props.timeRemaining / props.maxTime) * 100))
})

const timerColorClass = computed(() => {
  if (props.timeRemaining > 2.5) {
    return 'bg-gradient-to-r from-emerald-500 to-green-400 shadow-emerald-500/30'
  } else if (props.timeRemaining > 1.2) {
    return 'bg-gradient-to-r from-amber-500 to-yellow-400 shadow-amber-500/30'
  } else {
    return 'bg-gradient-to-r from-rose-600 to-red-500 shadow-red-500/50 animate-pulse'
  }
})

const textColorClass = computed(() => {
  if (props.timeRemaining > 2.5) return 'text-emerald-400'
  if (props.timeRemaining > 1.2) return 'text-amber-400'
  return 'text-rose-400 animate-pulse font-extrabold'
})
</script>

<template>
  <div class="w-full">
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
        <Clock class="w-4 h-4" :class="textColorClass" />
        <span>Kalan Süre:</span>
      </div>
      <span class="text-sm font-mono font-bold tracking-wider" :class="textColorClass">
        {{ timeRemaining.toFixed(1) }}s
      </span>
    </div>

    <!-- Progress Bar Track -->
    <div class="w-full h-3 bg-slate-800/90 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
      <div
        class="h-full rounded-full transition-all duration-75 ease-linear shadow-lg"
        :class="timerColorClass"
        :style="{ width: `${percentage}%` }"
      ></div>
    </div>
  </div>
</template>
