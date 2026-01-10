/**
 * Database Migration: Add Razorpay Fields to Orders
 * 
 * This migration adds fields to store Razorpay payment information:
 * - razorpayOrderId: The order ID from Razorpay
 * - razorpayPaymentId: The payment ID after successful payment
 * - paymentMethod: Method used for payment (razorpay, cod, etc.)
 * - paymentStatus: Current status of payment
 * - shippingAddress: JSON field for shipping details
 * - totalAmount: Replaces 'total' with better naming
 * 
 * Created: January 10, 2026
 */

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add Razorpay and payment related fields
    await queryInterface.addColumn('orders', 'razorpay_order_id', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Razorpay order ID (order_XXXXX)',
    });

    await queryInterface.addColumn('orders', 'razorpay_payment_id', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Razorpay payment ID (pay_XXXXX)',
    });

    await queryInterface.addColumn('orders', 'payment_method', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: 'razorpay',
      comment: 'Payment method: razorpay, cod, wallet, etc.',
    });

    await queryInterface.addColumn('orders', 'payment_status', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: 'pending',
      comment: 'Payment status: pending, paid, failed, refunded',
    });

    await queryInterface.addColumn('orders', 'shipping_address', {
      type: Sequelize.JSONB,
      allowNull: true,
      comment: 'Shipping address details in JSON format',
    });

    // Add index on razorpay_order_id for faster lookups
    await queryInterface.addIndex('orders', ['razorpay_order_id'], {
      name: 'orders_razorpay_order_id_idx',
      unique: true,
      where: {
        razorpay_order_id: { [Sequelize.Op.ne]: null }
      }
    });

    // Add index on razorpay_payment_id
    await queryInterface.addIndex('orders', ['razorpay_payment_id'], {
      name: 'orders_razorpay_payment_id_idx',
    });

    // Add composite index for payment queries
    await queryInterface.addIndex('orders', ['payment_status', 'payment_method'], {
      name: 'orders_payment_status_method_idx',
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove indexes first
    await queryInterface.removeIndex('orders', 'orders_payment_status_method_idx');
    await queryInterface.removeIndex('orders', 'orders_razorpay_payment_id_idx');
    await queryInterface.removeIndex('orders', 'orders_razorpay_order_id_idx');

    // Remove columns
    await queryInterface.removeColumn('orders', 'shipping_address');
    await queryInterface.removeColumn('orders', 'payment_status');
    await queryInterface.removeColumn('orders', 'payment_method');
    await queryInterface.removeColumn('orders', 'razorpay_payment_id');
    await queryInterface.removeColumn('orders', 'razorpay_order_id');
  }
};
