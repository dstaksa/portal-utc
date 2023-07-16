import React from 'react';
import './Contact.less';
import { SectionLabel } from '../Section';
import { Input, Button, Icon, message } from 'antd';
import { httpService } from '../../libs/gn';
import Recaptcha from 'react-google-recaptcha';
import { inject, observer } from 'mobx-react';

let defaultFormData = () => ({
  name: '',
  email: '',
  subject: '',
  message: '',
  recaptchaResponse: ''
})

class Contact extends React.Component{
  constructor(){
    super();
    this.state = {
      onProgress: false,
      formData: defaultFormData()
    }
  }

  handleChange = (key, value) => {
    let { formData } = this.state;
    formData[key] = value;
    this.setState({formData});
  }

  onSubmit = async e => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({onProgress: true});
    try{
      let options = httpService.generateRequestOptions(`/api/mail/send`);
      options.data = this.state.formData;
      let res = await httpService.post(options);
      this.setState({onProgress: false, formData: defaultFormData()});
      if(this.props.configStore.useMailServer){
        message.info('Terima Kasih. Email berhasil dikirim');
      } else {
        window.open(res.data, '_blank');
      }
    }catch(error){
      message.error(error.message);
      this.setState({onProgress: false});
    }
  }

  render(){
    let { formData, onProgress } = this.state;
    let { googleRecaptchaSiteKey, googleRecaptchaActive } = this.props.configStore;
    let { t } = this.props;
    return(
      <div 
        id="utc-contact"
        className="utc-contact gn-padding-L padding-top padding-bottom"
      >
        <SectionLabel 
          style={{textAlign: 'center'}} 
          label={t('common:menu.contact')}
          inverse
        />
        <form className="gn-padding-M padding-all gn-text align-center" style={{textAlign: 'center'}}>
          <span>{t('common:mail.info')}</span>
            <Button 
            type="secondary" 
            htmlType="submit"
            className="gn-margin-N margin-top"
            loading={onProgress}
            disabled={googleRecaptchaActive && !formData.recaptchaResponse}
            > 
            <Icon type="mail"/>
            {t('common:other.submit')}
          </Button>
        </form>
        {/* <form onSubmit={this.onSubmit} className="gn-padding-M padding-all">
          {this.props.configStore.useMailServer ? (
            <div>
              <div className="input-group">
                <label>{t('common:other.name')}</label>
                <Input
                  value={formData.name}
                  onChange={e => this.handleChange('name', e.target.value)}
                  disabled={onProgress}
                />
              </div>
              <div className="input-group">
                <label>{t('common:other.email')}</label>
                <Input
                  value={formData.email}
                  onChange={e => this.handleChange('email', e.target.value)}
                  disabled={onProgress}
                />
              </div>
            </div>
          ) : null }
          <div className="input-group">
            <label>{t('common:other.subject')}</label>
            <Input
              value={formData.subject}
              onChange={e => this.handleChange('subject', e.target.value)}
              disabled={onProgress}
            />
          </div>
          <div className="input-group">
            <label>{t('common:other.message')}</label>
            <Input.TextArea
              value={formData.message}
              onChange={e => this.handleChange('message', e.target.value)}
              disabled={onProgress}
            />
          </div>
          { googleRecaptchaActive ? (
            <Recaptcha
              ref={this.recaptchaRef}
              sitekey={googleRecaptchaSiteKey}
              onChange={value => this.handleChange('recaptchaResponse', value)}
            />
          ) : null}
          <Button 
            type="primary" 
            htmlType="submit"
            className="gn-margin-N margin-top"
            loading={onProgress}
            disabled={googleRecaptchaActive && !formData.recaptchaResponse}
          > 
            <Icon type="mail"/>
            {t('common:other.submit')}
          </Button>
        </form> */}
      </div>
    )
  }
}

export default inject('configStore')(observer(Contact));