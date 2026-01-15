# Employee Administrator App

A full-stack web application for managing employees, projects, and tasks. Built with ASP.NET Core Web API backend and React frontend.

## Project Structure

```
EmployeeAdministratorApp/
├── Server/
│   └── EmployeeAdministrator/     # ASP.NET Core Web API
└── Client/
    └── employee-administrator/    # React + Vite Frontend
```

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Create, edit, delete, and manage user accounts
- **Project Management**: Create and manage projects
- **Task Management**: Create and manage tasks associated with projects
- **Admin Dashboard**: Administrative interface for managing users, projects, and tasks

## Prerequisites

### Option 1: Docker (Recommended)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (includes Docker Compose)
- No need to install .NET SDK, Node.js, or SQL Server separately

### Option 2: Local Development
#### Backend Requirements
- [.NET 9.0 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [SQL Server](https://www.microsoft.com/sql-server/sql-server-downloads) or [SQL Server LocalDB](https://learn.microsoft.com/en-us/sql/database-engine/configure-windows/sql-server-express-localdb)
- [Visual Studio](https://visualstudio.microsoft.com/) or [Visual Studio Code](https://code.visualstudio.com/) (optional)

#### Frontend Requirements
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Getting Started

### Docker Setup (Quick Start)

The easiest way to run the entire application is using Docker Compose. This will set up the database, backend API, and frontend automatically.

1. **Ensure Docker Desktop is running**

2. **Navigate to the project root:**
   ```bash
   cd EmployeeAdministratorApp
   ```

3. **Build and start all services:**
   ```bash
   docker-compose up --build
   ```
   
   Or run in detached mode (background):
   ```bash
   docker-compose up -d --build
   ```

4. **Wait for services to start:**
   - Database will initialize first
   - Backend API will start and apply migrations automatically
   - Frontend will be built and served

5. **Access the application:**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:8080
   - **Swagger UI**: http://localhost:8080
   - **SQL Server**: localhost:1433 (sa/YourStrong@Passw0rd)

6. **Stop the services:**
   ```bash
   docker-compose down
   ```
   
   To also remove volumes (database data):
   ```bash
   docker-compose down -v
   ```

#### Docker Commands

- **View logs:**
  ```bash
  docker-compose logs -f
  ```
  
- **View logs for specific service:**
  ```bash
  docker-compose logs -f api      # Backend logs
  docker-compose logs -f frontend # Frontend logs
  docker-compose logs -f db       # Database logs
  ```

- **Rebuild a specific service:**
  ```bash
  docker-compose up --build api
  ```

- **Execute commands in containers:**
  ```bash
  docker-compose exec api dotnet ef migrations add MigrationName
  docker-compose exec db /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P YourStrong@Passw0rd
  ```

#### Docker Configuration

The Docker setup includes:
- **SQL Server 2022**: Running in a container with persistent data
- **Backend API**: ASP.NET Core 9.0 application
- **Frontend**: React app served via Nginx

Environment variables can be customized in `docker-compose.yml`:
- Database password: `SA_PASSWORD`
- API port: `8080` (change if needed)
- Frontend port: `3000` (change if needed)
- JWT settings: Configured in the `api` service environment

> **Note**: For production deployments, update the database password and JWT secret key in `docker-compose.yml`.

### Local Development Setup

### Backend Setup

1. **Navigate to the Server directory:**
   ```bash
   cd Server/EmployeeAdministrator
   ```

2. **Restore NuGet packages:**
   ```bash
   dotnet restore
   ```

3. **Update the database connection string** (if needed):
   - Open `appsettings.json`
   - Update the `ConnectionStrings:DefaultConnection` if your SQL Server instance is different
   - Default connection string uses LocalDB: `Server=(localdb)\\MSSQLLocalDB;Database=EmployeeAdministrator;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True`

4. **Apply database migrations:**
   ```bash
   dotnet ef database update
   ```
   > **Note:** If you don't have Entity Framework tools installed globally, install them first:
   > ```bash
   > dotnet tool install --global dotnet-ef
   > ```

5. **Run the application:**
   ```bash
   dotnet run
   ```
   
   Or use the launch profiles:
   ```bash
   dotnet run --launch-profile https  # Runs on https://localhost:7126 and http://localhost:5078
   dotnet run --launch-profile http    # Runs on http://localhost:5078
   ```

6. **Access Swagger UI:**
   - Once the server is running, navigate to `http://localhost:5078` or `https://localhost:7126`
   - Swagger UI is available at the root URL (configured in `Program.cs`)

### Frontend Setup

1. **Navigate to the Client directory:**
   ```bash
   cd Client/employee-administrator
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure API endpoint** (if needed):
   - Update the API base URL in your frontend code if the backend is running on a different port
   - Default backend URL: `http://localhost:5078` or `https://localhost:7126`

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Access the application:**
   - The frontend will typically run on `http://localhost:5173` (Vite default port)
   - Check the terminal output for the exact URL

### Running Both Services

1. **Terminal 1 - Backend:**
   ```bash
   cd Server/EmployeeAdministrator
   dotnet run
   ```

2. **Terminal 2 - Frontend:**
   ```bash
   cd Client/employee-administrator
   npm run dev
   ```

## Configuration

### Backend Configuration

The backend configuration is stored in `appsettings.json`:

- **Connection String**: Database connection settings
- **JWT Settings**: Authentication token configuration
  - `Key`: Secret key for signing JWT tokens (change in production!)
  - `Issuer`: Token issuer name
  - `Audience`: Token audience name
  - `DurationInMinutes`: Token expiration time

### Frontend Configuration

The frontend uses Vite for development. Configuration can be found in:
- `vite.config.js`: Vite build configuration
- `package.json`: Dependencies and scripts

## Database

The application uses Entity Framework Core with SQL Server. The database is automatically created when you run migrations.

### Migrations

To create a new migration:
```bash
cd Server/EmployeeAdministrator
dotnet ef migrations add MigrationName
```

To apply migrations:
```bash
dotnet ef database update
```

## API Endpoints

The API includes the following modules:

- **Auth Module** (`/api/auth`): User authentication and management
- **Projects Module** (`/api/projects`): Project CRUD operations
- **Tasks Module** (`/api/tasks`): Task CRUD operations

Full API documentation is available via Swagger UI when the backend is running.

## Technologies Used

### Backend
- ASP.NET Core 9.0
- Entity Framework Core 9.0
- SQL Server
- JWT Bearer Authentication
- ASP.NET Core Identity
- Swagger/OpenAPI

### Frontend
- React 18
- Vite
- Redux Toolkit
- React Router DOM
- Axios
- Tailwind CSS

## Development

### Building for Production

**Backend:**
```bash
cd Server/EmployeeAdministrator
dotnet publish -c Release
```

**Frontend:**
```bash
cd Client/employee-administrator
npm run build
```

The production build will be in the `dist` folder.

## Troubleshooting

### Docker Issues

- **Port already in use**: If ports 3000, 8080, or 1433 are already in use, update them in `docker-compose.yml`
- **Database connection timeout**: Wait for the database health check to pass (takes ~30 seconds on first start)
- **Build failures**: Ensure Docker Desktop has enough resources allocated (Settings → Resources)
- **Permission errors (Linux/Mac)**: Ensure Docker has proper permissions or run with `sudo`
- **Windows WSL2**: If using WSL2, ensure Docker Desktop is configured to use WSL2 backend

### Backend Issues

- **Database connection errors**: 
  - Docker: Check that the `db` service is healthy: `docker-compose ps`
  - Local: Ensure SQL Server LocalDB is installed and running, or update the connection string in `appsettings.json`
- **Migration errors**: 
  - Docker: Migrations run automatically on startup
  - Local: Make sure you've run `dotnet ef database update` before starting the application
- **Port conflicts**: Change the port in `Properties/launchSettings.json` (local) or `docker-compose.yml` (Docker)

### Frontend Issues

- **API connection errors**: 
  - Docker: Ensure the API service is running and accessible at http://localhost:8080
  - Local: Verify the backend is running and check the API base URL in your frontend configuration
- **CORS errors**: The backend is configured to allow all origins in development. Ensure CORS is properly configured for production
- **Dependencies issues**: 
  - Docker: Rebuild the frontend: `docker-compose up --build frontend`
  - Local: Delete `node_modules` and `package-lock.json`, then run `npm install` again

## License

This project is for educational/demonstration purposes.

## Support

For issues or questions, please check the codebase or create an issue in the repository.


