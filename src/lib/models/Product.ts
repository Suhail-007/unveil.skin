import {
  Association,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from 'sequelize';
import sequelize from '../connection';
import type { CartItem } from './CartItem';
import type { OrderItem } from './OrderItem';

type ProductModels = {
  CartItem: typeof import('./CartItem').CartItem;
  OrderItem: typeof import('./OrderItem').OrderItem;
};

class Product extends Model<
  InferAttributes<Product, { omit: 'cartItems' | 'orderItems' }>,
  InferCreationAttributes<Product, { omit: 'cartItems' | 'orderItems' }>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare description: CreationOptional<string | null>;
  declare price: string;
  declare image: CreationOptional<string | null>;
  declare slug: string;
  declare stock: number;
  declare category: CreationOptional<string | null>;
  declare is_active: CreationOptional<boolean>;
  declare benefits: CreationOptional<any[] | null>;
  declare how_to_use: CreationOptional<any[] | null>;
  declare dermatologist_notes: CreationOptional<any[] | null>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  declare cartItems?: NonAttribute<CartItem[]>;
  declare orderItems?: NonAttribute<OrderItem[]>;

  declare static associations: {
    cartItems: Association<Product, CartItem>;
    orderItems: Association<Product, OrderItem>;
  };

  static associate(models: ProductModels) {
    Product.hasMany(models.CartItem, {
      foreignKey: 'productId',
      as: 'cartItems',
    });
    Product.hasMany(models.OrderItem, {
      foreignKey: 'productId',
      as: 'orderItems',
    });
  }
}

Product.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    benefits: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    how_to_use: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    dermatologist_notes: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'products',
    modelName: 'Product',
    timestamps: true,
    underscored: true,
  }
);

export { Product };
