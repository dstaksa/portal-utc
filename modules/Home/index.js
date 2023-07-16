import Headline from './Headline';
import BannerAbout from './BannerAbout';
import ServiceCatalogueIntro from './ServiceCatalogueIntro';

class Home{
  constructor(){
    this.Headline = Headline;
    this.BannerAbout = BannerAbout;
    this.ServiceCatalogueIntro = ServiceCatalogueIntro;
  }
}

export default new Home();