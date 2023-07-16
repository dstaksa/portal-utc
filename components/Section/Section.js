import React from 'react';
import { SectionBody } from '.';
import './Section.less';

class Section extends React.Component{
  render(){
    let { headline, content, headlineCaption, action, inverse, swap, image } = this.props;

    let Body = (
      <SectionBody
        className="flex"
        {...{headline, content, headlineCaption, action, inverse}}
      />
    )

    let Image = (
      <div className="flex image">
        <img src={image}/>
      </div>
    )
    return(
      <div className={`utc-section ${swap ? 'swap' : ''}`}>
        { swap ? (
          <div className="gn-layout align-center direction-column-xs reverse">
            {Body}
            {Image}
          </div>
        ) : (
          <div className="gn-layout align-center direction-column-xs">
            {Image}
            {Body}
          </div>
        )}
      </div>
    )
  }
}

export default Section;