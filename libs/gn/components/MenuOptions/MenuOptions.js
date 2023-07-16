import React from 'react';
import { Menu, Icon, Divider, Spin } from 'antd';
import './MenuOptions.sass';

class menuItem{
  constructor(iconType, label, path, show=() => (true)){
    this.iconType = iconType;
    this.label = label;
    this.path = path;
    this.show = show;
  }
}

class MenuOptions extends React.Component{
  constructor(){
    super();
    this.state = {
      defaultSelectedKeys: [],
      isReady: false
    }
  }

  componentDidMount(){
    this.setState({
      defaultSelectedKeys: window.location.pathname,
      isReady: true
    })
  }

  render(){
    let { router, className, menuItems=[], headerElement, ...menuProps} = this.props;
    
    let menu = (
      <Menu
        {...menuProps}
        className="gn-full full-height full-width"
        defaultSelectedKeys={this.state.defaultSelectedKeys}
      >{menuItems.map((m, mi) => (m.show() ? (
        <Menu.Item 
          key={m.path}
          onClick={() => window.location = m.path }
        >
          <Icon type={m.iconType}/>
          <span>{m.label}</span>
        </Menu.Item>
      ):null))}
      </Menu>
    )
    return(
      <div className={`gn-menu-options gn-layout direction-column ${className}`}>
        {headerElement ? (
          <div className="gn-position">
            {headerElement}
            <Divider className="border-right" type="vertical"/>
          </div>
        ) : null}
        { this.state.isReady ? menu : (
          <div className="gn-padding-N padding-all gn-text-align-LEFT">
            <Spin/>
          </div>
        )}
      </div>
    )
  }
}

MenuOptions.menuItem = menuItem;

export default MenuOptions;