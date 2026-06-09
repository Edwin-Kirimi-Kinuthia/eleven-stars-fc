#!/bin/bash

# Eleven Stars FC - Database Setup Script

set -e

echo "🚀 Eleven Stars FC - Database Setup"
echo "===================================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
  echo "⚠️  .env.local not found!"
  echo ""
  echo "Please create .env.local with the following:"
  echo "  DATABASE_URL=\"postgresql://...your-supabase-connection...\""
  echo "  NEXTAUTH_SECRET=\"...generate with: openssl rand -base64 32...\""
  echo ""
  echo "See DATABASE_SETUP.md for full instructions."
  exit 1
fi

echo "✓ .env.local found"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✓ Dependencies installed"
echo ""

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate
echo "✓ Prisma client generated"
echo ""

# Run migrations
echo "🗄️  Creating database schema..."
npx prisma migrate dev --name init
echo "✓ Database schema created"
echo ""

echo "✅ Database setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your Safaricom M-Pesa credentials"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Test API endpoints:"
echo "   - GET http://localhost:3000/api/players"
echo "   - GET http://localhost:3000/api/fixtures"
echo "   - GET http://localhost:3000/api/products"
echo ""
echo "📖 See DATABASE_SETUP.md for full documentation"
