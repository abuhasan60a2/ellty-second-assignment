# Calculation Tree Backend API

A production-ready REST API for a calculation tree system where users can start numerical discussions and others can respond with mathematical operations, creating a tree structure similar to Twitter/Reddit comment threads.

## Features

- 🔐 **Authentication**: JWT-based authentication with bcrypt password hashing
- 🌲 **Tree Structure**: Nested calculation threads with parent-child relationships
- 📊 **Progressive Loading**: Load only immediate children, not entire tree
- ✅ **Validation**: Request validation using Zod schemas
- 🚀 **TypeScript**: Full type safety with strict TypeScript
- 🐳 **Docker**: Multi-stage optimized Dockerfile for production
- 📝 **Error Handling**: Comprehensive error handling with custom error classes

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB Atlas (Mongoose ODM)
- **Authentication**: JWT with bcrypt
- **Validation**: Zod schemas
- **Port**: 3001
- **CORS**: Enabled for http://localhost:5173

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts          # MongoDB connection
│   │   └── env.ts               # Environment variables
│   ├── models/
│   │   ├── User.model.ts        # User schema
│   │   └── Calculation.model.ts # Calculation schema
│   ├── middleware/
│   │   ├── auth.middleware.ts   # JWT verification
│   │   ├── validate.middleware.ts # Request validation
│   │   └── error.middleware.ts  # Error handler
│   ├── controllers/
│   │   ├── auth.controller.ts   # Auth request handlers
│   │   └── calculations.controller.ts # Calculation handlers
│   ├── services/
│   │   ├── auth.service.ts      # Auth business logic
│   │   └── calculations.service.ts # Calculation logic
│   ├── routes/
│   │   ├── auth.routes.ts       # Auth endpoints
│   │   └── calculations.routes.ts # Calculation endpoints
│   ├── utils/
│   │   ├── calculator.ts        # Math operations
│   │   ├── jwt.ts               # JWT helpers
│   │   └── errors.ts            # Custom error classes
│   ├── types/
│   │   └── index.ts             # TypeScript types
│   ├── app.ts                   # Express app setup
│   └── server.ts                # Server entry point
├── tests/
│   ├── auth.test.ts
│   └── calculations.test.ts
├── .env                         # Environment variables
├── .env.example                 # Environment template
├── .gitignore
├── package.json
├── tsconfig.json
├── Dockerfile
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v20 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Installation

1. **Clone the repository**

```bash
cd backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the `.env` file with your MongoDB URI and JWT secret:

```env
PORT=3001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
NODE_ENV=development
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

**Important**: If your MongoDB password contains special characters, make sure to URL-encode them:
- `@` → `%40`
- `#` → `%23`
- `%` → `%25`
- etc.

4. **Run in development mode**

```bash
npm run dev
```

5. **Build for production**

```bash
npm run build
npm start
```

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "username": "john_doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Calculation Endpoints

#### Get All Root Calculations (Public)
```http
GET /api/calculations?limit=50&skip=0
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "calculations": [...],
    "total": 100,
    "limit": 50,
    "skip": 0
  }
}
```

#### Get Calculation with Children (Public)
```http
GET /api/calculations/:id/children?limit=50
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "calculation": {...},
    "children": [...],
    "breadcrumb": [...]
  }
}
```

#### Create Starting Number (Protected)
```http
POST /api/calculations
Authorization: Bearer <token>
Content-Type: application/json

{
  "value": 42
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "calculation": {
      "_id": "...",
      "value": 42,
      "operation": "start",
      "depth": 0,
      ...
    }
  }
}
```

#### Add Operation to Calculation (Protected)
```http
POST /api/calculations/:id/respond
Authorization: Bearer <token>
Content-Type: application/json

{
  "operation": "add",
  "operand": 10
}
```

**Operations**: `add`, `subtract`, `multiply`, `divide`

**Response (201):**
```json
{
  "success": true,
  "data": {
    "calculation": {
      "_id": "...",
      "value": 52,
      "operation": "add",
      "operand": 10,
      "parentId": "...",
      "depth": 1,
      ...
    }
  }
}
```

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "message": "Error message",
    "details": [...] // Optional validation details
  }
}
```

**Status Codes:**
- `200` - OK
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized
- `404` - Not Found
- `409` - Conflict (e.g., username exists)
- `500` - Internal Server Error

## Docker Deployment

Build and run with Docker:

```bash
# Build image
docker build -t calculation-tree-backend .

# Run container
docker run -p 3001:3001 \
  -e MONGODB_URI="your-mongodb-uri" \
  -e JWT_SECRET="your-secret-key" \
  calculation-tree-backend
```

## Scripts

- `npm run dev` - Start development server with auto-reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run production build
- `npm test` - Run tests (not yet implemented)

## Database Schema

### Users Collection
```typescript
{
  _id: ObjectId,
  username: string,      // Unique, 3-20 chars
  email: string,         // Unique, valid email
  password: string,      // bcrypt hash
  createdAt: Date
}
```

### Calculations Collection
```typescript
{
  _id: ObjectId,
  authorId: ObjectId,
  authorUsername: string,
  value: number,
  operation: 'start' | 'add' | 'subtract' | 'multiply' | 'divide',
  operand: number | null,
  parentId: ObjectId | null,
  rootId: ObjectId,
  depth: number,
  childCount: number,
  createdAt: Date
}
```

## Development Guidelines

- All async functions use try-catch for error handling
- Zod schemas validate all request inputs
- Passwords are hashed with bcrypt (10 rounds)
- JWT tokens expire in 7 days
- Maximum calculation depth is 100 levels
- Progressive disclosure: load only immediate children

## License

ISC

