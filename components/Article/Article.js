import React from 'react';
import { loremIpsum, LoremIpsum } from 'lorem-ipsum';
import renderHTML from 'react-render-html';
import './Article.less';
import moment from 'moment';
import { Share } from '..';
import { SectionLabel } from '../Section';

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

const injectLocation = (rawHtml='', location) => {
  const tags = ['<p', '<div', '<section'];
  const getTopIndex = (htmlArr) => {
    let topIndex = 1;
    for(let n = 1 ; n < htmlArr.length ; n++){
      let arr = htmlArr[n].split('>');
      if(arr.length > 1 && arr[1].length > 0){
        topIndex = n;
        break;
      }
    }

    return topIndex;
  }
  if(location !== null && location !== undefined){
    for(let i = 0 ; i < tags.length ; i++){
      let tag = tags[i];
      let rep = `${tag}<--rep--`;
      let htmlArr = rawHtml.replace(new RegExp(tag, 'g'), rep).split(tag);
      if(htmlArr.length > 1){
        htmlArr[0] = String(htmlArr[0]).replace(/<br \/>/g, '');
        let topIndex = getTopIndex(htmlArr);
        htmlArr[topIndex] = `<--rep--><span><strong>${location}</strong> - <span>${htmlArr[topIndex].replace('<--rep--', '<span')}`;
        let result = String(htmlArr.toString()).replace(/,<--rep--/g, tag)
        return result;
        break;
      } else {
        if(i === tags.length - 1) return rawHtml;
      }
    }
  } else {
    return rawHtml
  }
}

class Article extends React.Component{
  render(){
    const { title, content, imageSrc, caption, slug, author, location, datePublished } = this.props;
    return(
      <div className="utc-article">
        {/* <SectionLabel
          label={`${slug.charAt(0).toUpperCase()}${slug.substr(1, slug.length)}`}
          parent={[
            {
              label: 'Home',
              url: '/'
            }  
          ]}
          showLine={false}
        /> */}
        <center><h1>{title}</h1></center>
        <div className="gn-margin-N marign-top margin-bottom gn-layout align-center justify-between">
          <div className="info-color">
            <div className="gn-font-size-N gn-margin-S margin-bottom">{moment(datePublished).format('lll')} Oleh: {author}</div>
            {/* <div className="author gn-font-size-S"></div> */}
          </div>
          <Share/>
        </div>
        { imageSrc ? (
          <div className="image-headline gn-margin-N margin-bottom">
            <center><img src={imageSrc}/>
            { caption ? 
              <div 
                className="caption gn-padding-S padding-top padding-bottom info-color gn-font-size-NS"
              >
                {caption}
              </div> 
            : null}
            </center>
          </div>
        ) : null}
        <p>{content ? renderHTML(injectLocation(content, location)) : ''}</p>
      </div>
    )
  }
}

Article.defaultProps = {
  title: loremIpsum(),
  description: loremIpsum(),
  content: lorem.generateParagraphs(2),
  image: '/images/bg-contact.jpg',
  caption: loremIpsum(),
  slug: 'news',
  author: 'Jhonny Mahendra',
  publisher: 'utc',
  datePublished: new Date()
}

export default Article;