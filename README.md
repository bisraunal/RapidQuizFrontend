# Rapid Quiz — Frontend Web Application

<div align="center">

![Vue.js](https://img.shields.io/badge/Vue.js-3.5%2B-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-State_Management-FFE56A?style=for-the-badge&logo=vue.js&logoColor=black)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)

**Her soru 5 saniye! Hızlı düşünme, anlık refleks ve canlı lider tablosu ile modern quiz web uygulaması.**

[Canlı Demo](https://rapid-quiz-frontend-black.vercel.app/) • [Backend Reposu](https://github.com/bisraunal/RapidQuizBackend)

</div>

---

## Oyun Deneyimi ve Özellikler

* **5 Saniyelik Dinamik Geri Sayım Barı:** Yeşil, Sarı ve Kırmızı renk geçişli sayaç.
* **Dahili Web Audio Ses Efektleri:** Sıfır dış dosya bağımlılığıyla tık sesleri, geri sayım uyarıları, süre bitimi ve kutlama fanfarı.
* **Klavye Kısayol Desteği:** Masaüstü kullanıcıları için `A, B, C, D` veya `1, 2, 3, 4` tuşlarıyla anlık cevaplama.
* **Detaylı Cevap İnceleme ve Öğrenme Modu:** Quiz bitiminde doğru, yanlış ve boş bırakılan soruları doğru şıklarla karşılaştırmalı inceleme.
* **Lider Tablosu (Top 10):** Kategori bazlı ve genel sıralamada 1., 2., 3. podyum gösterimi.
* **Konfeti Kutlaması:** Canvas-confetti entegrasyonu ile dinamik tebrik animasyonu.
* **Kalıcı Nickname:** `localStorage` ile oyuncu adını hatırlama.

---

## Proje Yapısı

```
src/
├── assets/          # Görseller ve stiller
├── components/      # Yeniden kullanılabilir UI bileşenleri
│   ├── AnswerReview.vue       # Eğitici doğru/yanlış analiz tablosu
│   ├── CategoryCard.vue       # Neon efektli kategori kartları
│   ├── LeaderboardTable.vue   # Top 10 sıralama tablosu
│   ├── Navbar.vue             # Logo, navigasyon ve ses kontrolü
│   ├── QuestionCard.vue       # Soru ve şık kartı
│   └── TimerBar.vue           # 5s renk değiştiren sayaç
├── router/          # Vue Router rotaları
├── services/        # Axios API ve Web Audio Sound yöneticisi
├── stores/          # Pinia Quiz state yönetimi
├── views/           # Sayfa görünümleri (Home, Quiz, Result, Leaderboard)
├── App.vue          # Ana uygulama kabuğu
└── main.js          # Giriş noktası
```

---

## Kurulum ve Çalıştırma

### 1. Bağımlılıkları Yükleyin
```bash
npm install
```

### 2. Geliştirme Sunucusunu Başlatın
```bash
npm run dev
```

### 3. Production Build
```bash
npm run build
```

---

## Canlı Yayın (Deployment)

Proje **Vercel** üzerinde barındırılmaktadır. `main` dalına yapılan her commit otomatik olarak derlenip canlıya alınır.
