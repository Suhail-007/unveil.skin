'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('feature_flags', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      flag_key: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      flag_value: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      category: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      description: {
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
    await queryInterface.addIndex('feature_flags', ['flag_key']);
    await queryInterface.addIndex('feature_flags', ['category']);

    // Insert default feature flags
    await queryInterface.bulkInsert('feature_flags', [
      // Commerce Features
      {
        id: Sequelize.literal('uuid_generate_v4()'),
        flag_key: 'showPricing',
        flag_value: true,
        category: 'commerce',
        description: 'Display product prices throughout the site',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: Sequelize.literal('uuid_generate_v4()'),
        flag_key: 'enableCart',
        flag_value: true,
        category: 'commerce',
        description: 'Enable shopping cart functionality',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: Sequelize.literal('uuid_generate_v4()'),
        flag_key: 'enableCheckout',
        flag_value: true,
        category: 'commerce',
        description: 'Allow users to proceed to checkout',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: Sequelize.literal('uuid_generate_v4()'),
        flag_key: 'enableOrders',
        flag_value: true,
        category: 'commerce',
        description: 'Enable order placement and tracking',
        created_at: new Date(),
        updated_at: new Date(),
      },
      // Product Features
      {
        id: Sequelize.literal('uuid_generate_v4()'),
        flag_key: 'showProductDetails',
        flag_value: true,
        category: 'product',
        description: 'Show detailed product information',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: Sequelize.literal('uuid_generate_v4()'),
        flag_key: 'enableProductReviews',
        flag_value: false,
        category: 'product',
        description: 'Allow customers to review products',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: Sequelize.literal('uuid_generate_v4()'),
        flag_key: 'enableWishlist',
        flag_value: false,
        category: 'product',
        description: 'Enable product wishlist/favorites',
        created_at: new Date(),
        updated_at: new Date(),
      },
      // Content Features
      {
        id: Sequelize.literal('uuid_generate_v4()'),
        flag_key: 'showBenefits',
        flag_value: true,
        category: 'content',
        description: 'Display product benefits section',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: Sequelize.literal('uuid_generate_v4()'),
        flag_key: 'showHowToUse',
        flag_value: true,
        category: 'content',
        description: 'Show how to use instructions',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: Sequelize.literal('uuid_generate_v4()'),
        flag_key: 'showDermatologistNotes',
        flag_value: true,
        category: 'content',
        description: 'Display dermatologist notes and recommendations',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: Sequelize.literal('uuid_generate_v4()'),
        flag_key: 'showContentMarkdown',
        flag_value: true,
        category: 'content',
        description: 'Show additional markdown content sections',
        created_at: new Date(),
        updated_at: new Date(),
      },
      // User Features
      {
        id: Sequelize.literal('uuid_generate_v4()'),
        flag_key: 'enableUserAccounts',
        flag_value: true,
        category: 'user',
        description: 'Allow user registration and login',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: Sequelize.literal('uuid_generate_v4()'),
        flag_key: 'enableGuestCheckout',
        flag_value: false,
        category: 'user',
        description: 'Allow checkout without creating an account',
        created_at: new Date(),
        updated_at: new Date(),
      },
      // Marketing Features
      {
        id: Sequelize.literal('uuid_generate_v4()'),
        flag_key: 'showWaitlist',
        flag_value: true,
        category: 'marketing',
        description: 'Display waitlist signup form',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: Sequelize.literal('uuid_generate_v4()'),
        flag_key: 'enableNewsletterSignup',
        flag_value: true,
        category: 'marketing',
        description: 'Show newsletter subscription options',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: Sequelize.literal('uuid_generate_v4()'),
        flag_key: 'showPromotion',
        flag_value: false,
        category: 'marketing',
        description: 'Display promotional banners and offers',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('feature_flags');
  },
};
