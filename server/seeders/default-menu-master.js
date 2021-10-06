'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {

return queryInterface.bulkInsert('Menu_Master', [
  //admin
  { MenuName: 'Country',
      Link: '/country',
      MenuGroupID:1,
      SeqNo: 1,
      isActive: 1
    },
    //admin
    {MenuName: 'State',
      Link: '/state',
      MenuGroupID:1,
      SeqNo: 2,
      isActive: 1
    },
    //admin
    {MenuName: 'City',
      Link: '/city',
      MenuGroupID:1,
      SeqNo: 3,
      isActive: 1
    },
    //superadmin
    {MenuName: 'Role',
      Link: '/role',
      MenuGroupID:2,
      SeqNo: 1,
      isActive: 1
    },
    //superadmin
    {
      MenuName: 'Permission',
      Link: '/permission',
      MenuGroupID:2,
      SeqNo: 2,
      isActive: 1
    },
    //admin
    {
      MenuName: 'Customer', //single customer
      Link: '/customer',
      MenuGroupID:2,
      SeqNo: 3,
      isActive: 1
    },
    //admin
    {
      MenuName: 'Supplier',
      Link: '/supplier',
      MenuGroupID:2,
      SeqNo: 4,
      isActive: 1
    },
    //admin
    {
      MenuName: 'Admin',
      Link: '/admin',
      MenuGroupID:2,
      SeqNo: 4,
      isActive: 1
    },
    //admin
    {
      MenuName: 'Product',
      Link: '/products',
      MenuGroupID:3,
      SeqNo: 1,
      isActive: 1
    },
    //admin
    {
      MenuName: 'Group',
      Link: '/productGroup',
      MenuGroupID:3,
      SeqNo: 2,
      isActive: 1
    },
    //admin
    {
      MenuName: 'Sub Group',
      Link: '/productSubGroup',
      MenuGroupID:3,
      SeqNo: 3,
      isActive: 1
    },
    //admin
    {
      MenuName: 'Paper Class',
      Link: '/paperClass',
      MenuGroupID:3,
      SeqNo: 4,
      isActive: 1
    },
    //admin
    {
      MenuName: 'Paper Prinitibility',
      Link: '/paperPrintibility',
      MenuGroupID:3,
      SeqNo: 5,
      isActive: 1
    },
    //admin
      {
      MenuName: 'Paper Quality',
      Link: '/paperQuality',
      MenuGroupID:3,
      SeqNo: 6,
      isActive: 1
    },
    
    //supplier
    {
      MenuName: 'Warehouses',
      Link: '/warehouses',
      MenuGroupID:4,
      SeqNo: 1,
      isActive: 1
    },
  
     //supplier
     {
      MenuName: 'Orders', //in this page there will be po del status, payment status
      Link: '/orders',
      MenuGroupID:5,
      SeqNo: 1,
      isActive: 1
    },
  
    // customer
    {
      MenuName: 'My orders', //
      Link: '/myorders',
      MenuGroupID:5,
      SeqNo: 2,
      isActive: 1
    },
    // supplier
    {
      MenuName: 'Groups', //
      Link: '/groups',
      MenuGroupID:6,
      SeqNo: 1,
      isActive: 1
    },
        //customer and supplier 
    {
      MenuName: 'All Inquiries',
      Link: '/inquiry',
      MenuGroupID:8,
      SeqNo: 1,
      isActive: 1
    },
    {
      MenuName: 'Offer Master',
      Link: '/offerMaster',
      MenuGroupID:9,
      SeqNo: 1,
      isActive: 1
    },
    {
      MenuName: 'Pricing',
      Link: '/pricing',
      MenuGroupID:9,
      SeqNo: 2,
      isActive: 1
    },
    {
      MenuName: 'Target',
      Link: '/target',
      MenuGroupID:10,
      SeqNo: 1,
      isActive: 1
    },
  ]);
  },
down: (queryInterface, Sequelize) => {
    return;
  }
};