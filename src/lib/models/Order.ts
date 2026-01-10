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
  declare totalAmount: CreationOptional<number>;
  declare status: CreationOptional<string>;
  
  // Razorpay payment fields
  declare razorpayOrderId?: CreationOptional<string | null>;
  declare razorpayPaymentId?: CreationOptional<string | null>;
  declare paymentMethod?: CreationOptional<string>;
  declare paymentStatus?: CreationOptional<string>;
  declare shippingAddress?: CreationOptional<Record<string, string | number> | null>;
  
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
  declare createdAt?: CreationOptional<Date>; // Alias for created_at
  declare updatedAt?: CreationOptional<Date>; // Alias for updated_at

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
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'total_amount',
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending',
    },
    razorpayOrderId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'razorpay_order_id',
    },
    razorpayPaymentId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'razorpay_payment_id',
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'razorpay',
      field: 'payment_method',
    },
    paymentStatus: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'pending',
      field: 'payment_status',
    },
    shippingAddress: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'shipping_address',
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
