import React from 'react';
import './Label.less';

const Label = ({label, label2, inverse=false, className='', style={}, parent=[], showLine=true}) => (
  <div 
    className={`utc-section-label gn-margin-M margin-bottom ${inverse ? 'inverse' : ''} ${className}`}
    style={style}
  >
    <div className="label">
      { parent.map((d,i) => (
        <a 
          key={`section-label-${label}-${i}-${d.label}`}
          href={d.url}
        >
          {d.label}
        </a>
      ))}
      {label}<br/>
      {label2}
    </div>
    { showLine ? <div className="label-line"/> : null }
  </div>
) 

export default Label