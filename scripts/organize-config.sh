#!/bin/bash
# Script to organize configuration files into a dedicated config directory

# Create color variables for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting configuration files organization...${NC}"

# Create the config directory structure
echo "Creating config directory structure..."
mkdir -p config/eslint
mkdir -p config/jest
mkdir -p config/babel
mkdir -p config/postcss
mkdir -p config/tailwind
mkdir -p config/typescript

# Move ESLint config
if [ -f "eslint.config.mjs" ]; then
  echo "Moving ESLint configuration..."
  cp eslint.config.mjs config/eslint/
  # Update import paths in the ESLint config
  sed -i '' 's|"@eslint/eslintrc"|"../../node_modules/@eslint/eslintrc"|g' config/eslint/eslint.config.mjs 2>/dev/null || \
  sed -i 's|"@eslint/eslintrc"|"../../node_modules/@eslint/eslintrc"|g' config/eslint/eslint.config.mjs
  
  # Create a reference file in the root
  echo "Creating ESLint reference file in root..."
  cat > eslint.config.mjs << EOL
// Reference to the actual config file
import config from './config/eslint/eslint.config.mjs';
export default config;
EOL
  echo -e "${GREEN}ESLint configuration organized.${NC}"
else
  echo -e "${RED}ESLint config file not found.${NC}"
fi

# Move Jest config
if [ -f "jest.config.js" ]; then
  echo "Moving Jest configuration..."
  cp jest.config.js config/jest/
  cp jest.setup.ts config/jest/ 2>/dev/null
  
  # Update paths in Jest config
  sed -i '' 's|"./jest.setup.ts"|"./jest.setup.ts"|g' config/jest/jest.config.js 2>/dev/null || \
  sed -i 's|"./jest.setup.ts"|"./jest.setup.ts"|g' config/jest/jest.config.js
  
  # Create a reference file in the root
  echo "Creating Jest reference file in root..."
  cat > jest.config.js << EOL
// Reference to the actual config file
const config = require('./config/jest/jest.config.js');
module.exports = config;
EOL
  echo -e "${GREEN}Jest configuration organized.${NC}"
else
  echo -e "${RED}Jest config file not found.${NC}"
fi

# Move Babel config
if [ -f "babel.config.test.js" ]; then
  echo "Moving Babel configuration..."
  cp babel.config.test.js config/babel/
  
  # Create a reference file in the root
  echo "Creating Babel reference file in root..."
  cat > babel.config.test.js << EOL
// Reference to the actual config file
module.exports = require('./config/babel/babel.config.test.js');
EOL
  echo -e "${GREEN}Babel configuration organized.${NC}"
else
  echo -e "${RED}Babel config file not found.${NC}"
fi

# Move PostCSS config
if [ -f "postcss.config.js" ]; then
  echo "Moving PostCSS configuration..."
  cp postcss.config.js config/postcss/
  
  # Create a reference file in the root
  echo "Creating PostCSS reference file in root..."
  cat > postcss.config.js << EOL
// Reference to the actual config file
module.exports = require('./config/postcss/postcss.config.js');
EOL
  echo -e "${GREEN}PostCSS configuration organized.${NC}"
else
  echo -e "${RED}PostCSS config file not found.${NC}"
fi

# Move Tailwind config
if [ -f "tailwind.config.js" ]; then
  echo "Moving Tailwind configuration..."
  cp tailwind.config.js config/tailwind/
  
  # Create a reference file in the root
  echo "Creating Tailwind reference file in root..."
  cat > tailwind.config.js << EOL
// Reference to the actual config file
module.exports = require('./config/tailwind/tailwind.config.js');
EOL
  echo -e "${GREEN}Tailwind configuration organized.${NC}"
else
  echo -e "${RED}Tailwind config file not found.${NC}"
fi

# Move TypeScript config
if [ -f "tsconfig.json" ]; then
  echo "Moving TypeScript configuration..."
  cp tsconfig.json config/typescript/tsconfig.base.json
  
  # Create a reference file in the root
  echo "Creating TypeScript reference file in root..."
  cat > tsconfig.json << EOL
{
  "extends": "./config/typescript/tsconfig.base.json",
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    "**/*.js",
    "**/*.jsx",
    "**/*.mjs"
  ],
  "exclude": ["node_modules", ".next", "coverage"]
}
EOL
  echo -e "${GREEN}TypeScript configuration organized.${NC}"
else
  echo -e "${RED}TypeScript config file not found.${NC}"
fi

# Handle Next.js config
if [ -f "next.config.ts" ]; then
  echo "Next.js config should remain in the root directory for Next.js to find it."
  echo -e "${GREEN}Next.js configuration left in place.${NC}"
else
  echo -e "${RED}Next.js config file not found.${NC}"
fi

# Update package.json scripts
echo "Checking if package.json needs to be updated..."
if [ -f "package.json" ]; then
  # We'll update the references later when we've tested the configuration files
  echo "You may need to update your package.json scripts if there are any issues with the configuration."
  echo -e "${YELLOW}Please test all commands after reorganization.${NC}"
else
  echo -e "${RED}package.json not found.${NC}"
fi

echo -e "${GREEN}Configuration files organization complete!${NC}"
echo -e "${YELLOW}Please test your application to make sure everything works as expected.${NC}"
echo "Run the following commands to verify:"
echo "npm run lint"
echo "npm run test"
echo "npm run build" 