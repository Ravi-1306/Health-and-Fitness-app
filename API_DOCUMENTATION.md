# FitTrack API Documentation

Base URL: `http://localhost:3000/api`

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

## Endpoints

### Auth

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "profile": {
    "age": 25,
    "gender": "male",
    "heightCm": 175,
    "weightKg": 70,
    "goal": "build_muscle",
    "activityLevel": "moderately_active"
  }
}

Response 201:
{
  "data": {
    "user": { ... },
    "tokens": {
      "accessToken": "...",
      "refreshToken": "..."
    }
  },
  "message": "Account created successfully"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response 200:
{
  "data": {
    "user": { ... },
    "tokens": {
      "accessToken": "...",
      "refreshToken": "..."
    }
  },
  "message": "Login successful"
}
```

#### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "..."
}

Response 200:
{
  "data": {
    "accessToken": "..."
  }
}
```

### User Profile

#### Get Profile
```http
GET /user/profile
Authorization: Bearer <token>

Response 200:
{
  "data": {
    "id": "...",
    "email": "user@example.com",
    "age": 25,
    "gender": "male",
    ...
  }
}
```

#### Update Profile
```http
PATCH /user/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "age": 26,
  "weightKg": 72
}

Response 200:
{
  "data": { ... },
  "message": "Profile updated successfully"
}
```

#### Delete Account
```http
DELETE /user/profile
Authorization: Bearer <token>

Response 200:
{
  "message": "Account deleted successfully"
}
```

### Workouts

#### List Workouts
```http
GET /workouts?from=2024-01-01&to=2024-12-31
Authorization: Bearer <token>

Response 200:
{
  "data": [
    {
      "id": "...",
      "date": "2024-01-15",
      "startTime": "10:00:00",
      "endTime": "11:30:00",
      "exercises": [...]
    }
  ]
}
```

#### Get Workout
```http
GET /workouts/:id
Authorization: Bearer <token>

Response 200:
{
  "data": {
    "id": "...",
    "exercises": [
      {
        "exercise": {
          "name": "Bench Press",
          "muscleGroup": "chest"
        },
        "sets": [
          {
            "weightKg": 60,
            "reps": 8,
            "completed": true
          }
        ]
      }
    ]
  }
}
```

#### Create Workout
```http
POST /workouts
Authorization: Bearer <token>
Content-Type: application/json

{
  "date": "2024-01-15",
  "startTime": "10:00:00",
  "exercises": [
    {
      "exerciseId": "...",
      "order": 1,
      "sets": [
        {
          "setIndex": 1,
          "weightKg": 60,
          "reps": 8,
          "completed": true
        }
      ]
    }
  ]
}

Response 201:
{
  "data": { ... },
  "message": "Workout created successfully"
}
```

#### Update Workout
```http
PATCH /workouts/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "endTime": "11:30:00",
  "notes": "Great session!"
}

Response 200:
{
  "data": { ... },
  "message": "Workout updated successfully"
}
```

#### Delete Workout
```http
DELETE /workouts/:id
Authorization: Bearer <token>

Response 200:
{
  "message": "Workout deleted successfully"
}
```

#### Sync Workouts
```http
POST /workouts/sync
Authorization: Bearer <token>
Content-Type: application/json

{
  "workouts": [
    { ... },
    { ... }
  ]
}

Response 200:
{
  "data": {
    "synced": 2
  },
  "message": "Workouts synced successfully"
}
```

### AI Features

#### Generate Workout Plan
```http
POST /ai/generate-plan
Authorization: Bearer <token>
Content-Type: application/json

{
  "age": 25,
  "gender": "male",
  "heightCm": 175,
  "weightKg": 70,
  "goal": "build_muscle",
  "activityLevel": "moderately_active",
  "daysPerWeek": 4,
  "equipment": ["barbell", "dumbbells", "bench"]
}

Response 200:
{
  "data": {
    "plan": {
      "weeks": [
        {
          "week_number": 1,
          "days": [...]
        }
      ]
    }
  }
}
```

#### Chat with AI Coach
```http
POST /ai/chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "How do I progress my bench press?",
  "context": {
    "currentWeight": 60,
    "reps": 8
  }
}

Response 200:
{
  "data": {
    "response": "To progress your bench press..."
  }
}
```

#### Get Workout Suggestion
```http
POST /ai/workout-suggestion
Authorization: Bearer <token>
Content-Type: application/json

{
  "workoutHistory": [
    {
      "date": "2024-01-14",
      "exercises": [...]
    }
  ]
}

Response 200:
{
  "data": {
    "suggestion": {
      "suggestions": [...],
      "advice": "...",
      "shouldDeload": false
    }
  }
}
```

## Error Responses

All error responses follow this format:

```json
{
  "statusCode": 400,
  "message": "Error message",
  "errors": {
    "field": ["validation error"]
  }
}
```

### Common Status Codes
- `200 OK` - Success
- `201 Created` - Resource created
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - Resource not found
- `409 Conflict` - Duplicate resource
- `500 Internal Server Error` - Server error

## Rate Limiting

- Auth endpoints: 5 requests per minute
- AI endpoints: 10 requests per minute
- Other endpoints: 100 requests per minute

## Pagination

List endpoints support pagination:
```
GET /workouts?page=1&limit=20
```

## Filtering & Sorting

```
GET /workouts?from=2024-01-01&to=2024-12-31&sort=date&order=desc
```
