# FitTrack Setup Guide

## Prerequisites

### 1. Install PostgreSQL
- Download from: https://www.postgresql.org/download/windows/
- During installation, remember the password you set for the `postgres` user
- Default port: 5432

### 2. Create Database
Open Command Prompt or PowerShell and run:
```bash
psql -U postgres
```
Enter your postgres password, then run:
```sql
CREATE DATABASE fittrack;
\q
```

Or run the setup script:
```bash
psql -U postgres -f setup-db.sql
```

## Running the Application

### Backend
```bash
cd backend
npm run start:dev
```
The backend will run on http://localhost:3000

### Mobile App
```bash
cd mobile
npm start
```
Then:
- Press `a` for Android emulator
- Press `i` for iOS simulator
- Scan QR code with Expo Go app for physical device

## Environment Configuration

Update `backend/.env` with your settings:
- `DB_PASSWORD`: Your PostgreSQL password
- `GEMINI_API_KEY`: Your Google Gemini API key (get from https://makersuite.google.com/app/apikey)
- JWT secrets: Generate secure random strings

## Troubleshooting

### Database Connection Issues
1. Ensure PostgreSQL is running
2. Check credentials in `.env` match your PostgreSQL setup
3. Verify database `fittrack` exists: `psql -U postgres -l`

### Port Already in Use
- Backend (3000): Change `PORT` in `.env`
- Mobile (8081): Expo will auto-assign a different port

## Next Steps
1. Backend should create tables automatically via TypeORM migrations
2. Open mobile app and create an account
3. Start logging workouts!
