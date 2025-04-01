import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('advice', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    author_name: {
      type: DataTypes.STRING(100),
    },
    ip_address: {
      type: DataTypes.STRING(45),
    },
    moderated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  // Add index
  await queryInterface.addIndex('advice', ['moderated']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('advice');
} 