<<<<<<< HEAD

=======
# SUVIDHA Kiosk Backend Platform

SUVIDHA (Smart Urban Virtual Interactive Digital Helpdesk Assistant) is a unified backend platform for Smart City kiosks, built with Django 5 and Django Rest Framework.

## Features
- **Authentication**: JWT-based auth with OTP support (Mobile/Consumer Number).
- **RBAC**: Role-based access for Citizens, Admins, and SuperAdmins.
- **Multilingual**: Native support for 22 Indian languages.
- **Microservices-style Apps**: Modular architecture for Billing, Payments, Grievances, etc.
- **Security**: Audit logging, Rate limiting, CORS, standard cryptography.
- **Performance**: Redis caching, Celery task queue ready.

## Tech Stack
- **Framework**: Django 5.x, DRF
- **Database**: PostgreSQL
- **Cache**: Redis
- **Task Queue**: Celery
- **Containerization**: Docker

## Prerequisites
- Python 3.12+
- PostgreSQL
- Redis
- Docker (optional)

## Installation (Local Development)

1. **Clone the repository**
   ```bash
   git clone <repo_url>
   cd suvidha_backend
   ```

2. **Create Virtual Environment**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements/development.txt
   ```

4. **Environment Setup**
   Create a `.env` file in the root directory:
   ```bash
   DEBUG=True
   SECRET_KEY=your-secret-key
   DATABASE_URL=postgres://user:password@localhost:5432/suvidha
   REDIS_URL=redis://localhost:6379/0
   ```

5. **Migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create Superuser**
   ```bash
   python manage.py createsuperuser
   ```

7. **Run Server**
   ```bash
   python manage.py runserver
   ```

## API Documentation
Once the server is running, visit:
- **Swagger UI**: `http://localhost:8000/swagger/`
- **ReDoc**: `http://localhost:8000/redoc/`

## Docker Deployment
```bash
docker-compose up --build
```

## Testing
```bash
pytest
```
>>>>>>> 141ca6a5 (Backend is updated)
