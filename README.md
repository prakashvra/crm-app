# CRM Application

A modern Customer Relationship Management (CRM) application built with Node.js, Express, React, and TypeScript.

## Features

- **User Authentication**: JWT-based authentication with role-based access control
- **Contact Management**: Comprehensive contact management with relationships
- **Organization Management**: Company and organization tracking
- **Deal Pipeline**: Sales opportunity tracking with pipeline stages
- **Task Management**: Activity and task management system
- **Dashboard**: Real-time statistics and insights
- **Modern UI**: Beautiful, responsive interface built with Tailwind CSS

## Tech Stack

### Backend
- **Node.js** with **Express.js**
- **MySQL** database with **Sequelize ORM**
- **JWT** authentication
- **bcryptjs** for password hashing
- Input validation with **express-validator**

### Frontend
- **React 18** with **TypeScript**
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Query** for data fetching and caching
- **React Hook Form** for form management
- **React Router** for navigation
- **Heroicons** for icons

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MySQL database
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd crm-app/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=crm_database
DB_USER=root
DB_PASSWORD=your_password
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

5. Create the database:
```sql
CREATE DATABASE crm_database;
```

6. Start the backend server:
```bash
npm run dev
```

The backend will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd crm-app/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Contacts
- `GET /api/contacts` - Get all contacts (with pagination and filtering)
- `GET /api/contacts/:id` - Get single contact
- `POST /api/contacts` - Create new contact
- `PUT /api/contacts/:id` - Update contact
- `DELETE /api/contacts/:id` - Delete contact

### Organizations
- `GET /api/organizations` - Get all organizations
- `GET /api/organizations/:id` - Get single organization
- `POST /api/organizations` - Create new organization
- `PUT /api/organizations/:id` - Update organization
- `DELETE /api/organizations/:id` - Delete organization

### Deals
- `GET /api/deals` - Get all deals
- `GET /api/deals/pipeline` - Get pipeline summary
- `GET /api/deals/:id` - Get single deal
- `POST /api/deals` - Create new deal
- `PUT /api/deals/:id` - Update deal
- `DELETE /api/deals/:id` - Delete deal

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/dashboard` - Get task dashboard summary
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## Database Schema

The application uses the following main entities:

- **Users**: System users with role-based permissions
- **Contacts**: Individual contacts with personal and professional information
- **Organizations**: Companies and organizations
- **Deals**: Sales opportunities with pipeline stages
- **Tasks**: Activities and tasks with due dates and priorities

All entities have proper relationships and foreign key constraints.

## Development

### Backend Development
```bash
cd backend
npm run dev  # Starts with nodemon for auto-reload
```

### Frontend Development
```bash
cd frontend
npm run dev  # Starts Vite dev server
```

### Building for Production

Backend:
```bash
cd backend
npm start
```

Frontend:
```bash
cd frontend
npm run build
npm run preview
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
