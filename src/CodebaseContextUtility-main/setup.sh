#!/bin/bash

# Colors for console output
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Setting up Codebase Context Utility...${NC}"

# Check Node.js version
NODE_VERSION=$(node -v)
echo -e "${YELLOW}Node.js version: $NODE_VERSION${NC}"

# Compare versions (simplified)
required_major=18
current_major=$(echo $NODE_VERSION | cut -d. -f1 | sed 's/v//')

if [ "$current_major" -lt "$required_major" ]; then
  echo -e "${RED}Error: Node.js version v$required_major.0.0 or higher is required. Current version: $NODE_VERSION${NC}"
  exit 1
fi

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
npm install

if [ $? -ne 0 ]; then
  echo -e "${RED}Failed to install dependencies${NC}"
  exit 1
fi

# Create necessary directories if they don't exist
directories=("components/ui" "lib" "utils" "public")
for dir in "${directories[@]}"; do
  if [ ! -d "$dir" ]; then
    echo -e "${YELLOW}Creating directory: $dir${NC}"
    mkdir -p "$dir"
  fi
done

echo -e "${GREEN}Setup complete! You can now run the development server:${NC}"
echo -e "${BLUE}npm run dev${NC}"
echo -e "${GREEN}Then open http://localhost:3000 in your browser.${NC}"
