import React from 'react';
import { ModalWrapper, FormWrapper, FileInputImage, formService } from '../../libs/gn';
import { inject, observer } from 'mobx-react';
import { message, Spin } from 'antd';
import service from './service';
import _ from 'lodash';
import { loremIpsum } from 'lorem-ipsum';
import dynamic from 'next/dynamic';
import moment from 'moment';

const TextEditor = dynamic(() => import('../../libs/gn/components/TextEditor/TextEditor').then())

const formId = 'article-form';

const defaultFormData = () => ({
  caption: '',
  title: '',
  description: '',
  content: '',
  location: '',
  organizer: '',
  dateStart: moment(),
  dateEnd: moment(),
  lang: 'id'
})

const defaultImage = () => ({
  preview: null,
  file: null
})

class EventForm extends React.Component{
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
      let formData = res.data;
      formData.dateStart = moment(formData.dateStart);
      formData.dateEnd = moment(formData.dateEnd);
      this.setState({
        formData,
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
    let _formData = _.cloneDeep(formData);
    _formData.dateStart = _formData.dateStart.format('YYYY-MM-DD HH:mm:ss');
    _formData.dateEnd = _formData.dateEnd.format('YYYY-MM-DD HH:mm:ss');

    let { onSuccess } = this.props;
    this.setState({inProgress: true});
    try{

      let res = await service[isEdit && formData.id ? 'put' : 'post'](_formData, null, image.file);
      this.setState({inProgress: false}, () => {
        onSuccess(res.data, isEdit, res.data.name, 'event')
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
        title="Formulir Event"
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
              label="Dimensi yang direkomendasikan 1024 x 768"
            />
            <FormWrapper
              baseId={formId}
              onSubmit={this.onSubmit}
              definition={[
                {
                  inputType: 'input',
                  inputLabel: 'Title',
                  required: true,
                  value: formData.title,
                  maxLength: 72,
                  addonAfter:(
                    <div className="gn-font-size-S">{`${formData.title.length}/72`}</div>
                  ),
                  onChange: e => this.handleChange('title', e.target.value)
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
                  inputLabel: 'Lokasi',
                  disabled: formData.lang === 'en',
                  required: false,
                  value: formData.location,
                  maxLength: 48,
                  onChange: e => this.handleChange('location', e.target.value)
                },
                {
                  inputType: 'range-picker',
                  inputLabel: 'Waktu',
                  required: false,
                  format: 'DD MMMM YYYY hh:mm',
                  disabled: formData.lang === 'en',
                  value: [formData.dateStart, formData.dateEnd],
                  onChange: dates => {
                    this.handleChange('dateStart', dates[0]);
                    this.handleChange('dateEnd', dates[1]);
                  }
                },
                {
                  inputType: 'input',
                  inputLabel: 'Organizer',
                  disabled: formData.lang === 'en',
                  required: false,
                  value: formData.organizer,
                  onChange: e => this.handleChange('organizer', e.target.value)
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
            <TextEditor
              value={formData.content}
              onChange={value => this.handleChange('content', value)}
            />
          </div>
        )}
      </ModalWrapper>
    )
  }
}

EventForm.defaultProps = {
  onSuccess: () => {console.log('onSuccess is not defined')}
}

export default inject('authStore')(observer(EventForm));