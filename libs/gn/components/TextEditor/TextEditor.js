/**
 * Created by dwiargo on 1/2/18.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import './TextEditor.scss';

// const ReactQuill = dynamic(() => import('react-quill'));

const modules = {
  toolbar: [
    [{ 'header': [1, 2, false] }],
    ['bold', 'italic', 'underline','strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image'],
    ['clean']
  ],
}

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image'
]

class TextEditor extends Component{
  constructor(){
    super();
    this.ReactQuill = require('react-quill');
    this.state = {
      val:'',
      onClient: false
    }
  }

  componentDidMount(){
    this.setState({
      val:this.props.value || '',
      onClient: true
    })
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      val:nextProps.value || ''
    })
  }
  onChange = val => {
    this.setState({val:val})
    if(this.props.onChange) this.props.onChange(val);
  }

  render(){
    const ReactQuill = this.ReactQuill;
    let { label, error, errorText, placeholder } = this.props;
    let { val } = this.state;
    return(
      <div className="gn-text-editor">
        <label>{label}</label>
        <ReactQuill
          onChange={this.onChange}
          placeholder={placeholder}
          modules={modules}
          formats={formats}
          value={val}
        />
        {error ? (
          <div className="error-info">{errorText}</div>
        ) : (null)}
      </div>
    )
  }
}

TextEditor.propTypes = {
  label:PropTypes.string,
  value:PropTypes.any,
  placeholder:PropTypes.string,
  onChange:PropTypes.func,
  error:PropTypes.bool,
  errorText:PropTypes.string,
  disabled:PropTypes.bool
};

export default TextEditor;