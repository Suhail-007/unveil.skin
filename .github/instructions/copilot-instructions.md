# Copilot Instructions for unveil.skin

Next.js 16 e-commerce app with **Sequelize ORM**, Supabase Auth, Redux, and guest cart support.

## Database (Sequelize)

- Models: `src/lib/models/` - all models (User, Product, CartItem, Order, OrderItem)
- Connection: `import { sequelize } from '@/lib/sequelize'`
- Import models: `import { User } from '@/lib/models/User'`, `import { Product } from '@/lib/models/Product'`, etc.

### Sequelize Query Patterns
```typescript
// Find with relations
const cartItems = await CartItem.findAll({
  where: { userId },
  include: [Product],
});

// Find one
const user = await User.findByPk(userId);
const cartItem = await CartItem.findOne({ where: { id, userId } });

// Create
await CartItem.create({ userId, productId, quantity });

// Update
cartItem.quantity = newQuantity;
await cartItem.save();

// Delete
await cartItem.destroy();

// Transaction for atomicity
await sequelize.transaction(async (t) => {
  await CartItem.create({ ... }, { transaction: t });
  await CartItem.update({ ... }, { transaction: t });
});
```

## Hybrid Cart Persistence
- **Guest users**: Redux → `localStorage` (key: `guestCart`). No database writes.
- **Authenticated users**: Redux → PostgreSQL via API routes.
- **Critical flow**: Login triggers auto-merge via `POST /api/cart/sync` using Sequelize transactions.

## Authentication Architecture (Middleware-based)
- **Session verification**: Centralized in [src/middleware.ts](src/middleware.ts) - verifies once per request and attaches headers.
- **Session helpers**: [src/lib/auth/session.ts](src/lib/auth/session.ts) provides `getSessionFromHeaders()` and `requireAuth()`.
- **API routes**: Never create Supabase clients for session checks - use helpers that read middleware headers.
- **Auth mutations**: Only login/signup/logout routes use Supabase client directly (they modify auth state).
- **Server components**: `await createClient()` from `@/lib/supabase/server` (async cookie API).
- **Client components**: `createClient()` from `@/lib/supabase/client` (sync browser client).
- Auth initialization: [Header.tsx](src/components/Header.tsx) `useEffect` calls `GET /api/auth/session`.

### Session Helper Usage
```typescript
// For optional auth (e.g., guest cart support)
import { getSessionFromHeaders } from '@/lib/auth/session';
const session = await getSessionFromHeaders();
if (session.isAuthenticated && session.userId) { /* auth logic */ }

// For required auth (throws 401 if not authenticated)
import { requireAuth } from '@/lib/auth/session';
const { userId, email } = await requireAuth();
```

## API Route Structure
See [src/app/api/cart/add/route.ts](src/app/api/cart/add/route.ts) for canonical pattern:
1. Extract body → 2. Get session from headers via helper → 3. If authenticated: Sequelize DB ops, else: return product data → 4. Client handles Redux + localStorage.

## Service Layer Pattern
All API calls go through service files in `src/lib/services/`. Each service has:
- **Route constants** at the top (e.g., `AUTH_ROUTES`, `CART_ROUTES`) - never hardcode URLs in components
- **Typed request/response interfaces**
- **Async functions** that handle fetch, error throwing, and response parsing

Services:
- [auth.service.ts](src/lib/services/auth.service.ts): `login()`, `signup()`, `logout()`, `getSession()`
- [cart.service.ts](src/lib/services/cart.service.ts): `getCart()`, `addToCart()`, `updateCartItem()`, `removeCartItem()`, `syncGuestCart()`
- [waitlist.service.ts](src/lib/services/waitlist.service.ts): `joinWaitlist()`

Example usage in components:
```tsx
import { login } from "@/lib/services/auth.service";
import { getCart, syncGuestCart } from "@/lib/services/cart.service";

const data = await login({ email, password });
const cartData = await getCart();
```

## Redux Conventions
- Cart slice ([src/lib/redux/slices/cartSlice.ts](src/lib/redux/slices/cartSlice.ts)): `total` and `itemCount` are **derived state** - always recalculate in reducers, never set manually.
- Store ([src/lib/redux/store.ts](src/lib/redux/store.ts)) disables serialization checks for Supabase `user`/`session` objects (non-serializable by design).
- All client components use `useAppDispatch` and `useAppSelector` from `@/lib/redux/hooks`.

## Dev Workflows
```bash
npm run dev              # Dev server (localhost:3000)
npm run build            # Production build
```

**Env vars** (`.env.local`): `DATABASE_URL` (PostgreSQL), `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.

## Code Patterns
- Path aliases: Always `@/` imports.
- Chakra UI v3: Color mode via `useColorModeValue` from `@/components/ui/color-mode`.
- All interactive components: `"use client"` directive (Redux requires client-side).
- Font: Montserrat ([src/app/layout.tsx](src/app/layout.tsx)).

## Loading States & Skeleton UI
**Always use Skeleton loading for server-fetched data**:
- When fetching data from APIs, show Chakra UI `<Skeleton>` components for the specific data being loaded
- If entire page content comes from API, show skeleton loading for all dynamic sections
- Static elements (headers, labels, buttons) should render immediately - only wrap dynamic data
- Pattern:
  ```tsx
  import { Skeleton } from "@chakra-ui/react";
  
  {loading ? (
    <Skeleton height="20px" width="200px" />
  ) : (
    <Text>{data}</Text>
  )}
  ```
- For lists: Map skeleton items matching the expected structure
- Never show generic "Loading..." text for data fetches - use visual skeleton placeholders

## Key Files
- Sequelize models: [src/lib/models/](src/lib/models/)
- Sequelize connection: [src/lib/sequelize.ts](src/lib/sequelize.ts)
- **Service layer**: [src/lib/services/](src/lib/services/) - all API calls with route constants
- **Session helpers**: [src/lib/auth/session.ts](src/lib/auth/session.ts) - `getSessionFromHeaders()`, `requireAuth()`
- Guest → auth cart merge: [src/app/api/cart/sync/route.ts](src/app/api/cart/sync/route.ts)
- Session middleware: [src/middleware.ts](src/middleware.ts) - verifies session and attaches headers
