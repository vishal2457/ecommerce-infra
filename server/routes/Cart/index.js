const express = require("express");
const { successResponse, serverError } = require("../../helpers/response");
const router = express.Router();
const { UserCart } = require("../../models");
const auth = require("../../middlewares/jwtauth");

//get users cart
router.get("/getCart", auth, async (req, res) => {
  await UserCart.findAll({
    where: { UserID: req.user.id },
    raw: true,
  })
    .then((userCart) => successResponse(res, req, userCart, "User Cart"))
    .catch((err) => serverError(res, req, err));
});

//remove item from cart
router.post("/removeCart", auth, async (req, res) => {
  const item = req.body.item;
  await UserCart.destroy({
    where: { UserID: req.user.id, ProductID: item.ID, Unit: item.BuyIn },
  })
    .then((data) =>
      successResponse(res, req, data, "Product removed successfully")
    )
    .catch((err) => serverError(res, req, err));
});

//remove all items from cart
router.post("/removeAllCart", auth, async (req, res) => {
  const itemIds = req.body.items.map((item) => item.ID);
  await UserCart.destroy({
    where: {
      UserID: req.user.id,
      ProductID: itemIds,
    },
  })
    .then((data) => successResponse(res, req, data, "Clear All Cart"))
    .catch((err) => serverError(res, req, err));
});

//add item
router.post("/addCart_old", auth, async (req, res) => {
  await UserCart.findAll({ where: { UserID: req.user.id }, raw: true })
    .then(async (cartProducts) => {
      let arr = [];
      if (req.body.items.length) {
        for await (let item of req.body.items) {
          const existingCartItemIndex = cartProducts.findIndex(
            (singleItem) =>
              singleItem.ProductID === item.ID && singleItem.BuyIn == item.BuyIn
          );

          // singleProduct.Price = action.payload.Price;
          // // singleProduct.BuyIn = action.payload.BuyIn;
          // singleProduct.defaultPricing = action.payload.defaultPricing;

          if (existingCartItemIndex > -1) {
            arr = [...cartProducts];
            let info = JSON.parse(arr[existingCartItemIndex].Info);
            info.quantity = item.quantity;
            info.ExpectedDeliveryDate = item.ExpectedDeliveryDate;
            info.Price = item.Price;
            info.BuyIn = item.BuyIn;
            info.defaultPricing = item.defaultPricing;
            arr[existingCartItemIndex].Info = JSON.stringify(info);
          } else {
            let obj = {
              UserID: req.user.id,
              ProductID: item.ID,
              Unit: item.BuyIn,
              Info: JSON.stringify(item),
            };
            arr = [...cartProducts, obj];
          }
        }
      } else {
        arr = cartProducts;
      }

      await UserCart.destroy({ where: { UserID: req.user.id } })
        .then(async (data) => {
          await UserCart.bulkCreate(arr)
            .then((userCartCreated) => {
              successResponse(
                res,
                req,
                { cart: userCartCreated },
                "Customer Login Successfull"
              );
            })
            .catch((err) => serverError(res, req, err));
        })
        .catch((err) => serverError(res, req, err));
    })
    .catch((err) => serverError(res, req, err));
});

//add item
router.post("/addCart", auth, async (req, res) => {
  let arr = [];
  if (req.body.items.length) {
    for await (let item of req.body.items) {
      let obj = {
        UserID: req.user.id,
        ProductID: item.ID,
        Unit: item.BuyIn,
        Info: JSON.stringify(item),
      };
      arr.push(obj);
    }
  }

  await UserCart.destroy({ where: { UserID: req.user.id } })
    .then(async (data) => {
      await UserCart.bulkCreate(arr)
        .then((userCartCreated) => {
          successResponse(
            res,
            req,
            { cart: userCartCreated },
            "Cart Items Added"
          );
        })
        .catch((err) => serverError(res, req, err));
    })
    .catch((err) => serverError(res, req, err));
});

module.exports = router;
