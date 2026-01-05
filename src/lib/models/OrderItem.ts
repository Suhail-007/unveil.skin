import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Order } from './Order';
import { Product } from './Product';

@Table({
  tableName: 'order_items',
  timestamps: true,
  underscored: true,
})
export class OrderItem extends Model {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  @ForeignKey(() => Order)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  orderId!: string;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  productId!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  quantity!: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  price!: number;

  @BelongsTo(() => Order)
  order!: Order;

  @BelongsTo(() => Product)
  product!: Product;
}
