import React from 'react';
import Logo from '../Logo';
import { Tag } from 'antd';
import './Brand.less';

const Brand = ({applicationName, version, subname, inverse, logoClassName='', className='', showUtcLettermark=true}) => (
  <div className={`utc-brand gn-layout align-center ${inverse ? 'inverse' : ''} ${className}`}>
    <div>
      <a href="/" className={`gn-layout align-center ${logoClassName}`}>
        <Logo/>
        <div className="gn-margin-S margin-left">
            <div className="gn-font-size-NS app-info">
            <span className="gn-margin-XS margin-right">{applicationName}</span>
            { version ? <span>v{version}</span> : null }
          </div>
        </div>
      </a>
      {/* { showUtcLettermark ? <span className="utc-lettermark">Upstream Technical center</span> : null } */}
    </div>
    {subname ? (<Tag className="gn-margin-M margin-left">{subname}</Tag>) : null}
  </div>
)

export default Brand;
