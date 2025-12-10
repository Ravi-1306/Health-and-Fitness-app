# FitTrack Quick Reference

## 🚀 Quick Commands

### Setup (First Time)
```bash
# Automated setup
./setup.sh          # macOS/Linux
setup.bat           # Windows

# Or manual
cd backend && npm install && cd ..
cd mobile && npm install && cd ..
```

### Start Development
```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Mobile
cd mobile
npm start
# Then press 'i' (iOS) or 'a' (Android)
```

### Database
```bash
# Create database
createdb fittrack

# Reset database (development only)
dropdb fittrack && createdb fittrack
```

## 📁 Key File Locations

### Mobile App
```
mobile/
├── src/
│   ├── screens/          # All screen components
│   ├── services/api.ts   # API client
│   ├── store/           # Zustand stores
│   ├── theme/           # Design system
│   └── types/           # TypeScript types
└── app.json             # Expo config
```

### Backend
```
backend/
├── src/
│   ├── auth/            # Authentication
│   ├── user/            # User profile
│   ├── workout/         # Workout CRUD
│   ├── ai/              # AI features
│   └── main.ts          # Entry point
└── .env                 # Configuration
```

## 🎨 Theme Usage

```typescript
import { theme } from '../theme';

// Colors
theme.colors.primary      // Teal
theme.colors.accent       // Orange
theme.colors.background   // Dark navy
theme.colors.text         // Light gray

// Spacing
theme.spacing.sm          // 8px
theme.spacing.md          // 16px
theme.spacing.lg          // 24px

// Typography
<Text style={theme.typography.h1}>Title</Text>
<Text style={theme.typography.body}>Body</Text>
```

## 🔐 Authentication Flow

```typescript
// 1. Register
const { data } = await authApi.register({
  email: 'user@example.com',
  password: 'password123',
  profile: { age: 25, gender: 'male', ... }
});

// 2. Store tokens (automatic via authStore)
await login(data.tokens, data.user);

// 3. Use authenticated endpoints
const profile = await userApi.getProfile();
```

## 💾 State Management

```typescript
// Auth Store
import { useAuthStore } from '../store/authStore';

const { user, isAuthenticated, login, logout } = useAuthStore();

// Onboarding Store
import { useOnboardingStore } from '../store/onboardingStore';

const { data, updateData, nextStep } = useOnboardingStore();
```

## 🎯 API Endpoints Quick Reference

### Auth
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token

### User
- `GET /api/user/profile` - Get profile
- `PATCH /api/user/profile` - Update profile
- `DELETE /api/user/profile` - Delete account

### Workouts
- `GET /api/workouts` - List workouts
- `POST /api/workouts` - Create workout
- `GET /api/workouts/:id` - Get workout
- `PATCH /api/workouts/:id` - Update workout
- `DELETE /api/workouts/:id` - Delete workout
- `POST /api/workouts/sync` - Sync offline workouts

### AI
- `POST /api/ai/generate-plan` - Generate workout plan
- `POST /api/ai/chat` - Chat with AI coach
- `POST /api/ai/workout-suggestion` - Get suggestions

## 🧪 Testing

```bash
# Mobile
cd mobile
npm test              # Run tests
npm test -- --watch   # Watch mode

# Backend
cd backend
npm test              # Run tests
npm run test:cov      # With coverage
```

## 🐛 Common Issues & Solutions

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000         # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process
kill -9 <PID>         # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### Metro Bundler Issues
```bash
cd mobile
expo start --clear
```

### Database Connection Error
```bash
# Check PostgreSQL is running
psql --version

# Start PostgreSQL
brew services start postgresql  # macOS
sudo service postgresql start    # Linux
```

### TypeScript Errors
```bash
# Rebuild
npm run build

# Check types
npx tsc --noEmit
```

## 📦 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=fittrack
DB_PASSWORD=your_secure_password
DB_DATABASE=fittrack
JWT_SECRET=your_jwt_secret_min_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_min_32_chars
GEMINI_API_KEY=AIzaSyA4iGV42D5ygIylXKubyTHvLTtGe-sHH44
```

### Mobile (if needed)
```env
API_BASE_URL=http://localhost:3000/api
```

## 🔧 Useful Scripts

### Backend
```bash
npm run start:dev     # Development with hot reload
npm run build         # Build for production
npm run start:prod    # Run production build
npm run lint          # Lint code
npm test              # Run tests
```

### Mobile
```bash
npm start             # Start Expo dev server
npm run ios           # Run on iOS simulator
npm run android       # Run on Android emulator
npm run web           # Run in web browser
npm test              # Run tests
```

## 📊 Database Schema Quick Ref

```sql
users
  ├── id (uuid)
  ├── email
  ├── password (hashed)
  ├── age, gender, heightCm, weightKg
  └── goal, activityLevel

workouts
  ├── id (uuid)
  ├── userId → users(id)
  ├── date, startTime, endTime
  └── durationSeconds

workout_exercises
  ├── id (uuid)
  ├── workoutId → workouts(id)
  ├── exerciseId → exercises(id)
  └── order

sets
  ├── id (uuid)
  ├── workoutExerciseId → workout_exercises(id)
  ├── weightKg, reps, rpe
  └── completed
```

## 🎯 Next Features to Build

1. **Workout Logger Screen** - Exercise selection, set tracking
2. **SQLite Integration** - Offline storage
3. **History Screen** - View past workouts
4. **Analytics Charts** - Progress visualization
5. **Dashboard** - Home screen with stats

## 📚 Documentation Links

- [React Native](https://reactnative.dev/)
- [Expo](https://docs.expo.dev/)
- [NestJS](https://docs.nestjs.com/)
- [TypeORM](https://typeorm.io/)
- [Zustand](https://github.com/pmndrs/zustand)
- [React Navigation](https://reactnavigation.org/)

## 💡 Pro Tips

1. Use `console.log(JSON.stringify(data, null, 2))` for debugging
2. Keep API client in `src/services/api.ts` for consistency
3. Use theme constants instead of hardcoded colors
4. Add proper TypeScript types for everything
5. Test on both iOS and Android regularly
6. Use Expo EAS for production builds

## 🆘 Getting Help

1. Check `README.md` for overview
2. Read `DEVELOPMENT.md` for detailed guides
3. See `API_DOCUMENTATION.md` for endpoints
4. Review `IMPLEMENTATION_SUMMARY.md` for architecture

---

**Quick Health Check:**
```bash
# Backend healthy?
curl http://localhost:3000/api/

# Database connected?
psql -U fittrack -d fittrack -c "\dt"

# Mobile running?
# Open Expo app and scan QR code
```
