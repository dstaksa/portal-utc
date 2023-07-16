import React, { useState } from 'react';
import { Icon, Button } from 'antd';
import './Banner.less';
import { SectionLabel, SectionBody } from '../Section';
import Swiper from 'react-id-swiper';

const slideDuration = 6000;
const slideSpeed = 1000;
const swiperParams = {
  autoplay: {
    delay: 9000,
    disableOnInteraction: false
  },
  pagination: {
    el: '.swiper-pagination'
  },
  navigation: {
    nextEl: '.swiper-button-next-custom',
    prevEl: '.swiper-button-prev-custom'
  },
  slidesPerView: '1',
  spaceBetween: 0,
  renderPagination: false
}

class Banner extends React.Component{
  constructor(){
    super();
    this.swiper = null;
    this.state = {
      swiperIndex: 0
    }
  }

  getSwiper = swiper => {
    this.swiper = swiper;
  }

  goNext = () => {
    if (this.swiper) {
      this.swiper.slideNext(slideSpeed)
      let { swiperIndex } = this.state;
      if(swiperIndex < this.props.banner.length - 1){
        swiperIndex++;
        this.setState({swiperIndex});
      }
    }
  }

  goPrev = () => {
    if (this.swiper) {
      this.swiper.slidePrev(slideSpeed);
      let { swiperIndex } = this.state;
      if(swiperIndex > 0){
        swiperIndex--;
        this.setState({swiperIndex});
      }
    }
  }

  render(){
    const { about, banner, staticHost } = this.props;
    const bg = (
      <div 
        id="utc-banner"
        className="bg content gn-layout justify-between direction-column-xs"
      >
        <div className="bg-banner flex gn-position-relative">
            { banner.map( (d,i) => (
              (i==0)?(<div className="gn-full full-height" key={`banner-${d.id}`}>
                <img src={`${staticHost}/${d.image}`}/>
                <div className="content-banner gn-layout direction-column justify-end gn-full full-height" style={{paddingBottom:'2%'}}>
                  <h1>
                    <span>{d.title}</span>
                  </h1>
                  <SectionBody
                    subHeadline={d.description}
                  />
                </div>
              </div>):null
            ))}
        </div>
        { about ? (
          <div className="bg-about flex-none">
            <div id="triangle-up"/>
            <div className="content-about gn-layout direction-column justify-end" style={{paddingBottom:'10%'}}>
              <div 
                  className={`tentang-utc`}>
                <p>{'ⓘ '+about.label}</p>
              </div>
              <div>
                <p>{about.description}</p>
              </div>
            </div>
          </div>
        ) : null }
      </div>
    )

    const content = (
      <div className="content gn-center-container gn-layout align-center direction-column-xs">
        <div className="flex">
          
        </div>
        { about ? (
           <div className="content-about flex-none">
            <SectionLabel label={about.label} inverse={true}/>
            <SectionBody
              subHeadline={about.description}
              action={
                <Icon type="arrow-right" style={{fontSize: 20}}/>
              }
            />
          </div>
        ) : null }
      </div>
    )

    return(
      <div className="utc-banner">
        {bg}
        {/* {content} */}
      </div>
    )
  }
}

export default Banner;