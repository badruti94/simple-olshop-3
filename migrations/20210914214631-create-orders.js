'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'users'
          },
          key: 'id'
        }
      },
      address: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      phone_number: {
        allowNull: false,
        type: Sequelize.STRING
      },
      delivery_service: {
        allowNull: false,
        type: Sequelize.STRING
      },
      payment_method: {
        allowNull: false,
        type: Sequelize.STRING
      },
      transfer_proof: {
        allowNull: false,
        type: Sequelize.STRING
      },
      total: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      status: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: 'dikemas'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('orders');
  }
};