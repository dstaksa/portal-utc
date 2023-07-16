import React from 'react'
import Head from 'next/head'
import { inject, observer } from 'mobx-react'
import { Header, Navbar, Banner, About, NewsUpdate, OurPartner, UpcomingEvent, Contact, Footbar, CPProfile } from '../components';
import { ServiceCatalogue } from '../libs/gn/components';
import httpService from '../libs/gn/services/httpService';
import qs from 'query-string';
import 'react-id-swiper/lib/styles/scss/swiper.scss';
import { withI18next } from '../libs/withI18next/withI18next';

const Home = ({
  configStore, banner,  isProduction, bannerAbout, homeHeadline, serviceCatalogueIntro, 
  news, partner, aboutUTCArticle, catalogueFile, mailConf, t
}) => (
  <div>
    <Head>
      <title>Pertamina Upstream Technical Center</title>
      <link rel='icon' href='/favicon.ico' />
    </Head>
    <Header t={t}/>
    <Navbar
      {...{
        t
      }}
    /> 
    <CPProfile.Nilai t={t}/>
    <Footbar/>
  </div>
)

Home.getInitialProps = async ({mobxStore, req}) => {
  let { lang } = req;

  return {
    
  }
}

export default withI18next(['common'])(
  inject()(observer(Home))
)