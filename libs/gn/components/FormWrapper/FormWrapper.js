import React from 'react';
import { Input, Select, DatePicker } from 'antd';

const InputTypeWrapper = ({inputLabel, inputDescription, children}) => (
  <div className="gn-margin-N margin-bottom">
    { inputLabel ? <h4 className="gn-color-dark-medium">{inputLabel}</h4> : null}
    { inputDescription ? <h5 className="gn-color-dark-low">{inputDescription}</h5> : null}
    {children}
  </div>
)

class FormWrapper extends React.Component{
  onSubmit = e => {
    e.preventDefault();
    e.stopPropagation();
    this.props.onSubmit();
  }

  render(){
    let { baseId, definition } = this.props;
    return(
      <form
        className="gn-modal-wrapper-form"
        onSubmit={this.onSubmit}
      >
        { definition.map((d, i) => {
          let { inputType, options, inputLabel, inputDescription,...componentProps } = d;
          let key = `${baseId}-type-${i}`;
          switch(d.inputType){
            case 'input':
              return (
                <InputTypeWrapper {...{key, inputLabel, inputDescription}}>
                  <Input {...componentProps}/>
                </InputTypeWrapper>
              )
            case 'textarea':
              return (
                <InputTypeWrapper {...{key, inputLabel, inputDescription}}>
                  <Input.TextArea {...componentProps}/>
                </InputTypeWrapper>
              )
            case 'select':
              return(
                <InputTypeWrapper {...{key, inputLabel, inputDescription}}>
                  <Select {...componentProps}>
                    {options.map((opt, oi) => (
                      <Select.Option 
                        key={`${key}-option-${opt.value}-${oi}`}
                        value={opt.value}
                      >
                        {opt.label}
                      </Select.Option>
                    ))}
                  </Select>
                </InputTypeWrapper>
              )
            case 'date-picker':
              return(
                <InputTypeWrapper {...{key, inputLabel, inputDescription}}>
                  <DatePicker
                    showTime={{ format: 'HH:mm' }}
                    format={componentProps.format || "YYYY-MM-DD HH:mm"}
                    placeholder={'Date Published'}
                    defaultValue={componentProps.value}
                    onOk={(val) => componentProps.onChange(val)}
                    {...componentProps}
                  />
                </InputTypeWrapper>
              )
            case 'range-picker':
              return(
                <InputTypeWrapper {...{key, inputLabel, inputDescription}}>
                  <DatePicker.RangePicker
                    showTime={{ format: 'HH:mm' }}
                    format={componentProps.format || "YYYY-MM-DD HH:mm"}
                    placeholder={['Start Time', 'End Time']}
                    defaultValue={componentProps.value}
                    onChange={(value) => {
                      // componentProps.onChange(value)
                    }}
                    onOk={(val) => componentProps.onChange(val)}
                    {...componentProps}
                  />
                </InputTypeWrapper>
              )
            default:
              return null
          }
        })}
        <button type="submit" id={baseId} style={{display: 'none'}}/>
      </form>
    )
  }
}

FormWrapper.submit = (id) => {
  document.getElementById(id).click();
}

FormWrapper.defaultProps = {
  baseId: 'gn-modal-wrapper-form',
  definition:[],
  onSubmit: () => console.log('On submit is not define')
}

export default FormWrapper;