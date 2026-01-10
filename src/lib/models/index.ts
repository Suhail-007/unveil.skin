import sequelize from '../connection';
import { Product } from './Product';
import { CartItem } from './CartItem';
import { Order } from './Order';
import { OrderItem } from './OrderItem';
import FeatureFlag from './FeatureFlag';
import Waitlist from './Waitlist';

/**
 * Database Models Index
 *
 * IMPORTANT NOTES:
 * - All models use Sequelize Model.init() pattern
 * - Timestamps (created_at, updated_at) are automatically managed
 * - UUIDs are used as primary keys for all tables
 * - Foreign key relationships are defined with proper cascade rules
 * - User data is managed by Supabase Authentication
 * - For any table or association changes, use Sequelize migrations
 *
 * Available Models:
 * - Product: Product catalog with inventory tracking
 * - CartItem: Shopping cart items for users
 * - Order: Order management with status tracking
 * - OrderItem: Junction table linking orders with products
 * - FeatureFlag: Feature flags for controlling app features
 * - Waitlist: Waitlist signups with tracking
 */

type DbModels = {
  sequelize: typeof sequelize;
  Product: typeof Product;
  CartItem: typeof CartItem;
  Order: typeof Order;
  OrderItem: typeof OrderItem;
  FeatureFlag: typeof FeatureFlag;
  Waitlist: typeof Waitlist;
};

// Initialize all models
const db: DbModels = {
  Product,
  CartItem,
  Order,
  OrderItem,
  FeatureFlag,
  Waitlist,
  sequelize,
};

// Models object for associations (without sequelize)
const models = { Product, CartItem, Order, OrderItem, FeatureFlag, Waitlist };

// Set up associations - call each model's associate method with proper types
Product.associate({ CartItem, OrderItem });
CartItem.associate({ Product });
Order.associate({ OrderItem });
OrderItem.associate({ Order, Product });

export { Product, CartItem, Order, OrderItem, sequelize };

export default db;
