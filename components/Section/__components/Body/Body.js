import React from 'react';
import './Body.less';
import renderHTML from 'react-render-html';

const Body = ({className='', headline='', headlineCaption='', subHeadline='', content='', action, inverse=false}) => (
  <div className={`utc-section-body ${className} ${inverse ? 'inverse' : ''}`}>
    {headline ? 
      <div className="gn-margin-N margin-bottom">
        <div className="headline">{renderHTML(headline)}</div>
        {headlineCaption ? <div className="headline-caption">{renderHTML(headlineCaption)}</div> : null}
      </div> 
    : null}
    {subHeadline ? <div className="sub-headline gn-margin-N margin-bottom">{subHeadline}</div> : null}
    {content ? <div className="content">{content}</div> : null}
    {action ? <div className="action">{action}</div> : null}
  </div>
) 

export default Body;