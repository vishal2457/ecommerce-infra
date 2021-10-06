const express = require("express");
const router = express.Router();
const file = require("../../middlewares/multer");
const XLSX = require("xlsx");
const path = require("path");
const Excel = require('exceljs');

const {
  ProductMaster,
  ProductGroup,
  ProductSubgroup,
  MeasurementUnit,
  PaperClass,
  PaperQuality,
  PaperPrintibility,
  PaperGrain,
  PaperGsm,
  PaperColor,
  RegularPrice,
  RegularPriceRange,
  Group,
  PriceLogs,
} = require("../../models");
const auth = require("../../middlewares/jwtauth");
const {
  serverError,
  successResponse,
  alreadyExist,
  notFound,
} = require("../../helpers/response");
const { rollType, UOM_TYPES, checkUnique, FILENAMES } = require("../../helpers/commonHelper");

//add new pricing
//vishal 9-1-2021
router.post("/addPricing", auth, async (req, res) => {
  const { GroupID, MinQty } = req.body.pricingForm;
  const { PricingUnit, ProductID, finalRange, rollType, ProductUom, Weight } = req.body;

  await RegularPrice.findOne({ where: { GroupID, ProductID } })
    .then(async (checkGroup) => {
      if (checkGroup)
        return alreadyExist(
          res,
          req,
          "Pricing with that Customer group already exists"
        );
      await RegularPrice.create({
        ...req.body.pricingForm,
        PricingUnit,
        ProductID,
        SupplierID: req.user.referenceID,
        createdBy: req.user.referenceID,
        MinQty,
        rollType,
        ProductUom
      }).then(async (data) => {
        for (let item of finalRange) {
          const { Price, Quantity } = item;
          await RegularPriceRange.create({
            Price,
            Quantity,
            PriceID: data.dataValues.ID,
            createdBy: req.user.referenceID,
            MinQty,
          });
        }
        await ProductMaster.update(
          { HasPricing: 1, Weight },
          { where: { ID: ProductID } }
        );
        successResponse(res, req, data, "Pricing Added");
      });
    })
    .catch((err) => serverError(res, req, err));
});

//uopdate pricing
router.post("/updatePricing", auth, async (req, res) => {
  let { MinQty, PackagingUnitRies, PackagingUnitPallete } = req.body.pricingForm;
  let { PricingUnit, ProductID, finalRange, PricingID, rollType, ProductUom, Weight } = req.body;
  if(ProductUom == "Rolls") {
  
    if(rollType == "kg") {
      // console.log(ProductUom, "productuom");
      PackagingUnitRies = null
      PackagingUnitPallete =null
    }else{
      PackagingUnitRies= null
    }
  }

  await RegularPrice.update(
    {
      ...req.body.pricingForm,
      IsActive: req.body.pricingForm.IsActive ? 1 : 0,
      PackagingUnitRies,
      PackagingUnitPallete,
      PricingUnit,
      ProductID,
      updatedBy: req.user.referenceID,
      rollType,
      ProductUom
    },
    { where: { ID: PricingID } }
  )
    .then(async (data) => {
      if (data) {
        RegularPriceRange.destroy({ where: { PriceID: PricingID } }).then(
          async (deleteSuccess) => {
            for (let item of finalRange) {

              const { Price, Quantity } = item;
              await RegularPriceRange.create({
                Price,
                Quantity,
                PriceID: PricingID,
                createdBy: req.user.referenceID,
                MinQty,
              });
            }
            
            await ProductMaster.update(
              { HasPricing: 1, Weight },
              { where: { ID: ProductID } }
            );
            successResponse(
              res,
              req,
              deleteSuccess,
              "Pricing Updated Successfully"
            );
          }
        );
      }
    })
    .catch((err) => serverError(res, req, err));
});

/**
 * @getPricingObj for patch pricing obj or new obj
 * @param {Array} arr arr has single value of selected customer group
 * @param {Obj} selectedGroup selected customer group
 * @returns pricing obj
 */
 const getPricingObj = (arr, selectedGroup) => {
  if (arr.length) {
    //product has already pricing
    const obj = arr[0];
    return {
      rollType: obj.rollType || "rolls",
      CustomerGroupID: selectedGroup.id,
      CustomerGroupName: selectedGroup.name,
      MinimumOrderQuantity: obj.MinQty,
      SheetsPerRies: obj.PackagingUnitRies,
      SheetsPerPallete:
        obj.ProductUom == UOM_TYPES.sheets
          ? obj.PackagingUnitPallete
          : null,
      RollsPerCarton:
        obj.ProductUom == UOM_TYPES.sheets
          ? null
          : obj.PackagingUnitPallete,
      PricingUnit: obj.PricingUnit,
      QuantityRange1: 1, //range start from 1
      PriceRange1: obj.Price_Ranges[0].Price,
      QuantityRange2: obj.Price_Ranges[1].Quantity,
      PriceRange2: obj.Price_Ranges[1].Price,
      QuantityRange3: obj.Price_Ranges[2].Quantity,
      PriceRange3: obj.Price_Ranges[2].Price,
      QuantityRange4: obj.Price_Ranges[3].Quantity,
      PriceRange4: obj.Price_Ranges[3].Price,
      QuantityRange5: obj.Price_Ranges[4].Quantity,
      PriceRange5: obj.Price_Ranges[4].Price,
    };
  } else  //product has NO pricing
    return {
      rollType: "rolls",
      CustomerGroupID: selectedGroup.id,
      CustomerGroupName: selectedGroup.name,
      MinimumOrderQuantity: "",      
      SheetsPerRies: "",
      SheetsPerPallete: "",
      RollsPerCarton: "",
      PricingUnit: "",
      QuantityRange1: 1, //range start from 1
      PriceRange1: "",
      QuantityRange2: "",
      PriceRange2: "",
      QuantityRange3: "",
      PriceRange3: "",
      QuantityRange4: "",
      PriceRange4: "",
      QuantityRange5: "",
      PriceRange5: "",
    }; 
};



// get products for excel
// params @selectedGroup selected customer group(req.body)

// API with XLSX package (not getting copy sheet)
router.post("/exportProducts_bk", auth, async(req, res) => {
  const selectedGroup = req.body; //selected customer groups

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
    { model: PaperGsm, attributes: ["PaperGsm", "ID"] },
    { model: PaperQuality, attributes: ["PaperQuality", "ID"] },
    {
      model: PaperPrintibility,
      attributes: ["PaperPrintibility", "ID"],
    },
    { model: MeasurementUnit, attributes: ["MeasurementUnit", "ID"] },
    {
      model: RegularPrice,
      required: false,  //left join
      where: { GroupID: selectedGroup.id },  //@selectedGroup
      include: [{ model: RegularPriceRange }],
    },
  ];

  let modelOption = [
    { SupplierID: req.user.referenceID, IsDelete: 0 },
  ];

  let attributes = [
    "ProductNo",
    "ProductName",
    "SupplierID",
    "ProductDescription",
    "PaymentTerms",
    "DeliveryTerms",
    "GroupID",
    "SubGroupID",
    "PaperClassID",
    "PaperQualityID",
    "UomID",
    "Thickness",
    "Width",
    "Height",
    "Weight",
    "ID",
  ];

  await ProductMaster.findAll({
    where: modelOption ? modelOption : { IsDelete: 0, IsActive: 1 },
    include: includeOption,
    attributes,
    order: [["ID", "DESC"]],
  })
  .then(async result => {
    const constantFilePath = `../../public/excelFormats/${FILENAMES.pricing}`;
    const filepath = path.join(__dirname, constantFilePath);
    let arr = [];
    let index = 0;
    while (index < result.length) {
      //all products loop with selected customer group pricing(if saved)
      const item = result[index];
      let newItem = {
        ID: item.ID,
        ProductNo: item.ProductNo,
        ProductName: item.ProductName,
        ProductGroup: item.Product_Group.ProductGroup,
        ProductSubGroup: item.Product_Subgroup.ProductSubgroup,
        Gsm: item.Paper_Gsm.PaperGsm,
        Paper_Quality: item.Paper_Quality.PaperQuality,
        Paper_Color: item.Paper_Color.PaperColor,
        Paper_Class: item.Paper_Class.PaperClass,
        Paper_Printibility: item.Paper_Printibility.PaperPrintibility,
        Length: item.Height,
        Width: item.Width,
        Weight: item.Weight,
        Measurement_Unit: item.Measurement_Unit.MeasurementUnit,
        ...getPricingObj(item.Pricings, selectedGroup)
      };
      arr.push(newItem);

      index++;
    }
      
    //START XLSX
      // const newWB = XLSX.utils.book_new();

      // const newWS = XLSX.utils.json_to_sheet(arr);
        
      // XLSX.utils.book_append_sheet(newWB, newWS, `${selectedGroup.name}`);
        
      // // Writing to our file
      // XLSX.writeFile(newWB, filepath);  
    //END XLSX


        successResponse(res, req, FILENAMES.pricing, "Pricing Written in Server File");
      })
      .catch(err => serverError(res, req, err));
})




// API with exceljs package (getting copy sheet)
router.post("/exportProducts", auth, async(req, res) => {
  const selectedGroup = req.body; //selected customer groups

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
    { model: PaperGsm, attributes: ["PaperGsm", "ID"] },
    { model: PaperQuality, attributes: ["PaperQuality", "ID"] },
    {
      model: PaperPrintibility,
      attributes: ["PaperPrintibility", "ID"],
    },
    { model: MeasurementUnit, attributes: ["MeasurementUnit", "ID"] },
    {
      model: RegularPrice,
      required: false,  //left join
      where: { GroupID: selectedGroup.id },  //@selectedGroup
      include: [{ model: RegularPriceRange }],
    },
  ];

  let modelOption = [
    { SupplierID: req.user.referenceID, IsDelete: 0 },
  ];

  let attributes = [
    "ProductNo",
    "ProductName",
    "SupplierID",
    "ProductDescription",
    "PaymentTerms",
    "DeliveryTerms",
    "GroupID",
    "SubGroupID",
    "PaperClassID",
    "PaperQualityID",
    "UomID",
    "Thickness",
    "Width",
    "Height",
    "Weight",
    "ID",
  ];

  await ProductMaster.findAll({
    where: modelOption ? modelOption : { IsDelete: 0, IsActive: 1 },
    include: includeOption,
    attributes,
    order: [["ID", "DESC"]],
  })
  .then(async result => {
   
    const filepath = path.join(__dirname, `../../public/excelFormats/${FILENAMES.pricing}`);
    const filepathcopy = path.join(__dirname, `../../public/excelFormats/${FILENAMES.pricingCopy}`);


    // exceljs config
    let workbook = new Excel.Workbook();

    await workbook.xlsx.readFile(filepath).then((sheet) => {
  
      let worksheet = sheet.getWorksheet(sheet.worksheets[0].name); //single sheet
  
      let index = 0;
  
      while (index < result.length) { 
        //all products loop with selected customer group pricing(if saved)
        const item = result[index];
        let newItem = {
          ID: item.ID,
          ProductNo: item.ProductNo,
          ProductName: item.ProductName,
          ProductGroup: item.Product_Group.ProductGroup,
          ProductSubGroup: item.Product_Subgroup.ProductSubgroup,
          Gsm: item.Paper_Gsm.PaperGsm,
          Paper_Quality: item.Paper_Quality.PaperQuality,
          Paper_Color: item.Paper_Color.PaperColor,
          Paper_Class: item.Paper_Class.PaperClass,
          Paper_Printibility: item.Paper_Printibility.PaperPrintibility,
          Length: item.Height,
          Width: item.Width,
          Weight: item.Weight,
          Measurement_Unit: item.Measurement_Unit.MeasurementUnit,
          ...getPricingObj(item.Pricings, selectedGroup)
        };
  
        let row = worksheet.getRow(index + 2);  //if we have set header(format file)then start with cell 2
        row.values = Object.values(newItem);  // pass only values (basicaly we r updating row)
        row.commit(); //save row 
  
        index++;
      }
  
      workbook.xlsx.writeFile(filepathcopy);  //write copy file 
  
      successResponse(res, req, FILENAMES.pricingCopy, "Pricing Written in Server File");
    }).catch(() => notFound(res, req, `${FILENAMES.pricing} file not found`));
  })
  .catch(err => serverError(res, req, err));
})



// API with file saveAs react side
router.get("/exportProducts_bk/:id", auth, async(req, res) => {
  // console.log("id == ", req.params.id);
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
    { model: PaperGsm, attributes: ["PaperGsm", "ID"] },
    { model: PaperQuality, attributes: ["PaperQuality", "ID"] },
    {
      model: PaperPrintibility,
      attributes: ["PaperPrintibility", "ID"],
    },
    { model: MeasurementUnit, attributes: ["MeasurementUnit", "ID"] },
    {
      model: RegularPrice,
      required: false,  //left join
      where: { GroupID: req.params.id },  //@id
      include: [{ model: RegularPriceRange }],
    },
  ];

  let modelOption = [
    { SupplierID: req.user.referenceID, IsDelete: 0 },
  ];

  let attributes = [
    "ProductNo",
    "ProductName",
    "SupplierID",
    "ProductDescription",
    "PaymentTerms",
    "DeliveryTerms",
    "GroupID",
    "SubGroupID",
    "PaperClassID",
    "PaperQualityID",
    "UomID",
    "Thickness",
    "Width",
    "Height",
    "Weight",
    "ID",
  ];

  await ProductMaster.findAll({
    where: modelOption ? modelOption : { IsDelete: 0, IsActive: 1 },
    include: includeOption,
    attributes,
    order: [["ID", "DESC"]],
  })
  .then(async result => {
    // await Group.findAll({
    //   where: { SupplierID: req.user.referenceID, IsActive: 1, IsDelete: 0 },
    //   attributes: ["ID", "GroupName", "GroupDescription"]
    // })
    // .then(customerGroups => {
    //   successResponse(res, req, { customerGroups, result}, "Product List and Customer Groups");
    // })

    successResponse(res, req, { result }, "Product List");
   
  })
})


/**
 * @getPriceRangeArr helper fun to get arr of range 
 * @returns price-range-arr
 */
const getPriceRangeArr = (PriceID, item) => {
  const ranges = [];  // we set limit of 5 price-range-items
  item.QuantityRange1 && item.PriceRange1 
  ? ranges.push({ PriceID, Quantity: item.QuantityRange1, Price: item.PriceRange1, MinQty: item.MinimumOrderQuantity }) : null;

  item.QuantityRange2 && item.PriceRange2 
  ? ranges.push({ PriceID, Quantity: item.QuantityRange2, Price: item.PriceRange2, MinQty: item.MinimumOrderQuantity }) : null;

  item.QuantityRange3 && item.PriceRange3 
  ? ranges.push({ PriceID, Quantity: item.QuantityRange3, Price: item.PriceRange3, MinQty: item.MinimumOrderQuantity }) : null;

  item.QuantityRange4 && item.PriceRange4 
  ? ranges.push({ PriceID, Quantity: item.QuantityRange4, Price: item.PriceRange4, MinQty: item.MinimumOrderQuantity }) : null;

  item.QuantityRange5 && item.PriceRange5 
  ? ranges.push({ PriceID, Quantity: item.QuantityRange5, Price: item.PriceRange5, MinQty: item.MinimumOrderQuantity }) : null;
  return ranges;
}

/**
 * @checkValueUpdate check value updated or not
 * @param {object} result db record
 * @param {object} item sheet record
 * @returns {boolean}
 */
const checkValueUpdate = (result, item) => {

  if(item.Measurement_Unit == UOM_TYPES.sheets){  // sheet product
    if(result.MinQty != item.MinimumOrderQuantity || result.PricingUnit != item.PricingUnit || result.PackagingUnitPallete != item.SheetsPerPallete || result.PackagingUnitRies != item.SheetsPerRies){
      return true
    }
  } else if(item.rollType == rollType.rolls){ //roll product with roll type
    if(result.MinQty != item.MinimumOrderQuantity || result.PricingUnit != item.PricingUnit || result.PackagingUnitPallete != item.RollsPerCarton){
      return true
    }
  } else {  //roll product with kg type
    if(result.MinQty != item.MinimumOrderQuantity || result.PricingUnit != item.PricingUnit){
      return true
    }
  }
  return false; //if no change in values
}

/**
 * @add product pricing import
 */
 router.post(
  "/addProductPricing",
  auth,
  file.fileUpload.single("excelFile"),
  async (req, res) => {
    try {
      let added = 0;
      let updated = 0;
      let SupplierID = req.user.referenceID;
      var workbook = XLSX.readFile(
        path.join(__dirname, `../../public/excelFiles/${req.file.filename}`)
      );
      var sheet_name_list = workbook.SheetNames;
      var xlData = XLSX.utils.sheet_to_json(
        workbook.Sheets[sheet_name_list[0]]
      );
      
      let index = 0;
      while(index < xlData.length){
        const item = xlData[index];
        RegularPrice.findOne({
          where: { GroupID: item.CustomerGroupID, ProductID: item.ID, IsActive: 1, IsDelete: 0 },
          raw: true,
        }).then(async (result) => {
          if(result){

            const ranges = getPriceRangeArr(result.ID, item);  // get the range-arr

            if(ranges.length){  // need atleast one range
              let obj = {
                ProductUom: item.Measurement_Unit,
                MinQty: item.MinimumOrderQuantity,
                PricingUnit: item.PricingUnit,
                rollType: item.rollType,
                updatedBy: SupplierID,
              }

              if(checkValueUpdate(result, item)) { // count plus if return TRUE
                updated++; 
                console.log("updated == ", updated);
              }
  
              obj = item.Measurement_Unit == UOM_TYPES.sheets 
              ? { ...obj, PackagingUnitPallete: item.SheetsPerPallete, PackagingUnitRies: item.SheetsPerRies } 
              : item.rollType == rollType.rolls ? { ...obj, PackagingUnitPallete: item.RollsPerCarton } : obj;
  
              await RegularPrice.update( // update the pricing record if already have
                obj,
                { where: { ID: result.ID } }
              );
              await RegularPriceRange.destroy({ where: { PriceID: result.ID } }); //delete all price-ranges of the priceID permanently
    
              
              await RegularPriceRange.bulkCreate(ranges);  // add new price-ranges from excel

            }
           
          } else {

            const checkRange = getPriceRangeArr(null, item);  // get the range-arr
            if(checkRange.length) { // need atleast one range
              let obj2 = {
                ProductID: item.ID,
                ProductUom: item.Measurement_Unit,
                MinQty: item.MinimumOrderQuantity,
                PricingUnit: item.PricingUnit,
                rollType: item.rollType,
                GroupID: item.CustomerGroupID,
                createdBy: SupplierID,
              }

              obj2 = item.Measurement_Unit == UOM_TYPES.sheets 
              ? { ...obj2, PackagingUnitPallete: item.SheetsPerPallete, PackagingUnitRies: item.SheetsPerRies } 
              : item.rollType == rollType.rolls ? { ...obj2, PackagingUnitPallete: item.RollsPerCarton } : obj2;

              await RegularPrice.create(obj2) //  add record if doesnt have  
              .then(async data => {
                const ranges = getPriceRangeArr(data.ID, item);     
                await RegularPriceRange.bulkCreate(ranges);  // add new price-ranges from excel
                added++;
                console.log("Added == ", added);

                await ProductMaster.update({ HasPricing: 1 }, { where: { ID: item.ID } });  // update HasPricing flag of product master
              });            
            }
          }
          
        });
        
        index++;
      }

      //add price-logs
      await PriceLogs.create({ SupplierID, UpdatedProducts: updated, AddedProducts: added, createdBy: SupplierID })
        .then(resultLog => successResponse(res, req, resultLog, "pricing added"))
        .catch(err => serverError(res, req, err));
      
    } catch (error) {
      serverError(res, req, error)
    }
    
  }
);

module.exports = router;
