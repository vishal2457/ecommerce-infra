import React from "react";
import { ResourceApiUrl } from "../../../utility/commonUtility";
import Image from "../../image/image";
import Overlay from "../../Shared/Overlay";
import ProductData from "../../Shared/productData";
import { Input } from "../../UI";
import { dateFormatter } from "../../../utility/commonUtility";
import PackageTypeDropdown from "./PackageTypeDropdown";

function UpdateProductCard({ data, inputData, handleInputs }) {
  const { Product_Master } = data;
  const { Pricings } = Product_Master;
  const { ProductUom } = Pricings[0];

  const [options, setoptions] = React.useState([{ uom: ProductUom }]);

  React.useEffect(() => {
    let tempArr = [...options];

    if (ProductUom == "Sheets") {
      tempArr.push({ uom: "Ries" }, { uom: "Pallete" });
    }
    // if (ProductUom != "kg") {
    //   tempArr.push({ uom: "Pallete" });
    // }

    if (ProductUom == "Rolls") {
      tempArr.push({ uom: "Carton" });
    }

    if (ProductUom == "Kg") {
      tempArr.push({ uom: "Rolls" });
    }

    setoptions(tempArr);
    return () => {};
  }, []);

  return (
    <tr>
      <td className="product_img">
        <Image
          className="table_product_img"
          src={`${ResourceApiUrl}${data?.Product_Images?.Product_Images[0]?.Image}`}
          alt="Card image cap"
        />
      </td>
      <td className="product_detail">
        {Product_Master?.ProductName} &nbsp;
        <Overlay
          heading={"360 GSM"}
          component={<ProductData data={Product_Master} />}
        />
        <div className="supply_by">
          Supplier: {data?.Supplier?.SupplierName}
        </div>
      </td>

      <td className="text-center" className="product_detail">
        {Product_Master?.Width} X {Product_Master?.Height}
      </td>
      <td className="text-center" className="product_detail">
        {Product_Master?.Paper_Gsm?.PaperGsm}
      </td>
      <td className="text-center" style={{ width: "12%" }}>
        <Input
          type="text"
          name={data.ID}
          value={inputData?.Quantity || data?.Quantity || ""}
          onChange={(e) => handleInputs?.quantity(e)}
        />
      </td>
      <td className="text-center" style={{ width: "15%" }}>
        <PackageTypeDropdown
          options={options}
          value={inputData?.Unit || data?.Unit || ""}
          handlePackageType={(value) => handleInputs?.unit(value)}
          name={data.ID}
        />
      </td>
      <td className="text-center actions">
        <Input
          type="date"
          className="form-control"
          name={data.ID}
          //value={dateFormatter(inputData?.ExpectedDate, "getInIso") || dateFormatter(data?.ExpectedDate, "getInIso") || ""}
          value={
            inputData?.ExpectedDate ||
            dateFormatter(data?.ExpectedDate, "getInIso") ||
            ""
          }
          onChange={(e) => handleInputs?.expectedDate(e)}
        />{" "}
      </td>
      <td className="text-center actions">
        <Input
          type="textarea"
          rows="1"
          name={data.ID}
          value={inputData?.Remarks || data?.Remarks || ""}
          onChange={(e) => handleInputs?.remark(e)}
        />{" "}
      </td>
    </tr>
  );
}

export default UpdateProductCard;
