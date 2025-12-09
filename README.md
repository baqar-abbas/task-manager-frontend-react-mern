# Task Manager Frontend

A modern, feature-rich task management application built with React, TypeScript, and Redux. This project provides a responsive user interface for managing tasks with real-time synchronization, advanced filtering, and seamless state management.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Available Scripts](#available-scripts)
- [Architecture](#architecture)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Environment Variables](#environment-variables)
- [Development Guidelines](#development-guidelines)
- [Build & Deployment](#build--deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

Task Manager is a comprehensive task management system that enables users to create, read, update, and delete tasks with advanced features like real-time updates, task filtering, pagination, and user authentication. The application is built with modern web technologies and follows industry best practices.

**Current Version:** 0.0.0 (Development)  
**Status:** Active Development  
**Live Demo:** [Coming Soon]

## ✨ Features

### Authentication & User Management

- ✅ User login with email and password
- ✅ User registration with validation
- ✅ JWT-based authentication
- ✅ Session persistence with localStorage
- ✅ Secure logout functionality
- ✅ User profile management

### Task Management

- ✅ **CRUD Operations** - Create, read, update, and delete tasks
- ✅ **Task Filtering** - Filter by status, priority, and custom search
- ✅ **Pagination** - Efficient task list pagination
- ✅ **Task Status** - Manage task lifecycle (pending, in-progress, completed, archived)
- ✅ **Priority Levels** - High, medium, low, and urgent priorities
- ✅ **Due Dates** - Task deadline management
- ✅ **Time Tracking** - Estimated and actual time spent
- ✅ **Tags** - Organize tasks with custom tags
- ✅ **Public/Private** - Control task visibility
- ✅ **Task Statistics** - View task distribution and completion metrics

### User Interface

- ✅ **Responsive Design** - Mobile, tablet, and desktop support
- ✅ **Modal Dialogs** - Task creation and editing
- ✅ **Loading States** - Visual feedback during async operations
- ✅ **Error Handling** - User-friendly error messages
- ✅ **Real-time Updates** - Socket.io integration for live updates
- ✅ **Dark Mode Support** - [Coming Soon]

## 📸 Screenshots

### Login Page

Sign in to your account with email and password. Includes "Remember me" functionality and password recovery options.

![Login Page](./public/screenshots/login.png)

### Registration Page

Create a new account with username, email, and password validation.

![Registration Page](./public/screenshots/signup.png)

### Dashboard

Welcome screen displaying task statistics, recent tasks, and task distribution analytics.

![Dashboard](./public/screenshots/dashboard.png)

### Task Management

Advanced task management interface with filtering, searching, sorting, and pagination capabilities.

![Task Management](./public/screenshots/tasks.png)

### Create Task Modal

User-friendly modal for creating new tasks with all necessary fields including title, description, status, priority, due date, estimated time, and tags.

![Create Task Modal](./public/screenshots/create-task.png)

## 🛠 Tech Stack

### Core Framework

- **React** (^19.2.0) - UI library
- **TypeScript** (^5.9.3) - Static typing
- **Vite** (^7.2.4) - Build tool and dev server

### State Management & Data Fetching

- **Redux Toolkit** (^2.11.1) - State management
- **React Redux** (^9.2.0) - React bindings for Redux
- **RTK Query** - Data fetching and caching

### Routing & Navigation

- **React Router DOM** (^7.10.1) - Client-side routing

### Styling & UI

- **Tailwind CSS** (^3.4.18) - Utility-first CSS framework
- **React Icons** (^5.5.0) - Icon library
- **PostCSS** (^8.5.6) - CSS transformation
- **Autoprefixer** (^10.4.22) - CSS vendor prefixes

### HTTP Client

- **Axios** (^1.13.2) - HTTP client library

### Real-time Communication

- **Socket.io Client** (^4.8.1) - WebSocket communication

### Development Tools

- **ESLint** (^9.39.1) - Code linting
- **TypeScript ESLint** (^8.46.4) - TypeScript linting
- **Vite** (^7.2.4) - Development server with HMR

## 📁 Project Structure

```
task-manager-frontend
├── public
│   ├── screenshots
│   │   ├── create-task.png
│   │   ├── dashboard.png
│   │   ├── login.png
│   │   └── signup.png
│   ├── favicon.ico
│   └── index.html
├── src
│   ├── app
│   │   ├── store.ts
│   │   └── hooks.ts
│   ├── assets
│   │   └── images
│   ├── components
│   │   ├── common
│   │   ├── layout
│   │   └── tasks
│   ├── features
│   │   ├── auth
│   │   ├── tasks
│   │   └── users
│   ├── hooks
│   ├── layouts
│   ├── middleware
│   ├── pages
│   │   ├── Auth
│   │   ├── Dashboard
│   │   └── NotFound
│   ├── router
│   ├── services
│   ├── styles
│   ├── utils
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── .env
├── .gitignore
├── index.html
├── package.json
├── README.md
└── tsconfig.json
```

## 🚀 Getting Started

To get started with the project, follow these steps:

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/task-manager-frontend.git
   cd task-manager-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**

   Navigate to `http://localhost:5173` to see the app in action.

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root of the project and add the following variables:

```
VITE_API_URL=https://api.yourservice.com
VITE_SOCKET_URL=https://socket.yourservice.com
```

### TypeScript

This project is configured with TypeScript for static type checking. To customize the TypeScript configuration, modify the `tsconfig.json` file.

### ESLint

ESLint is used for code linting and quality assurance. To customize the ESLint configuration, modify the `.eslintrc.js` file.

## 📜 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the app for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint to check for code issues
- `npm run format` - Format code with Prettier

## 🏗 Architecture

The application follows a modular architecture with a clear separation of concerns. Key modules include:

- **Auth** - Authentication and user management
- **Tasks** - Task creation, management, and filtering
- **Users** - User profile and settings

## 📦 State Management

State management is handled by Redux Toolkit, with a global store configured in `src/app/store.ts`. Features include:

- Centralized state management
- Time-travel debugging
- Easy integration with React components

## 🌐 API Integration

The application integrates with a RESTful API for data storage and retrieval. Key API endpoints include:

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/tasks` - Fetch tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## 🔧 Development Guidelines

- Follow the established folder structure
- Keep components small and focused
- Use hooks for stateful logic
- Write unit tests for critical functions
- Update documentation for new features

## 📦 Build & Deployment

To build the app for production, run:

```bash
npm run build
```

The built files will be output to the `dist` directory. To deploy the app, upload the contents of the `dist` directory to your web server.

## 🐛 Troubleshooting

- **Issue:** Development server fails to start

  - **Solution:** Ensure all dependencies are installed and check for error messages in the terminal.

- **Issue:** API requests fail with CORS error
  - **Solution:** Ensure the API URL is correct and the API server has CORS enabled.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/YourFeature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some feature'`)
5. Push to the branch (`git push origin feature/YourFeature`)
6. Open a pull request

Please ensure your code follows the project's coding standards and includes appropriate tests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Note:** This template is a starting point for building a task manager frontend application. It includes essential features and best practices but may require additional customization to meet specific requirements as the project evolve.
