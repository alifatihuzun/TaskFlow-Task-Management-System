# 🚀 TaskFlow - Corporate Task & Reminder Management System

TaskFlow is an enterprise-grade, secure, and highly scalable Task and Reminder Management System. Built with Clean Code principles and a modular architecture, it ensures complete data isolation and high performance for corporate environments.

## 🌟 Key Features

* **Secure Authentication:** JWT (JSON Web Token) based authentication and BCrypt password hashing.
* **Data Isolation:** Strict ownership checks. Users can only access, update, or delete their own tasks.
* **Role-Based Access:** Infrastructure ready for different corporate roles and departments.
* **Robust API Design:** Built with DTOs (Data Transfer Objects) to prevent over-posting and secure the internal domain models.
* **Automated Testing:** Comprehensive unit tests covering business logic and security edge-cases using xUnit and EF Core In-Memory databases.
* **Fail-Fast Error Handling:** Standardized API responses with correct HTTP status codes (200, 201, 204, 400, 401, 403, 404).

## 🛠️ Tech Stack

**Backend:**
* C# & .NET 8 Web API
* Entity Framework Core (Code-First)
* PostgreSQL
* xUnit (Unit Testing)
* JWT & BCrypt.Net

**Frontend (Work in Progress):**
* React.js (Vite)
* Axios (with Interceptors)
* Tailwind CSS / Material-UI

## 📂 Architecture & Folder Structure

The project follows a clean, modular structure, physically separating the source code from the test suite:

```text
📁 TaskFlow
├── 📁 src
│   ├── ⚙️ AuthService (JWT generation, Login)
│   ├── ⚙️ UserService (User registration, Profiles)
│   └── ⚙️ TaskService (Task CRUD, Business logic)
├── 📁 tests
│   ├── 🧪 AuthService.Tests
│   ├── 🧪 UserService.Tests
│   └── 🧪 TaskService.Tests
└── 📁 client (React Frontend)
🚀 Getting Started
Prerequisites
.NET 8 SDK

PostgreSQL

Node.js (For the frontend)

Installation & Setup
1. Clone the repository

Bash
git clone [https://github.com/alifatihuzun/TaskFlow.git](https://github.com/alifatihuzun/TaskFlow.git)
cd TaskFlow
2. Database Configuration
Update the appsettings.json file in your services with your PostgreSQL connection string:

JSON
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Database=TaskFlowDb;Username=postgres;Password=yourpassword"
}
3. Apply Migrations & Run Backend
Navigate to the service directory (e.g., TaskService) and run the application:

Bash
cd src/TaskService
dotnet ef database update
dotnet run
The API will be available at http://localhost:5000 (or the port specified in your launchSettings).

4. Run Tests
To ensure everything is working correctly, run the automated test suite:

Bash
dotnet test
📡 API Endpoints Overview
Auth: POST /api/auth/login, POST /api/auth/register

Tasks:

GET /api/task (Get all tasks for the logged-in user)

GET /api/task/{id} (Get task details)

POST /api/task (Create a new task)

PUT /api/task/{id} (Update an existing task)

DELETE /api/task/{id} (Delete a task)

🛡️ Security & Best Practices
Never Trust the Client: User IDs are never accepted from request bodies for sensitive operations; they are securely extracted from the JWT Claims.

Enum Parsing: External string inputs (e.g., priority levels) are safely parsed into internal Enums before database interaction.

DTO Mapping: Internal Domain Models are isolated from the presentation layer using custom Mapper functions.

📝 License
This project is licensed under the MIT License.

Developed by Ali Fatih Uzun
