import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import sequelize from '../connection';

interface FeatureFlagAttributes {
  id: string;
  flag_key: string;
  flag_value: boolean;
  category: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

class FeatureFlag
  extends Model<InferAttributes<FeatureFlag>, InferCreationAttributes<FeatureFlag>>
  implements FeatureFlagAttributes
{
  declare id: string;
  declare flag_key: string;
  declare flag_value: boolean;
  declare category: string;
  declare description: string;
  declare created_at: Date;
  declare updated_at: Date;
}

FeatureFlag.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    flag_key: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    flag_value: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    description: {
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
    tableName: 'feature_flags',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default FeatureFlag;
