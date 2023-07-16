import React from 'react';
import { ResponsiveLayout } from '../../libs/gn/components';
import { SectionLabel, SectionBody } from '../Section';
import { Button } from 'antd';

class About extends React.Component{
  render(){
    const { value } = this.props;
    return(
      <div 
        id="utc-about"
        className="gn-center-container"
      >
        <ResponsiveLayout
          className="gn-padding-L padding-top padding-bottom"
          childs={[
            <div>
              <img src={value.imageSrc}/>
            </div>,
            <div className="gn-layout direction-column justify-center gn-full full-height">
              <SectionLabel label={value.label}/>
              <SectionBody
                content={value.description}
                action={ value.actionLabel && value.actionUrl ? (
                  <a href={value.actionUrl}>
                    <Button type="primary" ghost>
                      {value.actionLabel}
                    </Button>
                  </a>
                ) : null }
              />
            </div>
          ]}
        />
      </div>
    )
  }
}

export default About;