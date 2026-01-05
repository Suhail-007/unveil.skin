import { User } from './User';
import { Product } from './Product';
import { CartItem } from './CartItem';
import { Order } from './Order';
import { OrderItem } from './OrderItem';

/**
 * Database Models Index
 *
 * IMPORTANT NOTES:
 * - All models use Sequelize TypeScript decorators
 * - Timestamps (created_at, updated_at) are automatically managed
 * - UUIDs are used as primary keys for all tables
 * - Foreign key relationships are defined with proper cascade rules
 *
 * Available Models:
 * - User: User accounts with authentication
 * - Product: Product catalog with inventory tracking
 * - CartItem: Shopping cart items for users
 * - Order: Order management with status tracking
 * - OrderItem: Junction table linking orders with products
 */

// Initialize all models
const models = {
  User,
  Product,
  CartItem,
  Order,
  OrderItem,
};

// Set up associations
Object.values(models).forEach((model: any) => {
  if (model.associate) {
    model.associate(models);
  }
});

export { User, Product, CartItem, Order, OrderItem };

export default models;
