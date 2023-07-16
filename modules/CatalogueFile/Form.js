import React from 'react';
import { ModalWrapper, FormWrapper, formService } from '../../libs/gn';
import { inject, observer } from 'mobx-react';
import { message, Spin, Upload, Button, Icon } from 'antd';
import service from './service';
import _ from 'lodash';
import { loremIpsum } from 'lorem-ipsum';
import Hint from '../../libs/gn/components/Hint/Hint';

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

class CatalogueFileForm extends React.Component{
  constructor(){
    super();
    this.state = {
      formData: defaultFormData(),
      isEdit: false,
      inProgress: false,
      isLoading: false,
      pdf: null,
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

  handleFileChange = (info) => {
    this.setState({pdf: info});
  }


  onSubmit = async () => {
    let { formData, isEdit, pdf } = this.state;
    let { onSuccess } = this.props;
    this.setState({inProgress: true});
    try{
      let res = await service[isEdit ? 'put' : 'post'](formData, null, pdf.file.originFileObj);
      this.setState({inProgress: false}, () => {
        onSuccess(res.data, isEdit, res.data.name, 'file katalog')
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
        title="Formulir File Katalog"
        onOk={() => FormWrapper.submit(formId)}
        confirmLoading={inProgress || isLoading}
        {...modalProps}
      >
        { isLoading ? <Spin/> : (
          <div>
            <div className="gn-layout align-center gn-margin-N margin-bottom">
              <div className="flex-none">
                <Upload
                  name="pdf"
                  listType="text"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={() => {}}
                  onChange={this.handleFileChange}
                  disabled={inProgress}
                  accept=".pdf"
                  customRequest={({file, onSuccess}) => {
                    setTimeout(() => {
                      onSuccess("ok");
                    }, 0);
                  }}
                >
                  <Button>
                    <Icon type="upload" /> Pilih File
                  </Button> 
                </Upload>
              </div>
              { this.state.pdf ? (
                <Hint className="flex">{this.state.pdf.file.name}</Hint>
              ) : null}
            </div>
            <FormWrapper
              baseId={formId}
              onSubmit={this.onSubmit}
              definition={[
                {
                  inputType: 'textarea',
                  inputLabel: 'Deskripsi',
                  required: true,
                  value: formData.description,
                  onChange: e => this.handleChange('description', e.target.value)
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

CatalogueFileForm.defaultProps = {
  onSuccess: () => {console.log('onSuccess is not defined')}
}

export default inject('authStore')(observer(CatalogueFileForm));