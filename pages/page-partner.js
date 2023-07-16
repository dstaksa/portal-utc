import React from 'react'
import Head from 'next/head'
import { inject, observer } from 'mobx-react'
import { Header, Navbar, Banner, About, NewsUpdate, OurPartner, UpcomingEvent, Contact, Footbar, Sidemenu} from '../components';
import { ServiceCatalogue } from '../libs/gn/components';
import httpService from '../libs/gn/services/httpService';
import qs from 'query-string';
import 'react-id-swiper/lib/styles/scss/swiper.scss';
import { withI18next } from '../libs/withI18next/withI18next';

const Home = ({
  configStore, banner,  isProduction, bannerAbout, homeHeadline, serviceCatalogueIntro, 
  news, partner, aboutUTCArticle, catalogueFile, mailConf, t,
}) => (
  <div>
    <Head>
      <title></title>
      <link rel='icon' href='/favicon.ico' />
    </Head>
    <Header t={t}/>
   <Navbar
      {...{
        t
      }}
    /> 
    {/* <Banner 
      banner={banner.value}
      staticHost={banner.staticHost}
      about={bannerAbout}
    /> */}
     {/* { homeHeadline ? <About value={homeHeadline}/> : null} */}
    {/* <ServiceCatalogue
      value={serviceCatalogueIntro}
      catalogueFile={catalogueFile}
      t={t}
    /> */}
    {/* { news.value.length > 0 ? (
      <NewsUpdate 
        {...news}
        t={t}
        generateHref={ article => (isProduction 
          ? `/article/${article[configStore.lang === 'id' ? 'id' : 'referenceId']}/${httpService.beautifyUrl(article.title)}`
          : `/article?id=${article[configStore.lang === 'id' ? 'id' : 'referenceId']}&title=${article.title}`
        )}
      /> 
    ) : null } */}
    <OurPartner {...partner} t={t}/>
    {/* <UpcomingEvent t={t}/> */}
    {/* <Contact t={t} mailConf={mailConf}/> */}
   
    {/* <Contact t={t}/> */}

    <Footbar/>
  </div>
)

Home.getInitialProps = async ({mobxStore, req}) => {
  let { lang } = req;
  // let banner = await httpService.get(
  //   httpService.generateRequestOptions(`/api/banner/public/index?lang=${lang}`)
  // )

  // let mailConf = await httpService.get(
  //   httpService.generateRequestOptions(`/api/mail/conf`)
  // )

  // let bannerAbout = await httpService.get(
  //   httpService.generateRequestOptions(`/api/banner-about/public/index?lang=${lang}`)
  // )

  // let homeHeadline = await httpService.get(
  //   httpService.generateRequestOptions(`/api/home-headline/public/index?lang=${lang}`)
  // )

  // let serviceCatalogueIntro = await httpService.get(
  //   httpService.generateRequestOptions(`/api/service-catalogue-intro/public/index?order=desc&orderBy=datePublished&lang=${lang}`)
  // )

  // let news = await httpService.get(
  //   httpService.generateRequestOptions(`/api/article/public/index?${qs.stringify({
  //     order: 'desc',
  //     orderBy: 'datePublished',
  //     slug: 'news',
  //     page: 1,
  //     size: 3,
  //     lang
  //   })}`)
  // )

  // let aboutUTCArticle = await httpService.get(
  //   httpService.generateRequestOptions(`/api/article/public/index?${qs.stringify({
  //     order: 'desc',
  //     orderBy: 'datePublished',
  //     slug: 'about',
  //     size: 1,
  //     lang
  //   })}`)
  // )

  // aboutUTCArticle = aboutUTCArticle.data[0] ? aboutUTCArticle.data[0] : null;

  let partner = await httpService.get(
    httpService.generateRequestOptions(`/api/partner/public/index?${qs.stringify({
      order: 'desc',
      orderBy: 'datePublished',
      lang
    })}`)
  )

  // let catalogueFile = await httpService.get(
  //   httpService.generateRequestOptions(`/api/service-catalogue-file/public/current`)
  // )

  return {
    // aboutUTCArticle: aboutUTCArticle,
    // banner: {
    //   value: banner.data,
    //   staticHost: banner.headers['x-static-host']
    // },
    // bannerAbout: bannerAbout.data,
    // homeHeadline: homeHeadline.data,
    // serviceCatalogueIntro: serviceCatalogueIntro.data,
    // news: {
    //   value: news.data,
    //   staticHost: news.headers['x-static-host']
    // },
    partner: {
      value: partner.data,
      staticHost: partner.headers['x-static-host']
    },
    // catalogueFile: catalogueFile.data
    // mailConf: mailConf.data
  }
}

export default withI18next(['common'])(
  inject('authStore', 'configStore')(observer(Home))
)
