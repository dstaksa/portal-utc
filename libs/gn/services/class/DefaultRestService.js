import { httpService } from "..";
import qs from 'query-string';

export default class DefaultRestService{
  constructor(path, defaultConfig=null){
    this.path = path;
    this.config = defaultConfig
  }
  get(params={}, config){
    let newParams = {};
    for(let p of Object.keys(params)){
      if([null, undefined, ''].indexOf(params[p]) < 0)
        newParams[p] = params[p];
    }
    
    let options = httpService.generateRequestOptions(`${this.path}?${qs.stringify(newParams)}`, (config || this.config))
    return httpService.get(options);
  }
  post(data, config, file){
    let options = httpService.generateRequestOptions(this.path, (config || this.config))
    options.data = file ? httpService.fileToFormData(file, data) : data;
    return httpService.post(options);
  };
  getById(id, params={}, config){
    let options = httpService.generateRequestOptions(`${this.path}/${id}?${qs.stringify(params)}`, (config || this.config))
    return httpService.get(options)
  };
  put(data, config, file){
    let options = httpService.generateRequestOptions(`${this.path}/${data.id}`, (config || this.config));
    options.data = file ? httpService.fileToFormData(file, data) : data;
    return httpService.put(options)
  };
  delete(id, config){
    let options = httpService.generateRequestOptions(`${this.path}/${id}`, (config || this.config));
    return httpService.delete(options)
  }
}
