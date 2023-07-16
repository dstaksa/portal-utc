import { observable, decorate } from 'mobx'; 
import env from '../environment';

class ConfigStore {
  constructor(initialData={isProduction: false, lang: 'id', amsUrl: ''}){
    this.isProduction  = initialData.isProduction;
    this.lang  = initialData.lang;
    this.amsUrl = initialData.amsUrl;
    this.contact = env.contact;
    this.googleRecaptchaSiteKey = env.google.recaptcha.siteKey;
    this.googleRecaptchaActive = env.google.recaptcha.active;
    this.adAuthentication = env.adAuthentication;
    this.useMailServer = env.mail.useMailServer;
  }
}

decorate(ConfigStore, {
  contact: observable,
  googleRecaptchaSiteKey: observable,
  isProduction: observable,
  lang: observable
})

export default ConfigStore;