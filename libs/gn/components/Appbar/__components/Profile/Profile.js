import React from 'react';
import { Spin, Button, Dropdown, Menu, Icon, Modal } from 'antd';
import { inject, observer } from 'mobx-react';
import './Profile.sass';
import _ from 'lodash';
import ProfileDetails from './__components/ProfileDetails';
import ChangePassword from './__components/ChangePassword';
import cookies from 'react-cookies';

class Profile extends React.Component{
  constructor(){
    super();
    this.state = {
      showProfileDetails: false,
      showChangePassword: false
    }
  }

  render(){
    let { authStore, configStore } = this.props;
    const menus = (
      <Menu>
        {configStore.adAuthentication ? null : (
          <Menu.Item
            onClick={() => this.setState({showProfileDetails: true})}
          >
            <Icon type="user" />
            Profil
          </Menu.Item>
        )}
        {configStore.adAuthentication ? null : (
          <Menu.Item
            onClick={() => this.setState({showChangePassword: true})}
          >
            <Icon type="lock" />
            Ubah Password
          </Menu.Item>
        )}
        <Menu.Item
          onClick={() => {
            Modal.confirm({
              title: 'Keluar',
              content: 'Yakin ingin keluar?',
              okText: 'Ya',
              cancelText: 'Tidak',
              onOk:() => {
                cookies.remove('access-token');
                window.open('/account-login', '_self');
              }
            });
          }}
        >
          <Icon type="logout" />
          Keluar
        </Menu.Item>
      </Menu>
    )
    return( 
      <div>
        {authStore.user ? (
          <Dropdown
            overlay={menus}
          >
            <Button 
              size="large"
              shape="round"
              className="gn-appbar-profile"
            >
              <div className="gn-layout align-center">
                <div className="gn-font-size-N">{configStore.adAuthentication ? authStore.user.user.LONGNAME : authStore.user.name}</div>
              </div>
            </Button>
          </Dropdown>
        ) : (
          <Spin/>
        )}
        <ProfileDetails
          visible={this.state.showProfileDetails}
          onCancel={() => this.setState({showProfileDetails: false})}
        />
        <ChangePassword
          visible={this.state.showChangePassword}
          onCancel={() => this.setState({showChangePassword: false})}
        />
      </div>
    )
  }
}

export default inject('authStore', 'configStore')(observer(Profile));