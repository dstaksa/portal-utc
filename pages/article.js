import React from 'react';
import { Header, Article, Navbar, Footbar } from '../components';
import { ResponsiveLayout } from '../libs/gn/components';
import { httpService } from '../libs/gn';
import qs from 'query-string';
import { withI18next } from '../libs/withI18next/withI18next';

class ArticlePage extends React.Component{
  static async getInitialProps({query, req}){
    const { id } = query;
    const lang = req.lang;
    let article = await httpService.get(
      httpService.generateRequestOptions(`/api/article/public/show/${id}?lang=${lang}`)
    )

    let latestArticle = await httpService.get(
      httpService.generateRequestOptions(`/api/article/public/index?${qs.stringify({
        page: 1,
        slug: 'news',
        size: 6,
        lang,
        orderBy: 'datePublished', 
        order: 'desc'
      })}`)
    )

    return {
      article: article.data,
      latestArticle: latestArticle.data,
      staticHost: latestArticle.headers['x-static-host'],
      lang
    }
  }
  render(){
    let { article, latestArticle, staticHost, t, lang } = this.props;
    return(
      <div>
        <Header t={t}/>
        <Navbar
          {...{
            t
          }}
        /> 
        <div className="gn-center-container gn-padding-M padding-top padding-bottom">
          <ResponsiveLayout
            childs={[
              <Article.Article
                {...article}
              />
              // ,
              // <Article.ArticleList
              //   lang={lang}
              //   label={t('common:other.latest')}
              //   className="gn-position position-sticky"
              //   style={{top: 24}}
              //   side={true}
              //   value={latestArticle}
              //   staticHost={staticHost}
              //   t={t}
              // />
            ]}
          />
        </div>
        <Footbar/>
      </div>
    )
  }
}

export default withI18next(['common'])(ArticlePage)