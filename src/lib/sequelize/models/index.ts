import sequelize from '../config';
import Product from './Product';
import CartItem from './CartItem';
import Order from './Order';

// Define associations
Product.hasMany(CartItem, {
  sourceKey: 'id',
  foreignKey: 'productId',
  as: 'cartItems',
});

CartItem.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product',
});

export { sequelize, Product, CartItem, Order };
