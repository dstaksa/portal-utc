import React from 'react';
import './Navbar.less';
import * as scroll from 'react-scroll';
import { httpService } from '../../libs/gn';
import '../Sidemenu/Sidemenu.less';
import Sidemenu from '../Sidemenu';
import * as AiIcon from 'antd';
import cookies from 'react-cookies';
// import { Helmet } from "react-helmet";  

const scroller = scroll.animateScroll;

class Navbar extends React.Component{
  constructor(){
    super();
    this.state = {
      currentMenu: 'Home'
    }
  }

  scrollTo = (target) => {
    let elem = document.getElementById(target);
    if(elem){
      scroller.scrollTo(elem.offsetTop - 48, {
        smooth: true
      });
    }
  }
  componentDidMount(){
    this.setState({lang: cookies.load('lang') || 'id'})
  }
  render(){
    let { searchKeyword, t } = this.props;
    return (
      <React.Fragment>
      <div className="utc-navbar">
        <div className="gn-layout align-center justify-between gn-full full-height" style={{marginLeft:"10%", marginRight:"10%"}}>
            <div className="search">
              <AiIcon.Input.Search 
              style={{width:"190px"}}
                className="gn-margin-S margin-left"
                defaultValue={searchKeyword}
                placeholder={t('common:other.searchArticle')}
                onSearch={ value => {
                    window.location = value ? `/articles?page=1&keyword=${value}` : `/articles`;
                }}
              /> 
              <AiIcon.Select
              style={{width:"58px"
              }}
                value={this.state.lang}
                onChange={value => {
                  cookies.save('lang', value);
                  document.location.reload()
                  
                }}
              >
                <AiIcon.Select.Option value="id">ID</AiIcon.Select.Option>
                <AiIcon.Select.Option value="en">EN</AiIcon.Select.Option>
              </AiIcon.Select>
            </div>
            <div className='gn-left-container align-center'>
              <Sidemenu t={t}/>
            </div>
        </div>
      </div>
      </React.Fragment>
    )
  }
}

export default Navbar;
