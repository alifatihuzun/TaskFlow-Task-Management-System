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
