import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface ContactAttributes {
  id: number;
  name: string;
  email: string;
  message: string;
  status: 'pending' | 'read' | 'replied';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ContactCreationAttributes extends Optional<ContactAttributes, 'id'> {}

export class Contact extends Model<ContactAttributes, ContactCreationAttributes> implements ContactAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public message!: string;
  public status!: 'pending' | 'read' | 'replied';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Contact.init(
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'read', 'replied'),
      defaultValue: 'pending',
    },
  },
  {
    sequelize,
    modelName: 'Contact',
    tableName: 'contacts',
  }
); 