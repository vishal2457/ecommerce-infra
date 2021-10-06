import Link from "next/link";
import React from "react";
import { Breadcrumb } from "react-bootstrap";

function CustomBeadcrumb({ breadCrumbs }) {

  return (
    <Breadcrumb>
      {breadCrumbs.length &&
        breadCrumbs.map((item, index) => {
          return (
            <Breadcrumb.Item key={index}>
              <Link href={item?.link}>{item?.name}</Link>{" "}
            </Breadcrumb.Item>
          );
        })}
    </Breadcrumb>
  );
}

export default CustomBeadcrumb;
