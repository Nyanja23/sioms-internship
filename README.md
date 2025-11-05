# My Project
Project title: "Smart Inventory & Order Management System (SIOMS)"

Description: B2B web app for small businesses to manage products, orders, customers, and analytics.

Tech stack: Backend (Django, DRF, Simple JWT, PostgreSQL), Frontend (Vue 3, Pinia, Vue Router, Bootstrap).


## Setup
### Backend
1. Clone repo: `git clone https://github.com/Nyanja23/sioms-internship.git`
2. Create/activate virtualenv: `python -m venv venv && source venv/bin/activate`
3. Install deps: `pip install -r requirements.txt`
4. Run migrations: `cd sioms_backend && python manage.py migrate`
5. Start server: `python manage.py runserver`

### Frontend
1. Navigate: `cd sioms_frontend`
2. Install deps: `npm install`
3. Run dev server: `npm run dev`