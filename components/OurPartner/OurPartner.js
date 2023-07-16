import React from 'react';
import { SectionLabel, SectionBody } from '../Section';
import { ResponsiveLayout } from '../../libs/gn/components';
import './OurPartner.less';
import Swiper from 'react-id-swiper';

const swiperParams = {
  autoplay: {
    delay: 2000,
    disableOnInteraction: false
  },
  pagination: {
    el: '.swiper-pagination',
    type: 'bullets',
    clickable: true
  },
  navigation: null,
  navigation: {
    nextEl: '.swiper-button-next-custom',
    prevEl: '.swiper-button-prev-custom'
  },
  slidesPerView: '3',
  spaceBetween: 24,
  renderPagination: false
}

class OurPartner extends React.Component{
  render(){
    let { value=[], staticHost='', t } = this.props;
    return(
      <div 
        id="utc-our-partner"
        className="utc-our-partner gn-padding-L padding-top padding-bottom"
      >
        <div className="gn-center-container">
          <SectionLabel 
            style={{textAlign: 'center'}} 
            label="Our Partner"
          />
          <ResponsiveLayout
            className="gn-padding-M padding-top align-center"
            childs={[
              <SectionBody
                subHeadline={t('common:partner.headline')}
              />
            ]}
          />
          <div className="partner-item-container gn-position position-relative">
                <div className="gn-position position-absolute gn-full full-width full-height">
                  <Swiper
                    {...swiperParams}
                  >
                    {value.map( d => (
                      <div 
                        className="partner-item"
                        key={`partner-item-${d.id}`}
                      >
                      <img src={`${staticHost}/${d.image}`} alt={d.name}/>
                      </div>
                    ))}
                  </Swiper>
                </div>
              </div>
        </div>
      </div>
    )
  }
}


export default OurPartner;