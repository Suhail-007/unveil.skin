import { DataTypes, InferAttributes, InferCreationAttributes, Model, Optional, CreationOptional } from 'sequelize';
import sequelize from '../connection';

interface WaitlistAttributes {
  id: string;
  email: string;
  name?: string | null;
  phone?: string | null;
  product_interest?: string | null;
  source?: string | null;
  status: 'pending' | 'notified' | 'converted' | 'unsubscribed';
  notified_at?: Date | null;
  metadata?: Record<string, unknown> | null;
  ip_address?: string | null;
  user_agent?: string | null;
  created_at: Date;
  updated_at: Date;
}

class Waitlist
  extends Model<InferAttributes<Waitlist>, InferCreationAttributes<Waitlist>>
  implements WaitlistAttributes
{
  declare id: CreationOptional<string>;
  declare email: string;
  declare name: string | null;
  declare phone: string | null;
  declare product_interest: string | null;
  declare source: string | null;
  declare status: 'pending' | 'notified' | 'converted' | 'unsubscribed';
  declare notified_at: Date | null;
  declare metadata: Record<string, unknown> | null;
  declare ip_address: string | null;
  declare user_agent: string | null;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

Waitlist.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    product_interest: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    source: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'notified', 'converted', 'unsubscribed'),
      allowNull: false,
      defaultValue: 'pending',
    },
    notified_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    ip_address: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    user_agent: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    tableName: 'waitlist',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default Waitlist;
