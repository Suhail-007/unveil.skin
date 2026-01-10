'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Check and remove foreign key constraint from cart_items.user_id if it exists
    try {
      const cartConstraints = await queryInterface.sequelize.query(
        `SELECT constraint_name FROM information_schema.table_constraints 
         WHERE table_name = 'cart_items' AND constraint_type = 'FOREIGN KEY' 
         AND constraint_name LIKE '%user%'`,
        { type: Sequelize.QueryTypes.SELECT }
      );
      
      for (const constraint of cartConstraints) {
        await queryInterface.removeConstraint('cart_items', constraint.constraint_name);
        console.log(`Removed constraint: ${constraint.constraint_name} from cart_items`);
      }
    } catch (error) {
      console.log('No user FK constraint found on cart_items or already removed');
    }
    
    // Check and remove foreign key constraint from orders.user_id if it exists
    try {
      const orderConstraints = await queryInterface.sequelize.query(
        `SELECT constraint_name FROM information_schema.table_constraints 
         WHERE table_name = 'orders' AND constraint_type = 'FOREIGN KEY' 
         AND constraint_name LIKE '%user%'`,
        { type: Sequelize.QueryTypes.SELECT }
      );
      
      for (const constraint of orderConstraints) {
        await queryInterface.removeConstraint('orders', constraint.constraint_name);
        console.log(`Removed constraint: ${constraint.constraint_name} from orders`);
      }
    } catch (error) {
      console.log('No user FK constraint found on orders or already removed');
    }
    
    // Drop users table if it exists (it was created by old migration but shouldn't exist)
    try {
      await queryInterface.dropTable('users');
      console.log('Dropped users table - using Supabase Auth instead');
    } catch (error) {
      console.log('Users table already removed or never existed');
    }
    
    console.log('Migration complete: user_id fields now store Supabase Auth UUIDs without FK constraints');
  },

  async down(queryInterface, Sequelize) {
    console.log('This migration cannot be reversed - Supabase Auth is the source of truth for users');
    // Intentionally left empty - we don't want to recreate the users table
  },
};
