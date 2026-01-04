# Authentication & Cart Management Implementation

This document describes the authentication and cart management system implementation for unveil.skin.

## Features Implemented

### Authentication System
- ✅ Supabase Auth integration with email/password
- ✅ Login and Signup pages with forms
- ✅ Guest login support - users can browse without authentication
- ✅ Session management with automatic persistence
- ✅ Auth middleware for protected routes
- ✅ First-visit welcome modal with login/signup or guest option

### Cart System
- ✅ Redux Toolkit state management
- ✅ Cart operations: add, remove, update quantity, calculate totals
- ✅ LocalStorage persistence for guest users
- ✅ Database sync for authenticated users via Sequelize
- ✅ Cart icon with item count badge in header
- ✅ Cart drawer component showing all items
- ✅ Full cart page with checkout functionality
- ✅ Automatic cart merge when guest logs in

### Database
- ✅ Sequelize models for Product, CartItem, and Order
- ✅ Updated Prisma schema with cart and order tables
- ✅ Supabase PostgreSQL integration

### API Routes
- ✅ `/api/auth/signup` - User registration
- ✅ `/api/auth/login` - User login
- ✅ `/api/auth/logout` - User logout  
- ✅ `/api/auth/session` - Get current session
- ✅ `/api/cart/add` - Add item to cart
- ✅ `/api/cart/update` - Update cart item quantity
- ✅ `/api/cart/remove` - Remove cart item
- ✅ `/api/cart/sync` - Sync guest cart with user cart after login
- ✅ `/api/cart/get` - Get user's cart

## Environment Variables

Copy `.env.example` to `.env.local` and configure the following variables:

### Required Variables

```env
# Database URL (from Supabase or your PostgreSQL instance)
DB_UNVEIL_DATABASE_URL="postgresql://user:password@host:port/database"

# Supabase Configuration
# Get these from your Supabase project settings
NEXT_PUBLIC_SUPABASE_URL="your_supabase_project_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"
SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role_key"

# App Configuration
NEXT_PUBLIC_SITE_URL="http://localhost:3000"  # Change to production URL when deploying
```

### Optional Variables

```env
# SEO Verification (Optional)
GOOGLE_SITE_VERIFICATION=""
YANDEX_VERIFICATION=""
```

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file with the required environment variables listed above.

### 3. Set Up Supabase

1. Create a Supabase project at https://supabase.com
2. Go to Project Settings > API to find your project URL and keys
3. The database URL is in Project Settings > Database > Connection String (use the "Node.js" version)
4. Enable Email/Password authentication in Authentication > Providers

### 4. Run Database Migrations

```bash
npx prisma generate
npx prisma db push
```

### 5. Start Development Server

```bash
npm run dev
```

## Usage Guide

### User Authentication Flow

1. **First Visit**: Users see a welcome modal prompting them to log in, sign up, or continue as guest
2. **Guest Mode**: Users can browse and add items to cart without authentication (stored in localStorage)
3. **Login Required**: When proceeding to checkout, guests are prompted to log in or sign up
4. **Cart Merge**: After login, guest cart items are automatically merged with the user's saved cart

### Cart Management

#### For Guest Users
- Items are stored in browser's localStorage
- Cart persists across page refreshes
- Cart is merged with user cart upon authentication

#### For Authenticated Users
- Items are stored in the database via Sequelize
- Cart syncs across devices
- Cart persists permanently

### Component Usage

#### Header Component
```tsx
import Header from "@/components/Header";

// Includes logo, cart icon with badge, and handles auth state
<Header />
```

#### Auth Modal
```tsx
import AuthModal from "@/components/auth/AuthModal";

<AuthModal 
  open={isOpen} 
  onClose={handleClose}
  allowGuest={true} // Show "Continue as Guest" option
/>
```

#### Cart Drawer
```tsx
import CartDrawer from "@/components/cart/CartDrawer";

<CartDrawer 
  open={isOpen}
  onClose={handleClose}
  onCheckout={handleCheckout}
/>
```

#### Checkout Button
```tsx
import CheckoutButton from "@/components/cart/CheckoutButton";

// Automatically shows auth modal if user is guest
<CheckoutButton onCheckout={handleProceedToPayment} />
```

## Technical Details

### State Management
- Redux Toolkit for global state (auth & cart)
- Typed hooks for type-safe Redux usage
- Middleware configured to handle Supabase session objects

### Database Architecture
- **Sequelize**: Used for cart and order operations with Supabase PostgreSQL
- **Prisma**: Used for schema management and migrations
- Both work together seamlessly with the same database

### Security
- Supabase handles password hashing and session management
- Auth middleware refreshes sessions automatically
- Protected API routes verify authentication

## File Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/          # Auth API routes
│   │   └── cart/          # Cart API routes
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   └── cart/              # Cart page
├── components/
│   ├── auth/              # Auth components
│   ├── cart/              # Cart components
│   └── Header.tsx         # Main header with cart icon
├── lib/
│   ├── redux/             # Redux store and slices
│   ├── supabase/          # Supabase client setup
│   └── sequelize/         # Sequelize models and config
└── middleware.ts          # Auth middleware

prisma/
└── schema.prisma          # Database schema
```

## Testing Checklist

- ✅ User can signup with email/password
- ✅ User can login with valid credentials
- ✅ Guest user can browse without authentication
- ✅ Cart items persist in localStorage for guests
- ✅ Cart syncs to database for authenticated users
- ✅ Welcome modal appears on first landing
- ✅ Checkout triggers auth check for guests
- ✅ Guest cart merges after login
- ✅ Cart totals calculate correctly
- ✅ Session persists on page refresh

## Troubleshooting

### Database Connection Issues
- Verify your `DB_UNVEIL_DATABASE_URL` is correct
- Check that Supabase project is active
- Ensure database allows connections from your IP

### Authentication Issues
- Verify Supabase keys are correct
- Check that Email/Password provider is enabled in Supabase
- Clear browser cookies and localStorage if session is stuck

### Cart Not Persisting
- For guests: Check browser localStorage is enabled
- For authenticated users: Verify database connection and Sequelize models

## Next Steps

To complete the implementation, you may want to:

1. Set up Sequelize migrations for version control
2. Add product seeding scripts
3. Implement checkout/payment flow
4. Add email verification for signups
5. Implement password reset functionality
6. Add user profile management
7. Implement order history
8. Add loading states and error boundaries
9. Write unit and integration tests
10. Add analytics tracking

## Dependencies

Key packages added:
- `@supabase/supabase-js` - Supabase client
- `@supabase/ssr` - Server-side rendering support
- `@reduxjs/toolkit` - Redux state management
- `react-redux` - React bindings for Redux
- `sequelize` - SQL ORM
- `pg` - PostgreSQL driver

See `package.json` for complete list with versions.
