import React from 'react';
import './Logo.sass';

const logoUiPutih = '/images/ui-putih.png';
const logoUiBiru = '/images/ui-biru.png';
const logoLm = '/images/logo-lm.png';
const logoPm = '/images/logo-pm.png';
const LogoP ='/images/pertamina-putih.png';
const LogoPhe='/images/logo-phe.png';

const Logo = ({pictureMarkOnly}) => (
  <div className="utc-logo utc-layout aliutc-center">
    <PictureMark className="utc-margin-N margin-right"/>
    <LetterMark/>
  </div>
)

const PictureMark = ({style, className=''}) => (
  <div className={`utc-logo utc-logo-picture-mark ${className}`}>
    <a href="/">
      <img src={logoPm} alt="presentation" style={style}/>
    </a>
  </div>
)
const LogoBiru = () => (
  <div className={`utc-logo utc-logo-putih-biru`}>
    <a href="/">
      <img src={logoUiBiru}/>
    </a>
  </div>
)

const LogoPutih = () => (
  <div className={`utc-logo utc-logo-putih-biru`}>
    <a href="/">
    <img src={logoUiPutih}/>
    </a>
  </div>
)

const LogoPertaminaPutih = () => (
  <div className={`utc-logo utc-logo-pertamina`}>
    <a href="/">
    <img src={LogoP}/>
    </a>
  </div>
)

const LetterMark = ({style, className=''}) => (
  <div className={`utc-logo utc-logo-letter-mark ${className}`}>
    <a href="/">
    <img src={logoLm} alt="presentation" style={style}/>
    </a>
  </div>
) 

const LogoHulu = ({style, className=''}) => (
  <div className={`utc-logo utc-logo-hulu ${className}`}>
    <a href="/">
    <img src={LogoPhe} alt="presentation" style={style}/>
    </a>
  </div>
)

Logo.LogoBiru = LogoBiru;
Logo.LogoPutih = LogoPutih;
Logo.PictureMark = PictureMark;
Logo.LetterMark = LetterMark;
Logo.LogoPertaminaPutih = LogoPertaminaPutih;
Logo.LogoHulu = LogoHulu;

export default Logo;