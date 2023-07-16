import React from 'react';
import * as Actions from './Actions';
import Filter from './Filter';
import './Sidebar.sass';

class Sidebar extends React.Component{
  render(){
    let { className, children } = this.props;
    return(
      <div className={`gn-sidebar gn-layout direction-column layout-fit gn-side side-width gn-padding-N padding-all ${className}`}>
        {children}
      </div>
    )
  }
}

Sidebar.Actions = Actions;
Sidebar.Filter = Filter;

export default Sidebar;