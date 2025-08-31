# Product Management System

A full-stack Product Management System built with **ASP.NET Core Web API**, **Entity Framework Core**, and **React**. This project is designed to demonstrate modern web development practices, including authentication, authorization, and CRUD operations with a structured learning approach.

---

## Table of Contents

- [Project Structure](#project-structure)  
- [Technologies Used](#technologies-used)  
- [Setup Instructions](#setup-instructions)  
- [Features Implemented](#features-implemented)  
- [Learning Journey Highlights](#learning-journey-highlights)  
- [Next Steps](#next-steps)

---

## Project Structure

```
product-management-app
│
└── src
    ├── ProductManagement.API      # Backend API
    │   ├── Controllers            # API controllers
    │   ├── Data                   # EF Core DbContext & migrations
    │   └── Models                 # Product, Category, User models
    │
    └── ProductManagement.UI       # Frontend React application
        ├── components             # Reusable UI components (ProductForm, LoginForm)
        ├── pages                  # Pages (ProductsPage, LoginPage)
        ├── api                    # API calls & DTOs
        └── hooks                  # Custom hooks (useAuth, useDropdown)
```

---

## Technologies Used

- **Backend**  
  - ASP.NET Core Web API  
  - Entity Framework Core  
  - SQL Server (Dockerized)  
  - JWT Authentication & Role-Based Authorization  

- **Frontend**  
  - React (Vite + TypeScript)  
  - React Router DOM  
  - Axios for API calls  

- **Dev Tools**  
  - Docker  
  - Visual Studio Code  
  - Postman / SSMS for testing  

---

## Setup Instructions

### Backend

1. Ensure Docker is running.  
2. Start SQL Server container:  
   ```bash
   docker-compose up -d
   ```  
3. Run migrations and seed database if necessary.  
4. Launch API:  
   ```bash
   dotnet run --project src/ProductManagement.API
   ```  

### Frontend

1. Navigate to frontend folder:  
   ```bash
   cd src/ProductManagement.UI
   ```  
2. Install dependencies:  
   ```bash
   npm install
   ```  
3. Run frontend:  
   ```bash
   npm run dev
   ```  
4. Access the app at `http://localhost:5173`.  

---

## Features Implemented

### Backend

- Product CRUD (Create, Read, Update, Delete)  
- Category management (basic fetching implemented)  
- User authentication (JWT-based)  
- Role-based authorization (Admin-only actions)  

### Frontend

- React pages for login and product management  
- ProductForm component with dynamic dropdown for categories  
- CRUD operations integrated with backend APIs  
- Authentication and token storage  

---

## Learning Journey Highlights

- Day 1–8: Backend development  
  - Defined `Product`, `Category`, `User` models  
  - Configured EF Core `DbContext`  
  - Implemented API controllers with proper authorization  
- Day 9–15: API & frontend integration  
  - Set up React + TypeScript frontend  
  - Implemented `ProductsPage` with CRUD operations  
  - Dynamic dropdowns using reusable hooks  
  - Authentication with JWT token storage  
- Key learnings:  
  - Dockerizing SQL Server and connecting from frontend & backend  
  - Type-safe API integration with TypeScript  
  - Role-based authorization in ASP.NET Core  
  - Handling async operations & state management in React  

---

## Next Steps

- Complete **Category CRUD page**  
- Add **user management** page  
- Enhance UI with styling and validations  
- Implement **search, filter, and pagination** for products  
- Explore **unit testing** for backend and frontend  

---

## Roadmap Timeline (Visual)

| Day | Tasks Completed |
|-----|----------------|
| 1–2 | Project setup, Models creation |
| 3–4 | EF Core & DbContext setup, initial migrations |
| 5–6 | Products API CRUD implementation |
| 7   | User authentication setup |
| 8   | Role-based authorization and policies |
| 9–10 | React frontend setup & routing |
| 11–12 | ProductsPage, ProductForm, API integration |
| 13–15 | Authentication in frontend, token management, protected routes |

This roadmap visually summarizes the milestones of the 30-day journey.

