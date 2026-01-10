// This file re-exports the database connection and models for backward compatibility
import db from './models';

export const { sequelize, Product, CartItem, Order, OrderItem } = db;
export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return false;
  }
};

// Sync database (only in development)
if (process.env.NODE_ENV === 'development') {
  sequelize.sync({ alter: false });
}

export default sequelize;