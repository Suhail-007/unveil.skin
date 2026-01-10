'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('orders', 'total_amount', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Total amount in rupees (duplicate of legacy "total" for newer field name)'
    });

    // Optionally populate from existing `total` values if present
    try {
      await queryInterface.sequelize.query(
        `UPDATE orders SET total_amount = total WHERE total_amount IS NULL AND total IS NOT NULL;`
      );
    } catch (err) {
      // ignore - safe fallback if `total` not present or query fails
      console.warn('Could not auto-populate total_amount from total:', err.message || err);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('orders', 'total_amount');
  }
};
