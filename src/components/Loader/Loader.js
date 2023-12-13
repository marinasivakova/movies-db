import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

function Loader() {
  return (
    <Spin
      fullscreen={true}
      indicator={
        <LoadingOutlined
          style={{
            fontSize: 24,
          }}
          spin
        />
      }
    />
  );
}

export default Loader;
