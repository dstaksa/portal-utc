import React, { useState } from 'react'
import './Sidemenu.less';
import * as AiIcon from 'antd';
import { Logo } from '..';
// import { render } from 'node-sass';
// import Sidemenu from '.';
// import { Menu, Switch } from 'antd';
// import { AiOutlineAlignRight, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';
                                                                          


const Sidebardata = [
  {
    title: 'home',
    path: '/',
    icon: <AiIcon.Icon type="home" className="nav-icon" theme='filled' />,
    Name: 'nav-text',
  },
  {
    title: 'company',
    path: '/cp-profile',
    icon: <AiIcon.Icon type="info-circle" className="nav-icon" theme='outlined' />,
    Name: 'nav-text',
  },
  {
    title: 'serviceCatalogue',
    path: '/page-service',
    icon: <AiIcon.Icon type="book" className="nav-icon" theme='filled' />,
    Name: 'nav-text',
  },
  
  {
    title: 'newsUpdate',
    path: '/articles',
    icon: <AiIcon.Icon type="read" className="nav-icon" theme='filled' />,
    Name: 'nav-text',
  },

  {
    title: 'newsPhe',
    path: '/articlesPhe',
    icon: <AiIcon.Icon type="like" className="nav-icon" theme='filled' />,
    Name: 'nav-text',
  },

  {
    title: 'ourPartner',
    path: '/page-partner',
    icon: <AiIcon.Icon type="team" className="nav-icon" theme='outlined' />,
    Name: 'nav-text',
  },

  {
    title: 'event',
    path: '/page-event',
    icon: <AiIcon.Icon type ="calendar" className="nav-icon" theme='filled' />,
    Name: 'nav-text',
  },

  {
    title: 'contact',
    path: '/page-contact',
    icon: <AiIcon.Icon type ="contacts" className="nav-icon" theme='filled' />,
    Name: 'nav-text',
  },

  {
    title: 'AMS',
    path: '/account-login',
    icon: <AiIcon.Icon type ="arrow-left" className="nav-icon" theme='outlined' />,
    Name: 'li2',
  },


  ]


class Sidemenu extends React.Component{
  constructor () {
      super();
      this.state = {
        active:false
      }
  }
  toggleClass = ()=> {
      const currentState = this.state.active;
      this.setState({ active: !currentState });
    };
  render(){
    
    let { t } = this.props;
    // activated ? this.toggleClass : null;
    return(
      <React.Fragment>
      {/* <AiOutlineAlignRight/>  */}
      {/* <div> */}
        <AiIcon.Icon type="menu" style={{fontSize:'20px',color:'white'}} id="btn"
        onClick={this.toggleClass}/>
      {/* </div> */}
      <div className={this.state.active ? 'sidebar active': 'sidebar'} > 
      <ul>
        <li>
        <AiIcon.Icon type="close" id="btn"
      onClick={this.toggleClass}/>
        </li>
      {Sidebardata.map((item, index) => {
        return(
          <li 
          key={index} className={item.Name}>
            <a href={item.path}>
              {item.icon}
              <span>{t('common:menu.'+item.title)}</span>
            </a>
          </li>
        )})}
          <center> <Logo.LogoHulu style={{marginBottom:'10%',marginTop:'10%'}}/> </center>
        </ul>
        {/* <div
        style={{ padding:"100px",


        }}> */}
        </div>
       
      {/* </div> */}
      </React.Fragment>
    )
  }
}

export default Sidemenu;