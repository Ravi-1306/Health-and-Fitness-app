# FitTrack Development Guide

## Getting Started

### Development Environment Setup

1. **Install Required Tools**
   ```bash
   # Node.js (v18+)
   node --version
   
   # Expo CLI
   npm install -g expo-cli
   
   # PostgreSQL
   brew install postgresql  # macOS
   # or download from postgresql.org
   ```

2. **Clone Repository**
   ```bash
   git clone https://github.com/yourusername/fittrack.git
   cd fittrack
   ```

3. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   
   # Create database
   createdb fittrack
   
   # Start server
   npm run start:dev
   ```

4. **Setup Mobile App**
   ```bash
   cd mobile
   npm install
   npm start
   ```

## Project Structure

### Mobile App Architecture

```
mobile/
├── src/
│   ├── screens/              # Screen components
│   │   ├── SplashScreen.tsx
│   │   ├── ContinueScreen.tsx
│   │   ├── GoalSelectionScreen.tsx
│   │   ├── ProfileInputScreen.tsx
│   │   └── CreateAccountScreen.tsx
│   │
│   ├── components/           # Reusable components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Card.tsx
│   │
│   ├── services/            # API & external services
│   │   ├── api.ts
│   │   └── storage.ts
│   │
│   ├── store/               # State management (Zustand)
│   │   ├── authStore.ts
│   │   ├── onboardingStore.ts
│   │   └── workoutStore.ts
│   │
│   ├── theme/               # Design system
│   │   └── index.ts
│   │
│   ├── types/               # TypeScript definitions
│   │   └── index.ts
│   │
│   └── utils/               # Helper functions
│       └── validation.ts
│
├── app.json                 # Expo configuration
├── package.json
└── tsconfig.json
```

### Backend Architecture

```
backend/
├── src/
│   ├── auth/                # Authentication module
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── jwt.strategy.ts
│   │   └── dto/
│   │
│   ├── user/                # User module
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   ├── user.module.ts
│   │   └── user.entity.ts
│   │
│   ├── workout/             # Workout module
│   │   ├── workout.controller.ts
│   │   ├── workout.service.ts
│   │   ├── workout.module.ts
│   │   ├── workout.entity.ts
│   │   ├── workout-exercise.entity.ts
│   │   ├── exercise.entity.ts
│   │   └── set.entity.ts
│   │
│   ├── ai/                  # AI module
│   │   ├── ai.controller.ts
│   │   ├── ai.service.ts
│   │   └── ai.module.ts
│   │
│   ├── main.ts              # Entry point
│   └── app.module.ts        # Root module
│
├── package.json
├── tsconfig.json
└── nest-cli.json
```

## Development Workflow

### Adding a New Screen (Mobile)

1. Create screen component in `src/screens/`:
```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

export default function MyNewScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My New Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
  },
});
```

2. Add navigation if needed
3. Update types if necessary

### Adding a New API Endpoint (Backend)

1. **Create DTO** (if needed):
```typescript
// src/module/dto/my.dto.ts
export class MyDto {
  @IsString()
  name: string;
}
```

2. **Add Service Method**:
```typescript
// src/module/module.service.ts
async myNewMethod(data: MyDto) {
  // Implementation
}
```

3. **Add Controller Route**:
```typescript
// src/module/module.controller.ts
@Post('my-endpoint')
async myEndpoint(@Body() data: MyDto) {
  const result = await this.service.myNewMethod(data);
  return { data: result };
}
```

## Code Style & Best Practices

### TypeScript
- Use strict mode
- Define proper interfaces/types
- Avoid `any` type

### React Native
- Use functional components with hooks
- Implement proper error boundaries
- Follow Expo best practices

### NestJS
- Use dependency injection
- Keep controllers thin
- Implement proper validation with DTOs
- Use class-validator decorators

## Testing

### Mobile Tests
```bash
cd mobile
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

### Backend Tests
```bash
cd backend
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:cov
```

## Debugging

### Mobile App
1. Enable Debug mode in Expo
2. Use React DevTools
3. View logs in terminal

### Backend
1. Use NestJS built-in logger
2. Debug in VS Code with launch.json
3. Use Postman for API testing

## Database Migrations

### Create Migration
```bash
cd backend
npm run typeorm migration:create -- -n MigrationName
```

### Run Migrations
```bash
npm run typeorm migration:run
```

### Revert Migration
```bash
npm run typeorm migration:revert
```

## Environment Variables

### Mobile (.env)
```env
API_BASE_URL=http://localhost:3000/api
```

### Backend (.env)
```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=fittrack
DB_PASSWORD=your_password
DB_DATABASE=fittrack
JWT_SECRET=your_secret
GEMINI_API_KEY=AIzaSyA4iGV42D5ygIylXKubyTHvLTtGe-sHH44
```

## Deployment

### Backend Deployment (AWS)
1. Build application: `npm run build`
2. Set environment variables
3. Run: `npm run start:prod`

### Mobile Deployment (EAS Build)
```bash
# iOS
eas build --platform ios

# Android
eas build --platform android

# Both
eas build --platform all
```

## Troubleshooting

### Common Issues

**Metro bundler not starting:**
```bash
expo start --clear
```

**Database connection error:**
- Check PostgreSQL is running
- Verify credentials in .env
- Check database exists

**TypeScript errors:**
```bash
npm run build
```

## Resources

- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Expo Docs](https://docs.expo.dev/)
- [NestJS Docs](https://docs.nestjs.com/)
- [TypeORM Docs](https://typeorm.io/)
- [Google Gemini AI Docs](https://ai.google.dev/docs)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed contribution guidelines.
