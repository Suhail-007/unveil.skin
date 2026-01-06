'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add category field
    await queryInterface.addColumn('products', 'category', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Add isActive field
    await queryInterface.addColumn('products', 'is_active', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });

    // Add benefits field (JSON array for product benefits)
    await queryInterface.addColumn('products', 'benefits', {
      type: Sequelize.JSONB,
      allowNull: true,
    });

    // Add howToUse field (JSON array for usage instructions)
    await queryInterface.addColumn('products', 'how_to_use', {
      type: Sequelize.JSONB,
      allowNull: true,
    });

    // Add dermatologistNotes field (JSON array for dermatologist notes)
    await queryInterface.addColumn('products', 'dermatologist_notes', {
      type: Sequelize.JSONB,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('products', 'category');
    await queryInterface.removeColumn('products', 'is_active');
    await queryInterface.removeColumn('products', 'benefits');
    await queryInterface.removeColumn('products', 'how_to_use');
    await queryInterface.removeColumn('products', 'dermatologist_notes');
  }
};
