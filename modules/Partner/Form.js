import React from 'react';
import { ModalWrapper, FormWrapper, FileInputImage, formService } from '../../libs/gn';
import { inject, observer } from 'mobx-react';
import { message, Spin } from 'antd';
import service from './service';
import _ from 'lodash';
import { loremIpsum } from 'lorem-ipsum';

const formId = 'partner-form';

const defaultFormData = () => ({
  title: '',
  description: '',
  caption: '',
  actionLabel: '',
  actionUrl: ''
})

const defaultImage = () => ({
  preview: null,
  file: null
})

class PartnerForm extends React.Component{
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
    const { value } = nextProps;
    if(nextProps.visible && !this.props.visible){
      let formData;
      let isEdit = false;
      if(value && value.id){
        this.fetchData(value.id);
      } else {
        formData = defaultFormData();
        let image = defaultImage();
        this.setState({formData, isEdit, image})
      }
    }
  }

  fetchData = async id => {
    let { image } = this.state;
    this.setState({isLoading: true});
    try{
      let res = await service.getById(id);
      image.preview = res.data.image || image.preview;
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
      let res = await service[isEdit ? 'put' : 'post'](formData, null, image.file);
      this.setState({inProgress: false}, () => {
        onSuccess(res.data, isEdit, res.data.name, 'partner')
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
        title="Formulir Partner"
        onOk={() => FormWrapper.submit(formId)}
        confirmLoading={inProgress || isLoading}
        {...modalProps}
      >
        { isLoading ? <Spin/> : (
          <div>
            <FileInputImage
              src={image.preview}
              onChange={(result) => this.setState({image: result})}
              label="Dimensi yang direkomendasikan 256 x 256"
            />
            <FormWrapper
              baseId={formId}
              onSubmit={this.onSubmit}
              definition={[
                {
                  inputType: 'input',
                  inputLabel: 'Nama',
                  required: true,
                  value: formData.name,
                  maxLength: 64,
                  onChange: e => this.handleChange('name', e.target.value)
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
                  required: true,
                  value: formData.caption,
                  onChange: e => this.handleChange('caption', e.target.value)
                }
              ]}
              onSubmit={this.onSubmit}
            />
          </div>
        )}
      </ModalWrapper>
    )
  }
}

PartnerForm.defaultProps = {
  onSuccess: () => {console.log('onSuccess is not defined')}
}

export default inject('authStore')(observer(PartnerForm));