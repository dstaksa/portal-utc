import React from 'react';
import { ModalWrapper, FormWrapper, formService, DefaultRestService } from '../../libs/gn';
import { Card, Button, message, Spin } from 'antd';
import _ from 'lodash';

const service = new DefaultRestService(`/api/service-catalogue-intro`);

class Item extends React.Component{
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
    let { value } = this.props;
    if(value){
      let formData = _.cloneDeep(value);
      this.setState({formData, isLoading: false});
    }
  }

  componentWillReceiveProps(nextProps){
    let { value } = nextProps;
    if(nextProps.visible && !this.props.visible){
      this.fetchData(value.id);
    }
  }

  fetchData = async (id) => {
    let { lang } = this.props;
    try{
      let res = await service.getById(id, {lang});
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
      message.info('Intro katalog berhasil disimpan');
      this.setState({inProgress: false});
    }catch(error){
      message.error(error.message);
      this.setState({inProgress: false});
    }
  }

  render(){
    let { asModal, formId = 'service-catalogue-form', ...modalProps } = this.props;
    let { formData, inProgress, isLoading } = this.state;

    const content = (
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
                  inputType: 'textarea',
                  inputLabel: 'Judul',
                  required: true,
                  value: formData.title,
                  maxLength: 64,
                  onChange: e => this.handleChange('title', e.target.value)
                },
                {
                  inputType: 'input',
                  inputLabel: 'Pembicara',
                  required: true,
                  value: formData.speaker,
                  onChange: e => this.handleChange('speaker', e.target.value)
                },
                {
                  inputType: 'textarea',
                  inputLabel: 'Deskripsi',
                  minRows: 4,
                  required: true,
                  value: formData.description,
                  onChange: e => this.handleChange('description', e.target.value)
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
        )
      }
      </div>
    )

    return asModal ? (
      <ModalWrapper
        title="Formulir Service Catalogue Intro"
        onOk={() => FormWrapper.submit(`${formId}-modal`)}
        confirmLoading={inProgress || isLoading}
        {...modalProps}
      >
        {content}
      </ModalWrapper>
    ) : (
      content
    )
  }
}

class ServiceCatalogueIntro extends React.Component{
  constructor(){
    super();
    this.state = {
      isLoading: true,
      data: {}
    }
  }

  componentDidMount(){
    setTimeout(this.fetchData);
  }

  fetchData = async () => {
    try{
      let res = await service.get();
      this.setState({data: res.data, isLoading: false})
    }catch(error){
      message.error(error.message);
      this.setState({isLoading: false})
    }
  }

  render(){
    let { data, isLoading } = this.state;
    return(
      <div>
        <Card title="Intro Katalog" className="gn-margin-N margin-bottom">
          { isLoading ? (
              <Spin/>
          ) : (
            <div className="gn-layout direction-column-xs">
              {data.map( d => (
                <div 
                  className="flex gn-padding-S padding-left padding-right"
                  key={`service-catalogue-intro-${d.id}`}
                > 
                  <Item 
                    value={d}
                    formId={`service-catalogue-form-${d.id}`}
                    onTranslate={() => this.setState({
                      selectedItem: d
                    })}
                  />
                </div>
              ))}
            </div>
          )}
        </Card>
        <Item 
          asModal={true}
          visible={this.state.selectedItem ? true : false}
          value={this.state.selectedItem}
          lang="en"
          formId={`service-catalogue-form-en`}
          onCancel={() => this.setState({
            selectedItem: null
          })}
        />
      </div>
    )
  }
}

export default ServiceCatalogueIntro