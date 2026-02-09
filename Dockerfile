# Pull official base image
FROM python:3.12-slim

# Set work directory
WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install system dependencies
RUN apt-get update && apt-get install -y netcat-openbsd gcc libpq-dev && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY ./requirements /app/requirements
RUN pip install --upgrade pip
RUN pip install -r requirements/production.txt

# Copy project
COPY . /app/

# Expose port
EXPOSE 8000

# Entrypoint
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "config.wsgi:application"]
