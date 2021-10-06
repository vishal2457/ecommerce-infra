const express = require("express");
const router = express.Router();
const {
  sequelize,
  ProductMaster,
  ProductImages,
  ProductGroup,
  ProductSubgroup,
  MeasurementUnit,
  PaperClass,
  PaperQuality,
  PaperPrintibility,
  PaperGrain,
  PaperGsm,
  RunningDirection,
  PaperStrength,
  PaperRies,
  PaperColor,
  RegularPrice,
  RegularPriceRange,
  Group,
  Supplier,
} = require("../models");
const { successResponse, serverError } = require("../helpers/response");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

//get all search suggestion list
/**
 * @params keyword {string} --> searched keyword by user
 */

router.post("/searchSuggestionsList_bk", async (req, res) => {
  const { keyword, page, limit, GroupID } = req.body;

  // used to create and operations based on keyword(multiple words)
  const getSearch = (word) => {
    const words = word.split(" ");
    let search = "";
    words.map((i) => (search += i && `AND Search LIKE '%${i}%'`));
    return search;
  };

  if (keyword) {
    let search = getSearch(keyword);

    // let where = `HasPricing = 1 AND IsActive = 1 AND IsDelete = 0 AND IsPublished = 1 ${search}`;
    let where = `IsActive = 1 AND IsDelete = 0 AND Search IS NOT NULL ${search}`;

    // console.log(`SELECT ID, ProductName, REPLACE(Search, ',', ' ') as Search
    // FROM Product_Master
    // WHERE ${where}`);

    sequelize
      .query(
        // `SELECT ID, ProductName, REPLACE(Search, ',', ' ') as Search
        `SELECT ID, ProductName, Search
      FROM Product_Master      
      WHERE ${where} ORDER BY ID DESC`,
        {
          type: Sequelize.QueryTypes.SELECT,
        }
      )
      .then((data) => {
        const finalData = [];
        let index = 0;
        while (index < data.length && finalData.length < limit) {
          if (data[index].Search) {
            const getIndex = (arr) => {
              let i = 1;
              let ind = null;
              while (i < arr.length) {
                if (arr[i].includes(keyword)) {
                  ind = i;
                }
                i++;
              }
              return ind;
            };
            const obj = data[index];
            const arr = obj.Search.split(",");

            arr[0] = keyword;

            const ind = getIndex(arr);
            arr.splice(ind, 1);

            finalData.push({
              key: arr.toString(),
              name: arr.join(" ").toString(),
            });
          }
          index++;
        }

        successResponse(res, req, finalData, "suggestion list");
      })
      .catch((err) => serverError(res, req, err));
  } else {
    successResponse(res, req, [], "No keyword available");
  }
});

router.post("/searchSuggestionsList_bk2", async (req, res) => {
  const { keyword, limit } = req.body;

  // check suggestion list have already tag
  const IsSuggestionAdded = (arr, tag) => {
    let index = 0;
    while (index < arr.length) {
      if (arr[index].name == tag) {
        // compare tag and suggestion name
        return true;
      }
      index++;
    }
    return false;
  };

  if (keyword) {
    let includeOption = [
      {
        model: ProductSubgroup,
        attributes: ["ProductSubgroup", "ID"],
        where: { IsActive: 1 },
      },
      {
        model: ProductGroup,
        attributes: ["ProductGroup", "ID"],
        where: { IsActive: 1 },
      },
      {
        model: PaperClass,
        attributes: ["PaperClass", "ID"],
        where: { IsActive: 1 },
      },
      {
        model: PaperColor,
        attributes: ["PaperColor", "ID"],
        where: { IsActive: 1 },
      },
      { model: PaperGrain, attributes: ["PaperGrain", "ID"] },
      { model: PaperGsm },
      { model: PaperQuality, attributes: ["PaperQuality", "ID"] },
      { model: PaperRies, attributes: ["PaperRies", "ID"] },
      { model: PaperStrength, attributes: ["PaperStrength", "ID"] },
      {
        model: PaperPrintibility,
        attributes: ["PaperPrintibility", "ID"],
      },
      {
        model: RunningDirection,
        attributes: ["RunningDirection", "ID"],
      },
      { model: MeasurementUnit, attributes: ["MeasurementUnit", "ID"] },
      { model: ProductImages, attributes: ["Image", "ID", "ProductID"] }, //retriving images for the product
      {
        model: RegularPrice,
        include: [{ model: Group }, { model: RegularPriceRange }],
        where: { IsActive: 1 },
      },
      {
        model: Supplier,
        attributes: [
          "SupplierName",
          "Address",
          "ID",
          "ZipCode",
          "Email",
          "Industry",
          "Vat_Tax_No",
          "ContactPersonName",
        ],
        // include:[{model: State}, {model: City}, {model: Country}],
        where: { IsActive: 1, IsApproved: 1 },
      },
    ];

    // used to create AND operations based on keyword(multiple words)
    const searchArr = keyword.split(" ");
    const arr = [];
    searchArr.map((i) => arr.push({ Search: { [Op.like]: `%${i}%` } }));

    let where = {
      HasPricing: 1,
      IsActive: 1,
      IsDelete: 0,
      IsPublished: 1,
      [Op.and]: [...arr],
    };

    await ProductMaster.findAll({
      where,
      distinct: true,
      include: includeOption,
    })
      .then((data) => {
        // helper fun for get index for keyword match
        const getIndex = (arr) => {
          console.log(arr);
          let i = 0;
          let ind = null;
          while (i < arr.length) {
            if (arr[i].includes(keyword)) {
              //if entered word present in which index
              return i;
            }
            i++;
          }
          return ind;
        };

        const finalData = [];
        let index = 0;
        while (index < data.length && finalData.length < limit) {
          if (data[index].Search) {
            const obj = data[index];
            const arr = obj.Search.split(",");
            arr.shift();

            //arr[0] = keyword; // store entered-word at first position

            // if(getIndex(arr)) arr.splice(ind, 1);

            const name =
              `<strong>${keyword}</strong>` + arr.join(" ").toString();

            let index1 = 0;
            let check = false;
            while (index1 < finalData.length && !check) {
              // compare single search and suggestion name from arr
              if (finalData[index1].name == name) {
                check = true;
              }
              index1++;
            }

            // check suggestion list have already name
            if (!check) {
              finalData.push({ key: arr.toString(), name });
            }
          }
          index++;
        }

        successResponse(res, req, finalData, "All searched suggestion list");
      })
      .catch((err) => serverError(res, req, err));
  } else {
    successResponse(res, req, [], "No keyword available");
  }
});

/**
 * @search suggestion list 
 */
router.post("/searchSuggestionsList", async (req, res) => {
  const { keyword, limit } = req.body;
  if (keyword) {
    let includeOption = [
      {
        model: ProductSubgroup,
        attributes: ["ProductSubgroup", "ID"],
        where: { IsActive: 1 },
      },
      {
        model: ProductGroup,
        attributes: ["ProductGroup", "ID"],
        where: { IsActive: 1 },
      },
      {
        model: PaperClass,
        attributes: ["PaperClass", "ID"],
        where: { IsActive: 1 },
      },
      {
        model: PaperColor,
        attributes: ["PaperColor", "ID"],
        where: { IsActive: 1 },
      },
      { model: PaperGrain, attributes: ["PaperGrain", "ID"] },
      { model: PaperGsm },
      { model: PaperQuality, attributes: ["PaperQuality", "ID"] },
      { model: PaperRies, attributes: ["PaperRies", "ID"] },
      { model: PaperStrength, attributes: ["PaperStrength", "ID"] },
      {
        model: PaperPrintibility,
        attributes: ["PaperPrintibility", "ID"],
      },
      {
        model: RunningDirection,
        attributes: ["RunningDirection", "ID"],
      },
      { model: MeasurementUnit, attributes: ["MeasurementUnit", "ID"] },
      { model: ProductImages, attributes: ["Image", "ID", "ProductID"] }, //retriving images for the product
      {
        model: RegularPrice,
        include: [{ model: Group }, { model: RegularPriceRange }],
        where: { IsActive: 1 },
      },
      {
        model: Supplier,
        attributes: [
          "SupplierName",
          "Address",
          "ID",
          "ZipCode",
          "Email",
          "Industry",
          "Vat_Tax_No",
          "ContactPersonName",
        ],
        // include:[{model: State}, {model: City}, {model: Country}],
        where: { IsActive: 1, IsApproved: 1 },
      },
    ];

    // used to create AND operations based on keyword(multiple words)
    const searchArr = keyword.split(" ");
    const arr = [];
    for (let item of searchArr) {
      arr.push({ Search: { [Op.like]: `%${item}%` } })
   }

    let where = {
      HasPricing: 1,
      IsActive: 1,
      IsDelete: 0,
      IsPublished: 1,
      [Op.and]: [...arr],
    };

    await ProductMaster.findAll({
      where,
      distinct: true,
      include: includeOption,
      raw: true,
      nest: true,
    })
      .then((data) => {
        console.log(data, "thijs is data");

        // helper fun for get single index for keyword match
        const getSingleIndex = (arr) => {
          let i = 0;
          let ind = null;
          while (i < arr.length) {
            if (arr[i].includes(keyword)) {
              //if entered word present in which index
              return i;
            }
            i++;
          }
          return ind;
        };

        // helper fun for get index Array for keyword match
        const getIndexArr = (arr) => {
          let i = 0;
          let j = 0;
          let ind = [];
          const fix = "group sub group class quality color mm in";

          while (i < searchArr.length) {
            if (!fix.toLowerCase().includes(searchArr[i].toLowerCase())) {
              while (j < arr.length) {
                if (arr[j].toLowerCase().includes(searchArr[i].toLowerCase())) {
                  //if entered word present in which index
                  ind.push(j);
                }
                j++;
              }
              i++;
            }
          }
          return ind;
        };

        const finalData = [];
        let index = 0;
        while (index < data.length && finalData.length < limit) {
          if (data[index].Search) {
            const obj = data[index];
            const arr = obj.Search.split(",");
            arr.shift(); //remove product name

            //arr[0] = keyword; // store entered-word at first position

            // if(getIndex(arr)) arr.splice(ind, 1);

            //const name = `<strong>${keyword}</strong>` + arr.join(" ").toString();

            // let index1 = 0;
            // let check = false;
            // while(index1 < finalData.length && !check){
            //   // compare single search and suggestion name from arr
            //   if(finalData[index1].name == name){
            //     check = true;
            //   }
            //   index1++;
            // }

            // // check suggestion list have already name
            // if(!check){
            //   finalData.push({ key: arr.toString(), name });
            // }
            
            const ind = getSingleIndex(arr);
            const indArr = getIndexArr(arr);

            // // if(ind) arr.splice(ind, 1);

            // let k = 0;
            // while(k < indArr.length){
            //   arr.splice(indArr[k], 1);
            //   k++;
            // }

            if (ind) arr.unshift(arr[ind]); //add to first position

            let index1 = 0;
            while (index1 < arr.length) {
              const obj = {
                key: keyword + " " + arr[index1],
                name: `<strong>${keyword}</strong>` + " " + arr[index1],
              };
              finalData.push(obj);
              index1++;
            }
          }
          index++;
        }

        successResponse(res, req, finalData, "All searched suggestion list");
      })
      .catch((err) => serverError(res, req, err));
  } else {
    successResponse(res, req, [], "No keyword available");
  }
});

//get all search suggestion products
/**
 * @params keyword {string} --> Suggestion clicked by user
 */

router.post("/searchSuggestionProducts", async (req, res) => {
  const { keyword } = req.body;

  let includeOption = [
    {
      model: ProductSubgroup,
      attributes: ["ProductSubgroup", "ID"],
      where: { IsActive: 1 },
    },
    {
      model: ProductGroup,
      attributes: ["ProductGroup", "ID"],
      where: { IsActive: 1 },
    },
    {
      model: PaperClass,
      attributes: ["PaperClass", "ID"],
      where: { IsActive: 1 },
    },
    {
      model: PaperColor,
      attributes: ["PaperColor", "ID"],
      where: { IsActive: 1 },
    },
    { model: PaperGrain, attributes: ["PaperGrain", "ID"] },
    { model: PaperGsm },
    { model: PaperQuality, attributes: ["PaperQuality", "ID"] },
    { model: PaperRies, attributes: ["PaperRies", "ID"] },
    { model: PaperStrength, attributes: ["PaperStrength", "ID"] },
    {
      model: PaperPrintibility,
      attributes: ["PaperPrintibility", "ID"],
    },
    {
      model: RunningDirection,
      attributes: ["RunningDirection", "ID"],
    },
    { model: MeasurementUnit, attributes: ["MeasurementUnit", "ID"] },
    { model: ProductImages, attributes: ["Image", "ID", "ProductID"] }, //retriving images for the product
    {
      model: RegularPrice,
      include: [{ model: Group }, { model: RegularPriceRange }],
      where: { IsActive: 1 },
    },
    {
      model: Supplier,
      attributes: [
        "SupplierName",
        "Address",
        "ID",
        "ZipCode",
        "Email",
        "Industry",
        "Vat_Tax_No",
        "ContactPersonName",
      ],
      // include:[{model: State}, {model: City}, {model: Country}],
      where: { IsActive: 1, IsApproved: 1 },
    },
  ];

  const searchArr = keyword.split(" ");
  const arr = [];
  searchArr.map((i) => arr.push({ Search: { [Op.like]: `%${i}%` } }));

  let where = {
    HasPricing: 1,
    IsActive: 1,
    IsDelete: 0,
    IsPublished: 1,
    [Op.and]: [...arr],
  };

  await ProductMaster.findAndCountAll({
    where,
    distinct: true,
    // order: [[WarehouseProducts, "ID", "DESC"]],
    include: includeOption,
  })
    .then((data) => {
      successResponse(res, req, data, "All searched products");
    })
    .catch((err) => serverError(res, req, err));
});

module.exports = router;
