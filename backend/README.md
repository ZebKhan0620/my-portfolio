# Portfolio Backend

A production-ready backend API for a portfolio website. Built with Node.js, Express, TypeScript, and SQLite.

## Features

- Contact form submission with email notifications
- Project management system
- Blog post management
- Content moderation
- Rate limiting and security features
- Production-ready with optimized configuration

## Requirements

- Node.js 16+
- npm

## Deployment Instructions

### Quick Start

1. Clone this repository
2. Install dependencies:
   ```
   npm install --omit=dev
   ```
3. Prepare for production:
   ```
   npm run prod:prepare
   ```
4. Configure your environment variables in `.env.production`
5. Start the server:
   ```
   npm run prod:start
   ```
   
Alternatively, use the provided batch scripts:
```
.\prep-production.bat  # Prepare for production
.\start-production.bat # Start the server
```

### Environment Variables

Create a `.env.production` file with the following variables:

```
# Server Configuration
PORT=3001
NODE_ENV=production

# Email Configuration
SMTP_HOST=smtp.example.com
SMTP_PORT=465
SMTP_USER=your_email@example.com
SMTP_PASS=your_password
SMTP_FROM=your_email@example.com
ADMIN_EMAIL=admin@yourdomain.com

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000
```

### API Endpoints

- `GET /api/health` - Health check endpoint
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create a new project
- `PUT /api/projects/:id` - Update a project
- `DELETE /api/projects/:id` - Delete a project
- `GET /api/blogs` - Get all blog posts
- `GET /api/blogs/:id` - Get blog post by ID
- `POST /api/blogs` - Create a new blog post
- `PUT /api/blogs/:id` - Update a blog post
- `DELETE /api/blogs/:id` - Delete a blog post
- `POST /api/contact` - Submit contact form

## Database

The application uses SQLite for data storage. Database files are stored in the `data` directory. 