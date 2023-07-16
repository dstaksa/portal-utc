import React from 'react';
import { ModalWrapper, FormWrapper, formService } from '../../libs/gn';
import { message } from 'antd';
import { inject, observer } from 'mobx-react';
import service from './service';
import _ from 'lodash';

const formId = 'user-form';

const defaultFormData = () => ({
  name: '',
  email: '',
  contact: '',
  username: '',
  roleId: 1,
  password: '',
  confirmPassword: ''
})

class UserForm extends React.Component{
  constructor(){
    super();
    this.state = {
      formData: defaultFormData(),
      isEdit: false,
      inProgress: false
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.visible && !this.props.visible){
      let formData;
      let isEdit = false;
      if(nextProps.value){
        formData = _.cloneDeep(nextProps.value);
        isEdit = true;
      } else {
        formData = defaultFormData();
      }
      
      this.setState({formData, isEdit})
    }
  }

  handleChange = (key, value) => {
    let formData = formService.handleChange(this.state.formData, key, value);
    this.setState({formData});
  }


  onSubmit = async () => {
    let { formData, isEdit } = this.state;
    let { onSuccess } = this.props;
    this.setState({inProgress: true});
    try{
      let res = await service[isEdit ? 'put' : 'post'](formData);
      this.setState({inProgress: false}, () => {
        onSuccess(res.data, isEdit, res.data.name, 'user')
      })
    }catch(error){
      this.setState({inProgress: false});
      message.error(error.message);
    }
  }

  render(){
    let { ...modalProps } = this.props;
    let { formData, inProgress } = this.state;
    return(
      <ModalWrapper
        title="Formulir Resource"
        onOk={() => FormWrapper.submit(formId)}
        confirmLoading={inProgress}
        {...modalProps}
      >
        <FormWrapper
          baseId={formId}
          onSubmit={this.onSubmit}
          definition={[
            {
              inputType: 'input',
              inputLabel: 'Nama',
              required: true,
              value: formData.name,
              onChange: e => this.handleChange('name', e.target.value)
            },
            {
              inputType: 'input',
              inputLabel: 'Username',
              required: true,
              value: formData.username,
              minLength: 6,
              onChange: e => this.handleChange('username', e.target.value.replace(/ /g, '').toLowerCase())
            },
            {
              inputType: 'input',
              inputLabel: 'Email',
              required: true,
              value: formData.email,
              type: 'email',
              onChange: e => this.handleChange('email', e.target.value)
            },
            {
              inputType: 'input',
              inputLabel: 'Kontak',
              required: false,
              value: formData.contact,
              onChange: e => this.handleChange('contact', e.target.value)
            },
            {
              inputType: 'input',
              inputLabel: 'Password',
              required: true,
              type: 'password',
              value: formData.password,
              minLength: 6,
              onChange: e => this.handleChange('password', e.target.value)
            },
            {
              inputType: 'select',
              inputLabel: 'Role',
              required: true,
              value: formData.roleId,
              options: [
                {label: 'SUPER_ADMIN', value: 1},
                {label: 'CONTENT_UPDATER', value: 2}
              ],
              onChange: value => this.handleChange('roleId', value)
            },
          ]}
          onSubmit={this.onSubmit}
        />
      </ModalWrapper>
    )
  }
}

UserForm.defaultProps = {
  onSuccess: () => {console.log('onSuccess is not defined')}
}

export default inject('authStore')(observer(UserForm));