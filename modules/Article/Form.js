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
  slug: 'news',
  location: '',
  publisher: '',
  author: '',
  lang: 'id',
  datePublished: moment()
})

const defaultImage = () => ({
  preview: null,
  file: null
})

class ArticleForm extends React.Component{
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
      res.data.datePublished = moment(res.data.datePublished);
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
    
    let _formData = _.cloneDeep(formData);
    _formData.datePublished = new Date(_formData.datePublished).toISOString();

    try{
      let res = await service[isEdit && formData.id ? 'put' : 'post'](_formData, null, image.file);
      this.setState({inProgress: false}, () => {
        onSuccess(res.data, isEdit, res.data.name, 'artikel')
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
        title="Formulir Artikel"
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
                  inputLabel: 'Caption Gambar',
                  required: false,
                  value: formData.caption,
                  onChange: e => this.handleChange('caption', e.target.value)
                },
                {
                  inputType: 'input',
                  inputLabel: 'Lokasi',
                  required: false,
                  value: formData.location,
                  onChange: e => this.handleChange('location', e.target.value)
                },
                {
                  inputType: 'input',
                  inputLabel: 'Publisher',
                  required: false,
                  value: formData.publisher,
                  disabled: formData.lang === 'en',
                  onChange: e => this.handleChange('publisher', e.target.value)
                },
                {
                  inputType: 'date-picker',
                  inputLabel: 'Waktu Publikasi',
                  required: true,
                  format: 'DD MMMM YYYY hh:mm',
                  disabled: formData.lang === 'en',
                  value: formData.datePublished,
                  onChange: date => {
                    if(date) this.handleChange('datePublished', date);
                  }
                },
                {
                  inputType: 'input',
                  inputLabel: 'Author',
                  required: false,
                  value: formData.author,
                  disabled: formData.lang === 'en',
                  onChange: e => this.handleChange('author', e.target.value)
                },
                {
                  inputType: 'select',
                  inputLabel: 'Slug',
                  required: true,
                  value: formData.slug,
                  disabled: formData.lang === 'en',
                  options: [
                    {label: 'News', value: 'news'},
                    {label: 'About', value: 'about'}
                  ],
                  onChange: value => this.handleChange('slug', value)
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

ArticleForm.defaultProps = {
  onSuccess: () => {console.log('onSuccess is not defined')}
}

export default inject('authStore')(observer(ArticleForm));