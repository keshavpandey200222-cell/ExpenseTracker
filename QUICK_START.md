# 🚀 Quick Start Guide

## Personal Expense Tracker Setup

### Step 1: Database Setup

1. **Install PostgreSQL** (if not already installed)

2. **Create Database**:
```sql
CREATE DATABASE expense_tracker;
```

3. **Update Backend Configuration**:
   - Open `expense-tracker-backend/src/main/resources/application.properties`
   - Update these lines with your PostgreSQL credentials:
   ```properties
   spring.datasource.username=your_postgres_username
   spring.datasource.password=your_postgres_password
   ```

### Step 2: Start Backend

```bash
cd expense-tracker-backend
mvn spring-boot:run
```

✅ Backend will start on `http://localhost:8080`

### Step 3: Start Frontend

```bash
cd expense-tracker-frontend
npm run dev
```

✅ Frontend will start on `http://localhost:5173`

### Step 4: Use the Application

1. Open browser: `http://localhost:5173`
2. Click "Sign up" to create a new account
3. Fill in your name, email, and password
4. Login with your credentials
5. Explore the dashboard!

---

## 🎯 What You Can Do

### Current Features
- ✅ Register and login
- ✅ View dashboard with financial summary
- ✅ See recent transactions
- ✅ Toggle dark mode
- ✅ Secure JWT authentication

### API Testing (Optional)

You can test the API using tools like Postman or curl:

**Register:**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

---

## 🔧 Troubleshooting

### Backend won't start
- Check if PostgreSQL is running
- Verify database credentials in `application.properties`
- Ensure port 8080 is not in use

### Frontend won't start
- Run `npm install` in the frontend directory
- Ensure port 5173 is not in use
- Check if backend is running

### Can't login
- Check browser console for errors
- Verify backend is running on port 8080
- Clear browser localStorage and try again

---

## 📝 Next Development Steps

To add more features:

1. **Transaction Management Page** - Create, edit, delete transactions
2. **Budget Alerts** - Set budgets and get warnings
3. **Reports with Charts** - Visualize spending patterns
4. **Recurring Transactions** - Auto-add monthly expenses
5. **Export Data** - Download reports as PDF/Excel

All the backend APIs are ready - you just need to build the frontend pages!
