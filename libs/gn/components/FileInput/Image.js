import React from 'react';
import { Upload } from 'antd';
import Hint from '../Hint/Hint';

class FileInputImage extends React.Component{
  constructor(){
    super();
    this.state = {
      preview: null,
      file: null
    }
  }

  beforeUpload = () => {}
  handleChange = (info) => {
    if (info.file.status === 'done') {
      const file = info.file.originFileObj;
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let result = {
          preview: reader.result,
          file
        };
          
        this.setState(result);
        this.props.onChange(result);
      };
    }
  }

  render(){
    let { preview } = this.state;
    let { src, disabled, label } = this.props;

    return(
      <div className="gn-layout">
        <div className="flex-none">
          <Upload
            name="image"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            beforeUpload={this.beforeUpload}
            onChange={this.handleChange}
            disabled={disabled}
            accept="image/*"
            customRequest={({file, onSuccess}) => {
              setTimeout(() => {
                onSuccess("ok");
              }, 0);
            }}
          >
            {preview || src ? (
              <img src={preview || src} alt="avatar" style={{ width: '100%' }} />
            ) : (
              <div>Pilih File</div>
            )}
          </Upload>
        </div>
        <Hint text={label} className="gn-full full-height"/>
      </div>
    )
  }
}

export default FileInputImage;