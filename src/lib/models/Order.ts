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

// Order status enum
export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

// Payment status enum
export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUND = 'refund',
}

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
  declare status: CreationOptional<OrderStatus>;
  
  // Razorpay payment fields
  declare razorpayOrderId?: CreationOptional<string | null>;
  declare razorpayPaymentId?: CreationOptional<string | null>;
  declare paymentMethod?: CreationOptional<string>;
  declare paymentStatus?: CreationOptional<PaymentStatus>;
  declare shippingAddress: Record<string, string | number>;
  
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
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'total_amount',
    },
    status: {
      type: DataTypes.ENUM(...Object.values(OrderStatus)),
      allowNull: false,
      defaultValue: OrderStatus.PENDING,
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
      type: DataTypes.ENUM(...Object.values(PaymentStatus)),
      allowNull: true,
      defaultValue: PaymentStatus.PENDING,
      field: 'payment_status',
    },
    shippingAddress: {
      type: DataTypes.JSONB,
      allowNull: false,
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
