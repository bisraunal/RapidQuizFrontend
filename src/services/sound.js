// Web Audio API procedural synthesizers & background music engine for Rapid Quiz

class SoundManager {
  constructor() {
    this.ctx = null
    this.isMuted = localStorage.getItem('rapidquiz_sound_muted') === 'true'
    this.bgmTimer = null
    this.bgmGain = null
    this.currentTheme = null
    this.stepIndex = 0
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      if (AudioContext) {
        this.ctx = new AudioContext()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {})
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted
    localStorage.setItem('rapidquiz_sound_muted', this.isMuted.toString())

    if (this.bgmGain) {
      this.bgmGain.gain.setValueAtTime(this.isMuted ? 0 : 0.12, this.ctx ? this.ctx.currentTime : 0)
    }

    if (!this.isMuted && this.currentTheme) {
      this.playCategoryBgm(this.currentTheme)
    }
    return this.isMuted
  }

  // --- Web Audio Procedural Background Music (BGM) Engine ---
  playCategoryBgm(categorySlug) {
    this.stopBgm()
    this.currentTheme = categorySlug
    if (this.isMuted) return

    this.init()
    if (!this.ctx) return

    try {
      this.bgmGain = this.ctx.createGain()
      this.bgmGain.gain.setValueAtTime(0.12, this.ctx.currentTime)

      // Master lowpass filter to keep background music soft & relaxing
      const masterFilter = this.ctx.createBiquadFilter()
      masterFilter.type = 'lowpass'
      masterFilter.frequency.setValueAtTime(1400, this.ctx.currentTime)

      this.bgmGain.connect(masterFilter)
      masterFilter.connect(this.ctx.destination)

      this.stepIndex = 0

      // Theme specific step sequencer
      const intervalMs = this.getThemeInterval(categorySlug)
      this.tickBgm(categorySlug)
      this.bgmTimer = setInterval(() => {
        this.tickBgm(categorySlug)
      }, intervalMs)
    } catch (e) {
      console.warn('Procedural BGM error:', e)
    }
  }

  getThemeInterval(slug) {
    switch (slug) {
      case 'ascilik': return 480      // Smooth Bossa Lounge tempo
      case 'yazilim': return 220      // Fast Synthwave tempo
      case 'yapay-zeka': return 400   // Futuristic ambient pulse
      case 'bilgisayar-muhendisligi': return 200 // Retro 8-bit arcade
      case 'fizik': return 650        // Deep space cosmic drift
      case 'futbol': return 260       // Stadium action beat
      case 'ulkeler': return 320      // World acoustic adventure
      default: return 350
    }
  }

  tickBgm(slug) {
    if (this.isMuted || !this.ctx || !this.bgmGain) return
    const now = this.ctx.currentTime

    switch (slug) {
      case 'ascilik': // Bistro Gourmet / Cozy Bossa Jazz
        this.playBossaNote(this.stepIndex, now)
        break
      case 'yazilim': // Synthwave Cyber Chiptune
        this.playSynthwaveNote(this.stepIndex, now)
        break
      case 'yapay-zeka': // Neural Ambient Tech
        this.playNeuralNote(this.stepIndex, now)
        break
      case 'bilgisayar-muhendisligi': // Retro 8-bit Arcade
        this.playArcadeNote(this.stepIndex, now)
        break
      case 'fizik': // Deep Space Cosmic Ambient
        this.playCosmicNote(this.stepIndex, now)
        break
      case 'futbol': // Stadium Champions Rock Beat
        this.playStadiumNote(this.stepIndex, now)
        break
      case 'ulkeler': // World Acoustic Journey
      default:
        this.playWorldNote(this.stepIndex, now)
        break
    }

    this.stepIndex = (this.stepIndex + 1) % 32
  }

  // Helper to play synthesized tone
  synthTone(freq, type, duration, gainVal = 0.08, startTime) {
    try {
      const osc = this.ctx.createOscillator()
      const noteGain = this.ctx.createGain()

      osc.type = type
      osc.frequency.setValueAtTime(freq, startTime)

      noteGain.gain.setValueAtTime(gainVal, startTime)
      noteGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)

      osc.connect(noteGain)
      noteGain.connect(this.bgmGain)

      osc.start(startTime)
      osc.stop(startTime + duration)
    } catch (e) {}
  }

  // --- 1. Aşçılık (Cozy Bistro Jazz & Bossa Nova) ---
  playBossaNote(step, now) {
    // Chords: Cmaj7, Am7, Dm7, G7 progression
    const chords = [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7 (C4, E4, G4, B4)
      [220.00, 261.63, 329.63, 392.00], // Am7 (A3, C4, E4, G4)
      [293.66, 349.23, 440.00, 523.25], // Dm7 (D4, F4, A4, C5)
      [196.00, 246.94, 293.66, 349.23], // G7 (G3, B3, D4, F4)
    ]
    const chordIndex = Math.floor((step % 16) / 4)
    const chord = chords[chordIndex]
    const note = chord[step % 4]

    // Warm Rhodes / Jazz flute style triangle wave
    this.synthTone(note, 'triangle', 0.42, 0.09, now)

    // Bassline on beat 0 and 2
    if (step % 2 === 0) {
      const bassFreq = chord[0] / 2
      this.synthTone(bassFreq, 'sine', 0.38, 0.14, now)
    }
  }

  // --- 2. Yazılım (Synthwave Cyber Arp) ---
  playSynthwaveNote(step, now) {
    const scale = [130.81, 155.56, 174.61, 196.00, 233.08, 261.63, 311.13, 392.00] // C Minor Pentatonic
    const note = scale[step % scale.length]

    // Fast saw lead
    this.synthTone(note * 2, 'sawtooth', 0.16, 0.05, now)

    // Pumping synth bass
    if (step % 4 === 0) {
      this.synthTone(65.41, 'triangle', 0.22, 0.18, now)
    }
  }

  // --- 3. Yapay Zeka (Futuristic Neural Ambient) ---
  playNeuralNote(step, now) {
    const tones = [220.0, 277.18, 329.63, 440.0, 554.37, 659.25]
    if (step % 2 === 0) {
      const tone = tones[(step / 2) % tones.length]
      this.synthTone(tone, 'sine', 0.65, 0.08, now)
      this.synthTone(tone * 1.5, 'triangle', 0.45, 0.03, now)
    }
    if (step % 8 === 0) {
      this.synthTone(55.0, 'sine', 1.2, 0.2, now) // deep sub
    }
  }

  // --- 4. Bilgisayar Mühendisliği (Retro 8-bit Chiptune) ---
  playArcadeNote(step, now) {
    const pattern = [261.63, 329.63, 392.00, 523.25, 392.00, 329.63, 261.63, 196.00]
    const freq = pattern[step % pattern.length]
    this.synthTone(freq, 'square', 0.12, 0.035, now)

    if (step % 4 === 0) {
      this.synthTone(130.81, 'triangle', 0.18, 0.12, now)
    }
  }

  // --- 5. Fizik (Cosmic Horizon Space Drone) ---
  playCosmicNote(step, now) {
    const spacePitches = [146.83, 174.61, 220.00, 261.63, 329.63]
    const pitch = spacePitches[step % spacePitches.length]
    this.synthTone(pitch, 'sine', 0.9, 0.09, now)
    this.synthTone(pitch * 2.01, 'sine', 0.8, 0.04, now) // shimmering harmonic
  }

  // --- 6. Futbol (Stadium Rock Rhythm) ---
  playStadiumNote(step, now) {
    const bassRhythm = [110, 110, 146.83, 110, 164.81, 146.83, 110, 130.81]
    const freq = bassRhythm[step % bassRhythm.length]
    this.synthTone(freq, 'sawtooth', 0.18, 0.07, now)

    // Kick punch
    if (step % 4 === 0) {
      this.synthTone(60, 'sine', 0.15, 0.22, now)
    }
  }

  // --- 7. Ülkeler (World Odyssey Adventure) ---
  playWorldNote(step, now) {
    const worldScale = [196.00, 220.00, 246.94, 293.66, 329.63, 392.00]
    const note = worldScale[step % worldScale.length]
    this.synthTone(note, 'triangle', 0.28, 0.08, now)
    if (step % 4 === 0) {
      this.synthTone(98.00, 'sine', 0.35, 0.15, now)
    }
  }

  stopBgm() {
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer)
      this.bgmTimer = null
    }
    if (this.bgmGain && this.ctx) {
      try {
        this.bgmGain.gain.setValueAtTime(0, this.ctx.currentTime)
        this.bgmGain.disconnect()
      } catch (e) {}
      this.bgmGain = null
    }
    this.currentTheme = null
    this.stepIndex = 0
  }

  // Generic playBgm called with categorySlug or fallback
  playBgm(themeOrUrl) {
    if (!themeOrUrl) return
    // If it's a category slug or name, play procedural synthesized BGM
    const slug = themeOrUrl.toLowerCase().replace(/[^a-z0-9-]/g, '')
    this.playCategoryBgm(slug)
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
