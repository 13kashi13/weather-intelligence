# FORECAST.AI — Weather Intelligence Platform

## Architecture
```
User → Vercel (React Frontend) → Render (FastAPI Backend) → OpenWeatherMap API
```

## Local Development

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
# Runs on http://localhost:8000
```

### Frontend
```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```

## Deployment

### Backend → Render
1. Connect GitHub repo on https://render.com
2. New Web Service → select repo
3. Root Directory: `backend`
4. Build Command: `pip install -r requirements.txt`
5. Start Command: `uvicorn main:app --host 0.0.0.0 --port 10000`
6. Add environment variables (see `backend/.env.example`)

### Frontend → Vercel
1. Connect GitHub repo on https://vercel.com
2. Root Directory: `frontend`
3. Framework: Create React App
4. Add environment variables:
   - `REACT_APP_API_URL` = your Render backend URL
   - `REACT_APP_GOOGLE_MAPS_KEY` = your Google Maps key

## Environment Variables

### Backend (`backend/.env`)
See `backend/.env.example`

### Frontend (`frontend/.env`)
See `frontend/.env.example`
