'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
return queryInterface.bulkInsert('Menu_Group', [{
      MenuGroup: 'Region',
      Icon: 'fa fa-globe',
      SeqNo: 1,
      isActive: 1
    },
    {
      MenuGroup: 'User Management',
      Icon: 'fa fa-user',
      SeqNo: 2,
      isActive: 1
    },
    {
      MenuGroup: 'Product',
      Icon: 'fa fa-user',
      SeqNo: 3,
      isActive: 1
    },
     {
      MenuGroup: 'Warehouse',
      Icon: 'fa fa-user',
      SeqNo: 4,
      isActive: 1
    },
    {
      MenuGroup: 'Orders',
      Icon: 'fa fa-user',
      SeqNo: 5,
      isActive: 1
    },
    {
      MenuGroup: 'Groups',
      Icon: 'fa fa-user',
      SeqNo: 6,
      isActive: 1
    },
    {
      MenuGroup: 'Pricing',
      Icon: 'fa fa-user',
      SeqNo: 7,
      isActive: 1
    },
    {
      MenuGroup: 'Inquiry',
      Icon: 'fa fa-user',
      SeqNo: 8,
      isActive: 1
    },
    {
      MenuGroup: 'Offers',
      Icon: 'fa fa-user',
      SeqNo: 9,
      isActive: 1
    },
    {
      MenuGroup: 'Target',
      Icon: 'fa fa-user',
      SeqNo: 10,
      isActive: 1
    },
  ]);
  },
down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('superuser', { email: 'admin@agenkan.com' }, {});
  }
};