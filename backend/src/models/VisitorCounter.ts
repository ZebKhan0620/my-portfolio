import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

interface VisitorCounterAttributes {
  id: number;
  count: number;
  last_updated: Date;
}

export class VisitorCounter extends Model<VisitorCounterAttributes> implements VisitorCounterAttributes {
  public id!: number;
  public count!: number;
  public last_updated!: Date;
}

VisitorCounter.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      defaultValue: 1,
    },
    count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    last_updated: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'visitor_counter',
    timestamps: true,
    createdAt: false,
    updatedAt: 'last_updated',
  }
); 