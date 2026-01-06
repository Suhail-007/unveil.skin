# Copilot Instructions for unveil.skin

Next.js 16 e-commerce app with **Sequelize ORM**, Supabase Auth, Redux, and guest cart support.

## Architecture Principles

### Server Components First (Performance & UX)
- **Default to Server Components**: All components should be server components unless they require client-side interactivity
- **Doughnut Pattern**: Extract minimal client-only logic into small, focused client components
- **Example**: Product page is server component, only "Add to Cart" button is client
- **Use Suspense**: Wrap async data fetching with `<Suspense>` and provide skeleton fallbacks
- **Caching Strategy**: 
  - Use Next.js cache: `fetch(url, { next: { revalidate: 3600 } })`
  - Server components automatically cached
  - Use `unstable_cache` for database queries when needed
- **Streaming**: Use `loading.tsx` files for route-level loading states

### Client Component Guidelines
- **Mark explicitly**: Use `"use client"` directive only when needed:
  - Event handlers (onClick, onChange, etc.)
  - React hooks (useState, useEffect, useContext, etc.)
  - Browser APIs (localStorage, window, document)
  - Third-party libraries that require client (framer-motion, chart libraries, etc.)
- **Keep minimal**: Extract only interactive parts to client components
- **Lazy load**: Use `next/dynamic` with `ssr: false` for heavy client components
- **Example Pattern**:
  ```tsx
  // page.tsx (Server Component)
  export default function ProductPage() {
    const product = await fetchProduct(); // Server-side data fetch
    return <ProductView product={product} />;
  }
  
  // ProductView.tsx (Server Component)
  export default function ProductView({ product }) {
    return (
      <div>
        <ProductDetails product={product} />
        <AddToCartButton productId={product.id} /> {/* Client Component */}
      </div>
    );
  }
  
  // AddToCartButton.tsx (Client Component)
  "use client";
  export default function AddToCartButton({ productId }) {
    const [count, setCount] = useState(0);
    // ... interactive logic
  }
  ```

## Database (Sequelize)

- Models: `src/lib/models/` - all models (Product, CartItem, Order, OrderItem)
- Connection: `import sequelize from '@/lib/connection'` or `import { sequelize } from '@/lib/models'`
- **CRITICAL**: Import models from `@/lib/models` index, never from individual files (ensures associations are initialized)
- **User data is managed by Supabase Auth** - no local User model; `userId` fields are STRING type storing Supabase Auth UUIDs without FK constraints
- User identification: All `userId` fields reference Supabase Auth user.id (UUID strings)

### Database Schema Changes (Migrations)
**ALWAYS use Sequelize migrations for any table or association changes:**
- Migration files: `migrations/` directory
- Create migration: `npx sequelize-cli migration:generate --name <descriptive-name>`
- Run migrations: `npx sequelize-cli db:migrate`
- Rollback: `npx sequelize-cli db:migrate:undo`

**Never modify tables directly** - always create a migration file that can be version-controlled and applied consistently across environments.

Example migration for adding a column:
```javascript
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('products', 'category', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('products', 'category');
  },
};
```

### Sequelize Query Patterns
```typescript
// Find with relations - use 'as' alias matching model associations
const cartItems = await CartItem.findAll({
  where: { userId },
  include: [{ model: Product, as: 'product' }],
});

// Find one
const cartItem = await CartItem.findOne({ where: { id, userId } });
const product = await Product.findByPk(productId);

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
The cart API uses a single consolidated route at `/api/cart` with HTTP methods:
- `GET` - Fetch cart items (authenticated users only)
- `POST` - Add item to cart (supports guest mode)
- `PATCH` - Update cart item quantity (authenticated users only)
- `DELETE` - Remove cart item (authenticated users only)

Pattern: Extract body → Get session from headers via helper → If authenticated: Sequelize DB ops, else: return product data → Client handles Redux + localStorage.

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

## Component Organization
**Keep page components minimal** - only import and render the main page component:
- Page routes (`src/app/**/page.tsx`): Should only import and render the main component
- Page-specific components: Create in `src/components/pages/<route-name>/`
- Sub-components for a page: Place in `src/components/pages/<route-name>/components/`
- Example structure:
  ```
  src/app/orders/page.tsx              → imports OrdersPageContent
  src/components/pages/orders/
    OrdersPageContent.tsx              → main page component
    components/
      OrderCard.tsx                    → page-specific sub-component
      OrderSkeleton.tsx                → page-specific loading component
  ```

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
- Sequelize connection: [src/lib/connection.ts](src/lib/connection.ts)
- Models index/loader: [src/lib/models/index.ts](src/lib/models/index.ts)
- **Service layer**: [src/lib/services/](src/lib/services/) - all API calls with route constants
- **Session helpers**: [src/lib/auth/session.ts](src/lib/auth/session.ts) - `getSessionFromHeaders()`, `requireAuth()`
- Cart API: [src/app/api/cart/route.ts](src/app/api/cart/route.ts) - consolidated GET/POST/PATCH/DELETE
- Guest → auth cart merge: [src/app/api/cart/sync/route.ts](src/app/api/cart/sync/route.ts)
- Session proxy: [src/proxy.ts](src/proxy.ts) - verifies session and attaches headers
