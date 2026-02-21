# Installing Java 17 - Step by Step Guide

## Option 1: Eclipse Temurin 17 (Recommended - Easier)

### Step 1: Download
1. Go to: **https://adoptium.net/temurin/releases/?version=17**
2. Select:
   - **Operating System**: Windows
   - **Architecture**: x64
   - **Package Type**: JDK
   - **Version**: 17 - LTS
3. Click the `.msi` installer download button

### Step 2: Install
1. Run the downloaded `.msi` file
2. **IMPORTANT**: During installation, check these boxes:
   - ✅ **Set JAVA_HOME variable**
   - ✅ **Add to PATH**
   - ✅ **JavaSoft (Oracle) registry keys**
3. Click "Next" and complete installation

### Step 3: Verify Installation
Open a **NEW** PowerShell or Command Prompt window and run:
```bash
java -version
```

You should see:
```
openjdk version "17.0.x"
```

---

## Option 2: Oracle JDK 17

### Step 1: Download
1. Go to: **https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html**
2. Accept the license agreement
3. Download: **Windows x64 Installer** (jdk-17_windows-x64_bin.exe)

### Step 2: Install
1. Run the downloaded `.exe` file
2. Follow the installation wizard
3. Note the installation path (usually `C:\Program Files\Java\jdk-17`)

### Step 3: Set Environment Variables
1. Press `Windows + R`, type `sysdm.cpl`, press Enter
2. Click `Advanced` tab → `Environment Variables`
3. Under "System variables", click `New`:
   - Variable name: `JAVA_HOME`
   - Variable value: `C:\Program Files\Java\jdk-17` (your installation path)
4. Find `Path` variable, click `Edit`, click `New`, add: `%JAVA_HOME%\bin`
5. Click OK on all windows

### Step 4: Verify Installation
Open a **NEW** PowerShell or Command Prompt and run:
```bash
java -version
```

You should see:
```
java version "17.0.x"
```

---

## After Installing Java 17

### Step 1: Verify Java Version
```bash
java -version
```
Should show version 17.x.x

### Step 2: Navigate to Backend Folder
```bash
cd "c:\Users\pande\personal expenses traker\expense-tracker-backend"
```

### Step 3: Run the Backend
```bash
mvn spring-boot:run
```

### Step 4: Wait for Startup
You should see:
```
Started ExpenseTrackerApplication in X.XXX seconds
```

✅ **Backend will be running on http://localhost:8080**

---

## Troubleshooting

**"java -version" still shows Java 25:**
- Make sure you opened a **NEW** terminal window after installation
- Restart your computer if needed
- Check that `JAVA_HOME` is set correctly

**Maven still uses Java 25:**
- Run: `mvn -version` to check which Java Maven is using
- If it shows Java 25, restart your terminal
- You may need to restart your computer

**Port 8080 already in use:**
- Another application is using port 8080
- Close it or change the port in `application.properties`

---

## Quick Summary

1. **Download**: Eclipse Temurin 17 from https://adoptium.net/temurin/releases/?version=17
2. **Install**: Run the `.msi` file, check "Set JAVA_HOME" and "Add to PATH"
3. **Verify**: Open NEW terminal, run `java -version`
4. **Run Backend**: `cd expense-tracker-backend && mvn spring-boot:run`
5. **Success**: Backend starts on http://localhost:8080

---

## What Happens Next

Once Java 17 is installed and the backend starts:
1. Frontend is already running on http://localhost:5173 ✅
2. Backend will be running on http://localhost:8080 ✅
3. Open http://localhost:5173 in your browser
4. Sign up and start using the app! 🎉
