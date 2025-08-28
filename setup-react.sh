#!/bin/bash

echo "🚀 Setting up React GraphView Component..."
echo "=========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Initialize package.json if it doesn't exist
if [ ! -f "package.json" ]; then
    echo "📦 Initializing package.json..."
    npm init -y
fi

echo "📦 Installing required dependencies..."
echo ""

# Install React dependencies
echo "Installing React dependencies..."
npm install react react-dom react-scripts

# Install Cytoscape.js and related packages
echo "Installing Cytoscape.js dependencies..."
npm install cytoscape cytoscape-dagre axios

# Install development dependencies
echo "Installing development dependencies..."
npm install --save-dev @types/react @types/react-dom

echo ""
echo "✅ All dependencies installed successfully!"
echo ""
echo "🎯 Next steps:"
echo "1. Make sure your Flask backend is running on http://127.0.0.1:5000"
echo "2. Start the React development server: npm start"
echo "3. Import and use the GraphView component in your React app"
echo ""
echo "📚 For detailed usage instructions, see README-React.md"
echo ""
echo "🎉 Setup complete! Happy coding! 🚀"
