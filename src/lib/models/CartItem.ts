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
import type { Product } from './Product';

type CartItemModels = {
  Product: typeof import('./Product').Product;
};

class CartItem extends Model<
  InferAttributes<CartItem, { omit: 'product' }>,
  InferCreationAttributes<CartItem, { omit: 'product' }>
> {
  declare id: CreationOptional<string>;
  declare userId: string | null;
  declare productId: string;
  declare quantity: CreationOptional<number>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  // Associations
  declare product?: NonAttribute<Product>;

  declare static associations: {
    product: Association<CartItem, Product>;
  };

  static associate(models: CartItemModels) {
    CartItem.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product',
    });
  }
}

CartItem.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    productId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
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
    tableName: 'cart_items',
    modelName: 'CartItem',
    timestamps: true,
    underscored: true,
  }
);

export { CartItem };
