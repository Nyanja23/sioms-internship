# Smart Inventory & Order Management System (SIOMS)

A B2B web app for small businesses to manage inventory, orders, customers, and analytics.

## Tech Stack
- **Backend**: Django, Django REST Framework (DRF), Simple JWT for auth, PostgreSQL (local: SQLite).
- **Frontend**: Vue 3 (Composition API), Pinia, Vue Router, Bootstrap 5.
- **Deployment**: Backend to Render/Railway, Frontend to Vercel/Netlify.
- **Other**: Git for version control.

## Features
1. Product Management (CRUD, stock levels, categories).
2. Order Management (create, update, fulfill).
3. Customer Management (CRUD).
4. Reports (sales analytics dashboard).
5. Authentication via JWT tokens.
6. Role-based access (Admin/Staff).

## Setup Instructions

### Backend
1. Clone repo: `git clone https://github.com/Nyanja23/sioms-internship.git`
2. Checkout develop: `git checkout develop`
3. Create/activate virtualenv: `python -m venv venv && source venv/bin/activate` (Linux/Mac) or `venv\Scripts\activate` (Windows)
4. Install deps: `pip install -r requirements.txt`
5. Navigate: `cd sioms_backend`
6. Run migrations: `python manage.py migrate`
7. Start server: `python manage.py runserver`

### Frontend
1. From root: `cd sioms_frontend`
2. Install deps: `npm install`
3. Run dev server: `npm run dev`