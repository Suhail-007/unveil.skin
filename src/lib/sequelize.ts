import dotenv from 'dotenv';
import pg from 'pg';

const nodeEnv = process.env.NODE_ENV || 'development';
const envFile = nodeEnv === 'production' ? '.env' : `.env.${nodeEnv}`;

dotenv.config({ path: envFile });
dotenv.config({ path: '.env.local' });

import { Sequelize } from 'sequelize-typescript';
import { User } from './models/User';
import { Product } from './models/Product';
import { CartItem } from './models/CartItem';
import { Order } from './models/Order';
import { OrderItem } from './models/OrderItem';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create Sequelize instance
const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  dialectModule: pg,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

// Add models
sequelize.addModels([User, Product, CartItem, Order, OrderItem]);

// Test connection function
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

export { sequelize };
export default sequelize;
