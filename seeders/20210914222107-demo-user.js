const faker = require('faker');
const bcrypt = require('bcrypt');
require('dotenv').config();

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const data = [];
    const password = await bcrypt.hash('password', 10);

    data.push({
      name: 'Andi',
      email: process.env.EXAMPLE_EMAIL,
      username: 'admin',
      password,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    for (let i = 1; i <= 10; i++) {
      const name = faker.name.findName();
      data.push({
        name,
        email: process.env.EXAMPLE_EMAIL,
        username: name.split(' ')[0].toLowerCase() + faker.datatype.number(),
        password,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    await queryInterface.bulkInsert('users', data);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('users', null, {});
  },
};
