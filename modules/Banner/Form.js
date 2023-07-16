import React from 'react';
import { ModalWrapper, FormWrapper, FileInputImage, formService } from '../../libs/gn';
import { inject, observer } from 'mobx-react';
import { message, Spin } from 'antd';
import service from './service';
import _ from 'lodash';
import { loremIpsum } from 'lorem-ipsum';

const formId = 'banner-form';

const defaultFormData = () => ({
  title: '',
  description: '',
  caption: '',
  actionLabel: '',
  actionUrl: '',
  lang: 'id'
})

const defaultImage = () => ({
  preview: null,
  file: null
})

class BannerForm extends React.Component{
  constructor(){
    super();
    this.state = {
      formData: defaultFormData(),
      isEdit: false,
      inProgress: false,
      isLoading: false,
      image: defaultImage()
    }
  }

  componentWillReceiveProps(nextProps){
    const { value, lang } = nextProps;
    if(nextProps.visible && !this.props.visible){
      let formData;
      let isEdit = false;
      if(value && value.id){
        this.fetchData(value.id, lang);
      } else {
        formData = defaultFormData();
        let image = defaultImage();
        this.setState({formData, isEdit, image})
      }
    }
  }

  fetchData = async (id, lang) => {
    let { image } = this.state;
    this.setState({isLoading: true});
    try{
      let res = await service.getById(id, {lang});
      image.preview = res.data.imageSrc || image.preview;
      this.setState({
        formData: res.data,
        image,
        isEdit: true,
        isLoading: false
      });
    }catch(error){
      message.error(error.message);
      this.props.onCancel();
    }
  }

  handleChange = (key, value) => {
    let formData = formService.handleChange(this.state.formData, key, value);
    this.setState({formData});
  }


  onSubmit = async () => {
    let { formData, isEdit, image } = this.state;
    let { onSuccess } = this.props;
    this.setState({inProgress: true});
    try{
      let res = await service[isEdit && formData.id ? 'put' : 'post'](formData, null, image.file);
      this.setState({inProgress: false}, () => {
        onSuccess(res.data, isEdit, res.data.name, 'banner')
      })
    }catch(error){
      message.error(error.message);
      this.setState({inProgress: false});
    }
  }

  render(){
    let { ...modalProps } = this.props;
    let { formData, inProgress, isLoading, image } = this.state;
    return(
      <ModalWrapper
        title="Formulir Banner"
        onOk={() => FormWrapper.submit(formId)}
        confirmLoading={inProgress || isLoading}
        {...modalProps}
      >
        { isLoading ? <Spin/> : (
          <div>
            <FileInputImage
              src={image.preview}
              onChange={(result) => this.setState({image: result})}
              disabled={formData.lang !== 'id'}
              label="Dimensi yang direkomendasikan 1280 x 768"
            />
            <FormWrapper
              baseId={formId}
              onSubmit={this.onSubmit}
              definition={[
                {
                  inputType: 'textarea',
                  inputLabel: 'Title',
                  required: false,
                  value: formData.title,
                  maxLength: 64,
                  addonAfter:(
                    <div className="gn-font-size-S">{`${formData.title ? formData.title.length : 0}/64`}</div>
                  ),
                  onChange: e => this.handleChange('title', e.target.value)
                },
                {
                  inputType: 'textarea',
                  inputLabel: 'Deskripsi',
                  maxLength: 1000,
                  required: false,
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
                  required: false,
                  value: formData.actionLabel,
                  onChange: e => this.handleChange('actionLabel', e.target.value)
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
              onSubmit={this.onSubmit}
            />
          </div>
        )}
      </ModalWrapper>
    )
  }
}

BannerForm.defaultProps = {
  onSuccess: () => {console.log('onSuccess is not defined')}
}

export default inject('authStore')(observer(BannerForm));