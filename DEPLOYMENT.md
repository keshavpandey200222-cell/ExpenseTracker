# Deployment Guide - Expense Tracker

## Overview
This guide will help you deploy your Expense Tracker application to production.

## Prerequisites
- Node.js 18+ installed
- Java 17+ installed
- Maven installed
- Git installed
- Accounts on deployment platforms (Netlify/Vercel for frontend, Railway/Render for backend)

---

## Part 1: Backend Deployment (Railway/Render)

### Step 1: Prepare Backend for Production

#### 1.1 Update `application.properties` for Production
Create `application-prod.properties`:

```properties
# Database Configuration (PostgreSQL)
spring.datasource.url=${DATABASE_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# JWT Configuration
jwt.secret=${JWT_SECRET}
jwt.expiration=86400000

# Server Configuration
server.port=${PORT:8080}

# CORS Configuration
cors.allowed-origins=${FRONTEND_URL}
```

#### 1.2 Add PostgreSQL Dependency
Add to `pom.xml`:

```xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

### Step 2: Deploy to Railway

1. **Create Railway Account**: Go to [railway.app](https://railway.app)

2. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your GitHub repository

3. **Add PostgreSQL Database**:
   - Click "New" → "Database" → "PostgreSQL"
   - Railway will automatically create a database

4. **Set Environment Variables**:
   ```
   SPRING_PROFILES_ACTIVE=prod
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   FRONTEND_URL=https://your-frontend-url.netlify.app
   ```

5. **Deploy**:
   - Railway will automatically detect your Maven project
   - It will run `mvn clean install` and start your application
   - Your backend will be available at: `https://your-app.railway.app`

### Alternative: Deploy to Render

1. **Create Render Account**: Go to [render.com](https://render.com)

2. **Create Web Service**:
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select the backend directory

3. **Configure Service**:
   - **Name**: expense-tracker-backend
   - **Environment**: Java
   - **Build Command**: `mvn clean install`
   - **Start Command**: `java -jar target/expense-tracker-backend-0.0.1-SNAPSHOT.jar`

4. **Add PostgreSQL Database**:
   - Click "New" → "PostgreSQL"
   - Connect it to your web service

5. **Set Environment Variables** (same as Railway)

---

## Part 2: Frontend Deployment (Netlify/Vercel)

### Step 1: Prepare Frontend for Production

#### 1.1 Update API Base URL
Create `.env.production` in frontend directory:

```env
VITE_API_BASE_URL=https://your-backend-url.railway.app/api
```

#### 1.2 Update `api.js`
```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
```

### Step 2: Deploy to Netlify

1. **Build the Frontend**:
   ```bash
   cd expense-tracker-frontend
   npm run build
   ```

2. **Deploy via Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod
   ```

3. **Or Deploy via Netlify Dashboard**:
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - **Build settings**:
     - Base directory: `expense-tracker-frontend`
     - Build command: `npm run build`
     - Publish directory: `expense-tracker-frontend/dist`
   - **Environment variables**:
     - `VITE_API_BASE_URL`: Your backend URL

### Alternative: Deploy to Vercel

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   cd expense-tracker-frontend
   vercel --prod
   ```

3. **Or use Vercel Dashboard**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - **Build settings**:
     - Framework Preset: Vite
     - Root Directory: `expense-tracker-frontend`
   - **Environment variables**: Same as Netlify

---

## Part 3: Post-Deployment Configuration

### 1. Update CORS in Backend
Update `SecurityConfig.java`:

```java
configuration.setAllowedOrigins(Arrays.asList(
    "http://localhost:5173",
    "http://localhost:3000",
    "https://your-frontend-url.netlify.app"
));
```

### 2. Test Your Deployment

1. **Test Backend**:
   ```bash
   curl https://your-backend-url.railway.app/api/auth/login
   ```

2. **Test Frontend**:
   - Visit your frontend URL
   - Try registering a new account
   - Add transactions, wallets, categories
   - Check all pages work correctly

### 3. Set Up Custom Domain (Optional)

#### For Netlify:
- Go to Site settings → Domain management
- Add custom domain
- Update DNS records

#### For Railway:
- Go to Settings → Domains
- Add custom domain
- Update DNS records

---

## Environment Variables Reference

### Backend (Railway/Render)
```
SPRING_PROFILES_ACTIVE=prod
DATABASE_URL=<auto-provided-by-railway>
DB_USERNAME=<auto-provided-by-railway>
DB_PASSWORD=<auto-provided-by-railway>
JWT_SECRET=<generate-random-secret>
FRONTEND_URL=https://your-frontend.netlify.app
PORT=8080
```

### Frontend (Netlify/Vercel)
```
VITE_API_BASE_URL=https://your-backend.railway.app/api
```

---

## Troubleshooting

### Backend Issues

1. **Database Connection Failed**:
   - Check DATABASE_URL is correct
   - Ensure PostgreSQL is running
   - Check firewall settings

2. **CORS Errors**:
   - Verify FRONTEND_URL environment variable
   - Check SecurityConfig.java CORS settings
   - Ensure frontend URL matches exactly (no trailing slash)

3. **JWT Errors**:
   - Verify JWT_SECRET is set
   - Check token expiration time

### Frontend Issues

1. **API Calls Failing**:
   - Check VITE_API_BASE_URL is correct
   - Verify backend is running
   - Check browser console for errors

2. **Build Failures**:
   - Run `npm install` to ensure dependencies are installed
   - Check Node.js version (18+)
   - Clear cache: `rm -rf node_modules package-lock.json && npm install`

---

## Security Checklist

- [ ] Change JWT_SECRET to a strong random value
- [ ] Use HTTPS for both frontend and backend
- [ ] Enable CORS only for your frontend domain
- [ ] Use environment variables for all secrets
- [ ] Enable database backups
- [ ] Set up monitoring and logging
- [ ] Implement rate limiting (optional)
- [ ] Add SSL certificates (auto-provided by Netlify/Railway)

---

## Monitoring and Maintenance

### Railway Dashboard
- View logs: Click on your service → Logs tab
- Monitor metrics: CPU, Memory, Network usage
- Set up alerts for downtime

### Netlify Dashboard
- View deploy logs
- Monitor bandwidth usage
- Set up deploy notifications

---

## Cost Estimates

### Free Tier Limits

**Railway**:
- $5 free credit per month
- Enough for small apps with moderate traffic

**Render**:
- Free tier available (with limitations)
- Spins down after inactivity

**Netlify**:
- 100GB bandwidth/month
- 300 build minutes/month

**Vercel**:
- 100GB bandwidth/month
- Unlimited deployments

---

## Next Steps

1. Deploy backend to Railway/Render
2. Deploy frontend to Netlify/Vercel
3. Test all functionality
4. Set up custom domain (optional)
5. Monitor application performance
6. Set up automated backups

**Your Expense Tracker is now live! 🎉**
