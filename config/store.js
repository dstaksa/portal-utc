import { decorate, action, observable } from 'mobx';
import { useStaticRendering } from 'mobx-react';
import moment from 'moment';

const isServer = !process.browser
useStaticRendering(isServer)
let store = null

class Store {
  constructor(initialData={}){
    this.timestamp = moment().format('ll');
    this.user = initialData.user;
  }
  
  set(key, value){
    this[key] = value
  }
}

decorate(Store,{
  timestamp: observable,
  config: observable,
  set: action
})

export function initializeStore(initialData) {
  if (isServer) {
    return new Store(initialData)
  }
  if (store === null) {
    store = new Store(initialData)
  }
  return store
}