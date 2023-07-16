import React from 'react';
import { Button, Icon } from 'antd';

export const Add = ({onClick}) => (
  <div className="flex-none">
    <Button 
      type="primary"
      block
      onClick={onClick}
    >
      <Icon type="plus"/>
      Tambah
    </Button>
  </div>
)