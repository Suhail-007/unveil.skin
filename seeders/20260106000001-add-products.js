'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('products', [
      {
        id: 'soap-bar',
        name: 'ORDYN Soap Bar',
        description: 'Gentle cleanser with niacinamide and brightening actives for clearer, balanced skin.',
        price: 299.00,
        category: 'Skincare',
        image: '/assets/Soap-Bar-Standing.jpg',
        stock: 100,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'sunscreen',
        name: 'ORDYN Daily Sunscreen',
        description: 'Broad-spectrum SPF 50 with niacinamide. Zero white cast, perfect under makeup.',
        price: 499.00,
        category: 'Skincare',
        image: '/assets/Sunscreen_mainside_and_Soap.jpg',
        stock: 100,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('products', {
      id: ['soap-bar', 'sunscreen']
    }, {});
  }
};
