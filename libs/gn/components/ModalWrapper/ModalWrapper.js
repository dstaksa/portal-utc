import React from 'react';
import { Modal } from 'antd';

class ModalWrapper extends React.Component{
  render(){
    const { children, ...modalProps } = this.props;
    return(
      <Modal {...modalProps}>{children}</Modal>
    )
  }
}

export default ModalWrapper;