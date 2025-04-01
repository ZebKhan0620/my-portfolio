# Portfolio Backend System Implementation Plan

## Overview
This document outlines the implementation plan for a lightweight, production-ready backend system for a personal portfolio website. The backend will handle contact form submissions, track visitor counts, manage FAQ content, store visitor advice/suggestions, and potentially serve project data dynamically.

## Technology Stack
- **Backend Framework**: Node.js + Express + TypeScript
- **Database**: MySQL
- **ORM**: Sequelize or TypeORM
- **Hosting**: AWS EC2, DigitalOcean, or similar
- **CI/CD**: GitHub Actions
- **Email**: SendGrid or similar for email notifications

## Implementation Timeline

### Week 1: Backend Architecture Setup

#### Initial Setup
- Initialize Node.js/Express project with TypeScript
- Set up project structure:
  - `/src`
    - `/routes` - API route definitions
    - `/controllers` - Request handlers
    - `/services` - Business logic
    - `/models` - Data models
    - `/config` - Configuration
    - `/utils` - Helper functions
    - `/middleware` - Custom middleware
- Implement environment configuration management
- Set up ESLint and Prettier for code quality
- Configure logging system

#### API Design
- Design and document the following API endpoints:
  - `POST /api/contact` - Submit contact form
  - `GET /api/projects` (optional) - Retrieve project data
  - `GET /api/visitors/count` - Get current visitor count
  - `POST /api/visitors/increment` - Increment visitor count
  - `GET /api/faq` - Retrieve FAQ items
  - `GET /api/advice` - Get visitor advice entries
  - `POST /api/advice` - Submit advice/suggestions
- Set up basic error handling middleware
- Implement request validation

### Week 2: MySQL Database Integration

#### Database Setup
- Set up MySQL database instance
- Configure connection pooling
- Implement ORM (Sequelize or TypeORM)
- Create initial database schema
- Set up migration system for version control

#### Data Models
- Implement the following models:
  - `Message` (name, email, content, created_at)
  - `Project` (optional - title, description, image_urls, technologies, links, created_at, updated_at)
  - `VisitorCount` (count, last_updated)
  - `FAQ` (question, answer, category, order)
  - `Advice` (content, author_name, created_at)
- Add data validation
- Set up database indexes for performance

### Week 3: Core Feature Implementation

#### Contact Form Backend
- Create endpoint for contact form submissions
- Implement input validation and sanitization
- Set up email notification system for new messages
- Add rate limiting to prevent spam
- Implement IP-based throttling
- Store form submissions in database

#### Visitor Counter System
- Create endpoints for getting and incrementing visitor count
- Implement milestone detection logic
- Add IP-based tracking to prevent duplicate counts
- Set up session management for accurate counting
- Create optional notification for milestone visitors

#### FAQ Management
- Implement endpoints to retrieve FAQ items
- Add sorting by category and custom order
- Set up caching for FAQ data
- Create optional admin endpoint for updating FAQs

### Week 4: Additional Features & CI/CD

#### Advice & Suggestions Wall
- Create endpoints for submitting and retrieving advice entries
- Implement content moderation (optional) or profanity filter
- Add pagination for advice entries
- Implement sorting options (newest, popular)
- Create rate limiting to prevent spam submissions

#### GitHub Actions Setup
- Create workflow for running tests on pull requests
- Configure linting checks
- Set up security scanning for dependencies
- Implement build and deployment pipelines

#### Deployment Infrastructure
- Set up production environment on cloud provider
- Configure MySQL database for production
- Implement environment-specific configuration
- Set up automated database backups
- Configure logging for production environment

### Week 5: Security and Performance

#### Security Implementation
- Set up CORS configuration
- Implement rate limiting for all endpoints
- Add input validation middleware
- Configure security headers
  - Content-Security-Policy
  - X-XSS-Protection
  - X-Content-Type-Options
- Perform security audit

#### Performance Optimization
- Implement response compression
- Set up basic caching strategy
- Optimize database queries
- Configure connection pooling

### Week 6: Final Integration and Testing

#### Integration
- Connect frontend components to backend API:
  - Contact form
  - Visitor counter with milestone UI
  - FAQ accordion components
  - Advice & Suggestions Wall
- Test full submission flows
- Implement error handling on frontend
- Add loading states and feedback

#### Final Review
- Perform end-to-end testing
- Conduct security review
- Optimize performance
- Finalize documentation

## Database Schema

### Messages Table
```sql
CREATE TABLE messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('new', 'read', 'replied') DEFAULT 'new',
  ip_address VARCHAR(45),
  INDEX email_idx (email),
  INDEX status_idx (status)
);
```

### Projects Table (Optional)
```sql
CREATE TABLE projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  image_urls JSON,
  technologies JSON,
  repo_url VARCHAR(255),
  demo_url VARCHAR(255),
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX featured_idx (featured)
);
```

### Visitor Counter Table
```sql
CREATE TABLE visitor_counter (
  id INT PRIMARY KEY DEFAULT 1,
  count INT DEFAULT 0,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT single_row CHECK (id = 1)
);
```

### FAQ Table
```sql
CREATE TABLE faqs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question VARCHAR(255) NOT NULL,
  answer TEXT NOT NULL,
  category ENUM('technical', 'personal', 'general') DEFAULT 'general',
  display_order INT DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX category_idx (category),
  INDEX order_idx (display_order),
  INDEX active_idx (active)
);
```

### Advice Table
```sql
CREATE TABLE advice (
  id INT AUTO_INCREMENT PRIMARY KEY,
  content TEXT NOT NULL,
  author_name VARCHAR(100),
  ip_address VARCHAR(45),
  moderated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX moderated_idx (moderated)
);
```

## Frontend Components Integration

### Visitor Counter Feature
- **Data Handling**:
  - On page load, call `GET /api/visitors/count` to retrieve current count
  - After retrieval, call `POST /api/visitors/increment` to register visit
  - Store milestone status in session or local storage to persist during visit

- **UI Components**:
  - Floating counter display with Tailwind styles (glassmorphism design)
  - Animated milestone celebration component
  - Milestone confetti effect using React libraries (like react-confetti)

- **Milestone Logic**:
  ```typescript
  const isMilestone = (count: number): boolean => {
    // Define milestone rules (every 10, 100, etc.)
    return count % 10 === 0;
  };
  ```

### FAQ Section
- **Data Handling**:
  - Fetch FAQ items from `GET /api/faq`
  - Group by category (technical, personal)
  - Sort by display_order

- **UI Components**:
  - Accordion or tab-based layout with Tailwind
  - Category filtering options
  - Search functionality
  - Smooth expand/collapse animations

- **Sample Data Structure**:
  ```typescript
  interface FAQ {
    id: number;
    question: string;
    answer: string;
    category: 'technical' | 'personal' | 'general';
  }
  ```

### Advice & Suggestions Wall
- **Data Handling**:
  - Submit new entries to `POST /api/advice`
  - Fetch existing entries from `GET /api/advice`
  - Implement pagination and sorting

- **UI Component Ideas**:
  - Card-based grid layout with staggered animations
  - Virtual "sticky notes" wall
  - Animated text ticker/carousel for highlighting entries
  - Flip cards with reveal animations
  - Form with character counter and validation

## CI/CD Workflow

The GitHub Actions workflow will include:

1. **On Pull Request**:
   - Lint code
   - Run tests
   - Check for security vulnerabilities

2. **On Merge to Main**:
   - Build application
   - Run tests
   - Deploy to production environment
   - Run database migrations (if any)

## Monitoring and Maintenance

- Set up basic health check endpoint
- Implement error logging
- Configure automated database backups
- Set up email alerts for server issues
- Monitor visitor count patterns

## Security Considerations

- All API endpoints will be protected with rate limiting
- Input validation for all user-submitted data
- Secure headers to prevent common web vulnerabilities
- Regular dependency updates
- Database connection security
- Content moderation for user-submitted advice/suggestions 