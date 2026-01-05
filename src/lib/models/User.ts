import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { CartItem } from './CartItem';
import { Order } from './Order';

@Table({
  tableName: 'users',
  timestamps: true,
  underscored: true,
})
export class User extends Model {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  name?: string;

  @HasMany(() => CartItem)
  cartItems!: CartItem[];

  @HasMany(() => Order)
  orders!: Order[];
}
