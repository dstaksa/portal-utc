import React from 'react';
import { Header, Footbar,Navbar } from '../components';
import { SectionLabel } from '../components/Section';
import { ArticleList } from '../components/Article';
import { httpService, Pagination } from '../libs/gn';
import { inject , observer } from 'mobx-react';
import qs from 'query-string';
import { withI18next } from '../libs/withI18next/withI18next';

class ArticlesPage extends React.Component{
  static async getInitialProps({req, query, isProduction }){
    try{
      let { lang } = req;
      const { page=1, slug='news', keyword='' } = query;
      const size = 20;
      let reqOptions = httpService.generateRequestOptions(`/api/article/public/index?${qs.stringify({
        page, slug, keyword, column:'title', lang, orderBy: 'datePublished', order: 'desc'
      })}`)
      let res = await httpService.get(reqOptions)

      let total = res.headers['x-pagination-count'];
      
      return {
        articles: res.data,
        staticHost: res.headers['x-static-host'],
        page, slug, total, size, keyword,
        isProduction, lang
      }
    }catch(error){
      console.log(error);
      return {}
    }
  }
  render(){
    let { articles, page, slug, total, size, keyword, isProduction, lang, t=(d) => (d), staticHost } = this.props;
    return(
      <div>
        <Header
          searchKeyword={keyword}
          t={t}
        />
        <Navbar
          {...{
            t
          }}
        /> 
        <div className="gn-center-container gn-padding-M padding-top padding-bottom">
          {/* <SectionLabel 
            label={t('common:other.index')}
            showLine={false}
            parent={[
              {
                label: 'Home',
                url: '/'
              }
            ]}
          /> */}
          <ArticleList
            size="large"
            label={t(`common:other.${slug}`)}
            staticHost={staticHost}
            showSlug={true}
            value={articles}
            isProduction={isProduction}
            lang={lang}
            t={t}
          />
          <Pagination
            {...{page, size, total}}
            hrefOption={{
              base: `/articles`,
              query: {
                page, size, keyword
              }
            }}
          />
        </div>
        <Footbar/>
      </div>
    )
  }
}

export default withI18next(['common'])(
  inject('configStore')(observer(ArticlesPage))
);