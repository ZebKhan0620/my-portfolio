# Portfolio Website with Advice Wall

A modern, responsive portfolio website built with Next.js, featuring an interactive Advice Wall where visitors can leave feedback, advice, and suggestions.

## Features

- Interactive Advice Wall with multiple display styles (Cards, LCD, Neon, Flip, Ticker)
- Project showcase
- Contact form
- Responsive design
- Serverless API routes

## Technologies Used

- Next.js 14
- TypeScript
- Tailwind CSS
- Framer Motion
- Axios

## Deployment to Vercel

This project is optimized for deployment to Vercel. You can deploy using one of the following methods:

### Method 1: Using the Custom Deploy Script (Recommended)

This method bypasses local build errors and lets Vercel handle the build process:

1. **Install Vercel CLI globally if you haven't already**

   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel via CLI**

   ```bash
   vercel login
   ```

3. **Run the deploy script**

   ```bash
   npm run deploy
   ```

   The script will automatically handle the deployment process.

### Method 2: Manual Deployment

1. **Push your code to GitHub**

   First, create a repository on GitHub and push your code:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**

   - Sign up or log in to [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Keep the default settings (Vercel will automatically detect Next.js)
   - Click "Deploy"

   Vercel will automatically build and deploy your application, including the serverless API endpoints.

3. **Environment Variables (Optional)**

   If needed, you can add environment variables in the Vercel dashboard:
   - Go to your project settings
   - Navigate to the "Environment Variables" section
   - Add any required variables (none are strictly required for this project)

## Local Development

To run the project locally:

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## API Endpoints

- `GET /api/advice` - Get all advice entries
- `POST /api/advice` - Submit a new advice entry
- `GET /api/advice/ja` - Get all Japanese advice entries
- `POST /api/advice/ja` - Submit a new Japanese advice entry
- `GET /api/projects` - Get all projects
- `POST /api/contact` - Submit a contact form message
