import React from 'react';
import './Header.less';
import { Logo, Sidemenu} from '..';
import { Input, Select } from 'antd';
import cookies from 'react-cookies';

class Header extends React.Component{
  constructor(){
    super();
    this.state = {
      lang: 'id'
    }
  }

  componentDidMount(){
    this.setState({lang: cookies.load('lang') || 'id'})
  }

  render(){
    let { searchKeyword, t } = this.props;
    return(
      <React.Fragment>
      <div className="utc-header">
        <div className="gn-layout align-center justify-between gn-full full-height" style={{marginLeft:"10%", marginRight:"10%"}}>
          <Logo.LogoPutih/>
          <div className="gn-layout align-center">
          <Logo.LogoPertaminaPutih/>
          </div>
        </div>
      </div>
      <div>
        {/* <Sidemenu/> */}
      </div>
      </React.Fragment>
    )
  }
}

export default Header;
