#!/usr/bin/env bash
# ShopMate AI - Complete Build & Deploy Script
# This script sets up the entire development environment

set -e

echo ""
echo "╔════════════════════════════════════════════════════════════════════════════╗"
echo "║                                                                            ║"
echo "║           🚀 ShopMate AI - SaaS CRM Platform Initialization 🚀             ║"
echo "║                                                                            ║"
echo "║                   Phase 1 ✅ + Phase 2 ✅ Complete                         ║"
echo "║                                                                            ║"
echo "╚════════════════════════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print section headers
print_section() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}📋 $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Check prerequisites
print_section "Prerequisites Check"

if ! command -v node &> /dev/null; then
    print_warning "Node.js not found. Please install Node.js 18+."
    exit 1
fi
print_success "Node.js: $(node --version)"

if ! command -v npm &> /dev/null; then
    print_warning "npm not found. Please install npm."
    exit 1
fi
print_success "npm: $(npm --version)"

if ! command -v docker &> /dev/null; then
    print_warning "Docker not found. Optional but recommended for databases."
else
    print_success "Docker: $(docker --version)"
fi

# Install server dependencies
print_section "Installing Server Dependencies"
cd server
if [ -f package.json ]; then
    npm install
    print_success "Server dependencies installed"
else
    print_warning "package.json not found in server directory"
fi
cd ..

# Install client dependencies
print_section "Installing Client Dependencies"
cd client
if [ -f package.json ]; then
    npm install
    print_success "Client dependencies installed"
else
    print_warning "package.json not found in client directory"
fi
cd ..

# Setup environment files
print_section "Setting Up Environment Files"

if [ ! -f server/.env ]; then
    if [ -f server/.env.example ]; then
        cp server/.env.example server/.env
        print_success "Created server/.env (⚠️  Configure with your values)"
    fi
else
    print_success "server/.env already exists"
fi

if [ ! -f client/.env ]; then
    if [ -f client/.env.example ]; then
        cp client/.env.example client/.env
        print_success "Created client/.env"
    fi
else
    print_success "client/.env already exists"
fi

# Summary
print_section "Setup Complete! ✅"

echo -e "${GREEN}Everything is ready to go!${NC}"
echo ""
echo "Next steps:"
echo ""
echo -e "${BLUE}1. Configure Environment Variables${NC}"
echo "   Edit server/.env with your database and API credentials"
echo ""
echo -e "${BLUE}2. Start Databases (optional)${NC}"
echo "   docker-compose up -d mongodb redis"
echo ""
echo -e "${BLUE}3. Start Development Servers${NC}"
echo "   Terminal 1: cd server && npm run dev"
echo "   Terminal 2: cd client && npm start"
echo ""
echo -e "${BLUE}4. Access the Application${NC}"
echo "   Client: http://localhost:3000"
echo "   Server: http://localhost:5000"
echo "   API Health: http://localhost:5000/api/health"
echo ""
echo -e "${BLUE}5. Test Authentication${NC}"
echo "   curl -X POST http://localhost:5000/api/auth/register \\"
echo "     -H \"Content-Type: application/json\" \\"
echo "     -d '{\"email\":\"test@example.com\",\"password\":\"testpass123\",\"passwordConfirm\":\"testpass123\",\"name\":\"Test User\"}'"
echo ""
echo "📚 Documentation:"
echo "   • README.md - Project overview"
echo "   • PHASE_2_COMPLETE.md - Detailed Phase 2 documentation"
echo "   • DEVELOPMENT_ROADMAP.md - Development guide & next steps"
echo "   • ARCHITECTURE.md - System architecture"
echo ""
echo -e "${GREEN}Happy coding! 🎉${NC}"
echo ""
