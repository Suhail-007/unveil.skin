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
import type { OrderItem } from './OrderItem';

type OrderModels = {
  OrderItem: typeof import('./OrderItem').OrderItem;
};

class Order extends Model<
  InferAttributes<Order, { omit: 'orderItems' }>,
  InferCreationAttributes<Order, { omit: 'orderItems' }>
> {
  declare id: CreationOptional<string>;
  declare userId: string;
  declare total: string;
  declare status: CreationOptional<string>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  declare orderItems?: NonAttribute<OrderItem[]>;

  declare static associations: {
    orderItems: Association<Order, OrderItem>;
  };

  static associate(models: OrderModels) {
    Order.hasMany(models.OrderItem, {
      foreignKey: 'orderId',
      as: 'orderItems',
    });
  }
}

Order.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending',
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
    tableName: 'orders',
    modelName: 'Order',
    timestamps: true,
    underscored: true,
  }
);

export { Order };
