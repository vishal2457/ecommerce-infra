'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
 let adminPerm = {
   1: true,
   2:true,
   3: true,
   4: true,
   5: true,
   6: true
 }

 let supplierPerm = {
  1: false,
  2:false,
  3: false,
  4: false,
  5: false,
  6: false
}

let customerPerm = {
  1: false,
  2:false,
  3: false,
  4: false,
  5: false,
  6: false
}
return queryInterface.bulkInsert('Role_Master', [{
      RoleName: 'Admin',
      Permissions: JSON.stringify(adminPerm),
      isActive: 1,
    },
    {
      RoleName: 'Supplier',
      Permissions: JSON.stringify(supplierPerm),
      isActive: 1,
    },
    {
      RoleName: 'Customer',
      Permissions: JSON.stringify(customerPerm),
      isActive: 1,
    }
  ]);
  },
down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('superuser', { email: 'admin@agenkan.com' }, {});
  }
};