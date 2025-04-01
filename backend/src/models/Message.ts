import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

interface MessageAttributes {
  id?: number;
  name: string;
  email: string;
  message: string;
  status?: 'new' | 'read' | 'replied';
  ip_address?: string;
  created_at?: Date;
}

export class Message extends Model<MessageAttributes> implements MessageAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public message!: string;
  public status!: 'new' | 'read' | 'replied';
  public ip_address!: string;
  public readonly created_at!: Date;
}

Message.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('new', 'read', 'replied'),
      defaultValue: 'new',
    },
    ip_address: {
      type: DataTypes.STRING(45),
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'messages',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  }
); 