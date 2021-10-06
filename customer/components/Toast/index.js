import React from "react";
import { toast } from "react-toastify";
import {
  FaInfo,
  FaCheck,
  FaExclamationTriangle,
  FaBug,
  FaExclamationCircle,
} from "react-icons/fa";
import { AiOutlineShoppingCart } from "react-icons/ai";
import Image from "../image/image";

export const displayIcon = (type) => {
  switch (type) {
    case "success":
      return <FaCheck />;
    case "info":
      return <FaInfo />;
    case "error":
      return <FaExclamationCircle />;
    case "warning":
      return <FaExclamationTriangle />;
    case "dark":
      return <AiOutlineShoppingCart />;
    default:
      return <FaBug />;
  }
};

export const returnType = (type) => {
  switch (type) {
    case "success":
      return "success";
    case "info":
      return "info";
    case "error":
      return "error";
    case "warning":
      return "warning";
    case "cart":
      return "dark";
    default:
      return "default";
  }
};

const ToastMessage = ({ type, message, image, ID }) =>
  toast[returnType(type)](
    <div style={{ display: "flex", color: "white" }}>
      {image ? (
        <Image
          className="img-fluid toast-img"
          src={image}
          alt="Product Image"
        />
      ) : (
        <div
          style={{
            fontSize: 15,
            paddingTop: 8,
            flexShrink: 0,
            textAlign: "center",
            width: "30px",
          }}
        >
          {displayIcon(type)}
        </div>
      )}

      <div style={{ flexGrow: 1, fontSize: 15, padding: "8px 12px" }}>
        {message}
      </div>
    </div>, {
         toastId: ID,
         autoClose: 3000,
    }
  );

ToastMessage.dismiss = toast.dismiss;

export default ToastMessage;
