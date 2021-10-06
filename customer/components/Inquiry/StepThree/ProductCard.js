import React from "react";
import { ResourceApiUrl } from "../../../utility/commonUtility";
import Image from "../../image/image";
import Overlay from "../../Shared/Overlay";
import ProductData from "../../Shared/productData";
import { Input } from "../../UI";
import PackageTypeDropdown from "../ProductCard/PackageTypeDropdown";

function ProductCard({ data, inputData, handleInputs }) {
  //console.log("data=== ", data);
  const [options, setoptions] = React.useState([
    { uom: data?.Pricings?.[0]?.ProductUom },
  ]);

  React.useEffect(() => {
    let tempArr = options;
    if (data?.Pricings?.[0]?.ProductUom == "Sheets") {
      tempArr.push({ uom: "Ries" }, { uom: "Pallete" });
    }
    // if (data?.Pricings?.[0]?.ProductUom != "kg") {
    //   tempArr.push({ uom: "Pallete" });
    // }

    if (data?.Pricings?.[0]?.ProductUom == "Rolls") {
      tempArr.push({ uom: "Carton" });
    }

    if (data?.Pricings?.[0]?.ProductUom == "Kg") {
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
          src={`${ResourceApiUrl}${data?.Product_Images[0]?.Image}`}
          alt="Card image cap"
        />
      </td>
      <td className="product_detail">
        {data?.ProductName} &nbsp;
        <Overlay heading={"360 GSM"} component={<ProductData data={data} />} />
        <div className="supply_by">
          Supplier: {data?.Supplier?.SupplierName}
        </div>
      </td>

      <td className="text-center" className="product_detail">
        {data?.Width} X {data?.Height}
      </td>
      <td className="text-center" className="product_detail">
        {data?.Paper_Gsm?.PaperGsm}
      </td>
      <td className="text-center" style={{ width: "12%" }}>
        <Input
          type="text"
          name={data.ID}
          value={inputData?.Quantity?.[data.ID] || data?.Quantity || ""}
          onChange={(e) => handleInputs?.quantity(e, data, "update")}
        />
      </td>
      <td className="text-center" style={{ width: "15%" }}>
        <PackageTypeDropdown
          options={options}
          value={inputData?.PackageType?.[data.ID] || data?.PackageType}
          handlePackageType={(value, action) =>
            handleInputs?.packageType(value, action, data, "update", "package")
          }
          name={data.ID}
        />
      </td>
      <td className="text-center actions">
        <Input
          type="date"
          className="form-control"
          name={data.ID}
          value={inputData?.ExpectedDate?.[data.ID] || data?.ExpectedDate || ""}
          onChange={(e) => handleInputs?.expectedData(e, data, "update")}
        />{" "}
      </td>
      <td className="text-center actions">
        <Input
          type="textarea"
          rows="1"
          name={data.ID}
          value={inputData?.Remarks?.[data.ID] || data?.Remarks || ""}
          onChange={(e) => handleInputs?.remark(e, data, "update")}
        />{" "}
      </td>
    </tr>
  );
}

export default ProductCard;
