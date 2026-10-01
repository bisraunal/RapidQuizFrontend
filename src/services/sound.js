// Web Audio API & HTML5 Audio based sound effects and background music manager

class SoundManager {
  constructor() {
    this.ctx = null
    this.isMuted = localStorage.getItem('rapidquiz_sound_muted') === 'true'
    this.bgmAudio = null
    this.currentBgmUrl = null
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      if (AudioContext) {
        this.ctx = new AudioContext()
      }
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted
    localStorage.setItem('rapidquiz_sound_muted', this.isMuted.toString())

    if (this.bgmAudio) {
      this.bgmAudio.muted = this.isMuted
      if (!this.isMuted && this.bgmAudio.paused) {
        this.bgmAudio.play().catch(() => {})
      }
    }
    return this.isMuted
  }

  // --- Background Music (BGM) ---
  playBgm(url, volume = 0.22) {
    if (!url) return
    this.currentBgmUrl = url

    try {
      if (this.bgmAudio) {
        if (this.bgmAudio.src === url && !this.bgmAudio.paused) {
          return // already playing this track
        }
        this.bgmAudio.pause()
      }

      this.bgmAudio = new Audio(url)
      this.bgmAudio.loop = true
      this.bgmAudio.volume = volume
      this.bgmAudio.muted = this.isMuted

      const playPromise = this.bgmAudio.play()
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay policy prevented playback until user interaction
          const handleFirstInteraction = () => {
            if (this.bgmAudio && !this.isMuted) {
              this.bgmAudio.play().catch(() => {})
            }
            window.removeEventListener('click', handleFirstInteraction)
            window.removeEventListener('keydown', handleFirstInteraction)
          }
          window.addEventListener('click', handleFirstInteraction, { once: true })
          window.addEventListener('keydown', handleFirstInteraction, { once: true })
        })
      }
    } catch (e) {
      console.warn('BGM play error:', e)
    }
  }

  stopBgm() {
    if (this.bgmAudio) {
      try {
        this.bgmAudio.pause()
        this.bgmAudio.currentTime = 0
      } catch (e) {}
      this.bgmAudio = null
      this.currentBgmUrl = null
    }
  }

  // --- Sound Effects (SFX) ---
  playClick() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return

    try {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(580, this.ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08)

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start()
      osc.stop(this.ctx.currentTime + 0.08)
    } catch (e) {}
  }

  playTick() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return

    try {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.04)

      gain.gain.setValueAtTime(0.1, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.04)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start()
      osc.stop(this.ctx.currentTime + 0.04)
    } catch (e) {}
  }

  playTimeUp() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return

    try {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(260, this.ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(130, this.ctx.currentTime + 0.25)

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start()
      osc.stop(this.ctx.currentTime + 0.25)
    } catch (e) {}
  }

  playCelebration() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return

    try {
      const notes = [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6 arpeggio
      notes.forEach((freq, index) => {
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()

        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + index * 0.1)

        const startTime = this.ctx.currentTime + index * 0.1
        gain.gain.setValueAtTime(0.18, startTime)
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3)

        osc.connect(gain)
        gain.connect(this.ctx.destination)

        osc.start(startTime)
        osc.stop(startTime + 0.35)
      })
    } catch (e) {}
  }
}

export default new SoundManager()
