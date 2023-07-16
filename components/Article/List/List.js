import React from 'react';
import { loremIpsum, LoremIpsum } from 'lorem-ipsum';
import { SectionLabel } from '../../Section';
import { Icon } from 'antd';
import * as AiIcon from 'antd';
import moment from 'moment';
import './List.less';
import { httpService } from '../../../libs/gn';

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4
  },
  wordsPerSentence: {
    max: 16,
    min: 4
  }
});

class ArticleList extends React.Component{
  render(){
    let { t, label, className="", style={}, value=[], side=false, size='normal', showSlug=false, isProduction=false, staticHost='', lang} = this.props;
    
    const beritaAwal=[]
    beritaAwal[0] = (value ? value[0]:null);
    return(
      <div 
        className={`utc-article-list ${className}}`}
        style={style}>
        <div
          style={{
                    textAlign:"center",

          }}>
          <SectionLabel
            label={label}
          />
        </div >
        {beritaAwal[0]?(
        <table width="100%">
          <tr>
            <td>
              { value.length > 0 ? value.map((d,i) => (

                // console.log(d),

                (true)?(
                <div 
                  className={`list-item gn-layout`} 
                  key={`article-list-item-${d.id}`}>
                  <div className={`image  ${!d.image ? 'no-image' : ''}`}>
                    { d.image ? <img src={`${staticHost}/${d.image}`}/> : (
                      <div className="default-img gn-margin-N margin-bottom ">
                        <Icon type="picture" style={{fontSize: 32}}/> 
                      </div>
                    )}
                  </div>

                  <div className="icon">
                    <div className="icon-padding">
                      <AiIcon.Icon type="calendar" style={{fontSize:'20px',color:'black'}} />
                    </div>  
                    <div className="icon-padding">
                      <AiIcon.Icon type="container" style={{fontSize:'20px',color:'black'}} />
                    </div>  
                  </div>

                  <div className="bag-artikel">
                    <a href={ isProduction ? `/article/${d.referenceId || d.id}/${httpService.beautifyUrl(d.title)}` : `/article?id=${d.referenceId || d.id}`}>
                        <h2 className="title link-on-hover" style={{
                          color: "#022f56",
                        }}>{d.title}</h2>
                      </a>
                    <span className="info-color gn-font-size-NS">
                      {moment(d.datePublished).format('lll')}
                    </span>
                    <div>
                      <span className="gn-font-size-N">
                          {d.description}
                      </span>
                    </div>
                    <div className='gn-layout justify-end'>
                    <AiIcon.Button type="primary"><a href={ isProduction ? `/article/${d.referenceId || d.id}/${httpService.beautifyUrl(d.title)}` : `/article?id=${d.referenceId || d.id}`}>
                        Read More
                      </a></AiIcon.Button>
                  </div>
                  
                  </div>
                </div>
                ):""
              )) : <p>{t('common:article.noData')}</p>}
            </td>
          </tr>
        </table>):(<div style={{
                    textAlign:"center"
          }}>
          <SectionLabel
          label={t('common:article.noData')}
          showLine={false}
          />
        </div>)}
      </div>
    )
  }
}

export default ArticleList;