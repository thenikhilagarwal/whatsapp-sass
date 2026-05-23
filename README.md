# WhatsApp SaaS & AI Auto-Reply Bot

This is a full-stack WhatsApp SaaS application with a React frontend and a Node.js/Express backend that integrates with the Meta WhatsApp Cloud API and Google's Gemini AI.

## 🚀 How to Start the Project

Whenever you close your computer and want to start working on this project again, follow these steps to get everything running:

### Step 1: Start the Backend Server
The backend handles the API requests and the Webhook from Meta.
1. Open a new terminal.
2. Navigate to the backend folder:
   ```bash
   cd backend
   ```
3. Start the server in development mode:
   ```bash
   npm run dev
   ```
*(This server runs on `http://localhost:5000`)*

### Step 2: Start the Frontend UI
The frontend is your React dashboard where you can manually send messages.
1. Open a **second** terminal.
2. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
3. Start the React app:
   ```bash
   npm run dev
   ```
*(This app runs on `http://localhost:5173`)*

### Step 3: Start the Ngrok Tunnel
Because your backend is running locally on your computer, Meta cannot send webhook messages to it. Ngrok creates a public internet bridge to your local server.
1. Open a **third** terminal.
2. Navigate to the backend folder:
   ```bash
   cd backend
   ```
3. Run the ngrok script:
   ```bash
   npm run ngrok
   ```
4. Ngrok will provide a "Forwarding" URL (it looks something like `https://xxxx-xx.ngrok-free.app`). **Copy this URL.**

---

## ⚠️ Important Daily Maintenance

Because you are in Development Mode, there are two things you **MUST** do every time you start the project:

### 1. Update your Webhook URL in Meta
Every time you restart Ngrok, your public URL changes. 
* Go to the [Meta Developer Dashboard](https://developers.facebook.com/).
* Navigate to your App -> **WhatsApp** -> **Configuration**.
* Click **Edit** next to the Callback URL.
* Paste your new Ngrok URL and **make sure to add `/api/webhook` to the end of it**.
  * *Example: `https://abcd-123.ngrok-free.app/api/webhook`*
* Use your `VERIFY_TOKEN` (from your `.env` file, e.g., `nikhil1997`) to verify and save.

### 2. Refresh your WhatsApp Token
Meta test tokens expire **every 24 hours**. 
* In the Meta Dashboard, go to **WhatsApp** -> **API Setup**.
* Generate a new **Temporary access token** and copy it.
* Open `backend/.env` and replace `WHATSAPP_TOKEN=` with the new token.
* Save the file (the backend will automatically restart).

---

## 🛠 Troubleshooting
* **DB Connection Error**: If you see `connect ECONNREFUSED 127.0.0.1:27017` in the backend terminal, it means your local MongoDB server is not running. The code will gracefully fall back to using your `.env` variables, but you should start MongoDB if you want to save user accounts.
* **Failed to send message (Unsupported post request)**: This means your `WHATSAPP_TOKEN` expired or your `PHONE_NUMBER_ID` is wrong. Follow "Refresh your WhatsApp Token" above.
* **AI doesn't reply**: Ensure your Ngrok URL is correctly saved in the Meta dashboard with the `/api/webhook` ending.
