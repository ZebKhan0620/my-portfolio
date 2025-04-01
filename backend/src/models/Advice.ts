import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface AdviceAttributes {
  id: number;
  name: string;
  message: string;
  role?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AdviceCreationAttributes extends Optional<AdviceAttributes, 'id'> {}

export class Advice extends Model<AdviceAttributes, AdviceCreationAttributes> implements AdviceAttributes {
  public id!: number;
  public name!: string;
  public message!: string;
  public role!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Advice.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Advice',
    tableName: 'advice',
  }
); 