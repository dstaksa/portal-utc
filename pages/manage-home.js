import React from 'react';
import Home from '../modules/Home';
import manage from '../ptemplates/manage';

class ManageHomePage extends React.Component{
  constructor(){
    super();
    this.state = {
      translate:{
        showAbout: false,
        showHeadline: false,
        showServiceCatalogue: false
      }
    }
  }

  onShow = (key, show) => {
    let { translate } = this.state;
    translate[key] = show;
    this.setState({translate});
  }

  render(){
    let { showAbout, showHeadline, showServiceCatalogue } = this.state.translate;
    return(
      <div className="gn-padding-N padding-all gn-scrollable">
        <Home.BannerAbout
          onTranslate={() => this.onShow('showAbout', true)}
        />
        <Home.BannerAbout 
          asModal="true"
          visible={showAbout}
          onCancel={() => this.onShow('showAbout', false)}
          formId="banner-form-en"
          lang="en"
        />     
        <Home.Headline
          onTranslate={() => this.onShow('showHeadline', true)}
        />
        <Home.Headline
          asModal="true"
          visible={showHeadline}
          onCancel={() => this.onShow('showHeadline', false)}
          formId="headline-form-en"
          lang="en"
        />
        <Home.ServiceCatalogueIntro/>
      </div>
    )
  }
}

export default manage(ManageHomePage);