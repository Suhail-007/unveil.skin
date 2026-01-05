'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('cart_items', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      user_id: {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      product_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Add indexes for foreign keys
    await queryInterface.addIndex('cart_items', ['user_id'], {
      name: 'cart_items_user_id_idx',
    });
    await queryInterface.addIndex('cart_items', ['product_id'], {
      name: 'cart_items_product_id_idx',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('cart_items');
  },
};
