# Portfolio Deployment Guide

## Summary of Changes Made
1. Fixed API route conflicts between Pages Router and App Router
2. Migrated Japanese advice API to App Router format
3. Added configuration for Vercel deployment
4. Set up dependency management with legacy-peer-deps

## Deployment Steps

### Development Mode
To run the project in development mode:
```bash
npm run dev
```

The site will be available at http://localhost:3000

### Production Deployment with Vercel
For the best deployment experience, deploy directly to Vercel:

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Vercel will automatically detect your Next.js project and deploy it
4. The vercel.json configuration will ensure proper build settings

### Manual Deployment
If you need to deploy manually:

1. Set the NODE_OPTIONS environment variable to increase memory limit:
```bash
# Windows PowerShell
$env:NODE_OPTIONS="--max-old-space-size=4096"

# Linux/Mac
export NODE_OPTIONS="--max-old-space-size=4096"
```

2. Run the build command:
```bash
npm run build
```

3. Start the production server:
```bash
npm start
```

## Important Notes
- The project is configured to use legacy-peer-deps to resolve dependency conflicts
- Japanese localization is implemented for all project sections
- The site is fully responsive and accessibility-optimized
- API routes are implemented using the App Router format for better performance

## Troubleshooting
If you encounter build issues with "Unexpected end of JSON input":
- Try deploying directly to Vercel which has an optimized build environment
- Use the .npmrc and vercel.json configurations provided
- Consider upgrading or downgrading cookies-next to a compatible version