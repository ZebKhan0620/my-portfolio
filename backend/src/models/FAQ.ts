import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

interface FAQAttributes {
  id?: number;
  question: string;
  answer: string;
  category: 'technical' | 'personal' | 'general';
  display_order: number;
  active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export class FAQ extends Model<FAQAttributes> implements FAQAttributes {
  public id!: number;
  public question!: string;
  public answer!: string;
  public category!: 'technical' | 'personal' | 'general';
  public display_order!: number;
  public active!: boolean;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

FAQ.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    question: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM('technical', 'personal', 'general'),
      defaultValue: 'general',
    },
    display_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'faqs',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
); 