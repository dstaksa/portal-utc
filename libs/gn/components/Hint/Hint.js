import React from 'react';
import './Hint.sass';
import { Card } from 'antd';

class Hint extends React.Component{
  render(){
    const { children, text, className, style={}} = this.props;
    return(
      <Card 
        className={`gn-hint gn-padding-S padding-all ${className}`}
        style={style}
        bodyStyle={{padding: 0}}
      >
        {children ? children : (
          <div className="gn-font-size-NS text">{text}</div>
        )}
      </Card>
    )
  }
}

export default Hint;