import React from 'react';
import { Alert, Space } from 'antd';
const ErrorHandler = ({e}) => (
  <Space
    direction="vertical"
    style={{
      width: '100%',
    }}
  >
    <Alert
      message= {e.message}
      description={e.code}
      type="error"
    />
  </Space>)
;
export default ErrorHandler;

ErrorHandler.defaultProps = {
    e: {
        message: "Error",
        code: "Message for error"
    }

}