import React from 'react';
import { httpService } from '../../../libs/gn';
import { message, Input, Button, Icon, Divider, Tag } from 'antd';
import { Brand } from '../../../components';
import './Login.less';
import { inject, observer } from 'mobx-react' ;
import cookies from 'react-cookies';
import env from '../../../config/environment';

class Login extends React.Component{
  constructor(){
    super();
    this.state = {
      formData: {
        username: '',
        password: ''
      },
      onProgress: false
    }
  }

  handleChange = (key, value) => {
    let { formData } = this.state;
    formData[key] = value;
    this.setState({formData});
  }

  onSubmit = async e => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({onProgress: true});
    let { formData } = this.state;
    let { onSuccess, configStore } = this.props;
    try{
      let options = httpService.generateRequestOptions(configStore.adAuthentication ? `/auth/ad` : '/auth/local');
      options.data = formData;
      let res = await httpService.post(options);
      // if(env.host !== "") cookies.save('access-token', res.data.token);
      
      if(onSuccess) onSuccess(res.data);
      else window.location =`/manage-home`;
      
    }catch(error){
      formData.password = '';
      this.setState({formData, onProgress: false});
      message.error(error.message);
    }
  }

  render(){
    let { formData, onProgress } = this.state;
    return(
      <div className="utc-account-login">
        <Brand 
          logoClassName="justify-center"
          className="gn-margin-M margin-bottom"
        />
        <Divider>
          <Tag>CMS Portal Administrator</Tag>
        </Divider>
        <form onSubmit={this.onSubmit} className="gn-padding-N padding-top">
          <div className="gn-margin-N margin-bottom">
            <Input
              placeholder="username"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              value={formData.username}
              onChange={ e => this.handleChange('username', e.target.value)}
              required disabled={onProgress}
            />
          </div>
          <div className="gn-margin-N margin-bottom">
            <Input.Password
              placeholder="password"
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              value={formData.password}
              onChange={ e => this.handleChange('password', e.target.value)}
              required disabled={onProgress}
            />
          </div>
          <Button 
            className="btn-submit"
            loading={onProgress}
            disabled={onProgress}
            htmlType="submit"
            type="primary"
            block
          > 
            Login
          </Button>
        </form>
      </div>
    )
  }
}

export default inject('configStore')(observer(Login));