#!/bin/bash

# Script to add a new article and deploy to Vercel
# Usage: ./scripts/add-article.sh path/to/article.md

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if article file is provided
if [ -z "$1" ]; then
    echo "Usage: ./scripts/add-article.sh path/to/article.md"
    echo "Example: ./scripts/add-article.sh ~/Desktop/my-new-article.md"
    exit 1
fi

# Check if file exists
if [ ! -f "$1" ]; then
    echo "Error: File $1 does not exist"
    exit 1
fi

# Get filename
FILENAME=$(basename "$1")

echo -e "${YELLOW}Adding new article: $FILENAME${NC}"

# Copy article to articles directory
cp "$1" "articles/$FILENAME"
echo -e "${GREEN}✓ Article copied to articles directory${NC}"

# Git operations
echo -e "${YELLOW}Pushing to GitHub...${NC}"
git add "articles/$FILENAME"
git commit -m "Add new article: $FILENAME"
git push

echo -e "${GREEN}✓ Article pushed to GitHub${NC}"
echo -e "${GREEN}✓ Vercel will auto-deploy in 1-2 minutes${NC}"
echo ""
echo "Your article will be live at:"
echo "https://blog-preview-surfer-seo.vercel.app"
echo ""
echo "View deployment progress at:"
echo "https://vercel.com/tasc-outsourcing/blog-preview-surfer-seo"