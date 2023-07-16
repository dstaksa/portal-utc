import React from 'react';
import './NewsUpdate.less';
import { SectionLabel } from '../Section';
import { loremIpsum } from 'lorem-ipsum';
import moment from 'moment';
import { Button, Icon } from 'antd';

class NewsUpdate extends React.Component{
  render(){
    let { value, staticHost, generateHref, t } = this.props;
    return(
      <div 
        id="utc-news-update"
        className="utc-news-update gn-padding-L padding-top"
      >
        <SectionLabel 
          label={t('common:menu.newsUpdate')} 
          style={{textAlign: 'center'}}
        />
        <div className="gn-center-container">
          <div className="gn-layout justify-center gn-padding-N padding-top gn-margin-N margin-bottom direction-column-xs">
            { value.map( d => (
              <div 
                key={`news-item-${d.id}`}
                className="news-item gn-layout direction-column"
              >
                {d.image ? (
                  <img 
                    src={`${staticHost}/${d.image}`} 
                    className="gn-margin-N margin-bottom flex-none"
                  />
                ) : (
                  <div className="default-img gn-margin-N margin-bottom flex-none">
                    <Icon type="picture" style={{fontSize: 32}}/>
                  </div>
                )}
                <div className="gn-layout direction-column flex">
                  <div className="title gn-font-size-MN flex gn-margin-N margin-bottom">
                    <a href={generateHref(d)}>
                      {d.title}
                    </a>
                  </div>
                  <span className="gn-font-size-S">
                    {moment(d.datePublished).fromNow()}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="action gn-padding-N padding-top padding-bottom">
            <a href="/articles">
              <Button type="primary">
                {t('common:other.otherNews')}
              </Button>
            </a>
          </div>
        </div>
      </div>
    )
  }
}

NewsUpdate.defaultProps = {
  value:[
    {
      id: 1,
      title: loremIpsum(),
      description: loremIpsum(),
      image: 'https://images.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
      datePublished: new Date()
    },
    {
      id: 2,
      title: loremIpsum(),
      description: loremIpsum(),
      image: 'https://www.w3schools.com/w3css/img_lights.jpg',
      datePublished: new Date()
    },
    {
      id: 3,
      title: loremIpsum(),
      description: loremIpsum(),
      image: 'https://www.gettyimages.com/gi-resources/images/500px/983794168.jpg',
      datePublished: new Date()
    }
  ]
}

export default NewsUpdate;