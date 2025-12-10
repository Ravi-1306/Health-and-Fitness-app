# Health and Fitness App 💪

A full-stack mobile and web application for tracking workouts, managing fitness goals, and getting AI-powered personalized coaching. Built with NestJS backend and React Native/Expo frontend.

## 🌟 Features

### ✅ Implemented Features
- **User Authentication**: Secure JWT-based authentication with refresh tokens
- **Workout Tracking**: Log exercises, sets, reps, and weights in real-time
- **Workout History**: View past workouts with detailed stats and metrics
- **AI Coach**: Chat with AI for personalized fitness advice (Google Gemini)
- **Exercise Library**: Pre-loaded database of exercises by muscle group
- **User Profiles**: Manage fitness goals and personal information
- **Offline Support**: Workouts sync to server when connection is available
- **Onboarding**: Comprehensive user setup flow with goals and profile data

### 📋 Tech Stack

**Backend**
- NestJS 10.3.0 - Progressive Node.js framework
- TypeORM 0.3.19 - Advanced ORM
- SQLite - Lightweight database (PostgreSQL ready)
- JWT - Secure authentication
- Google Gemini API - AI coaching
- TypeScript 5.3.3

**Mobile**
- React Native 0.81.5 - Mobile framework
- Expo SDK 54 - Development platform
- React Navigation v6 - Navigation solution
- Zustand - State management
- Axios - HTTP client
- TypeScript 5.1.6

## 📁 Project Structure

```
Health-and-Fitness-app/
├── backend/                      # NestJS API
│   ├── src/
│   │   ├── auth/                # Authentication (login, signup, JWT)
│   │   ├── user/                # User management
│   │   ├── workout/             # Workout CRUD operations
│   │   ├── exercise/            # Exercise library
│   │   ├── ai/                  # AI coaching features
│   │   └── app.module.ts        # Main module
│   ├── .env.example             # Environment template
│   ├── .gitignore               # Git ignore rules
│   └── package.json
│
├── mobile/                       # React Native Expo app
│   ├── src/
│   │   ├── screens/             # All app screens
│   │   ├── navigation/          # Navigation setup
│   │   ├── services/            # API & storage services
│   │   ├── store/               # Zustand state
│   │   ├── types/               # TypeScript types
│   │   └── theme.ts             # Design system
│   ├── .env.example             # Environment template
│   ├── .gitignore               # Git ignore rules
│   └── package.json
│
├── README.md                     # Project documentation
└── .gitignore                    # Root level git ignore
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ and npm/yarn
- **Git** installed
- **Computer and phone on same network** (for mobile testing)
- **Google Gemini API Key** (free at https://makersuite.google.com/app/apikey)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ravi-1306/Health-and-Fitness-app.git
   cd Health-and-Fitness-app/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment file**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration:
   ```env
   NODE_ENV=development
   PORT=3000
   DB_TYPE=sqlite
   DB_DATABASE=fittrack.db
   JWT_SECRET=your_strong_random_secret_key_here_32_chars_minimum
   JWT_REFRESH_SECRET=your_strong_random_refresh_secret_here
   GEMINI_API_KEY=your_google_gemini_api_key_here
   CORS_ORIGIN=http://localhost:8081
   ```

4. **Build and run**
   ```bash
   npm run build
   npm run start:dev
   ```
   Backend will start on `http://localhost:3000/api`

### Mobile Setup

1. **Navigate to mobile directory**
   ```bash
   cd Health-and-Fitness-app/mobile
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Setup environment file**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` - **IMPORTANT: Update IP to your machine's IP**
   ```env
   EXPO_PUBLIC_API_BASE_URL=http://192.168.68.65:3000/api
   ```
   
   To find your IP address:
   - **Windows**: Open Command Prompt and run `ipconfig` (look for IPv4 Address)
   - **Mac/Linux**: Open Terminal and run `ifconfig` (look for inet address)

4. **Start the Expo server**
   ```bash
   npx expo start --clear
   ```

5. **Run on your device**
   - **iOS**: Press `i` to open in iPhone Simulator
   - **Android**: Press `a` to open in Android Emulator
   - **Physical Device**: Scan the QR code with Expo Go app

### ⚡ Quick Start (Windows)

```bash
# Terminal 1: Backend
cd backend
npm install
npm run start:dev

# Terminal 2: Mobile (after backend is running)
cd mobile
npm install --legacy-peer-deps
npx expo start
```

### 🔒 Security Best Practices

**⚠️ IMPORTANT: Protect Sensitive Information**

- **Never commit `.env` files** - they're in `.gitignore`
- **Use `.env.example`** as a template
- **Keep API keys secret** - regenerate if exposed
- **Use strong JWT secrets** (minimum 32 random characters)
- **Change defaults in production** before deploying

## 📱 App Screens & Features

### Authentication
- Email/password signup
- Email/password login
- JWT token-based sessions
- Secure token storage (Expo SecureStore)

### Onboarding (First Time)
1. Welcome screen with feature overview
2. Fitness goal selection
3. Profile information (age, weight, goals)
4. Account creation

### Main App
- **Dashboard**: Quick start workout, view stats
- **Workout Logger**: Log exercises with sets, reps, weights, and rest timers
- **Workout History**: Browse and view detailed past workouts
- **AI Coach**: Chat interface for personalized fitness advice
- **Profile**: Manage personal info and settings

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/signup           - Register new user
POST   /api/auth/login            - User login
POST   /api/auth/refresh          - Refresh access token
```

### Workouts
```
GET    /api/workouts              - List user's workouts
POST   /api/workouts              - Create new workout
GET    /api/workouts/:id          - Get specific workout
PATCH  /api/workouts/:id          - Update workout
DELETE /api/workouts/:id          - Delete workout
POST   /api/workouts/sync         - Sync multiple workouts
```

### Exercises
```
GET    /api/exercises             - List all exercises
GET    /api/exercises/:id         - Get exercise details
```

### AI Coach
```
POST   /api/ai/chat               - Chat with AI coach
POST   /api/ai/generate-plan      - Generate workout plan
POST   /api/ai/workout-suggestion - Get suggestions
```

## 🎨 App Design

### Color Scheme
- **Primary**: Teal (#14B8A6) - Main actions
- **Text**: White/Light Gray - Good contrast
- **Background**: Dark Navy (#0A192F) - Easy on eyes
- **Surface**: Slightly lighter navy - Card backgrounds

### Responsive Design
- Mobile-first approach
- Works on all screen sizes (phones to tablets)
- Optimized for touch interactions

## ❓ Troubleshooting

### Mobile app can't connect to backend
**Error**: "Failed to create account" or "Network error"

**Solution**:
1. Check backend is running: `http://localhost:3000/api`
2. Find your computer's IP:
   - Windows: `ipconfig` → look for IPv4 Address
   - Mac/Linux: `ifconfig` → look for inet
3. Update `.env` in mobile folder:
   ```
   EXPO_PUBLIC_API_BASE_URL=http://YOUR_IP:3000/api
   ```
4. Restart Expo: `npx expo start --clear`
5. Clear app cache and restart

### Dependencies conflict
```bash
npm install --legacy-peer-deps
```

### Clear Expo cache
```bash
npx expo start --clear
```

### Reset everything
```bash
# Delete all node_modules and install fresh
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Database issues
```bash
# Delete the database file to start fresh (data will be lost)
rm backend/fittrack.db
# Restart backend
npm run start:dev
```

## 📊 Database Tables

- **users** - User accounts, profiles, goals
- **workouts** - Training sessions
- **workout_exercises** - Exercises within workouts
- **sets** - Individual sets (reps, weight, RPE)
- **exercises** - Exercise library (name, muscle group, etc.)

## 🧪 Development Scripts

### Backend
```bash
npm run build       # Compile TypeScript
npm run start       # Run production build
npm run start:dev   # Run with hot reload (best for development)
npm test            # Run tests
npm run lint        # Check code quality
```

### Mobile
```bash
npx expo start                  # Start development server
npx expo start --clear          # Clear cache and start fresh
npm run build                   # Build for production
npx expo build:android          # Build Android APK
npx expo build:ios              # Build iOS IPA
```

## 🔄 Git Workflow

### First Time Setup
```bash
git clone https://github.com/Ravi-1306/Health-and-Fitness-app.git
cd Health-and-Fitness-app
```

### Making Changes
```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Make your changes, then:
git add .
git commit -m "feat: describe your feature"
git push origin feature/your-feature-name

# Create a Pull Request on GitHub
```

### Committing to Main
- Only merge tested, working code
- Always test on a real device before merging
- Update README if adding new features
- Get code review from team members
