import React from 'react';
import App from 'next/app';
import { initializeStore } from '../config/stores'
import { Provider } from 'mobx-react'
import '../styles/index.less'
import '../libs/gn/styles/gn.sass'
import moment from 'moment'
import { httpService } from '../libs/gn';
import cookies from 'react-cookies';

// const devHost = 'http://localhost:9000';
const devHost = '';
class MyApp extends App {
  static async getInitialProps(appContext) {
    let { req } = appContext.ctx;

    let isProduction = req ? req.isProduction : false;
    let amsUrl = req ? req.amsUrl : '/';
    let lang = req ? req.lang : 'id';
    if(isProduction){
      httpService.setEnv(appContext.ctx.req.envHost);
    }else{
      httpService.setEnv(devHost);
    }

    const mobxStore = initializeStore({
      authStore: {user: isProduction ? appContext.ctx.req.user : {
        username: 'super_admin', 
        name: 'Super Admin', 
        email: 'super@admin.com',
        id: 1
      }},
      configStore: {
        isProduction, 
        lang, 
        amsUrl
      }
    });

    appContext.ctx.mobxStore = mobxStore
    let appProps = await App.getInitialProps(appContext)
    
    return {
      ...appProps,
      isProduction, 
      lang,
      amsUrl,
      initialMobxState: mobxStore
    }
  }

  componentDidMount(){
    let lang = cookies.load('lang');
    if(lang === 'id') {
      require('moment/locale/id');
    }
    if(!this.props.isProduction){
      httpService.setEnv(devHost);
    }
  }

  constructor(props) {
    super(props)
    const isServer = !process.browser;
    
    this.mobxStore = isServer
      ? props.initialMobxState
      : initializeStore(props.initialMobxState)
  }

  render() {
    const {Component, pageProps, isProduction, amsUrl, lang } = this.props;
    return (
      <Provider {...this.mobxStore}>
        <Component {...pageProps} isProduction={isProduction} amsUrl={amsUrl} lang={lang}/>
      </Provider>
    );
  }
}


export default MyApp;
