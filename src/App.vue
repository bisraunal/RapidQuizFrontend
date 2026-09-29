<script setup>
import Navbar from '@/components/Navbar.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
    <Navbar />
    
    <main class="flex-1">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <footer class="glass-card border-t border-slate-800/80 py-6 text-center text-xs text-slate-500 mt-auto">
      <div class="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© 2026 Rapid Quiz — Hızlı Düşünme & Refleks Quiz Platformu</p>
        <p class="text-slate-400">⚡ Vue 3 • Vite • Tailwind • Django DRF</p>
      </div>
    </footer>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
