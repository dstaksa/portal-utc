import React from 'react';
import './CPProfile.less';
import renderHTML from 'react-render-html';
import { inject, observer } from 'mobx-react';
import env from '../../config/environment';
import Link from "next/link";
import { SectionLabel } from '../Section';

class CPProfile extends React.Component{
  constructor(){
    super();
  }

  render(){
    let { t } = this.props;
    var judulLi = {
            fontSize:'18px',
            fontWeight:'bold',
            paddingLeft:'50px',
        };
    var textLi = {
      fontSize:'16px',
      paddingLeft:'50px',
    }
    var listItem = {
      backgroundImage: `url(${env.host + '/images/bullet-pointer.png'})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center-left',
    }
    var paddings = {
      paddingLeft:'90px',
    }
    return(
      <React.Fragment>
      <div className="content">
        <div className="text-judul"> 
          <SectionLabel 
            label={t('common:menu.cp-profil')} 
            style={{
              fontSize: '36px'
            }}
            showLine={false}
          />
        </div>
        <center>
        <hr />
        </center>
        <div className="content-field">
          <div className="content-field-left">
            <div className="mini-title">{t('common:profil.judul')}<br/>{t('common:profil.judul2')}</div>
            <ul>
              <div style={listItem}>
                <p style={judulLi}>{t('common:profil.2020')}</p>
                <p style={textLi}>{t('common:profil.desc2020')}</p>
              </div>
              <div style={listItem}>
                <p style={judulLi}>2017</p>
                <p style={textLi}>{t('common:profil.2017')}</p>
              </div>
              <div style={listItem}>
                <p style={judulLi}>2006</p>
                <ul style={paddings}>
                  <li>
                    <p> {t('common:profil.desc2006a')}</p>
                  </li>
                  <li>
                    <p> {t('common:profil.desc2006b')}</p>
                  </li>
                </ul>
              </div>
              <div style={listItem}>
                <p style={judulLi}>2003</p>
                <p style={textLi}>{t('common:profil.2003')}</p>
              </div>
              <div style={listItem}>
                <p style={judulLi}>2001</p>
                <p style={textLi}>{t('common:profil.2001')}</p>
              </div>
              <div style={listItem}>
                <p style={judulLi}>1996</p>
                <p style={textLi}>{t('common:profil.1996')}</p>
              </div>
              <div style={listItem}>
                <p style={judulLi}> &lt; 1996 < /p>
                  <p style={textLi}>{t('common:profil.seb1996')}</p>
                </div>
            </ul>
          </div>
              <div className="content-field-right">
                <div className="content-side-right">
                <a href="/profile">
                  <SectionLabel 
                  label={t('common:menu.profile').toLowerCase()}
                  showLine={false}
                  inverse={true}
                  style={{
                    textTransform: 'capitalize'
                  }}
                  />
                </a> 
                </div>
                <div className="content-side-right">
                <a href="/visimisi">
                  <SectionLabel 
                  label={t('common:menu.visimisi').toLowerCase()+(' UPSTREAM INNOVATION').toLowerCase()}
                  showLine={false}
                  inverse={true}
                  style={{
                    textTransform: 'capitalize'
                  }}
                />
                </a>
                </div>
                <div className="content-side-right">
                  <a href="/nilai">
                      <SectionLabel 
                      label={t('common:menu.nilai').toLowerCase()}
                      showLine={false}
                      inverse={true}
                      style={{
                        textTransform: 'capitalize'
                      }}
                    />
                    </a>
                </div>
                <div className="content-side-right">
                <a href="/peran">
                  <SectionLabel 
                  label={t('common:menu.peran').toLowerCase()}
                  showLine={false}
                  inverse={true}
                  style={{
                    textTransform: 'capitalize'
                  }}
                />
                </a>
                </div>
              </div>
            </div>
          </div>
      </React.Fragment>    
    )
  }
}

export default CPProfile;