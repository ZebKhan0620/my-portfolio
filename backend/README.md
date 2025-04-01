# Portfolio Backend API

This is the backend API for the portfolio website. It provides endpoints for projects, blog posts, contact form submissions, and the advice wall.

## Tech Stack

- **Node.js & Express**: Server framework
- **TypeScript**: Type safety and better developer experience
- **SQLite**: Simple file-based database
- **Sequelize**: ORM for database interactions
- **Railway**: Cloud deployment platform

## Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Server will run on `http://localhost:3002`

## API Endpoints

- **GET /api/projects**: Get all projects
- **GET /api/blogs**: Get all blog posts
- **POST /api/contact**: Submit contact form
- **GET /api/advice**: Get advice entries
- **POST /api/advice**: Add a new advice entry
- **GET /api/health**: Health check endpoint

## Deployment to Railway

### Manual Deployment

1. Create a Railway account at [railway.app](https://railway.app)
2. Install the Railway CLI: `npm i -g @railway/cli`
3. Login to Railway: `railway login`
4. Initialize your project: `railway init`
5. Link to your GitHub repository: `railway link`
6. Deploy your application: `railway up`

### Automatic Deployment via GitHub

1. Push your code to GitHub
2. Connect your GitHub repository to Railway
3. Railway will automatically deploy when you push to the main branch

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=3002
NODE_ENV=production
DATABASE_PATH=/tmp/portfolio.sqlite
SMTP_HOST=your-smtp-host
SMTP_PORT=465
SMTP_USER=your-email
SMTP_PASS=your-password
SMTP_FROM=your-email
FRONTEND_URL=https://your-frontend-url.vercel.app
```

## Important Notes About Railway Deployment

- Railway provides a transient filesystem where `/tmp` is writable
- SQLite database is configured to use `/tmp/portfolio.sqlite`
- This means data **will not persist** between deployments
- For true persistence, consider migrating to Railway's PostgreSQL add-on 