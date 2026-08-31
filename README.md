# 🕷️ SRM Vigilante Minigame - Superhero Riddle Quest

A comic-book style Neo-Brutalist superhero minigame built with **React Native**, **Expo**, **React Native Web**, and **Supabase**. Players take on the role of Spider-Man/Vigilante heroes to solve high-stakes villain riddles, defeat famous foes (Vulture, Doctor Octopus, Venom), save civilians, and climb the speedrun leaderboard!

---

## 🌟 Key Features

- **💥 High-Octane Comic Aesthetic**: Neo-Brutalist UI styling featuring vibrant color palettes, bold borders, offset shadows, and dynamic comic badge elements.
- **🧩 Fixed Milestone Scoring System**:
  - **Mission 1 Locked (The Rooftop Witness - Vulture)** $\rightarrow$ **400 PTS**
  - **Mission 2 Locked (Vault Breaker - Doctor Octopus)** $\rightarrow$ **850 PTS**
  - **Mission 3 Locked (Toxic Spill Riddle - Venom)** $\rightarrow$ **1600 PTS**
  - Scores persist across reloads; no penalty deductions or score losses on timer resets.
- **⏱️ Spidey-Sense Countdown Timers**: Each mission features a countdown timer tailored to villain threat levels. If the timer expires, the round resets smoothly.
- **👥 Dual Role System**:
  - **Player Mode**: Team profile registration, sequential investigation missions, speedrun timers, and classified report downloads.
  - **Admin Console**: Live team rankings and score records deletion capabilities.
- **📊 Leaderboards & Speedruns**: Ranks teams based on total completion clear times and milestone scores.
- **📄 Classified Mission Report Cards**: Generate and share downloadable/exportable mission reports upon game completion.
- **☁️ Offline-First Persistence + Supabase Sync**: Games play offline seamlessly using `AsyncStorage` and automatically upsert stats/leaderboards to Supabase when online.

---

## 🛠️ Technology Stack

- **Framework**: [Expo v57](https://docs.expo.dev/) & [React Native 0.86](https://reactnative.dev/)
- **Web Engine**: [React Native Web 0.21](https://necolas.github.io/react-native-web/) & React DOM 19
- **Navigation**: [@react-navigation/native v7](https://reactnavigation.org/) with Stack Navigator
- **State & Storage**: React Context API & [@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/)
- **Backend & Cloud Sync**: [@supabase/supabase-js v2](https://supabase.com/)
- **Icons & Typography**: `@expo/vector-icons` (Ionicons)

---

## 🎮 Game Structure & Missions

| Mission ID | Mission Title | Villain | Threat Level | Timer | Milestone Score |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `rooftop_witness` | The Rooftop Witness | **Vulture** | MINIMUM | 60 sec | **400 PTS** |
| `vault_breaker` | Vault Breaker | **Doctor Octopus** | MODERATE | 35 sec | **850 PTS** |
| `toxic_spill` | Toxic Spill Riddle | **Venom** | EXTREME | 25 sec | **1600 PTS** |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/realrichelle19/minigame.git
   cd minigame
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

### Running the Application

- **Run on Local Web Browser (Localhost)**:
  ```bash
  npm run web
  ```
  *Opens the application on [http://localhost:8081](http://localhost:8081).*

- **Run via Expo Go (iOS / Android)**:
  ```bash
  npx expo start
  ```
  *Scan the QR code with the Expo Go app on your iOS or Android device.*

- **Run Native Commands**:
  - Android: `npm run android`
  - iOS: `npm run ios`

---

## 📱 Navigation & Screen Flow

1. **Role Selection (`RoleSelectionScreen`)**: Choose between **Vigilante Player** or **Admin Console**.
2. **Team Login / Registration (`LoginScreen`)**: Enter team name, leader details, and member count.
3. **Mission Hub (`HomeScreen`)**: View vigilante stats, start missions, or inspect admin controls.
4. **Investigations (`InvestigationsScreen`)**: Select active villain missions sequentially.
5. **Riddle Challenge (`GameScreen`)**: Answer villain riddles before the Spidey-Sense timer expires.
6. **Victory & Ranking (`VictoryScreen` / `RankingScreen`)**: View final score (1600 PTS), clear times, and export classified report cards.
7. **Leaderboard (`LeaderboardScreen`)**: View global speedrun rankings.

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).
