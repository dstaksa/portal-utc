import axios from 'axios';
import cookies from 'react-cookies';

const errorHandler = response => {  
  if(response.status === 401){
    window.open('/login', '_self'); 
  } else{
    var error = new Error(response);
    error.response = response;
    return Promise.reject(error);
  }
}

const handleError = error => {
  if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      //console.log(error.response.data);
      //console.log(error.response.status);
      //console.log(error.response.headers);
      const responseData = error.response.data;
      error.message = responseData.message || responseData.error || responseData.errmsg || responseData.errorMessage || responseData;
      console.log(error.message);
      if(error.response.status === 401){
        if(!error.response.request.responseURL.match(new RegExp(`.*/auth/local`)))
          window.open('/account-login', '_self');
      }     
      
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      // console.log(error.request);
      error.message = 'Request Error. Check your connection!'//error.statusText
    }

    return error
}

axios.interceptors.request.use(config => {
  config.headers['Authorization'] = `Bearer ${cookies.load('access-token')}`
  return config;
})

// const httpService = {
//   get: options => {
//     let { url, config } = options;
//     return new Promise((resolve, reject) => {
//       axios.get(url, config)
//         .then(response => resolve(response))
//         .catch( error => {
//           let _error = handleError(error);
//           reject(_error)
//         })
//     })
//   },
//   post: options => {
//     let { url, data, config } = options;
//     return new Promise((resolve, reject) => {
//       axios.post(url, data, config)
//         .then(response => resolve(response))
//         .catch( error => {
//           let _error = handleError(error);
//           reject(_error)
//         })
//     })
//   },
//   put: options => {
//     let { url, data, config } = options;
//     return new Promise((resolve, reject) => {
//       axios.put(url, data, config)
//         .then(response => resolve(response))
//         .catch( error => {
//           let _error = handleError(error);
//           reject(_error)
//         })
//     })
//   },
//   delete: options => {
//     let { url, config } = options;
//     return new Promise((resolve, reject) => {
//       axios.delete(url, config)
//         .then(response => resolve(response))
//         .catch( error => {
//           let _error = handleError(error);
//           reject(_error)
//         })
//     })
//   },
//   getBaseUrl:(req) => {
//     const baseUrl = req ? `${req.protocol}://${req.get('Host')}` : '';
//     return baseUrl;
//   },
//   generateRequestOptions:(url, config={headers:{}}, enabledHost=true, useDefaultBaseUrl=true) => {
//     let { host, baseUrl='' } = env;
//     config = [ null, undefined ].indexOf(config) >= 0 ? {headers:{}} : config;
//     return {
//       url:enabledHost ? `${host}${useDefaultBaseUrl ? baseUrl : ''}${url}` : url, 
//       config
//     }
//   },
//   fileToFormData: (file, meta = {}, fileLabel='file', fileName) => {
//     const data = new FormData();
//     data.append(fileLabel, file, fileName || file.name );
//     const keys = Object.keys(meta);
//     for(let i = 0 ; i < keys.length ; i++){
//       const key = keys[i];
//       data.append(key, meta[key]);
//     }
//     return data;
//   },
// }

class HttpService{
  constructor(){
    this.host = '';
    this.baseUrl = '';
  }

  setEnv(host='', baseUrl=''){
    this.host = host;
    this.baseUrl = baseUrl;
  }

  get(options){
    let { url, config } = options;
    return new Promise((resolve, reject) => {
      axios.get(url, config)
        .then(response => resolve(response))
        .catch( error => {
          let _error = handleError(error);
          reject(_error)
        })
    })
  }

  post(options){
    let { url, data, config } = options;
    return new Promise((resolve, reject) => {
      axios.post(url, data, config)
        .then(response => resolve(response))
        .catch( error => {
          let _error = handleError(error);
          reject(_error)
        })
    })
  }

  put(options){
    let { url, data, config } = options;
    return new Promise((resolve, reject) => {
      axios.put(url, data, config)
        .then(response => resolve(response))
        .catch( error => {
          let _error = handleError(error);
          reject(_error)
        })
    })
  }

  delete(options){
    let { url, config } = options;
    return new Promise((resolve, reject) => {
      axios.delete(url, config)
        .then(response => resolve(response))
        .catch( error => {
          let _error = handleError(error);
          reject(_error)
        })
    })
  }

  getBaseUrl(req){
    const baseUrl = req ? `${req.protocol}://${req.get('Host')}` : '';
    return baseUrl;
  }

  generateRequestOptions(url, config={headers:{}}, enabledHost=true, useDefaultBaseUrl=true){
    url = enabledHost ? `${this.host}${useDefaultBaseUrl ? this.baseUrl : ''}${url}` : url;
    console.log(`Generate Request: ${url}`)
    config = [ null, undefined ].indexOf(config) >= 0 ? {headers:{}} : config;
    return {
      url,
      config
    }
  }

  fileToFormData(file, meta = {}, fileLabel='file', fileName){
    const data = new FormData();
    data.append(fileLabel, file, fileName || file.name );
    const keys = Object.keys(meta);
    for(let i = 0 ; i < keys.length ; i++){
      const key = keys[i];
      data.append(key, meta[key]);
    }
    return data;
  }

  beautifyUrl(url){
    return url.replace(/ /g, '-').replace(/\,|\./g, '')
  }
}

let httpService = new HttpService();

export default httpService;