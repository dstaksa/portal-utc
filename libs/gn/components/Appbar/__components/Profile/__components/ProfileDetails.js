
import React from 'react';
import { notification, message } from 'antd';
import ModalWrapper from '../../../../ModalWrapper';
import { FormWrapper } from '../../../..';
import { httpService, formService } from '../../../../../services';
import { inject, observer } from 'mobx-react';

const formId = 'profile-details-form';
class ProfileDetails extends React.Component{
  constructor(){
    super();
    this.state = {
      formData: {},
      inProgress: false
    }
  }

  componentWillReceiveProps(nextProps){
    let { visible } = nextProps;
    if(visible && !this.props.visible){
      let formData = _.cloneDeep(this.props.authStore.user);
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
      let options = httpService.generateRequestOptions(`/api/user/${formData.id}`)
      options.data = formData;
      let res = await httpService.put(options)
      notification.open({
        message: 'Sukses',
        description: 'Update profile berhasil'
      })
      authStore.setUser(res.data);
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
        title="Profil"
        onOk={() => FormWrapper.submit(formId)}
        {...modalProps}
      >
        <FormWrapper
          baseId={formId}
          onSubmit={this.onSubmit}
          definition={[
            {
              inputType: 'input',
              inputLabel: 'Username',
              disabled: true,
              value: formData.username,
              onChange: e => this.handleChange('username', e.target.value)
            },
            {
              inputType: 'input',
              inputLabel: 'Nama',
              required: true,
              value: formData.name,
              onChange: e => this.handleChange('name', e.target.value)
            },
            {
              inputType: 'input',
              inputLabel: 'Kontak',
              value: formData.contact,
              onChange: e => this.handleChange('contact', e.target.value)
            },
            {
              inputType: 'input',
              inputLabel: 'Email',
              required: true,
              value: formData.email,
              onChange: e => this.handleChange('email', e.target.value)
            },
            {
              inputType: 'input',
              inputLabel: 'Alamat',
              required: false,
              value: formData.address,
              onChange: e => this.handleChange('address', e.target.value)
            },
          ]}
        />
      </ModalWrapper>
    )
  }
}

export default inject('authStore')(observer(ProfileDetails));