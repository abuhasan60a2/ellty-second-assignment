# Calculation Tree - Frontend

A numerical discussion platform where users start discussions with numbers and others respond with mathematical operations, creating tree structures similar to Twitter/Reddit threads.

## Features

### For Anonymous Users
- ✅ View all root calculations (starting numbers)
- ✅ Navigate calculation trees using breadcrumb navigation
- ✅ See calculation details (author, timestamp, reply count)

### For Registered Users
- ✅ Everything anonymous users can do, PLUS:
- ✅ Register for an account
- ✅ Login/Logout
- ✅ Create new starting numbers
- ✅ Add mathematical operations to any calculation
- ✅ See their username on posts

## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS 4** - Styling
- **React Router v6** - Routing
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Lucide React** - Icons

## Project Structure

```
src/
├── api/                    # API client and endpoints
│   ├── client.js          # Axios instance with interceptors
│   ├── auth.js            # Auth API functions
│   └── calculations.js    # Calculation API functions
│
├── components/
│   ├── auth/              # Authentication components
│   ├── calculations/      # Calculation-related components
│   ├── common/            # Reusable UI components
│   └── layout/            # Layout components (Header, Footer)
│
├── contexts/
│   └── AuthContext.jsx    # Auth state management
│
├── hooks/
│   └── useAuth.js         # Custom hook for auth context
│
├── pages/                 # Page components
│   ├── HomePage.jsx       # List of root calculations
│   ├── TreeViewPage.jsx   # Individual calculation tree view
│   ├── LoginPage.jsx      # Login page
│   ├── RegisterPage.jsx   # Registration page
│   └── NotFoundPage.jsx   # 404 page
│
├── utils/
│   ├── formatters.js      # Formatting utilities
│   └── validators.js      # Zod validation schemas
│
├── App.jsx                # Main app with routes
├── main.jsx               # Entry point
└── index.css              # Global styles
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on `http://localhost:3001/api`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update `.env` if your backend runs on a different URL:
```
VITE_API_BASE_URL=http://localhost:3001/api
```

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Key UX Pattern: Progressive Disclosure

The app uses **progressive disclosure** to show calculation trees:

- Only the **current calculation** and its **direct children** are displayed
- Use **breadcrumb navigation** to navigate up the tree
- Click **"View Replies"** on a child to navigate down
- Similar to Reddit's "Continue this thread →" pattern

**Example Flow:**
1. View root calculation (42) with 2 direct children
2. Click "View Replies" on a child
3. See that child as the current calculation with its own children
4. Use breadcrumbs to navigate back up

## API Integration

The app connects to the backend API with the following endpoints:

### Public Endpoints
- `GET /calculations` - List root calculations
- `GET /calculations/:id/children` - Get calculation with children and breadcrumb

### Protected Endpoints (Require Authentication)
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /calculations` - Create starting number
- `POST /calculations/:id/respond` - Add operation to calculation

### Authentication

- JWT tokens stored in `localStorage`
- Automatically added to requests via Axios interceptor
- Auto-redirect to login on 401 errors

## Form Validation

All forms use **React Hook Form** with **Zod** validation:

### Registration
- Username: 3-20 chars, alphanumeric + underscore
- Email: Valid email format
- Password: Minimum 6 characters

### Starting Number
- Must be a finite number
- Absolute value < 1e15

### Add Operation
- Operation: add, subtract, multiply, divide
- Operand: Finite number
- No division by zero

## Styling

- **Tailwind CSS 4** with custom component classes
- Responsive design (mobile-first)
- Custom classes in `index.css`:
  - `.btn`, `.btn-primary`, `.btn-secondary`
  - `.input`
  - `.card`
  - `.modal-overlay`, `.modal-content`

## Error Handling

- API errors displayed with dismissible alerts
- Form validation errors shown below fields
- Network errors with retry option
- 401 errors auto-redirect to login
- 404 page for invalid routes

## License

MIT
