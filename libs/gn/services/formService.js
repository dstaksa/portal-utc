const formService = {
  handleChange: (formData, key, value) => {
    let keys = key.split('.');
    if(keys.length > 1){
      let target = formData[keys[0]];
      target[keys[1]] = value;
    } else {
      formData[key] = value;
    }

    return formData;
  }
}

export default formService;