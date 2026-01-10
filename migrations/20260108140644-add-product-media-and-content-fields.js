'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Change image column to images (JSONB for key-value pairs)
    await queryInterface.removeColumn('products', 'image');
    await queryInterface.addColumn('products', 'images', {
      type: Sequelize.JSONB,
      allowNull: true,
      comment: 'Key-value pairs of product images (e.g., {"main": "url", "gallery1": "url"})',
    });

    // Add videos column (JSONB for key-value pairs)
    await queryInterface.addColumn('products', 'videos', {
      type: Sequelize.JSONB,
      allowNull: true,
      comment: 'Key-value pairs of product videos (e.g., {"demo": "url", "tutorial": "url"})',
    });

    // Add markdown content column
    await queryInterface.addColumn('products', 'content_markdown', {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Markdown content for product details',
    });

    // Add details page description column
    await queryInterface.addColumn('products', 'details_description', {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Detailed description for product details page',
    });
  },

  async down(queryInterface, Sequelize) {
    // Rollback changes
    await queryInterface.removeColumn('products', 'images');
    await queryInterface.removeColumn('products', 'videos');
    await queryInterface.removeColumn('products', 'content_markdown');
    await queryInterface.removeColumn('products', 'details_description');
    
    // Restore original image column
    await queryInterface.addColumn('products', 'image', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};
