import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { CartItem } from './CartItem';
import { OrderItem } from './OrderItem';

@Table({
  tableName: 'products',
  timestamps: true,
  underscored: true,
})
export class Product extends Model {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  price!: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  image?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  slug!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  stock!: number;

  @HasMany(() => CartItem)
  cartItems!: CartItem[];

  @HasMany(() => OrderItem)
  orderItems!: OrderItem[];
}
