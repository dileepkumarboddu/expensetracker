# 🚀 Complete Deployment Guide: Personal Expense Tracker

This guide walks you step-by-step through deploying your full-stack Personal Expense Tracker to the cloud for **free**:

| Component | Technology | Cloud Host | Cost |
|---|---|---|---|
| **Database** | MongoDB | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (M0 Cluster) | **Free** |
| **Backend API** | Spring Boot 3 + Java 17 | [Render](https://render.com) (Web Service) | **Free** |
| **Frontend UI** | React 18 + Vite | [Vercel](https://vercel.com) or [Netlify](https://netlify.com) | **Free** |

---

## 📑 Table of Contents

1. [Step 1: Set Up Cloud Database (MongoDB Atlas)](#step-1-set-up-cloud-database-mongodb-atlas)
2. [Step 2: Commit & Push Changes to GitHub](#step-2-commit--push-changes-to-github)
3. [Step 3: Deploy Backend on Render](#step-3-deploy-backend-on-render)
4. [Step 4: Deploy Frontend on Vercel or Netlify](#step-4-deploy-frontend-on-vercel-or-netlify)
5. [Step 5: Verify Live Deployment](#step-5-verify-live-deployment)
6. [Alternative: Deploy with Docker Compose](#alternative-deploy-with-docker-compose)
7. [Troubleshooting & Common Questions](#troubleshooting--common-questions)

---

## Step 1: Set Up Cloud Database (MongoDB Atlas)

Since local MongoDB (`mongodb://localhost:27017`) cannot be reached by cloud servers, you need a free hosted MongoDB database.

### 1. Create an Atlas Account
1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up / log in.
2. Select the **M0 Free (Shared)** tier.
3. Choose a cloud provider (AWS recommended) and a region closest to you.
4. Click **Create Deployment**.

### 2. Create a Database User
1. When prompted for credentials (or go to **Security** -> **Database Access** -> **Add New Database User**):
   - **Authentication Method**: Password
   - **Username**: `appuser` (or your choice)
   - **Password**: Generate a strong password (save this safely!).
     > **Tip**: Avoid special characters like `@`, `:`, `/`, or `%` in the password to prevent URL-encoding issues, or URL-encode them if used.
   - **Database User Privileges**: `Read and write to any database`
2. Click **Create User**.

### 3. Whitelist Network Access
Cloud hosting providers (like Render) use dynamic IP addresses.
1. In the left sidebar, click **Network Access** under Security.
2. Click **Add IP Address**.
3. Click **Allow Access from Anywhere** (enters `0.0.0.0/0`).
4. Click **Confirm**.

### 4. Copy Your Connection String
1. Go to **Database** -> Click **Connect** next to your cluster.
2. Choose **Drivers** (Java).
3. Copy the SRV connection string, which looks like:
   ```text
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Update the connection string:
   - Replace `<username>` with your database user (e.g. `appuser`).
   - Replace `<password>` with your database password.
   - Specify the database name `/expense_tracker` right before `?`:
   ```text
   mongodb+srv://appuser:YourPassword123@cluster0.xxxxx.mongodb.net/expense_tracker?retryWrites=true&w=majority
   ```
   *(Keep this string handy for Step 3).*

---

## Step 2: Commit & Push Changes to GitHub

Ensure all your latest files (Dockerfiles, CORS settings, rewrite rules) are pushed to your GitHub repository:

```bash
git add .
git commit -m "Configure application for cloud deployment"
git push origin main
```

---

## Step 3: Deploy Backend on Render

Render will build and host your Spring Boot backend web service.

### 1. Create a Web Service
1. Log in to [Render](https://render.com) using your GitHub account.
2. In the dashboard, click **New +** -> **Web Service**.
3. Under *Connect a repository*, choose your `expensetracker` repository.

### 2. Configure Service Details
Fill in the configuration fields:
- **Name**: `expense-tracker-backend` (or any unique name)
- **Region**: Select the region closest to your MongoDB Atlas cluster.
- **Language**: Choose **Docker** *(Recommended)* or **Java**.

#### Method A: Using Docker (Recommended for exact Java 17 runtime)
- **Language**: `Docker`
- **Root Directory**: *(leave blank or set to `backend`)*
- **Dockerfile Path**: `backend/Dockerfile`
- **Docker Build Context**: `backend`

#### Method B: Using Native Java
- **Language**: `Java`
- **Root Directory**: `backend`
- **Build Command**: `./gradlew build -x test`
- **Start Command**: `java -jar build/libs/backend-0.0.1-SNAPSHOT.jar`

### 3. Plan & Health Check
- **Instance Type**: Select **Free**.
- Expand **Advanced** and set:
  - **Health Check Path**: `/api/health`

### 4. Add Environment Variables
In the **Environment Variables** section, add the following:

| Key | Value | Notes |
|---|---|---|
| `MONGODB_URI` | `mongodb+srv://appuser:YourPassword123@cluster0.xxxxx.mongodb.net/expense_tracker?retryWrites=true&w=majority` | Your MongoDB Atlas connection string from Step 1 |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173,https://*.vercel.app,https://*.netlify.app` | Allows requests from Vercel & Netlify |

### 5. Deploy & Verify
1. Click **Create Web Service**.
2. Render will build and deploy the container. This typically takes 2-4 minutes on the first build.
3. Once the status shows **Live**, copy your public service URL at the top:
   `https://expense-tracker-backend-xxxx.onrender.com`
4. Test the health endpoint by opening in your browser:
   `https://expense-tracker-backend-xxxx.onrender.com/api/health`
   You should see:
   ```json
   {
     "status": "UP",
     "service": "expense-tracker-api",
     "timestamp": "..."
   }
   ```

---

## Step 4: Deploy Frontend on Vercel or Netlify

Choose either **Vercel** or **Netlify** to host your React + Vite frontend. Both offer generous free tiers.

### Option 4A: Deploy on Vercel (Recommended)

1. Log in to [Vercel](https://vercel.com) with GitHub.
2. Click **Add New...** -> **Project**.
3. Import your `expensetracker` repository.
4. In the project setup:
   - **Framework Preset**: Select `Vite`.
   - **Root Directory**: Click **Edit** and choose `frontend`.
   - **Build and Output Settings**: Defaults are correct (`npm run build` -> `dist`).
5. Under **Environment Variables**, add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://expense-tracker-backend-xxxx.onrender.com/api`  
     *(⚠️ Ensure you include `/api` at the end and no trailing slash).*
6. Click **Deploy**.
7. Vercel will build and assign you a live production URL (e.g. `https://expense-tracker-xxxx.vercel.app`).

### Option 4B: Deploy on Netlify

1. Log in to [Netlify](https://netlify.com) with GitHub.
2. Click **Add new site** -> **Import an existing project**.
3. Choose GitHub and select `expensetracker`.
4. Configure the build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
5. Under **Environment variables**:
   - Click **Add a variable**.
   - **Key**: `VITE_API_URL`
   - **Value**: `https://expense-tracker-backend-xxxx.onrender.com/api`
6. Click **Deploy Site**.

---

## Step 5: Verify Live Deployment

1. Open your live frontend URL (from Vercel or Netlify).
2. Add a new Income or Expense transaction.
3. Verify that the Dashboard summary cards update with the new totals.
4. Try filtering by category and date range.
5. Refresh the page on `/transactions` or an edit page to confirm that routing works seamlessly without 404 errors (handled by `vercel.json` and `_redirects`).

---

## Alternative: Deploy with Docker Compose

If you have a Linux VPS (e.g., AWS EC2, DigitalOcean, Hetzner, Linode) or wish to run all services locally:

1. Ensure Docker and Docker Compose are installed.
2. In the project root, run:
   ```bash
   docker compose up -d --build
   ```
3. Services started:
   - Frontend: `http://localhost` (Port 80)
   - Backend: `http://localhost:8080` (Port 8080)
   - MongoDB: `localhost:27017`
4. To stop:
   ```bash
   docker compose down
   ```

---

## Troubleshooting & Common Questions

### 1. Render Free Tier "Cold Starts"
> **Why is the first request slow?**  
> On Render's free tier, backend instances spin down after 15 minutes of inactivity. The first request after a period of inactivity may take **30 to 50 seconds** to wake up. Once awake, subsequent requests respond immediately.  
> *Tip*: You can set up a free pinging service (like [UptimeRobot](https://uptimerobot.com)) to ping your `/api/health` endpoint every 10 minutes to keep it warm.

### 2. MongoDB "Authentication Failed" or Connection Timeout
- Check that your username and password are correct.
- If your password contains special characters (`@`, `:`, `#`, etc.), ensure they are properly URL-encoded.
- In MongoDB Atlas, verify that **Network Access** includes `0.0.0.0/0` (Allow access from anywhere).

### 3. CORS Policy Errors in Browser Console
- If you see `Access to XMLHttpRequest at '...' from origin '...' has been blocked by CORS policy`:
  - Open Render Dashboard -> Backend Service -> **Environment Variables**.
  - Check `CORS_ALLOWED_ORIGINS`. Add your exact frontend URL (e.g. `https://my-app.vercel.app`) if you are using a custom domain.
  - Redeploy or restart the backend.

### 4. 404 Not Found on Page Refresh
- This occurs when client-side React Router paths are requested directly from static hosting.
- This project includes `frontend/vercel.json` and `frontend/public/_redirects` which automatically handle SPA routing rewrites.
