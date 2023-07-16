import React from 'react';
import { FormWrapper, formService, DefaultRestService, ModalWrapper } from '../../libs/gn';
import { Card, Button, message, Spin } from 'antd';

const service = new DefaultRestService(`/api/banner-about`);

class BannerAbout extends React.Component{
  constructor(){
    super();
    this.state = {
      isLoading: true,
      inProgress: false,
      formData: {
        lang: 'id'
      }
    }
  }

  componentDidMount(){
    setTimeout(this.fetchData);
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.visible && !this.props.visible){
      setTimeout(this.fetchData);
    }
  }

  fetchData = async () => {
    let { lang } = this.props;
    try{
      let res = await service.get({lang});
      this.setState({formData: res.data, isLoading: false})
    }catch(error){
      message.error(error.message);
      this.setState({isLoading: false})
    }
  }

  handleChange = (key, value) => {
    let formData = formService.handleChange(this.state.formData, key, value);
    this.setState({formData});
  }

  onSubmit = async () => {
    this.setState({inProgress: true});
    let { formData } = this.state;
    try{
      await service[formData.id ? 'put' : 'post'](formData, null);
      message.info('Banner about berhasil disimpan');
      this.setState({inProgress: false});
    }catch(error){
      message.error(error.message);
      this.setState({inProgress: false});
    }
  }

  render(){
    let { asModal, formId='banner-form', ...modalProps } = this.props;
    let { formData, isLoading, inProgress } = this.state;
    let content = (
      <div>
      { isLoading ? (
            <Spin/>
        ) : (
          <div>
            <FormWrapper
              baseId={`${formId}${asModal ? '-modal' : ''}`}
              onSubmit={this.onSubmit}
              definition={[
                {
                  inputType: 'input',
                  inputLabel: 'Label',
                  required: true,
                  value: formData.label,
                  maxLength: 64,
                  onChange: e => this.handleChange('label', e.target.value)
                },
                {
                  inputType: 'textarea',
                  inputLabel: 'Deskripsi',
                  required: true,
                  value: formData.description,
                  onChange: e => this.handleChange('description', e.target.value)
                },
                {
                  inputType: 'input',
                  inputLabel: 'URL Aksi',
                  required: false,
                  value: formData.actionUrl,
                  onChange: e => this.handleChange('actionUrl', e.target.value)
                },
                {
                  inputType: 'select',
                  inputLabel: 'Lang',
                  required: true,
                  value: formData.lang,
                  disabled: true,
                  options: [
                    {label: 'ID', value: 'id'},
                    {label: 'EN', value: 'en'}
                  ],
                  onChange: value => this.handleChange('lang', value)
                },
              ]}
            />
            { asModal ? null : (
              <div>
                <Button 
                  type="primary"
                  className="gn-margin-S margin-right"
                  loading={inProgress}
                  disabled={inProgress}
                  onClick={this.onSubmit}
                >
                  Simpan
                </Button>
                <Button
                  type="primary"
                  ghost={true}
                  onClick={this.props.onTranslate}
                >
                  Translate
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    )
    return asModal ? (
      <ModalWrapper
        title="Formulir Banner About"
        onOk={() => FormWrapper.submit(`${formId}-modal`)}
        confirmLoading={inProgress || isLoading}
        {...modalProps}
      >
        {content}
      </ModalWrapper>
    ) : (
      <Card title="Banner About" className="gn-margin-N margin-bottom">
        {content}
      </Card>
    )
  }
}

BannerAbout.defaultProps = {
  asModal: false,
  lang: 'id'
}

export default BannerAbout