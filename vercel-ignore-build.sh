#!/bin/bash

# Check if any changed files are in the backend directory
if [[ $(git diff --name-only HEAD^ HEAD | grep "^backend/") ]]; then
  # Backend files have changed but we're going to ignore them for Vercel deployment
  echo "🔍 Backend changes detected, but will be ignored for Vercel deployment"
  echo "👉 Backend will be deployed separately"
  echo "✅ Only frontend will be built"
fi

# Always exit with code 1 to proceed with the build
# We handle TypeScript errors in our build.js script
exit 0 