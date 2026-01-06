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
import type { Order } from './Order';
import type { Product } from './Product';

type OrderItemModels = {
  Order: typeof import('./Order').Order;
  Product: typeof import('./Product').Product;
};

class OrderItem extends Model<
  InferAttributes<OrderItem, { omit: 'order' | 'product' }>,
  InferCreationAttributes<OrderItem, { omit: 'order' | 'product' }>
> {
  declare id: CreationOptional<string>;
  declare orderId: string;
  declare productId: string;
  declare quantity: number;
  declare price: string;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  declare order?: NonAttribute<Order>;
  declare product?: NonAttribute<Product>;

  declare static associations: {
    order: Association<OrderItem, Order>;
    product: Association<OrderItem, Product>;
  };

  static associate(models: OrderItemModels) {
    OrderItem.belongsTo(models.Order, {
      foreignKey: 'orderId',
      as: 'order',
    });
    OrderItem.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product',
    });
  }
}

OrderItem.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
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
    tableName: 'order_items',
    modelName: 'OrderItem',
    timestamps: true,
    underscored: true,
  }
);

export { OrderItem };
