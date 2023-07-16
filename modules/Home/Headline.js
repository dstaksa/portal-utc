import React from 'react';
import { httpService, FormWrapper, FileInputImage, formService, DefaultRestService, ModalWrapper } from '../../libs/gn';
import { Card, Button, message, Spin } from 'antd';

const service = new DefaultRestService(`/api/home-headline`);

class Headline extends React.Component{
  constructor(){
    super();
    this.state = {
      isLoading: true,
      inProgress: false,
      formData: {},
      image: {
        preview: null,
        file: null
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
    let { image } = this.state;
    try{
      let res = await service.get({lang});
      image.preview = res.data.image || image.preview;
      this.setState({formData: res.data, isLoading: false, image})
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
    let { formData, image } = this.state;
    try{
      await service[formData.id ? 'put' : 'post'](formData, null, image.file);
      message.info('Headline berhasil disimpan');
      this.setState({inProgress: false});
    }catch(error){
      message.error(error.message);
      this.setState({inProgress: false});
    }
  }

  render(){
    let { asModal, lang, formId='headline-form', ...modalProps } = this.props;
    let { formData, image, isLoading, inProgress } = this.state;
    let content = (
      <div>
        { isLoading ? (
            <Spin/>
        ) : (
          <div>
            <FileInputImage
              src={image.preview}
              onChange={(result) => this.setState({image: result})}
              disabled={lang !== 'id'}
            />
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
                  inputLabel: 'Caption Gambar',
                  required: false,
                  value: formData.caption,
                  onChange: e => this.handleChange('caption', e.target.value)
                },
                {
                  inputType: 'input',
                  inputLabel: 'Label Aksi',
                  required: true,
                  value: formData.actionLabel,
                  onChange: e => this.handleChange('actionLabel', e.target.value)
                },
                {
                  inputType: 'input',
                  inputLabel: 'URL Aksi',
                  required: true,
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
    return( asModal ? (
      <ModalWrapper
        title="Formulir Headline"
        onOk={() => FormWrapper.submit(`${formId}-modal`)}
        confirmLoading={inProgress || isLoading}
        {...modalProps}
      >
        {content}
      </ModalWrapper>
    ) : (
      <Card title="Home Headline" className="gn-margin-N margin-bottom">
        {content}
      </Card>
    ))
  }
}

Headline.defaultProps = {
  asModal: false,
  lang: 'id'
}

export default Headline