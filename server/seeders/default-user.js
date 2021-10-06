'use strict';
const bcrypt = require('bcryptjs')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    let password = process.env.SEED_SUPERUSER_PASSWORD || 'paperbird'
    const salt = await bcrypt.genSalt(10);
  let newpassword = await bcrypt.hash(password, salt);
return queryInterface.bulkInsert('User_Master', [{
      UserName: 'Seed Admin',
      Email: 'admin@paperbird.com',
      Password: newpassword,
      RoleID: 1,
      isActive: 1
    },
    {
      UserName: 'Seed Supplier',
      Email: 'supplier@paperbird.com',
      Password: newpassword,
      RoleID: 2,
      isActive: 1
    },
    {
      UserName: 'Seed Customer',
      Email: 'customer@paperbird.com',
      Password: newpassword,
      RoleID: 3,
      isActive: 1
    }
  ]);
  },
down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('superuser', { email: 'admin@agenkan.com' }, {});
  }
};