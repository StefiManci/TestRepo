# Docker Guide

This guide provides detailed information about running the Employee Administrator App with Docker.

## Quick Start

```bash
# Build and start all services
docker-compose up --build

# Or run in background
docker-compose up -d --build

# Stop all services
docker-compose down

# Stop and remove volumes (deletes database)
docker-compose down -v
```

## Architecture

The Docker setup consists of three services:

1. **db** - SQL Server 2022 database
2. **api** - ASP.NET Core 9.0 Web API backend
3. **frontend** - React frontend served via Nginx

## Services Details

### Database (db)

- **Image**: `mcr.microsoft.com/mssql/server:2022-latest`
- **Port**: `1433` (mapped to host)
- **Credentials**:
  - Username: `sa`
  - Password: `YourStrong@Passw0rd` (change in production!)
- **Volume**: `sqlserver_data` (persistent storage)
- **Health Check**: Checks database connectivity every 10 seconds

### Backend API (api)

- **Port**: `8080` (mapped to host)
- **Environment Variables**:
  - `ConnectionStrings__DefaultConnection`: Points to the `db` service
  - `Jwt__Key`: JWT signing key
  - `Jwt__Issuer`: Token issuer
  - `Jwt__Audience`: Token audience
- **Dependencies**: Waits for database to be healthy before starting
- **Migrations**: Applied automatically on startup via `SeedData.Initialize()`

### Frontend (frontend)

- **Port**: `3000` (mapped to host)
- **Build Args**: `VITE_API_URL` - API endpoint URL
- **Served via**: Nginx
- **Dependencies**: Waits for API to be healthy before starting

## Customization

### Changing Ports

Edit `docker-compose.yml`:

```yaml
services:
  api:
    ports:
      - "YOUR_PORT:8080"  # Change YOUR_PORT
  
  frontend:
    ports:
      - "YOUR_PORT:80"  # Change YOUR_PORT
  
  db:
    ports:
      - "YOUR_PORT:1433"  # Change YOUR_PORT
```

### Changing Database Password

Edit `docker-compose.yml`:

```yaml
services:
  db:
    environment:
      - SA_PASSWORD=YourNewPassword
  
  api:
    environment:
      - ConnectionStrings__DefaultConnection=Server=db;Database=EmployeeAdministrator;User Id=sa;Password=YourNewPassword;...
```

### Changing API URL for Frontend

Edit `docker-compose.yml`:

```yaml
services:
  frontend:
    build:
      args:
        - VITE_API_URL=http://your-api-url:port
```

## Database Migrations

Migrations are automatically applied when the API container starts. If you need to create a new migration:

```bash
# Enter the API container
docker-compose exec api bash

# Create migration (inside container)
dotnet ef migrations add YourMigrationName

# Exit container
exit

# Copy migration files from container to host (if needed)
docker cp employee-admin-api:/app/Migrations ./Server/EmployeeAdministrator/Migrations
```

Or run migrations directly:

```bash
docker-compose exec api dotnet ef database update
```

## Viewing Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
docker-compose logs -f frontend
docker-compose logs -f db

# Last 100 lines
docker-compose logs --tail=100 api
```

## Accessing Services

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Swagger UI**: http://localhost:8080
- **Database**: localhost:1433
  - Username: `sa`
  - Password: `YourStrong@Passw0rd`

## Troubleshooting

### Database Won't Start

1. Check if port 1433 is available:
   ```bash
   netstat -an | grep 1433
   ```

2. Check database logs:
   ```bash
   docker-compose logs db
   ```

3. Ensure Docker has enough resources (Settings → Resources in Docker Desktop)

### API Can't Connect to Database

1. Wait for database health check to pass (takes ~30 seconds)
2. Check database is running:
   ```bash
   docker-compose ps
   ```
3. Verify connection string in `docker-compose.yml`

### Frontend Can't Connect to API

1. Verify API is running:
   ```bash
   curl http://localhost:8080/swagger/index.html
   ```

2. Check API logs:
   ```bash
   docker-compose logs api
   ```

3. Verify `VITE_API_URL` in docker-compose.yml matches your API URL

### Rebuilding After Code Changes

```bash
# Rebuild specific service
docker-compose up --build api
docker-compose up --build frontend

# Rebuild all services
docker-compose up --build
```

### Clearing Everything

```bash
# Stop and remove containers, networks, and volumes
docker-compose down -v

# Remove images (optional)
docker-compose down --rmi all

# Remove everything including volumes
docker-compose down -v --rmi all
```

## Production Considerations

Before deploying to production:

1. **Change default passwords** in `docker-compose.yml`
2. **Update JWT secret key** to a strong, random value
3. **Configure proper CORS** settings in the backend
4. **Use environment files** (`.env`) instead of hardcoding values
5. **Enable HTTPS** for both frontend and backend
6. **Set up proper database backups**
7. **Configure resource limits** for containers
8. **Use Docker secrets** for sensitive data
9. **Set up monitoring and logging**
10. **Configure reverse proxy** (nginx/traefik) for production

## Development vs Production

For development, the current setup is sufficient. For production:

- Use separate `docker-compose.prod.yml` with production settings
- Set up SSL/TLS certificates
- Configure proper firewall rules
- Use managed database service (Azure SQL, AWS RDS) instead of containerized SQL Server
- Set up CI/CD pipeline
- Use container orchestration (Kubernetes, Docker Swarm) for scaling



