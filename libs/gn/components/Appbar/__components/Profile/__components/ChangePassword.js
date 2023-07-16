
import React from 'react';
import { notification, message } from 'antd';
import ModalWrapper from '../../../../ModalWrapper';
import { FormWrapper } from '../../../..';
import { httpService, formService } from '../../../../../services';
import { inject, observer } from 'mobx-react';

const formId = 'change-password-form';
const defaultFormData = () => ({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})
class ChangePassword extends React.Component{
  constructor(){
    super();
    this.state = {
      formData: defaultFormData,
      inProgress: false
    }
  }

  componentWillReceiveProps(nextProps){
    let { visible } = nextProps;
    if(visible && !this.props.visible){
      let formData = defaultFormData()
      this.setState({formData});
    }
  }

  handleChange = (key, value) => {
    let formData = formService.handleChange(this.state.formData, key, value);
    this.setState({formData});
  }

  onSubmit = async() => {
    let { formData } = this.state;
    let { authStore, onCancel } = this.props;
    this.setState({inProgress: true});
    try{
      let options = httpService.generateRequestOptions(`/api/user/${authStore.user.id}/change-password`)
      options.data = formData;
      let res = await httpService.put(options)
      notification.open({
        message: 'Sukses',
        description: 'Ubah password berhasil'
      })
      this.setState({inProgress: false})
      onCancel();
    }catch(error){
      message.error(error.message)
    }
  }

  render(){
    let { formData } = this.state;
    let {...modalProps} = this.props;
    return(
      <ModalWrapper
        title="Ubah Password"
        onOk={() => FormWrapper.submit(formId)}
        {...modalProps}
      >
        <FormWrapper
          baseId={formId}
          onSubmit={this.onSubmit}
          definition={[
            {
              inputType: 'input',
              inputLabel: 'Password Saat Ini',
              required: true,
              type: 'password',
              value: formData.oldPassword,
              onChange: e => this.handleChange('oldPassword', e.target.value)
            },
            {
              inputType: 'input',
              inputLabel: 'Password Baru',
              required: true,
              type: 'password',
              value: formData.newPassword,
              onChange: e => this.handleChange('newPassword', e.target.value)
            },
            {
              inputType: 'input',
              inputLabel: 'Konfirmasi Password',
              required: true,
              type: 'password',
              value: formData.confirmPassword,
              onChange: e => this.handleChange('confirmPassword', e.target.value)
            },
          ]}
        />
      </ModalWrapper>
    )
  }
}

export default inject('authStore')(observer(ChangePassword));