
import React from 'react';
import './Footbar.less';
import { Logo } from '..';
import renderHTML from 'react-render-html';
import { inject, observer } from 'mobx-react';

class Footbar extends React.Component{
  constructor(){
    super();
    this.state = {
      h: 0
    }
  }

  componentDidMount(){
    let elem = document.getElementById('utc-footbar');
    console.log(elem.clientHeight)
    this.setState({
      h: elem.clientHeight
    })
  }

  render(){
    let { h } = this.state;
    const Info = (
      <div style={{zIndex:1}}>
        <Logo.LogoPertaminaPutih/>
        <p className="gn-margin-M margin-top margin-bottom">
          <p style={{fontSize:"20px", fontWeight:"bold"}}>UPSTREAM INNOVATION</p>
          {renderHTML(this.props.configStore.contact.address)}
        </p>
        <p 
          className="gn-font-size-S"
          style={{opacity: .2}}
        >
          © 2019 PT. PERTAMINA (PERSERO) 2019 | ALL RIGHTS RESERVED.
        </p>
      </div>
    )
    return(
      <div id="utc-footbar" className="utc-footbar gn-padding-L padding-top padding-bottom"  style={{maxWidth:'100%',overflowX:'hidden'}}>
        <div className="gn-layout align-center flex justify-between gn-full full-height" style={{marginLeft:"10%", marginRight:"10%"}}>
          {Info}
        </div>
        <div className="acc">
          <div className="box"/>
          <div 
            className="triangle-primary"
            style={{
              borderWidth: `0 0 ${h}px ${h}px` 
            }}  
          />
          <div 
            className="triangle-theme"
            style={{
              borderWidth: `${h}px 0 0 ${h}px` 
            }}  
          />
        </div>
      </div>
    )
  }
}

export default inject('configStore')(observer(Footbar));