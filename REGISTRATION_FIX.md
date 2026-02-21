# 🚨 Registration Failed - Backend Not Running

## Problem
The registration is failing because the **backend server is not running** on port 8080.

The frontend (running on port 5173) is trying to connect to the backend API at `http://localhost:8080/api/auth/register`, but there's no server responding.

---

## ✅ Solution: Start the Backend

You have **3 options** to start the backend. Choose the easiest one for you:

---

### Option 1: Use IntelliJ IDEA (EASIEST & RECOMMENDED) ⭐

**Step 1: Download IntelliJ IDEA Community Edition (FREE)**
- Go to: https://www.jetbrains.com/idea/download/
- Download "Community Edition" (it's free)
- Install it

**Step 2: Open the Backend Project**
1. Open IntelliJ IDEA
2. Click `File` → `Open`
3. Navigate to: `c:\Users\pande\personal expenses traker\expense-tracker-backend`
4. Click `OK`

**Step 3: Wait for Dependencies**
- IntelliJ will automatically detect it's a Maven project
- Wait for it to download dependencies (you'll see progress in the bottom right)
- This may take 2-5 minutes the first time

**Step 4: Run the Application**
1. In the left sidebar (Project view), navigate to:
   ```
   src → main → java → com → expensetracker → ExpenseTrackerApplication.java
   ```
2. Right-click on `ExpenseTrackerApplication.java`
3. Click `Run 'ExpenseTrackerApplication'`

**Step 5: Verify It's Running**
You should see in the console:
```
Started ExpenseTrackerApplication in X.XXX seconds (JVM running for Y.YYY)
```

✅ **Backend is now running on `http://localhost:8080`**

---

### Option 2: Use VS Code with Java Extension

**Step 1: Install Extensions**
1. Open VS Code
2. Install these extensions:
   - "Extension Pack for Java" by Microsoft
   - "Spring Boot Extension Pack" by VMware

**Step 2: Open Backend Folder**
1. `File` → `Open Folder`
2. Select: `c:\Users\pande\personal expenses traker\expense-tracker-backend`

**Step 3: Run the Application**
1. Find `ExpenseTrackerApplication.java` in the explorer
2. You'll see a "Run" button above the `main` method
3. Click it

---

### Option 3: Install Maven (More Complex)

If you prefer command line, follow the Maven installation guide in `SETUP_FIXED.md`.

---

## 🎯 After Backend Starts

Once you see "Started ExpenseTrackerApplication" in the console:

1. **Go back to your browser** at `http://localhost:5173`
2. **Click "Sign up"**
3. **Fill in the form:**
   - Name: Your Name
   - Email: test@example.com
   - Password: password123
4. **Click "Sign Up"**
5. **You should see:** "Registration successful!" and be redirected to the dashboard

---

## 🔍 Quick Test

To verify the backend is running, open a new browser tab and go to:
```
http://localhost:8080/h2-console
```

If you see the H2 Console login page, the backend is running! ✅

---

## ⚡ Quick Troubleshooting

**"Port 8080 is already in use"**
- Another application is using port 8080
- Close it or change the port in `application.properties`

**"Cannot resolve dependencies"**
- Make sure you have internet connection
- Maven needs to download libraries

**"Java version error"**
- You have Java 25, which is fine
- The application will run

---

## 📝 Summary

**Current Status:**
- ✅ Frontend: Running on port 5173
- ❌ Backend: Not running (needs to be started)
- ✅ Database: H2 in-memory (no setup needed)

**What You Need:**
- Start the backend using IntelliJ IDEA (recommended)
- OR install Maven and run `mvn spring-boot:run`

**Recommended:** Download IntelliJ IDEA Community (free) - it's the easiest way to run Java applications.
