'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // First make total_amount NOT NULL if it was nullable
    await queryInterface.changeColumn('orders', 'total_amount', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    });

    // Copy any remaining data from total to total_amount if needed
    await queryInterface.sequelize.query(
      `UPDATE orders SET total_amount = total WHERE total_amount IS NULL AND total IS NOT NULL;`
    );

    // Drop the legacy total column
    await queryInterface.removeColumn('orders', 'total');
  },

  async down(queryInterface, Sequelize) {
    // Restore the total column
    await queryInterface.addColumn('orders', 'total', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    });

    // Copy data back from total_amount
    await queryInterface.sequelize.query(
      `UPDATE orders SET total = total_amount;`
    );

    // Make total_amount nullable again
    await queryInterface.changeColumn('orders', 'total_amount', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    });
  }
};
