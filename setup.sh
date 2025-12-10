#!/bin/bash

echo "🏋️ FitTrack Setup Script"
echo "=========================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check Node.js
echo -e "${BLUE}Checking Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found. Please install Node.js 18+ first.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node --version) found${NC}"
echo ""

# Check PostgreSQL
echo -e "${BLUE}Checking PostgreSQL...${NC}"
if ! command -v psql &> /dev/null; then
    echo -e "${RED}⚠️  PostgreSQL not found. Please install PostgreSQL 14+${NC}"
    echo "   macOS: brew install postgresql"
    echo "   Ubuntu: sudo apt-get install postgresql"
    exit 1
fi
echo -e "${GREEN}✅ PostgreSQL found${NC}"
echo ""

# Setup Backend
echo -e "${BLUE}Setting up Backend...${NC}"
cd backend

if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo -e "${GREEN}✅ .env created. Please edit with your credentials.${NC}"
else
    echo -e "${GREEN}✅ .env already exists${NC}"
fi

echo "Installing backend dependencies..."
npm install

echo ""
echo -e "${BLUE}Creating database...${NC}"
createdb fittrack 2>/dev/null && echo -e "${GREEN}✅ Database created${NC}" || echo -e "${GREEN}✅ Database already exists${NC}"

echo ""
cd ..

# Setup Mobile
echo -e "${BLUE}Setting up Mobile App...${NC}"
cd mobile

echo "Installing mobile dependencies..."
npm install

echo -e "${GREEN}✅ Mobile setup complete${NC}"
echo ""
cd ..

# Final Instructions
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Next steps:"
echo ""
echo "1. Configure backend/.env with your credentials:"
echo "   - Database credentials"
echo "   - JWT secrets"
echo "   - Gemini API key (already set)"
echo ""
echo "2. Start the backend:"
echo "   cd backend"
echo "   npm run start:dev"
echo ""
echo "3. In a new terminal, start the mobile app:"
echo "   cd mobile"
echo "   npm start"
echo ""
echo "4. Press 'i' for iOS simulator or 'a' for Android emulator"
echo ""
echo "📚 Documentation:"
echo "   - README.md - Project overview"
echo "   - API_DOCUMENTATION.md - API endpoints"
echo "   - DEVELOPMENT.md - Development guide"
echo ""
echo -e "${GREEN}Happy coding! 💪${NC}"
