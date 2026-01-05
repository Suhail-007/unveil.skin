import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { User } from './User';
import { OrderItem } from './OrderItem';

@Table({
  tableName: 'orders',
  timestamps: true,
  underscored: true,
})
export class Order extends Model {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  userId!: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  total!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'pending',
  })
  status!: string;

  @BelongsTo(() => User)
  user!: User;

  @HasMany(() => OrderItem)
  orderItems!: OrderItem[];
}
