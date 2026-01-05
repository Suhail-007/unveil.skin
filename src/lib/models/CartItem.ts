import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './User';
import { Product } from './Product';

@Table({
  tableName: 'cart_items',
  timestamps: true,
  underscored: true,
})
export class CartItem extends Model {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  userId?: string;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  productId!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
  })
  quantity!: number;

  @BelongsTo(() => User)
  user?: User;

  @BelongsTo(() => Product)
  product!: Product;
}
