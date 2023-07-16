import React from 'react';
import './Appbar.sass';
import Profile from './__components/Profile';
import { Divider, Tag } from 'antd';

class Appbar extends React.Component{
  render(){
    let { 
      version='0.1.0', 
      applicationName='' ,
      subname='',
      brand,
      leftCorner
    } = this.props;

    const logo = (
      <div className="gn-layout align-center">
        {leftCorner}
        {brand}
      </div>
    )
    return(
      <div className="gn-appbar flex-none gn-layout align-center justify-between gn-padding-N padding-left padding-right">
        {logo}        
        <Profile/>
        <Divider/>
      </div>
    )
  }
}

export default Appbar;