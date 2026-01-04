import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config';

interface CartItemAttributes {
  id: string;
  userId?: string | null;
  productId: string;
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CartItemCreationAttributes
  extends Optional<CartItemAttributes, 'id' | 'createdAt' | 'updatedAt'> {
  // Creation attributes
}

class CartItem extends Model<CartItemAttributes, CartItemCreationAttributes> implements CartItemAttributes {
  public id!: string;
  public userId?: string | null;
  public productId!: string;
  public quantity!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CartItem.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
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
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'cart_items',
    timestamps: true,
  }
);

export default CartItem;
