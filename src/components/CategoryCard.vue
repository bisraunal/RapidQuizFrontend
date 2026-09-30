<script setup>
import { computed } from 'vue'
import { Code2, Bot, Cpu, Globe, Atom, Trophy, HelpCircle, ArrowRight } from 'lucide-vue-next'

const props = defineProps({
  category: {
    type: Object,
    required: true,
  },
})

defineEmits(['select'])

const iconMap = {
  Code2: Code2,
  Bot: Bot,
  Cpu: Cpu,
  Globe: Globe,
  Atom: Atom,
  Trophy: Trophy,
}

const CategoryIcon = computed(() => iconMap[props.category.icon] || HelpCircle)

const themeStyles = computed(() => {
  switch (props.category.color_theme) {
    case 'cyan':
      return {
        cardBorder: 'hover:border-cyan-500/60 hover:shadow-cyan-500/20',
        badge: 'bg-cyan-950/60 text-cyan-400 border-cyan-800/40',
        iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 group-hover:bg-cyan-500 group-hover:text-slate-950',
        glow: 'group-hover:shadow-[0_0_30px_rgba(6,182,212,0.25)]',
        accentText: 'text-cyan-400',
      }
    case 'purple':
      return {
        cardBorder: 'hover:border-purple-500/60 hover:shadow-purple-500/20',
        badge: 'bg-purple-950/60 text-purple-400 border-purple-800/40',
        iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20 group-hover:bg-purple-500 group-hover:text-slate-950',
        glow: 'group-hover:shadow-[0_0_30px_rgba(168,85,247,0.25)]',
        accentText: 'text-purple-400',
      }
    case 'blue':
      return {
        cardBorder: 'hover:border-blue-500/60 hover:shadow-blue-500/20',
        badge: 'bg-blue-950/60 text-blue-400 border-blue-800/40',
        iconBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20 group-hover:bg-blue-500 group-hover:text-slate-950',
        glow: 'group-hover:shadow-[0_0_30px_rgba(59,130,246,0.25)]',
        accentText: 'text-blue-400',
      }
    case 'emerald':
      return {
        cardBorder: 'hover:border-emerald-500/60 hover:shadow-emerald-500/20',
        badge: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40',
        iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-slate-950',
        glow: 'group-hover:shadow-[0_0_30px_rgba(16,185,129,0.25)]',
        accentText: 'text-emerald-400',
      }
    case 'orange':
      return {
        cardBorder: 'hover:border-orange-500/60 hover:shadow-orange-500/20',
        badge: 'bg-orange-950/60 text-orange-400 border-orange-800/40',
        iconBg: 'bg-orange-500/10 text-orange-400 border-orange-500/20 group-hover:bg-orange-500 group-hover:text-slate-950',
        glow: 'group-hover:shadow-[0_0_30px_rgba(249,115,22,0.25)]',
        accentText: 'text-orange-400',
      }
    case 'rose':
      return {
        cardBorder: 'hover:border-rose-500/60 hover:shadow-rose-500/20',
        badge: 'bg-rose-950/60 text-rose-400 border-rose-800/40',
        iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20 group-hover:bg-rose-500 group-hover:text-slate-950',
        glow: 'group-hover:shadow-[0_0_30px_rgba(244,63,94,0.25)]',
        accentText: 'text-rose-400',
      }
    default:
      return {
        cardBorder: 'hover:border-cyan-500/60',
        badge: 'bg-cyan-950/60 text-cyan-400 border-cyan-800/40',
        iconBg: 'bg-cyan-500/10 text-cyan-400',
        glow: '',
        accentText: 'text-cyan-400',
      }
  }
})
</script>

<template>
  <button
    @click="$emit('select', category.slug)"
    class="group text-left relative glass-card p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1.5 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 cursor-pointer"
    :class="[themeStyles.cardBorder, themeStyles.glow]"
  >
    <div class="flex items-start justify-between mb-5">
      <!-- Icon Container -->
      <div
        class="w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-300 group-hover:scale-110"
        :class="themeStyles.iconBg"
      >
        <component :is="CategoryIcon" class="w-7 h-7 transition-colors duration-300" />
      </div>

      <!-- Question Badge -->
      <span
        class="text-xs font-bold px-3 py-1 rounded-full border"
        :class="themeStyles.badge"
      >
        {{ category.question_count || 20 }} Soru
      </span>
    </div>

    <!-- Category Title -->
    <h3 class="text-xl font-bold text-slate-100 group-hover:text-white mb-2 transition-colors">
      {{ category.name }}
    </h3>

    <!-- Subtitle / Meta -->
    <p class="text-xs text-slate-400 mb-6 flex items-center gap-1.5">
      <span>⏱ Soru başına 5 saniye</span>
      <span>•</span>
      <span>⚡ Refleks Testi</span>
    </p>

    <!-- Action Arrow Footer -->
    <div class="flex items-center justify-between pt-4 border-t border-slate-800/60">
      <span class="text-xs font-semibold" :class="themeStyles.accentText">
        Hemen Başla
      </span>
      <div class="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-slate-700 transition-all duration-300 group-hover:translate-x-1">
        <ArrowRight class="w-4 h-4" />
      </div>
    </div>
  </button>
</template>
