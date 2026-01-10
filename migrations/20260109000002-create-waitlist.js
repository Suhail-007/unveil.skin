'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('waitlist', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      product_interest: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      source: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'Source of signup (e.g., homepage, product page)',
      },
      status: {
        type: Sequelize.ENUM('pending', 'notified', 'converted', 'unsubscribed'),
        allowNull: false,
        defaultValue: 'pending',
      },
      notified_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      metadata: {
        type: Sequelize.JSONB,
        allowNull: true,
        comment: 'Additional metadata like UTM parameters, preferences, etc.',
      },
      ip_address: {
        type: Sequelize.STRING(45),
        allowNull: true,
      },
      user_agent: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Add indexes
    await queryInterface.addIndex('waitlist', ['email']);
    await queryInterface.addIndex('waitlist', ['status']);
    await queryInterface.addIndex('waitlist', ['product_interest']);
    await queryInterface.addIndex('waitlist', ['created_at']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('waitlist');
  },
};
